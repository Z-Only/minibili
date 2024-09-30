import { fetch } from '@tauri-apps/plugin-http'
import { ApiResult } from './types'

const baseUrl = 'https://api.bilibili.com/'
const connectTimeout = 30000
const contentType = 'application/json'
const ua =
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'

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
