import { get } from '@/apis/http'

export interface QrCode {
    qrcode_key: string
    url: string
}

export const fetchQrcode = async () => {
    return await get<QrCode>(
        'https://passport.bilibili.com/x/passport-login/web/qrcode/generate'
    )
}

export interface PollQrcodeParams {
    qrcode_key: string
}

export enum ScanCode {
    Success = 0, // 扫码登录成功
    QrCodeExpired = 86038, // 二维码已失效
    QrCodeScannedNotConfirmed = 86090, // 二维码已扫码未确认
    NotScanned = 86101, // 未扫码
}

export interface PollQrcode {
    code: ScanCode
    message: string
    refresh_token: string
    timestamp: number
    url: string
}

export const pollQrcode = async (pollQrcodeParams: PollQrcodeParams) => {
    return await get<PollQrcode, PollQrcodeParams>(
        'https://passport.bilibili.com/x/passport-login/web/qrcode/poll',
        pollQrcodeParams
    )
}
