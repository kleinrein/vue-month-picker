<script setup lang="ts">
import { ref, toRef, watch } from 'vue'
import type { Directive } from 'vue'
import MonthPicker from './MonthPicker.vue'
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
    inputPreFilled?: boolean
    range?: boolean
    defaultMonthRange?: [number, number] | null
    variant?: 'default' | 'dark'
    dateFormat?: string
    highlightExactDate?: boolean
    placeholder?: string | null
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
    inputPreFilled: false,
    range: false,
    defaultMonthRange: null,
    variant: 'default',
    dateFormat: '%n, %Y',
    highlightExactDate: false,
    placeholder: null,
  }
)

// ─── Emits ────────────────────────────────────────────────────────────────────

const emit = defineEmits<{
  (e: 'change', date: IDateResult): void
  (e: 'input', date: IDateResult): void
  (e: 'change-year', year: number): void
}>()

// ─── State ────────────────────────────────────────────────────────────────────

const monthPickerVisible = ref(false)
const selectedDate = ref<string | null>(null)

// ─── Composables ──────────────────────────────────────────────────────────────

const monthsByLang = useMonthsByLang(toRef(props, 'lang'), toRef(props, 'months'))

// ─── Methods ──────────────────────────────────────────────────────────────────

const formatDate = (date: IDateResult): string => {
  if (props.range) {
    return `${date.rangeFromMonth} - ${date.rangeToMonth}, ${date.year}`
  }
  const pad = (n: number) => String(n).padStart(2, '0')
  return props.dateFormat
    .replace('%n', date.month)                          // Full month name  → January
    .replace('%m', pad(date.monthIndex))                // Zero-padded number → 01
    .replace('%M', String(date.monthIndex))             // Unpadded number  → 1
    .replace('%Y', String(date.year))                   // 4-digit year     → 2024
    .replace('%y', String(date.year).slice(-2))         // 2-digit year     → 24
}

const populateInput = (date: IDateResult) => {
  selectedDate.value = formatDate(date)
  monthPickerVisible.value = false
  emit('input', date)
}

// @change fires on year navigation too — only forward it, never touch selectedDate here.
const forwardChange = (date: IDateResult) => {
  emit('change', date)
}

const showMonthPicker = () => {
  monthPickerVisible.value = !monthPickerVisible.value
}

const hide = () => {
  monthPickerVisible.value = false
}

// ─── inputPreFilled — watch both props together to avoid partial-state flicker ─

watch(
  () => [props.defaultYear, props.defaultMonth] as const,
  ([year, month]) => {
    if (!props.inputPreFilled || !year || !month) return
    selectedDate.value = formatDate({
      from: new Date(year, month - 1, 1),
      to: new Date(year, month, 0),
      month: monthsByLang.value[month - 1],
      monthIndex: month,
      year,
    })
  },
  { immediate: true }
)

// ─── v-click-outside directive (Vue 3) ───────────────────────────────────────

interface ClickOutsideEl extends HTMLElement {
  _clickOutsideHandler?: (event: Event) => void
}

const vClickOutside: Directive<ClickOutsideEl, () => void> = {
  beforeMount(el, binding) {
    el._clickOutsideHandler = (event: Event) => {
      if (!el.contains(event.target as Node)) {
        binding.value()
      }
    }
    document.addEventListener('click', el._clickOutsideHandler)
  },
  unmounted(el) {
    if (el._clickOutsideHandler) {
      document.removeEventListener('click', el._clickOutsideHandler)
    }
  },
}
</script>

<template>
  <div v-click-outside="hide" class="month-picker-input-container">
    <input
      v-model="selectedDate"
      class="month-picker-input"
      type="text"
      :placeholder="placeholder ?? undefined"
      readonly
      @click="showMonthPicker()"
    />
    <MonthPicker
      v-show="monthPickerVisible"
      :default-year="defaultYear"
      :default-month="defaultMonth"
      :lang="lang"
      :months="months"
      :no-default="noDefault"
      :show-year="showYear"
      :highlight-exact-date="highlightExactDate"
      :clearable="clearable"
      :variant="variant"
      :editable-year="editableYear"
      :max-date="maxDate"
      :min-date="minDate"
      :year-only="yearOnly"
      :range="range"
      :default-month-range="defaultMonthRange"
      @input="populateInput"
      @change="forwardChange"
      @change-year="(y) => emit('change-year', y)"
    />
  </div>
</template>

<style scoped>
.month-picker-input-container {
  position: relative;
  width: 180px;
  min-width: 140px;
}

.month-picker-input {
  padding: 1em 1.5em;
  font-size: 0.85em;
  border-radius: 5px;
  outline: none;
  border: 1px solid rgba(0, 0, 0, 0.15);
  transition: all 350ms cubic-bezier(0.165, 0.84, 0.44, 1);
  cursor: pointer;
  width: 100%;
  box-sizing: border-box;
}

.month-picker-input:focus {
  border-color: rgba(0, 0, 0, 0.25);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.month-picker__container {
  position: absolute;
  top: 3.5em;
  z-index: 100;
}
</style>
