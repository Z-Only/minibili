import { ApiResult, GeetestApiResult } from '@/apis/types/apis'
import { invoke } from '@tauri-apps/api/core'

type Method = 'GET' | 'POST'

const fetch = async <T, P = null, D = null>(
    method: Method,
    url: string,
    params?: P,
    data?: D
): Promise<ApiResult<T>> => {
    return await invoke('fetch', { method, url, params, data })
}

export const get = async <T, P = null>(url: string, params?: P): Promise<T> => {
    return await fetch<T, P>('GET', url, params).then((result) => result.data)
}

export const post = async <T, P = null, D = null>(
    url: string,
    params?: P,
    data?: D
): Promise<T> => {
    return await fetch<T, P, D>('POST', url, params, data).then(
        (result) => result.data
    )
}

export const geetestGet = async <T, P = null>(
    url: string,
    params?: P
): Promise<GeetestApiResult<T>> => {
    const res = await invoke<GeetestApiResult<T>>('geetest_get', {
        url,
        params,
    })

    if (res.status === 'success') {
        return res
    }

    throw new Error(JSON.stringify(res))
}
