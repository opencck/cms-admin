import _ from 'lodash';
export const state = () => ({
    id: 0,
    state: null,
    username: '',
    email: '',
    role: '',
    date_create: '',
});

export const mutations = {
    set(state, object) {
        _.each(object, (item, key) => (state[key] = item));
    },
};

export const actions = {
    login(context, { username, password }) {
        return this.$api.get('users.login', { username, password });
    },
    logout() {
        return this.$api.get('users.admin.user.logout');
    },
};
