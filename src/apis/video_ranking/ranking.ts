import { get } from '@/service/request'
import { RankingData } from '@/apis/types/video-popular'

// FIXME: 设置分区无效，只能获取全站排行榜，有可能是 referer 的问题
export const fetchRanking = async (rid?: number): Promise<RankingData> => {
    return await get<RankingData, { rid?: number; type: string }>(
        'https://api.bilibili.com/x/web-interface/ranking/v2',
        { rid: rid ?? 0, type: 'all' }
    )
}
