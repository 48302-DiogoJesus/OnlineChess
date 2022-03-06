import UserPublicSchema, { UserPublicObject } from "./schemas/userPublic"
import { executeInDB } from "./common"

const bundled = {
    getFriends, addFriend, removeFriend, hasFriend
}

export default bundled;

export async function getFriends(username: string): Promise<string[]> {
    return executeInDB(async () => {
        const userDoc = (await UserPublicSchema.findById(username)) as UserPublicObject
        return userDoc.friends
    })
}

export async function addFriend(username: string, friend_name: string): Promise<void> {
    return executeInDB(async () => {
        const userFriends = ((await UserPublicSchema.findById(username)) as UserPublicObject).friends!!
        userFriends.push(friend_name)
        await UserPublicSchema.findOneAndUpdate({ _id: username }, { friends: userFriends })
        return
    })
}

export async function removeFriend(username: string, friend_name: string): Promise<void> {
    return executeInDB(async () => {
        const userFriends = ((await UserPublicSchema.findById(username)) as UserPublicObject).friends!!
        userFriends.splice(userFriends.indexOf(friend_name))
        await UserPublicSchema.findOneAndUpdate({ _id: username }, { friends: userFriends })
        return
    })
}

export async function hasFriend(username: string, friend_name: string): Promise<boolean> {
    return executeInDB(async () => {
        const userFriends = ((await UserPublicSchema.findById(username)) as UserPublicObject).friends!!
        return userFriends.includes(friend_name)
    })
}