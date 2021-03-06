<template>
	<div class="items">
		<v-tabs v-model="tab">
			<v-tab v-for="(fieldSet, index) in fieldSets" :key="index">{{ fieldSet.label }}</v-tab>
			<v-tab-item v-for="(fieldSet, index) in fieldSets" :key="index" class="pt-1">
				<item-field-set :value="fieldSet" :view="view"></item-field-set>
			</v-tab-item>
		</v-tabs>
		<pre>{{ loading }}</pre>
	</div>
</template>
<script>
import itemFieldSet from './item/fieldSet.vue';
import { itemActions, itemGetters, itemMutations, itemState } from '@/store/mixins/cckApp';

export default {
	components: {
		itemFieldSet,
	},
	data: () => ({ tab: 0, loading: true }),
	computed: {
		app() {
			return this.$store.state.apps.entities.apps.find((item) => item.name === this.$route.params.app);
		},
		view() {
			return this.app.config ? this.app.config.views.find((item) => item.name === this.$route.params.view) : {};
		},
		fieldSets() {
			return this.view ? this.view.item : [];
		},
		fields() {
			return this.fieldSets.reduce((result, fieldSet) => result.concat(fieldSet.fields), []);
		},
		select() {
			let fields = {};
			this.fields.forEach((field) => {
				if (!fields[field.entity]) fields[field.entity] = [];
				fields[field.entity].push(field.field);
			});
			return fields;
		},
		where() {
			return {
				'items.id': this.$route.params.subview,
			};
		},
		predicate() {
			return {
				select: this.select,
				where: this.where,
				limit: [1],
			};
		},
	},
	created() {
		let app = this.$route.params.app;
		// dynamic store module registration for cck app
		if (this.$store.state[app + '_item'] === undefined)
			this.$store.registerModule(app + '_item', {
				namespaced: true,
				state: () => itemState(app),
				mutations: itemMutations(),
				getters: itemGetters(),
				actions: itemActions(app, true),
			});
		this.$store.dispatch(app + '_item/load', {
			entity: this.view.entity,
			predicate: this.predicate,
		});
		// load data
		this.loading = true;
		this.$api.post().then(() => {
			this.loading = false;
		});
	},
};
</script>
