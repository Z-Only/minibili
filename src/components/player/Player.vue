<script setup lang="ts">
import { ShallowRef } from 'vue'
import { fetchVideoDetails } from '@/apis/video/info'
import { VideoDetails } from '@/apis/types/video-details'
import { PlayerInfo } from '@/apis/types/player-info'
import { fetchPlayerInfo, PlayerInfoParams } from '@/apis/video/player'
import {
    fetchPlayUrl,
    PlayUrlParams,
    VideoFormatFlag,
} from '@/apis/video/stream'
import { PlayUrl } from '@/apis/types/play-url'
import { error } from '@tauri-apps/plugin-log'

// auto-import the styles and elements required
import 'vidstack/bundle'
import type { MediaPlayerElement } from 'vidstack/elements'

const { format = VideoFormatFlag.MP4, bvid } = defineProps<{
    // 视频格式：DASH、MP4
    format?: VideoFormatFlag
    bvid: string
}>()

// 初始化 player
const player = useTemplateRef<MediaPlayerElement>('player')

const videoDetails: ShallowRef<VideoDetails | null> =
    shallowRef<VideoDetails | null>(null)

const playerInfo: ShallowRef<PlayerInfo | null> = shallowRef<PlayerInfo | null>(
    null
)

const playUrl: ShallowRef<PlayUrl | null> = shallowRef<PlayUrl | null>(null)

const url = ref('')

onMounted(async () => {
    if (!player.value) {
        error('Player is not initialized.')
    }

    await fetchVideoDetails({
        bvid,
    }).then(async (data) => {
        videoDetails.value = data

        await fetchPlayerInfo({
            bvid,
            cid: videoDetails.value?.cid,
        } as PlayerInfoParams).then((data) => {
            playerInfo.value = data
        })

        // 获取视频播放地址
        await fetchPlayUrl({
            bvid,
            cid: videoDetails.value?.cid,
            fnval: format,
            platform: format === VideoFormatFlag.MP4 ? 'html5' : 'pc',
        } as PlayUrlParams).then(async (data) => {
            playUrl.value = data

            if (format === VideoFormatFlag.MP4) {
                if (playUrl.value?.durl && playUrl.value.durl.length > 0) {
                    url.value = playUrl.value.durl[0].url as string
                }
            } else if (format === VideoFormatFlag.DASH) {
                url.value = playUrl.value?.dash?.video[0]?.base_url as string
            }

            console.log('%s URL: %s', format, url.value)

            if (format === VideoFormatFlag.MP4) {
                // TODO: MP4
                if (player.value) {
                    player.value.src = url.value
                } else {
                    error('Player is not initialized.')
                }
            } else if (format === VideoFormatFlag.DASH) {
                // TODO: DASH
            }
        })
    })
})

onBeforeUnmount(() => {
    // This call will destroy the player and all child instances.
    if (player.value) {
        player.value.destroy()
    }
})
</script>

<template>
    <v-card>
        <v-responsive>
            <media-player
                ref="player"
                :title="videoDetails?.title"
                playsInline
                keep-alive
                crossOrigin
                load="visible"
                poster-load="visible"
                storage="media-player-storage-key"
            >
                <media-provider>
                    <media-poster
                        class="vds-poster"
                        :src="videoDetails?.pic"
                        alt="Girl walks into campfire with gnomes surrounding her friend ready for their next meal!"
                    />
                </media-provider>
                <!-- Layouts -->
                <media-audio-layout />
                <media-video-layout />
            </media-player> </v-responsive
    ></v-card>
</template>
