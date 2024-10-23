/**
 * Represents the result of an API call.
 *
 * @template T - The type of the data returned by the API.
 * @property {number} code - The status code of the API response.
 * @property {string} message - A message accompanying the API response.
 * @property {number} ttl - Time to live for the API response.
 * @property {T} data - The data returned by the API.
 */
export interface ApiResult<T> {
    code: number
    message: string
    ttl: number
    data: T
}

// 错误码枚举
export enum ErrorCode {
    // 权限类
    AppNotExistOrBanned = -1,
    AccessKeyError = -2,
    ApiValidationKeyError = -3,
    NoPermissionForMethod = -4,
    AccountNotLoggedIn = -101,
    AccountBanned = -102,
    InsufficientPoints = -103,
    InsufficientCoins = -104,
    CaptchaError = -105,
    AccountNotFormalMemberOrInTrial = -106,
    AppNotExistOrBannedAlt = -107, // 与 -1 重复，建议删除或合并
    UnboundPhone = -108,
    UnboundPhoneAlt = -110, // 与 -108 重复，建议删除或合并
    CsrfCheckFailed = -111,
    SystemUpgrading = -112,
    AccountNotVerified = -113,
    PleaseBindPhone = -114,
    PleaseCompleteVerification = -115,

    // 请求类
    NotModified = -304,
    RedirectOnCollision = -307,
    RiskControlCheckFailed = -352,
    BadRequest = -400,
    Unauthorized = -401,
    Forbidden = -403,
    NotFound = -404,
    MethodNotAllowed = -405,
    Conflict = -409,
    RequestIntercepted = -412,
    InternalServerError = -500,
    ServiceUnavailable = -503,
    GatewayTimeout = -504,
    ExceedLimit = -509,
    FileNotFound = -616,
    FileTooLarge = -617,
    TooManyLoginFailures = -625,
    UserNotExist = -626,
    WeakPassword = -628,
    InvalidUsernameOrPassword = -629,
    OperationObjectLimitExceeded = -632,
    Locked = -643,
    LowUserLevel = -650,
    DuplicateUser = -652,
    TokenExpired = -658,
    PasswordTimestampExpired = -662,
    GeographicalRestriction = -688,
    CopyrightRestriction = -689,
    DeductMoralityFailed = -701,
    RequestTooFrequent = -799,
    ServerError = -8888,
}

/**
 * Represents the owner of a resource.
 */
export interface Owner {
    face: string
    mid: number
    name: string
}
