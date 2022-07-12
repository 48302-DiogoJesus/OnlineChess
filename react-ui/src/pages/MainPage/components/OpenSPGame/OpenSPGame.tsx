import { useNavigate } from "react-router-dom"
import "./OpenSPGame.css"

export default function OpenSPGame() {
    const navigate = useNavigate()

    function handleJoinGame() {
        navigate(`/games/sp`)
    }

    return (
        <div className="open-game-inner-container">
            <h3 className="header">Singleplayer</h3>
            <h4>Not against a machine :(</h4>

            <div className="entry">
                <button className="open-game-btn" onClick={handleJoinGame}>
                    CREATE
                </button>
            </div>
        </div >
    )
}