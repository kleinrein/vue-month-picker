<template>
  <div class="month-picker-container">
    <div class="month-picker-year" v-if="showYear">
      <button @click="changeYear(-1)">
        &lsaquo;
      </button>
      <p>{{ year }}</p>
      <button @click="changeYear(+1)">
        &rsaquo;
      </button>
    </div>
    <div class="month-picker">
      <div
        v-for="(month, i) in monthsByLang"
        :key="month" 
        :class="currentMonth === month ? 'selected' : ''"
        class="month-picker-month"
        @click="selectMonth(i, true)"
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
  name: 'en',
  mixins: [monthPicker],
  data() {
    return {
      currentMonthIndex: null,
      year: new Date().getFullYear()
    }
  },
  computed: {
    monthsByLang: function() {
      if (this.months !== null && 
          this.months.length === 12) {
        return this.months
      }
      return languages[this.lang]
    },
    currentMonth: function() {
      if (this.currentMonthIndex !== null) {
        return this.monthsByLang[this.currentMonthIndex]
      }
    },
    date: function() {
      const month = this.monthsByLang.indexOf(this.currentMonth) + 1
      const date = new Date(`${this.year}/${month}/01`)
      const year = date.getFullYear()

      return {
        from: date,
        to: new Date(year, month, 1),
        month: this.monthsByLang[month - 1],
        monthIndex: month,
        year: year
      }
    }
  },
  mounted() {
    if (this.defaultMonth) {
      this.selectMonth(this.defaultMonth - 1)
    } else if (!this.noDefault) {
      this.selectMonth(0)
    }

    if (this.defaultYear) {
      this.year = this.defaultYear
    }
  },
  methods: {
    onChange() {
      this.$emit('change', this.date)
    },
    selectMonth(index, input = false) {
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
    changeYear(value) {
      this.year += value
      this.onChange()
      this.$emit('change-year', this.year)
    }
  }
}
</script>

<style>
.month-picker-container {
  width: 400px;
  position: relative;
  border: 1px solid #dddddd;
  border-radius: 5px;
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
}

.month-picker-year p {
  width: 100%;
  font-weight: 600;
  letter-spacing: 1px;
  font-size: 1.2em;
}

.month-picker-year div,
.month-picker-year button,
.month-picker-year p {
  text-align: center;
  flex: 1;
}

.month-picker-year button {
  position: absolute;
  width: 2em;
  font-size: 1.5em;
  border-radius: 5px;
  outline: none;
  border: 0;
  top: 10px;
  border: 1px solid #e8e8e8;
}

.month-picker-year button:hover {
  background-color: rgba(0, 0, 0, .025);
}

.month-picker-year button:active {
  background-color: rgba(0, 0, 0, .04);
}

.month-picker-year button:first-child {
  left: 10px;
}

.month-picker-year button:last-child {
  right: 10px;
}

.month-picker-month {
  flex-basis: calc(33.333% - 10px);
  padding: 0.75em 0.25em;
  cursor: pointer;
  text-align: center;
  border: 1px solid rgba(245, 245, 245, .75);
  transition: all 250ms cubic-bezier(0.165, 0.84, 0.44, 1);
}

.month-picker-month.selected {
  background-color: #55b0f2;
  color: #ffffff;
  border-radius: 5px;
  box-shadow: inset 0 0 3px #3490d2, 0px 2px 5px rgba(85, 176, 242, 0.2);
  text-shadow: 0 2px 2px rgba(0, 0, 0, .1);
  font-weight: 800;
}

.month-picker .month-picker-month:hover {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
</style>
