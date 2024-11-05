export interface PopularData {
    list: PopularItem[]
    no_more: boolean
}

export interface PopularItem {
    ai_rcmd: null
    aid: number
    bvid: string
    cid: number
    copyright: number
    cover43: string
    ctime: number
    desc: string
    dimension: Dimension
    duration: number
    dynamic: string
    enable_vt: number
    first_frame: string
    is_ogv: boolean
    mission_id: number
    ogv_info: null
    owner: Owner
    pic: string
    pub_location: string
    pubdate: number
    rcmd_reason: RcmdReason
    rights: Rights
    season_id: number
    season_type: number
    short_link_v2: string
    stat: Stat
    state: number
    tid: number
    title: string
    tname: string
    up_from_v2: number
    videos: number
}

export interface Dimension {
    height: number
    rotate: number
    width: number
}

export interface Owner {
    face: string
    mid: number
    name: string
}

export interface RcmdReason {
    content: string
    corner_mark: number
}

export interface Rights {
    arc_pay: number
    autoplay: number
    bp: number
    download: number
    elec: number
    hd5: number
    is_cooperation: number
    movie: number
    no_background: number
    no_reprint: number
    pay: number
    pay_free_watch: number
    ugc_pay: number
    ugc_pay_preview: number
}

export interface Stat {
    aid: number
    coin: number
    danmaku: number
    dislike: number
    favorite: number
    his_rank: number
    like: number
    now_rank: number
    reply: number
    share: number
    view: number
    vt: number
    vv: number
}
