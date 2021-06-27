<template>
    <div>
        <component
            :is="componentName"
            v-if="componentName"
            v-bind="$attrs"
            @loading="$emit('loading', $event)"
        ></component>
        <small v-else>Unknown component type: {{ type }}</small>
    </div>
</template>
<script>
import fieldDefault from './field/default.vue';
import fieldCheckbox from './field/checkbox.vue';
const components = {
    default: fieldDefault,
    checkbox: fieldCheckbox,
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
            return components[this.type];
        },
    },
};
</script>
