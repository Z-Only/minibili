export interface LiveInfoData {
    allow_change_area_time: number
    allow_upload_cover_time: number
    area_id: number
    area_name: string
    area_pendants: string
    attention: number
    background: string
    battle_id: number
    description: string
    hot_words: string[]
    hot_words_status: number
    is_anchor: number
    is_portrait: boolean
    is_strict_room: boolean
    keyframe: string
    live_status: number
    live_time: string
    new_pendants: NewPendants
    old_area_id: number
    online: number
    parent_area_id: number
    parent_area_name: string
    pendants: string
    pk_id: number
    pk_status: number
    room_id: number
    room_silent_level: number
    room_silent_second: number
    room_silent_type: string
    short_id: number
    studio_info: StudioInfo
    tags: string
    title: string
    uid: number
    up_session: string
    user_cover: string
    verify: string
}

export interface NewPendants {
    badge: Badge
    frame: Frame
    mobile_badge: null
    mobile_frame: MobileFrame
}

export interface Badge {
    desc: string
    name: string
    position: number
    value: string
}

export interface Frame {
    area: number
    area_old: number
    bg_color: string
    bg_pic: string
    desc: string
    name: string
    position: number
    use_old_area: boolean
    value: string
}

export interface MobileFrame {
    area: number
    area_old: number
    bg_color: string
    bg_pic: string
    desc: string
    name: string
    position: number
    use_old_area: boolean
    value: string
}

export interface StudioInfo {
    master_list: string[]
    status: number
}

export interface LiveRoomInfoWithUserData {
    broadcast_type: number
    cover: string
    live_status: number
    online: number
    online_hidden: number
    roomid: number
    roomStatus: number
    roundStatus: number
    title: string
    url: string
}

export interface LiveRoomInitInfoData {
    encrypted: boolean
    hidden_till: number
    is_hidden: boolean
    is_locked: boolean
    is_portrait: boolean
    is_sp: number
    live_status: number
    live_time: number
    lock_till: number
    need_p2p: number
    pwd_verified: boolean
    room_id: number
    room_shield: number
    short_id: number
    special_type: number
    uid: number
}

export interface LiveUserInfoData {
    exp: Exp
    follower_num: number
    glory_count: number
    info: Info
    link_group_num: number
    medal_name: string
    pendant: string
    room_id: number
    room_news: RoomNews
}

export interface Exp {
    master_level: MasterLevel
}

export interface MasterLevel {
    color: number
    current: number[]
    level: number
    next: number[]
}

export interface Info {
    face: string
    gender: number
    official_verify: OfficialVerify
    uid: number
    uname: string
}

export interface OfficialVerify {
    desc: string
    type: number
}

export interface RoomNews {
    content: string
    ctime: string
    ctime_text: string
}

export interface RoomBaseInfoParams {
    req_biz: string
    room_ids?: number[]
}

export interface RoomBaseInfoData {
    by_room_ids: ByRoomids
    by_uids: { [key: string]: RoomInfoByRoomids }
}

export interface ByRoomids {
    [property: string]: RoomInfoByRoomids
}

export interface RoomInfoByRoomids {
    area_id: number
    area_name: string
    attention: number
    background: string
    cover: string
    description: string
    join_slide: number
    live_id: number
    live_id_str: string
    live_status: number
    live_time: string
    live_url: string
    online: number
    parent_area_id: number
    parent_area_name: string
    room_id: number
    short_id: number
    tags: string
    title: string
    uid: number
    uname: string
}

export interface RoomStatusInfoParams {
    'uids[]': number[]
}

export interface RoomStatusInfoData {
    [property: string]: RoomStatusInfo
}

export interface RoomStatusInfo {
    area: number
    area_name: string
    area_v2_id: number
    area_v2_name: string
    area_v2_parent_id: number
    area_v2_parent_name: string
    broadcast_type: number
    cover_from_user: string
    face: string
    hidden_till: string
    keyframe: string
    live_status: number
    live_time: number
    lock_till: string
    online: number
    room_id: number
    short_id: number
    tag_name: string
    tags: string
    title: string
    uid: number
    uname: string
}

export interface RoomHistoryDanmakuData {
    admin: string[]
    room: Room[]
}

export interface Room {
    bubble: number
    bubble_color: string
    bubble_id_v2: number
    check_info: CheckInfo
    dm_type: number
    emoticon: Emoticon
    emots: null
    group_medal: null
    guard_level: number
    id_str: string
    isadmin: number
    jump_to_url: string
    lpl: number
    medal: Array<number | string>
    nickname: string
    rank: number
    reply: Reply
    rnd: string
    svip: number
    teamid: number
    text: string
    timeline: string
    title: string[]
    uid: number
    uname_color: string
    user: User
    user_level: number[]
    user_title: string
    vip: number
    voice_dm_info: VoiceDmInfo
    wealth_level: number
    yeah_space_url: string
}

export interface CheckInfo {
    ct: string
    ts: number
}

export interface Emoticon {
    bulge_display: number
    emoticon_unique: string
    height: number
    id: number
    in_player_area: number
    is_dynamic: number
    perm: number
    text: string
    url: string
    width: number
}

export interface Reply {
    reply_is_mystery: boolean
    reply_mid: number
    reply_uname: string
    reply_uname_color: string
    show_reply: boolean
}

export interface User {
    base: Base
    guard: null
    guard_leader: GuardLeader
    medal: MedalObject
    title: Title
    uhead_frame: null
    uid: number
    wealth: null
}

export interface Base {
    face: string
    is_mystery: boolean
    name: string
    name_color: number
    name_color_str: string
    official_info: OfficialInfo
    origin_info: OriginInfo
    risk_ctrl_info: null
}

export interface OfficialInfo {
    desc: string
    role: number
    title: string
    type: number
}

export interface OriginInfo {
    face: string
    name: string
}

export interface GuardLeader {
    is_guard_leader: boolean
}

export interface MedalObject {
    color: number
    color_border: number
    color_end: number
    color_start: number
    guard_icon: string
    guard_level: number
    honor_icon: string
    id: number
    is_light: number
    level: number
    name: string
    ruid: number
    score: number
    typ: number
    user_receive_count: number
    v2_medal_color_border: string
    v2_medal_color_end: string
    v2_medal_color_level: string
    v2_medal_color_start: string
    v2_medal_color_text: string
}

export interface Title {
    old_title_css_id: string
    title_css_id: string
}

export interface VoiceDmInfo {
    file_duration: number
    file_format: string
    file_id: string
    text: string
    voice_url: string
}

export interface RoomPlayInfoParams {
    codec: string
    dolby?: number
    format: string
    panorama?: number
    platform?: string
    protocol: string
    ptype?: number
    qn?: number
    room_id: number
}

export interface RoomPlayInfoData {
    all_special_types: string[]
    encrypted: boolean
    hidden_till: number
    is_hidden: boolean
    is_locked: boolean
    is_portrait: boolean
    live_status: number
    live_time: number
    lock_till: number
    playurl_info: PlayurlInfo
    pwd_verified: boolean
    room_id: number
    room_shield: number
    short_id: number
    uid: number
}

export interface PlayurlInfo {
    conf_json: string
    playurl: Playurl
}

export interface Playurl {
    cid: number
    dolby_qn: null
    g_qn_desc: GQnDesc[]
    p2p_data: P2PData
    stream: Stream[]
}

export interface GQnDesc {
    attr_desc: null
    desc: string
    hdr_desc: string
    qn: number
}

export interface P2PData {
    m_p2p: boolean
    m_servers: null
    p2p: boolean
    p2p_type: number
}

export interface Stream {
    format: Format[]
    protocol_name: string
}

export interface Format {
    codec: Codec[]
    format_name: string
}

export interface Codec {
    accept_qn: number[]
    attr_name: string
    base_url: string
    codec_name: string
    current_qn: number
    dolby_type: number
    hdr_qn: null
    url_info: UrlInfo[]
}

export interface UrlInfo {
    extra: string
    host: string
    stream_ttl: number
}

export interface RoomAnchorData {
    info: Info
    level: Level
    san: number
}

export interface Info {
    face: string
    gender: number
    identification: number
    mobile_verify: number
    official_verify: OfficialVerify
    platform_user_level: number
    rank: string
    uid: number
    uname: string
    vip_type: number
}

export interface OfficialVerify {
    desc: string
    role: number
    type: number
}

export interface Level {
    anchor_score: number
    color: number
    cost: number
    master_level: MasterLevel
    rcost: number
    svip: number
    svip_time: string
    uid: number
    update_time: string
    user_level: number
    user_score: string
    vip: number
    vip_time: string
}

export interface MasterLevel {
    anchor_score: number
    color: number
    current: number[]
    level: number
    master_level_color: number
    next: number[]
    sort: string
    upgrade_score: number
}
