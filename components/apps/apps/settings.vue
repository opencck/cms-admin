<template>
	<div>
		{{ view.label || view.name || 'Settings of ' + $route.params.app }}
		<pre>{{ app }}</pre>
	</div>
</template>
<script>
import { mapState } from 'vuex';
export default {
	components: {},
	computed: {
		...mapState('apps', {
			app(state) {
				return state.entities[this.$route.params.app];
			},
		}),
		config() {
			return this.app.config || {};
		},
		view() {
			let views = this.config.views || [];
			return views.find((view) => view.name === this.$route.params.view) || {};
		},
	},
};
</script>
