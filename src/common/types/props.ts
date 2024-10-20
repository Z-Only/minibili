import { VideoFormatFlag } from '@/apis/video/stream'

export interface VideoCardData {
    id: number
    bvid: string
    url: string
    author_name: string
    avatar_url: string
    title: string
    duration: number | string
    pic_url: string
    view: number
    danmaku: number
    pubdate: number
    is_followed: boolean
}

export interface PlayerData {
    format?: VideoFormatFlag
    src: string
    title: string
    pic: string
}
