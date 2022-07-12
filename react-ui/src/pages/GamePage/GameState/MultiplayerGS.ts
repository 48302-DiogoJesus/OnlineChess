import { BoardObject } from "../../../domain/board";
import { getOpponent, PieceColor } from "../../../domain/piece";
import { RemoteGame } from "../../../server/server";
import GameState, { IGameState } from "./GameState";

export enum ClientType {
    PLAYER_WHITE,
    PLAYER_BLACK,
    VIEWER,
    UNKNOWN
}

export interface IMultiplayerGS extends IGameState {
    /* Has all the GameState properties + opponent_pieces */
    game_id: string
    opponent_pieces: PieceColor,
    client_type: ClientType,

    local_username: string
    opponent_username: string | null
    turn_username: string
    winner_username: string | null

    views: number
}

function buildMultiplayerGS(
    local_username: string,
    remoteGame: RemoteGame,
    clientType: ClientType
): IMultiplayerGS {
    const local_pieces = clientType === ClientType.PLAYER_BLACK
        ? PieceColor.BLACK
        : PieceColor.WHITE

    const opponent_pieces = getOpponent(local_pieces)

    const opponent_username = remoteGame.player_w == local_username
        ? remoteGame.player_b
        : remoteGame.player_w

    const curr_turn = BoardObject.fromMoves(remoteGame.moves).turn

    const turn_username = curr_turn == local_pieces
        ? local_username
        : opponent_username!!

    var winner_username = null
    if (remoteGame.winner != null) {
        if (remoteGame.winner == local_pieces) {
            winner_username = local_username
        } else {
            winner_username = opponent_username
        }
    }

    return {
        board: BoardObject.fromMoves(remoteGame.moves),
        winner: remoteGame.winner,
        local_pieces: local_pieces,

        game_id: remoteGame._id,
        opponent_pieces: opponent_pieces,
        client_type: clientType,

        local_username,
        opponent_username,
        turn_username,
        winner_username,

        views: remoteGame.views
    }
}

function updateFromRemote(
    prevState: IMultiplayerGS,
    remoteGame: RemoteGame
): IMultiplayerGS {

    const board: BoardObject = BoardObject.fromMoves(remoteGame.moves)
    const winner: PieceColor | null = board.winner
    const local_pieces: PieceColor = prevState.local_pieces

    const game_id = prevState.game_id
    const opponent_pieces: PieceColor = getOpponent(prevState.local_pieces)
    const client_type: ClientType = prevState.client_type

    const local_username = prevState.local_username
    const opponent_username = remoteGame.player_w == local_username ? remoteGame.player_b : remoteGame.player_w
    const turn_username = board.turn === local_pieces
        ? local_username
        : opponent_username!!

    var winner_username = null
    if (remoteGame.winner != null) {
        if (remoteGame.winner == local_pieces) {
            winner_username = local_username
        } else {
            winner_username = opponent_username
        }
    }

    const views = remoteGame.views

    return {
        board,
        winner,
        local_pieces,

        game_id,
        opponent_pieces,
        client_type,

        local_username,
        opponent_username,
        turn_username,
        winner_username,

        views
    }
}

function calcClientType(gameState: RemoteGame, username: string | null): ClientType {
    if (username == null) {
        return ClientType.VIEWER
    }
    if (username == gameState.player_w) {
        return ClientType.PLAYER_WHITE
    } else if (gameState.player_b == username || gameState.player_b == null) {
        // If im player2 join like that. If no one is player2 and i am not player1 join
        return ClientType.PLAYER_BLACK
    } else {
        return ClientType.VIEWER
    }
}

function isMultiplayerGS(gs: object) {
    return (Object.keys(gs).length === (Object.keys(defaultGameState).length))
}

// Private. Just useful to isMultiplayerGS function
function defaultGameState(): IMultiplayerGS {
    return {
        ...GameState.defaultGameState(),
        game_id: "",
        opponent_pieces: PieceColor.BLACK,
        client_type: ClientType.PLAYER_WHITE,

        local_username: "",
        opponent_username: "",
        turn_username: "",
        winner_username: "",

        views: 0
    }
}
const Multiplayer = {
    buildMultiplayerGS,
    updateFromRemote,

    calcClientType,
    isMultiplayerGS
}

export default Multiplayer

