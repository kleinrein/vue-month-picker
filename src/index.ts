import type { App } from 'vue'
import MonthPicker from './components/MonthPicker.vue'
import MonthPickerInput from './components/MonthPickerInput.vue'

export { MonthPicker, MonthPickerInput }
export type { IDateResult } from './interfaces'
export type { MonthPickerProps } from './month-picker'

// Plugin install — allows Vue.use(VueMonthPicker)
export default {
  install(app: App) {
    app.component('MonthPicker', MonthPicker)
    app.component('MonthPickerInput', MonthPickerInput)
  },
}
