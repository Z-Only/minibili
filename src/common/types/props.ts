import { VideoFormatFlag } from '@/apis/video/stream'

export interface VideoCardData {
    aid: number
    bvid: string
    mid: number
    author_name: string
    avatar_url: string
    title: string
    duration: number | string
    pic_url: string
    view: number
    danmaku: number
    pubdate: number
    is_followed: number
}

export interface PlayerData {
    format?: VideoFormatFlag
    src: string
    title: string
    pic: string
}
