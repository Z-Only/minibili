export interface GenericCountryList {
    common: CountryData[]
    others: CountryData[]
}

export interface CountryData {
    cname: string
    country_id: string
    id: number
}

export interface SendSmsForm {
    challenge: string
    cid: number
    seccode: string
    source: string
    tel: number
    token: string
    validate: string
}

export interface SendSmsData {
    captcha_key: string
}

export interface PhoneLoginForm {
    captcha_key: string
    cid: number
    code: number
    go_url?: string
    keep?: string
    source: string
    tel: number
}

export interface PhoneLoginData {
    is_new: boolean
    status: number
    url: string
}
