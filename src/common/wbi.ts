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

/**
 * Extracts the file name without extension from a given URL.
 *
 * @param url - The URL string from which to extract the file name.
 * @returns The file name without its extension. If the URL does not contain a file name, returns an empty string.
 */
const extractFileName = (url: string) => {
    return url.split('/').pop()?.split('.').shift() ?? ''
}

/**
 * Encodes the given parameters with additional security keys and returns a query string.
 *
 * @template T - A generic type extending a record with string keys and any values.
 * @param {T} params - The parameters to be encoded.
 * @param {string} img_key - The image key used for generating the mixin key.
 * @param {string} sub_key - The sub key used for generating the mixin key.
 * @returns {string} The encoded query string with an additional security signature.
 */
const encWbi = <T extends Record<string, any>>(
    params: T,
    img_key: string,
    sub_key: string
): string => {
    const mixin_key = getMixinKey(img_key + sub_key)
    const wts = getWts()
    const chr_filter = /[!'()*]/g

    params = { ...params, wts } // 添加 wts 字段
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

/**
 * Asynchronously fetches user information and constructs a query string based on the provided parameters.
 *
 * @template T - A generic type extending a record with string keys and any values.
 * @param {T} params - The parameters to be encoded into the query string.
 * @returns {Promise<string>} A promise that resolves to the constructed query string.
 */
export const wbiSignedParams = async <T>(params: T): Promise<string> => {
    return await fetchNanUserInfo().then((res) => {
        const webKeys = res.wbi_img
        const img_key = extractFileName(webKeys.img_url)
        const sub_key = extractFileName(webKeys.sub_url)
        const queryParams = encWbi(
            params as Record<string, any>,
            img_key,
            sub_key
        )
        console.log(`wbi signed query: ${queryParams}`)
        return queryParams
    })
}
