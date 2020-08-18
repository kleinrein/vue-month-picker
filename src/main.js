import MonthPicker from './MonthPicker.vue'
import MonthPickerInput from './MonthPickerInput.vue'

function plugin (Vue) {
  Vue.component('month-picker', MonthPicker)
  Vue.component('month-picker-input', MonthPickerInput)
}

// Install by default if using the script tag
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(plugin)
}

export default plugin

export {
  MonthPicker,
  MonthPickerInput
}
