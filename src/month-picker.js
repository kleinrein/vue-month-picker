import languages from './languages'

export default {
  props: {
    lang: {
      type: String,
      default: 'en',
      validator: function (value) {
        return Object.keys(languages).some(l => Object.is(l, value))
      },
      required: false
    },
    months: {
      type: Array,
      default: null,
      validator: function (value) {
        return value.length === 12
      },
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
    showYear: {
      type: Boolean,
      default: true,
      required: false
    },
    editableYear: {
      type: Boolean,
      default: false,
      required: false
    },
    noDefault: {
      type: Boolean,
      default: false,
      required: false
    },
    clearable: {
      type: Boolean,
      default: false,
      required: false
    },
    variant: {
      type: String,
      default: 'default',
      required: false,
      validator: function (value) {
        return ['default', 'dark'].includes(value)
      }
    }
  }
}