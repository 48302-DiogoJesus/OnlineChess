import { BoardObject } from "../../../domain/board"
import { PieceColor } from "../../../domain/piece"
import { RemoteGame } from "../../../server/server"

export interface IUIGameState {
    local_username: string
    opponent_username: string | null

    turn_username: string

    winner_username: string | null
}

function fromRemoteGame(local_username: string, game: RemoteGame): IUIGameState {
    const opponent_username = game.player_w == local_username
        ? game.player_b
        : game.player_w

    const curr_turn = BoardObject.fromMoves(game.moves).turn
    const local_pieces = game.player_w == local_username
        ? PieceColor.WHITE
        : PieceColor.BLACK

    const turn_username = curr_turn == local_pieces
        ? local_username
        : opponent_username

    var winner_username = null
    if (game.winner != null) {
        if (game.winner == local_pieces) {
            winner_username = local_username
        } else {
            winner_username = opponent_username
        }
    }

    return {
        local_username,
        opponent_username,

        turn_username: turn_username == null ? game.player_w : turn_username,

        winner_username
    }
}

const UIGameState = {
    fromRemoteGame
}

export default UIGameState