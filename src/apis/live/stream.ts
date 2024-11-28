import { get } from '@/service/request'
import {
    DanmuInfoData,
    LivePlayUrlParams,
    LivePlayUrlData,
} from '@/apis/types/live-stream'

export const fetchDanmuInfo = async (id: number): Promise<DanmuInfoData> => {
    return await get<DanmuInfoData, { id: number }>(
        'https://api.live.bilibili.com/xlive/web-room/v1/index/getDanmuInfo',
        { id }
    )
}

export const fetchLivePlayUrl = async (
    id: number
): Promise<LivePlayUrlData> => {
    return await get<LivePlayUrlData, LivePlayUrlParams>(
        'https://api.live.bilibili.com/room/v1/Room/playUrl',
        { cid: id }
    )
}
