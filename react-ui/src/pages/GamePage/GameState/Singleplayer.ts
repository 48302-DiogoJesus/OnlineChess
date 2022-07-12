import { getOpponent } from "../../../domain/piece";
import GameState, { IGameState } from "./GameState";

export interface ISingleplayerGS extends IGameState {
    /* Has all the GameState properties */
}

function buildSingleplayerGS(): ISingleplayerGS {
    return defaultGameState()
}

function switchTurn(state: ISingleplayerGS): ISingleplayerGS {
    return {
        ...state,
        local_pieces: getOpponent(state.local_pieces)
    }
}

function isSingleplayerGS(gs: object) {
    return (Object.keys(gs).length === Object.keys(GameState.defaultGameState).length)
}

function defaultGameState(): IGameState {
    return {
        ...GameState.defaultGameState()
        // + PROPS ONLY FROM ISingleplayerGS 
    }
}

const Singleplayer = {
    buildSingleplayerGS,
    defaultGameState,
    switchTurn
}

export default Singleplayer
