<template>
	<div class="fieldSets">
		<v-expansion-panels v-model="selectedFieldset" accordion multiple focusable>
			<draggable v-model="fieldSets" class="d-flex flex-wrap" handle=".fieldSets-handle" style="width: 100%">
				<v-expansion-panel v-for="(fieldSet, index) in fieldSets" :key="index">
					<v-tooltip :disabled="!fieldSet.description" bottom>
						<template v-slot:activator="{ on, attrs }">
							<v-expansion-panel-header
								v-bind="attrs"
								class="flex-wrap fieldSets-handle"
								ripple
								v-on="on"
							>
								<span>
									{{ fieldSet.label }}
								</span>
							</v-expansion-panel-header>
						</template>
						<span v-if="fieldSet.description">
							{{ fieldSet.description }}
						</span>
					</v-tooltip>
					<v-expansion-panel-content class="pa-md-2">
						<field-set
							:value="fieldSet"
							:entities="entities"
							:entity="entity"
							:type="type"
							@input="setFieldSet($event, index)"
							@delete="delFieldSet(index)"
						></field-set>
					</v-expansion-panel-content>
				</v-expansion-panel>
			</draggable>
		</v-expansion-panels>
		<v-btn color="primary" class="white--text mt-3" @click="addFieldSet">Add fieldset</v-btn>
	</div>
</template>
<script>
import { cloneDeep, set, tap } from 'lodash';

import fieldSet from './fieldSets/fieldSet.vue';

export default {
	components: {
		fieldSet,
	},
	props: ['value', 'entities', 'entity', 'type'],
	data: () => ({
		selectedFieldset: [],
	}),
	computed: {
		fieldSets: {
			get() {
				return this.value || [];
			},
			set(value) {
				this.$emit(
					'input',
					value.map((fieldSet, index) => ({ ...fieldSet, ordering: index }))
				);
			},
		},
	},
	methods: {
		update(key, value) {
			this.$emit(
				'input',
				tap(cloneDeep(this.fieldSets), (v) => set(v, key, value))
			);
		},
		setFieldSet(option, index) {
			let fieldSets = cloneDeep(this.fieldSets);
			fieldSets.splice(index, 1, option);
			this.$emit('input', fieldSets);
		},
		delFieldSet(index) {
			let fieldSets = cloneDeep(this.fieldSets);
			fieldSets.splice(index, 1);
			this.$emit('input', fieldSets);
		},
		addFieldSet() {
			let fieldSets = cloneDeep(this.fieldSets);
			fieldSets.push({
				label: '',
				fields: [],
				filters: [],
				orders: [],
			});
			this.$emit('input', fieldSets);
			this.selectedFieldset.push(this.fieldSets.length);
		},
	},
};
</script>
