import { Owner } from '@/apis/types/apis'

/**
 * @description 视频详细信息(web端)
 */
export interface VideoDetails {
    aid: number
    argue_info: ArgueInfo
    bvid: string
    cid: number
    copyright: number
    ctime: number
    desc: string
    desc_v2: DescV2[]
    dimension: DataDimension
    disable_show_up_info: boolean
    duration: number
    dynamic: string
    enable_vt: number
    honor_reply: HonorReply
    is_chargeable_season: boolean
    is_season_display: boolean
    is_story: boolean
    is_story_play: number
    is_upower_exclusive: boolean
    is_upower_play: boolean
    is_upower_preview: boolean
    is_view_self: boolean
    like_icon: string
    mission_id: number
    need_jump_bv: boolean
    no_cache: boolean
    owner: Owner
    pages: DataPage[]
    pic: string
    premiere: null
    pubdate: number
    rights: DataRights
    season_id: number
    stat: DataStat
    state: number
    subtitle: Subtitle
    teenage_mode: number
    tid: number
    title: string
    tname: string
    ugc_season: UgcSeason
    user_garb: UserGarb
    videos: number
    vt_display: string
}

export interface ArgueInfo {
    argue_link: string
    argue_msg: string
    argue_type: number
}

export interface DescV2 {
    biz_id?: number
    raw_text?: string
    type?: number
}

export interface DataDimension {
    height: number
    rotate: number
    width: number
}

export interface HonorReply {
    honor: Honor[]
}

export interface Honor {
    aid?: number
    desc?: string
    type?: number
    weekly_recommend_num?: number
}

export interface DataPage {
    cid?: number
    dimension?: PurpleDimension
    duration?: number
    first_frame?: string
    from?: string
    page?: number
    part?: string
    vid?: string
    weblink?: string
}

export interface PurpleDimension {
    height: number
    rotate: number
    width: number
}

export interface DataRights {
    arc_pay: number
    autoplay: number
    bp: number
    clean_mode: number
    download: number
    elec: number
    free_watch: number
    hd5: number
    is_360: number
    is_cooperation: number
    is_stein_gate: number
    movie: number
    no_background: number
    no_reprint: number
    no_share: number
    pay: number
    ugc_pay: number
    ugc_pay_preview: number
}

export interface DataStat {
    aid: number
    coin: number
    danmaku: number
    dislike: number
    evaluation: string
    favorite: number
    his_rank: number
    like: number
    now_rank: number
    reply: number
    share: number
    view: number
    vt: number
}

export interface Subtitle {
    allow_submit: boolean
    list: string[]
}

export interface UgcSeason {
    attribute: number
    cover: string
    enable_vt: number
    ep_count: number
    id: number
    intro: string
    is_pay_season: boolean
    mid: number
    season_type: number
    sections: Section[]
    sign_state: number
    stat: UgcSeasonStat
    title: string
}

export interface Section {
    episodes: Episode[]
    id: number
    season_id: number
    title: string
    type: number
}

export interface Episode {
    aid: number
    arc: Arc
    attribute: number
    bvid: string
    cid: number
    id: number
    page: PurplePage
    pages: FluffyPage[]
    season_id: number
    section_id: number
    title: string
}

export interface Arc {
    aid: number
    author: Author
    copyright: number
    ctime: number
    desc: string
    desc_v2: null
    dimension: ArcDimension
    duration: number
    dynamic: string
    enable_vt: number
    is_blooper: boolean
    is_chargeable_season: boolean
    pic: string
    pubdate: number
    rights: ArcRights
    stat: ArcStat
    state: number
    title: string
    type_id: number
    type_name: string
    videos: number
    vt_display: string
}

export interface Author {
    face: string
    mid: number
    name: string
}

export interface ArcDimension {
    height: number
    rotate: number
    width: number
}

export interface ArcRights {
    arc_pay: number
    autoplay: number
    bp: number
    download: number
    elec: number
    free_watch: number
    hd5: number
    is_cooperation: number
    movie: number
    no_reprint: number
    pay: number
    ugc_pay: number
    ugc_pay_preview: number
}

export interface ArcStat {
    aid: number
    argue_msg: string
    coin: number
    danmaku: number
    dislike: number
    evaluation: string
    fav: number
    his_rank: number
    like: number
    now_rank: number
    reply: number
    share: number
    view: number
    vt: number
    vv: number
}

export interface PurplePage {
    cid: number
    dimension: FluffyDimension
    duration: number
    from: string
    page: number
    part: string
    vid: string
    weblink: string
}

export interface FluffyDimension {
    height: number
    rotate: number
    width: number
}

export interface FluffyPage {
    cid: number
    dimension: TentacledDimension
    duration: number
    from: string
    page: number
    part: string
    vid: string
    weblink: string
}

export interface TentacledDimension {
    height: number
    rotate: number
    width: number
}

export interface UgcSeasonStat {
    coin: number
    danmaku: number
    fav: number
    his_rank: number
    like: number
    now_rank: number
    reply: number
    season_id: number
    share: number
    view: number
    vt: number
    vv: number
}

export interface UserGarb {
    url_image_ani_cut: string
}
