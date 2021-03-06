<template>
	<v-card elevation="2" :loading="loading" outlined shaped>
		<v-card-title>{{ app.name }}</v-card-title>
		<v-card-subtitle v-if="app.description">{{ app.description }}</v-card-subtitle>
		<v-card-text>
			<v-icon v-if="app.migrations.length === 0" size="40" color="green">mdi-check</v-icon>
			<v-row v-else justify="center">
				<v-expansion-panels accordion multiple>
					<v-expansion-panel v-for="(migration, i) in app.migrations" :key="i">
						<v-expansion-panel-header>{{ migration.description }}</v-expansion-panel-header>
						<v-expansion-panel-content>
							<pre>{{ migration.sql }}</pre>
						</v-expansion-panel-content>
					</v-expansion-panel>
				</v-expansion-panels>
			</v-row>
		</v-card-text>
		<v-card-actions>
			<v-flex wrap>
				<v-btn v-if="app.migrations.length > 0" x-small color="success" @click="update(app)">
					<v-icon x-small>mdi-update</v-icon>
					update
				</v-btn>
				<v-btn v-if="!rootApps.includes(app.name)" x-small color="primary">
					<v-icon x-small>mdi-refresh</v-icon>
					reinstall
				</v-btn>
				<v-btn v-if="!rootApps.includes(app.name)" x-small color="error">
					<v-icon x-small>mdi-delete</v-icon>
					delete
				</v-btn>
			</v-flex>
		</v-card-actions>
	</v-card>
</template>
<script>
export default {
	props: ['app'],
	data: () => ({ rootApps: ['apps', 'users'], loading: false }),
	methods: {
		update(app) {
			this.loading = true;
			this.$api
				.get(this.$route.params.app === 'cck' ? 'cck.admin.install' : 'apps.install', {
					app: { name: app.name },
				})
				.then((result) => {
					this.loading = false;
					if (result) this.$emit('refresh');
				});
		},
	},
};
</script>
