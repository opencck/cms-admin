<template>
    <application v-if="!loading">
        <h1>Application "{{ app.name }}"</h1>
        <pre>{{ app }}</pre>
    </application>
</template>
<script>
import { mapState } from 'vuex';
import application from '@/components/app.vue';

export default {
    components: {
        application,
    },
    data: () => ({ loading: true }),
    computed: {
        ...mapState('apps', {
            app(state) {
                return state.entities['apps'].find((app) => app.name === this.$route.params.app);
            },
        }),
    },
    created() {
        if (this.app.config.views && this.app.config.views.length) {
            this.$router.push(
                this.localePath({
                    name: 'app-app-view',
                    params: {
                        ...this.$route.params,
                        view: this.app.config.views[0].view
                            ? this.app.config.views[0].view
                            : this.app.config.views[0].type,
                    },
                })
            );
        } else {
            this.loading = false;
        }
    },
};
</script>
