import type { App } from 'vue'
import MonthPicker from './components/MonthPicker.vue'
import MonthPickerInput from './components/MonthPickerInput.vue'

export { MonthPicker, MonthPickerInput }
export type { IDateResult } from './interfaces'
export type { MonthPickerProps } from './month-picker'

// Plugin install — allows Vue.use(VueMonthPicker)
export default {
  install(app: App) {
    // Register components using PascalCase (v2+ recommended usage)
    app.component('MonthPicker', MonthPicker)
    app.component('MonthPickerInput', MonthPickerInput)

    // Backwards compatibility: also register kebab-case names (v1)
    app.component('month-picker', MonthPicker)
    app.component('month-picker-input', MonthPickerInput)
  },
}
