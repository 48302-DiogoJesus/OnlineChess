import Games from './db/games'
import Users from './db/users'
import { BoardObject as Board, stringToBoard } from './model/board'
import ERRORS from './errors/errors'
import { UserPublicObject } from './db/schemas/userPublic'
import { getOpponent, PieceColor } from './model/piece'
import { GameObject } from './db/schemas/game'

const bundled = {
    gameExists, createGame, getGame, getAllGames, isAllowedToConnectToGame, connectToGame, executeGameMove, deleteGame,
    getUsers, userExists, createUser, deleteUser, getUserPublic, updateUserPassword, updateUserPublic, validateCredentials
}
export default bundled

export async function getAllGames(token: string) {
    await Users.tokenToUsername(token)
    return Games.getGames()
}

// Any player can connect as "player_black" later if player_black = null
export async function createGame(token: string, game_id: string, player_black: string | null = null) {
    // Throws if not authenticated
    const username = await Users.tokenToUsername(token)

    if (await Games.gameExists(game_id)) throw ERRORS.GAME_ALREADY_EXISTS
    
    if (player_black !== null && !(await Users.userExists(player_black)))
        throw ERRORS.USER_DOES_NOT_EXIST

    // Build Remote Game Object
    const defaultBoard = new Board()
    const gameObject = {
        _id: game_id,
        player_white: username,
        player_black: player_black,   // Could be null or an actual username
        board: defaultBoard.toString(),
        turn: defaultBoard.turn,
        winner: defaultBoard.winner
    }
    // Later do token and authorization validations here ! dont forget AWAIT THEN!
    return Games.createGame(gameObject)
}

export async function getGame(token: string, game_id: string) {
    await Users.tokenToUsername(token)

    if (!(await Games.gameExists(game_id))) throw ERRORS.GAME_DOES_NOT_EXIST

    return Games.getGame(game_id)
}

// Allows to join a game. Either an ongoing game or as player2 in the beggining of the game 
export async function isAllowedToConnectToGame(token: string, game_id: string): Promise<boolean> {
    const username = await Users.tokenToUsername(token)

    if (!(await Games.gameExists(game_id))) throw ERRORS.GAME_DOES_NOT_EXIST

    const currentGameObject = await Games.getGame(game_id)

    // If player2(black) has already connected make sure the player whos connecting is allowed
    if (currentGameObject.player_black !== null) {
        if (currentGameObject.player_white !== username && currentGameObject.player_black !== username)
            return false
    }
    return true
}

// Connect to a game that does not have a "player_black"
export async function connectToGame(token: string, game_id: string): Promise<GameObject> {
    
    const username = await Users.tokenToUsername(token)

    if (!(await isAllowedToConnectToGame(token, game_id))) throw ERRORS.NOT_AUTHORIZED_TO_CONNECT

    var currentGameObject = await Games.getGame(game_id)

    if (currentGameObject.player_black === null) {
        await Games.updateGame({
            ...currentGameObject,
            player_black: username
        })
        // Capture the updated game
        currentGameObject = await Games.getGame(game_id)
    }
    // In case both players have already connected at least once dont update the game, just send them the most updated game version

    return currentGameObject
}

export async function executeGameMove(token: string, game_id: string, move: string): Promise<boolean> {
    const username = await Users.tokenToUsername(token)

    if (!(await Games.gameExists(game_id))) throw ERRORS.GAME_DOES_NOT_EXIST

    const gameObject = await Games.getGame(game_id)

    if (username !== gameObject.player_black && username !== gameObject.player_white)
        throw ERRORS.NOT_AUTHORIZED

    const testBoard = stringToBoard(gameObject.board)
    // If remote game as string is invalid just delete it
    if (testBoard === null) {
        await Games.deleteGame(game_id)
        return false
    }

    const playerPieces = username === gameObject.player_white ? PieceColor.WHITE : PieceColor.BLACK
    if (gameObject.turn != playerPieces)
        throw ERRORS.NOT_YOUR_TURN

    // If not valid, makeMove throws and api handles error
    testBoard.makeMove(move)
    // Update remote game
    await Games.updateGame(
        {
            ...gameObject,
            board: testBoard.toString(),
            winner: testBoard.winner,
            turn: getOpponent(playerPieces)
        }
    )
    return true
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

    if (!(await Users.userExists(username)))
        throw ERRORS.USER_DOES_NOT_EXIST

    return Users.deleteUser(username)
}

export async function getUserPublic(token: string, username: string) {

    if (!(await Users.userExists(username,)))
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