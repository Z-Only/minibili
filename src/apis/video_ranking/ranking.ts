import { get } from '@/service/request'
import { RankingData } from '@/apis/types/video-popular'

export const fetchRanking = async (rid?: number): Promise<RankingData> => {
    return await get<RankingData, { rid?: number; type: string }>(
        'https://api.bilibili.com/x/web-interface/ranking/v2',
        { rid: rid ?? 0, type: 'all' }
    )
}

// 某些分类需要另外的接口
export const fetchRankingV2 = async (
    season_type: number,
    day: number = 3
): Promise<RankingData> => {
    return await get<RankingData, { season_type: number; day: number }>(
        'https://api.bilibili.com/pgc/season/rank/web/list',
        { season_type, day }
    )
}
