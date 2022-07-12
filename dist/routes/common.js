"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getToken = exports.executeSafe = void 0;
/* -------------------------------- AUX FUNCTIONS -------------------------------- */
function executeSafe(res, block) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield block();
        }
        catch (err) {
            if (err.http_code === undefined) {
                res.status(500).json({ error: err });
            }
            else {
                res.status(err.http_code).json({ error: err });
            }
            return;
        }
    });
}
exports.executeSafe = executeSafe;
/**
 * Get User Token
 * Tries to find the user token in all possible ways:
 * - Cookie
 * - Authorization Header (Bearer Token)
 * @param {req} Request object
 * @returns undefined if none of the ways to extract an authentication token was successful or the token if one was
 */
function getToken(req) {
    return getUserToken(req) || getHeaderToken(req);
}
exports.getToken = getToken;
/**
 * Get User Token
 * Try to extract the token from user session
 * @param {req} Request object
 * @returns undefined if [req] does not carry a token(user not authenticated) or the token if user is authenticated
 */
function getUserToken(req) {
    return req.user && req.user.token;
}
/**
 * Get User Token
 * @param {req} Request object
 * @returns the token extracted from request's authorization header
 */
function getHeaderToken(req) {
    const auth = req.header('Authorization');
    if (auth) {
        const authData = auth.trim();
        if (authData.substr(0, 6).toLowerCase() === 'bearer') {
            return authData.replace(/^bearer\s+/i, '');
        }
    }
    return undefined;
}
