import { Response, Request } from 'express'

/* -------------------------------- AUX FUNCTIONS -------------------------------- */
export async function executeSafe(res: Response, block: (...args: any[]) => any) {
    try {
        await block()
    } catch (err: any) {
        if (err.http_code === undefined) {
            res.status(500).json({ error: err })
        } else {
            res.status(err.http_code).json({ error: err })
        }
        return
    }
}

/**
 * Get User Token
 * Tries to find the user token in all possible ways:
 * - Cookie
 * - Authorization Header (Bearer Token)
 * @param {req} Request object
 * @returns undefined if none of the ways to extract an authentication token was successful or the token if one was
 */
export function getToken(req: Request): string | undefined {
    return getUserToken(req) || getHeaderToken(req)
}

/**
 * Get User Token
 * Try to extract the token from user session
 * @param {req} Request object
 * @returns undefined if [req] does not carry a token(user not authenticated) or the token if user is authenticated
 */
function getUserToken(req: any): string | undefined {
    return req.user && req.user.token
}

/**
 * Get User Token
 * @param {req} Request object
 * @returns the token extracted from request's authorization header
 */
function getHeaderToken(req: Request) {
    const auth = req.header('Authorization');
    if (auth) {
        const authData = auth.trim();
        if (authData.substr(0, 6).toLowerCase() === 'bearer') {
            return authData.replace(/^bearer\s+/i, '');
        }
    }
    return undefined;
}