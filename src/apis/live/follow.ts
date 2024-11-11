import { get } from '@/service/request'
import { FollowUpLiveParams, FollowUpLiveData } from '@/apis/types/live-follow'

export const fetchFollowUpLive = async (
    params: FollowUpLiveParams
): Promise<FollowUpLiveData> => {
    return await get<FollowUpLiveData, FollowUpLiveParams>(
        'https://api.live.bilibili.com/room/v1/Area/getList',
        params
    )
}
