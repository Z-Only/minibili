import { get } from '@/apis/http'
import { PlayerInfo } from '../types/player-info'

/**
 * Parameters for retrieving player information.
 *
 * @property {number} [aid] - The avid of the manuscript. Note: Either `aid` or `bvid` is required.
 * @property {string} [bvid] - The bvid of the manuscript. Note: Either `aid` or `bvid` is required.
 * @property {number} cid - The cid of the manuscript.
 * @property {number} [ep_id] - The episode id of the series.
 * @property {number} [season_id] - The season id of the series.
 * @property {string} [w_rid] - The WBI signature.
 * @property {number} [wts] - The current unix timestamp.
 */
export interface PlayerInfoParams {
    aid?: number
    bvid?: string
    cid: number
    ep_id?: number
    season_id?: number
    w_rid?: string
    wts?: number
}

/**
 * Fetches player information from the specified endpoint.
 *
 * @param params - The parameters required to fetch player information.
 * @returns A promise that resolves to the player information.
 */
export const fetchPlayerInfo = async (params: PlayerInfoParams) => {
    return await get<PlayerInfo, PlayerInfoParams>('/x/player/wbi/v2', params)
}
