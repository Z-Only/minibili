import { get } from '@/apis/http'
import { VideoRecommendations } from '@/apis/types/video-recommendations'

/**
 * Interface representing the parameters for the recommendation API.
 *
 * @property {number} [brush] - Optional parameter for brush.
 * @property {string} [feed_version] - Optional parameter for feed version.
 * @property {number} [fetch_row] - Optional parameter for fetch row.
 * @property {number} [fresh_idx] - Optional parameter for fresh index.
 * @property {number} [fresh_idx_1h] - Optional parameter for fresh index in 1 hour.
 * @property {number} [fresh_type] - Optional parameter for fresh type.
 * @property {number} [homepage_ver] - Optional parameter for homepage version.
 * @property {string} [last_showlist] - Optional parameter for last show list.
 * @property {number} [last_y_num] - Optional parameter for last Y number.
 * @property {number} [ps] - Optional parameter for PS.
 * @property {string} [screen] - Optional parameter for screen.
 * @property {string} [seo_info] - Optional parameter for SEO information.
 * @property {string} [uniq_id] - Optional parameter for unique ID.
 * @property {string} [w_rid] - Optional parameter for W RID.
 * @property {number} [web_location] - Optional parameter for web location.
 * @property {number} [wts] - Optional parameter for WTS.
 * @property {number} [y_num] - Optional parameter for Y number.
 */
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

/**
 * Fetches video recommendations based on the provided parameters.
 *
 * @param params - The parameters used to fetch video recommendations.
 * @returns A promise that resolves to video recommendations.
 */
export const fetchVideoRecommendations = async (params: RecommendParams) => {
    return await get<VideoRecommendations, RecommendParams>(
        '/x/web-interface/wbi/index/top/feed/rcmd',
        params
    )
}
