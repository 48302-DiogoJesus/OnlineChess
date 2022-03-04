import { executeInDB } from "./common"
import UserTokenSchema, { UserTokenObject } from "./schemas/userToken"
import UserPublicSchema, { UserPublicObject } from "./schemas/userPublic"
import UserAuthenticationSchema, { UserAuthenticationObject } from "./schemas/userAuthentication"
import ERRORS from '../errors/errors'
import { randomUUID as genRandomToken } from "crypto"
import md5 from "md5"

export function validateUserName(username: string) {
    if (!(username.length >= 4 && username.length <= 20)) {
        throw ERRORS.INVALID_USERNAME_LENGTH
    }
    /*
    if (!(/^[a-zA-Z0-9]+$/.test(username))) {
        throw ERRORS.INVALID_USERNAME_CHARACTERS
    }
    */
}

export function validatePassword(password: string) {
    if (!(password.length >= 4 && password.length <= 20)) {
        throw ERRORS.INVALID_PASSWORD_LENGTH
    }
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
// | userExists | createUser | deleteUser | getUserPublic | getUserAuthenticationInfo | tokenToUsername |
// | updateUserPassword | updateUserPublic | validateCredentials | 

const bundled = {
    validateUserName, validatePassword, userExists, createUser, deleteUser, getUserPublic, getUserAuthenticationInfo, 
    tokenToUsername, updateUserPassword, updateUserPublic, validateCredentials
}

export default bundled

export async function userExists(username: string, already_connected: boolean = false): Promise<boolean> {
    const block = async () => await UserAuthenticationSchema.findOne({ _id: username })

    if (already_connected) {
        if (await block() !== null)
            return true
        return false
    }
    return executeInDB(async () => {
        if (await block() !== null)
            return true
        return false
    })
}

export async function createUser(username: string, password: string): Promise<string> {
    // Throws if not valid
    validateUserName(username)
    validatePassword(password)

    return executeInDB(async () => {
        if (await userExists(username, true))
            throw ERRORS.USER_ALREADY_EXISTS
        
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

export async function deleteUser(username: string): Promise<void> {
    return executeInDB(async () => {
        if (!(await userExists(username, true)))
            throw ERRORS.USER_DOES_NOT_EXIST
        await Promise.all([
            UserAuthenticationSchema.deleteOne({ _id: username }),
            UserPublicSchema.deleteOne({ _id: username }),
            UserTokenSchema.deleteOne({ username: username })
        ])
        return
    })
}

export async function getUserPublic(username: string): Promise<UserPublicObject> {
    return executeInDB(async () => {

        if (!(await userExists(username, true)))
            throw ERRORS.USER_DOES_NOT_EXIST

        const publicUserDoc = await UserPublicSchema.findOne({ _id: username })

        if (publicUserDoc === null)
            throw ERRORS.UNKNOWN_ERROR(500, `Could not get public user information for ${username}`)

        return (publicUserDoc as UserPublicObject)
    })
}

export async function getUserAuthenticationInfo(username: string, already_connected: boolean = false): Promise<UserAuthenticationObject> {
    
    if (already_connected) {
        const userAuthDoc = await UserAuthenticationSchema.findOne({ _id: username })
        return (userAuthDoc as UserAuthenticationObject)
    }

    return executeInDB(async () => {
        if (!(await userExists(username, true)))
            throw ERRORS.USER_DOES_NOT_EXIST
        
        const userAuthDoc = await UserAuthenticationSchema.findOne({ _id: username })
        return (userAuthDoc as UserAuthenticationObject)
    })
}

export async function tokenToUsername(token: string): Promise<string> {
    return executeInDB(async () => {
        const userTokenDoc = await UserTokenSchema.findOne({ _id: token })
        if (userTokenDoc === null)
            throw ERRORS.INVALID_TOKEN
        return (userTokenDoc as UserTokenObject).username
    })
}

export async function updateUserPassword(username: string, new_password: string): Promise<void> {
    return executeInDB(async () => {
        if (!await userExists(username, true))
            throw ERRORS.USER_DOES_NOT_EXIST
        
        validatePassword(new_password)
        
        await UserAuthenticationSchema.findOneAndUpdate({ _id: username }, {
            password: md5(new_password)
        })
        return
    })
}

export async function updateUserPublic(username: string, userData: UserPublicObject) {
    return executeInDB(async () => {
        if (!await userExists(username, true))
            throw ERRORS.USER_DOES_NOT_EXIST

        const { _id, ...updatedUserData } = userData
        console.log(updatedUserData)
        await UserPublicSchema.findOneAndUpdate({ _id: username }, {
            ...updatedUserData,
        })
    })
}

export async function validateCredentials(username: string, password: string): Promise<void> {
    return executeInDB(async () => {
        if (!await userExists(username, true))
            throw ERRORS.USER_DOES_NOT_EXIST
        
            const userCredentials = (await getUserAuthenticationInfo(username, true))
            
            if (userCredentials.password !== md5(password))
                throw ERRORS.WRONG_PASSWORD
            return true
    })
}