export interface DanmuInfoData {
    business_id: number
    group: string
    host_list: HostList[]
    max_delay: number
    refresh_rate: number
    refresh_row_factor: number
    token: string
}

export interface HostList {
    host: string
    port: number
    ws_port: number
    wss_port: number
}
