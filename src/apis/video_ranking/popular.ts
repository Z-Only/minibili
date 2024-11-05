import { get } from '@/service/request'
import { PopularData } from '@/apis/types/video-popular'

export interface PopularParams {
    pn: number
    ps: number
}

export const fetchPopular = async (
    params: PopularParams
): Promise<PopularData> => {
    return await get<PopularData, PopularParams>(
        'https://api.bilibili.com/x/web-interface/popular',
        params
    )
}
