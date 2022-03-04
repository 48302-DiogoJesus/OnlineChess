import { GameObject } from './db/schemas/game'
import {
    createGame as DBCreateGame,
    updateGame as DBUpdateGame,
    gameExists as DBGameExists
} from './db/games'

export async function createGame(gameObject: GameObject) {
    // Later do token and authorization validations here ! dont forget AWAIT THEN!
    return await DBCreateGame(gameObject)
}

export async function updateGame(gameObject: GameObject) {
    // Later do token and authorization validations here
    return await DBUpdateGame(gameObject)
}

export async function gameExists(game_id: string) {
    // Later do token and authorization validations here
    return await DBGameExists(game_id)
}

