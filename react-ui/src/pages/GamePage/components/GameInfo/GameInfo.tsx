import { PieceColor } from '../../../../domain/piece'
import './GameInfo.css'

export default function GameInfo(
    props: {
        singleplayer: boolean
        game_over: boolean
        turn_username: string | null
        winner_username: string | null
        winner_pieces: PieceColor | null
        opponent_username: string | null
        views: number
    }
) {
    /* UPDATE THE SPECTATORS HERE */
    return (
        <div className="game-info">
            {
                props.opponent_username == null && !props.singleplayer ?
                    <div className="game-info-box">
                        <div className="game-info-prop">
                            Waiting for an opponent
                        </div>
                    </div>
                    : null
            }

            {
                !props.game_over && !props.singleplayer ?
                    <div className="game-info-box">
                        <div className="game-info-prop">
                            Turn: {
                                props.turn_username === null ? "Opponent" : props.turn_username
                            }
                        </div>
                    </div>
                    : null
            }

            {
                props.winner_username != null ?
                    <>
                        <div className="game-info-box">
                            <div className="game-info-prop">
                                Winner: {props.winner_username}
                            </div>
                            <h4>
                                [{props.winner_pieces === 'w' ? 'WHITE PIECES' : 'BLACK PIECES'}]
                            </h4>
                        </div>
                    </>
                    : null
            }

            {
                !props.singleplayer ?
                    <>
                        <div className="game-info-box">
                            <div className="game-info-prop">
                                Views:
                            </div>
                            <div className="game-info-value">
                                {props.views}
                            </div>
                        </div>
                    </>
                    : null
            }

        </div>
    )
}
