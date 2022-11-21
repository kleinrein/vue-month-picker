<template>
    <div
        class="month-picker__container"
        :class="{
            [`month-picker--${variant}`]: true,
            'year-picker': yearOnly,
        }"
    >
        <div v-if="showYear" class="month-picker__year">
            <button type="button" @click="changeYear(-1)">&lsaquo;</button>
            <p v-if="!editableYear">
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
                            currentMonthIndex === monthIndex),
                }"
                class="month-picker__month"
                @click="selectMonth(monthIndex, true)"
            >
                {{ month }}
            </div>
        </div>
    </div>
</template>

<script>
import languages from './languages'
import monthPicker from './month-picker'

export default {
    name: 'MonthPicker',
    mixins: [monthPicker],
    emits: ['change', 'clear', 'input', 'change-year'],
    data: () => ({
        currentMonthIndex: null,
        firstRangeMonthIndex: null,
        secondRangeMonthIndex: null,
        year: new Date().getFullYear(),
        selectedYear: new Date().getFullYear(),
    }),
    computed: {
        currentMonth: function () {
            if (this.currentMonthIndex !== null) {
                return this.monthsByLang[this.currentMonthIndex]
            }

            return null
        },
        firstRangemonth: function () {
            if (this.firstRangeMonthIndex !== null) {
                return this.monthsByLang[this.firstRangeMonthIndex]
            }

            return null
        },
        secondRangemonth: function () {
            if (this.secondRangeMonthIndex !== null) {
                return this.monthsByLang[this.secondRangeMonthIndex]
            }

            return null
        },
        date: function () {
            const month = this.monthsByLang.indexOf(this.currentMonth) + 1
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
                rangeToMonth: null,
            }

            if (this.range) {
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
            }

            return dateResult
        },
    },
    watch: {
        defaultMonth(newVal) {
            this.currentMonthIndex = newVal - 1
        },
        defaultYear(newVal) {
            this.year = newVal
        },
    },
    mounted() {
        if (this.defaultYear) {
            this.year = this.defaultYear
        }

        if (this.range) {
            this.setDefaultMonthRange()
            return
        }

        if (this.defaultMonth) {
            this.selectMonth(this.defaultMonth - 1)
        } else if (!this.noDefault) {
            this.selectMonth(0)
        }
    },
    methods: {
        onChange() {
            if (!Number.parseInt(this.year)) {
                this.year = this.defaultYear || new Date().getFullYear()
            }
            this.$emit('change', this.date)
        },
        selectMonth(index, input = false) {
            if (this.isInactive(index)) {
                return
            }

            if (this.range) {
                return this.selectMonthRange(index, input)
            }

            const isAlreadySelected = this.currentMonthIndex === index
            if (this.clearable && isAlreadySelected) {
                this.currentMonthIndex = null
                this.$emit('clear')
                return
            }

            if (this.isAlreadySelected) {
                return
            }

            this.currentMonthIndex = index
            this.onChange()

            if (input) {
                this.$emit('input', this.date)
            }
        },
        selectMonthRange(index, input) {
            if (this.firstRangeMonthIndex === null) {
                this.firstRangeMonthIndex = index
                return
            }

            if (
                this.firstRangeMonthIndex !== null &&
                this.secondRangeMonthIndex !== null
            ) {
                this.firstRangeMonthIndex = index
                this.secondRangeMonthIndex = null
                return
            }

            if (index >= this.firstRangeMonthIndex) {
                this.secondRangeMonthIndex = index
                this.onChange()

                if (input) {
                    this.$emit('input', this.date)
                }
                return
            }

            this.firstRangeMonthIndex = index
        },
        setDefaultMonthRange() {
            if (
                this.defaultMonthRange === null ||
                this.defaultMonthRange.length !== 2
            ) {
                return
            }

            const [firstRange, secondRange] = this.defaultMonthRange
            if (secondRange <= firstRange) {
                return
            }

            this.firstRangeMonthIndex = firstRange
            this.secondRangeMonthIndex = secondRange
        },
        changeYear(value) {
            this.year += value
            if (this.isInactive(value)) {
                return
            }

            this.onChange()
            this.$emit('change-year', this.year)
        },
        isInactive(month) {
            let monthValue = month
            if (this.minDate === null && this.maxDate === null) {
                return false
            }

            if (Number.isInteger(monthValue)) {
                monthValue = this.monthsByLang[monthValue]
            }

            const monthKey = this.monthsByLang.indexOf(monthValue) + 1
            const date = new Date(`${this.year}/${monthKey}/01`)
            const isValidDate = (date) => date !== null && date instanceof Date

            if (isValidDate(this.minDate) && date < this.minDate) {
                return true
            }

            if (isValidDate(this.maxDate) && date > this.maxDate) {
                return true
            }

            return false
        },
    },
}
</script>

<style>
.month-picker__container {
    width: 400px;
    position: relative;
    box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.1),
        inset 0 -1px 0 rgba(0, 0, 0, 0.1);
    border-radius: 5px;
}

.month-picker__container.year-picker {
    width: 20rem;
}

.month-picker {
    box-sizing: border-box;
    flex: 1;
    width: auto;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    box-shadow: 1px 2px 5px rgba(0, 0, 0, 0.1);
    font-family: sans-serif;
    border-radius: 5px;
    overflow: hidden;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
}

.month-picker__year {
    padding: 0.2rem;
    background-color: #fcfcfc;
    box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.1),
        inset 0 -1px 0 rgba(0, 0, 0, 0.1);
}

.month-picker__year p {
    width: 100%;
    font-weight: 600;
    letter-spacing: 1px;
    font-size: 1.2rem;
    margin: 1rem 0;
}

.month-picker__year input {
    padding: 0;
    font-weight: 600;
    border-radius: 5px 5px 0 0;
    outline: none;
    border: none;
    font-size: 1.2rem;
    width: auto;
    text-align: center;
    box-sizing: border-box;
    width: 100%;
    height: 3.5rem;
    position: relative;
    z-index: 1;
}

.month-picker__year input:focus {
    border: 1px solid #55b0f2;
}

.month-picker__year div,
.month-picker__year button,
.month-picker__year p {
    text-align: center;
    flex: 1;
}

.month-picker__year button {
    background-color: #f4f4f4;
    position: absolute;
    width: 5rem;
    height: 2.75rem;
    font-size: 2rem;
    border-radius: 5px;
    outline: none;
    border: 0;
    top: 0.5rem;
    border: 1px solid #e8e8e8;
    z-index: 2;
    color: #686868;
}

.month-picker__year button:hover {
    background-color: rgba(0, 0, 0, 0.025);
}

.month-picker__year button:active {
    background-color: rgba(0, 0, 0, 0.04);
}

.month-picker__year button:first-child {
    left: 10px;
}

.month-picker__year button:last-child {
    right: 10px;
}

.month-picker__month {
    padding: 0.85rem 0.25rem;
    flex-basis: calc(33.333% - 10px);
    padding: 0.75rem 0.25rem;
    cursor: pointer;
    text-align: center;
    border: 1px solid rgba(245, 245, 245, 0.75);
    transition: all 250ms cubic-bezier(0.165, 0.84, 0.44, 1);
    background-color: #fefefe;
    user-select: none;
    position: relative;
}

.month-picker__month:hover::after {
    display: block;
    content: '';
    position: absolute;
    width: 95%;
    height: 95%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    z-index: 10;
}

.month-picker__month.selected,
.month-picker__month.selected-range-first,
.month-picker__month.selected-range-second {
    background-color: #55b0f2;
    color: #ffffff;
    border-radius: 5px;
    box-shadow: inset 0 0 3px #3490d2, 0px 2px 5px rgba(85, 176, 242, 0.2);
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.25);
}

.month-picker__month.selected-range-first,
.month-picker__month.selected-range-second {
    border-color: transparent;
}

.month-picker__month.selected-range {
    background-color: #7eb9e2;
    color: #ffffff;
    border-color: transparent;
}

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

/* Dark threme */
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

.month-picker--dark .month-picker__month.selected,
.month-picker--dark .month-picker__month.selected-range-first,
.month-picker--dark .month-picker__month.selected-range-second {
    background-color: #505050;
    box-shadow: inset 0 0 3px #505050, 0px 2px 5px #505050;
    color: #ffffff;
    border-color: #1d1b1b;
}

.month-picker--dark .month-picker__month.selected-range {
    background-color: #636363;
    color: #ffffff;
    border-color: transparent;
}

.month-picker--dark .month-picker__month:hover {
    box-shadow: 0 0 6px rgba(0, 0, 0, 0.8);
    z-index: 10;
}

.month-picker--dark .month-picker__month.inactive {
    background-color: #3f3f3f;
    color: #8a8a8a;
    cursor: not-allowed;
    box-shadow: none;
    text-shadow: none;
}

@media only screen and (max-width: 768px) {
    .month-picker__container {
        width: 100%;
    }
}
</style>
