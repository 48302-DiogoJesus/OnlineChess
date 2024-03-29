import Games from './db/games'
import Users from './db/users'
import UserFriends from './db/friends'

import { BoardObject as Board, BoardObject } from './model/board'
import ERRORS from './errors/errors'
import { UserPublicObject } from './db/schemas/userPublic'
import { PieceColor } from './model/piece'
import { GameObject } from './db/schemas/game'

const bundled = {
    gameExists, createGame, getGame, getGames, getGamesById, connectToGame, executeGameMove, deleteGame, incrementViewers,
    getUsers, userExists, createUser, deleteUser, getUserPublic, updateUserPassword, updateUserPublic, validateCredentials,
    getFriends, addFriend, removeFriend, hasFriend
}
export default bundled


/* --------------------------- GAMES --------------------------- */

export async function getGames(token: string, limit: boolean = false): Promise<GameObject[]> {
    await Users.tokenToUsername(token)
    return Games.getGames(limit)
}

export async function getGamesById(token: string, game_id: string) {
    const allGames = await getGames(token)
    return allGames.filter(game => game._id.includes(game_id) && game.public)
}

// Any player can connect as "player_black" later if player_black = null
export async function createGame(token: string, game_id: string, is_public: boolean | undefined, player2: string | null = null) {
    // Throws if not authenticated
    const username = await Users.tokenToUsername(token)

    if (await Games.gameExists(game_id)) throw ERRORS.GAME_ALREADY_EXISTS

    // If player2 is passed validate it exists
    if (player2 !== null && !(await Users.userExists(player2)))
        throw ERRORS.PLAYER2_DOES_NOT_EXIST

    // Build Remote Board Object
    const defaultBoard = new Board()
    // Build a Game
    const gameObject: GameObject = {
        _id: game_id,

        player_w: username,
        player_b: player2,   // Could be null or an actual username

        moves: defaultBoard.stringMoves(),

        winner: defaultBoard.winner,
        views: 0,

        public: is_public ?? true
    }
    await Games.createGame(gameObject)
    return gameObject
}

export async function getGame(game_id: string, token: string | null = null) {
    if (!(await Games.gameExists(game_id))) throw ERRORS.GAME_DOES_NOT_EXIST

    const username: string | null =
        token != null ?
            await Users.tokenToUsername(token)
            : null
    const game = await Games.getGame(game_id)
    const is_public = game.public

    // If no token provided allow to get game if not private
    if (username == null && !is_public)
        throw ERRORS.GAME_IS_PRIVATE

    // If token provided and he is not one of the players and playerb is defined
    if (!is_public && username != null && game.player_b != null && game.player_b != username && game.player_w != username)
        throw ERRORS.GAME_IS_PRIVATE

    return game
}

// Connect to a game that does not have a "player_black"
export async function connectToGame(token: string, game_id: string): Promise<GameObject> {
    const username = await Users.tokenToUsername(token)

    if (!(await Games.gameExists(game_id))) throw ERRORS.GAME_DOES_NOT_EXIST

    var gameObject = await Games.getGame(game_id)
    const is_public = gameObject.public

    // If player2(black) has already connected make sure the player whos connecting is allowed
    if (username != null && gameObject.player_b !== null) {
        // If not public and i'm neither of the players dont allow
        if (!is_public && gameObject.player_w !== username && gameObject.player_b !== username)
            throw ERRORS.NOT_AUTHORIZED_TO_CONNECT
    }
    // CAN JOIN AS player_b !
    // Even if the game is private allow any player to join, just not after that
    if (gameObject.player_b === null) {
        await Games.updateGame({
            ...gameObject,
            player_b: username
        })
        // Get the updated game
        gameObject = await Games.getGame(game_id)
    }
    // In case both players have already connected at least once dont update the game, just send them the most updated game version
    return gameObject
}

export async function executeGameMove(token: string, game_id: string, move: string): Promise<GameObject> {
    const username = await Users.tokenToUsername(token)

    if (!(await Games.gameExists(game_id))) throw ERRORS.GAME_DOES_NOT_EXIST

    const gameObject = await Games.getGame(game_id)

    if (username !== gameObject.player_b && username !== gameObject.player_w)
        throw ERRORS.NOT_AUTHORIZED

    const testBoard = BoardObject.fromMoves(gameObject.moves)

    const playerPieces =
        username === gameObject.player_w ? PieceColor.WHITE : PieceColor.BLACK

    if (testBoard.turn != playerPieces)
        throw ERRORS.NOT_YOUR_TURN

    // If not valid, makeMove throws and api handles error
    testBoard.makeMove(move)

    // If no errors happen validating update db remote game
    await Games.updateGame(
        {
            ...gameObject,
            moves: testBoard.stringMoves(),
            winner: testBoard.winner,
        }
    )
    // Return the updated game
    return Games.getGame(game_id)
}

export async function gameExists(token: string, game_id: string): Promise<boolean> {
    await Users.tokenToUsername(token)

    return Games.gameExists(game_id)
}

// ! TO BE USED BY THE SERVER, NOT THE USER 
export async function deleteGame(game_id: string) {
    if (!(await Games.gameExists(game_id))) throw ERRORS.GAME_DOES_NOT_EXIST

    return Games.deleteGame(game_id)
}

export async function incrementViewers(game_id: string) {
    if (!(await Games.gameExists(game_id))) throw ERRORS.GAME_DOES_NOT_EXIST

    if (!(await Games.isPublic(game_id))) throw ERRORS.GAME_IS_PRIVATE

    return Games.incrementViewers(game_id)
}

/* --------------------------- USERS --------------------------- */

export async function getUsers(token: string) {
    await Users.tokenToUsername(token)
    return Users.getUsers()
}

export async function userExists(token: string, user_to_find: string): Promise<boolean> {
    await Users.tokenToUsername(token)
    return Users.userExists(user_to_find)
}

export async function createUser(username: string, password: string) {
    if (await Users.userExists(username))
        throw ERRORS.USER_ALREADY_EXISTS
    Users.validateUserName(username)
    Users.validatePassword(password)
    return Users.createUser(username, password)
}

export async function deleteUser(token: string, user_to_delete: string) {
    const username = await Users.tokenToUsername(token)

    if (username !== user_to_delete)
        throw ERRORS.NOT_AUTHORIZED

    return Users.deleteUser(username)
}

export async function getUserPublic(token: string, username: string) {
    await Users.tokenToUsername(token)

    if (!(await Users.userExists(username)))
        throw ERRORS.USER_DOES_NOT_EXIST

    const publicUserData = await Users.getUserPublic(username)

    if (publicUserData === null)
        throw ERRORS.UNKNOWN_ERROR(500, `Could not get public user information for ${username}`)
    return publicUserData
}

export async function updateUserPassword(token: string, new_password: string) {
    const username = await Users.tokenToUsername(token)

    Users.validatePassword(new_password)

    if (!await Users.userExists(username))
        throw ERRORS.USER_DOES_NOT_EXIST

    return Users.updateUserPassword(username, new_password)
}

export async function updateUserPublic(token: string, user_to_update: string, userData: UserPublicObject) {
    const username = await Users.tokenToUsername(token)

    if (username !== user_to_update)
        throw ERRORS.NOT_AUTHORIZED

    if (!(await Users.userExists(username)))
        throw ERRORS.USER_DOES_NOT_EXIST

    return Users.updateUserPublic(username, userData)
}

export async function validateCredentials(username: string, password: string) {
    if (!(await Users.userExists(username)))
        throw ERRORS.USER_DOES_NOT_EXIST

    return Users.validateCredentials(username, password)
}

/* --------------------------- FRIENDS --------------------------- */

export async function getFriends(token: string, username: string | null = null): Promise<string[]> {
    const authedUser = await Users.tokenToUsername(token)

    var usertosearch = username !== null ? username : authedUser

    if (usertosearch !== authedUser) {
        if (!(await Users.userExists(usertosearch)))
            throw ERRORS.USER_DOES_NOT_EXIST
    }

    return UserFriends.getFriends(usertosearch)
}

export async function addFriend(token: string, friend_name: string): Promise<void> {
    const username = await Users.tokenToUsername(token)

    if (!(await Users.userExists(friend_name)))
        throw ERRORS.USER_DOES_NOT_EXIST

    if ((await UserFriends.hasFriend(username, friend_name)) || username === friend_name)
        throw ERRORS.USER_ALREADY_HAS_THAT_FRIEND

    return UserFriends.addFriend(username, friend_name)
}

export async function removeFriend(token: string, friend_name: string): Promise<void> {
    const username = await Users.tokenToUsername(token)

    if (!(await UserFriends.hasFriend(username, friend_name)))
        throw ERRORS.USER_DOES_NOT_HAVE_THAT_FRIEND

    // Friend does not need to exist to be removed on purpose
    return UserFriends.removeFriend(username, friend_name)
}

export async function hasFriend(token: string, friend_name: string): Promise<boolean> {
    const username = await Users.tokenToUsername(token)
    return UserFriends.hasFriend(username, friend_name)
}