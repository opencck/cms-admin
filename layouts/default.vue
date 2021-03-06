<template>
	<v-app dark>
		<v-navigation-drawer :mini-variant="miniVariant" :clipped="clipped" :permanent="miniVariant" fixed app>
			<template v-slot:prepend>
				<v-list-item two-line class="pr-2 pl-2">
					<v-list-item-avatar size="40">
						<img
							src="https://cdn.discordapp.com/avatars/378490970099941378/4fa8173d0671b77112aa1cee80f9ee1e.webp?size=128"
						/>
					</v-list-item-avatar>

					<v-list-item-content>
						<v-list-item-title>{{ user.username }}</v-list-item-title>
						<v-list-item-subtitle>Logged In</v-list-item-subtitle>
					</v-list-item-content>
				</v-list-item>
			</template>

			<v-divider></v-divider>

			<v-list>
				<v-list-item
					v-for="(item, i) in items"
					:key="i"
					:to="localePath(item.to)"
					:class="listItemClass(item)"
					:title="item.title"
					router
					exact
				>
					<v-list-item-action>
						<v-icon>{{ item.icon }}</v-icon>
					</v-list-item-action>
					<v-list-item-content>
						<v-list-item-title :title="item.title" v-text="item.name" />
					</v-list-item-content>
				</v-list-item>
			</v-list>
		</v-navigation-drawer>
		<v-app-bar :clipped-left="clipped" fixed app>
			<v-btn icon @click.stop="miniVariant = !miniVariant">
				<v-icon>mdi-{{ `chevron-${miniVariant ? 'right' : 'left'}` }}</v-icon>
			</v-btn>
			<v-toolbar-title>CCK CMS</v-toolbar-title>
			<v-spacer />
			<v-btn icon class="d-md-none" @click.stop="mobileMenuClick">
				<v-icon>mdi-menu</v-icon>
			</v-btn>
			<v-menu offset-y>
				<template v-slot:activator="{ on, attrs }">
					<v-btn color="white" v-bind="attrs" outlined x-small v-on="on">{{ $i18n.locale }}</v-btn>
				</template>
				<v-list class="ma-1">
					<v-list-item v-for="(locale, index) in locales" :key="index">
						<v-btn tag="nuxt-link" :to="switchLocalePath(locale)">{{ locale }}</v-btn>
					</v-list-item>
				</v-list>
			</v-menu>
			<v-tooltip left>
				<template v-slot:activator="{ on }">
					<v-btn icon @click.stop="logout" v-on="on">
						<v-icon>mdi-exit-to-app</v-icon>
					</v-btn>
				</template>
				<span>Logout</span>
			</v-tooltip>
		</v-app-bar>
		<v-main>
			<nuxt />
		</v-main>
		<v-navigation-drawer v-model="rightDrawer" :right="right" temporary fixed>
			<v-list>
				<v-list-item @click.native="right = !right">
					<v-list-item-action>
						<v-icon light>mdi-repeat</v-icon>
					</v-list-item-action>
					<v-list-item-title>Switch drawer (click me)</v-list-item-title>
				</v-list-item>
			</v-list>
		</v-navigation-drawer>
		<v-footer :fixed="fixed" app>
			<span>CCK CMS &copy; {{ new Date().getFullYear() }}</span>
		</v-footer>
		<div v-if="loading" class="fader d-flex align-content-center justify-center">
			<v-icon dark size="72">mdi-clock</v-icon>
		</div>
	</v-app>
</template>

<script>
import { mapState } from 'vuex';
import i18n from '../plugins/i18n.js';

export default {
	//head: {},
	data() {
		return {
			clipped: false,
			drawer: false,
			fixed: false,
			miniVariant: true,
			right: true,
			rightDrawer: false,
			locales: i18n.locales,
		};
	},
	computed: {
		dev: () => process.env.NODE_ENV !== 'production',
		...mapState('apps', {
			apps: (state) => state.entities['apps'] || [],
		}),
		...mapState(['user', 'loading', 'mobileMenu']),
		items() {
			return [
				{
					icon: 'mdi-apps',
					name: 'Dashboard',
					title: 'Dashboard',
					to: '/',
				},
			].concat(
				this.apps.map((app) => ({
					appName: app.name,
					name: app.config.label || app.config.name,
					icon: app.config.icon || 'mdi-open-in-app',
					title: app.config.description,
					to: { name: 'app-app', params: { app: app.config.name } },
				}))
			);
		},
	},
	middleware: ['auth', 'api'],
	methods: {
		logout() {
			this.$store.dispatch('user/logout').then(() => {
				this.$router.push('/login');
			});
		},
		listItemClass(item) {
			console.log(this.$route.params.app, item.name);
			return { 'v-list-item--active': this.$route.params.app === item.appName };
		},
		mobileMenuClick() {
			this.$store.commit('setMobileMenu', !this.mobileMenu);
		},
	},
};
</script>
<style>
.fader {
	position: fixed;
	width: 100%;
	height: 100%;
	top: 0;
	left: 0;
	z-index: 999;
	background-color: rgba(0, 0, 0, 0.5);
	color: white;
}
</style>
