<template>
	<div>
		<div class="row flex-wrap">
			<div class="col-12 col-md-4 col-lg-3">
				<v-text-field
					label="label"
					:value="fieldSet.label"
					:autofocus="!fieldSet.label"
					dense
					outlined
					hide-details
					@input="update('label', $event)"
				></v-text-field>
			</div>
			<div class="col-12 col-md-4 col-lg-3">
				<v-text-field
					label="description"
					:value="fieldSet.description"
					dense
					outlined
					hide-details
					@input="update('description', $event)"
				></v-text-field>
			</div>
			<div v-if="type === 'items'" class="col-12 col-md-4 col-lg-3">
				<v-combobox
					label="group"
					:value="fieldSet.group"
					:items="fieldsList"
					small-chips
					multiple
					dense
					outlined
					hide-details
					@input="update('group', $event)"
				></v-combobox>
			</div>
			<div v-if="type === 'items'" class="col-12 col-md-4 col-lg-3">
				<v-combobox
					label="order"
					:value="fieldSet.order"
					:items="orderFieldsList"
					dense
					outlined
					hide-details
					@input="update('order', $event)"
				></v-combobox>
			</div>
			<div v-if="type === 'items'" class="col-12 col-md-4 col-lg-3">
				<v-select
					label="orderDirection"
					:value="fieldSet.orderDirection"
					:items="['ASC', 'DESC']"
					dense
					outlined
					hide-details
					@input="update('orderDirection', $event)"
				></v-select>
			</div>
			<div class="col-12">
				<div class="fields">
					<v-expansion-panels v-model="selectedField" accordion multiple focusable>
						<draggable
							v-model="fields"
							class="d-flex flex-wrap"
							handle=".fields-handle"
							style="width: 100%"
						>
							<v-expansion-panel v-for="(field, index) in fields" :key="index">
								<v-tooltip :disabled="!(field.view && field.view.description)" bottom>
									<template v-slot:activator="{ on, attrs }">
										<v-expansion-panel-header
											v-bind="attrs"
											class="flex-wrap fields-handle"
											ripple
											v-on="on"
										>
											<span>
												{{ field.alias || field.field ? field.entity + '.' + field.field : '' }}
											</span>
											<span v-if="field.type === 'custom' && field.select" class="green--text">
												{{ field.select }}
											</span>
										</v-expansion-panel-header>
									</template>
									<span v-if="field.view && field.view.description">
										{{ field.view.description }}
									</span>
								</v-tooltip>
								<v-expansion-panel-content class="pa-md-2">
									<field-set-field
										:value="field"
										:entities="entities"
										:entity="entity"
										:type="type"
										@input="setField($event, index)"
										@delete="delField(index)"
									></field-set-field>
								</v-expansion-panel-content>
							</v-expansion-panel>
						</draggable>
					</v-expansion-panels>
					<v-btn color="primary" class="white--text mt-3" @click="addField">Add field</v-btn>
				</div>
			</div>
		</div>
		<div class="mt-1"><v-btn color="error" small @click="$emit('delete')">Delete fieldset</v-btn></div>
	</div>
</template>
<script>
import { cloneDeep, set, tap } from 'lodash';
import fieldSetField from './fieldSet/field.vue';

export default {
	components: { 'field-set-field': fieldSetField },
	props: ['value', 'entities', 'entity', 'type'],
	data: () => ({
		selectedField: [],
	}),
	computed: {
		fieldSet: {
			get() {
				return this.value;
			},
			set(value) {
				this.$emit('input', value);
			},
		},
		fields: {
			get() {
				return this.value.fields || [];
			},
			set(value) {
				this.update(
					'fields',
					value.map((field, index) => ({ ...field, ordering: index }))
				);
			},
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
		fieldsList() {
			let entity = this.appEntities.find((entity) => entity.entity === this.entity);

			let fields = entity ? entity.options.map((option) => entity.entity + '.' + option.field) : [];
			this.appEntities.forEach((entity) => {
				entity.relations.forEach((relation) => {
					if (!relation.multiple && relation.entity === this.entity) {
						entity.options.forEach((option) => fields.push(entity.entity + '.' + option.field));
					}
				});
			});
			return fields;
		},
		orderFieldsList() {
			return this.fieldSet.fields.reduce(
				(result, field) => result.concat(field.sortable ? [field.alias] : []),
				[]
			);
		},
	},
	watch: {
		entity() {
			this.update('fields', []);
		},
	},
	methods: {
		update(key, value) {
			this.$emit(
				'input',
				tap(cloneDeep(this.fieldSet), (v) => set(v, key, value))
			);
		},
		setField(field, index) {
			let fields = cloneDeep(this.fields);
			fields.splice(index, 1, field);
			this.update('fields', fields);
		},
		delField(index) {
			let fields = cloneDeep(this.fields);
			fields.splice(index, 1);
			this.update('fields', fields);
		},
		addField() {
			let fields = cloneDeep(this.fields);
			fields.push({
				entity: '',
				field: '',
				alias: '',
				type: 'default',
				select: '',
				description: '',
				sortable: true,
				view: {
					type: 'default',
					label: '',
					description: '',
				},
			});
			this.update('fields', fields);
			this.selectedField.push(this.fields.length);
		},
	},
};
</script>
