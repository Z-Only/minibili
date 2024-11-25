<script setup lang="ts">
import { fetchRoomInfo } from '@/apis/live/info'
import { MessageEvent, monitorLiveMsgStream } from '@/service/commands'
import { Channel } from '@tauri-apps/api/core'
import { CmdMsg, DanmuInfo, InfoObject } from '@/apis/types/live-msg-stream'

// 获取路由参数
const route = useRoute()
const roomId = Number(route.params.id as string)

const danmuInfos: Ref<DanmuInfo[]> = ref([])

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
                    case 'DANMU_MSG': {
                        console.log('弹幕消息类型: ', msg)
                        if (
                            msg.info &&
                            Array.isArray(msg.info) &&
                            msg.info[0] &&
                            typeof (msg.info[0] as InfoObject[])[15] ===
                                'object'
                        ) {
                            let danmuSuplyInfo = (
                                msg.info[0] as InfoObject[]
                            )[15] as InfoObject
                            if (
                                danmuSuplyInfo &&
                                typeof danmuSuplyInfo.extra === 'string'
                            ) {
                                let danmuInfo = JSON.parse(
                                    danmuSuplyInfo.extra
                                ) as DanmuInfo
                                danmuInfos.value.push(danmuInfo)
                            }
                        }
                        break
                    }
                    default:
                        console.log('其它消息类型: ', msg)
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

    await monitorLiveMsgStream(roomId, onEvent)
})
</script>

<template>
    <h1>Live {{ roomId }}</h1>
    <danmu-card :danmus="danmuInfos" />
</template>
