export interface SpaceInfoData {
    birthday: string
    coins: number
    contract: Contract
    elec: Elec
    face: string
    face_nft: number
    face_nft_type: number
    fans_badge: boolean
    fans_medal: FansMedal
    gaia_data: null
    gaia_res_type: number
    is_followed: boolean
    is_risk: boolean
    is_senior_member: number
    jointime: number
    level: number
    live_room: LiveRoom
    mcn_info: null
    mid: number
    moral: number
    name: string
    nameplate: Nameplate
    official: Official
    pendant: Pendant
    profession: Profession
    rank: number
    school: School
    series: Series
    sex: string
    sign: string
    silence: number
    sys_notice: SysNotice
    tags: null
    theme: { [key: string]: any }
    top_photo: string
    user_honour_info: UserHonourInfo
    vip: Vip
}

export interface Contract {
    is_display: boolean
    is_follow_display: boolean
}

export interface Elec {
    show_info: ShowInfo
}

export interface ShowInfo {
    icon: string
    jump_url: string
    show: boolean
    state: number
    title: string
}

export interface FansMedal {
    medal: Medal
    show: boolean
    wear: boolean
}

export interface Medal {
    day_limit: number
    intimacy: number
    is_lighted: number
    level: number
    light_status: number
    medal_color: number
    medal_color_border: number
    medal_color_end: number
    medal_color_start: number
    medal_id: number
    medal_name: string
    next_intimacy: number
    score: number
    target_id: number
    uid: number
    wearing_status: number
}

export interface LiveRoom {
    broadcast_type: number
    cover: string
    liveStatus: number
    roomid: number
    roomStatus: number
    roundStatus: number
    title: string
    url: string
    watched_show: WatchedShow
}

export interface WatchedShow {
    icon: string
    icon_location: string
    icon_web: string
    num: number
    switch: boolean
    text_large: string
    text_small: string
}

export interface Nameplate {
    condition: string
    image: string
    image_small: string
    level: string
    name: string
    nid: number
}

export interface Official {
    desc: string
    role: number
    title: string
    type: number
}

export interface Pendant {
    expire: number
    image: string
    image_enhance: string
    image_enhance_frame: string
    name: string
    pid: number
}

export interface Profession {
    department: string
    is_show: number
    name: string
    title: string
}

export interface SysNotice {
    id: number
    content: string
    url: string
    notice_type: number
    icon: string
    text_color: string
    bg_color: string
}

export interface School {
    name: string
}

export interface Series {
    show_upgrade_window: boolean
    user_upgrade_status: number
}

export interface UserHonourInfo {
    colour: null
    mid: number
    tags: string[]
}

export interface Vip {
    avatar_subscript: number
    avatar_subscript_url: string
    due_date: number
    label: Label
    nickname_color: string
    role: number
    status: number
    theme_type: number
    tv_due_date: number
    tv_vip_pay_type: number
    tv_vip_status: number
    type: number
    vip_pay_type: number
}

export interface Label {
    bg_color: string
    bg_style: number
    border_color: string
    img_label_uri_hans: string
    img_label_uri_hans_static: string
    img_label_uri_hant: string
    img_label_uri_hant_static: string
    label_theme: string
    path: string
    text: string
    text_color: string
    use_img_label: boolean
}
