import { ClientOptions, fetch } from '@tauri-apps/plugin-http'
import { ApiResult } from '@/apis/types'
import { wbiSignedParams } from '@/common/wbi'

const BASE_URL: string = 'https://api.bilibili.com/'
const CONNECT_TIMEOUT: number = 30000
const CONTENT_TYPE: string = 'application/json'
const UA: string =
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'

const buildUrl = <T>(path: string, params?: T): string => {
    const url = new URL(path, BASE_URL)
    if (!params) {
        return url.toString()
    } else {
        const searchParams = new URLSearchParams(
            params as Record<string, string>
        ).toString()
        return `${url}?${searchParams}`
    }
}

const handleRequest = async <T, P = null, D = null>(
    options: RequestInit & ClientOptions = {},
    path: string,
    params?: P,
    data?: D
): Promise<T> => {
    const commonOptions: RequestInit & ClientOptions = {
        connectTimeout: CONNECT_TIMEOUT,
        headers: {
            'Content-Type': CONTENT_TYPE,
            'User-Agent': UA,
        },
        method: 'GET',
    }
    const url = buildUrl(path, params)
    console.log(`request url: ${url}.`)
    return await fetch(url, {
        ...commonOptions,
        ...options,
        body: JSON.stringify(data),
    })
        .then(async (res) => {
            if (res.ok) {
                return await res
                    .json()
                    .then((jsonRes) => {
                        const result: ApiResult<T> = JSON.parse(jsonRes)
                        if (result.code !== 0) {
                            throw new Error(
                                `API error! code: ${result.code}, message: ${result.message}.`
                            )
                        }
                        return result.data
                    })
                    .catch((err) => {
                        throw new Error(
                            `Failed to parse JSON response: ${err}.`
                        )
                    })
            } else {
                throw new Error(`HTTP error! status: ${res.status}.`)
            }
        })
        .catch((err) => {
            throw new Error(`Failed to fetch data: ${err}.`)
        })
}

export const getWithoutSign = async <T, P = null>(
    path: string,
    params?: P
): Promise<T> => {
    return await handleRequest<T>({ method: 'GET' }, path, params)
}

export const get = async <T, P = null>(
    path: string,
    params?: P
): Promise<T> => {
    return await handleRequest<T>(
        { method: 'GET' },
        buildUrl(path, await wbiSignedParams(params)),
        params
    )
}

export const postWithoutSign = async <T, P = null, D = null>(
    path: string,
    params?: P,
    data?: D
): Promise<T> => {
    return await handleRequest<T>({ method: 'POST' }, path, params, data)
}

export const post = async <T, P = null, D = null>(
    path: string,
    params?: P,
    data?: D
): Promise<T> => {
    const signedParams = await wbiSignedParams(params)
    return await handleRequest<T>(
        { method: 'POST' },
        buildUrl(path, signedParams),
        params,
        data
    )
}
