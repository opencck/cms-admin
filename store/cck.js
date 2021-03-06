/**
 * Store of component Apps
 */
import { itemState, itemMutations, itemGetters, itemActions } from './mixins/app.js';

let config = {
	appName: 'cck',
};

export const state = () => ({
	...itemState(),
});

export const mutations = {
	...itemMutations(),
};

export const getters = {
	...itemGetters(),
};

export const actions = {
	...itemActions(config.appName, null, true),
};
