<template>
	<v-row align="center" justify="center">
		<v-col cols="12" sm="8" md="4">
			<v-card class="elevation-12">
				<v-toolbar color="primary" dark flat>
					<v-toolbar-title>Authorization</v-toolbar-title>
					<v-spacer />
					<v-tooltip right>
						<template v-slot:activator="{ on }">
							<v-btn icon large href="https://cck.srv.rekryt.ru" target="_blank" v-on="on">
								<v-icon>mdi-head-question-outline</v-icon>
							</v-btn>
						</template>
						<span>Help</span>
					</v-tooltip>
				</v-toolbar>
				<v-form @submit.prevent="doLogin">
					<v-card-text>
						<v-text-field
							v-model="username"
							label="Login"
							name="login"
							prepend-icon="mdi-account-check"
							type="text"
						></v-text-field>
						<v-text-field
							id="password"
							v-model="password"
							label="Password"
							name="password"
							prepend-icon="mdi-lock"
							type="password"
						></v-text-field>
					</v-card-text>
					<v-card-actions>
						<v-spacer />
						<v-btn v-if="!loading" color="primary" type="submit">Login</v-btn>
						<v-progress-circular v-else :size="36" color="primary" indeterminate></v-progress-circular>
					</v-card-actions>
				</v-form>
			</v-card>
		</v-col>
	</v-row>
</template>
<script>
export default {
	layout: 'login',
	data: () => ({
		username: '',
		password: '',
		loading: false,
	}),
	created() {
		if (this.$store.state.user.id) this.$router.push(this.localePath('/'));
	},
	methods: {
		doLogin() {
			this.loading = true;
			this.$store.dispatch('user/login', { username: this.username, password: this.password }).then(() => {
				this.loading = false;
				if (this.$store.state.user.id) this.$router.push(this.localePath('/'));
			});
		},
	},
};
</script>
