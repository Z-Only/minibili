<script setup lang="ts">
import { fetchRoomInfo } from '@/apis/live/info'
import { fetchDanmuInfo } from '@/apis/live/stream'
import { authenticate } from '@/service/commands'

// 获取路由参数
const route = useRoute()
const roomId = Number(route.params.id as string)

const auth = async (id: number) => {
    await fetchDanmuInfo(id).then(async (result) => {
        await authenticate(
            result.host_list[0].host,
            result.host_list[0].wss_port,
            id,
            0,
            result.token
        )
    })
}

onMounted(async () => {
    await fetchRoomInfo(roomId)
        .then((result) => {
            console.log('live room info: ', result)
        })
        .catch((err) => {
            console.log('Failed to fetch live room info, ', err)
        })

    await auth(roomId)
})
</script>

<template>
    <h1>Live {{ roomId }}</h1>
</template>
