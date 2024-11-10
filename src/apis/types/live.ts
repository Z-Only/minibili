export interface LiveAreaData {
    id: number
    list: LiveAreaInfo[]
    name: string
}

export interface LiveAreaInfo {
    act_id: string
    area_type: number
    cate_id: string
    complex_area_name: string
    hot_status: number
    id: string
    lock_status: string
    name: string
    old_area_id: string
    parent_id: string
    parent_name: string
    pic: string
    pk_status: string
}

export interface LiveRoomListParams {
    area_id: string
    page: string
    parent_area_id: string
    platform: string
    sort_type?: string
    vajra_business_key?: string
}

export interface LiveRoomListData {
    banner: Banner[]
    count: number
    has_more: number
    list: LiveRoomInfo[]
    new_tags: NewTag[]
    vajra: Vajra[]
}

export interface Banner {
    ad_transparent_content: null | AdTransparentContent
    area_id: number
    av_id: number
    id: number
    is_ad: boolean
    link: string
    live_status: number
    location: string
    parent_area_id: number
    pic: string
    position: number
    room_id: number
    show_ad_icon: boolean
    title: string
    up_id: number
    weight: number
}

export interface AdTransparentContent {
    client_ip: string
    index: number
    is_ad_loc: boolean
    request_id: string
    resource_id: number
    server_type: number
    source_id: number
    src_id: number
}

export interface LiveRoomInfo {
    area_id: number
    area_name: string
    area_v2_id: number
    area_v2_name: string
    area_v2_parent_id: number
    area_v2_parent_name: string
    click_callback: string
    cover: string
    face: string
    flag: number
    group_id: number
    head_box: null | HeadBox
    head_box_type: number
    is_auto_play: number
    is_nft: number
    link: string
    nft_dmark: string
    online: number
    parent_id: number
    parent_name: string
    pendant_info: PendantInfo
    pk_id: number
    play_together_goods: null
    roomid: number
    session_id: string
    show_callback: string
    show_cover: string
    system_cover: string
    title: string
    uid: number
    uname: string
    user_cover: string
    user_cover_flag: number
    verify: Verify
    watched_show: WatchedShow
    watermark: string
    web_pendent: string
}

export interface HeadBox {
    desc: string
    name: string
    value: string
}

export interface PendantInfo {
    '1': The1
}

export interface The1 {
    color: string
    content: string
    name: string
    pendent_id: number
    pic: string
    position: number
    type: string
}

export interface Verify {
    desc: string
    role: number
    type: number
}

export interface WatchedShow {
    icon: string
    icon_location: number
    icon_web: string
    num: number
    switch: boolean
    text_large: string
    text_small: string
}

export interface NewTag {
    hero_list: string[]
    icon: string
    id: number
    name: string
    sort: number
    sort_type: string
    sub: string[]
    type: number
}

export interface Vajra {
    desc: string
    icon: string
    living_num: number
    name: string
    vajra_business_key: string
}
