import { get } from '@/apis/http'
import { VideoDetails } from '@/apis/video/types'

export interface VideoDetailsParams {
    aid?: number
    bvid?: string
    [property: string]: any
}

export const fetchVideoDetails = async (params: VideoDetailsParams) => {
    return await get<VideoDetailsParams, VideoDetails>(
        '/x/web-interface/wbi/view',
        params
    )
}
