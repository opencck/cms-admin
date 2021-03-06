<template>
	<div>
		<div class="row flex-wrap">
			<div class="col-12 col-md-4">
				<v-select
					label="field"
					:value="relation.field"
					:items="optionsList"
					dense
					outlined
					hide-details
					@input="update('field', $event)"
				></v-select>
			</div>
			<div class="col-12 col-md-4">
				<v-autocomplete
					label="entity"
					:value="relation.entity"
					:items="entitiesList"
					dense
					outlined
					hide-details
					@input="update('entity', $event)"
				></v-autocomplete>
			</div>
			<div class="col-12 col-md-4">
				<v-autocomplete
					label="key"
					:value="relation.key"
					:items="keysList"
					dense
					outlined
					hide-details
					@input="update('key', $event)"
				></v-autocomplete>
			</div>
			<div class="col-12 col-md-6 col-lg-4">
				<v-text-field
					label="name"
					:value="relation.name"
					dense
					outlined
					hide-details
					@input="update('name', $event)"
				></v-text-field>
			</div>
			<div class="col-12 col-md-6 col-lg-4">
				<v-text-field
					label="description"
					:value="relation.description"
					dense
					outlined
					hide-details
					@input="update('description', $event)"
				></v-text-field>
			</div>
			<div class="col-12 col-md-4">
				<v-select
					v-model="isMultiple"
					label="multiple"
					:items="[
						{ value: false, text: 'One to many' },
						{ value: true, text: 'Many to many' },
					]"
					dense
					outlined
					hide-details
				></v-select>
			</div>
		</div>
		<app-entity
			v-if="relation.multiple"
			:value="relation.multiple"
			:entities="entities"
			@input="update('multiple', $event)"
		></app-entity>
		<div class="mt-1"><v-btn color="error" small @click="$emit('delete')">Delete</v-btn></div>
		<pre>{{ relation }}</pre>
	</div>
</template>
<script>
import { cloneDeep, set, tap } from 'lodash';

export default {
	props: ['value', 'options', 'entities', 'havePrimary'],
	data: () => ({
		mask: {
			mask: '????????????????????????????????',
			tokens: { '?': { pattern: /[0-9a-zA-Z_]/ } },
		},
		isMultiple: false,
	}),
	computed: {
		relation: {
			get() {
				return this.value;
			},
			set(value) {
				this.$emit('input', value);
			},
		},
		optionsList() {
			return this.options ? this.options.map((option) => option.field || '') : [];
		},
		appEntities() {
			let entities = cloneDeep(this.entities) || [];
			let recursiveEntities = (arr) =>
				arr.forEach((entity) => {
					entities.push(entity);
					if (entity.relations)
						entity.relations.forEach((relation) => {
							if (relation.multiple) recursiveEntities([relation.multiple]);
						});
				});
			recursiveEntities(entities);
			return entities;
		},
		entitiesList() {
			return this.appEntities.map((entity) => entity.entity || '');
		},
		keysList() {
			let entity = this.appEntities.find((entity) => entity.entity === this.relation.entity);
			return entity && entity.options ? entity.options.map((option) => option.field || '') : [];
		},
	},
	watch: {
		isMultiple(value) {
			this.update(
				'multiple',
				value
					? {
							entity: '',
							name: '',
							description: '',
							options: [],
							keys: [],
							relations: [],
							...(this.relation.multiple || {}),
					  }
					: null
			);
		},
	},
	created() {
		this.isMultiple = !!this.relation.multiple;
	},
	methods: {
		update(key, value) {
			let relation = cloneDeep(this.relation);
			if (key === 'multiple') {
				relation = tap(relation, (v) => set(v, 'entity', value.entity));
			}
			if (key === 'entity') {
				relation = tap(relation, (v) => set(v, 'key', ''));
			}
			this.$emit(
				'input',
				tap(relation, (v) => set(v, key, value))
			);
		},
	},
};
</script>
