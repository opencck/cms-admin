<template>
    <div>
        <h1>Installation and updates</h1>
        <v-btn v-if="!loading" color="warning" large outlined @click="load">Refresh</v-btn>
        <v-progress-circular v-if="loading" :width="5" color="red" indeterminate></v-progress-circular>
        <div class="row flex-wrap">
            <div
                v-for="app in checks"
                :key="app.name"
                :class="app.migrations.length > 0 ? 'col-12' : 'pa-3 flex-grow-1'"
            >
                <install-app :app="app" @refresh="load"></install-app>
            </div>
        </div>
    </div>
</template>
<script>
import installApp from './app.vue';
export default {
    components: {
        installApp,
    },
    data: () => ({ loading: false, checks: [] }),
    created() {
        this.load();
    },
    methods: {
        load() {
            this.loading = true;
            this.$api.get(this.$route.params.app === 'cck' ? 'cck.admin.check' : 'apps.check').then((checks) => {
                this.checks = checks;
                this.loading = false;
            });
        },
    },
};
</script>
