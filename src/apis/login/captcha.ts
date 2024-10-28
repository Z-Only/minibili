import { get } from '@/apis/http'

interface CaptchaParams {
    source: string
}

export interface Captcha {
    geetest: Geetest
    tencent: Tencent
    token: string
    type: string
}

export interface Geetest {
    challenge: string
    gt: string
}

export interface Tencent {
    appid: string
}

export const fetchCaptcha = async () => {
    return await get<Captcha, CaptchaParams>(
        'https://passport.bilibili.com/x/passport-login/captcha',
        { source: 'main_web' }
    )
}
