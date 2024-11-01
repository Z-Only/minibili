import { fetch } from '@/service/commands'

/**
 * 发起GET请求
 * @param url - 请求URL
 * @param params - URL参数
 * @returns 返回请求数据
 */
export const get = async <T, P = null>(url: string, params?: P): Promise<T> => {
    return await fetch<T, P>('GET', url, params).then((result) => result.data)
}

/**
 * 发起POST请求
 * @param url - 请求URL
 * @param params - URL参数
 * @param data - 请求数据
 * @returns 返回请求数据
 */
export const post = async <T, P = null, D = null>(
    url: string,
    params?: P,
    data?: D
): Promise<T> => {
    return await fetch<T, P, D>('POST', url, params, data).then(
        (result) => result.data
    )
}
