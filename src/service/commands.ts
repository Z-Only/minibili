import { invoke, Channel } from '@tauri-apps/api/core'
import { ApiResult, GeetestApiResult } from '@/apis/types/apis'

// 定义HTTP方法类型
export type Method = 'GET' | 'POST'

/**
 * 发起HTTP请求
 * @param method - HTTP方法（GET 或 POST）
 * @param url - 请求URL
 * @param params - URL参数
 * @param data - 请求数据
 * @returns 返回API结果
 */
export const fetch = async <T, P = null, D = null>(
    method: Method,
    url: string,
    params?: P,
    data?: D
): Promise<ApiResult<T>> => {
    // 调用invoke执行实际的网络请求
    const result = await invoke<ApiResult<T>>('fetch', {
        method,
        url,
        params,
        data,
    })
    if (result.code !== 0) {
        console.error(
            'fetch result error, url: %s, code: %d.',
            url,
            result.code
        )
    }
    return result
}

/**
 * Represents a download event which can be one of the following types:
 * - 'started': Indicates that the download has started.
 * - 'progress': Indicates the progress of an ongoing download.
 * - 'finished': Indicates that the download has finished.
 *
 * @type {DownloadEvent}
 *
 * @property {'started'} event - The event type for when the download starts.
 * @property {Object} data - The data associated with the 'started' event.
 * @property {string} data.url - The URL of the download.
 * @property {number} data.downloadId - The unique identifier for the download.
 * @property {number} data.contentLength - The total size of the content being downloaded.
 *
 * @property {'progress'} event - The event type for the progress of the download.
 * @property {Object} data - The data associated with the 'progress' event.
 * @property {number} data.downloadId - The unique identifier for the download.
 * @property {number} data.downloadedBytes - The number of bytes downloaded so far.
 * @property {number} data.speed - The current download speed.
 * @property {number} data.costTime - The time elapsed since the download started.
 * @property {number} data.estimatedTime - The estimated time remaining for the download to complete.
 *
 * @property {'finished'} event - The event type for when the download finishes.
 * @property {Object} data - The data associated with the 'finished' event.
 * @property {number} data.downloadId - The unique identifier for the download.
 */
export type DownloadEvent =
    | {
          event: 'started'
          data: { url: string; downloadId: number; contentLength: number }
      }
    | {
          event: 'progress'
          data: {
              downloadId: number
              downloadedBytes: number
              speed: number
              costTime: number
              estimatedTime: number
          }
      }
    | { event: 'finished'; data: { downloadId: number } }

/**
 * Downloads a file from the specified URL and saves it to the given path.
 *
 * @param url - The URL of the file to download.
 * @param savePath - The path where the downloaded file should be saved.
 * @param onEvent - A channel to receive download events.
 * @returns A promise that resolves when the download is complete.
 */
export const download = async (
    url: string,
    savePath: string,
    onEvent: Channel<DownloadEvent>
) =>
    await invoke('download', {
        url,
        savePath,
        onEvent,
    })

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

/**
 * Opens the developer tools.
 *
 * @returns A promise that resolves when the developer tools are opened.
 */
export const openDevTools = async () => {
    return invoke('open_devtools')
}
