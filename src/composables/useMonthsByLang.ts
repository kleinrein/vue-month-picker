import { computed, type Ref } from 'vue'
import { months as allMonths } from '../languages'

/**
 * Returns a computed list of month names based on the `lang` prop or a custom
 * `months` array. Shared between MonthPicker and MonthPickerInput.
 */
export function useMonthsByLang(
  lang: Ref<string>,
  months: Ref<string[] | null | undefined>
) {
  return computed<string[]>(() => {
    if (months.value != null && months.value.length === 12) {
      return months.value
    }
    return allMonths[lang.value] ?? allMonths['en']
  })
}
