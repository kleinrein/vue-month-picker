import languages from './languages'

export default {
  props: {
    lang: {
      type: String,
      default: 'en',
      validator: function (value) {
        return Object.keys(languages).some(l => Object.is(l, value))
      },
      required: false,
    },
    months: {
      type: Array,
      default: null,
      validator: function (value) {
        return value.length === 12
      },
      required: false,
    },
    defaultMonth: {
      type: Number,
      default: null,
      required: false,
    },
    defaultYear: {
      type: Number,
      default: null,
      required: false,
    },
    showYear: {
      type: Boolean,
      default: true,
      required: false,
    },
    editableYear: {
      type: Boolean,
      default: false,
      required: false,
    },
    yearOnly: {
      type: Boolean,
      default: false,
      required: false,
    },
    noDefault: {
      type: Boolean,
      default: false,
      required: false,
    },
    clearable: {
      type: Boolean,
      default: false,
      required: false,
    },
    minDate: {
      type: Date,
      default: null,
      required: false,
    },
    maxDate: {
      type: Date,
      default: null,
    },
    inputPreFilled: {
      type: Boolean,
      default: false,
      required: false,
    },
    range: {
      type: Boolean,
      default: false,
      required: false,
    },
    defaultMonthRange: {
      type: Array,
      default: null,
      required: false,
      validator: function (value) {
        if (value === null || value.length !== 2) {
          return false
        }

                const [firstRange, secondRange] = value
                if (secondRange <= firstRange) {
                    return false
                }

        return true
      },
    },
    variant: {
      type: String,
      default: 'default',
      required: false,
      validator: function (value) {
        return ['default', 'dark'].includes(value)
      },
    },
    dateFormat: {
      type: String,
      default: "%n, %Y",
      },
    highlightExactDate: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  computed: {
    monthsByLang: function () {
      if (this.months !== null && this.months.length === 12) {
        return this.months
      }
      return languages[this.lang]
    },
  },
}
