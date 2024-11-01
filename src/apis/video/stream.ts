import { get } from '@/service/request'
import { PlayUrl } from '@/apis/types/play-url'

// https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/docs/video/videostream_url.md
export enum VideoQuality {
    QN_240P = 6, // 240P 极速 - 仅 MP4 格式支持，仅 platform=html5 时有效
    QN_360P = 16, // 360P 流畅
    QN_480P = 32, // 480P 清晰
    QN_720P = 64, // 720P 高清 - WEB 端默认值，B站前端需要登录才能选择，但是直接发送请求可以不登录就拿到 720P 的取流地址；无 720P 时则为 720P60
    QN_720P60 = 74, // 720P60 高帧率 - 登录认证
    QN_1080P = 80, // 1080P 高清 - TV 端与 APP 端默认值，登录认证
    QN_1080P_PLUS = 112, // 1080P+ 高码率 - 大会员认证
    QN_1080P60 = 116, // 1080P60 高帧率 - 大会员认证
    QN_4K = 120, // 4K 超清 - 需要 fnval&128=128 且 fourk=1，大会员认证
    QN_HDR = 125, // HDR 真彩色 - 仅支持 DASH 格式，需要 fnval&64=64，大会员认证
    QN_DOLBY_VISION = 126, // 杜比视界 - 仅支持 DASH 格式，需要 fnval&512=512，大会员认证
    QN_8K = 127, // 8K 超高清 - 仅支持 DASH 格式，需要 fnval&1024=1024，大会员认证
}

export enum VideoFormatFlag {
    MP4 = 1, // MP4 格式 - 仅 H.264 编码，与 DASH 格式互斥
    DASH = 16, // DASH 格式 - 与 MP4 格式互斥
    HDR = 64, // 是否需求 HDR 视频 - 需求 DASH 格式，仅 H.265 编码，需要 qn=125，大会员认证
    FOURK = 128, // 是否需求 4K 分辨率 - 该值与 fourk 字段协同作用，需要 qn=120，大会员认证
    DOLBY_AUDIO = 256, // 是否需求杜比音频 - 需求 DASH 格式，大会员认证
    DOLBY_VISION = 512, // 是否需求杜比视界 - 需求 DASH 格式，大会员认证
    EIGHTK = 1024, // 是否需求 8K 分辨率 - 需求 DASH 格式，需要 qn=127，大会员认证
    AV1 = 2048, // 是否需求 AV1 编码 - 需求 DASH 格式
}

export enum VideoCodec {
    AVC = 7, // AVC 编码 - 8K 视频不支持该格式
    HEVC = 12, // HEVC 编码
    AV1 = 13, // AV1 编码
}

export enum AudioQuality {
    Q64K = 30216, // 64K
    Q132K = 30232, // 132K
    Q192K = 30280, // 192K
    DOLBY_ATMOS = 30250, // 杜比全景声
    HI_RES_LOSSLESS = 30251, // Hi-Res无损
}

export interface PlayUrlParams {
    avid?: number
    bvid?: string
    cid: number
    fnval?: number
    fnver?: number
    fourk?: number
    high_quality?: number
    otype?: string
    platform?: string
    qn?: number
    session?: string
    type?: string
}

/**
 * Fetches the play URL for a video.
 *
 * @param {PlayUrlParams} params - The parameters required to fetch the play URL.
 * @returns {Promise<PlayUrl>} A promise that resolves to the play URL data.
 */
export const fetchPlayUrl = async (params: PlayUrlParams): Promise<PlayUrl> => {
    return await get<PlayUrl, PlayUrlParams>(
        'https://api.bilibili.com/x/player/wbi/playurl',
        params
    )
}
