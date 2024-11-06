import { Owner, Stat } from '@/apis/types/video-details'

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

export interface PopularSeriesList {
    list: PopularSeries[]
}

export interface PopularSeries {
    name: string
    number: number
    status: number
    subject: string
}

export interface PopularSeriesOneData {
    config: Config
    list: List[]
    reminder: string
}

export interface Config {
    color: number
    cover: string
    etime: number
    hint: string
    id: number
    label: string
    media_id: number
    name: string
    number: number
    share_subtitle: string
    share_title: string
    status: number
    stime: number
    subject: string
    type: string
}

export interface List {
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
    first_frame?: string
    is_ogv: boolean
    mission_id: number
    ogv_info: null
    owner: Owner
    pic: string
    pub_location?: string
    pubdate: number
    rcmd_reason: string
    rights: Rights
    season_id: number
    season_type: number
    short_link_v2: string
    stat: Stat
    state: number
    tid: number
    title: string
    tname: string
    up_from_v2?: number
    videos: number
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
