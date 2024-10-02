import { get } from '@/apis/http'
import { PlayUrl } from '@/apis/types/play-url'

// enum Qn {
//     'Qn6' = 6,
//     'Qn16' = 16,
//     'Qn32' = 32,
//     'Qn64' = 64,
//     'Qn74' = 74,
//     'Qn84' = 80,
//     'Qn112' = 112,
//     'Qn116' = 116,
//     'Qn120' = 120,
//     'Qn125' = 125,
//     'Qn126' = 126,
//     'Qn127' = 127,
// }

export interface PlayUrlParams {
    avid?: number
    bvid?: string
    cid: number
    fnval?: number
    fnver?: number
    fourk?: number
    high_quality?: number
    otype?: string
    platform?: string
    qn?: number
    session?: string
    type?: string
}

/**
 * Fetches the play URL for a video.
 *
 * @param {PlayUrlParams} params - The parameters required to fetch the play URL.
 * @returns {Promise<PlayUrl>} A promise that resolves to the play URL data.
 */
export const fetchPlayUrl = async (params: PlayUrlParams): Promise<PlayUrl> => {
    return await get('/x/player/wbi/playurl', params)
}
