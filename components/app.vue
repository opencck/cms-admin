<template>
    <div class="d-flex fill-height">
        <v-list class="pt-0" :class="{ 'd-none d-md-block': !this.mobileMenu }">
            <v-list-item class="justify-space-between" style="min-width: 56px">
                <v-btn icon right x-small @click.stop="miniVariant = !miniVariant">
                    <v-icon>mdi-{{ `chevron-${miniVariant ? 'right' : 'left'}` }}</v-icon>
                </v-btn>
                <div v-if="!miniVariant" class="ml-3 text-right">
                    {{ app.config.label || app.config.name || app.name }}
                </div>
            </v-list-item>
            <v-list-item v-for="(item, i) in items" :key="i" :to="localePath(item.to)" :title="item.title" router exact>
                <v-list-item-action :class="{ 'mr-0 ml-0': miniVariant }">
                    <v-icon>{{ item.icon }}</v-icon>
                </v-list-item-action>
                <v-list-item-content v-if="!miniVariant">
                    <v-list-item-title :title="item.title" v-text="item.name" />
                </v-list-item-content>
            </v-list-item>
        </v-list>
        <div
            class="flex-grow-1 pa-1 pa-md-3 overflow-hidden"
            :style="mobileMenu ? 'max-width: calc(100% - 56px);' : ''"
        >
            <slot></slot>
        </div>
    </div>
</template>
<script>
import { mapState } from 'vuex';
export default {
    data: () => ({
        miniVariant: true,
    }),
    computed: {
        ...mapState(['mobileMenu']),
        ...mapState('apps', {
            app(state) {
                return state.entities['apps'].find((app) => app.name === this.$route.params.app);
            },
        }),
        items() {
            let views = this.app.config.views || [];
            return views.map((view) => ({
                name: view.label || view.name,
                icon: view.icon || 'mdi-chart-bubble',
                title: view.description,
                to: { name: 'app-app-view', params: { ...this.$route.params, view: view.view || view.name } },
            }));
        },
    },
};
</script>
