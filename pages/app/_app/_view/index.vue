<template>
    <application>
        <component :is="componentName" v-if="componentName"></component>
        <template v-else>Apps component {{ name }} not found</template>
    </application>
</template>
<script>
/* eslint-disable vue/no-unused-components */
import application from '@/components/app.vue';
import appsInstall from '@/components/apps/install.vue';

import appsSettings from '@/components/apps/apps/settings.vue';

import cckApps from '@/components/apps/cck/apps.vue';
import cckItems from '@/components/apps/cck/items.vue';

const components = {
    application,
    'apps.install': appsInstall,
    'apps.settings': appsSettings,
    'cck.install': appsInstall,
    'cck.apps': cckApps,
    'cck.items': cckItems,
};
export default {
    components,
    computed: {
        name() {
            let app = this.$route.params.app;
            if (app.substr(0, 4) === 'cck_') app = 'cck';
            return app + '.' + this.$route.params.view;
        },
        componentName() {
            return Object.keys(components).includes(this.name) ? this.name : false;
        },
    },
};
</script>
