import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import MonthPicker from '../MonthPicker.vue'

function monthCells(wrapper: ReturnType<typeof mount>) {
  return wrapper.findAll('.month-picker__month')
}

function selectedCells(wrapper: ReturnType<typeof mount>) {
  return wrapper.findAll('.month-picker__month.selected')
}

function inactiveCells(wrapper: ReturnType<typeof mount>) {
  return wrapper.findAll('.month-picker__month.inactive')
}

// ─── Default behaviour ────────────────────────────────────────────────────────

describe('MonthPicker – default behaviour', () => {
  it('renders 12 month cells', async () => {
    const wrapper = mount(MonthPicker)
    await nextTick()
    expect(monthCells(wrapper)).toHaveLength(12)
  })

  it('selects January by default (no props)', async () => {
    const wrapper = mount(MonthPicker)
    await nextTick()
    const selected = selectedCells(wrapper)
    expect(selected).toHaveLength(1)
    expect(selected[0].text()).toBe('January')
  })

  it('noDefault leaves nothing selected', async () => {
    const wrapper = mount(MonthPicker, { props: { noDefault: true } })
    await nextTick()
    expect(selectedCells(wrapper)).toHaveLength(0)
  })

  it('shows the current year in the header', async () => {
    const wrapper = mount(MonthPicker)
    await nextTick()
    expect(wrapper.find('.month-picker__year p').text()).toBe(String(new Date().getFullYear()))
  })
})

// ─── defaultMonth / defaultYear props ────────────────────────────────────────

describe('MonthPicker – defaultMonth & defaultYear', () => {
  it('selects the given defaultMonth', async () => {
    const wrapper = mount(MonthPicker, { props: { defaultMonth: 6 } })
    await nextTick()
    const selected = selectedCells(wrapper)
    expect(selected).toHaveLength(1)
    expect(selected[0].text()).toBe('June')
  })

  it('displays the given defaultYear', async () => {
    const wrapper = mount(MonthPicker, { props: { defaultYear: 2020 } })
    await nextTick()
    expect(wrapper.find('.month-picker__year p').text()).toBe('2020')
  })

  it('applies defaultYear passed as a reactive variable (regression: all months inactive)', async () => {
    // Simulate a parent that passes a variable instead of a literal — the prop
    // starts as null and is set after the component is already mounted.
    const wrapper = mount(MonthPicker, {
      props: {
        defaultYear: null,
        defaultMonth: null,
        minDate: new Date(2024, 0, 1), // Jan 2024
      },
    })
    await nextTick()

    // Update to a year that is >= minDate — all months should be active
    await wrapper.setProps({ defaultYear: 2024, defaultMonth: 3 })
    await nextTick()

    expect(wrapper.find('.month-picker__year p').text()).toBe('2024')
    expect(inactiveCells(wrapper).length).toBeLessThan(12)
  })

  it('reacts when defaultMonth prop changes', async () => {
    const wrapper = mount(MonthPicker, { props: { defaultMonth: 1 } })
    await nextTick()
    expect(selectedCells(wrapper)[0].text()).toBe('January')

    await wrapper.setProps({ defaultMonth: 9 })
    await nextTick()
    expect(selectedCells(wrapper)[0].text()).toBe('September')
  })

  it('reacts when defaultYear prop changes', async () => {
    const wrapper = mount(MonthPicker, { props: { defaultYear: 2021 } })
    await nextTick()
    expect(wrapper.find('.month-picker__year p').text()).toBe('2021')

    await wrapper.setProps({ defaultYear: 2025 })
    await nextTick()
    expect(wrapper.find('.month-picker__year p').text()).toBe('2025')
  })
})

// ─── minDate / maxDate ────────────────────────────────────────────────────────

describe('MonthPicker – minDate / maxDate', () => {
  it('marks months before minDate as inactive', async () => {
    // minDate = March 2024 → Jan and Feb should be inactive
    const wrapper = mount(MonthPicker, {
      props: { defaultYear: 2024, minDate: new Date(2024, 2, 1) },
    })
    await nextTick()

    const cells = monthCells(wrapper)
    expect(cells[0].classes()).toContain('inactive') // Jan
    expect(cells[1].classes()).toContain('inactive') // Feb
    expect(cells[2].classes()).not.toContain('inactive') // Mar
  })

  it('marks months after maxDate as inactive', async () => {
    // maxDate = October 2024 → Nov and Dec should be inactive
    const wrapper = mount(MonthPicker, {
      props: { defaultYear: 2024, maxDate: new Date(2024, 9, 31) },
    })
    await nextTick()

    const cells = monthCells(wrapper)
    expect(cells[10].classes()).toContain('inactive') // Nov
    expect(cells[11].classes()).toContain('inactive') // Dec
    expect(cells[9].classes()).not.toContain('inactive')  // Oct
  })

  it('does NOT mark any month inactive when minDate/maxDate are null', async () => {
    const wrapper = mount(MonthPicker, {
      props: { defaultYear: 2024, minDate: null, maxDate: null },
    })
    await nextTick()
    expect(inactiveCells(wrapper)).toHaveLength(0)
  })

  it('cannot select an inactive month', async () => {
    const wrapper = mount(MonthPicker, {
      props: { defaultYear: 2024, minDate: new Date(2024, 2, 1), noDefault: true },
    })
    await nextTick()

    // Click January (inactive)
    await monthCells(wrapper)[0].trigger('click')
    await nextTick()
    expect(selectedCells(wrapper)).toHaveLength(0)
  })
})

// ─── Emits ────────────────────────────────────────────────────────────────────

describe('MonthPicker – emits', () => {
  it('emits change on month click', async () => {
    const wrapper = mount(MonthPicker, { props: { noDefault: true } })
    await nextTick()

    await monthCells(wrapper)[3].trigger('click') // Apr (index 3)
    await nextTick()

    const changeEvents = wrapper.emitted('change')
    expect(changeEvents).toBeTruthy()
    expect(changeEvents![0][0]).toMatchObject({ monthIndex: 4 })
  })

  it('emits input on month click', async () => {
    const wrapper = mount(MonthPicker, { props: { noDefault: true } })
    await nextTick()

    await monthCells(wrapper)[5].trigger('click') // Jun
    await nextTick()

    const inputEvents = wrapper.emitted('input')
    expect(inputEvents).toBeTruthy()
    expect(inputEvents![0][0]).toMatchObject({ monthIndex: 6 })
  })

  it('emits change-year when navigating year forward', async () => {
    const wrapper = mount(MonthPicker, { props: { defaultYear: 2023 } })
    await nextTick()

    const buttons = wrapper.findAll('.month-picker__year button')
    await buttons[1].trigger('click') // › next year
    await nextTick()

    const yearEvents = wrapper.emitted('change-year')
    expect(yearEvents).toBeTruthy()
    expect(yearEvents![0][0]).toBe(2024)
  })

  it('emits change-year when navigating year backward', async () => {
    const wrapper = mount(MonthPicker, { props: { defaultYear: 2023 } })
    await nextTick()

    const buttons = wrapper.findAll('.month-picker__year button')
    await buttons[0].trigger('click') // ‹ prev year
    await nextTick()

    const yearEvents = wrapper.emitted('change-year')
    expect(yearEvents).toBeTruthy()
    expect(yearEvents![0][0]).toBe(2022)
  })

  it('emits clear when clearable month is clicked again', async () => {
    const wrapper = mount(MonthPicker, {
      props: { clearable: true, defaultMonth: 5 },
    })
    await nextTick()

    // Click the already-selected May
    const cells = monthCells(wrapper)
    await cells[4].trigger('click') // May = index 4
    await nextTick()

    expect(wrapper.emitted('clear')).toBeTruthy()
    expect(selectedCells(wrapper)).toHaveLength(0)
  })
})

// ─── Year navigation ──────────────────────────────────────────────────────────

describe('MonthPicker – year navigation', () => {
  it('increments the displayed year', async () => {
    const wrapper = mount(MonthPicker, { props: { defaultYear: 2020 } })
    await nextTick()

    const buttons = wrapper.findAll('.month-picker__year button')
    await buttons[1].trigger('click')
    await nextTick()

    expect(wrapper.find('.month-picker__year p').text()).toBe('2021')
  })

  it('decrements the displayed year', async () => {
    const wrapper = mount(MonthPicker, { props: { defaultYear: 2020 } })
    await nextTick()

    const buttons = wrapper.findAll('.month-picker__year button')
    await buttons[0].trigger('click')
    await nextTick()

    expect(wrapper.find('.month-picker__year p').text()).toBe('2019')
  })
})

// ─── Range mode ───────────────────────────────────────────────────────────────

describe('MonthPicker – range mode', () => {
  it('selects a range across two clicks', async () => {
    const wrapper = mount(MonthPicker, {
      props: { range: true, noDefault: true },
    })
    await nextTick()

    const cells = monthCells(wrapper)
    await cells[1].trigger('click') // Feb = first anchor
    await cells[5].trigger('click') // Jun = second anchor
    await nextTick()

    // Feb–Jun should all be in range
    for (let i = 1; i <= 5; i++) {
      expect(cells[i].classes()).toContain('selected-range')
    }
    expect(cells[1].classes()).toContain('selected-range-first')
    expect(cells[5].classes()).toContain('selected-range-second')
  })

  it('emits change with rangeFrom/rangeTo when range is complete', async () => {
    const wrapper = mount(MonthPicker, {
      props: { range: true, noDefault: true },
    })
    await nextTick()

    const cells = monthCells(wrapper)
    await cells[2].trigger('click') // Mar
    await cells[7].trigger('click') // Aug
    await nextTick()

    const changeEvents = wrapper.emitted('change')
    expect(changeEvents).toBeTruthy()
    const payload = changeEvents![changeEvents!.length - 1][0] as any
    expect(payload.rangeFrom).toBe(2) // 0-based: Mar
    expect(payload.rangeTo).toBe(7)   // 0-based: Aug
  })
})

// ─── Variant / yearOnly ───────────────────────────────────────────────────────

describe('MonthPicker – variant & yearOnly', () => {
  it('applies dark variant class', async () => {
    const wrapper = mount(MonthPicker, { props: { variant: 'dark' } })
    await nextTick()
    expect(wrapper.find('.month-picker__container').classes()).toContain('month-picker--dark')
  })

  it('hides month grid when yearOnly is true', async () => {
    const wrapper = mount(MonthPicker, { props: { yearOnly: true } })
    await nextTick()
    expect(wrapper.find('.month-picker').exists()).toBe(false)
  })
})

// ─── Custom language ──────────────────────────────────────────────────────────

describe('MonthPicker – lang prop', () => {
  it('renders French month names with lang="fr"', async () => {
    const wrapper = mount(MonthPicker, { props: { lang: 'fr', noDefault: true } })
    await nextTick()
    expect(monthCells(wrapper)[0].text()).toBe('Janvier')
    expect(monthCells(wrapper)[5].text()).toBe('Juin')
  })

  it('uses custom months array when provided', async () => {
    const custom = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D']
    const wrapper = mount(MonthPicker, { props: { months: custom, noDefault: true } })
    await nextTick()
    const texts = monthCells(wrapper).map(c => c.text())
    expect(texts).toEqual(custom)
  })
})
