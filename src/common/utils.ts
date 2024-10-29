import { click_result } from '@/common/geetest/click'

/**
 * Formats a given timestamp into a human-readable publication date string.
 *
 * The function returns a relative time string based on the difference between
 * the current time and the provided timestamp. The output is in Chinese and
 * varies depending on how much time has passed:
 * - "刚刚" for seconds ago
 * - "{minutes}分钟前" for minutes ago
 * - "{hours}小时前" for hours ago
 * - "{days}天前" for days ago
 * - "{month}月{day}日" for dates within the same year
 * - "{year}年{month}月{day}日" for dates in previous years
 *
 * @param timestamp - The timestamp to format, in seconds.
 * @returns A formatted string representing the publication date.
 */
export const formatPubDate = (timestamp: number): string => {
    const now = Date.now()

    const seconds = Math.floor(now / 1000 - timestamp)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (seconds < 60) {
        return '刚刚'
    } else if (minutes < 60) {
        return `${minutes}分钟前`
    } else if (hours < 24) {
        return `${hours}小时前`
    } else if (days < 7) {
        return `${days}天前`
    } else if (days < 365) {
        const date = new Date(timestamp)
        return `${date.getMonth() + 1}月${date.getDate()}日`
    } else {
        const date = new Date(timestamp)
        return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
    }
}

/**
 * Formats a duration given in seconds into a string in the format "HH:MM:SS" or "MM:SS".
 *
 * @param duration - The duration in seconds to format.
 * @returns A string representing the formatted duration.
 */
export const formatDuration = (duration: number | string): string => {
    if (typeof duration === 'string') {
        return duration
    }
    const hours = Math.floor(duration / 3600)
    const minutes = Math.floor((duration % 3600) / 60)
    const seconds = Math.floor(duration % 60)

    let formattedDuration = ''

    if (hours > 0) {
        formattedDuration += hours
        formattedDuration += ':'
        // 补零
        formattedDuration += minutes.toString().padStart(2, '0')
    } else {
        formattedDuration += minutes
    }

    formattedDuration += ':'
    formattedDuration += seconds.toString().padStart(2, '0')

    return formattedDuration
}

/**
 * Formats the view count into a more readable string.
 *
 * If the view count is less than 10,000, it returns the view count as a string.
 * If the view count is 10,000 or more, it returns the view count divided by 10,000
 * and suffixed with '万' (Chinese character for ten thousand), rounded to one decimal place.
 *
 * @param view - The number of views.
 * @returns A formatted string representing the view count.
 */
export const formatView = (view: number): string => {
    if (view < 10000) {
        return view.toString()
    } else {
        return `${(view / 10000).toFixed(1)}万`
    }
}

/**
 * Extracts a slice of data from a grid-like structure.
 *
 * @template T - The type of elements in the data array.
 * @param {T[]} data - The array of data to slice.
 * @param {number} rowIndex - The index of the row to extract.
 * @param {number} colCount - The number of columns in each row.
 * @returns {T[]} A slice of the data array corresponding to the specified row.
 */
export const getDataGridSlice = <T>(
    data: T[],
    rowIndex: number,
    colCount: number
): T[] => {
    return data.slice(rowIndex * colCount, (rowIndex + 1) * colCount)
}

/**
 * Extracts the file name from a given URL.
 *
 * @param {string} url - The URL to extract the file name from.
 * @returns {string} The extracted file name.
 */
export const getFileNameFromUrl = (url: string): string => {
    const regex = /\/([^/?#]+)(?:\?|#|$)/
    const matches = url.match(regex)
    return matches ? matches[1] : ''
}

/**
 * Converts a given number of bytes into a human-readable string with appropriate units.
 *
 * @param bytes - The number of bytes to format.
 * @returns A string representing the formatted size in appropriate units (e.g., B, KB, MB, etc.).
 */
export const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    const formattedSize = parseFloat((bytes / Math.pow(k, i)).toFixed(2))
    return `${formattedSize} ${sizes[i]}`
}

export const getGeetestCallback = () => `geetest_${Date.now()}`

/**
 * Calculates a unique key based on an array of points.
 *
 * @param points - An array of tuples, where each tuple contains two numbers representing a point.
 * @returns A string that represents the unique key generated from the points.
 */
export const calculateKey = (points: { x: number; y: number }[]): string => {
    return points
        .map(({ x, y }) => ({
            x: Math.round((x / 333.375) * 100.0 * 100.0),
            y: Math.round((y / 333.375) * 100.0 * 100.0),
        }))
        .map(({ x, y }) => `{${x}}_{${y}}`)
        .join(',')
}

export const genRandomRt = (min: number = 100, max: number = 1000) =>
    Math.floor(Math.random() * (max - min + 1) + min)

export const generateW = (
    key: string,
    gt: string,
    challenge: string,
    c: number[],
    s: string,
    rt: string
): string => click_result(key, gt, challenge, JSON.stringify(c), s, rt)
