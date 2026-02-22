<script setup lang="ts">
import { ref } from 'vue'
import MonthPicker from './components/MonthPicker.vue'
import MonthPickerInput from './components/MonthPickerInput.vue'
import type { IDateResult } from './interfaces'

const defaultDate = ref<IDateResult | null>(null)
const rangeDate = ref<IDateResult | null>(null)
const inputDate = ref<IDateResult | null>(null)

const month = ref(new Date().getMonth() + 1)
const year = ref(new Date().getFullYear())

function fmt(d: IDateResult | null): string {
  if (!d) return '—'
  if (d.rangeFromMonth) return `${d.rangeFromMonth} – ${d.rangeToMonth}, ${d.year}`
  return `${d.month} ${d.year}`
}
</script>

<template>
  <div class="page">

    <!-- Header -->
    <header class="page-header">
      <div class="header-inner">
        <div class="header-title">
          <h1>vue-month-picker</h1>
          <span class="badge">v2.0.0</span>
          <span class="badge badge--vue">Vue 3</span>
        </div>
        <p class="header-sub">A lightweight, dependency-free month picker for Vue 3</p>
      </div>
    </header>

    <main class="page-main">

      <!-- Row 1 -->
      <div class="demo-grid">

        <div class="card">
          <div class="card-label">Default</div>
          <MonthPicker @change="defaultDate = $event" />
          <div class="output">
            <span class="output-key">selected</span>
            <span class="output-val">{{ fmt(defaultDate) }}</span>
          </div>
        </div>

        <div class="card">
          <div class="card-label">No default · Clearable</div>
          <MonthPicker :no-default="true" :clearable="true" />
        </div>

        <div class="card">
          <div class="card-label">Min / Max date</div>
          <MonthPicker
            :min-date="new Date(2024, 2, 1)"
            :max-date="new Date(2024, 9, 31)"
            :default-year="2024"
            :default-month="6"
          />
        </div>

        <div class="card">
          <div class="card-label">Range selection</div>
          <MonthPicker
            :range="true"
            :default-month-range="[1, 5]"
            :default-year="year"
            @change="rangeDate = $event"
          />
          <div class="output">
            <span class="output-key">range</span>
            <span class="output-val">{{ fmt(rangeDate) }}</span>
          </div>
        </div>

        <div class="card">
          <div class="card-label">Year only</div>
          <MonthPicker :year-only="true" />
        </div>

        <div class="card">
          <div class="card-label">Editable year</div>
          <MonthPicker :editable-year="true" :no-default="true" />
        </div>

      </div>

      <!-- Dark section -->
      <div class="dark-section">
        <div class="section-label">Dark variant</div>
        <div class="demo-grid demo-grid--dark">

          <div class="card card--dark">
            <div class="card-label card-label--dark">Default</div>
            <MonthPicker variant="dark" />
          </div>

          <div class="card card--dark">
            <div class="card-label card-label--dark">Range selection</div>
            <MonthPicker variant="dark" :range="true" :default-month-range="[2, 7]" :default-year="year" />
          </div>

          <div class="card card--dark">
            <div class="card-label card-label--dark">Min / Max date</div>
            <MonthPicker
              variant="dark"
              :min-date="new Date(2024, 2, 1)"
              :max-date="new Date(2024, 9, 31)"
              :default-year="2024"
              :default-month="5"
            />
          </div>

        </div>
      </div>

      <!-- Input section -->
      <div class="section-label" style="margin-bottom: 1rem;">MonthPickerInput</div>
      <div class="demo-grid">

        <div class="card">
          <div class="card-label">Default format</div>
          <MonthPickerInput
            :no-default="true"
            placeholder="Select a month…"
            @input="inputDate = $event"
          />
          <div class="output">
            <span class="output-key">selected</span>
            <span class="output-val">{{ fmt(inputDate) }}</span>
          </div>
        </div>

        <div class="card">
          <div class="card-label">Pre-filled · %m/%Y</div>
          <MonthPickerInput
            :input-pre-filled="true"
            :default-month="month"
            :default-year="year"
            date-format="%m/%Y"
          />
        </div>

        <div class="card">
          <div class="card-label">Dark · pre-filled</div>
          <MonthPickerInput
            :default-year="2024"
            :default-month="6"
            :input-pre-filled="true"
            variant="dark"
          />
        </div>

      </div>

      <!-- Languages -->
      <div class="section-label" style="margin-bottom: 1rem;">Languages</div>
      <div class="demo-grid">
        <div class="card" v-for="l in [{ code: 'fr', label: 'French' }, { code: 'de', label: 'German' }, { code: 'ja', label: 'Japanese' }]" :key="l.code">
          <div class="card-label">{{ l.label }}</div>
          <MonthPicker :lang="l.code" :no-default="true" />
        </div>
      </div>

    </main>
  </div>
</template>

<style>
*, *::before, *::after { box-sizing: border-box; }

body {
  margin: 0;
  background: #f4f6f9;
  color: #1a1a1a;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
}

/* ── Header ─────────────────────────────────────────────────────────────────── */

.page-header {
  background: #fff;
  border-bottom: 1px solid #e8eaed;
  padding: 2rem 0 1.75rem;
}

.header-inner {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 2rem;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 0.4rem;
}

.header-title h1 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.badge {
  display: inline-flex;
  align-items: center;
  padding: 0.2em 0.55em;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 600;
  background: #eef2ff;
  color: #4362c8;
  letter-spacing: 0.01em;
}

.badge--vue {
  background: #e8f5e9;
  color: #2e7d32;
}

.header-sub {
  margin: 0;
  font-size: 0.9rem;
  color: #666;
}

/* ── Main ───────────────────────────────────────────────────────────────────── */

.page-main {
  max-width: 1100px;
  margin: 0 auto;
  padding: 2.5rem 2rem 4rem;
}

/* ── Section labels ─────────────────────────────────────────────────────────── */

.section-label {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #888;
  margin-bottom: 1.25rem;
  margin-top: 2.5rem;
}

/* ── Card grid ──────────────────────────────────────────────────────────────── */

.demo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.25rem;
  margin-bottom: 1.5rem;
}

.card {
  background: #fff;
  border-radius: 12px;
  padding: 1.25rem 1.25rem 1rem;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04);
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}

.card-label {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #888;
}

/* Make pickers fill the card width */
.card .month-picker__container {
  width: 100%;
}

.card .month-picker-input-container {
  width: 100%;
}

/* ── Output chip ────────────────────────────────────────────────────────────── */

.output {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  padding: 0.45rem 0.7rem;
  background: #f4f6f9;
  border-radius: 6px;
}

.output-key {
  font-weight: 600;
  color: #888;
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.output-val {
  color: #1a1a1a;
  font-weight: 500;
}

/* ── Dark section ───────────────────────────────────────────────────────────── */

.dark-section {
  background: #1a1a2e;
  border-radius: 16px;
  padding: 1.5rem 1.5rem 1.75rem;
  margin-bottom: 1.5rem;
  margin-top: 1rem;
}

.dark-section .section-label {
  color: #888;
  margin-top: 0;
}

.demo-grid--dark {
  margin-bottom: 0;
}

.card--dark {
  background: #242438;
  box-shadow: 0 1px 4px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.05);
}

.card-label--dark {
  color: #666;
}

@media (max-width: 600px) {
  .demo-grid {
    grid-template-columns: 1fr;
  }
}
</style>
