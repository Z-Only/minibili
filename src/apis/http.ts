import { ClientOptions, fetch } from '@tauri-apps/plugin-http'
import { ApiResult } from '@/apis/types'
import { wbiSignedParams } from '@/common/wbi'

const BASE_URL: string = 'https://api.bilibili.com'
const CONNECT_TIMEOUT: number = 30000
const CONTENT_TYPE: string = 'application/json'
const UA: string =
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
const REFERER: string = 'https://www.bilibili.com'

const buildUrl = <T>(path: string, params?: T): string => {
    const url = new URL(path, BASE_URL)
    if (params) {
        // If params is a string, append it to the URL directly
        if (params instanceof String) {
            return `${url}?${params}`
        } else {
            // If params is an object, convert it to a URLSearchParams object
            const searchParams = new URLSearchParams(
                params as Record<string, string>
            ).toString()
            return `${url}?${searchParams}`
        }
    }
    return url.toString()
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
        referrer: REFERER,
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
                        const result: ApiResult<T> = jsonRes
                        // TODO: -101 is a special code for not logged in, need to handle it.
                        if (result.code !== 0 && result.code != -101) {
                            throw new Error(
                                `API error! code: ${result.code}, message: ${result.message}.`
                            )
                        }
                        console.log(`response data: ${result.data}.`)
                        return result.data
                    })
                    .catch((err) => {
                        console.error(`Failed to parse JSON response: ${err}.`)
                        throw err
                    })
            } else {
                throw new Error(`HTTP error! status: ${res.status}.`)
            }
        })
        .catch((err) => {
            console.error(`Failed to fetch data: ${err}.`)
            throw err
        })
}

export const getWithoutSign = async <T, P = null>(
    path: string,
    params?: P
): Promise<T> => {
    return await handleRequest<T, P>({ method: 'GET' }, path, params)
}

export const get = async <T, P = null>(
    path: string,
    params?: P
): Promise<T> => {
    const signedParams = await wbiSignedParams(params)
    return await handleRequest<T, string>({ method: 'GET' }, path, signedParams)
}

export const postWithoutSign = async <T, P = null, D = null>(
    path: string,
    params?: P,
    data?: D
): Promise<T> => {
    return await handleRequest<T, P, D>({ method: 'POST' }, path, params, data)
}

export const post = async <T, P = null, D = null>(
    path: string,
    params?: P,
    data?: D
): Promise<T> => {
    const signedParams = await wbiSignedParams(params)
    return await handleRequest<T, string, D>(
        { method: 'POST' },
        path,
        signedParams,
        data
    )
}
