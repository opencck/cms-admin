<template>
	<div class="options">
		<v-expansion-panels v-model="selectedOption" accordion multiple focusable>
			<draggable v-model="options" class="d-flex flex-wrap" handle=".options-handle" style="width: 100%">
				<v-expansion-panel v-for="(option, index) in options" :key="index">
					<v-tooltip :disabled="!option.type" bottom>
						<template v-slot:activator="{ on, attrs }">
							<v-expansion-panel-header v-bind="attrs" class="flex-wrap options-handle" ripple v-on="on">
								<span>
									{{ option.text }}
								</span>
								<span class="ma-1 yellow--text">{{ option.type }}</span>
								<span class="ma-1 orange--text">{{ option.value }}</span>
							</v-expansion-panel-header>
						</template>
						<span v-if="option.type">
							{{ option.type }}
						</span>
					</v-tooltip>
					<v-expansion-panel-content class="pa-md-2">
						<options-option
							:value="option"
							@input="setOption($event, index)"
							@delete="delOption(index)"
						></options-option>
					</v-expansion-panel-content>
				</v-expansion-panel>
			</draggable>
		</v-expansion-panels>
		<v-btn color="primary" class="white--text mt-3" @click="addOption">Add option</v-btn>
	</div>
</template>
<script>
import { cloneDeep /*set, tap*/ } from 'lodash';
import optionsOption from './options/option.vue';

export default {
	components: {
		optionsOption,
	},
	props: {
		value: {
			type: Array,
			default() {
				return [];
			},
		},
	},
	data: () => ({
		selectedOption: [],
	}),
	computed: {
		options: {
			get() {
				return this.value;
			},
			set(value) {
				this.$emit('input', value);
			},
		},
	},
	methods: {
		setOption(option, index) {
			let options = cloneDeep(this.options);
			options.splice(index, 1, option);
			this.$emit('input', options);
		},
		delOption(index) {
			let options = cloneDeep(this.options);
			options.splice(index, 1);
			this.$emit('input', options);
		},
		addOption() {
			let options = cloneDeep(this.options);
			options.push({
				type: 'string',
				value: '',
				text: '',
			});
			this.$emit('input', options);
			this.selectedOption.push(this.options.length);
		},
	},
};
</script>
