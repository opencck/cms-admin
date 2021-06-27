<template>
    <div>
        <nuxt-link
            v-if="header.link"
            :to="localePath({ name: 'app-app-view-subview', params: { ...$route.params, subview: item['items.id'] } })"
            class="white--text text-decoration-none"
        >
            {{ value }}
        </nuxt-link>
        <template v-else>{{ value }}</template>
    </div>
</template>
<script>
export default {
    props: ['value', 'item', 'header'],
};
</script>
