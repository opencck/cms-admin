/**
 * CCK Application store mixin
 */
import Vue from 'vue';
import _ from 'lodash';

/**
 * itemState
 */
export const itemState = (name = 'cck_app') => ({
	name: name, // name of CCK app
	predicate: null, // predicate for data fetch
	entities: {}, // entities of application
	counts: {}, // server counts of entities items
	options: {}, // options of application items view
});

/**
 * itemMutations
 */
export const itemMutations = () => ({
	/**
	 * Set app store options with object
	 * @param state
	 * @param object
	 */
	set(state, object) {
		_.each(object, (item, key) => (state[key] = item));
	},
	/**
	 * Set entity of app store
	 * @param state
	 * @param entity name
	 * @param items
	 */
	setEntity(state, { entity, items }) {
		Vue.set(state.entities, entity, items);
	},
	/**
	 * Set options of application view
	 * @param state
	 * @param { view, options }
	 */
	setOptions(state, { view, options }) {
		Vue.set(state.options, view, options);
	},
	/**
	 * Set entity of app store
	 * @param state
	 * @param entity name
	 * @param count
	 */
	setCount(state, { entity, count }) {
		console.log('setCount', { entity, count });
		Vue.set(state.counts, entity, count);
	},
});

/**
 * itemGetters
 */
export const itemGetters = () => ({
	get(state /*, mutations, rootState*/) {
		return state.entity;
	},
});

/**
 * itemActions
 * @param appName string name of application
 * @param usePredicate boolean using predicate load strategy
 */
export const itemActions = (appName, usePredicate = false) => ({
	/**
	 * load data of entity
	 * @param commit ƒ (_type, _payload, _options)
	 * @param dispatch ƒ (_type, _payload, _options)
	 * @param getters
	 * @param state
	 * param rootState object
	 * @param entity string name of entity
	 * @param predicate object predicate for data fetch
	 * @param counts boolean items counting
	 */
	load({ commit, state }, { entity, predicate, counts = false }) {
		console.log(appName + ' load', JSON.stringify(state.predicate) !== JSON.stringify(predicate));
		if (!usePredicate || !state.predicate || JSON.stringify(state.predicate) !== JSON.stringify(predicate)) {
			if (counts)
				this.$api
					.add('cck.admin.items.select.' + entity, {
						...predicate,
						app: appName,
						select: ['COUNT(*) as `count`'],
						limit: [],
						group: [],
					})
					.then((items) => {
						commit('setCount', { entity, count: items[0].count });
					});
			return this.$api.add('cck.admin.items.select.' + entity, { ...predicate, app: appName }).then((items) => {
				commit('setEntity', { entity, items });
				commit('set', { predicate });
				return items;
			});
		}
		commit('set', { predicate });
	},
	/**
	 * save data of entity
	 */
	save({ state }, { entity, items }) {
		return this.$api.add('cck.admin.items.update.' + entity, {
			app: appName,
			items: items ? items : state.entities[entity],
		});
	},
	/**
	 * reload data of entity
	 * @param commit
	 * @param dispatch
	 * @param entity string name of entity
	 * @param predicate object predicate for data fetch
	 * @returns {*}
	 */
	reload({ commit, dispatch }, { entity, predicate }) {
		commit('set', { predicate: null });
		dispatch('load', { entity, predicate });
		return this.$api.post();
	},
});
