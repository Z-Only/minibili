import {
    SearchResponseVideo,
    SearchResponseDramasOrMovies,
    SearchResponseLiveRoom,
    SearchResponseLiveUser,
    SearchResponseArticle,
    SearchResponseTopic,
    SearchResponseUser,
    SearchResponsePhoto,
} from '@/apis/types/search-response'

export interface SearchAll {
    app_display_option: AppDisplayOption
    cost_time: CostTime
    egg_hit: number
    exp_list: ExpList
    in_black_key: number
    in_white_key: number
    is_search_page_grayed: number
    numPages: number
    numResults: number
    page: number
    pageinfo: Pageinfo
    pagesize: number
    result: Result[]
    rqt_type: string
    seid: string
    show_column: number
    show_module_list: string[]
    suggest_keyword: string
    top_tlist: TopTlist
    [property: string]: any
}

export interface AppDisplayOption {
    is_search_page_grayed: number
}

export interface CostTime {
    as_request: string
    as_request_format: string
    as_response_format: string
    deserialize_response: string
    fetch_lexicon: string
    illegal_handler: string
    is_risk_query: string
    main_handler: string
    params_check: string
    total: string
}

export interface ExpList {
    [property: string]: boolean
}

export interface Pageinfo {
    activity: Activity
    article: Article
    bangumi: Bangumi
    bili_user: BiliUser
    live: Live
    live_all: LiveAll
    live_master: LiveMaster
    live_room: LiveRoom
    live_user: LiveUser
    media_bangumi: MediaBangumi
    media_ft: MediaFt
    movie: Movie
    operation_card: OperationCard
    pgc: Pgc
    related_search: RelatedSearch
    special: Special
    topic: Topic
    tv: Tv
    upuser: Upuser
    user: User
    video: Video
}

export interface Activity {
    numResults: number
    pages: number
    total: number
}

export interface Article {
    numResults: number
    pages: number
    total: number
}

export interface Bangumi {
    numResults: number
    pages: number
    total: number
}

export interface BiliUser {
    numResults: number
    pages: number
    total: number
}

export interface Live {
    numResults: number
    pages: number
    total: number
}

export interface LiveAll {
    numResults: number
    pages: number
    total: number
}

export interface LiveMaster {
    numResults: number
    pages: number
    total: number
}

export interface LiveRoom {
    numResults: number
    pages: number
    total: number
}

export interface LiveUser {
    numResults: number
    pages: number
    total: number
}

export interface MediaBangumi {
    numResults: number
    pages: number
    total: number
}

export interface MediaFt {
    numResults: number
    pages: number
    total: number
}

export interface Movie {
    numResults: number
    pages: number
    total: number
}

export interface OperationCard {
    numResults: number
    pages: number
    total: number
}

export interface Pgc {
    numResults: number
    pages: number
    total: number
}

export interface RelatedSearch {
    numResults: number
    pages: number
    total: number
}

export interface Special {
    numResults: number
    pages: number
    total: number
}

export interface Topic {
    numResults: number
    pages: number
    total: number
}

export interface Tv {
    numResults: number
    pages: number
    total: number
}

export interface Upuser {
    numResults: number
    pages: number
    total: number
}

export interface User {
    numResults: number
    pages: number
    total: number
}

export interface Video {
    numResults: number
    pages: number
    total: number
}

export interface Result {
    data: Datum[]
    result_type: string
}

export type Datum =
    | SearchResponseVideo
    | SearchResponseDramasOrMovies
    | SearchResponseLiveRoom
    | SearchResponseLiveUser
    | SearchResponseArticle
    | SearchResponseTopic
    | SearchResponseUser
    | SearchResponsePhoto

// export interface Datum extends VideoDetails {
//     aid: number
//     arcrank: string
//     arcurl: string
//     area: number
//     areas: string
//     author: string
//     badgepay: boolean
//     badges: Badge[]
//     biz_data: null
//     button_text: string
//     bvid: string
//     cate_name: string
//     corner: number | string
//     cover: string
//     cv: string
//     danmaku: number
//     desc: string
//     description: string
//     display_info: DisplayInfo[]
//     duration: string
//     enable_vt: number
//     ep_size: number
//     episode_count_text: string
//     eps: null
//     favorites: number
//     fix_pubtime_str: string
//     goto_url: string
//     hit_columns: string[]
//     hit_epids: string
//     id: number
//     index_show: string
//     is_avid: boolean
//     is_charge_video: number
//     is_follow: number
//     is_intervene: number
//     is_live_room_inline: number
//     is_pay: number
//     is_selection: number
//     is_union_video: number
//     like: number
//     live_status: number
//     live_time: string
//     media_id: number
//     media_mode: number
//     media_score: MediaScore
//     media_type: number
//     mid: number
//     new_rec_tags: string[]
//     online: number
//     org_title: string
//     parent_area_id: number
//     parent_area_name: string
//     pgc_season_id: number
//     pic: string
//     play: number
//     pubdate: number
//     pubtime: number
//     rank_index: number
//     rank_offset: number
//     rank_score: number
//     rec_reason: string
//     rec_tags: null
//     release_status: number
//     review: number
//     roomid: number
//     season_id: number
//     season_type: number
//     season_type_name: string
//     selection_style: string
//     senddate: number
//     short_id: number
//     spread_id: number
//     staff: string
//     style: number
//     styles: string
//     subtitle: string
//     tag: string
//     tags: string
//     title: string
//     type: string
//     typeid: string
//     typename: string
//     uface: string
//     uid: number
//     uname: string
//     upic: string
//     url: string
//     user_cover: string
//     video_review: number
//     view_type: string
//     vt: number
//     vt_display: string
//     watched_show: null
// }

// export interface Badge {
//     bg_color: string
//     bg_color_night: string
//     bg_style: number
//     border_color: string
//     border_color_night: string
//     text: string
//     text_color: string
//     text_color_night: string
// }

// export interface DisplayInfo {
//     bg_color: string
//     bg_color_night: string
//     bg_style: number
//     border_color: string
//     border_color_night: string
//     text: string
//     text_color: string
//     text_color_night: string
// }

// export interface MediaScore {
//     score: number | number
//     user_count: number
// }

export interface TopTlist {
    activity: number
    article: number
    bangumi: number
    bili_user: number
    card: number
    live: number
    live_master: number
    live_room: number
    live_user: number
    media_bangumi: number
    media_ft: number
    movie: number
    operation_card: number
    pgc: number
    special: number
    topic: number
    tv: number
    upuser: number
    user: number
    video: number
}

export interface TypeSearchParams {
    category_id?: number
    duration?: number
    keyword: string
    order?: string
    order_sort?: number
    page?: number
    search_type: string
    tids?: number
    user_type?: number
    // 补充参数
    page_size?: number
}

export interface SearchSuggestParams {
    bangumi_acc_num?: number
    bangumi_num?: number
    buvid?: string
    func?: string
    highlight?: string
    main_ver?: string
    rnd?: number
    special_acc_num?: number
    special_num?: number
    spmid?: string
    sub_type?: string
    suggest_type?: string
    tag_num?: number
    term: string
    topic_acc_num?: number
    upuser_acc_num?: number
    upuser_num?: number
    userid?: number
}

export interface SearchSuggestApiResult {
    code: number
    exp_str: string
    result: Result
    stoken: string
}

export interface SearchSuggestData {
    tag: Tag[]
}

export interface Tag {
    name: string
    ref: number
    spid: number
    term: string
    type: string
    value: string
}

export interface TypeSearchData {
    cost_time: CostTime
    egg_hit: number
    exp_list: ExpList
    numPages: number
    numResults: number
    page: number
    pagesize: number
    result: TypeSearchResult[]
    rqt_type: string
    seid: string
    show_column: number
    suggest_keyword: string
    [property: string]: any
}

export interface CostTime {
    as_request: string
    as_request_format: string
    as_response_format: string
    deserialize_response: string
    illegal_handler: string
    main_handler: string
    params_check: string
    save_cache: string
    total: string
}

export type TypeSearchResult =
    | SearchResponseVideo
    | SearchResponseDramasOrMovies
    | SearchResponseLiveRoom
    | SearchResponseLiveUser
    | SearchResponseArticle
    | SearchResponseTopic
    | SearchResponseUser
    | SearchResponsePhoto
