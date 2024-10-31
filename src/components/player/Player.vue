<script setup lang="ts">
import { ShallowRef } from 'vue'
import 'vidstack/bundle'
import type { MediaPlayerElement } from 'vidstack/elements'
import { PlayerData } from '@/common/types/props'

// 定义组件接收的 props
const props = defineProps<{ data: PlayerData }>()

// 计算属性，当 props 中的 data 发生变化时会自动更新
const playerData = computed(() => props.data)

// 播放器实例引用
let player: ShallowRef<MediaPlayerElement | null>

onMounted(async () => {
    console.log('PlayerData: %o', playerData)
    player = useTemplateRef<MediaPlayerElement>('player')
})

onBeforeUnmount(() => {
    // 销毁播放器实例
    if (player.value) {
        player.value.destroy()
    }
})
</script>

<template>
    <media-player
        ref="player"
        :src="playerData?.src"
        :title="playerData?.title"
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
                :src="playerData?.pic"
                :alt="playerData?.title"
            />
        </media-provider>
        <!-- Layouts -->
        <media-audio-layout />
        <media-video-layout />
    </media-player>
</template>
