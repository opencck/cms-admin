<template>
	<v-checkbox v-model="check" color="green"></v-checkbox>
</template>
<script>
export default {
	props: ['value', 'item', 'header', 'primaryKey'],
	computed: {
		check: {
			get() {
				return this.value === 1;
			},
			set(value) {
				let item = {};
				this.primaryKey.reduce((result, key) => (item[key] = this.item[this.header.entity + '.' + key]), {});
				item[this.header.field] = value ? 1 : 0; // todo values of checkbox
				this.$store.dispatch(this.$route.params.app + '/save', {
					entity: this.header.entity,
					items: [item],
				});
				this.$emit('loading', true);
				this.$api.post().then(() => {
					this.$emit('loading', false);
				});
			},
		},
	},
};
</script>
