import { VideoDetails } from './video-details'

// 对象类型1-结果为视频
export interface SearchResponseVideo extends VideoDetails {
    aid: number
    arcrank: string
    arcurl: string
    author: string
    badgepay: boolean
    bvid: string
    description: string
    duration: string
    favorites: number
    hit_columns: string[]
    id: number
    is_pay: number
    is_union_video: number
    mid: number
    new_rec_tags: string[]
    pic: string
    play: number
    pubdate: number
    rank_score: number
    rec_tags: null
    review: number
    senddate: number
    tag: string
    title: string
    type: string
    typeid: string
    typename: string
    video_review: number
    view_type: string
}

// 对象类型2-结果为番剧&影视
export interface SearchResponseDramasOrMovies {
    all_net_icon: string
    all_net_name: string
    all_net_url: string
    angle_color: number
    angle_title: string
    areas: string
    badges: RequestBadge[]
    button_text: string
    corner: number
    cover: string
    cv: string
    desc: string
    display_info: DisplayInfo[]
    ep_size: number
    eps: Ep[]
    fix_pubtime_str: string
    goto_url: string
    hit_columns: string[]
    hit_epids: string
    is_avid: boolean
    is_follow: number
    is_selection: number
    media_id: number
    media_mode: number
    media_score: MediaScore
    media_type: number
    org_title: string
    pgc_season_id: number
    play_state: number
    pubtime: number
    season_id: number
    season_type: number
    season_type_name: string
    selection_style: string
    staff: string
    styles: string
    title: string
    type: string
    url: string
}

export interface RequestBadge {
    bg_color?: string
    bg_color_night?: string
    bg_style?: number
    border_color?: string
    border_color_night?: string
    text?: string
    text_color?: string
    text_color_night?: string
}

export interface DisplayInfo {
    bg_color?: string
    bg_color_night?: string
    bg_style?: number
    border_color?: string
    border_color_night?: string
    text?: string
    text_color?: string
    text_color_night?: string
}

export interface Ep {
    badges: EpBadge[]
    cover: string
    id: number
    index_title: string
    long_title: string
    release_date: string
    title: string
    url: string
}

export interface EpBadge {
    bg_color?: string
    bg_color_night?: string
    bg_style?: number
    border_color?: string
    border_color_night?: string
    text?: string
    text_color?: string
    text_color_night?: string
}

export interface MediaScore {
    score: number
    user_count: number
}

// 对象类型3-结果为直播间
export interface SearchResponseLiveRoom {
    area: number
    attentions: number
    cate_name: string
    cover: string
    hit_columns: string[]
    live_status: number
    live_time: string
    online: number
    rank_index: number
    rank_offset: number
    rank_score: number
    roomid: number
    short_id: number
    tags: string
    title: string
    type: string
    uface: string
    uid: number
    uname: string
    user_cover: string
}

// 对象类型4-结果为主播
export interface SearchResponseLiveUser {
    area: number
    attentions: number
    hit_columns: string[]
    is_live: boolean
    live_status: number
    live_time: string
    rank_index: number
    rank_offset: number
    rank_score: number
    roomid: number
    tags: string
    type: string
    uface: string
    uid: number
    uname: string
}

// 对象类型5-结果为专栏
export interface SearchResponseArticle {
    category_id: number
    category_name: string
    desc: string
    id: number
    image_urls: string[]
    like: number
    mid: number
    pub_time: number
    rank_index: number
    rank_offset: number
    rank_score: number
    reply: number
    template_id: number
    title: string
    type: string
    view: number
}

// 对象类型6-结果为话题
export interface SearchResponseTopic {
    arcurl: string
    author: string
    click: number
    cover: string
    description: string
    favourite: number
    hit_columns: string[]
    keyword: string
    mid: number
    pubdate: number
    rank_index: number
    rank_offset: number
    rank_score: number
    review: number
    title: string
    tp_id: number
    tp_type: number
    type: string
    update: number
}

// 对象类型7-结果为用户
export interface SearchResponseUser {
    fans: number
    gender: number
    hit_columns: string[]
    is_live: number
    is_upuser: number
    level: number
    mid: number
    official_verify: OfficialVerify
    res: Re[]
    room_id: number
    type: string
    uname: string
    upic: string
    usign: string
    verify_info: string
    videos: number
}

export interface OfficialVerify {
    desc: string
    type: number
}

export interface Re {
    aid: number
    arcurl: string
    bvid: string
    coin: number
    desc: string
    dm: number
    duration: string
    fav: number
    is_pay: number
    is_union_video: number
    pic: string
    play: string
    pubdate: number
    title: string
}

// 对象类型8-结果为相簿
export interface SearchResponsePhoto {
    count: number
    cover: string
    hit_columns: string[]
    id: number
    like: number
    mid: number
    rank_index: number
    rank_offset: number
    rank_score: number
    title: string
    type: string
    uname: string
    view: number
}
