export interface IDateResult {
  from: Date
  to: Date
  month: string
  monthIndex: number
  year: number
  /** Zero-based index of the range start month */
  rangeFrom?: number
  /** Zero-based index of the range end month */
  rangeTo?: number
  rangeFromMonth?: string
  rangeToMonth?: string
}
