import './GameHeader.css'
import { useNavigate } from 'react-router-dom'

function GameHeader(
    props: {
        singleplayer: boolean,
        game_id: string,
        game_over: boolean
    }
) {
    const navigate = useNavigate()

    return (
        <div className="game-header-wrapper">
            <div className="left-side">
                {
                    !props.singleplayer ?
                        <>
                            <h1 className="game-header id">Game ID: {props.game_id}</h1>
                            <h3 className="game-header state">({!props.game_over ? "ongoing" : "over"})</h3>
                        </>
                        : <h1 className="game-header id">Singleplayer Mode</h1>
                }

            </div>
            <div className="right-side">
                <button onClick={() => navigate('/')} className="green-btn">Main Page</button>
            </div>
        </div>
    )
}

export default GameHeader