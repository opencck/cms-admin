<template>
	<div>
		<v-data-table
			v-model="selected"
			must-sort
			show-select
			:headers="headers"
			:loading="loading"
			:items="items"
			:item-key="entity.entity + '.' + primaryKey[0]"
			:options.sync="options"
			:server-items-length="count"
			:footer-props="{
				'items-per-page-options': [1, 10, 20, 30, 50, 70, 120, 190, 310, 500],
			}"
			class="elevation-1"
		>
			<template v-for="field in headers" :slot="'item.' + field.value" slot-scope="props">
				<field-set-field
					:key="field.value + '-' + primaryKey.map((key) => props.item[entity.entity + '.' + key]).join('.')"
					v-bind="props"
					:type="field.view.type"
					:primaryKey="primaryKey"
					@loading="loading = $event"
				></field-set-field>
			</template>
		</v-data-table>
		<pre>{{ selected }}</pre>
	</div>
</template>
<script>
import { debounce, reduce } from 'lodash';
import fieldSetField from './fieldSet/field.vue';

export default {
	components: {
		fieldSetField,
	},
	props: ['value', 'view'],
	data: () => ({
		loading: true,
		selected: [],
	}),
	computed: {
		app() {
			return this.$store.state.apps.entities.apps.find((app) => app.name === this.$route.params.app);
		},
		entity() {
			return this.app.config.entities.find((entity) => entity.name === this.view.entity);
		},
		primaryKey() {
			return reduce(
				this.entity.keys,
				(result, key, keyName) =>
					result.concat(key.type === 'PRIMARY' ? (key.fields ? key.fields : [keyName]) : []),
				[]
			);
		},
		options: {
			get() {
				return (
					this.$store.state[this.$route.params.app].options[this.view.name] || {
						page: 1,
						itemsPerPage: 10,
						sortBy: [this.value.order],
						sortDesc: [this.value.orderDirection === 'DESC'],
					}
				);
			},
			set(value) {
				this.$store.commit(this.$route.params.app + '/setOptions', { view: this.view.name, options: value });
			},
		},
		headers() {
			return this.value.fields.map((field) => ({
				text: field.label ? field.label : field.alias,
				align: 'left',
				value: field.alias,
				...field,
			}));
		},
		select() {
			let fields = {};
			this.value.fields.forEach((field) => {
				if (field.type === 'default') {
					if (!fields[field.entity]) fields[field.entity] = [];
					fields[field.entity].push(field.field);
				} else {
					fields[field.alias] = field.select + ' as `' + field.alias + '`';
				}
			});
			return fields;
		},
		where() {
			return [];
		},
		order() {
			let ordering = {};
			ordering[this.options.sortBy[0]] = this.options.sortDesc[0] ? 'DESC' : 'ASC';
			return ordering;
		},
		predicate() {
			return {
				select: this.select,
				where: this.where,
				order: this.order,
				group: this.value.group,
				limit: [(this.options.page - 1) * this.options.itemsPerPage, this.options.itemsPerPage],
			};
		},
		items() {
			return this.$store.state[this.$route.params.app].entities[this.view.entity];
		},
		count() {
			return this.$store.state[this.$route.params.app].counts[this.view.entity];
		},
	},
	watch: {
		predicate: {
			deep: true,
			handler() {
				this.load();
			},
		},
	},
	methods: {
		load: debounce(function () {
			this.loading = true;
			this.$store.dispatch(this.$route.params.app + '/load', {
				entity: this.view.entity,
				predicate: this.predicate,
				counts: true,
			});
			// load data
			this.$api.post().then(() => {
				this.loading = false;
			});
		}, 200),
	},
};
</script>
