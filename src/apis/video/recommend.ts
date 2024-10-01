import { get } from '@/apis/http'
import { VideoRecommendations } from '@/apis/video/types'

export interface RecommendParams {
    brush?: number
    feed_version?: string
    fetch_row?: number
    fresh_idx?: number
    fresh_idx_1h?: number
    fresh_type?: number
    homepage_ver?: number
    last_showlist?: string
    last_y_num?: number
    ps?: number
    screen?: string
    seo_info?: string
    uniq_id?: string
    w_rid?: string
    web_location?: number
    wts?: number
    y_num?: number
}

export const fetchHomeVideoRecommendations = async (
    params: RecommendParams
) => {
    return await get<RecommendParams, VideoRecommendations>(
        '/x/web-interface/wbi/index/top/feed/rcmd',
        params
    )
}
