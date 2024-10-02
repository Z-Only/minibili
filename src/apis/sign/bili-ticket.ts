import { postWithoutSign } from '@/apis/http'
import { WbiImg } from '@/apis/sign/nav'

interface WebTicketParams {
    key_id: string
    hexsign: string
    'context[ts]': number
    csrf?: string
}

interface BiliTicket {
    ticket: string
    created_at: number
    ttl: number
    context: null
    nav: WbiImg
}

/**
 * Generate HMAC-SHA256 signature using Web Crypto API
 * @param {string} key     The key string to use for the HMAC-SHA256 hash
 * @param {string} message The message string to hash
 * @returns {Promise<string>} The HMAC-SHA256 signature as a hex string
 */
const hmacSha256 = async (key: string, message: string): Promise<string> => {
    const encoder = new TextEncoder()
    const keyBuffer = encoder.encode(key)
    const messageBuffer = encoder.encode(message)

    const cryptoKey = await window.crypto.subtle.importKey(
        'raw',
        keyBuffer,
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
    )

    const signatureBuffer = await window.crypto.subtle.sign(
        'HMAC',
        cryptoKey,
        messageBuffer
    )

    const signatureArray = new Uint8Array(signatureBuffer)
    return Array.from(signatureArray)
        .map((byte) => byte.toString(16).padStart(2, '0'))
        .join('')
}

/**
 * Calculates the parameters required for a web ticket.
 *
 * @param {string} [csrf] - Optional CSRF token.
 * @returns {Promise<WebTicketParams>} A promise that resolves to an object containing the web ticket parameters.
 */
const calculateParams = async (csrf?: string): Promise<WebTicketParams> => {
    const ts = Math.floor(Date.now() / 1000)
    const hexSign = await hmacSha256('XgwSnGZ1p', `ts${ts}`)

    return {
        key_id: 'ec02',
        hexsign: hexSign,
        'context[ts]': ts,
        csrf,
    }
}

/**
 * Fetches a BiliTicket using the provided CSRF token.
 *
 * @param csrf - Optional CSRF token to be used for the request.
 * @returns {Promise<BiliTicket>} A promise that resolves to a BiliTicket.
 */
export const getBiliTicket = async (csrf?: string): Promise<BiliTicket> => {
    return await postWithoutSign<BiliTicket, WebTicketParams>(
        '/bapis/bilibili.api.ticket.v1.Ticket/GenWebTicket',
        await calculateParams(csrf)
    )
}
