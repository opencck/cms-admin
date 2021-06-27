/**
 * Item of entity data
 */
import _ from 'lodash';

export const itemState = () => ({
    id: null,
    predicate: null,
    items: [],
});

export const itemMutations = (keyField) => ({
    set(state, object) {
        _.each(object, (item, key) => (state[key] = item));
    },
    select(state, subject) {
        let item = _.find(state.items, (item) => item[keyField] === subject);
        state.id = item ? item.id : null;
    },
});

export const itemGetters = () => ({
    get(state /*, mutations, rootState*/) {
        return _.find(state.items, (item) => item.id === state.id);
    },
});

/**
 * itemActions
 * @param appName string name of application
 * @param entityName string name of entity
 * @param relationStoreName string name of relation store
 */
export const itemActions = (appName, entityName, relationStoreName = null) => ({
    /**
     * load data of entity
     * @param commit ƒ (_type, _payload, _options)
     * @param dispatch ƒ (_type, _payload, _options)
     * @param getters
     * @param rootGetters
     * @param state
     * param rootState object
     * @param predicate object data fetch predicate
     * @param subject object subject entity selecting
     */
    async load({ commit, rootGetters, state }, { predicate, subject }) {
        commit('select', subject);
        if (!state.predicate || _.isEqualWith(state.predicate, predicate, (obj, oth) => obj == oth))
            await this.$api.add(
                appName + '.' + 'admin.select.' + entityName,
                predicate,
                rootGetters[relationStoreName ? relationStoreName + '/get' : null]
            );
        commit('set', { predicate });
        commit('select', subject);
    },
});
