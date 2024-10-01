import { fetch } from '@tauri-apps/plugin-http'
import { ApiResult } from '@/apis/types'
import { wbiSignedParams } from '@/common/wbi'

const BASE_URL: string = 'https://api.bilibili.com/'
const CONNECT_TIMEOUT: number = 30000
const CONTENT_TYPE: string = 'application/json'
const UA: string =
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'

/**
 * Constructs a URL by appending the given path to the base URL and optionally adding query parameters.
 *
 * @template T - The type of the query parameters.
 * @param {string} path - The path to append to the base URL.
 * @param {T} [params] - An optional object containing query parameters to include in the URL.
 * @returns {string} The constructed URL as a string.
 */
const buildUrl = <T>(path: string, params?: T) => {
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

/**
 * Makes a GET request to the specified path without requiring a signature.
 *
 * @template T - The type of the response data.
 * @template P - The type of the request parameters. Defaults to null.
 * @param {string} path - The endpoint path to make the request to.
 * @param {string} path - The path to send the POST request to.
 * @param {P} [params] - Optional parameters to include in the request.
 * @returns {Promise<ApiResult<T>>} - A promise that resolves to the API result of type T.
 * @throws {Error} - Throws an error if the HTTP response status is not ok.
 */
export const getWithoutSign = async <T, P = null>(
    path: string,
    params?: P
): Promise<ApiResult<T>> => {
    const url = buildUrl(path, params)
    console.log(`request url: ${url}.`)
    return await fetch(url, {
        connectTimeout: CONNECT_TIMEOUT,
        method: 'GET',
        headers: {
            'Content-Type': CONTENT_TYPE,
            'User-Agent': UA,
        },
    }).then((res) => {
        if (res.ok) {
            return res.json() as Promise<ApiResult<T>>
        } else {
            throw new Error(`HTTP error! status: ${res.status}`)
        }
    })
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
    return await fetch(url, {
        connectTimeout: CONNECT_TIMEOUT,
        method: 'GET',
        headers: {
            'Content-Type': CONTENT_TYPE,
            'User-Agent': UA,
        },
    }).then((res) => {
        if (res.ok) {
            return res.json() as Promise<ApiResult<T>>
        } else {
            throw new Error(`HTTP error! status: ${res.status}`)
        }
    })
}

/**
 * Makes a POST request to the specified path without requiring a signature.
 *
 * @template T - The type of the response data.
 * @template P - The type of the request parameters. Defaults to null.
 * @template D - The type of the request data. Defaults to null.
 * @param {string} path - The path to send the POST request to.
 * @param {P} [params] - Optional parameters to include in the request.
 * @param {D} [data] - Optional data to include in the request body.
 * @returns {Promise<ApiResult<T>>} - A promise that resolves to the API result of type T.
 * @throws {Error} - Throws an error if the HTTP response status is not ok.
 */
export const postWithoutSign = async <T, P = null, D = null>(
    path: string,
    params?: P,
    data?: D
): Promise<ApiResult<T>> => {
    const url = buildUrl(path, params)
    console.log(`request url: ${url}, data: ${JSON.stringify(data)}.`)
    return await fetch(url, {
        connectTimeout: CONNECT_TIMEOUT,
        method: 'POST',
        headers: {
            'Content-Type': CONTENT_TYPE,
            'User-Agent': UA,
        },
        body: JSON.stringify(data),
    }).then((res) => {
        if (res.ok) {
            return res.json() as Promise<ApiResult<T>>
        } else {
            throw new Error(`HTTP error! status: ${res.status}`)
        }
    })
}

/**
 * Sends a POST request to the specified path with optional parameters and data.
 *
 * @template T - The type of the response data.
 * @template P - The type of the optional parameters. Defaults to `null`.
 * @template D - The type of the optional data. Defaults to `null`.
 * @param {string} path - The path to send the POST request to.
 * @param {P} [params] - Optional parameters to include in the request.
 * @param {D} [data] - Optional data to include in the request body.
 * @returns {Promise<ApiResult<T>>} - A promise that resolves to the API result of type `T`.
 * @throws {Error} - Throws an error if the HTTP response status is not OK.
 */
export const post = async <T, P = null, D = null>(
    path: string,
    params?: P,
    data?: D
): Promise<ApiResult<T>> => {
    const url = buildUrl(path, await wbiSignedParams(params))
    console.log(`request url: ${url}, data: ${JSON.stringify(data)}.`)
    return await fetch(url, {
        connectTimeout: CONNECT_TIMEOUT,
        method: 'POST',
        headers: {
            'Content-Type': CONTENT_TYPE,
            'User-Agent': UA,
        },
        body: JSON.stringify(data),
    }).then((res) => {
        if (res.ok) {
            return res.json() as Promise<ApiResult<T>>
        } else {
            throw new Error(`HTTP error! status: ${res.status}`)
        }
    })
}
