<template>
    <div class="row">
        <div class="col-12 col-md-6 col-lg-4">
            <v-select
                label="entity"
                :value="entity"
                :items="entitiesList"
                clearable
                dense
                outlined
                hide-details
                @input="update('entity', $event)"
            ></v-select>
        </div>
        <div v-if="entity" class="col-12 col-md-6 col-lg-4">
            <v-select
                label="fields"
                :value="fields"
                :items="optionsList"
                multiple
                small-chips
                dense
                outlined
                hide-details
                @input="update('fields', $event)"
            ></v-select>
        </div>
    </div>
</template>
<script>
//import { cloneDeep, set, tap } from 'lodash';

export default {
    props: ['value', 'entities'],
    data: () => ({
        entity: null,
        fields: null,
    }),
    computed: {
        references: {
            get() {
                return (
                    this.value || {
                        entity: this.entity,
                        fields: this.fields,
                    }
                );
            },
            set(value) {
                this.entity = value.entity;
                this.fields = value.fields;
                this.$emit('input', value);
            },
        },
        entitiesList() {
            return this.entities ? this.entities.map((entity) => entity.entity) : [];
        },
        optionsList() {
            if (this.entities) {
                let entity = this.entities.find((entity) => entity.entity === this.entity);
                return entity && entity.options ? entity.options.map((option) => option.field) : [];
            }
            return [];
        },
    },
    watch: {
        entity(value, old) {
            if (old !== null) this.update('fields', value ? [] : undefined);
        },
    },
    created() {
        this.entity = this.value.entity || '';
        this.fields = this.value.fields || [];
    },
    methods: {
        update(key, value) {
            this[key] = value;
            this.$emit('input', { entity: this.entity, fields: this.fields });
        },
    },
};
</script>
