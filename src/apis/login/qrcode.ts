import { get } from '@/apis/http'

export interface QrCode {
    qrcode_key: string
    url: string
}

export const fetchQrcode = async (): Promise<QrCode> => {
    return await get<QrCode>(
        'https://passport.bilibili.com/x/passport-login/web/qrcode/generate'
    )
}
