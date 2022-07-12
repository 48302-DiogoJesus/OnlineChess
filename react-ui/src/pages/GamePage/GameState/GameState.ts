import { BoardObject } from "../../../domain/board";
import { PieceColor } from "../../../domain/piece";
import { IMultiplayerGS } from "./MultiplayerGS";

export interface IGameState {
    board: BoardObject,
    winner: PieceColor | null,
    local_pieces: PieceColor,
}

/** Only compares the 2 boards and opponents*/
export const areGameStatesEqual = (game1: IGameState, game2: IGameState): boolean =>
    game1.board.toString() === game2.board.toString() &&
    (game1 as IMultiplayerGS).opponent_username == (game2 as IMultiplayerGS).opponent_username


function defaultGameState(): IGameState {
    return {
        board: new BoardObject(),
        winner: null,
        local_pieces: PieceColor.WHITE
    }
}

const GameState = {
    areGameStatesEqual,
    defaultGameState
}

export default GameState