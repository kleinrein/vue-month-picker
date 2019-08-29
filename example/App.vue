<template>
	<div>
		<a href="https://github.com/kleinrein/vue-month-picker" class="github-corner">
			<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 250 250" fill="#151513" style="position: absolute; top: 0; left: 0">
				<path fill="#000" d="M250 0L135 115h-15l-12 27L0 250V0z"/>
				<path fill="#fff" class="octo-arm" d="M122 109c15-9 9-19 9-19-3-7-2-11-2-11 1-7-3-2-3-2-4 5-2 11-2 11 3 10-5 15-9 16" style="-webkit-transform-origin: 120px 144px; transform-origin: 120px 144px"/>
				<path fill="#fff" class="octo-body" d="M135 115s-4 2-5 0l-14-14c-3-2-6-3-8-3 8-11 15-24-2-41-5-5-10-7-16-7-1-2-3-7-12-11 0 0-5 3-7 16-4 2-8 5-12 9s-7 8-9 12c-14 4-17 9-17 9 4 8 9 11 11 11 0 6 2 11 7 16 16 16 30 10 41 2 0 3 1 7 5 11l12 11c1 2-1 6-1 6z"/>
			</svg>
		</a>

		<div class="content">
			<h1>vue-month-picker</h1>

			<h4>Inline</h4>
			<strong>@change: string date</strong>
			<p>{{ date }}</p>
			<strong>@clear <em>{{ clearEmittedText }}</em></strong>

			<br><br>
			<month-picker
				@change="showDate"
				@change-year="(v) => year = v"
				@clear="showClearText"
				lang="en"
				clearable
				variant="default"
			>
			</month-picker>
			<br><br>

			<month-picker
				@change="showDate"
				@change-year="(v) => year = v"
				@clear="showClearText"
				lang="en"
				clearable
				variant="dark"
			>
			</month-picker>
			
			<h4>Input</h4>
			<month-picker-input
				:no-default="true"
			>
			</month-picker-input>
		</div>
	</div>
</template>

<script>
import MonthPicker from '@/MonthPicker.vue'
import MonthPickerInput from '@/MonthPickerInput.vue'

export default {
	data() {
		return {
			year: 0,
			clearEmittedText: null,
			isMonthPickerVisible: false,
			selectedDate: null,
			date: {
				from: null,
				to: null,
				month: null,
				year: null
			}
		}
	},
	components: {
		MonthPicker,
		MonthPickerInput
	},
	methods: {
		showClearText () {
			this.clearEmittedText = 'emitted'
			window.setTimeout(() => {
				this.clearEmittedText = null
			}, 1000)
		},
		showDate (date) {
			this.date = date
		}
	}
}
</script>

<style scoped>
	@import url('https://fonts.googleapis.com/css?family=Lato');

	.content {
		max-width: 800px;
		margin: 0 auto;
		font-family: 'Lato', sans-serif;
	}

	.content h1 {
		margin-bottom: 2em;
		letter-spacing: 2px;
	}

	.github-corner:hover .octo-arm {
		animation: octocat-wave 560ms ease-in-out;
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