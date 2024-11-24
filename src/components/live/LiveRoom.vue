<script setup lang="ts">
import { fetchRoomInfo } from '@/apis/live/info'
import { MessageEvent, initLiveStream } from '@/service/commands'
import { Channel } from '@tauri-apps/api/core'
import { CmdMsg } from '@/apis/types/live-stream-msg'

// 获取路由参数
const route = useRoute()
const roomId = Number(route.params.id as string)

const danmuMsgList: Ref<CmdMsg[]> = ref([])

const onEvent = new Channel<MessageEvent>()

onEvent.onmessage = (message) => {
    switch (message.event) {
        case 'auth':
            if (message.data.success) {
                console.log('认证成功')
            } else {
                console.log('认证失败')
            }
            break
        case 'heartbeat':
            if (message.data.success) {
                console.log('心跳成功，人气: ', message.data.popularity)
            } else {
                console.log('心跳失败')
            }
            break
        case 'normal':
            if (message.data.success) {
                let msg = JSON.parse(message.data.msg) as CmdMsg
                switch (msg.cmd) {
                    case 'DANMU_MSG':
                        console.log('弹幕消息类型')
                        danmuMsgList.value.push(msg)
                        break
                    default:
                        console.log('其它消息类型: ', msg.cmd)
                        break
                }
            } else {
                console.log('消息处理失败')
            }
            break
    }
}

onMounted(async () => {
    await fetchRoomInfo(roomId)
        .then((result) => {
            console.log('live room info: ', result)
        })
        .catch((err) => {
            console.log('Failed to fetch live room info: ', err)
        })

    await initLiveStream(roomId, onEvent)
})
</script>

<template>
    <h1>Live {{ roomId }}</h1>
    <danmu-card :danmus="danmuMsgList" />
</template>
