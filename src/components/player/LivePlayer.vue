<script setup lang="ts">
import { PlayerData } from '@/common/types/props'
import Player from 'xgplayer'
import FlvPlayer from 'xgplayer-flv'
import 'xgplayer/dist/index.min.css'

// 定义组件接收的 props
const props = defineProps<{ data: PlayerData }>()

// 计算属性，当 props 中的 data 发生变化时会自动更新
const playerData = computed(() => props.data)

// 播放器实例
let player: Player | null = null

onMounted(async () => {
    console.log('PlayerData: %o', playerData)

    player = new Player({
        id: 'xg', // 占位元素id
        lang: 'zh',
        isLive: true,
        preloadTime: 30,
        minCachedTime: 5,
        cors: true,

        //视频地址
        url: playerData.value.src,
        //封面图
        poster: playerData.value.pic,

        flv: {
            disconnectTime: 0,
            retryDelay: 2000,
            loadTimeout: 5000,
            bufferBehind: 1000,
            retryCount: 3,
        },
        plugins: [FlvPlayer],
    })

    console.log('Player: %o', player)
})

onBeforeUnmount(() => {
    if (player !== null) {
        player.destroy()
    }
})
</script>

<template>
    <div id="xg"></div>
</template>
