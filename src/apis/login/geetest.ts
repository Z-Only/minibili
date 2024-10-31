import { geetestGet } from '@/common/commands'
import {
    GeetestGetTypeParams,
    GeetestGetTypeData,
    GeetestGetParams,
    GeetestGetData,
    GeetestAjaxParams,
    GeetestAjaxData,
} from '@/apis/types/geetest'

const API_SERVER = 'https://api.geetest.com'

export const geetestGetTypePhp = async (
    params: GeetestGetTypeParams
): Promise<GeetestGetTypeData> => {
    return await geetestGet<GeetestGetTypeData, GeetestGetTypeParams>(
        `${API_SERVER}/gettype.php`,
        params
    ).then((result) => result.data)
}

export const geetestGetPhp = async (
    params: GeetestGetParams
): Promise<GeetestGetData> => {
    return await geetestGet<GeetestGetData, GeetestGetParams>(
        `${API_SERVER}/get.php`,
        params
    ).then((result) => result.data)
}

export const geetestAjaxPhp = async (
    params: GeetestAjaxParams
): Promise<GeetestAjaxData> => {
    return await geetestGet<GeetestAjaxData, GeetestAjaxParams>(
        `${API_SERVER}/ajax.php`,
        params
    ).then((result) => result.data)
}
