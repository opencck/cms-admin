<template>
	<v-app dark>
		<v-main>
			<v-container class="fill-height" fluid>
				<nuxt />
			</v-container>
		</v-main>
	</v-app>
</template>

<script>
export default {
	layout: 'login',
	props: {},
	data: () => ({}),
	head: 'Authorization',
};
</script>

<style scoped>
h1 {
	font-size: 20px;
}
</style>
