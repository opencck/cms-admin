import Vue from 'vue';
import Vuetify from 'vuetify';
import colors from 'vuetify/es5/util/colors';

import 'vuetify/dist/vuetify.min.css';
import '@mdi/font/css/materialdesignicons.css';

Vue.use(Vuetify);

export default (ctx) => {
	const vuetify = new Vuetify({
		customVariables: ['~/assets/variables.scss'],
		theme: {
			dark: true,
			themes: {
				dark: {
					primary: colors.blue.darken2,
					accent: colors.grey.darken3,
					secondary: colors.amber.darken3,
					info: colors.teal.lighten1,
					warning: colors.amber.base,
					error: colors.deepOrange.accent4,
					success: colors.green.accent3,
				},
			},
			/*themes: {
				light: {
					primary: '#4caf50',
					secondary: '#4caf50',
					tertiary: '#495057',
					accent: '#82B1FF',
					error: '#f55a4e',
					info: '#00d3ee',
					success: '#5cb860',
					warning: '#ffa21a',
				},
			},*/
		},
		icons: {
			iconfont: 'mdi',
		},
	});

	ctx.app.vuetify = vuetify;
	ctx.$vuetify = vuetify.framework;
};
