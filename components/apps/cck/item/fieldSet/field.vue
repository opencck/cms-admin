<template>
    <component
        :is="componentName"
        v-if="componentName"
        v-bind="$attrs"
        :type="type"
        @loading="$emit('loading', $event)"
    ></component>
</template>
<script>
import fieldDefault from './field/default.vue';
import fieldCheckbox from './field/checkbox.vue';
import fieldHidden from './field/hidden.vue';
import fieldUnknown from './field/unknown.vue';
const components = {
    default: fieldDefault,
    checkbox: fieldCheckbox,
    hidden: fieldHidden,
    unknown: fieldUnknown,
};

export default {
    components,
    props: {
        type: {
            type: String,
            default() {
                return 'default';
            },
        },
    },
    computed: {
        componentName() {
            return components[this.type] || 'unknown';
        },
    },
};
</script>
