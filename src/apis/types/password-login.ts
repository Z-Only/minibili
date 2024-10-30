export interface PasswordLoginKeyData {
    hash: string
    key: string
}

export interface PasswordLoginParams {
    challenge: string
    go_url?: string
    keep: number
    password: string
    seccode: string
    source?: string
    token: string
    username: string
    validate: string
}

export interface PasswordLoginData {
    message: string
    refresh_token: string
    status: number
    timestamp: number
    url: string
}
