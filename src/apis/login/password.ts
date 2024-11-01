import { get, post } from '@/service/request'
import {
    PasswordLoginKeyData,
    PasswordLoginParams,
    PasswordLoginData,
} from '@/apis/types/password-login'

export const fetchPasswordLoginKey = async (): Promise<PasswordLoginKeyData> =>
    await get<PasswordLoginKeyData>(
        'https://passport.bilibili.com/x/passport-login/key'
    )

export const passwordLogin = async (
    params: PasswordLoginParams
): Promise<PasswordLoginData> =>
    await post<PasswordLoginData, PasswordLoginParams>(
        'https://passport.bilibili.com/x/passport-login/web/login',
        params
    )
