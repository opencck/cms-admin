<template>
    <div>
        <div class="row flex-wrap">
            <div class="col-12 col-md-6 col-lg-4">
                <v-select
                    label="type"
                    :value="option.type"
                    :items="['string', 'integer', 'float', 'boolean']"
                    dense
                    outlined
                    hide-details
                    @input="update('type', $event)"
                ></v-select>
            </div>
            <div class="col-12 col-md-6 col-lg-4">
                <v-text-field
                    label="text"
                    :value="option.text"
                    :autofocus="!option.text"
                    dense
                    outlined
                    hide-details
                    @input="update('text', $event)"
                ></v-text-field>
            </div>
            <div class="col-12 col-md-6 col-lg-4">
                <v-text-field
                    v-if="option.type !== 'boolean'"
                    label="value"
                    :value="option.value"
                    dense
                    outlined
                    hide-details
                    @input="update('value', $event)"
                ></v-text-field>
                <v-select
                    v-else
                    label="value"
                    :value="option.value"
                    :items="[true, false]"
                    dense
                    outlined
                    hide-details
                    @input="update('value', $event)"
                ></v-select>
            </div>
        </div>
        <div class="mt-1"><v-btn color="error" small @click="$emit('delete')">Delete option</v-btn></div>
    </div>
</template>
<script>
import { cloneDeep, set, tap } from 'lodash';

export default {
    props: ['value', 'haveAutoIncrement'],
    data: () => ({}),
    computed: {
        option: {
            get() {
                return this.value;
            },
            set(value) {
                this.$emit('input', value);
            },
        },
    },
    watch: {
        'option.type'() {
            this.update('value', this.option.value);
        },
    },
    methods: {
        valueWithType(value, type) {
            switch (type) {
                case 'integer':
                    value = parseInt(value);
                    break;
                case 'float':
                    value = parseFloat(value);
                    break;
                case 'boolean':
                    value = !!value;
                    break;
                case 'string':
                default:
                    value = value + '';
                    break;
            }
            return !isNaN(value) ? value : this.valueWithType(0, type);
        },
        update(key, value) {
            if (key === 'value') {
                value = this.valueWithType(value, this.option.type);
            }
            this.$emit(
                'input',
                tap(cloneDeep(this.option), (v) => set(v, key, value))
            );
        },
    },
};
</script>
