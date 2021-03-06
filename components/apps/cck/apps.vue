<template>
	<div class="container pa-0 pa-md-3">
		<v-btn large color="primary" @click="addApp">New application</v-btn>
		<v-btn large color="secondary" @click="save(false)">Save</v-btn>
		<v-btn large color="green" @click="save(true)">Save and setup</v-btn>
		<div class="apps">
			<draggable v-model="apps" handle=".apps-handle">
				<div v-for="(app, index) in apps" :key="app.id" class="apps-item">
					<app :value="app" @input="setApp($event, index)"></app>
				</div>
			</draggable>
		</div>
		<pre>{{ apps }}</pre>
	</div>
</template>
<script>
//import { mapState } from 'vuex';
import { cloneDeep } from 'lodash';

import app from './apps/app.vue';

export default {
	components: { app },
	computed: {
		apps: {
			get() {
				return this.$store.state.cck.entities['apps'];
			},
			set(items) {
				this.$store.commit('cck/setEntity', {
					entity: 'apps',
					items: items.map((item, key) => ({ ...item, ordering: key })),
				});
			},
		},
	},
	methods: {
		setApp(app, index) {
			let apps = [...this.apps];
			apps[index] = app;
			this.apps = apps;
		},
		addApp() {
			let apps = cloneDeep(this.apps);
			apps.splice(0, 0, {
				name: '',
				label: '',
				icon: '',
				description: '',
				entities: [],
			});
			this.apps = apps;
		},
		save(setup = false) {
			this.$store.dispatch('cck/save', 'apps');
			if (setup) {
				this.$api.add('cck.admin.install').then(() => {
					this.$store.dispatch('apps/reload', { entity: 'apps', predicate: {} });
				});
			}
			this.$store.dispatch('cck/reload', { entity: 'apps', predicate: {} });
		},
	},
};
</script>
