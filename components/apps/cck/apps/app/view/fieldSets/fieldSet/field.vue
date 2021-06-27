<template>
    <div>
        <div class="row flex-wrap">
            <div v-if="type === 'items'" class="col-12 col-md-4 col-lg-3">
                <v-select
                    label="type"
                    :value="field.type"
                    :items="['default', 'custom']"
                    dense
                    outlined
                    hide-details
                    @input="update('type', $event)"
                ></v-select>
            </div>
            <div v-if="field.type === 'default'" class="col-12 col-md-4 col-lg-3">
                <v-select
                    label="entity"
                    :value="field.entity"
                    :items="entitiesList"
                    dense
                    outlined
                    hide-details
                    @input="update('entity', $event)"
                ></v-select>
            </div>
            <div v-if="field.type === 'default'" class="col-12 col-md-4 col-lg-3">
                <v-select
                    label="field"
                    :value="field.field"
                    :items="fieldsList"
                    dense
                    outlined
                    hide-details
                    @input="update('field', $event)"
                ></v-select>
            </div>
            <div v-if="field.type === 'custom' && type === 'items'" class="col-12 col-md-4 col-lg-3">
                <v-text-field
                    label="select"
                    :value="field.select"
                    dense
                    outlined
                    hide-details
                    @input="update('select', $event)"
                ></v-text-field>
            </div>
            <div v-if="type === 'items'" class="col-12 col-md-4 col-lg-3">
                <v-combobox
                    label="alias"
                    :value="field.alias"
                    :items="[field.entity + '.' + field.field]"
                    dense
                    outlined
                    hide-details
                    @input="update('alias', $event)"
                ></v-combobox>
            </div>
            <div v-if="type === 'items'" class="col-12 col-md-4 col-lg-3">
                <v-checkbox
                    :value="true"
                    :input-value="field.sortable"
                    label="sortable"
                    class="mt-2"
                    color="green"
                    hide-details
                    @click="update('sortable', !field.sortable)"
                ></v-checkbox>
            </div>
            <div v-if="type === 'items'" class="col-12 col-md-4 col-lg-3">
                <v-checkbox
                    :value="true"
                    :input-value="field.link"
                    label="link"
                    class="mt-2"
                    color="primary"
                    hide-details
                    @click="update('link', !field.link)"
                ></v-checkbox>
            </div>
            <div class="col-12">
                <field-view :value="field.view" :entities="entities" @input="update('view', $event)"></field-view>
            </div>
        </div>
        <div class="mt-1"><v-btn color="error" small @click="$emit('delete')">Delete field</v-btn></div>
    </div>
</template>
<script>
import { cloneDeep, set, tap } from 'lodash';

export default {
    props: ['value', 'entities', 'entity', 'type'],
    data: () => ({}),
    computed: {
        field: {
            get() {
                return this.value;
            },
            set(value) {
                this.$emit('input', value);
            },
        },
        appEntities() {
            let entities = cloneDeep(this.entities) || [];
            let recursiveEntities = (arr) =>
                arr.forEach((entity) => {
                    entities.push(entity);
                    if (entity.relations)
                        entity.relations.forEach((relation) => {
                            if (relation.multiple) recursiveEntities([relation.multiple]);
                        });
                });
            recursiveEntities(entities);
            return entities;
        },
        entitiesList() {
            return this.appEntities.map((entity) => entity.entity || '');
        },
        fieldsList() {
            let entity = this.appEntities.find((entity) => entity.entity === this.field.entity);
            return entity ? entity.options.map((option) => option.field) : [];
        },
    },
    watch: {
        'field.field'() {
            if (this.field.type === 'default') this.update('alias', this.field.entity + '.' + this.field.field);
        },
    },
    created() {
        if (!this.field.alias && this.field.entity && this.field.field)
            this.update('alias', this.field.entity + '.' + this.field.field);
    },
    methods: {
        update(key, value) {
            this.$emit(
                'input',
                tap(cloneDeep(this.field), (v) => set(v, key, value))
            );
        },
    },
};
</script>
