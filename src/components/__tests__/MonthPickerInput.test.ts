import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import MonthPickerInput from '../MonthPickerInput.vue'

// ─── Rendering ────────────────────────────────────────────────────────────────

describe('MonthPickerInput – rendering', () => {
  it('renders a text input', () => {
    const wrapper = mount(MonthPickerInput)
    expect(wrapper.find('input[type="text"]').exists()).toBe(true)
  })

  it('hides the MonthPicker by default', () => {
    const wrapper = mount(MonthPickerInput)
    const picker = wrapper.findComponent({ name: 'MonthPicker' })
    expect(picker.isVisible()).toBe(false)
  })

  it('shows the MonthPicker when input is clicked', async () => {
    const wrapper = mount(MonthPickerInput, {
      attachTo: document.body,
    })
    await wrapper.find('input').trigger('click')
    await nextTick()
    const picker = wrapper.findComponent({ name: 'MonthPicker' })
    expect(picker.isVisible()).toBe(true)
    wrapper.unmount()
  })

  it('renders a placeholder when provided', () => {
    const wrapper = mount(MonthPickerInput, {
      props: { placeholder: 'Pick a month' },
    })
    expect(wrapper.find('input').attributes('placeholder')).toBe('Pick a month')
  })
})

// ─── inputPreFilled ───────────────────────────────────────────────────────────

describe('MonthPickerInput – inputPreFilled', () => {
  it('pre-fills the input with default month/year using %n, %Y format', async () => {
    const wrapper = mount(MonthPickerInput, {
      props: {
        inputPreFilled: true,
        defaultMonth: 3,
        defaultYear: 2024,
        dateFormat: '%n, %Y',
      },
    })
    await nextTick()
    expect(wrapper.find('input').element.value).toBe('March, 2024')
  })

  it('pre-fills with zero-padded month token %m', async () => {
    const wrapper = mount(MonthPickerInput, {
      props: {
        inputPreFilled: true,
        defaultMonth: 1,
        defaultYear: 2024,
        dateFormat: '%m/%Y',
      },
    })
    await nextTick()
    expect(wrapper.find('input').element.value).toBe('01/2024')
  })

  it('pre-fills with unpadded month token %M', async () => {
    const wrapper = mount(MonthPickerInput, {
      props: {
        inputPreFilled: true,
        defaultMonth: 1,
        defaultYear: 2024,
        dateFormat: '%M/%Y',
      },
    })
    await nextTick()
    expect(wrapper.find('input').element.value).toBe('1/2024')
  })

  it('pre-fills with 2-digit year token %y', async () => {
    const wrapper = mount(MonthPickerInput, {
      props: {
        inputPreFilled: true,
        defaultMonth: 6,
        defaultYear: 2024,
        dateFormat: '%n %y',
      },
    })
    await nextTick()
    expect(wrapper.find('input').element.value).toBe('June 24')
  })

  it('updates pre-filled input when defaultMonth/defaultYear props change', async () => {
    const wrapper = mount(MonthPickerInput, {
      props: {
        inputPreFilled: true,
        defaultMonth: 3,
        defaultYear: 2023,
        dateFormat: '%n, %Y',
      },
    })
    await nextTick()
    expect(wrapper.find('input').element.value).toBe('March, 2023')

    await wrapper.setProps({ defaultMonth: 11, defaultYear: 2025 })
    await nextTick()
    expect(wrapper.find('input').element.value).toBe('November, 2025')
  })

  it('does NOT pre-fill when inputPreFilled is false', async () => {
    const wrapper = mount(MonthPickerInput, {
      props: {
        inputPreFilled: false,
        defaultMonth: 3,
        defaultYear: 2024,
      },
    })
    await nextTick()
    expect(wrapper.find('input').element.value).toBe('')
  })
})

// ─── dateFormat tokens ────────────────────────────────────────────────────────

describe('MonthPickerInput – dateFormat tokens', () => {
  it('populates input with %n token after month selection', async () => {
    const wrapper = mount(MonthPickerInput, {
      props: { dateFormat: '%n', noDefault: true },
      attachTo: document.body,
    })
    await nextTick()

    // Open the picker and click April (index 3)
    await wrapper.find('input').trigger('click')
    await nextTick()
    const cells = wrapper.findAll('.month-picker__month')
    await cells[3].trigger('click')
    await nextTick()

    expect(wrapper.find('input').element.value).toBe('April')
    wrapper.unmount()
  })

  it('populates input with %Y token after month selection', async () => {
    const wrapper = mount(MonthPickerInput, {
      props: { dateFormat: '%Y', defaultYear: 2024, noDefault: true },
      attachTo: document.body,
    })
    await nextTick()

    await wrapper.find('input').trigger('click')
    await nextTick()
    const cells = wrapper.findAll('.month-picker__month')
    await cells[0].trigger('click')
    await nextTick()

    expect(wrapper.find('input').element.value).toBe('2024')
    wrapper.unmount()
  })

  it('populates input with %m (zero-padded) after month selection', async () => {
    const wrapper = mount(MonthPickerInput, {
      props: { dateFormat: '%m', defaultYear: 2024, noDefault: true },
      attachTo: document.body,
    })
    await nextTick()

    await wrapper.find('input').trigger('click')
    await nextTick()
    const cells = wrapper.findAll('.month-picker__month')
    await cells[0].trigger('click') // Jan → 01
    await nextTick()

    expect(wrapper.find('input').element.value).toBe('01')
    wrapper.unmount()
  })
})

// ─── Emits ────────────────────────────────────────────────────────────────────

describe('MonthPickerInput – emits', () => {
  it('emits input when a month is selected', async () => {
    const wrapper = mount(MonthPickerInput, {
      props: { noDefault: true },
      attachTo: document.body,
    })
    await nextTick()

    await wrapper.find('input').trigger('click')
    await nextTick()
    const cells = wrapper.findAll('.month-picker__month')
    await cells[6].trigger('click') // Jul
    await nextTick()

    expect(wrapper.emitted('input')).toBeTruthy()
    expect(wrapper.emitted('input')![0][0]).toMatchObject({ monthIndex: 7 })
    wrapper.unmount()
  })

  it('emits change-year when year navigation changes', async () => {
    const wrapper = mount(MonthPickerInput, {
      props: { defaultYear: 2023 },
      attachTo: document.body,
    })
    await nextTick()

    await wrapper.find('input').trigger('click')
    await nextTick()
    const buttons = wrapper.findAll('.month-picker__year button')
    await buttons[1].trigger('click') // › forward
    await nextTick()

    expect(wrapper.emitted('change-year')).toBeTruthy()
    expect(wrapper.emitted('change-year')![0][0]).toBe(2024)
    wrapper.unmount()
  })

  it('year navigation does NOT update the input text', async () => {
    const wrapper = mount(MonthPickerInput, {
      props: {
        inputPreFilled: true,
        defaultMonth: 5,
        defaultYear: 2023,
        dateFormat: '%n, %Y',
      },
      attachTo: document.body,
    })
    await nextTick()
    const initialValue = wrapper.find('input').element.value // 'May, 2023'

    await wrapper.find('input').trigger('click')
    await nextTick()
    const buttons = wrapper.findAll('.month-picker__year button')
    await buttons[1].trigger('click') // navigate to 2024
    await nextTick()

    // Input text must stay unchanged — only an explicit month click should update it
    expect(wrapper.find('input').element.value).toBe(initialValue)
    wrapper.unmount()
  })
})
