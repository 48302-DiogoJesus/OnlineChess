import { executeInDB } from "./common"
import UserTokenSchema, { UserTokenObject } from "./schemas/userToken"
import UserPublicSchema, { UserPublicObject } from "./schemas/userPublic"
import UserAuthenticationSchema, { UserAuthenticationObject } from "./schemas/userAuthentication"
import ERRORS from '../errors/errors'
import { randomUUID as genRandomToken } from "crypto"
import md5 from "md5"

export function validateUserName(username: string) {
    if (!(username.length >= 5 && username.length <= 20)) {
        throw ERRORS.INVALID_USERNAME_LENGTH
    }
    if (username.includes(' '))
        throw ERRORS.INVALID_USERNAME_WS
    /*
    if (!(/^[a-zA-Z0-9]+$/.test(username))) {
        throw ERRORS.INVALID_USERNAME_CHARACTERS
    }
    */
}

export function validatePassword(password: string) {
    if (!(password.length >= 5 && password.length <= 20)) {
        throw ERRORS.INVALID_PASSWORD_LENGTH
    }
    if (password.includes(' '))
        throw ERRORS.INVALID_PASSWORD_WS
    /*
    if (!/[a-zA-Z0-9_-]* /.test(password)) {
        throw ERRORS.INVALID_PASSWORD_CHARACTERS
    }
    if (!/[A-Z]+/.test(password)) {
        throw ERRORS.INVALID_PASSWORD_UPPERCASE
    }
    */
} 

/* ---------------------- MAIN FUNCTIONS ---------------------- */
// | userExists | createUser | deleteUser | getUserPublic | tokenToUsername |
// | updateUserPassword | updateUserPublic | validateCredentials | 

const bundled = {
    validateUserName, validatePassword, userExists, createUser, deleteUser, getUserPublic, 
    getUsers, tokenToUsername, updateUserPassword, updateUserPublic, validateCredentials
}

export default bundled

export function userExists(username: string): Promise<boolean> {
    return executeInDB(async () => {
        if ((await UserAuthenticationSchema.findOne({ _id: username })) !== null)
            return true
        return false
    })
}

export function createUser(username: string, password: string): Promise<string> {
    return executeInDB(async () => {
        
        const token = genRandomToken()
        const hashedPassword = md5(password)
        
        await Promise.all([
            (new UserAuthenticationSchema({
                _id: username,      
                password: hashedPassword,
                token: token 
            })).save(),
            (new UserPublicSchema({
                _id: username,       
                rank: 0,    
            })).save(),
            (new UserTokenSchema({
                _id: token,       
                username: username,    
            })).save()
        ])
        return token
    })
}

export function deleteUser(username: string): Promise<void> {
    return executeInDB(async () => {
        await Promise.all([
            UserAuthenticationSchema.deleteOne({ _id: username }),
            UserPublicSchema.deleteOne({ _id: username }),
            UserTokenSchema.deleteOne({ username: username })
        ])
        return
    })
}

export function getUserPublic(username: string): Promise<UserPublicObject> {
    return executeInDB(async () => {
        const publicUserDoc = await UserPublicSchema.findById(username)
        return (publicUserDoc as UserPublicObject)
    })
}
/*
export async function getUserAuthenticationInfo(username: string): Promise<UserAuthenticationObject> {
    return executeInDB(async () => {
        const userAuthDoc = await UserAuthenticationSchema.findOne({ _id: username })
        return (userAuthDoc as UserAuthenticationObject)
    })
}
*/
export function tokenToUsername(token: string): Promise<string> {
    return executeInDB(async () => {
        const userTokenDoc = await UserTokenSchema.findById(token)
        if (userTokenDoc === null)
            throw ERRORS.INVALID_TOKEN
        return (userTokenDoc as UserTokenObject).username
    })
}

export function updateUserPassword(username: string, new_password: string): Promise<void> {
    return executeInDB(async () => {
        await UserAuthenticationSchema.findOneAndUpdate(
        {
            _id: username 
        }, 
        {
            password: md5(new_password)
        })
        return
    })
}

export function updateUserPublic(username: string, userData: UserPublicObject) {
    return executeInDB(async () => {
        // Filter _id from the object 
        const { _id, ...updatedUserData } = userData
        await UserPublicSchema.findOneAndUpdate({ _id: username }, {
            ...updatedUserData,
        })
    })
}

export function validateCredentials(username: string, password: string): Promise<void> {
    return executeInDB(async () => {        
        const userCredentials = (await UserAuthenticationSchema.findById(username)) as UserAuthenticationObject
        if (userCredentials.password !== md5(password))
            throw ERRORS.WRONG_PASSWORD
        return userCredentials.token
    })
}

export function getUsers(): Promise<UserPublicObject[]> {
    return executeInDB(async () => {        
        return await UserPublicSchema.find()
    })
}