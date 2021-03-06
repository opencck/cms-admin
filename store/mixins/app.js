/**
 * Application store mixin
 */
import Vue from 'vue';
import _ from 'lodash';

/**
 * itemState
 */
export const itemState = () => ({
	predicate: null, // predicate for data fetch
	entities: {}, // entities of application
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
	 * @param entityName
	 * @param items
	 */
	setEntity(state, { entity, items }) {
		Vue.set(state.entities, entity, items);
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
 * @param relationStoreName string name of relation store
 * @param usePredicate boolean using predicate load strategy
 */
export const itemActions = (appName, relationStoreName = null, usePredicate = false) => ({
	/**
	 * load data of entity
	 * @param commit ƒ (_type, _payload, _options)
	 * @param dispatch ƒ (_type, _payload, _options)
	 * @param getters
	 * @param rootGetters
	 * @param state
	 * param rootState object
	 * @param entity string name of entity
	 * @param predicate object predicate for data fetch
	 */
	load({ commit, rootGetters, state }, { entity, predicate }) {
		console.log('load', { entity, predicate });
		if (!usePredicate || !state.predicate || _.isEqualWith(state.predicate, predicate, (obj, oth) => obj == oth))
			return this.$api
				.add(
					appName + '.' + 'admin.select.' + entity,
					predicate,
					rootGetters[relationStoreName ? relationStoreName + '/get' : null]
				)
				.then((items) => {
					commit('setEntity', { entity, items });
					commit('set', { predicate });
					return items;
				});
		commit('set', { predicate });
	},
	/**
	 * save data of entity
	 */
	save({ state }, entity) {
		return this.$api.add(appName + '.admin.update.' + entity, { items: state.entities[entity] });
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
