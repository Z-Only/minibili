<script setup lang="ts">
import { formatDuration, formatPubDate, formatView } from '@/common/utils'

const router = useRouter()

const toVideo = (bvid: string) => {
    router.push({ name: 'Video', params: { bvid } })
}

defineProps(['video'])
</script>

<template>
    <v-card>
        <v-img
            class="align-end text-white"
            height="200px"
            :src="video.pic"
            cover
            @click.prevent="toVideo(video.bvid)"
        >
            <v-icon icon="mdi-play-box"></v-icon
            >{{ formatView(video.stat.view) }}
            <v-icon icon="mdi-message-text-fast"></v-icon
            >{{ video.stat.danmaku }}
            {{ formatDuration(video.duration) }}
        </v-img>
        <v-card-title class="title" @click.prevent="toVideo(video.bvid)">{{
            video.title
        }}</v-card-title>
        <v-card-actions>
            <div @click.prevent="toVideo(video.bvid)">
                <v-avatar size="24">
                    <v-img
                        :alt="video.owner.name"
                        :src="video.owner.face"
                    ></v-img> </v-avatar
                ><v-icon v-if="video.is_followed" icon="mdi-check-circle"
                    >已关注</v-icon
                >
                {{ video.owner.name }}
                {{ formatPubDate(video.pubdate) }}
            </div>
        </v-card-actions>
    </v-card>
</template>
