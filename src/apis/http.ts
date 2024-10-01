import { fetch } from '@tauri-apps/plugin-http'
import { ApiResult } from '@/apis/types'
import { getWts, wbi } from '@/common/wbi'

const baseUrl = 'https://api.bilibili.com/'
const connectTimeout = 30000
const contentType = 'application/json'
const ua =
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'

const buildUrl = <T>(path: string, params?: T) => {
    const url = new URL(path, baseUrl)
    if (!params) {
        return url.toString()
    } else {
        const searchParams = new URLSearchParams(
            params as Record<string, string>
        ).toString()
        return `${url}?${searchParams}`
    }
}

const wbiSignedParams = async <T>(params: T): Promise<T> => {
    const wts = getWts()
    const w_rid = await wbi(params as Record<string, any>)
    return { ...params, wts, w_rid } as T
}

/**
 * Sends a GET request to the specified path without requiring a signature.
 *
 * @template T - The type of the response data.
 * @template P - The type of the optional parameters, defaults to null.
 * @param {string} path - The path to send the GET request to.
 * @param {P} [params] - Optional parameters to include in the request.
 * @returns {Promise<ApiResult<T>>} - A promise that resolves to the API result of type T.
 * @throws {Error} - Throws an error if the HTTP response is not ok.
 */
export const getWithoutSign = async <T, P = null>(
    path: string,
    params?: P
): Promise<ApiResult<T>> => {
    const url = buildUrl(path, params)
    console.log(`request url: ${url}.`)
    const response = await fetch(url, {
        connectTimeout,
        method: 'GET',
        headers: {
            'Content-Type': contentType,
            'User-Agent': ua,
        },
    })
    console.log(`response: ${response}`)
    if (response.ok) {
        return response.json()
    } else {
        throw new Error(`HTTP error! status: ${response.status}`)
    }
}

/**
 * Sends a GET request to the specified path with optional parameters.
 *
 * @template T - The expected response type.
 * @template P - The type of the optional parameters, defaults to null.
 * @param {string} path - The path to send the GET request to.
 * @param {P} [params] - Optional parameters to include in the request.
 * @returns {Promise<ApiResult<T>>} - A promise that resolves to the API result of type T.
 * @throws {Error} - Throws an error if the HTTP response is not ok.
 */
export const get = async <T, P = null>(
    path: string,
    params?: P
): Promise<ApiResult<T>> => {
    const url = buildUrl(path, await wbiSignedParams(params))
    console.log(`request url: ${url}.`)
    const response = await fetch(url, {
        connectTimeout,
        method: 'GET',
        headers: {
            'Content-Type': contentType,
            'User-Agent': ua,
        },
    })
    console.log(`response: ${response}`)
    if (response.ok) {
        return response.json()
    } else {
        throw new Error(`HTTP error! status: ${response.status}.`)
    }
}

/**
 * Sends a POST request to the specified path without requiring a signature.
 *
 * @template T - The type of the response data.
 * @template P - The type of the query parameters. Defaults to `null`.
 * @template D - The type of the request body data. Defaults to `null`.
 *
 * @param {string} path - The endpoint path to send the request to.
 * @param {P} [params] - Optional query parameters to include in the request.
 * @param {D} [data] - Optional body data to include in the request.
 *
 * @returns {Promise<ApiResult<T>>} - A promise that resolves to the response data.
 *
 * @throws {Error} - Throws an error if the response status is not OK.
 */
export const postWithoutSign = async <T, P = null, D = null>(
    path: string,
    params?: P,
    data?: D
): Promise<ApiResult<T>> => {
    const url = buildUrl(path, params)
    console.log(`request url: ${url}, data: ${JSON.stringify(data)}.`)
    const response = await fetch(url, {
        connectTimeout,
        method: 'Post',
        headers: {
            'Content-Type': contentType,
            'User-Agent': ua,
        },
        body: JSON.stringify(data),
    })
    console.log(`response: ${response}`)
    if (response.ok) {
        return response.json()
    } else {
        throw new Error(`HTTP error! status: ${response.status}`)
    }
}

/**
 * Sends a POST request to the specified path with optional parameters and data.
 *
 * @template T - The type of the response data.
 * @template P - The type of the parameters (default is null).
 * @template D - The type of the data (default is null).
 *
 * @param {string} path - The path to send the POST request to.
 * @param {P} [params] - Optional parameters to include in the request.
 * @param {D} [data] - Optional data to include in the request body.
 *
 * @returns {Promise<ApiResult<T>>} - A promise that resolves to the API result of type T.
 *
 * @throws {Error} - Throws an error if the HTTP response is not ok.
 */
export const post = async <T, P = null, D = null>(
    path: string,
    params?: P,
    data?: D
): Promise<ApiResult<T>> => {
    const url = buildUrl(path, await wbiSignedParams(params))
    console.log(`request url: ${url}, data: ${JSON.stringify(data)}.`)
    const response = await fetch(url, {
        connectTimeout,
        method: 'Post',
        headers: {
            'Content-Type': contentType,
            'User-Agent': ua,
        },
        body: JSON.stringify(data),
    })
    console.log(`response: ${response}`)
    if (response.ok) {
        return response.json()
    } else {
        throw new Error(`HTTP error! status: ${response.status}`)
    }
}
