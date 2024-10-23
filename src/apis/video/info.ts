import { get } from '@/apis/http'
import { VideoDetails } from '@/apis/types/video-details'

/**
 * Parameters for fetching video details.
 *
 * @property {number} [aid] - The unique identifier for the video.
 * @property {string} [bvid] - The unique string identifier for the video.
 */
export interface VideoDetailsParams {
    aid?: number
    bvid?: string
}

/**
 * Fetches the details of a video from the specified endpoint.
 *
 * @param params - The parameters required to fetch the video details.
 * @returns A promise that resolves to the video details.
 */
export const fetchVideoDetails = async (params: VideoDetailsParams) => {
    return await get<VideoDetails, VideoDetailsParams>(
        'https://api.bilibili.com/x/web-interface/wbi/view',
        params
    )
}
