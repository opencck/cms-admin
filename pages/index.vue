<template>
    <v-layout column justify-center align-center>
        <v-flex xs12 sm8 md6>
            <v-card>
                <v-card-title class="headline">{{ $t('welcome') }} to the cck admin panel</v-card-title>
                <v-card-text>
                    <nuxt-link :to="localePath('/apps')">List of apps</nuxt-link>
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn color="primary" nuxt :to="localePath('/app/apps')">Continue</v-btn>
                </v-card-actions>
            </v-card>
        </v-flex>
    </v-layout>
</template>
<script>
export default {
    created() {
        console.log(this.$route);
    },
};
</script>
