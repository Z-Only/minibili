import { get, post } from '@/apis/http'
import {
    GenericCountryList,
    SendSmsForm,
    SendSmsData,
    PhoneLoginForm,
    PhoneLoginData,
} from '@/apis/types/phone-login'

export const fetchGenericCountryList = async (): Promise<GenericCountryList> =>
    await get<GenericCountryList>(
        'https://passport.bilibili.com/web/generic/country/list'
    )

export const sendSms = async (form: SendSmsForm): Promise<SendSmsData> =>
    await post<SendSmsData, null, SendSmsForm>(
        'https://passport.bilibili.com/x/passport-login/web/sms/send',
        null,
        form
    )

export const phoneLogin = async (
    form: PhoneLoginForm
): Promise<PhoneLoginData> =>
    await post<PhoneLoginData, null, PhoneLoginForm>(
        'https://passport.bilibili.com/x/passport-login/web/login/sms',
        null,
        form
    )
