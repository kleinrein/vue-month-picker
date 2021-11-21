<template>
  <div v-click-outside="hide" class="month-picker-input-container">
    <input
      v-model="selectedDate"
      class="month-picker-input"
      type="text"
      :placeholder="placeholder"
      readonly
      @click="showMonthPicker()"
    />
    <month-picker
      v-show="monthPickerVisible"
      :default-year="defaultYear"
      :default-month="defaultMonth"
      :lang="lang"
      :months="months"
      :no-default="noDefault"
      :show-year="showYear"
      :clearable="clearable"
      :variant="variant"
      :editable-year="editableYear"
      :max-date="maxDate"
      :min-date="minDate"
      :year-only="yearOnly"
      :range="range"
      @input="populateInput"
      @change="updateDate"
    />
  </div>
</template>

<script>
import MonthPicker from "./MonthPicker.vue";
import monthPicker from "./month-picker";

export default {
  name: "MonthPickerInput",
  directives: {
    clickOutside: {
      bind: function (el, binding, vnode) {
        el.event = function (event) {
          if (!(el === event.target || el.contains(event.target))) {
            vnode.context[binding.expression](event);
          }
        };
        document.body.addEventListener("click", el.event);
      },
      unbind: function (el) {
        document.body.removeEventListener("click", el.event);
      },
      beforeMount: (el, binding) => {
        el.clickOutsideEvent = (event) => {
          if (!(el == event.target || el.contains(event.target))) {
            binding.value();
          }
        };
        document.addEventListener("click", el.clickOutsideEvent);
      },
      unmounted: (el) => {
        document.removeEventListener("click", el.clickOutsideEvent);
      },
    },
  },
  components: {
    MonthPicker,
  },
  components: {
    MonthPicker,
  },
  mixins: [monthPicker],
  mixins: [monthPicker],
  props: {
    placeholder: {
      type: String,
      default: null,
    },
  },
  emits: ["change", "input"],
  data() {
    return {
      monthPickerVisible: false,
      selectedDate: null,
    };
  },
  watch: {
    defaultYear: {
      immediate: true,
      handler(value) {
        if (!value || !this.inputPreFilled) return;
        this.selectedDate = `${
          this.monthsByLang[this.defaultMonth - 1]
        }, ${value}`;
      },
    },
    defaultMonth: {
      immediate: true,
      handler(value) {
        if (!value || !this.inputPreFilled) return;
        this.selectedDate = `${this.monthsByLang[value - 1]}, ${
          this.defaultYear
        }`;
      },
    },
  },
  methods: {
    populateInput(date) {
      if (this.range) {
        this.selectedDate = `${date.rangeFromMonth} - ${date.rangeToMonth}, ${date.year}`;
      } else {
        this.selectedDate = `${date.month}, ${date.year}`;
      }

      this.monthPickerVisible = false;
      this.$emit("input", date);
    },
    showMonthPicker() {
      this.monthPickerVisible = !this.monthPickerVisible;
    },
    hide() {
      this.monthPickerVisible = false;
    },
    updateDate(date) {
      if (this.range) {
        this.selectedDate = `${date.rangeFromMonth} - ${date.rangeToMonth}, ${date.year}`;
      } else {
        this.selectedDate = `${date.month}, ${date.year}`;
      }
      this.$emit("change", date);
    },
  },
};
</script>
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
}

.month-picker-input:focus {
  border-color: rgba(0, 0, 0, 0.25);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.month-picker__container {
  position: absolute;
  top: 3.5em;
}
</style>
