[![NPM version](https://img.shields.io/npm/v/vue-month-picker.svg?style=for-the-badge)](https://www.npmjs.com/package/vue-month-picker)
[![NPM downloads](https://img.shields.io/npm/dm/vue-month-picker.svg?style=for-the-badge)](https://www.npmjs.com/package/vue-month-picker)


# vue-month-picker

A lightweight month picker for Vue.js.

<img src="https://i.imgur.com/JZHRo3g.png" width="300">

## Install
npm
```bash
npm install --save vue-month-picker
```
yarn
```bash
yarn add --save vue-month-picker
```

## Usage

### Bundler (Webpack, Rollup)

```js
import Vue from 'vue'
import MonthPicker from 'vue-month-picker'
import MonthPickerInput from 'vue-month-picker'

Vue.use(MonthPicker)
Vue.use(MonthPickerInput)
```

### Examples

**Input**
```vue
<template>
  <month-picker-input :no-default="true"></month-picker-input>
</template>

<script>
import MonthPickerInput from 'vue-month-picker'

export default {
	components: {
		MonthPickerInput
	}
}
</script>
```

**Inline**
```vue
<template>
	<p>{{ date.month }}</p>
  <month-picker @change="showDate"></month-picker>
</template>

<script>
import MonthPicker from 'vue-month-picker'

export default {
	data() {
		return {
			date: {
				from: null,
				to: null,
				month: null,
				year: null
			}
		}
	},
	components: {
		MonthPicker
	},
	methods: {
		showDate (date) {
			this.date = date
		}
	}
}
</script>
```

## Api

### Props 

_The MonthPicker and the MonthPickerInput shares the same props._

###### _(Type): (default)_

**lang** _String: en_

The language of the months. 
Valid values: en, no.

**months** _Array_

If your language is not supported you can supply your own array of months here.

**default-month** _Number: 0_

The default selected month of the month picker. To show the month picker unselected, use the no-default prop.

**default-year** _Number: this year_

The default year of the month picker.

**no-default** _Boolean: false_

Show the month picker unselected.

**show-year** _Boolean: true_

Show the year picker.

### Events

**@change** _Object_

Indicates that the value has been changed. NB, this will fire when a default value has been selected when the month picker is mounted. Use the input event if you want the value the user has selected.


**@input** _Object_

Indicates that the value has been changed by the user.

#### _Date object_

Both events returns a date object with the following properties:
- ```from```: Start of the month.
- ```to```: End of the month.
- ```month```: Selected month.
- ```monthIndex```: Selected month index.
- ```year```: Selected year.

## Contributing

1. Fork it!
2. Create your feature branch: git checkout -b my-new-feature
3. Commit your changes: git commit -am 'Add some feature'
3. Push to the branch: git push origin my-new-feature
4. Submit a pull request

## Development

[Poi](https://poi.js.org/) was used to develop this component.

```bash
poi
```

## License
[The MIT License (MIT)](https://opensource.org/licenses/MIT)
