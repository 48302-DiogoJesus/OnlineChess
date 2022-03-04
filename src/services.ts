import { GameObject } from './db/schemas/game'
import {
    createGame as DBCreateGame,
    updateGame as DBUpdateGame,
    gameExists as DBGameExists,
    getGame    as DBGetGame,
    deleteGame
} from './db/games'
import {
    BoardObject as Board, stringToBoard
} from './model/board'
import Users from './db/users'
import ERRORS from './errors/errors'
import { UserPublicObject } from './db/schemas/userPublic'


export async function createGame(token: string, game_id: string, player_white: string) {
    // Throws if not authenticated
    const username = await Users.tokenToUsername(token)

    // Build Remote Game Object
    const defaultBoard = new Board()
    const gameObject = {
        _id: game_id,
        player_white: username,
        player_black: null,
        board: defaultBoard.toString(),
        turn: defaultBoard.turn,
        winner: defaultBoard.winner
    }
    // Later do token and authorization validations here ! dont forget AWAIT THEN!
    return await DBCreateGame(gameObject)
}

export async function joinGame(token: string, game_id: string): Promise<void> {
    const username = await Users.tokenToUsername(token)

    const currentGameObject = await DBGetGame(game_id)

    return await DBUpdateGame({
        ...currentGameObject,
        player_black: username
    })
}

export async function isValidMove(token: string, game_id: string, move: string): Promise<boolean> {
    const username = await Users.tokenToUsername(token)

    const gameObject = await DBGetGame(game_id)

    if (username !== gameObject.player_black && username !== gameObject.player_white)
        throw ERRORS.NOT_AUTHORIZED

    const testBoard = stringToBoard(gameObject.board)
    // If remote game as string is invalid just delete it
    if (testBoard === null) {
        await deleteGame(game_id)
        return false
    }
    // If not valid, makeMove throws and api handles error
    testBoard.makeMove(move)
    // Update remote game
    DBUpdateGame(
        {
            ...gameObject,
            board: testBoard.toString(),
            winner: testBoard.winner,
            turn: testBoard.turn
        }
    )
    return true
} 

/* --------------------------- USERS --------------------------- */

export async function userExists(token: string, user_to_find: string): Promise<boolean> {

    await Users.tokenToUsername(token)

    return await Users.userExists(user_to_find)
}

export async function createUser(username: string, password: string) {
    return await Users.createUser(username, password)
}

export async function deleteUser(token: string, user_to_delete: string) {
    const username = await Users.tokenToUsername(token)

    if (username !== user_to_delete)
        throw ERRORS.NOT_AUTHORIZED
    

    return await Users.deleteUser(username)
}

export async function getUserPublic(token: string, username: string) {
    await Users.tokenToUsername(token)
    return await Users.getUserPublic(username)
}

export async function updateUserPassword(token: string, user_to_update: string, new_password: string) {
    const username = await Users.tokenToUsername(token)
    
    if (username !== user_to_update)
        throw ERRORS.NOT_AUTHORIZED
    
    return await Users.updateUserPassword(username, new_password)
}

export async function updateUserPublic(token: string, user_to_update: string, userData: UserPublicObject) {
    const username = await Users.tokenToUsername(token)

    if (username !== user_to_update)
        throw ERRORS.NOT_AUTHORIZED

    return await Users.updateUserPublic(username, userData)
}

export async function validateCredentials(username: string, password: string) {
    return await Users.validateCredentials(username, password)
}