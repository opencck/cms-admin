<template>
    <div class="row flex-wrap">
        <div class="col-12 col-md-4">
            <v-select
                label="viewType"
                :value="view.type"
                :items="types"
                dense
                outlined
                hide-details
                @input="update('type', $event)"
            ></v-select>
        </div>
        <div class="col-12 col-md-4">
            <v-text-field
                label="viewLabel"
                :value="view.label"
                dense
                outlined
                hide-details
                @input="update('label', $event)"
            ></v-text-field>
        </div>
        <div class="col-12 col-md-4">
            <v-text-field
                label="viewDescription"
                :value="view.description"
                dense
                outlined
                hide-details
                @input="update('description', $event)"
            ></v-text-field>
        </div>
        <template v-if="view.type === 'select'">
            <div class="col-12 col-md-4 col-lg-3">
                <v-select
                    label="selectType"
                    :value="view.selectType"
                    :items="['options', 'query']"
                    dense
                    outlined
                    hide-details
                    @input="update('selectType', $event)"
                ></v-select>
            </div>
            <template v-if="view.selectType === 'query'">
                <div class="col-12 col-md-4 col-lg-3">
                    <v-select
                        label="entity"
                        :value="view.selectEntity"
                        :items="entitiesList"
                        dense
                        outlined
                        hide-details
                        @input="update('selectEntity', $event)"
                    ></v-select>
                </div>
                <div class="col-12 col-md-4 col-lg-3">
                    <v-select
                        label="valueField"
                        :value="view.selectField"
                        :items="fieldsList"
                        dense
                        outlined
                        hide-details
                        @input="update('selectField', $event)"
                    ></v-select>
                </div>
                <div class="col-12 col-md-4 col-lg-3">
                    <v-select
                        label="keyField"
                        :value="view.selectKey"
                        :items="fieldsList"
                        dense
                        outlined
                        hide-details
                        @input="update('selectKey', $event)"
                    ></v-select>
                </div>
            </template>
            <div v-if="view.selectType === 'options'" class="col-12 col-md-8 col-lg-9">
                <options :value="view.selectOptions" @input="update('selectOptions', $event)"></options>
            </div>
        </template>
    </div>
</template>
<script>
import { cloneDeep, set, tap } from 'lodash';
import options from './fieldView/options.vue';

export default {
    components: { options },
    props: {
        value: {
            default() {
                return {
                    type: 'default',
                    label: '',
                    description: '',
                };
            },
        },
        entities: {
            type: Array,
            default() {
                return [];
            },
        },
    },
    data: () => ({
        types: ['default', 'hidden', 'text', 'textarea', 'editor', 'checkbox', 'select', 'date', 'file'],
        items: [
            {
                text: 'default',
                value: {
                    type: 'default',
                },
            },
            {
                text: 'checker',
                value: {
                    type: 'checker',
                },
            },
        ],
    }),
    computed: {
        view: {
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
            let entity = this.appEntities.find((entity) => entity.entity === this.view.selectEntity);

            let fields = entity ? entity.options.map((option) => entity.entity + '.' + option.field) : [];
            this.appEntities.forEach((entity) => {
                entity.relations.forEach((relation) => {
                    if (!relation.multiple && relation.entity === this.view.selectEntity) {
                        entity.options.forEach((option) => fields.push(entity.entity + '.' + option.field));
                    }
                });
            });
            return fields;
        },
    },
    methods: {
        update(key, value) {
            this.$emit(
                'input',
                tap(cloneDeep(this.view), (v) => set(v, key, value))
            );
        },
    },
};
</script>
