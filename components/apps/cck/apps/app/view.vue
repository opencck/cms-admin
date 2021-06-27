<template>
    <v-card class="mt-md-3 mb-md-3" outlined>
        <v-card-title class="views-handle">
            {{ view.label }}
            <v-btn v-if="!edit" color="secondary" x-small @click="edit = true">Edit</v-btn>
        </v-card-title>
        <v-card-subtitle v-if="view.name">
            {{ view.name }}
        </v-card-subtitle>
        <v-card-text>
            <div class="row flex-wrap">
                <template v-if="edit">
                    <div class="col-12 col-md-4">
                        <v-combobox
                            label="name"
                            :value="view.name"
                            :items="['items', 'item']"
                            rows="1"
                            filled
                            auto-grow
                            dense
                            hide-details
                            @input="update('name', $event)"
                        ></v-combobox>
                    </div>
                    <div class="col-12 col-md-4">
                        <v-text-field
                            label="label"
                            :value="view.label"
                            filled
                            dense
                            hide-details
                            @input="update('label', $event)"
                        ></v-text-field>
                    </div>
                    <div class="col-12 col-md-4">
                        <v-autocomplete
                            label="entity"
                            :value="view.entity"
                            :items="entitiesList"
                            filled
                            dense
                            hide-details
                            @input="update('entity', $event)"
                        ></v-autocomplete>
                    </div>
                    <div class="col-12">
                        <v-tabs v-model="tab">
                            <v-tab>list</v-tab>
                            <v-tab>item</v-tab>
                            <v-tab-item>
                                <view-field-sets
                                    :value="view.items"
                                    :entities="entities"
                                    :entity="view.entity"
                                    type="items"
                                    @input="update('items', $event)"
                                ></view-field-sets>
                            </v-tab-item>
                            <v-tab-item>
                                <view-field-sets
                                    :value="view.item"
                                    :entities="entities"
                                    :entity="view.entity"
                                    type="item"
                                    @input="update('item', $event)"
                                ></view-field-sets>
                            </v-tab-item>
                        </v-tabs>
                    </div>
                    <div class="mt-1"><v-btn color="error" small @click="$emit('delete')">Delete view</v-btn></div>
                </template>
                <pre>{{ view }}</pre>
            </div>
        </v-card-text>
    </v-card>
</template>
<script>
import { cloneDeep, set, tap } from 'lodash';

import viewFieldSets from './view/fieldSets.vue';

export default {
    name: 'AppView',
    components: { 'view-field-sets': viewFieldSets },
    props: ['value', 'entities'],
    data: () => ({
        edit: false,
        tab: 0,
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
    },
    created() {
        if (!this.view.label) this.edit = true;
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
