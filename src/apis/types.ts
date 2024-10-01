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

/**
 * Represents the owner of a resource.
 */
export interface Owner {
    face: string
    mid: number
    name: string
}
