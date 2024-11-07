export interface SearchDefaultData {
    goto_type: number
    goto_value: string
    id: string
    name: string
    seid: string
    show_name: string
    type: number
    url: string
}

export interface SearchSquareParams {
    limit: number
    platform?: string
}

export interface SearchSquareData {
    trending: Trending
}

export interface Trending {
    list: List[]
    title: string
    top_list: string[]
    trackid: string
}

export interface List {
    goto: string
    icon: string
    keyword: string
    show_name: string
    uri: string
}
