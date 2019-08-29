<template>
  <div
    class="month-picker__container"
    :class="`month-picker--${variant}`"
  >
    <div
      v-if="showYear"
      class="month-picker__year"
    >
      <button @click="changeYear(-1)">
        &lsaquo;
      </button>
      <p
        v-if="!editableYear"
      >
        {{ year }}
      </p>
      <input
        v-else
        type="text"
        v-model.number="year"
        @change="onChange()"
      >
      <button @click="changeYear(+1)">
        &rsaquo;
      </button>
    </div>
    <div class="month-picker">
      <div
        v-for="(month, i) in monthsByLang"
        :key="month"
        :class="{
          'clearable': clearable,
          'selected': currentMonth === month
        }"
        class="month-picker__month"
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
  data: () => ({
    currentMonthIndex: null,
    year: new Date().getFullYear()
  }),
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
  watch: {
    defaultMonth (newVal) {
      this.currentMonthIndex = newVal
    },
    defaultYear (newVal) {
      this.year = newVal
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
      if (!Number.parseInt(this.year)) {
        this.year = this.defaultYear || new Date().getFullYear()
      }

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
.month-picker__container {
  width: 400px;
  position: relative;
  border: 1px solid #DDDDDD;
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

.month-picker__year p {
  width: 100%;
  font-weight: 600;
  letter-spacing: 1px;
  font-size: 1.2em;
}

.month-picker__year input {
  padding: 0;
  font-weight: 600;
  border-radius: 5px 5px 0 0;
  outline: none;
  border: none;
  font-size: 1.2em;
  width: auto;
  text-align: center;
  box-sizing: border-box;
  width: 100%;
  height: 3em;
  position: relative;
  z-index: 1;
}

.month-picker__year input:focus {
  border: 1px solid #55B0F2;
}

.month-picker__year div,
.month-picker__year button,
.month-picker__year p {
  text-align: center;
  flex: 1;
}

.month-picker__year button {
  background-color: #FFFFFF;
  position: absolute;
  width: 2em;
  font-size: 1.5em;
  border-radius: 5px;
  outline: none;
  border: 0;
  top: 10px;
  border: 1px solid #E8E8E8;
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
  flex-basis: calc(33.333% - 10px);
  padding: 0.75em 0.25em;
  cursor: pointer;
  text-align: center;
  border: 1px solid rgba(245, 245, 245, .75);
  transition: all 250ms cubic-bezier(0.165, 0.84, 0.44, 1);
  background-color: #FEFEFE;
}

.month-picker__month.selected {
  background-color: #55B0F2;
  color: #FFFFFF;
  border-radius: 5px;
  box-shadow: inset 0 0 3px #3490d2, 0px 2px 5px rgba(85, 176, 242, 0.2);
  text-shadow: 0 2px 2px rgba(0, 0, 0, .1);
}

.month-picker .month-picker__month:hover {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

/* Dark theme */
.month-picker--dark {
  background-color: #5F5F5F;
}

.month-picker--dark .month-picker__year p,
.month-picker--dark .month-picker__year input {
  color: #EBEBEB;
}

.month-picker--dark .month-picker__year input {
  background-color: #5F5F5F;
}

.month-picker--dark .month-picker__year button {
  background-color: #505050;
  color: #C9C9C9;
  border-color: #1E1E1E;
}

.month-picker--dark .month-picker__year button:hover {
  background-color: rgba(0, 0, 0, 0.3);
}

.month-picker--dark .month-picker__year button:active {
  background-color: rgba(0, 0, 0, 0.6);
}

.month-picker--dark .month-picker__month {
  background-color: #2F2F30;
  border-color: rgba(245, 245, 245, .15);
  color: #C9C9C9;
}

.month-picker--dark .month-picker__month.selected {
  background-color: #505050;
  box-shadow: inset 0 0 3px #505050, 0px 2px 5px #505050;
  color: #FFFFFF;
  border-color: #1E1E1E;
}

.month-picker--dark .month-picker__month:hover {
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.8);
  z-index: 10;
}

@media only screen and (max-width: 768px) {
  .month-picker__container {
    width: 100%;
  }
}
</style>
