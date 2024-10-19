<script setup lang="ts">
import { ShallowRef } from 'vue'
import videojs from 'video.js'
import 'video.js/dist/video-js.css'
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
// import { invoke } from '@tauri-apps/api/core'
import Player from 'video.js/dist/types/player'
import { error } from '@tauri-apps/plugin-log'
import Tech from 'video.js/dist/types/tech/tech'

const { format = VideoFormatFlag.MP4, bvid } = defineProps<{
    // 视频格式：DASH、MP4
    format?: VideoFormatFlag
    bvid: string
}>()

// 初始化 player
const videoPlayer = useTemplateRef('videoPlayer')

let player: Player

const videoDetails: ShallowRef<VideoDetails | null> =
    shallowRef<VideoDetails | null>(null)

const playerInfo: ShallowRef<PlayerInfo | null> = shallowRef<PlayerInfo | null>(
    null
)

const playUrl: ShallowRef<PlayUrl | null> = shallowRef<PlayUrl | null>(null)

const url = ref('')

onMounted(async () => {
    if (!videoPlayer.value) {
        error('videoPlayer is null')
        return
    }
    player = videojs(
        videoPlayer.value,
        {
            // 封面图
            poster: videoDetails.value?.pic,
            language: 'zh-CN',
            // 设置自动播放
            autoplay: false,
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
            playbackRates: [0.5, 1, 1.5, 2],
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
            // VHS
            html5: {
                vhs: {
                    overrideNative: true,
                },
                nativeAudioTracks: false,
                nativeVideoTracks: false,
            },
        },
        function onPlayerReady() {
            videojs.log('Your player is ready!')
            this.on('ended', function () {
                videojs.log('Awww...over so soon?!')
            })
        }
    )

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
                player.src({ src: url.value, type: 'video/mp4' })
                player.play()
                // // TODO: 视频流式播放 https://zhuanlan.zhihu.com/p/643297227，请求方式变为 channel?
                // await invoke('req_video', { url: url.value })
                //     .then((response) => {
                //         const arrayBuffer = response as ArrayBuffer
                //         const blob = new Blob([new Uint8Array(arrayBuffer)], {
                //             type: 'video/mp4',
                //         })
                //         const blobUrl = URL.createObjectURL(blob)
                //         console.log('Blob URL:', blobUrl) // 调试信息
                //         player.src({ src: blobUrl, type: 'video/mp4' })
                //         player.play()
                //     })
                //     .catch((error) => console.error(error))
            } else if (format === VideoFormatFlag.DASH) {
                player.on('xhr-hooks-ready', () => {
                    const playerXhrRequestHook = (options) => {
                        options.beforeSend = (xhr: XMLHttpRequest) => {
                            console.log('xhr:', xhr)

                            xhr.setRequestHeader(
                                'Referer',
                                'https://www.bilibili.com'
                            )
                        }
                        return options
                    }
                    const tech: Tech = player.tech()
                    const vhsHandler = tech.vhs
                    vhsHandler.xhr.onRequest(playerXhrRequestHook)
                })

                player.src({ src: url.value, type: 'application/dash+xml' })
                player.play()
            }
        })
    })
})

onBeforeUnmount(() => {
    if (player) {
        player.dispose()
    }
})
</script>

<template>
    <v-card>
        <v-responsive>
            <video ref="videoPlayer" class="video-js" width="640" height="480">
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
