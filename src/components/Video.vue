<script setup lang="ts">
import videojs from 'video.js'
import 'video.js/dist/video-js.css'
import { fetchVideoDetails } from '@/apis/video/info'
import { VideoDetails } from '@/apis/types/video-details'
import { PlayerInfo } from '@/apis/types/player-info'
import { fetchPlayerInfo, PlayerInfoParams } from '@/apis/video/player'
import { fetchPlayUrl, PlayUrlParams } from '@/apis/video/stream'
import { PlayUrl } from '@/apis/types/play-url'
import { invoke } from '@tauri-apps/api/core'

const route = useRoute()

const videoDetails: Ref<VideoDetails | null> = ref<VideoDetails | null>(null)

const playerInfo: Ref<PlayerInfo | null> = ref<PlayerInfo | null>(null)

const playUrl: Ref<PlayUrl | null> = ref<PlayUrl | null>(null)

const getVideoDetails = async () => {
    await fetchVideoDetails({
        bvid: Array.isArray(route.params.bvid)
            ? route.params.bvid[0]
            : route.params.bvid,
    }).then((data) => {
        videoDetails.value = data
    })
}

const getPlayerInfo = async () => {
    await fetchPlayerInfo({
        bvid: route.params.bvid,
        cid: videoDetails.value?.cid,
    } as PlayerInfoParams).then((data) => {
        playerInfo.value = data
    })
}

const getPlayUrl = async () => {
    await fetchPlayUrl({
        bvid: route.params.bvid,
        cid: videoDetails.value?.cid,
    } as PlayUrlParams).then((data) => {
        playUrl.value = data
    })
}

onMounted(async () => {
    await getVideoDetails()
    JSON.stringify(videoDetails.value)

    await getPlayerInfo()

    await getPlayUrl()
    console.log(`playUrl: ${JSON.stringify(playUrl.value)}`)

    const player = videojs(
        'my-player',
        {
            // 封面图
            poster: videoDetails.value?.pic,
            language: 'zh-CN',
            // 设置自动播放
            autoplay: true,
            // 设置了它为true，才可实现自动播放,同时视频也被静音 （Chrome66及以上版本，禁止音视频的自动播放）
            muted: true,
            // 预加载
            preload: 'none',
            // 显示播放的控件
            controls: true,
            // 进度条
            liveui: true,
            notSupportedMessage: '此视频暂无法播放，请稍后再试', // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
            // 播放速率
            playbackRates: [0.5, 1, 2, 4, 8, 16],
            controlBar: {
                // 画中画
                pictureInPictureToggle: false,
                // 当前时间和持续时间的分隔符
                timeDivider: true,
                // 显示持续时间
                durationDisplay: true,
                // 是否显示剩余时间功能
                remainingTimeDisplay: true,
                // 是否显示全屏按钮
                fullscreenToggle: true,
            },
        },
        function onPlayerReady() {
            videojs.log('Your player is ready!')
            this.on('ended', function () {
                videojs.log('Awww...over so soon?!')
            })
        }
    )

    const url = playUrl.value?.durl[0]?.url

    // TODO: 视频流式播放 https://zhuanlan.zhihu.com/p/643297227，请求方式变为 channel?
    await invoke('req_video', { url })
        .then((response) => {
            const arrayBuffer = response as ArrayBuffer
            const blob = new Blob([new Uint8Array(arrayBuffer)], {
                type: 'video/mp4',
            })
            const blobUrl = URL.createObjectURL(blob)
            console.log('Blob URL:', blobUrl) // 调试信息
            player.src({ src: blobUrl, type: 'video/mp4' })
            player.play()
        })
        .catch((error) => console.error(error))
})
</script>

<template>
    <v-card>
        <v-responsive>
            <video id="my-player" class="video-js" width="640" height="480">
                <p class="vjs-no-js">
                    To view this video please enable JavaScript, and consider
                    upgrading to a web browser that
                    <a
                        href="https://videojs.com/html5-video-support/"
                        target="_blank"
                    >
                        supports HTML5 video
                    </a>
                </p>
            </video>
        </v-responsive></v-card
    >
</template>
