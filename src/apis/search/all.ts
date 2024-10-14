import { get } from '@/apis/http'
import { SearchAll } from '../types/search-all'

/**
 * Interface representing the parameters for a search operation.
 */
export interface SearchParams {
    keyword: string
}

/**
 * Fetches search results for all categories.
 *
 * @param params - The search parameters.
 * @returns A promise that resolves to the search results for all categories.
 */
export const fetchSearchAll = async (
    params: SearchParams
): Promise<SearchAll> => {
    return await get<SearchAll, SearchParams>(
        '/x/web-interface/wbi/search/all/v2',
        params
    )
}
