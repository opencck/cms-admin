export const state = () => ({
	loading: false,
	mobileMenu: false,
});

export const mutations = {
	setLoading: (state, value) => (state.loading = value),
	setMobileMenu: (state, value) => (state.mobileMenu = value),
};

export const actions = {
	notice(context, params) {
		this.$swal(params);
	},
};
