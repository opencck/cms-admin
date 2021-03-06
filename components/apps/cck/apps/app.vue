<template>
	<v-card class="mt-md-3 mb-md-3">
		<v-card-title class="apps-handle">
			<span>
				<v-icon>mdi-bookmark-outline</v-icon>
				{{ app.name }}
			</span>
			<span>{{ app.label ? '&nbsp;- ' + app.label : '' }}</span>
		</v-card-title>
		<v-card-subtitle v-if="app.description">
			{{ app.description }}
		</v-card-subtitle>
		<v-card-text>
			<div v-if="edit" class="row flex-wrap">
				<div class="col-12 col-md-6 col-lg-4">
					<v-text-field
						v-mask="mask"
						label="name"
						filled
						hide-details
						:value="app.name"
						@input="update('name', $event)"
					></v-text-field>
				</div>
				<div class="col-12 col-md-6 col-lg-4">
					<v-text-field
						label="label"
						filled
						hide-details
						:value="app.label"
						@input="update('label', $event)"
					></v-text-field>
				</div>
				<div class="col-12 col-lg-4">
					<v-textarea
						label="description"
						rows="1"
						filled
						auto-grow
						dense
						hide-details
						:value="app.description"
						@input="update('description', $event)"
					></v-textarea>
				</div>
			</div>
			<v-btn v-if="!edit" large color="secondary" @click="edit = true">Edit</v-btn>
			<template v-if="edit">
				<v-tabs v-model="tab">
					<v-tab>ORM</v-tab>
					<v-tab>Views</v-tab>
					<v-tab-item class="pt-1">
						<v-btn large color="primary" @click="newEntity">New entity</v-btn>
						<div class="entities">
							<draggable v-model="entities" handle=".entities-handle">
								<div v-for="(entity, index) in entities" :key="entity.id">
									<app-entity
										:value="entity"
										:entities="entities"
										@input="setEntity($event, index)"
									></app-entity>
								</div>
							</draggable>
						</div>
					</v-tab-item>
					<v-tab-item class="pt-1">
						<v-btn large color="primary" @click="newView">New view</v-btn>
						<div class="views">
							<draggable v-model="views" handle=".views-handle">
								<div v-for="(view, index) in views" :key="index">
									<app-view
										:value="view"
										:entities="entities"
										@input="setView($event, index)"
										@delete="deleteView(index)"
									></app-view>
								</div>
							</draggable>
						</div>
					</v-tab-item>
				</v-tabs>
			</template>
		</v-card-text>
	</v-card>
</template>
<script>
import { cloneDeep, set, tap, debounce } from 'lodash';
import appView from './app/view.vue';

export default {
	components: { appView },
	props: ['value'],
	data: () => ({
		mask: {
			mask: '????????????????',
			tokens: { '?': { pattern: /[0-9a-zA-Z_]/, transform: (v) => v.toLocaleLowerCase() } },
		},
		edit: false,
		tab: 0,
	}),
	computed: {
		app: {
			get() {
				return this.value;
			},
			set(value) {
				this.$emit('input', value);
			},
		},
		entities: {
			get() {
				return this.app.entities;
			},
			set(value) {
				let app = { ...this.app };
				app.entities = value.map((entity, index) => ({ ...entity, ordering: index }));
				this.$emit('input', app);
			},
		},
		views: {
			get() {
				return this.app.views;
			},
			set(value) {
				let app = { ...this.app };
				app.views = value.map((view, index) => ({ ...view, ordering: index }));
				this.$emit('input', app);
			},
		},
	},
	methods: {
		setEntity: debounce(function (entity, index) {
			let app = cloneDeep(this.app);
			app.entities[index] = entity;
			this.$emit('input', app);
		}, 100),
		setView: debounce(function (view, index) {
			let app = cloneDeep(this.app);
			app.views[index] = view;
			this.$emit('input', app);
		}, 100),
		deleteView(index) {
			let app = cloneDeep(this.app);
			app.views.splice(index, 1);
			this.$emit('input', app);
		},
		update: debounce(function (key, value) {
			this.$emit(
				'input',
				tap(cloneDeep(this.app), (v) => set(v, key, value))
			);
		}, 100),
		newEntity() {
			let app = cloneDeep(this.app);
			app.entities = [
				{
					entity: '',
					name: '',
					description: '',
					options: [],
					keys: [],
					relations: [],
				},
				...app.entities,
			];
			this.$emit('input', app);
		},
		newView() {
			let app = cloneDeep(this.app);
			app.views = [
				{
					type: 'items',
					label: '',
					items: [],
					item: [],
				},
				...(app.views || []),
			];
			this.$emit('input', app);
		},
	},
};
</script>
<style>
.v-slide-group__prev {
	display: none !important;
}
</style>
