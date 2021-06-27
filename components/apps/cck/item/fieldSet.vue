<template>
    <div class="row flex-wrap">
        <field-set-field v-for="(field, index) in fields" :key="index" :type="field.view.type"></field-set-field>
    </div>
</template>
<script>
import fieldSetField from './fieldSet/field.vue';

export default {
    components: {
        fieldSetField,
    },
    props: ['value', 'view'],
    data: () => ({}),
    computed: {
        fields() {
            return this.value.fields;
        },
    },
};
</script>
