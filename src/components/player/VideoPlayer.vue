<script setup lang="ts">
import { PlayerData } from '@/common/types/props'
import Player, { Events } from 'xgplayer'
import 'xgplayer/dist/index.min.css'

// 定义组件接收的 props
const props = defineProps<{ data: PlayerData }>()

// 计算属性，当 props 中的 data 发生变化时会自动更新
const playerData = computed(() => props.data)

// 播放器实例
let player = null

onMounted(async () => {
    console.log('PlayerData: %o', playerData)

    player = new Player({
        id: 'xg', // 占位元素id
        lang: 'zh', // 设置中文
        volume: 0, // 默认静音
        autoplay: false, // 自动播放
        loop: false, // 循环播放
        videoInit: true, // 没有设置poster的情况视频初始化显示视频首帧
        screenShot: true, // 开启截图功能

        //视频地址
        url: playerData.value.src,
        //封面图
        poster: playerData.value.pic,
        fluid: true, // 填满屏幕 （流式布局）
        playbackRate: [0.5, 0.75, 1, 1.5, 2], //传入倍速可选数组
        // download: true, //设置download控件显示
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
</script>

<template>
    <div id="xg"></div>
</template>
