import md5 from 'md5'
import { fetchNanUserInfo } from '@/apis/sign/nav'

const mixinKeyEncTab = [
    46, 47, 18, 2, 53, 8, 23, 32, 15, 50, 10, 31, 58, 3, 45, 35, 27, 43, 5, 49,
    33, 9, 42, 19, 29, 28, 14, 39, 12, 38, 41, 13, 37, 48, 7, 16, 24, 55, 40,
    61, 26, 17, 0, 1, 60, 51, 30, 4, 22, 25, 54, 21, 56, 59, 6, 63, 57, 62, 11,
    36, 20, 34, 44, 52,
]

export const getWts = (): number => Math.round(Date.now() / 1000)

/**
 * Generates a mixin key by mapping the original string through a predefined
 * encoding table, joining the resulting characters, and slicing the result to
 * a maximum length of 32 characters.
 *
 * @param orig - The original string to be encoded.
 * @returns The generated mixin key as a string.
 */
const getMixinKey = (orig: string): string =>
    mixinKeyEncTab
        .map((n) => orig[n])
        .join('')
        .slice(0, 32)

const encWbi = <T extends Record<string, any>>(
    params: T,
    img_key: string,
    sub_key: string
) => {
    const mixin_key = getMixinKey(img_key + sub_key)
    const wts = getWts()
    const chr_filter = /[!'()*]/g

    Object.assign(params, { wts }) // 添加 wts 字段
    // 按照 key 重排参数
    const query = Object.keys(params)
        .sort()
        .map((key) => {
            // 过滤 value 中的 "!'()*" 字符
            const value = params[key].toString().replace(chr_filter, '')
            return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
        })
        .join('&')

    const wbi_sign = md5(query + mixin_key) // 计算 w_rid

    return query + '&w_rid=' + wbi_sign
}

const extractFileName = (url: string) => {
    return url.split('/').pop()?.split('.').shift() ?? ''
}

export const wbi = async <T extends Record<string, any>>(params: T) => {
    await fetchNanUserInfo().then((res) => {
        const webKeys = res.wbi_img
        const img_key = extractFileName(webKeys.img_url)
        const sub_key = extractFileName(webKeys.sub_url)
        const query = encWbi<T>(params, img_key, sub_key)
        console.log(query)
        return query
    })
}
