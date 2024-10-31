import { ApiResult, GeetestApiResult } from '@/apis/types/apis'
import { invoke } from '@tauri-apps/api/core'

// 定义HTTP方法类型
type Method = 'GET' | 'POST'

/**
 * 发起HTTP请求
 * @param method - HTTP方法（GET 或 POST）
 * @param url - 请求URL
 * @param params - URL参数
 * @param data - 请求数据
 * @returns 返回API结果
 */
const fetch = async <T, P = null, D = null>(
    method: Method,
    url: string,
    params?: P,
    data?: D
): Promise<ApiResult<T>> => {
    // 调用invoke执行实际的网络请求
    return await invoke('fetch', { method, url, params, data })
}

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

/**
 * 极验验证码GET请求
 * @param url - 请求URL
 * @param params - URL参数
 * @returns 返回极验API结果
 */
export const geetestGet = async <T, P = null>(
    url: string,
    params?: P
): Promise<GeetestApiResult<T>> => {
    const res = await invoke<GeetestApiResult<T>>('geetest_get', {
        url,
        params,
    })

    // 检查响应状态是否成功
    if (res.status !== 'success') {
        throw new Error(JSON.stringify(res))
    }

    return res
}
