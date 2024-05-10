<script setup lang="ts">
import { computed, ref } from 'vue'
import { monthPickerProps } from '../month-picker'

const now = new Date()

const props = withDefaults(defineProps(), monthPickerProps())
const emit = defineEmits(['change-year', 'change'])

const firstRangeMonthIndex = ref()
const firstRangeMonthYear = ref()
const secondRangeMonthIndex = ref()
const secondRangeMonthYear = ref()
const year = ref<number>(now.getFullYear())
const selectedYear = ref(now.getFullYear())
const currentMonthIndex = ref()

const currentMonth = computed(() => {
    if (currentMonthIndex.value !== null) {
        return monthsByLang.value[currentMonthIndex.value]
    }

    return null
})

const date = computed (() => {
            const month = monthsByLang.indexOf(currentMonth) + 1
            let dateFrom = new Date(`${this.year}/${month}/01`)
            let dateTo = new Date(this.year, month, 1)

            const dateResult = {
                from: dateFrom,
                to: dateTo,
                month: this.monthsByLang[month - 1],
                monthIndex: month,
                year: this.year,
                rangeFrom: null,
                rangeTo: null,
                rangeFromMonth: null,
                rangeFromYear: null,
                rangeToMonth: null,
                rangeToYear: null,
            }

            if (props.range) {
                const monthRangeFrom =
                    this.monthsByLang.indexOf(this.firstRangeMonthIndex) + 1
                const monthRangeTo =
                    this.monthsByLang.indexOf(this.secondRangeMonthIndex) + 1

                dateFrom = new Date(`${this.year}/${monthRangeFrom}/01`)
                dateTo = new Date(`${this.year}/${monthRangeTo}/01`)

                dateResult.rangeFrom = this.firstRangeMonthIndex
                dateResult.rangeTo = this.secondRangeMonthIndex
                dateResult.rangeFromMonth =
                    this.monthsByLang[this.firstRangeMonthIndex]
                dateResult.rangeToMonth =
                    this.monthsByLang[this.secondRangeMonthIndex]
                dateResult.rangeFromYear = this.firstRangeMonthYear
                dateResult.rangeToYear = this.secondRangeMonthYear
            }

            return dateResult
        }
    })

const changeYear = (value: number) => {
    year.value += value
    if (this.isInactive(value)) {
        return
    }

    this.onChange()
    emit('change-year', year.value)
}

const onChangeYear = () => {
    if (!year.value) {
        year.value = props.defaultYear || new Date().getFullYear()
    }
    emit('change', date.value)
}
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
            <p v-if="!props.editableYear">
                {{ year }}
            </p>
            <input
                v-else
                v-model.number="year"
                type="text"
                @change="onChange()"
            />
            <button type="button" @click="changeYear(+1)">&rsaquo;</button>
        </div>
        <div v-if="!yearOnly" class="month-picker">
            <div
                v-for="(month, monthIndex) in monthsByLang"
                :key="month"
                :class="{
                    inactive: isInactive(month),
                    clearable: clearable,
                    selected:
                        (highlightExactDate &&
                            !range &&
                            showYear &&
                            currentMonthIndex === monthIndex &&
                            year === selectedYear) ||
                        (!range &&
                            !showYear &&
                            currentMonthIndex == monthIndex) ||
                        (!highlightExactDate &&
                            !range &&
                            currentMonthIndex === monthIndex) ||
                        (range && isInSelectedRange(monthIndex)),
                }"
                class="month-picker__month"
                @click="selectMonth(monthIndex, true)"
            >
                {{ month }}
            </div>
        </div>
    </div>
</template>

<style scoped>
.read-the-docs {
    color: #888;
}
</style>
