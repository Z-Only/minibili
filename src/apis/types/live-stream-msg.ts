export interface CmdMsg {
    cmd: string
    data?:
        | EntryEffectData
        | InteractWordData
        | RankChangedData
        | OnlineRankCountData
        | OnlineRankV2Data
        | LikeInfoV3ClickData
        | WatchedChangeData
        | DmInteractionData
    dm_v2?: string
    info?: Array<string[] | number | null | InfoObject | string>
}

// ENTRY_EFFECT
export interface EntryEffectData {
    basemap_url: string
    business: number
    copy_color: string
    copy_writing: string
    copy_writing_v2: string
    effect_silent_time: number
    effective_time: number
    effective_time_new: number
    face: string
    full_cartoon_id: number
    highlight_color: string
    icon_list: string[]
    id: number
    identities: number
    is_mystery: boolean
    max_delay_time: number
    mobile_dynamic_url_webp: string
    mock_effect: number
    new_style: number
    priority: number
    priority_level: number
    privilege_type: number
    show_avatar: number
    target_id: number
    trigger_time: number // bigint
    uid: number
    uinfo: Uinfo
    wealth_style_info: null
    wealthy_info: null
    web_basemap_url: string
    web_close_time: number
    web_dynamic_url_apng: string
    web_dynamic_url_webp: string
    web_effect_close: number
    web_effective_time: number
}

export interface Uinfo {
    base: Base
    guard: Guard
    guard_leader: null
    medal: Medal | null
    title: null
    uhead_frame: null
    uid: number
    wealth: Wealth | null
}

export interface Base {
    face: string
    is_mystery: boolean
    name: string
    name_color: number
    name_color_str: string
    official_info: OfficialInfo | null
    origin_info: OfficialInfo | null
    risk_ctrl_info: RiskCtrlInfo | null
}

export interface Guard {
    expired_str: string
    level: number
}

export interface Medal {
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

export interface Wealth {
    dm_icon_key: string
    level: number
}

// 弹幕 (DANMU_MSG)
export interface InfoObject {
    extra?: string
    mode?: number
    show_player_type?: number
    user?: User
    activity_identity?: string
    activity_source?: number
    not_show?: number
    ct?: string
    ts?: number
}

export interface User {
    base: Base
    guard: null
    guard_leader: GuardLeader
    medal: Medal
    title: Title
    uhead_frame: null
    uid: number
    wealth: null
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

export interface Title {
    old_title_css_id: string
    title_css_id: string
}

// 进场或关注消息 (INTERACT_WORD)
export interface InteractWordData {
    basemap_url: string
    business: number
    copy_color: string
    copy_writing: string
    copy_writing_v2: string
    effect_silent_time: number
    effective_time: number
    effective_time_new: number
    face: string
    full_cartoon_id: number
    highlight_color: string
    icon_list: string[]
    id: number
    identities: number[]
    is_mystery: boolean
    max_delay_time: number
    mobile_dynamic_url_webp: string
    mock_effect: number
    new_style: number
    priority: number
    priority_level: number
    privilege_type: number
    show_avatar: number
    target_id: number
    trigger_time: number // bigint
    uid: number
    uinfo: Uinfo
    wealth_style_info: null
    wealthy_info: null
    web_basemap_url: string
    web_close_time: number
    web_dynamic_url_apng: string
    web_dynamic_url_webp: string
    web_effect_close: number
    web_effective_time: number
}

export interface Contribution {
    grade: number
}

export interface ContributionV2 {
    grade: number
    rank_type: string
    text: string
}

export interface FansMedal {
    anchor_roomid: number
    guard_level: number
    icon_id: number
    is_lighted: number
    medal_color: number
    medal_color_border: number
    medal_color_end: number
    medal_color_start: number
    medal_level: number
    medal_name: string
    score: number
    special: string
    target_id: number
}

export interface RelationTail {
    tail_guide_text: string
    tail_icon: string
    tail_type: number
}

// LIKE_INFO_V3_UPDATE
export interface LikeInfoV3Update {
    cmd: string
    data: Data
}

export interface Data {
    click_count: number
}

// SEND_GIFT
export interface SendGift {
    cmd: string
    danmu: Danmu
    data: Data
}

export interface Danmu {
    area: number
}

export interface Data {
    action: string
    bag_gift: null
    batch_combo_id: string
    batch_combo_send: BatchComboSend
    beatId: string
    biz_source: string
    blind_gift: null
    broadcast_id: number
    coin_type: string
    combo_resources_id: number
    combo_send: ComboSend
    combo_stay_time: number
    combo_total_coin: number
    crit_prob: number
    demarcation: number
    discount_price: number
    dmscore: number
    draw: number
    effect: number
    effect_block: number
    face: string
    face_effect_id: number
    face_effect_type: number
    face_effect_v2: FaceEffectV2
    float_sc_resource_id: number
    gift_info: GiftInfo
    gift_tag: string[]
    giftId: number
    giftName: string
    giftType: number
    gold: number
    group_medal: null
    guard_level: number
    is_first: boolean
    is_join_receiver: boolean
    is_naming: boolean
    is_special_batch: number
    magnification: number
    medal_info: MedalInfo
    name_color: string
    num: number
    original_gift_name: string
    price: number
    rcost: number
    receive_user_info: ReceiveUserInfo
    receiver_uinfo: ReceiverUinfo
    remain: number
    rnd: string
    send_master: null
    sender_uinfo: SenderUinfo
    silver: number
    super: number
    super_batch_gift_num: number
    super_gift_num: number
    svga_block: number
    switch: boolean
    tag_image: string
    tid: string
    timestamp: number
    top_list: null
    total_coin: number
    uid: number
    uname: string
    wealth_level: number
}

export interface BatchComboSend {
    action: string
    batch_combo_id: string
    batch_combo_num: number
    blind_gift: null
    gift_id: number
    gift_name: string
    gift_num: number
    send_master: null
    uid: number
    uname: string
}

export interface ComboSend {
    action: string
    combo_id: string
    combo_num: number
    gift_id: number
    gift_name: string
    gift_num: number
    send_master: null
    uid: number
    uname: string
}

export interface FaceEffectV2 {
    id: number
    type: number
}

export interface GiftInfo {
    effect_id: number
    gif: string
    has_imaged_gift: number
    img_basic: string
    webp: string
}

export interface MedalInfo {
    anchor_roomid: number
    anchor_uname: string
    guard_level: number
    icon_id: number
    is_lighted: number
    medal_color: number
    medal_color_border: number
    medal_color_end: number
    medal_color_start: number
    medal_level: number
    medal_name: string
    special: string
    target_id: number
}

export interface ReceiveUserInfo {
    uid: number
    uname: string
}

export interface ReceiverUinfo {
    base: ReceiverUinfoBase
    guard: null
    guard_leader: null
    medal: null
    title: null
    uhead_frame: null
    uid: number
    wealth: null
}

export interface ReceiverUinfoBase {
    face: string
    is_mystery: boolean
    name: string
    name_color: number
    name_color_str: string
    official_info: PurpleOfficialInfo
    origin_info: PurpleOriginInfo
    risk_ctrl_info: PurpleRiskCtrlInfo
}

export interface PurpleOfficialInfo {
    desc: string
    role: number
    title: string
    type: number
}

export interface PurpleOriginInfo {
    face: string
    name: string
}

export interface PurpleRiskCtrlInfo {
    face: string
    name: string
}

export interface SenderUinfo {
    base: SenderUinfoBase
    guard: null
    guard_leader: null
    medal: Medal
    title: null
    uhead_frame: null
    uid: number
    wealth: null
}

export interface SenderUinfoBase {
    face: string
    is_mystery: boolean
    name: string
    name_color: number
    name_color_str: string
    official_info: FluffyOfficialInfo
    origin_info: FluffyOriginInfo
    risk_ctrl_info: FluffyRiskCtrlInfo
}

export interface FluffyOfficialInfo {
    desc: string
    role: number
    title: string
    type: number
}

export interface FluffyOriginInfo {
    face: string
    name: string
}

export interface FluffyRiskCtrlInfo {
    face: string
    name: string
}

// RANK_CHANGED
export interface RankChangedData {
    countdown: number
    on_rank_name_by_type: string
    rank: number
    rank_by_type: number
    rank_name_by_type: string
    rank_type: number
    timestamp: number
    uid: number
    url_by_type: string
}

// ONLINE_RANK_COUNT
export interface OnlineRankCountData {
    count: number
    count_text: string
    online_count: number
    online_count_text: string
}

// ONLINE_RANK_V2
export interface OnlineRankV2Data {
    online_list: OnlineList[]
    rank_type: string
}

export interface OnlineList {
    face: string
    guard_level: number
    is_mystery: boolean
    rank: number
    score: string
    uid: number
    uinfo: Uinfo
    uname: string
}

export interface RiskCtrlInfo {
    face: string
    name: string
}

// LIKE_INFO_V3_CLICK
export interface LikeInfoV3ClickData {
    contribution_info: ContributionInfo
    dmscore: number
    fans_medal: FansMedal
    group_medal: null
    identities: number[]
    is_mystery: boolean
    like_icon: string
    like_text: string
    msg_type: number
    show_area: number
    uid: number
    uinfo: Uinfo
    uname: string
    uname_color: string
}

export interface ContributionInfo {
    grade: number
}

export interface FansMedal {
    anchor_roomid: number
    guard_level: number
    icon_id: number
    is_lighted: number
    medal_color: number
    medal_color_border: number
    medal_color_end: number
    medal_color_start: number
    medal_level: number
    medal_name: string
    score: number
    special: string
    target_id: number
}

// WATCHED_CHANGE
export interface WatchedChangeData {
    num: number
    text_large: string
    text_small: string
}

// DM_INTERACTION
export interface DmInteractionData {
    data: string
    dmscore: number
    id: number
    status: number
    type: number
}
