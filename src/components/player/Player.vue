<script setup lang="ts">
import { ShallowRef } from 'vue'

// auto-import the styles and elements required
import 'vidstack/bundle'
import type { MediaPlayerElement } from 'vidstack/elements'
import { PlayerData } from '@/common/types/props'

const props = defineProps<{ data: PlayerData }>()

// 该 prop 变更时计算属性也会自动更新
const playerData = computed(() => props.data)

// 初始化 player
let player: ShallowRef<MediaPlayerElement | null>

onMounted(async () => {
    console.log('PlayerData: %o', playerData)
    player = useTemplateRef<MediaPlayerElement>('player')
})

onBeforeUnmount(() => {
    // This call will destroy the player and all child instances.
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
                alt="Girl walks into campfire with gnomes surrounding her friend ready for their next meal!"
            />
        </media-provider>
        <!-- Layouts -->
        <media-audio-layout />
        <media-video-layout />
    </media-player>
</template>
