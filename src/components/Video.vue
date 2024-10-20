<script setup lang="ts">
import { open } from '@tauri-apps/plugin-dialog'
import { Store } from '@tauri-apps/plugin-store'
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
import { invoke, Channel } from '@tauri-apps/api/core'
import { getFileNameFromUrl, formatBytes, formatDuration } from '@/common/utils'
import { videoDir, join } from '@tauri-apps/api/path'

const route = useRoute()

const bvid = route.params.bvid as string

const store = new Store('settings.json')

const format = VideoFormatFlag.MP4

const videoDetails: ShallowRef<VideoDetails | null> =
    shallowRef<VideoDetails | null>(null)

const playerInfo: ShallowRef<PlayerInfo | null> = shallowRef<PlayerInfo | null>(
    null
)

const playUrl: ShallowRef<PlayUrl | null> = shallowRef<PlayUrl | null>(null)

const src = ref('')

const openDialog = async () => {
    // Open a dialog
    const path = await open({
        directory: true,
        multiple: false,
        defaultPath: await videoDir(),
    })
    // Prints file path and name to the console
    console.log('open path: ', path)

    // Save the path to the store
    await store.set('download_path', path)
}

type DownloadEvent =
    | {
          event: 'started'
          data: {
              url: string
              downloadId: number
              contentLength: number
          }
      }
    | {
          event: 'progress'
          data: {
              downloadId: number
              downloadedBytes: number
              speed: number
              costTime: number
              estimatedTime: number
          }
      }
    | {
          event: 'finished'
          data: {
              downloadId: number
          }
      }

const contentLength = ref(0)
const downloadedBytes = ref(0)
const speed = ref(0)
const costTime = ref(0)
const estimatedTime = ref(0)

const progress = computed(() => {
    return (downloadedBytes.value / contentLength.value) * 100
})

const progressDisplay = computed(() => {
    return `${formatBytes(downloadedBytes.value)} / ${formatBytes(contentLength.value)} 
    ${formatBytes(speed.value)}/s ${formatDuration(costTime.value)}/${formatDuration(estimatedTime.value)}`
})

const onEvent = new Channel<DownloadEvent>()

onEvent.onmessage = (message) => {
    console.log(
        `got download: event ${message.event}, data: ${JSON.stringify(message.data)}`
    )
    switch (message.event) {
        case 'started':
            contentLength.value = message.data.contentLength
            break
        case 'progress':
            downloadedBytes.value = message.data.downloadedBytes
            speed.value = message.data.speed
            costTime.value = message.data.costTime
            estimatedTime.value = message.data.estimatedTime
            break
        case 'finished':
            console.log('Download finished')
            break
    }
}

const downloadVideo = async () => {
    // Get the path from the store
    const downloadDir = await store.get('download_path').then((value) => {
        const dir = value as string
        if (!dir) {
            throw new Error('Download path is not set.')
        }
        return dir
    })

    const downloadPath = await join(downloadDir, getFileNameFromUrl(src.value))
    // Download the video
    console.log('Downloading video to: ', downloadPath)

    await invoke('download', {
        url: src.value,
        savePath: downloadPath,
        onEvent,
    })
}

onMounted(async () => {
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
                    src.value = playUrl.value.durl[0].url as string
                }
            } else if (format === VideoFormatFlag.DASH) {
                src.value = playUrl.value?.dash?.video[0]?.base_url as string
            }

            console.log('Video %s URL: %s', format, src.value)
        })
    })
})
</script>

<template>
    <v-card>
        <v-responsive>
            <player
                :data="{
                    format,
                    src,
                    title: videoDetails ? videoDetails.title : '',
                    pic: videoDetails ? videoDetails.pic : '',
                }"
            /> </v-responsive
    ></v-card>
    <v-btn @click.prevent="openDialog">目录</v-btn>
    <v-btn @click.prevent="downloadVideo">下载</v-btn>
    <v-sheet class="d-flex align-center px-4 py-8 mx-auto"
        ><v-progress-linear
            v-model="progress"
            color="light-blue"
            height="12"
            striped
            rounded
        ></v-progress-linear>
        <div class="ms-4 text-h6">{{ progressDisplay }}</div></v-sheet
    >
</template>
