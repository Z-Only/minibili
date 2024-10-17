<script setup lang="ts">
import { VideoFormatFlag } from '@/apis/video/stream'

const route = useRoute()

const defaultFormat = VideoFormatFlag.MP4

const bvid = route.params.bvid as string
</script>

<template>
    <v-card>
        <v-responsive>
            <!-- <bili-iframe-player :bvid="bvid" /> -->

            <video-player :format="defaultFormat" :bvid="bvid" /> </v-responsive
    ></v-card>
</template>
