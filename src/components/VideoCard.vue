<script setup lang="ts">
import { formatDuration, formatPubDate, formatView } from '@/common/utils'
import { VideoCardData } from '@/common/types/props'

// 获取路由实例
const router = useRouter()

/**
 * 导航到指定视频页面
 * @param bvid 视频ID
 */
const navigateToVideo = (bvid: string) => {
    router.push({ name: 'Video', params: { bvid } })
}

const navigateToSpace = (mid: number) => {
    router.push({ name: 'Space', params: { mid } })
}

const { video } = defineProps<{
    video: VideoCardData
}>()
</script>

<template>
    <!-- 视频卡片 -->
    <v-card>
        <!-- 封面图片 -->
        <v-img
            class="align-end text-white"
            :src="video.pic_url"
            :aspect-ratio="4 / 3"
            lazy-src="https://i0.hdslb.com/bfs/archive/c8fd97a40bf79f03e7b76cbc87236f612caef7b2.png"
            cover
            @click.prevent="navigateToVideo(video.bvid)"
        >
            <template v-slot:placeholder>
                <div class="d-flex align-center justify-center fill-height">
                    <v-progress-circular
                        color="grey-lighten-4"
                        indeterminate
                    ></v-progress-circular>
                </div>
            </template>
            <!-- 显示播放次数和时长 -->
            <v-icon icon="mdi-play-box">{{ formatView(video.view) }}</v-icon>
            <v-icon icon="mdi-message-text-fast">{{ video.danmaku }}</v-icon>
            {{ formatDuration(video.duration) }}
        </v-img>

        <!-- 标题部分 -->
        <v-card-title @click.prevent="navigateToVideo(video.bvid)">
            <div
                v-html="video.title"
                class="d-inline-block text-truncate"
                style="max-width: 100%"
            ></div>
            <!-- 提示框显示完整标题 -->
            <v-tooltip activator="parent" location="bottom">
                <div v-html="video.title"></div>
            </v-tooltip>
        </v-card-title>

        <!-- 作者信息 -->
        <v-card-actions>
            <div @click.prevent="navigateToSpace(video.mid)" class="d-flex">
                <!-- 用户头像 -->
                <v-avatar size="24">
                    <v-img
                        :alt="video.author_name"
                        :src="video.avatar_url"
                    ></v-img>
                </v-avatar>
                <!-- 关注状态 -->
                <v-icon v-if="video.is_followed" icon="mdi-check-circle"
                    >已关注</v-icon
                >
                <!-- 作者名和发布时间 -->
                <div class="text-truncate mx-auto">
                    &nbsp;{{ video.author_name }}
                    {{ formatPubDate(video.pubdate) }}
                    <v-tooltip activator="parent" location="bottom">
                        {{ video.author_name }}
                        {{ formatPubDate(video.pubdate) }}
                    </v-tooltip>
                </div>
            </div>
        </v-card-actions>
    </v-card>
</template>
