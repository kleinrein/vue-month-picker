<template>
  <div 
    class="month-picker-input-container"
    v-click-outside="hide">
    <input
      class="month-picker-input"
      type="text"
      v-model="selectedDate"
      @click="showMonthPicker()"
      readonly>
    <month-picker 
      v-show="monthPickerVisible"
      @input="populateInput"
      :default-year="defaultYear"
      :default-month="defaultMonth"
      :lang="lang"
      :months="months"
      :no-default="noDefault"
      :show-year="showYear">
    </month-picker>
  </div>
</template>

<script>
import Vue from 'vue'
import MonthPicker from '@/MonthPicker'

Vue.directive('click-outside', {
  bind: function (el, binding, vnode) {
    el.event = function (event) {
      if (!(el === event.target || el.contains(event.target))) {
        vnode.context[binding.expression](event)
      }
    }
    document.body.addEventListener('click', el.event)
  },
  unbind: function (el) {
    document.body.removeEventListener('click', el.event)
  }
})

export default {
  name: 'en',
  props: {
    lang: {
      type: String,
      default: 'en',
      validator: function(value) {
        return ['en'].indexOf(value) !== -1
      },
      required: false
    },
    months: {
      default: null,
      validator: function(value) {
        return value.length !== 12
      },
      required: false
    },
    showYear: {
      type: Boolean,
      default: true,
      required: false
    },
    defaultMonth: {
      type: Number,
      default: null,
      required: false
    },
    defaultYear: {
      type: Number,
      default: null,
      required: false
    },
    noDefault: {
      type: Boolean,
      default: false,
      required: false
    }
  },
  data() {
    return {
      monthPickerVisible: false,
			selectedDate: null,
    }
  },
  components: {
		MonthPicker
	},
  methods: {
    populateInput (date) {
			this.selectedDate = `${date.month}, ${date.year}`
			this.monthPickerVisible = false
      this.$emit("input", date)
		},
		showMonthPicker () {
			this.monthPickerVisible = !this.monthPickerVisible
    },
    hide () {
      this.monthPickerVisible = false
    }
  }
}
</script>
<style scoped>
  .month-picker-input-container {
    position: relative;
  }

  .month-picker-input {
    padding: 1em 1.5em;
    font-size: .85em;
    border-radius: 5px;
    outline: none;
    border: 1px solid rgba(0,0,0,.15);
    transition: all 350ms cubic-bezier(0.165, 0.84, 0.44, 1);
  }

  .month-picker-input:focus {
    border-color: rgba(0,0,0,.25);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }

  .month-picker-container {
    position: absolute;
    top: 3.5em;
  }
</style>
