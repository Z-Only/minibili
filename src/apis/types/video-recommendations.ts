import { Owner, Stat } from '@/apis/types/video-details'

/**
 * @description 首页视频推荐列表（web端）
 */
export interface VideoRecommendations {
    item: Item[]
    business_card: null
    floor_info: null
    user_feature: null
    preload_expose_pct: number
    preload_floor_expose_pct: number
    mid: number
}

export interface Item {
    id: number
    bvid: string
    cid: number
    goto: string
    uri: string
    pic: string
    pic_4_3: string
    title: string
    duration: number
    pubdate: number
    owner: Owner
    stat: Stat
    av_feature: null
    is_followed: number
    rcmd_reason: null
    show_info: number
    track_id: string
    pos: number
    room_info: null
    ogv_info: null
    business_info: null
    is_stock: number
    enable_vt: number
    vt_display: string
    dislike_switch: number
    dislike_switch_pc: number
}
