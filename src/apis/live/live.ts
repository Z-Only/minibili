import { get } from '@/service/request'
import { LiveRoomListParams, LiveRoomListData } from '@/apis/types/live'

export const fetchLiveRoomListData = async (
    params: LiveRoomListParams
): Promise<LiveRoomListData> => {
    return await get<LiveRoomListData, LiveRoomListParams>(
        'https://api.live.bilibili.com/xlive/web-interface/v1/second/getList',
        params
    )
}
