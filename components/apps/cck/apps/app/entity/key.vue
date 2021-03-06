<template>
	<div>
		<div class="row flex-wrap">
			<div class="col-12 col-md-6 col-lg-4">
				<v-text-field
					v-mask="mask"
					label="key"
					:value="key.key"
					dense
					outlined
					hide-details
					@input="update('key', $event)"
				></v-text-field>
			</div>
			<div class="col-12 col-md-6 col-lg-4">
				<v-autocomplete
					label="type"
					:value="key.type"
					:items="types"
					dense
					outlined
					hide-details
					@input="update('type', $event)"
				></v-autocomplete>
			</div>
			<div class="col-12 col-md-6 col-lg-4">
				<v-select
					label="fields"
					:value="key.fields"
					:items="optionsList"
					multiple
					small-chips
					dense
					outlined
					hide-details
					@input="update('fields', $event.length ? $event : null)"
				></v-select>
			</div>
			<div class="col-12 col-md-6 col-lg-4">
				<v-text-field
					label="name"
					:value="key.name"
					dense
					outlined
					hide-details
					@input="update('name', $event)"
				></v-text-field>
			</div>
			<div class="col-12 col-md-6 col-lg-4">
				<v-text-field
					label="description"
					:value="key.description"
					dense
					outlined
					hide-details
					@input="update('description', $event)"
				></v-text-field>
			</div>
		</div>
		<references
			v-if="key.type === 'FOREIGN'"
			:value="key.references"
			:entities="entities"
			@input="update('references', $event)"
		></references>
		<div class="mt-1"><v-btn color="error" small @click="$emit('delete')">Delete</v-btn></div>
	</div>
</template>
<script>
import { cloneDeep, set, tap } from 'lodash';
import references from './key/references.vue';

export default {
	components: { references },
	props: ['value', 'options', 'entities', 'havePrimary'],
	data: () => ({
		mask: {
			mask: '????????????????????????????????',
			tokens: { '?': { pattern: /[0-9a-zA-Z_]/ } },
		},
	}),
	computed: {
		key: {
			get() {
				return this.value;
			},
			set(value) {
				this.$emit('input', value);
			},
		},
		optionsList() {
			return this.options ? this.options.map((option) => option.field) : [];
		},
		types() {
			let types = ['STATIC'];
			if (!this.havePrimary || this.key.type === 'PRIMARY') {
				types.push('PRIMARY');
			}
			return types.concat(['UNIQUE', 'FOREIGN']);
		},
	},
	methods: {
		update(key, value) {
			this.$emit(
				'input',
				tap(cloneDeep(this.key), (v) => set(v, key, value))
			);
		},
	},
};
</script>
