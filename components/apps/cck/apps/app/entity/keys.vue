<template>
    <div class="keys">
        <v-expansion-panels v-model="selectedKey" accordion multiple focusable>
            <draggable v-model="keys" class="d-flex flex-wrap" handle=".keys-handle" style="width: 100%">
                <v-expansion-panel v-for="(key, index) in keys" :key="index">
                    <v-tooltip :disabled="!key.description" bottom>
                        <template v-slot:activator="{ on, attrs }">
                            <v-expansion-panel-header v-bind="attrs" class="flex-wrap keys-handle" ripple v-on="on">
                                <span>{{ key.key }}</span>
                                <span class="ma-1 yellow--text">{{ key.type }}</span>
                                <span v-if="key.fields" class="ma-1 orange--text">{{ key.fields }}</span>
                                <span v-else-if="key.type === 'PRIMARY'" class="ma-1 orange--text">
                                    {{ [key.key] }}
                                </span>
                                <span class="ma-1 green--text">
                                    {{ key.default ? 'DEFAULT ' + key.default : '' }}
                                </span>
                                <span class="ma-1">
                                    <v-icon v-if="key.auto_increment === 1" title="AUTO_INCREMENT">
                                        mdi-format-list-numbered
                                    </v-icon>
                                </span>
                            </v-expansion-panel-header>
                        </template>
                        <span v-if="key.description">
                            {{ key.description }}
                        </span>
                    </v-tooltip>
                    <v-expansion-panel-content class="pa-md-2">
                        <entity-key
                            :value="key"
                            :options="options"
                            :entities="entities"
                            :havePrimary="havePrimary"
                            @input="setKey($event, index)"
                            @delete="delKey(index)"
                        ></entity-key>
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </draggable>
        </v-expansion-panels>
        <v-menu :rounded="true" offset-y>
            <template v-slot:activator="{ attrs, on }">
                <v-btn color="primary" class="white--text mt-3" v-bind="attrs" v-on="on">Add key</v-btn>
            </template>

            <v-list dense>
                <v-list-item v-for="preset in presets" :key="preset.name" link @click="addKey(preset.key)">
                    <v-list-item-title>
                        {{ preset.label }}
                    </v-list-item-title>
                </v-list-item>
            </v-list>
        </v-menu>
    </div>
</template>
<script>
import { cloneDeep /*set, tap*/ } from 'lodash';
import entityKey from './key.vue';

export default {
    components: {
        entityKey,
    },
    props: ['value', 'options', 'entities'],
    data: () => ({
        selectedKey: [],
    }),
    computed: {
        keys: {
            get() {
                return this.value;
            },
            set(value) {
                this.$emit('input', value);
            },
        },
        havePrimary() {
            return !!this.keys.find((key) => key.type === 'PRIMARY');
        },
        presets() {
            return [
                {
                    name: 'custom',
                    label: 'Custom',
                    key: { key: '', name: '', description: '', type: 'STATIC', fields: [], references: {} },
                },
                ...(this.havePrimary
                    ? []
                    : [
                          {
                              name: 'id',
                              label: 'PRIMARY',
                              key: {
                                  key: 'id',
                                  name: 'ID',
                                  description: '',
                                  type: 'PRIMARY',
                                  fields: ['id'],
                                  references: {},
                              },
                          },
                      ]),
                {
                    name: 'static',
                    label: 'Static',
                    key: {
                        key: '',
                        name: '',
                        description: '',
                        type: 'STATIC',
                        fields: [],
                        references: {},
                    },
                },
                {
                    name: 'unique',
                    label: 'Unique',
                    key: {
                        key: '',
                        name: '',
                        description: '',
                        type: 'UNIQUE',
                        fields: [],
                        references: {},
                    },
                },
                {
                    name: 'foreign',
                    label: 'Foreign',
                    key: {
                        key: '',
                        name: '',
                        description: '',
                        type: 'FOREIGN',
                        fields: [],
                        references: {
                            entity: null,
                            fields: [],
                        },
                    },
                },
            ];
        },
    },
    methods: {
        setKey(option, index) {
            let keys = cloneDeep(this.keys);
            keys.splice(index, 1, option);
            this.$emit('input', keys);
        },
        delKey(index) {
            let keys = cloneDeep(this.keys);
            keys.splice(index, 1);
            this.$emit('input', keys);
        },
        addKey(option) {
            let keys = cloneDeep(this.keys);
            keys.push(option);
            this.$emit('input', keys);
            this.selectedKey.push(this.keys.length);
        },
    },
};
</script>
