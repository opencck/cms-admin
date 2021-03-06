<template>
	<v-card class="mt-md-3 mb-md-3" outlined>
		<v-card-title class="entities-handle">
			{{ entity.entity }}&nbsp;{{ entity.label ? ' - ' + entity.label : '' }}
			<v-btn v-if="!edit" color="secondary" x-small @click="edit = true">Edit</v-btn>
		</v-card-title>
		<v-card-subtitle v-if="entity.description">
			{{ entity.description }}
		</v-card-subtitle>
		<v-card-text>
			<div class="row flex-wrap">
				<template v-if="edit">
					<div class="col-12 col-md-6 col-lg-4 pt-0">
						<v-text-field
							v-mask="mask"
							label="entity"
							:value="entity.entity"
							filled
							hide-details
							@input="update('entity', $event)"
						></v-text-field>
					</div>
					<div class="col-12 col-md-6 col-lg-4 pt-0">
						<v-text-field
							label="label"
							:value="entity.label"
							filled
							hide-details
							@input="update('label', $event)"
						></v-text-field>
					</div>
					<div class="col-12 col-lg-4 pt-0 pb-1">
						<v-textarea
							label="description"
							:value="entity.description"
							rows="1"
							auto-grow
							filled
							hide-details
							@input="update('description', $event)"
						></v-textarea>
					</div>
				</template>
				<div class="col-12 pt-0">
					<v-tabs v-model="tab" grow>
						<v-tab href="#tab-1">
							<v-badge
								:content="options ? options.length || '0' : '0'"
								class="apps-badge apps-badge_small"
								bordered
							>
								Options
								<v-icon class="ml-3">mdi-form-textbox</v-icon>
							</v-badge>
						</v-tab>
						<v-tab href="#tab-2">
							<v-badge
								:content="keys ? keys.length || '0' : '0'"
								class="apps-badge apps-badge_small"
								bordered
							>
								Keys
								<v-icon class="ml-3">mdi-key-outline</v-icon>
							</v-badge>
						</v-tab>
						<v-tab href="#tab-3">
							<v-badge
								:content="relations ? relations.length || '0' : '0'"
								class="apps-badge apps-badge_small"
								bordered
							>
								Relations
								<v-icon class="ml-3">mdi-relation-many-to-many</v-icon>
							</v-badge>
						</v-tab>
					</v-tabs>
					<entity-options
						v-show="tab === 'tab-1'"
						:value="options"
						:keys="keys"
						:entities="entities"
						@input="update('options', $event)"
					></entity-options>
					<entity-keys
						v-show="tab === 'tab-2'"
						:value="keys"
						:options="options"
						:entities="entities"
						@input="update('keys', $event)"
					></entity-keys>
					<entity-relations
						v-show="tab === 'tab-3'"
						:value="relations"
						:entities="entities"
						:options="options"
						:keys="keys"
						@input="update('relations', $event)"
					></entity-relations>
				</div>
			</div>
		</v-card-text>
	</v-card>
</template>
<script>
import { cloneDeep, set, tap } from 'lodash';
import entityOptions from './entity/options.vue';
import entityKeys from './entity/keys.vue';
import entityRelations from './entity/relations.vue';

export default {
	name: 'AppEntity',
	components: {
		entityOptions,
		entityKeys,
		entityRelations,
	},
	props: ['value', 'entities'],
	data: () => ({
		mask: {
			mask: '????????????????????????????????',
			tokens: { '?': { pattern: /[0-9a-zA-Z_]/, transform: (v) => v.toLocaleLowerCase() } },
		},
		tab: 'tab-1',
		edit: false,
	}),
	computed: {
		entity: {
			get() {
				return this.value;
			},
			set(value) {
				this.$emit('input', value);
			},
		},
		options: {
			get() {
				return this.entity.options;
			},
			set(value) {
				let entity = { ...this.entity };
				entity.options = value.map((option, index) => ({ ...option, ordering: index }));
				this.$emit('input', entity);
			},
		},
		keys: {
			get() {
				return this.entity.keys;
			},
			set(value) {
				let entity = { ...this.entity };
				entity.keys = value.map((key, index) => ({ ...key, ordering: index }));
				this.$emit('input', entity);
			},
		},
		relations: {
			get() {
				return this.entity.relations;
			},
			set(value) {
				let entity = { ...this.entity };
				entity.relations = value.map((relation, index) => ({ ...relation, ordering: index }));
				this.$emit('input', entity);
			},
		},
	},
	created() {
		if (!this.entity.entity) this.edit = true;
	},
	methods: {
		update(key, value) {
			if (['options', 'keys', 'relations'].includes(key)) {
				value = value.map((item, index) => ({ ...item, ordering: index }));
			}
			this.$emit(
				'input',
				tap(cloneDeep(this.entity), (v) => set(v, key, value))
			);
		},
	},
};
</script>
