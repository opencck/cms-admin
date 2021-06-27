<template>
    <div class="items">
        <v-tabs v-model="tab">
            <v-tab v-for="(fieldSet, index) in fieldSets" :key="index">{{ fieldSet.label }}</v-tab>
            <v-tab-item v-for="(fieldSet, index) in fieldSets" :key="index" class="pt-1">
                <items-field-set :value="fieldSet" :view="view"></items-field-set>
            </v-tab-item>
        </v-tabs>
    </div>
</template>
<script>
import { itemActions, itemGetters, itemMutations, itemState } from '../../../store/mixins/cckApp.js';
import itemsFieldSet from './items/fieldSet.vue';

export default {
    components: {
        itemsFieldSet,
    },
    data: () => ({ tab: 0 }),
    computed: {
        app() {
            return this.$store.state.apps.entities.apps.find((item) => item.name === this.$route.params.app);
        },
        view() {
            return this.app.config ? this.app.config.views.find((item) => item.name === this.$route.params.view) : {};
        },
        fieldSets() {
            return this.view ? this.view.items : [];
        },
    },
    created() {
        let app = this.$route.params.app;
        // dynamic store module registration for cck app
        if (this.$route.params.app.substr(0, 4) === 'cck_' && this.$store.state[app] === undefined)
            this.$store.registerModule(app, {
                namespaced: true,
                state: () => itemState(app),
                mutations: itemMutations(),
                getters: itemGetters(),
                actions: itemActions(app, true),
            });
    },
};
</script>
