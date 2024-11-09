import { get } from '@/service/request'
import {
    SearchAll,
    SearchSuggestParams,
    SearchSuggestData,
    TypeSearchParams,
} from '@/apis/types/search'

/**
 * Fetches search results for all categories.
 *
 * @param params - The search parameters.
 * @returns A promise that resolves to the search results for all categories.
 */
export const fetchSearchAll = async (keyword: string): Promise<SearchAll> => {
    return await get<
        SearchAll,
        {
            keyword: string
        }
    >('https://api.bilibili.com/x/web-interface/wbi/search/all/v2', {
        keyword,
    })
}

export const SearchType = [
    {
        value: 'video',
        name: '视频',
    },
    { value: 'media_bangumi', name: '番剧' },
    { value: 'media_ft', name: '影视' },
    { value: 'live', name: '直播间及主播' },
    {
        value: 'live_room',
        name: '直播间',
    },
    {
        value: 'live_user',
        name: '主播',
    },
    {
        value: 'article',
        name: '专栏',
    },
    {
        value: 'topic',
        name: '话题',
    },
    {
        value: 'bili_user',
        name: '用户',
    },
    {
        value: 'photo',
        name: '相簿',
    },
]

export const fetchTypeSearch = async (
    params: TypeSearchParams
): Promise<SearchAll> => {
    return await get<SearchAll, TypeSearchParams>(
        'https://api.bilibili.com/x/web-interface/wbi/search/type',
        params
    )
}

export const fetchSearchSuggest = async (
    params: SearchSuggestParams
): Promise<SearchSuggestData> => {
    return await get<SearchSuggestData, SearchSuggestParams>(
        'https://s.search.bilibili.com/main/suggest',
        params
    )
}
