<script setup lang="ts">
import { computed, onMounted, ref, toRef, watch } from 'vue'
import { useMonthsByLang } from '../composables/useMonthsByLang'
import type { IDateResult } from '../interfaces'

// ─── Props ────────────────────────────────────────────────────────────────────

const props = withDefaults(
  defineProps<{
    lang?: string
    months?: string[] | null
    defaultMonth?: number | null
    defaultYear?: number | null
    showYear?: boolean
    editableYear?: boolean
    yearOnly?: boolean
    noDefault?: boolean
    clearable?: boolean
    minDate?: Date | null
    maxDate?: Date | null
    range?: boolean
    defaultMonthRange?: [number, number] | null
    variant?: 'default' | 'dark'
    highlightExactDate?: boolean
  }>(),
  {
    lang: 'en',
    months: null,
    defaultMonth: null,
    defaultYear: null,
    showYear: true,
    editableYear: false,
    yearOnly: false,
    noDefault: false,
    clearable: false,
    minDate: null,
    maxDate: null,
    range: false,
    defaultMonthRange: null,
    variant: 'default',
    highlightExactDate: false,
  }
)

// ─── Emits ────────────────────────────────────────────────────────────────────

const emit = defineEmits<{
  (e: 'change', date: IDateResult): void
  (e: 'input', date: IDateResult): void
  (e: 'clear'): void
  (e: 'change-year', year: number): void
}>()

// ─── State ────────────────────────────────────────────────────────────────────

const now = new Date()
const year = ref<number>(now.getFullYear())
const selectedYear = ref<number>(now.getFullYear())
const currentMonthIndex = ref<number | null>(null)
const firstRangeMonthIndex = ref<number | null>(null)
const secondRangeMonthIndex = ref<number | null>(null)

// ─── Composables ──────────────────────────────────────────────────────────────

const monthsByLang = useMonthsByLang(toRef(props, 'lang'), toRef(props, 'months'))

// ─── Computed ─────────────────────────────────────────────────────────────────

/**
 * Build the IDateResult for the current selection. Returns null when nothing is
 * selected (noDefault / cleared) so callers can skip emitting.
 */
const date = computed<IDateResult | null>(() => {
  // Nothing selected yet — return null so we don't emit garbage dates.
  if (currentMonthIndex.value === null && !props.range) {
    return null
  }

  // 1-based month number
  const monthIndex1 = currentMonthIndex.value !== null ? currentMonthIndex.value + 1 : 1
  const dateFrom = new Date(year.value, monthIndex1 - 1, 1)
  const dateTo = new Date(year.value, monthIndex1, 1)

  const dateResult: IDateResult = {
    from: dateFrom,
    to: dateTo,
    month: monthsByLang.value[monthIndex1 - 1] ?? '',
    monthIndex: monthIndex1,
    year: year.value,
  }

  if (props.range) {
    dateResult.rangeFrom = firstRangeMonthIndex.value ?? undefined
    dateResult.rangeTo = secondRangeMonthIndex.value ?? undefined
    dateResult.rangeFromMonth =
      firstRangeMonthIndex.value !== null
        ? monthsByLang.value[firstRangeMonthIndex.value]
        : undefined
    dateResult.rangeToMonth =
      secondRangeMonthIndex.value !== null
        ? monthsByLang.value[secondRangeMonthIndex.value]
        : undefined
  }

  return dateResult
})

// ─── Methods ──────────────────────────────────────────────────────────────────

/**
 * Returns true when `month` (0-based index or month name string) falls outside
 * the [minDate, maxDate] window. Handles null AND undefined for both bounds.
 */
const isInactive = (month: number | string): boolean => {
  const min = props.minDate ?? null
  const max = props.maxDate ?? null
  if (min === null && max === null) return false

  const monthName =
    typeof month === 'number' ? monthsByLang.value[month] : month

  if (!monthName) return false

  const monthKey = monthsByLang.value.indexOf(monthName) + 1
  const d = new Date(year.value, monthKey - 1, 1)

  if (min instanceof Date && d < min) return true
  if (max instanceof Date && d > max) return true

  return false
}

const isInSelectedRange = (monthIndex: number): boolean => {
  if (!props.range) return false
  if (firstRangeMonthIndex.value === null) return false

  if (secondRangeMonthIndex.value === null) {
    return monthIndex === firstRangeMonthIndex.value
  }

  return (
    monthIndex >= firstRangeMonthIndex.value &&
    monthIndex <= secondRangeMonthIndex.value
  )
}

const isRangeFirst = (monthIndex: number): boolean =>
  props.range && monthIndex === firstRangeMonthIndex.value

const isRangeSecond = (monthIndex: number): boolean =>
  props.range && monthIndex === secondRangeMonthIndex.value

const onChange = () => {
  if (!Number.parseInt(String(year.value))) {
    year.value = props.defaultYear ?? now.getFullYear()
  }
  if (date.value !== null) {
    emit('change', date.value)
  }
}

const selectMonthRange = (index: number, input: boolean) => {
  // Both already set → reset and start a new selection
  if (firstRangeMonthIndex.value !== null && secondRangeMonthIndex.value !== null) {
    firstRangeMonthIndex.value = index
    secondRangeMonthIndex.value = null
    return
  }

  // Nothing set yet → set first anchor
  if (firstRangeMonthIndex.value === null) {
    firstRangeMonthIndex.value = index
    return
  }

  // First is set, second is not
  if (index >= firstRangeMonthIndex.value) {
    secondRangeMonthIndex.value = index
    onChange()
    if (input && date.value !== null) {
      emit('input', date.value)
    }
    return
  }

  // Clicked before the first anchor → move the anchor
  firstRangeMonthIndex.value = index
}

const selectMonth = (index: number, input = false) => {
  if (isInactive(index)) return

  if (props.range) {
    selectMonthRange(index, input)
    return
  }

  const alreadySelected = currentMonthIndex.value === index
  if (props.clearable && alreadySelected) {
    currentMonthIndex.value = null
    emit('clear')
    return
  }

  if (alreadySelected) return

  currentMonthIndex.value = index
  selectedYear.value = year.value
  onChange()

  if (input && date.value !== null) {
    emit('input', date.value)
  }
}

const changeYear = (delta: number) => {
  year.value += delta

  // Only re-emit if the currently-selected month isn't now out of range.
  // We check the selected month index, not the ±1 delta.
  if (currentMonthIndex.value !== null && isInactive(currentMonthIndex.value)) {
    return
  }

  onChange()
  emit('change-year', year.value)
}

const setDefaultMonthRange = () => {
  if (!props.defaultMonthRange || props.defaultMonthRange.length !== 2) return
  const [first, second] = props.defaultMonthRange
  if (second <= first) return
  firstRangeMonthIndex.value = first
  secondRangeMonthIndex.value = second
}

// ─── Lifecycle ────────────────────────────────────────────────────────────────

onMounted(() => {
  if (props.range) {
    setDefaultMonthRange()
  }
})

// ─── Watchers ─────────────────────────────────────────────────────────────────

/**
 * Watch defaultYear and defaultMonth together with immediate:true so that the
 * initial year/month are applied even when the parent passes a variable that
 * isn't resolved until after the first render tick (the common cause of all
 * months appearing inactive when minDate is set).
 */
watch(
  () => [props.defaultYear, props.defaultMonth] as const,
  ([newYear, newMonth]) => {
    if (newYear != null) {
      year.value = newYear
      selectedYear.value = newYear
    }

    if (props.range) return

    if (newMonth != null) {
      selectMonth(newMonth - 1)
    } else if (!props.noDefault && currentMonthIndex.value === null) {
      selectMonth(0)
    }
  },
  { immediate: true }
)

// ─── Expose ───────────────────────────────────────────────────────────────────

defineExpose({ selectMonth, monthsByLang })
</script>

<template>
  <div
    class="month-picker__container"
    :class="{
      [`month-picker--${props.variant}`]: true,
      'year-picker': props.yearOnly,
    }"
  >
    <div v-if="props.showYear" class="month-picker__year">
      <button type="button" @click="changeYear(-1)">&lsaquo;</button>
      <p v-if="!props.editableYear">{{ year }}</p>
      <input
        v-else
        v-model.number="year"
        type="text"
        @change="onChange()"
      />
      <button type="button" @click="changeYear(+1)">&rsaquo;</button>
    </div>

    <div v-if="!props.yearOnly" class="month-picker">
      <div
        v-for="(month, monthIndex) in monthsByLang"
        :key="month"
        class="month-picker__month"
        :class="{
          inactive: isInactive(monthIndex),
          clearable: props.clearable,
          selected:
            !props.range &&
            (
              (props.highlightExactDate && props.showYear
                ? currentMonthIndex === monthIndex && year === selectedYear
                : currentMonthIndex === monthIndex)
            ),
          'selected-range': isInSelectedRange(monthIndex),
          'selected-range-first': isRangeFirst(monthIndex),
          'selected-range-second': isRangeSecond(monthIndex),
        }"
        @click="selectMonth(monthIndex, true)"
      >
        <span>{{ month }}</span>
      </div>
    </div>
  </div>
</template>

<style>
/* ─── Container ────────────────────────────────────────────────────────────── */

.month-picker__container {
  width: 400px;
  position: relative;
  border-radius: 5px;
  overflow: hidden;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.1), inset 0 -1px 0 rgba(0, 0, 0, 0.1);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.month-picker__container.year-picker {
  width: 20rem;
}

/* ─── Year header ───────────────────────────────────────────────────────────── */

.month-picker__year {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #fcfcfc;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.1), inset 0 -1px 0 rgba(0, 0, 0, 0.1);
  padding: 0.2rem;
  position: relative;
  min-height: 3.75rem;
}

.month-picker__year p {
  flex: 1;
  font-weight: 600;
  font-size: 1.2rem;
  letter-spacing: 1px;
  margin: 1rem 0;
  text-align: center;
  color: #333;
}

.month-picker__year input {
  flex: 1;
  padding: 0;
  font-weight: 600;
  font-size: 1.2rem;
  border-radius: 5px 5px 0 0;
  outline: none;
  border: none;
  text-align: center;
  box-sizing: border-box;
  width: 100%;
  height: 3.5rem;
  background-color: transparent;
  color: #333;
  position: relative;
  z-index: 1;
}

.month-picker__year input:focus {
  border: 1px solid #55b0f2;
}

.month-picker__year button {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f4f4f4;
  position: absolute;
  width: 5rem;
  height: 2.75rem;
  font-size: 2rem;
  border-radius: 5px;
  outline: none;
  top: 0.5rem;
  border: 1px solid #e8e8e8;
  z-index: 2;
  color: #686868;
  cursor: pointer;
  line-height: 1;
  transition: background-color 150ms ease;
}

.month-picker__year button:first-child {
  left: 10px;
}

.month-picker__year button:last-child {
  right: 10px;
}

.month-picker__year button:hover {
  background-color: rgba(0, 0, 0, 0.025);
}

.month-picker__year button:active {
  background-color: rgba(0, 0, 0, 0.04);
}

/* ─── Month grid ────────────────────────────────────────────────────────────── */

.month-picker {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  box-shadow: 1px 2px 5px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  overflow: hidden;
}

/* Each cell is a flex container so the inner span can be positioned separately
   from the range background strip. */
.month-picker__month {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-basis: calc(33.333% - 10px);
  padding: 0.75rem 0.25rem;
  cursor: pointer;
  text-align: center;
  border: 1px solid rgba(245, 245, 245, 0.75);
  background-color: #fefefe;
  user-select: none;
  font-size: 0.875rem;
  font-weight: 500;
  color: #222;
  transition: all 0.25s cubic-bezier(0.165, 0.84, 0.44, 1);
  overflow: hidden;
}

/* The label sits above the range strip */
.month-picker__month span {
  position: relative;
  z-index: 1;
}

/* Hover: subtle lift shadow, faithful to original :after trick but cleaner */
.month-picker__month:not(.inactive):not(.selected):not(.selected-range-first):not(.selected-range-second):hover {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

/* Active press */
.month-picker__month:not(.inactive):active {
  background-color: rgba(85, 176, 242, 0.15);
}

/* Selected (non-range) — border-radius + inset shadow + text-shadow, original */
.month-picker__month.selected {
  background-color: #55b0f2;
  color: #fff;
  border-radius: 5px;
  box-shadow: inset 0 0 3px #3490d2, 0 2px 5px rgba(85, 176, 242, 0.2);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.25);
  border-color: transparent;
}

/* ─── Range styles ──────────────────────────────────────────────────────────── */

/*
 * Interior range cells: a full-width tinted band via ::before so the cell
 * border is overridden but the grid gaps don't break the visual strip.
 */
.month-picker__month.selected-range {
  color: #1565c0;
  border-color: transparent;
  background-color: transparent;
  font-weight: 600;
  transition: color 0.2s ease;
}

.month-picker__month.selected-range::before {
  content: '';
  position: absolute;
  inset: 0;
  background-color: rgba(85, 176, 242, 0.18);
  transition: background-color 0.2s ease;
  z-index: 0;
}

/* Interior hover — strip brightens, text deepens */
.month-picker__month.selected-range:not(.selected-range-first):not(.selected-range-second):hover::before {
  background-color: rgba(85, 176, 242, 0.32);
}
.month-picker__month.selected-range:not(.selected-range-first):not(.selected-range-second):hover {
  color: #0d47a1;
  box-shadow: none;
}

/*
 * Endpoints: pill shape — rounded only on the outside edge, flat on the inner
 * side so the band reads as a continuous strip.
 * ::before draws the interior half-strip; ::after draws the pill itself.
 */
.month-picker__month.selected-range-first,
.month-picker__month.selected-range-second {
  color: #fff;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  border-color: transparent;
  background-color: transparent;
  transition: color 0.2s ease, transform 0.15s ease;
  overflow: visible;
}

/* Half-strip connecting endpoint to interior */
.month-picker__month.selected-range-first::before,
.month-picker__month.selected-range-second::before {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  background-color: rgba(85, 176, 242, 0.18);
  z-index: 0;
  transition: background-color 0.2s ease;
}
.month-picker__month.selected-range-first::before { left: 50%; right: 0; }
.month-picker__month.selected-range-second::before { left: 0; right: 50%; }

/* Hide strip when first === second (single-cell range) */
.month-picker__month.selected-range-first.selected-range-second::before {
  display: none;
}

/* The pill itself sits on ::after, z-index above the strip */
.month-picker__month.selected-range-first::after,
.month-picker__month.selected-range-second::after {
  content: '';
  position: absolute;
  inset: 10% 8%;
  background: linear-gradient(135deg, #55b0f2 0%, #3d9de8 100%);
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(85, 176, 242, 0.45), inset 0 1px 0 rgba(255,255,255,0.25);
  z-index: 0;
  transition: box-shadow 0.2s ease, transform 0.15s ease;
}

/* span label above both ::before and ::after */
.month-picker__month.selected-range-first span,
.month-picker__month.selected-range-second span {
  position: relative;
  z-index: 1;
}

/* Endpoint hover — pill glows and lifts slightly */
.month-picker__month.selected-range-first:not(.selected-range-second):hover::after,
.month-picker__month.selected-range-second:not(.selected-range-first):hover::after {
  box-shadow: 0 4px 14px rgba(85, 176, 242, 0.65), inset 0 1px 0 rgba(255,255,255,0.3);
  transform: scaleY(1.06);
}
.month-picker__month.selected-range-first:not(.selected-range-second):hover::before,
.month-picker__month.selected-range-second:not(.selected-range-first):hover::before {
  background-color: rgba(85, 176, 242, 0.28);
}

/* Single-cell: full pill, no strip */
.month-picker__month.selected-range-first.selected-range-second::after {
  inset: 10% 8%;
  border-radius: 6px;
}

/* Inactive — filled bg like original */
.month-picker__month.inactive {
  background-color: #f0f0f0;
  color: #8a8a8a;
  cursor: not-allowed;
  box-shadow: none;
  text-shadow: none;
}
.month-picker__month.inactive:hover {
  box-shadow: none;
}

/* ─── Dark theme ────────────────────────────────────────────────────────────── */

.month-picker--dark {
  background-color: #5f5f5f;
}

.month-picker--dark .month-picker__year {
  background-color: #2f2f30;
}

.month-picker--dark .month-picker__year p,
.month-picker--dark .month-picker__year input {
  color: #ebebeb;
}

.month-picker--dark .month-picker__year input {
  background-color: #5f5f5f;
}

.month-picker--dark .month-picker__year button {
  background-color: #505050;
  color: #c9c9c9;
  border-color: #1e1e1e;
}

.month-picker--dark .month-picker__year button:hover {
  background-color: rgba(0, 0, 0, 0.3);
}

.month-picker--dark .month-picker__year button:active {
  background-color: rgba(0, 0, 0, 0.6);
}

.month-picker--dark .month-picker__month {
  background-color: #2f2f30;
  border-color: rgba(245, 245, 245, 0.15);
  color: #c9c9c9;
}

/* Dark hover: box-shadow lift like original */
.month-picker--dark .month-picker__month:not(.inactive):not(.selected):not(.selected-range-first):not(.selected-range-second):hover {
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.8);
  z-index: 10;
}

.month-picker--dark .month-picker__month:not(.inactive):active {
  background-color: rgba(85, 176, 242, 0.2);
}

/* Dark selected — gray like original, NOT blue */
.month-picker--dark .month-picker__month.selected {
  background-color: #505050;
  box-shadow: inset 0 0 3px #505050, 0 2px 5px #505050;
  color: #fff;
  border-color: #1d1b1b;
}

/* Dark range endpoints */
.month-picker--dark .month-picker__month.selected-range-first,
.month-picker--dark .month-picker__month.selected-range-second {
  color: #fff;
  background-color: transparent;
  border-color: transparent;
}

.month-picker--dark .month-picker__month.selected-range-first::after,
.month-picker--dark .month-picker__month.selected-range-second::after {
  background: linear-gradient(135deg, #4a9fd4 0%, #3580b0 100%);
  box-shadow: 0 2px 8px rgba(61, 143, 196, 0.5), inset 0 1px 0 rgba(255,255,255,0.15);
}

.month-picker--dark .month-picker__month.selected-range-first:not(.selected-range-second):hover::after,
.month-picker--dark .month-picker__month.selected-range-second:not(.selected-range-first):hover::after {
  box-shadow: 0 4px 14px rgba(61, 143, 196, 0.7), inset 0 1px 0 rgba(255,255,255,0.2);
}

/* Dark interior range */
.month-picker--dark .month-picker__month.selected-range {
  color: #a8d8f8;
  background-color: transparent;
  border-color: transparent;
}

.month-picker--dark .month-picker__month.selected-range::before,
.month-picker--dark .month-picker__month.selected-range-first::before,
.month-picker--dark .month-picker__month.selected-range-second::before {
  background-color: rgba(85, 176, 242, 0.15);
}

.month-picker--dark .month-picker__month.selected-range:not(.selected-range-first):not(.selected-range-second):hover::before {
  background-color: rgba(85, 176, 242, 0.28);
}

.month-picker--dark .month-picker__month.selected-range:not(.selected-range-first):not(.selected-range-second):hover {
  color: #d0eeff;
  box-shadow: none;
}

.month-picker--dark .month-picker__month.selected-range-first:not(.selected-range-second):hover::before,
.month-picker--dark .month-picker__month.selected-range-second:not(.selected-range-first):hover::before {
  background-color: rgba(85, 176, 242, 0.25);
}

/* Dark inactive */
.month-picker--dark .month-picker__month.inactive {
  background-color: #3f3f3f;
  color: #8a8a8a;
  cursor: not-allowed;
  box-shadow: none;
  text-shadow: none;
}

.month-picker--dark .month-picker__month.inactive:hover {
  box-shadow: none;
}

/* ─── Responsive ────────────────────────────────────────────────────────────── */

@media only screen and (max-width: 768px) {
  .month-picker__container {
    width: 100%;
  }
}
</style>
