import { get } from '@/service/request'
import { LiveAreaData } from '@/apis/types/live'

export const fetchLiveArea = async (): Promise<LiveAreaData[]> => {
    return await get<LiveAreaData[]>(
        'https://api.live.bilibili.com/room/v1/Area/getList'
    )
}
