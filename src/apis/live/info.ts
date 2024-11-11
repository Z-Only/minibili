import { get } from '@/service/request'
import {
    LiveInfoData,
    LiveRoomInfoWithUserData,
    LiveRoomInitInfoData,
    LiveUserInfoData,
    RoomBaseInfoParams,
    RoomBaseInfoData,
    RoomStatusInfoParams,
    RoomStatusInfoData,
    RoomHistoryDanmakuData,
} from '@/apis/types/live-info'

/**
 * 获取直播间信息
 * @param room_id 直播间号，可以为短号
 * @returns
 */
export const fetchRoomInfo = async (room_id: number): Promise<LiveInfoData> => {
    return await get<LiveInfoData, { room_id: number }>(
        'https://api.live.bilibili.com/room/v1/Room/get_info',
        { room_id }
    )
}

/**
 * 获取用户对应的直播间状态
 * @param mid 目标用户mid
 * @returns
 */
export const fetchRoomInfoWithUser = async (
    mid: number
): Promise<LiveRoomInfoWithUserData> => {
    return await get<LiveRoomInfoWithUserData, { mid: number }>(
        'https://api.live.bilibili.com/room/v1/Room/getRoomInfoOld',
        { mid }
    )
}

/**
 * 获取房间页初始化信息
 * @param id 目标直播间号（短号）
 * @returns
 */
export const fetchRoomInitInfo = async (
    id: number
): Promise<LiveRoomInitInfoData> => {
    return await get<LiveRoomInitInfoData, { id: number }>(
        'https://api.live.bilibili.com/room/v1/Room/room_init',
        { id }
    )
}

/**
 * 获取主播信息
 * @param uid 目标用户mid
 * @returns
 */
export const fetchLiveUserInfo = async (
    uid: number
): Promise<LiveUserInfoData> => {
    return await get<LiveUserInfoData, { uid: number }>(
        'https://api.live.bilibili.com/live_user/v1/Master/info',
        { uid }
    )
}

/**
 * 获取直播间基本信息
 * @param params 请求参数
 * @returns
 */
export const fetchRoomBaseInfo = async (
    params: RoomBaseInfoParams
): Promise<RoomBaseInfoData> => {
    return await get<RoomBaseInfoData, RoomBaseInfoParams>(
        'https://api.live.bilibili.com/xlive/web-room/v1/index/getRoomBaseInfo',
        params
    )
}

/**
 * 批量查询直播间状态
 * @param uids 要查询的主播 mid
 * @returns
 */
export const fetchRoomStatusInfoByUids = async (
    uids: number[]
): Promise<RoomStatusInfoData> => {
    return await get<RoomStatusInfoData, RoomStatusInfoParams>(
        'https://api.live.bilibili.com/room/v1/Room/get_status_info_by_uids',
        { 'uids[]': uids }
    )
}

/**
 * 获取直播间最近历史弹幕
 * @param roomid 直播间短ID
 * @returns
 */
export const fetchRoomHistoryDanmaku = async (
    roomid: number
): Promise<RoomHistoryDanmakuData> => {
    return await get<RoomHistoryDanmakuData, { roomid: number }>(
        'https://api.live.bilibili.com/xlive/web-room/v1/dM/gethistory',
        { roomid }
    )
}
