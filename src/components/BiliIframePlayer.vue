<script setup lang="ts">
const VIDEO_LINK = 'https://player.bilibili.com/player.html'

defineProps<{
    bvid: string
}>()
</script>

<template>
    <v-card>
        <v-responsive>
            <iframe
                :src="VIDEO_LINK + '?bvid=' + bvid"
                scrolling="no"
                border="0"
                frameborder="no"
                framespacing="0"
                allowfullscreen="true"
            ></iframe> </v-responsive
    ></v-card>
</template>
