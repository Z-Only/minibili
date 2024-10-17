// MP4 or DASH
export interface PlayUrl {
    accept_description: string[]
    accept_format: string
    accept_quality: number[]
    durl?: Durl[]
    dash?: Dash
    format: string
    from: string
    high_format: null
    last_play_cid: number
    last_play_time: number
    message: string
    quality: number
    result: string
    seek_param: string
    seek_type: string
    support_formats: SupportFormat[]
    timelength: number
    video_codecid: number
    view_info: null
}

// MP4
export interface Durl {
    ahead?: string
    backup_url?: string[]
    length?: number
    order?: number
    size?: number
    url?: string
    vhead?: string
}

// DASH
export interface Dash {
    audio: Audio[]
    dolby: Dolby
    duration: number
    flac: null
    min_buffer_time: number
    minBufferTime: number
    video: Video[]
}

export interface Audio {
    backup_url: string[]
    backupUrl: string[]
    bandwidth: number
    base_url: string
    baseUrl: string
    codecid: number
    codecs: string
    frame_rate: string
    frameRate: string
    height: number
    id: number
    mime_type: string
    mimeType: string
    sar: string
    segment_base: AudioSegmentBaseObject
    SegmentBase: AudioSegmentBase
    start_with_sap: number
    startWithSap: number
    width: number
}

export interface AudioSegmentBase {
    indexRange: string
    Initialization: string
}

export interface AudioSegmentBaseObject {
    index_range: string
    initialization: string
}

export interface Dolby {
    audio: null
    type: number
}

export interface Video {
    backup_url: string[]
    backupUrl: string[]
    bandwidth: number
    base_url: string
    baseUrl: string
    codecid: number
    codecs: string
    frame_rate: string
    frameRate: string
    height: number
    id: number
    mime_type: string
    mimeType: string
    sar: string
    segment_base: VideoSegmentBaseObject
    SegmentBase: VideoSegmentBase
    start_with_sap: number
    startWithSap: number
    width: number
}

export interface VideoSegmentBase {
    indexRange: string
    Initialization: string
}

export interface VideoSegmentBaseObject {
    index_range: string
    initialization: string
}

export interface SupportFormat {
    codecs?: string[]
    display_desc: string
    format: string
    new_description: string
    quality: number
    superscript: string
}
