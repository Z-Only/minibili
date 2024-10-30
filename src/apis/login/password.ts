import { get } from '@/apis/http'
import { PasswordLoginKeyData } from '@/apis/types/password-login'

export const fetchPasswordLoginKey = async (): Promise<PasswordLoginKeyData> =>
    await get<PasswordLoginKeyData>(
        'https://passport.bilibili.com/x/passport-login/key'
    )
