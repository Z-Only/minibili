import { get } from '@/service/request'
import { DanmuInfoData } from '@/apis/types/live-stream'

export const fetchDanmuInfo = async (id: number): Promise<DanmuInfoData> => {
    return await get<DanmuInfoData, { id: number }>(
        'https://api.live.bilibili.com/xlive/web-room/v1/index/getDanmuInfo',
        { id }
    )
}
