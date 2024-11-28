export interface DanmuInfoData {
    business_id: number
    group: string
    host_list: HostList[]
    max_delay: number
    refresh_rate: number
    refresh_row_factor: number
    token: string
}

export interface HostList {
    host: string
    port: number
    ws_port: number
    wss_port: number
}

// 根据真实直播间号获取直播视频流
export interface LivePlayUrlParams {
    cid: number
    platform?: string
    qn?: string
    quality?: number
}

export interface LivePlayUrlData {
    accept_quality: string[]
    current_qn: number
    current_quality: number
    durl: Durl[]
    quality_description: QualityDescription[]
}

export interface Durl {
    length: number
    order: number
    p2p_type: number
    stream_type: number
    url: string
}

export interface QualityDescription {
    desc: string
    qn: number
}
