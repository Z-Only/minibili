import { fetch } from '@tauri-apps/plugin-http'
import { ApiResult } from '@/apis/types'

const baseUrl = 'https://api.bilibili.com/'
const connectTimeout = 30000
const contentType = 'application/json'
const ua =
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'

/**
 * Makes an HTTP GET request to the specified path with the given parameters.
 *
 * @template R - The type of the request parameters.
 * @template T - The type of the response data.
 *
 * @param {string} path - The endpoint path to which the GET request is made.
 * @param {R} params - The request parameters to be included in the query string.
 *
 * @returns {Promise<ApiResult<T>>} - A promise that resolves to the response data of type `T` wrapped in an `ApiResult`.
 *
 * @throws {Error} - Throws an error if the HTTP response status is not OK.
 */
export const get = async <R, T>(
    path: string,
    params: R
): Promise<ApiResult<T>> => {
    const url = new URL(path, baseUrl)
    const searchParams = new URLSearchParams(
        params as Record<string, string>
    ).toString()
    const request = `${url}?${searchParams}`
    console.log(request)
    const response = await fetch(request, {
        connectTimeout,
        method: 'GET',
        headers: {
            'Content-Type': contentType,
            'User-Agent': ua,
        },
    })
    console.log(response)
    if (response.ok) {
        return response.json()
    } else {
        throw new Error(`HTTP error! status: ${response.status}`)
    }
}

/**
 * Sends a POST request to the specified path and returns the result.
 *
 * @template T - The type of the result expected from the API.
 * @param {string} path - The path to which the POST request is sent.
 * @returns {Promise<ApiResult<T>>} - A promise that resolves to the result of the API call.
 * @throws {Error} - Throws an error if the HTTP response is not ok.
 */
export const post = async <T>(path: string): Promise<ApiResult<T>> => {
    const response = await fetch(new URL(path, baseUrl), {
        connectTimeout,
        method: 'Post',
        headers: {
            'Content-Type': contentType,
            'User-Agent': ua,
        },
    })

    if (response.ok) {
        return response.json()
    } else {
        throw new Error(`HTTP error! status: ${response.status}`)
    }
}
