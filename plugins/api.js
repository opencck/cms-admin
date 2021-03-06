/*
 ** Executed by ~/.nuxt/index.js with context given
 ** This method can be asynchronous
 */
import apiFactory from '../lib/api.js';
export default ({ $axios }, inject) => {
	// Inject `api` key
	// -> app.$api
	// -> this.$api in vue components
	// -> this.$api in store actions/mutations
	const api = apiFactory($axios);
	inject('api', api);
};
