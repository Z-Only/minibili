import { get } from '@/service/request'
import {
    PopularData,
    PopularSeriesList,
    PopularSeriesOneData,
    PopularPreciousData,
} from '@/apis/types/video-popular'

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

export const fetchPopularSeriesList = async (): Promise<PopularSeriesList> => {
    return await get<PopularSeriesList>(
        'https://api.bilibili.com/x/web-interface/popular/series/list'
    )
}

export const fetchPopularSeriesOne = async (
    number: number
): Promise<PopularSeriesOneData> => {
    return await get<PopularSeriesOneData, { number: number }>(
        'https://api.bilibili.com/x/web-interface/popular/series/one',
        { number }
    )
}

export const fetchPopularPrecious = async (): Promise<PopularPreciousData> => {
    return await get<PopularPreciousData>(
        'https://api.bilibili.com/x/web-interface/popular/precious'
    )
}
