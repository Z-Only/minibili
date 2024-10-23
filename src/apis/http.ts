import { ApiResult } from '@/apis/types'
import { invoke } from '@tauri-apps/api/core'

type Method = 'GET' | 'POST'

const fetch = async <T, P = null, D = null>(
    method: Method,
    path: string,
    params?: P,
    data?: D
): Promise<ApiResult<T>> => {
    return await invoke('fetch', { method, path, params, data })
}

export const get = async <T, P = null>(
    path: string,
    params?: P
): Promise<T> => {
    return await fetch<T, P>('GET', path, params).then((result) => {
        return result.data
    })
}

export const post = async <T, P = null, D = null>(
    path: string,
    params?: P,
    data?: D
): Promise<T> => {
    return await fetch<T, P, D>('POST', path, params, data).then((result) => {
        return result.data
    })
}
