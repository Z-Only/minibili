import { get } from '@/service/request'
import { SpaceInfoData } from '@/apis/types/space-info'

type SpaceInfoParams = { mid: number }

// FIXME: {code: -352data: {v_voucher: "voucher_40266720-3834-40f5-868c-5a20d2e584e7"} message: "风控校验失败"}
export const fetchSpaceInfo = async (mid: number): Promise<SpaceInfoData> => {
    return await get<SpaceInfoData, SpaceInfoParams>(
        'https://api.bilibili.com/x/space/wbi/acc/info',
        { mid }
    )
}
