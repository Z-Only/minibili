import { getWithoutSign } from '@/apis/http'

export interface NavUserInfo {
    isLogin: boolean
    wbi_img: WbiImg
}

export interface WbiImg {
    img_url: string
    sub_url: string
}

/**
 * Fetches the navigation user information.
 *
 * This function sends a GET request to the '/x/web-interface/nav' endpoint
 * and returns the navigation user information.
 *
 * @returns {Promise<NavUserInfo>} A promise that resolves to the navigation user information.
 */
export const fetchNanUserInfo = async (): Promise<NavUserInfo> => {
    return await getWithoutSign<NavUserInfo>('/x/web-interface/nav')
}
