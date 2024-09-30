export const formatPubDate = (timestamp: number): string => {
    const now = new Date().getTime()

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

export const formatDuration = (duration: number): string => {
    const hours = Math.floor(duration / 3600)
    const minutes = Math.floor((duration % 3600) / 60)
    const seconds = duration % 60

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

export const formatView = (view: number): string => {
    if (view < 10000) {
        return view.toString()
    } else {
        return `${(view / 10000).toFixed(1)}万`
    }
}
