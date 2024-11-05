import { click_result } from '@/common/geetest/click'
import { KJUR, KEYUTIL, RSAKey } from 'jsrsasign'

/**
 * 格式化时间戳为相对时间字符串。
 * @param timestamp 时间戳（秒）
 * @returns 相对时间字符串
 */
export const formatPubDate = (timestamp: number): string => {
    const now = Date.now()
    const secondsAgo = Math.floor((now - timestamp * 1000) / 1000)

    if (secondsAgo < 60) {
        return '刚刚'
    } else if (secondsAgo < 3600) {
        return `${Math.floor(secondsAgo / 60)}分钟前`
    } else if (secondsAgo < 86400) {
        return `${Math.floor(secondsAgo / 3600)}小时前`
    } else if (secondsAgo < 2592000) {
        return `${Math.floor(secondsAgo / 86400)}天前`
    } else {
        const date = new Date(timestamp * 1000)
        const month = date.getMonth() + 1
        const day = date.getDate()
        const year = date.getFullYear()

        if (year !== new Date().getFullYear()) {
            return `${year}年${month}月${day}日`
        } else {
            return `${month}月${day}日`
        }
    }
}

/**
 * 格式化持续时间为“HH:mm:ss”或“mm:ss”形式。
 * @param duration 持续时间（秒）
 * @returns 格式化的持续时间字符串
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
        formattedDuration += `${hours}:${minutes.toString().padStart(2, '0')}`
    } else {
        formattedDuration += minutes
    }

    formattedDuration += `:${seconds.toString().padStart(2, '0')}`

    return formattedDuration
}

/**
 * 格式化观看次数。
 * @param view 观看次数
 * @returns 格式化的观看次数字符串
 */
export const formatView = (view: number): string => {
    if (view < 10000) {
        return view.toString()
    } else {
        return `${(view / 10000).toFixed(1)}万`
    }
}

/**
 * 获取二维数据中的指定行数据。
 * @param data 数据数组
 * @param rowIndex 行索引
 * @param colCount 列数
 * @returns 指定行的数据
 */
export const getDataGridSlice = <T>(
    data: T[],
    rowIndex: number,
    colCount: number
): T[] => {
    const startIndex = rowIndex * colCount
    const endIndex = (rowIndex + 1) * colCount

    return data.slice(startIndex, endIndex)
}

/**
 * 计算实际索引位置。
 */
export const getRealIndex = (
    rowIndex: number,
    colCount: number,
    colIndex: number
) => {
    return rowIndex * colCount + colIndex
}

/**
 * 从URL中提取文件名。
 * @param url URL地址
 * @returns 文件名
 */
export const getFileNameFromUrl = (url: string): string => {
    const regex = /\/([^/?#]+)(?:\?|#|$)/
    const matches = url.match(regex)

    return matches ? matches[1] : ''
}

/**
 * 将字节大小转换为人类可读的形式。
 * @param bytes 字节数
 * @returns 格式的字节大小字符串
 */
export const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B'

    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    const formattedSize = parseFloat((bytes / Math.pow(k, i)).toFixed(2))

    return `${formattedSize} ${sizes[i]}`
}

/**
 * 生成极验回调函数名。
 * @returns 回调函数名
 */
export const getGeetestCallback = (): string => `geetest_${Date.now()}`

/**
 * 计算基于点集的唯一键。
 * @param points 点集合
 * @returns 唯一键字符串
 */
export const calculateKey = (points: { x: number; y: number }[]): string => {
    const scaledPoints = points.map(({ x, y }) => ({
        x: (x / 306.55) * 344,
        y: (y / 306.55) * (384 - 40),
    }))

    const roundedPoints = scaledPoints.map(({ x, y }) => ({
        x: Math.round((x / 333.375) * 100 * 100),
        y: Math.round((y / 333.375) * 100 * 100),
    }))

    const keyParts = roundedPoints.map(({ x, y }) => `${x}_${y}`)

    return keyParts.join(',')
}

/**
 * 生成点击结果。
 * @param key 键值
 * @param gt GT值
 * @param challenge 挑战值
 * @param c 数组c
 * @param s 字符串s
 * @param rt RT值
 * @returns 结果字符串
 */
export const generateW = (
    key: string,
    gt: string,
    challenge: string,
    c: number[],
    s: string,
    rt: string
): string => click_result(key, gt, challenge, JSON.stringify(c), s, rt)

/**
 * 使用RSA公钥加密密码。
 * @param publicKey RSA公钥
 * @param salt 盐值
 * @param password 密码
 * @returns 加密后的密码
 */
export const rsaEncryptPassword = (
    publicKey: string,
    salt: string,
    password: string
): string => {
    const fullTextToEncrypt = salt + password
    const rsaPublicKey = KEYUTIL.getKey(publicKey) as RSAKey

    return KJUR.crypto.Cipher.encrypt(fullTextToEncrypt, rsaPublicKey, 'RSA')
}

export type InfiniteScrollStatus = 'ok' | 'empty' | 'loading' | 'error'
