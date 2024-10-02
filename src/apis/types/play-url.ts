export interface PlayUrl {
    accept_description: string[]
    accept_format: string
    accept_quality: number[]
    durl: Durl[]
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

export interface Durl {
    ahead?: string
    backup_url?: string[]
    length?: number
    order?: number
    size?: number
    url?: string
    vhead?: string
}

export interface SupportFormat {
    codecs: null
    display_desc: string
    format: string
    new_description: string
    quality: number
    superscript: string
}
