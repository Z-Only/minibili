export interface GeetestGetTypeParams {
    callback: string
    gt: string
}

export interface GeetestGetTypeData {
    type: string
    static_servers: string[]
    beeline: string
    voice: string
    click: string
    fullpage: string
    slide: string
    geetest: string
    aspect_radio: AspectRadio
}

export interface AspectRadio {
    slide: number
    click: number
    voice: number
    beeline: number
}

export interface GeetestGetParams {
    api_server?: string
    autoReset?: string
    callback?: string
    challenge?: string
    gt?: string
    https?: string
    is_next?: string
    isPC?: string
    lang?: string
    offline?: string
    product?: string
    protocol?: string
    type?: string
    width?: string
}

export interface GeetestGetData {
    api_server: string
    c: number[]
    feedback: string
    gct_path: string
    i18n_labels: I18NLabels
    image_servers: string[]
    logo: boolean
    num: number
    pic: string
    pic_type: string
    resource_servers: string[]
    s: string
    sign: string
    spec: string
    static_servers: string[]
    theme: string
    theme_version: string
}

export interface I18NLabels {
    atip: string
    cancel: string
    close: string
    commit: string
    fail: string
    fail_short: string
    feedback: string
    forbidden: string
    loading: string
    maze: string
    read_reversed: boolean
    refresh: string
    small_tip: string
    success: string
    success_short: string
    tip: string
    voice: string
}

export interface GeetestAjaxParams {
    callback?: string
    challenge?: string
    client_type?: string
    gt?: string
    lang?: string
    pt?: number
    w?: string
}

export interface GeetestAjaxData {
    result: string
}
