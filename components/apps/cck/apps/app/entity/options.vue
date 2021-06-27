<template>
    <div class="options">
        <v-expansion-panels v-model="selectedOption" accordion multiple focusable>
            <draggable v-model="options" class="d-flex flex-wrap" handle=".options-handle" style="width: 100%">
                <v-expansion-panel v-for="(option, index) in options" :key="index">
                    <v-tooltip :disabled="!(option.view && option.view.description)" bottom>
                        <template v-slot:activator="{ on, attrs }">
                            <v-expansion-panel-header v-bind="attrs" class="flex-wrap options-handle" ripple v-on="on">
                                <span>
                                    {{ option.field }}
                                </span>
                                <span class="ma-1 yellow--text">{{ option.type }}</span>
                                <span class="ma-1 orange--text">{{ option.null }}</span>
                                <span class="ma-1 green--text">
                                    {{ option.default ? 'DEFAULT ' + option.default : '' }}
                                </span>
                                <span class="ma-1">
                                    <v-icon v-if="option.auto_increment === 1" title="AUTO_INCREMENT">
                                        mdi-format-list-numbered
                                    </v-icon>
                                    <v-icon
                                        v-if="priKeysList.includes(option.field)"
                                        color="yellow"
                                        title="PRIMARY KEY"
                                        small
                                    >
                                        mdi-key-outline
                                    </v-icon>
                                    <v-icon v-if="idxKeysList.includes(option.field)" title="STATIC KEY" small>
                                        mdi-key-outline
                                    </v-icon>
                                    <v-icon
                                        v-if="uniKeysList.includes(option.field)"
                                        color="purple"
                                        title="UNIQUE KEY"
                                        small
                                    >
                                        mdi-key-outline
                                    </v-icon>
                                    <v-icon
                                        v-if="fkKeysList.includes(option.field)"
                                        color="green"
                                        title="FOREIGN KEY"
                                        small
                                    >
                                        mdi-key-outline
                                    </v-icon>
                                </span>
                            </v-expansion-panel-header>
                        </template>
                        <span v-if="option.view && option.view.description">
                            {{ option.view.description }}
                        </span>
                    </v-tooltip>
                    <v-expansion-panel-content class="pa-md-2">
                        <entity-option
                            :value="option"
                            :haveAutoIncrement="haveAutoIncrement"
                            @input="setOption($event, index)"
                            @delete="delOption(index)"
                        ></entity-option>
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </draggable>
        </v-expansion-panels>
        <v-menu :rounded="true" offset-y>
            <template v-slot:activator="{ attrs, on }">
                <v-btn color="primary" class="white--text mt-3" v-bind="attrs" v-on="on">Add option</v-btn>
            </template>

            <v-list dense>
                <v-list-item v-for="preset in presets" :key="preset.name" link @click="addOption(preset.option)">
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
import entityOption from './option.vue';
export default {
    components: {
        entityOption,
    },
    props: ['value', 'keys', 'entities'],
    data: () => ({
        selectedOption: [],
    }),
    computed: {
        options: {
            get() {
                return this.value;
            },
            set(value) {
                this.$emit('input', value);
            },
        },
        haveAutoIncrement() {
            console.log('haveAutoIncrement', this.options);
            return !!this.options.find((option) => option.auto_increment === 1);
        },
        presets() {
            return [
                {
                    name: 'custom',
                    label: 'Custom',
                    option: { type: '', null: '', default: null, auto_increment: 0, view: {} },
                },
                ...(this.haveAutoIncrement
                    ? []
                    : [
                          {
                              name: 'id',
                              label: 'ID',
                              option: {
                                  type: 'int(11) unsigned',
                                  null: 'NOT NULL',
                                  default: null,
                                  auto_increment: 1,
                                  view: {
                                      type: 'hidden',
                                  },
                              },
                          },
                      ]),
                {
                    name: 'int',
                    label: 'Integer',
                    option: {
                        type: 'int(11) unsigned',
                        null: 'NOT NULL',
                        default: '0',
                        auto_increment: 0,
                        view: { type: 'text', name: 'Number' },
                    },
                },
                {
                    name: 'smallint',
                    label: 'SmallInt',
                    option: {
                        type: 'smallint(8)',
                        null: 'NOT NULL',
                        default: '0',
                        auto_increment: 0,
                        view: { type: 'text', name: 'Number' },
                    },
                },
                {
                    name: 'varchar',
                    label: 'Varchar',
                    option: {
                        type: 'varchar(255)',
                        null: '',
                        default: '',
                        auto_increment: 0,
                        view: { type: 'text', name: 'String' },
                    },
                },
                {
                    name: 'text',
                    label: 'Text',
                    option: {
                        type: 'text',
                        null: 'NULL',
                        default: null,
                        auto_increment: 0,
                        view: { type: 'textarea', name: 'Text' },
                    },
                },
                {
                    name: 'mediumtext',
                    label: 'MediumText',
                    option: {
                        type: 'mediumtext',
                        null: 'NULL',
                        default: null,
                        auto_increment: 0,
                        view: { type: 'editor', name: 'Text' },
                    },
                },
                {
                    name: 'timestamp',
                    label: 'TimeStamp',
                    option: {
                        type: 'timestamp',
                        null: 'NOT NULL',
                        default: 'CURRENT_TIMESTAMP',
                        auto_increment: 0,
                        view: { type: 'date', name: 'Date' },
                    },
                },
            ];
        },
        priKeysList() {
            return this.keys
                .filter((key) => key.type === 'PRIMARY')
                .reduce((keys, key) => {
                    if (key.fields && key.fields.length) {
                        keys = keys.concat(key.fields);
                    } else {
                        keys.push(key.key);
                    }
                    return keys;
                }, []);
        },
        idxKeysList() {
            return this.keys
                .filter((key) => key.type === 'STATIC')
                .reduce((keys, key) => (key.fields && key.fields.length ? keys.concat(key.fields) : keys), []);
        },
        uniKeysList() {
            return this.keys
                .filter((key) => key.type === 'UNIQUE')
                .reduce((keys, key) => (key.fields && key.fields.length ? keys.concat(key.fields) : keys), []);
        },
        fkKeysList() {
            return this.keys
                .filter((key) => key.type === 'FOREIGN')
                .reduce((keys, key) => (key.fields && key.fields.length ? keys.concat(key.fields) : keys), []);
        },
    },
    methods: {
        setOption(option, index) {
            let options = cloneDeep(this.options);
            options.splice(index, 1, option);
            this.$emit('input', options);
        },
        delOption(index) {
            let options = cloneDeep(this.options);
            options.splice(index, 1);
            this.$emit('input', options);
        },
        addOption(option) {
            let options = cloneDeep(this.options);
            options.push(option);
            this.$emit('input', options);
            this.selectedOption.push(this.options.length);
        },
    },
};
</script>
