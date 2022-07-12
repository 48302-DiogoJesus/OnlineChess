import './OpenMPGame.css'
import '../../../../global-css/switches.css'

import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import Server, { ServerResponse } from '../../../../server/server'
import Alerts from '../../../../utils/Alerts/sa-alerts'
import { showGameJoinMessage } from '../../utils'
import MainPageUtils from '../../utils'

export default function OpenMPGame() {
    const navigate = useNavigate()

    const gameId_input: any = useRef()
    const opponent_input: any = useRef()

    const [publicGame, setPublicGame] = useState(true)

    async function handleCreateGame() {
        const gameIdValue = validateGameID(true)
        if (gameIdValue == false) {
            return
        }

        const opponent_name: string | null =
            publicGame
                ? null
                : opponent_input.current.value

        if (opponent_name != null && opponent_name.length == 0) {
            Alerts.showNotification("Since you chose a private game you need to define an opponent")
            return
        }

        const result: ServerResponse = await Server.createGame(gameIdValue, publicGame, opponent_name)

        if (result.success)
            MainPageUtils.showGameJoinMessage(gameIdValue, navigate)
    }

    function handleJoinGame() {
        const gameIdValue = validateGameID(true)
        if (gameIdValue == false)
            return
        navigate(`/games/${gameIdValue}`)
    }

    function validateGameID(showError: boolean = false): false | string {
        const gameIdValue = gameId_input.current.value
        if (!(gameIdValue.length >= 5 && gameIdValue.length <= 20)) {
            if (showError)
                Alerts.showNotification("Invalid Game ID. It must have between 5 and 20 characters")
            return false
        }
        return gameIdValue
    }

    function handleInputChange() {
        validateGameID()
    }

    function togglePublic() {
        setPublicGame(!publicGame)
    }

    return (
        <div className="open-game-inner-container">
            <h3 className="header">Create / Join a Game</h3>

            <div className="entry">
                <span className="key">Game ID</span>
                <span className="value">
                    <input onChange={handleInputChange} ref={gameId_input} className="game-id form-control" placeholder="Game ID" aria-label="Game ID" aria-describedby="basic-addon1" />
                </span>
            </div>

            <div className="entry">
                <span className="key">Private</span>
                <span className="value">
                    <label className="switch">
                        <input onClick={togglePublic} type="checkbox" />
                        <span className="slider round"></span>
                    </label>
                </span>
            </div>
            {
                !publicGame ?
                    <div className="entry">
                        <span className="key">
                            Opponent
                        </span>
                        <span className="value">
                            <input onChange={handleInputChange} ref={opponent_input} className="game-id form-control" placeholder="Opponent Username" aria-label="Game ID" aria-describedby="basic-addon1" />
                        </span>
                    </div>
                    : null
            }

            <div className="entry">
                <button className="open-game-btn" onClick={handleCreateGame}>
                    CREATE
                </button>
                {
                    publicGame ?
                        <button className="open-game-btn" onClick={handleJoinGame}>
                            JOIN
                        </button>
                        : null
                }
            </div>
        </div >
    )
}