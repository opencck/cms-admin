<template>
	<div>
		<div class="row flex-wrap">
			<div class="col-12 col-md-6 col-lg-4">
				<v-text-field
					v-mask="mask"
					label="field"
					:value="option.field"
					:autofocus="!option.field"
					dense
					outlined
					hide-details
					@input="update('field', $event)"
				></v-text-field>
			</div>
			<div class="col-12 col-md-6 col-lg-4">
				<v-autocomplete
					v-model="type.type"
					label="type"
					:items="types"
					dense
					outlined
					hide-details
				></v-autocomplete>
			</div>
			<div v-if="sizedTypes.includes(type.type)" class="col-12 col-md-6 col-lg-4">
				<v-text-field v-model="type.size" label="size" dense outlined hide-details></v-text-field>
			</div>
			<div v-if="signedTypes.includes(type.type)" class="col-12 col-md-6 col-lg-4">
				<v-select
					v-model="type.additional"
					label="additional"
					:items="additionals"
					dense
					outlined
					hide-details
				></v-select>
			</div>
			<div class="col-12 col-md-6 col-lg-4">
				<v-autocomplete
					label="null"
					:value="option.null"
					:items="nulls"
					dense
					outlined
					hide-details
					@input="update('null', $event)"
				></v-autocomplete>
			</div>
			<div class="col-12 col-md-6 col-lg-4">
				<v-combobox
					label="default"
					:value="option.default"
					:items="defaults"
					dense
					outlined
					hide-details
					@input="update('default', $event ? $event.value : null)"
				></v-combobox>
			</div>
			<div
				v-if="signedTypes.includes(type.type) && (!haveAutoIncrement || option.auto_increment === 1)"
				class="col-12 col-md-6 col-lg-4"
			>
				<v-checkbox
					:value="1"
					:input-value="option.auto_increment"
					label="AUTO_INCREMENT"
					class="mt-2"
					color="red"
					dense
					hide-details
					@click="update('auto_increment', option.auto_increment === 1 ? 0 : 1)"
				></v-checkbox>
			</div>
		</div>
		<option-view :value="option.view" @input="update('view', $event)"></option-view>
		<div class="mt-1"><v-btn color="error" small @click="$emit('delete')">Delete</v-btn></div>
	</div>
</template>
<script>
import { cloneDeep, set, tap } from 'lodash';
import optionView from './option/view.vue';

export default {
	components: {
		optionView,
	},
	props: ['value', 'haveAutoIncrement'],
	data: () => ({
		type: {
			type: '',
			size: '',
			additional: '',
		},
		types: [
			'tinyint',
			'smallint',
			'mediumint',
			'int',
			'bigint',
			'float',
			'double',
			'char',
			'varchar',
			'text',
			'mediumtext',
			'longtext',
			'date',
			'datetime',
			'timestamp',
			'time',
			'enum',
			'boolean',
		],
		sizedTypes: ['tinyint', 'smallint', 'mediumint', 'int', 'bigint', 'float', 'double', 'char', 'varchar', 'enum'],
		signedTypes: ['tinyint', 'smallint', 'mediumint', 'int', 'bigint'],
		additionals: ['', 'unsigned'],
		nulls: ['', 'NULL', 'NOT NULL'],
		defaults: [
			{
				text: "''",
				value: "''",
			},
			{
				text: 'CURRENT_TIMESTAMP',
				value: 'CURRENT_TIMESTAMP',
			},
		],
		mask: {
			mask: '????????????????',
			tokens: { '?': { pattern: /[0-9a-zA-Z_]/ } },
		},
	}),
	computed: {
		option: {
			get() {
				return this.value;
			},
			set(value) {
				this.$emit('input', value);
			},
		},
	},
	watch: {
		type: {
			deep: true,
			handler(type) {
				let option = { ...this.option };
				option.type =
					type.type +
					(this.sizedTypes.includes(type.type) ? type.size : '') +
					(this.signedTypes.includes(type.type) ? (type.additional ? ' ' + type.additional : '') : '');
				this.$emit('input', option);
			},
		},
	},
	created() {
		let [type, additional] = this.option.type ? this.option.type.split(' ') : ['', ''];
		let matchSize = type.match(/\((.*?)\)/) || [''];
		this.type.size = matchSize ? matchSize[0] : '';
		this.type.type = type.replace(matchSize[0], '');
		this.type.additional = additional;
	},
	methods: {
		update(key, value) {
			this.$emit(
				'input',
				tap(cloneDeep(this.option), (v) => set(v, key, value))
			);
		},
	},
};
</script>
