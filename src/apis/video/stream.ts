import { get } from '@/service/request'
import { PlayUrl } from '@/apis/types/play-url'

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
    return await get<PlayUrl, PlayUrlParams>(
        'https://api.bilibili.com/x/player/wbi/playurl',
        params
    )
}
