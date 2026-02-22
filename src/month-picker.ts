// Shared prop type definition used by both MonthPicker and MonthPickerInput.
// Components use defineProps<MonthPickerProps>() directly with withDefaults().
export interface MonthPickerProps {
  lang?: string
  months?: string[] | null
  defaultMonth?: number | null
  defaultYear?: number | null
  showYear?: boolean
  editableYear?: boolean
  yearOnly?: boolean
  noDefault?: boolean
  clearable?: boolean
  minDate?: Date | null
  maxDate?: Date | null
  inputPreFilled?: boolean
  range?: boolean
  defaultMonthRange?: [number, number] | null
  variant?: 'default' | 'dark'
  dateFormat?: string
  highlightExactDate?: boolean
}
