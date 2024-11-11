export interface FollowUpLiveParams {
    hit_ab?: boolean
    ignoreRecord?: number
    page?: number
    page_size?: number
}

export interface FollowUpLiveData {
    count: number
    list: List[]
    live_count: number
    never_lived_count: number
    never_lived_faces: string[]
    pageSize: number
    title: string
    totalPage: number
}

export interface List {
    area_id: number
    area_name: string
    area_name_v2: string
    area_value: string
    clipnum: number
    face: string
    fans_num: number
    is_attention: number
    live_status: number
    parent_area_id: number
    recent_record_id: string
    recent_record_id_v2: string
    record_live_time: number
    record_num: number
    record_num_v2: number
    room_cover: string
    room_news: string
    roomid: number
    switch: boolean
    tags: string
    text_small: string
    title: string
    uid: number
    uname: string
    watch_icon: string
}
