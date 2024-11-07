import { get } from '@/service/request'
import {
    SearchDefaultData,
    SearchSquareParams,
    SearchSquareData,
} from '@/apis/types/search-hot'

export const fetchSearchDefault = async (): Promise<SearchDefaultData> => {
    return await get<SearchDefaultData>(
        'https://api.bilibili.com/x/web-interface/wbi/search/default'
    )
}

export const fetchSearchSquare = async (
    limit: number = 10
): Promise<SearchSquareData> => {
    if (!Number.isInteger(limit) || limit < 1 || limit > 50) {
        limit = 10
    }
    return await get<SearchSquareData, SearchSquareParams>(
        'https://api.bilibili.com/x/web-interface/search/square',
        { limit, platform: 'web' }
    )
}
