// Utilitary functions for the MainPage component and inner components

import { NavigateFunction } from "react-router-dom"
import { PieceColor, PieceType } from "../../domain/piece"
import Alerts from "../../utils/Alerts/sa-alerts"

export function showGameJoinMessage(game_id: string, navigate: NavigateFunction) {
    return Alerts.showMessage("Game Created", "You can now join by clicking on the button below",
        {
            joinGame: {
                text: 'Join',
                className: 'join-game-btn',
                visible: true
            }
        }, [
        {
            className: "join-game-btn",
            eventName: "click",
            execute: () => { navigate(`/games/${game_id}`) }
        }
    ])
}


const MainPageUtils = {
    showGameJoinMessage
}

export default MainPageUtils
