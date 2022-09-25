<template>
    <div>
        <a
            href="https://github.com/kleinrein/vue-month-picker"
            class="github-corner"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="80"
                height="80"
                viewBox="0 0 250 250"
                fill="#151513"
                style="position: absolute; top: 0; left: 0"
            >
                <path fill="#000" d="M250 0L135 115h-15l-12 27L0 250V0z" />
                <path
                    fill="#fff"
                    class="octo-arm"
                    d="M122 109c15-9 9-19 9-19-3-7-2-11-2-11 1-7-3-2-3-2-4 5-2 11-2 11 3 10-5 15-9 16"
                    style="
                        -webkit-transform-origin: 120px 144px;
                        transform-origin: 120px 144px;
                    "
                />
                <path
                    fill="#fff"
                    class="octo-body"
                    d="M135 115s-4 2-5 0l-14-14c-3-2-6-3-8-3 8-11 15-24-2-41-5-5-10-7-16-7-1-2-3-7-12-11 0 0-5 3-7 16-4 2-8 5-12 9s-7 8-9 12c-14 4-17 9-17 9 4 8 9 11 11 11 0 6 2 11 7 16 16 16 30 10 41 2 0 3 1 7 5 11l12 11c1 2-1 6-1 6z"
                />
            </svg>
        </a>

        <div class="content">
            <h1>vue-month-picker</h1>

            <h2>Parameters</h2>

            <div class="form__container">
                <label class="form__label">
                    show-year
                    <input
                        v-model="showYear"
                        class="form__input"
                        type="checkbox"
                    />
                </label>

                <label class="form__label">
                    clearable
                    <input
                        v-model="isClearable"
                        class="form__input"
                        type="checkbox"
                    />
                </label>

                <label class="form__label">
                    editable-year
                    <input
                        v-model="isEditableYear"
                        class="form__input"
                        type="checkbox"
                    />
                </label>

                <label class="form__label">
                    year-only
                    <input
                        v-model="isYearOnly"
                        class="form__input"
                        type="checkbox"
                    />
                </label>

                <label class="form__label">
                    range
                    <input
                        v-model="isRange"
                        class="form__input"
                        type="checkbox"
                    />
                </label>

                <label class="form__label">
                    max date
                    <input v-model="maxDate" class="form__input" type="date" />
                </label>

                <label class="form__label">
                    min date
                    <input v-model="minDate" class="form__input" type="date" />
                </label>

                <label class="form__label">
                    date format
                    <input
                        v-model="dateFormat"
                        class="form__input"
                        type="text"
                    />
                </label>

                <br />

                <label class="form__label">
                    variant
                    <div>
                        <div
                            v-for="variant in variants"
                            :key="`variant-${variant}`"
                        >
                            <input
                                :id="variant"
                                v-model="selectedVariant"
                                type="radio"
                                name="variant"
                                :value="variant"
                            />
                            <label :for="variant">{{ variant }}</label>
                        </div>
                    </div>
                </label>

                <label class="form__label">
                    lang
                    <select v-model="selectedLang" class="form__input">
                        <option
                            v-for="(lang, langKey) in languages"
                            :key="`language-${langKey}`"
                            :value="langKey"
                        >
                            {{ langKey }}
                        </option>
                    </select>
                </label>
            </div>

            <h3>Inline</h3>
            <strong>@change: string date</strong>
            <div>
                <pre>{{ date }}</pre>
            </div>
            <strong>
                @clear
                <em>{{ clearEmittedText }}</em>
            </strong>

            <br / />
            <br / />
            <month-picker
                :lang="selectedLang"
                :clearable="isClearable"
                :editable-year="isEditableYear"
                :variant="selectedVariant"
                :show-year="showYear"
        :highlight-exact-date="highlightExactDate"
                :max-date="maxDate !== null ? new Date(maxDate) : null"
                :min-date="minDate !== null ? new Date(minDate) : null"
                :year-only="isYearOnly"
                :range="isRange"
                :default-month-range="[2, 4]"
                @change="showDate"
                @change-year="(v) => ((year = v))"
                @clear="showClearText"
            />
            <br / />
            <br / />

            <h3>Input</h3>
            <month-picker-input
                :lang="selectedLang"
                :clearable="isClearable"
                :editable-year="isEditableYear"
                :variant="selectedVariant"
                :show-year="showYear"
                :max-date="maxDate !== null ? new Date(maxDate) : null"
                :min-date="minDate !== null ? new Date(minDate) : null"
                :year-only="isYearOnly"
                :default-month="8"
                :date-format="dateFormat"
                :default-year="2020"
                :input-pre-filled="true"
                :range="isRange"
                @change="showDate"
            />
        </div>
    </div>
</template>

<script>
import languages from '@/languages'

import MonthPicker from '@/MonthPicker.vue'
import MonthPickerInput from '@/MonthPickerInput.vue'

export default {
    components: {
        MonthPicker,
        MonthPickerInput,
    },
    data() {
        return {
            clearEmittedText: null,
            showYear: true,
            isYearOnly: false,
            isRange: false,
            isMonthPickerVisible: false,
            isClearable: false,
            isEditableYear: false,
            dateFormat: null,
            maxDate: null,
            minDate: null,
            variants: ['default', 'dark'],
            selectedVariant: 'default',
            selectedDate: null,
            selectedLang: 'en',
            year: 0,
            date: {
                from: null,
                to: null,
                month: null,
                year: null,
            },
        }
    },
    computed: {
        languages: function () {
            return languages
        },
    },
    methods: {
        showClearText() {
            this.clearEmittedText = 'emitted'
            window.setTimeout(() => {
                this.clearEmittedText = null
            }, 1000)
        },
        showDate(date) {
            this.date = date
        },
    },
}
</script>

<style>
:root {
    background-color: #efefef;
}
</style>

<style scoped>
@import url('https://fonts.googleapis.com/css?family=Oxygen&display=swap');

.content {
    max-width: 800px;
    margin: 0 auto;
    font-family: 'Oxygen', sans-serif;
}

.content h1 {
    margin-bottom: 2em;
    letter-spacing: 2px;
    text-shadow: 2px 4px 10px #e4e4e4;
}

.github-corner:hover .octo-arm {
    animation: octocat-wave 560ms ease-in-out;
}

.form__container {
    padding: 0.25rem 0;
}

.form__label {
    display: grid;
    grid-template-columns: 3fr 2fr;
    width: 20rem;
    padding: 0.25rem;
    border-radius: 5px;
}

.form__label input[type='checkbox'] {
    width: 1rem;
    height: 1rem;
}

.form__label:hover {
    background-color: #f7f7f7;
}

.form__label select {
    padding: 0 2rem;
}

pre {
    font-family: monospace;
    font-size: 1rem;
    font-weight: 600;
    color: #313131;
}

@keyframes octocat-wave {
    0% {
        transform: rotate(0deg);
    }

    20% {
        transform: rotate(-25deg);
    }

    40% {
        transform: rotate(10deg);
    }

    60% {
        transform: rotate(-25deg);
    }

    80% {
        transform: rotate(10deg);
    }

    100% {
        transform: rotate(0deg);
    }
}

@media (max-width: 500px) {
    .github-corner:hover .octo-arm {
        animation: none;
    }

    .github-corner .octo-arm {
        animation: octocat-wave 560ms ease-in-out;
    }
}
</style>
