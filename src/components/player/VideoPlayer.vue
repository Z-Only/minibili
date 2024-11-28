<script setup lang="ts">
import { PlayerData } from '@/common/types/props'
import Player, { Events } from 'xgplayer'
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
        url: playerData.value.src, // 视频地址

        width: '100%', // 宽度
        height: '100%', // 高度
        volume: 0, // 默认静音
        poster: playerData.value.pic, // 封面图
        lang: 'zh-cn',
        fluid: true, // 流式布局
    })
    player.on(Events.PLAY, (ev) => {
        console.log('-播放开始-', ev)
    })
    player.on(Events.PAUSE, (ev) => {
        console.log('-播放结束-', ev)
    })
    player.on('loadedmetadata', (ev) => {
        console.log('-媒体数据加载好了-', ev)
    })
    player.on(Events.SEEKED, (ev) => {
        console.log('-跳着播放-', ev)
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
