/**
 * API middleware
 * @param $api
 * @param params
 * @param store
 */
import _ from 'lodash';
//import { itemActions, itemGetters, itemMutations, itemState } from '../store/mixins/cckApp';

export default function ({ app: { $api }, route: { params }, store }) {
	store.dispatch('apps/load', {
		entity: 'apps',
		predicate: {},
	});
	_.each(params, (item, key) => {
		switch (key) {
			case 'app':
				// load entities of application
				switch (item) {
					case 'cck':
						store.dispatch('cck/load', {
							entity: 'apps',
							predicate: {},
						});
						break;
				}
				break;
		}
	});
	// // dynamic store module registration for cck app
	// if (params.app.substr(0, 4) === 'cck_' && store.state[params.app] === undefined)
	// 	store.registerModule(params.app, {
	// 		namespaced: true,
	// 		state: () => itemState(params.app),
	// 		mutations: itemMutations(),
	// 		getters: itemGetters(),
	// 		actions: itemActions(params.app, true),
	// 	});

	return $api.post();
}
