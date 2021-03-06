<template>
	<div class="keys">
		<v-expansion-panels v-model="selectedRelation" accordion multiple focusable>
			<draggable v-model="relations" class="d-flex flex-wrap" handle=".keys-handle" style="width: 100%">
				<v-expansion-panel v-for="(relation, index) in relations" :key="index" class="pl-0 pr-0">
					<v-tooltip :disabled="!relation.description" bottom>
						<template v-slot:activator="{ on, attrs }">
							<v-expansion-panel-header v-bind="attrs" class="flex-wrap keys-handle" ripple v-on="on">
								<span>{{ relation.field }}</span>
								<span v-if="relation.entity" class="ma-1 yellow--text">
									{{ relation.entity }}.{{ relation.key }}
								</span>
								<span v-if="relation.name" class="ma-1 orange--text">{{ relation.name }}</span>
								<span class="ma-1">
									<v-icon v-if="relation.multiple" title="Many to many">
										mdi-relation-many-to-many
									</v-icon>
									<v-icon v-else title="One to many">mdi-relation-one-to-many</v-icon>
								</span>
							</v-expansion-panel-header>
						</template>
						<span v-if="relation.description">
							{{ relation.description }}
						</span>
					</v-tooltip>
					<v-expansion-panel-content class="pa-md-2">
						<entity-relation
							:value="relation"
							:options="options"
							:entities="entities"
							@input="setRelation($event, index)"
							@delete="delRelation(index)"
						></entity-relation>
					</v-expansion-panel-content>
				</v-expansion-panel>
			</draggable>
		</v-expansion-panels>
		<v-menu :rounded="true" offset-y>
			<template v-slot:activator="{ attrs, on }">
				<v-btn color="primary" class="white--text mt-3" v-bind="attrs" v-on="on">Add relation</v-btn>
			</template>

			<v-list dense>
				<v-list-item v-for="preset in presets" :key="preset.name" link @click="addRelation(preset.key)">
					<v-list-item-title>
						{{ preset.label }}
					</v-list-item-title>
				</v-list-item>
			</v-list>
		</v-menu>
	</div>
</template>
<script>
import { cloneDeep /*set, tap*/ } from 'lodash';
import entityRelation from './relation.vue';
export default {
	components: {
		entityRelation,
	},
	props: ['value', 'entities', 'options', 'keys'],
	data: () => ({
		selectedRelation: [],
	}),
	computed: {
		relations: {
			get() {
				return this.value;
			},
			set(value) {
				this.$emit('input', value);
			},
		},
		presets() {
			return [
				{
					name: '1-m',
					label: 'One to many',
					key: { name: '', description: '', entity: '', key: '', field: '', multiple: null },
				},
				{
					name: 'm-m',
					label: 'Many to many',
					key: {
						name: '',
						description: '',
						entity: '',
						key: '',
						field: '',
						multiple: {
							name: '',
							description: '',
							options: [],
							keys: [],
							relations: [],
						},
					},
				},
			];
		},
	},
	methods: {
		setRelation(option, index) {
			let relations = cloneDeep(this.relations);
			relations.splice(index, 1, option);
			this.$emit('input', relations);
		},
		delRelation(index) {
			let relations = cloneDeep(this.relations);
			relations.splice(index, 1);
			this.$emit('input', relations);
		},
		addRelation(option) {
			let relations = cloneDeep(this.relations);
			relations.push(option);
			this.$emit('input', relations);
			this.selectedRelation.push(this.relations.length);
		},
	},
};
</script>
