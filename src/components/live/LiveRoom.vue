<script setup lang="ts">
import { fetchRoomInfo } from '@/apis/live/info'
import { fetchLivePlayUrl } from '@/apis/live/stream'
import {
    MessageEvent,
    monitorLiveMsgStream,
    stopMonitorLiveMsgStream,
} from '@/service/commands'
import { Channel } from '@tauri-apps/api/core'
import { CmdMsg, DanmuInfo, InfoObject } from '@/apis/types/live-msg-stream'
import { LiveInfoData } from '@/apis/types/live-info'
import { LivePlayUrlData } from '@/apis/types/live-stream'

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

const roomInfo = ref<LiveInfoData | null>(null)
const livePlayUrlData = ref<LivePlayUrlData | null>(null)

onMounted(async () => {
    await fetchRoomInfo(roomId)
        .then((result) => {
            console.log('live room info: ', result)
            roomInfo.value = result
        })
        .catch((err) => {
            console.log('Failed to fetch live room info: ', err)
        })

    await fetchLivePlayUrl(roomId)
        .then((result) => {
            console.log('live play url: ', result)
            livePlayUrlData.value = result
        })
        .catch((err) => {
            console.log('Failed to fetch live play url: ', err)
        })

    monitorLiveMsgStream(roomId, onEvent)
})

onBeforeUnmount(async () => {
    await stopMonitorLiveMsgStream(roomId)
})
</script>

<template>
    <div class="d-flex">
        <v-responsive
            ><live-player
                v-if="livePlayUrlData && roomInfo"
                :data="{
                    src: livePlayUrlData ? livePlayUrlData.durl[0].url : '',
                    title: roomInfo ? roomInfo.title : '',
                    pic: roomInfo ? roomInfo.keyframe : '',
                }"
        /></v-responsive>

        <danmu-card :danmus="danmuInfos" />
    </div>
</template>
