import { PieceColor } from '../../../../domain/piece'
import './GameVS.css'

export default function GameVS(
  props: {
    singleplayer: boolean
    local_player_username: string
    local_player_pieces: PieceColor
    opponent_username: string | null
    opponent_pieces: PieceColor | null
  }
) {

  const local_player_pieces_color = props.local_player_pieces == PieceColor.BLACK
    ? "BLACK"
    : "WHITE"

  const opponent_pieces_color = props.opponent_pieces == PieceColor.BLACK
    ? "BLACK"
    : "WHITE"

  return (
    <div className="game-vs">
      <div className="game-vs-username">
        {props.local_player_username}
        <h5> [{local_player_pieces_color}] </h5>
      </div>

      <div className="game-vs-vs">VS</div>

      <div className="game-vs-username">
        {props.opponent_username !== null ? props.opponent_username : "N/A"}
        <h5> [{opponent_pieces_color}] </h5>
      </div>
    </div>
  )
}
