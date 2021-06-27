<template>
    <application>
        <component :is="componentName" v-if="componentName"></component>
        <template v-else>Apps component {{ name }} not found</template>
    </application>
</template>
<script>
/* eslint-disable vue/no-unused-components */
import application from '@/components/app.vue';

import cckItem from '@/components/apps/cck/item.vue';

const components = {
    application,
    'cck.item': cckItem,
};
export default {
    components,
    computed: {
        name() {
            let app = this.$route.params.app;
            if (app.substr(0, 4) === 'cck_') app = 'cck';
            return app + '.item';
        },
        componentName() {
            return Object.keys(components).includes(this.name) ? this.name : false;
        },
    },
};
</script>
