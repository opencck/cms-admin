<template>
    <div class="row flex-wrap">
        <div class="col-12"><v-divider></v-divider></div>
        <div class="col-12 col-md-6 col-lg-4">
            <v-select
                label="type"
                :value="view.type"
                :items="types"
                dense
                outlined
                hide-details
                @input="update('type', $event)"
            ></v-select>
        </div>
        <div v-if="!['hidden'].includes(view.type)" class="col-12 col-md-6 col-lg-4">
            <v-text-field
                label="name"
                :value="view.name"
                dense
                outlined
                hide-details
                @input="update('name', $event)"
            ></v-text-field>
        </div>
        <div class="col-12 col-md-6 col-lg-4">
            <v-text-field
                label="description"
                :value="view.description"
                dense
                outlined
                hide-details
                @input="update('description', $event)"
            ></v-text-field>
        </div>
    </div>
</template>
<script>
import { cloneDeep, set, tap } from 'lodash';

export default {
    props: ['value'],
    data: () => ({
        types: [
            {
                value: 'hidden',
                text: 'Hidden field',
            },
            {
                value: 'text',
                text: 'Text input',
            },
            {
                value: 'textarea',
                text: 'Textarea',
            },
            {
                value: 'editor',
                text: 'HTML Editor',
            },
            {
                value: 'date',
                text: 'DateTime selection',
            },
        ],
    }),
    computed: {
        view: {
            get() {
                return this.value || {};
            },
            set(value) {
                this.$emit('input', value);
            },
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
