<script setup lang="ts">
import { fetchRoomInfo } from '@/apis/live/info'

// 获取路由参数
const route = useRoute()
const roomId = Number(route.params.id as string)

onMounted(async () => {
    await fetchRoomInfo(roomId)
        .then((result) => {
            console.log('live room info: ', result)
        })
        .catch((err) => {
            console.log('Failed to fetch live room info, ', err)
        })
})
</script>

<template><h1>Live</h1></template>
