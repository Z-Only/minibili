<script setup lang="ts">
import { open } from '@tauri-apps/plugin-dialog'
import { ShallowRef } from 'vue'
import { fetchVideoDetails } from '@/apis/video/info'
import { VideoDetails } from '@/apis/types/video-details'
import { PlayerInfo } from '@/apis/types/player-info'
import { fetchPlayerInfo } from '@/apis/video/player'
import { fetchPlayUrl, VideoFormatFlag } from '@/apis/video/stream'
import { PlayUrl } from '@/apis/types/play-url'
import { Channel } from '@tauri-apps/api/core'
import { getFileNameFromUrl, formatBytes, formatDuration } from '@/common/utils'
import { videoDir, join } from '@tauri-apps/api/path'
import { download, DownloadEvent } from '@/service/commands'
import {
    setStoreDownloadPath,
    getStoreDownloadPath,
} from '@/service/tauri-store'

// 获取路由参数
const route = useRoute()
const bvid = route.params.bvid as string
const format = VideoFormatFlag.MP4

// 视频详情数据
const videoDetails: ShallowRef<VideoDetails | null> = shallowRef(null)
// 播放器信息数据
const playerInfo: ShallowRef<PlayerInfo | null> = shallowRef(null)
// 播放URL数据
const playUrl: ShallowRef<PlayUrl | null> = shallowRef(null)

// 当前视频源URL
const src = ref('')

/**
 * 打开文件选择对话框并保存路径到存储
 */
const openDialog = async () => {
    const path = await open({
        directory: true,
        multiple: false,
        defaultPath: await videoDir(),
    })
    console.log('打开路径:', path)
    if (path) {
        await setStoreDownloadPath(path)
    }
}

const contentLength = ref(0)
const downloadedBytes = ref(0)
const speed = ref(0)
const costTime = ref(0)
const estimatedTime = ref(0)

// 计算进度百分比
const progress = computed(
    () => (downloadedBytes.value / contentLength.value) * 100
)
// 进度显示文本
const progressDisplay = computed(
    () =>
        `${formatBytes(downloadedBytes.value)} / ${formatBytes(contentLength.value)} ${formatBytes(speed.value)}/s ${formatDuration(costTime.value)}/${formatDuration(estimatedTime.value)}`
)

const onEvent = new Channel<DownloadEvent>()

onEvent.onmessage = (message) => {
    console.log(
        `收到下载事件: ${message.event}, 数据: ${JSON.stringify(message.data)}`
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
            console.log('下载完成')
            break
    }
}

/**
 * 下载视频
 */
const downloadVideo = async () => {
    const downloadDir = await getStoreDownloadPath()
    if (!downloadDir) {
        throw new Error('下载路径未设置.')
    }
    const downloadPath = await join(
        downloadDir as string,
        getFileNameFromUrl(src.value)
    )
    console.log('正在下载视频至:', downloadPath)
    await download(src.value, downloadPath, onEvent)
}

/**
 * 初始化页面数据
 */
onMounted(async () => {
    const detailsData = await fetchVideoDetails({ bvid })
    videoDetails.value = detailsData

    const playerData = await fetchPlayerInfo({ bvid, cid: detailsData.cid })
    playerInfo.value = playerData

    const playUrlData = await fetchPlayUrl({
        bvid,
        cid: detailsData.cid,
        fnval: format,
        platform: format === VideoFormatFlag.MP4 ? 'html5' : 'pc',
    })
    playUrl.value = playUrlData

    if (format === VideoFormatFlag.MP4) {
        src.value =
            playUrlData.durl && playUrlData.durl.length > 0
                ? (playUrlData.durl[0].url as string)
                : ''
    } else if (format === VideoFormatFlag.DASH) {
        src.value = playUrlData.dash?.video[0]?.base_url || ''
    }

    console.log('视频%s URL:%s', format, src.value)
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
            />
        </v-responsive>
    </v-card>
    <v-btn @click.prevent="openDialog">目录</v-btn>
    <v-btn @click.prevent="downloadVideo">下载</v-btn>
    <v-sheet class="d-flex align-center px-4 py-8 mx-auto">
        <v-progress-linear
            v-model="progress"
            color="light-blue"
            height="12"
            striped
            rounded
        ></v-progress-linear>
        <div class="ms-4 text-h6">{{ progressDisplay }}</div>
    </v-sheet>
</template>
