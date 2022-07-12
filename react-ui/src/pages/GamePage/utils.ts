// Utilitary functions for the GamePage component

import { NavigateFunction } from "react-router-dom"
import { PieceColor, PieceType } from "../../domain/piece"
import Alerts from "../../utils/Alerts/sa-alerts"

export function showGameError(game_id: string, navigate: NavigateFunction, message: string) {
    return Alerts.showMessage(`Game Error: "${game_id}"`, message,
        {
            goBackBtn: {
                text: 'Go Back',
                className: 'go-back-btn',
                visible: true
            }
        }, [
        {
            className: "go-back-btn",
            eventName: "click",
            execute: () => { navigate('../') }
        }
    ])
}

export function askPromotionPiece(turn: PieceColor): Promise<string> {
    return new Promise<string>((resolve, _) => {
        Alerts.showMessage("Promotion", "Choose a piece",
            {
                promotionQueen: {
                    text: 'Queen',
                    className: 'promotion-queen',
                    visible: true
                },
                promotionRook: {
                    text: 'Rook',
                    className: 'promotion-rook',
                    visible: true
                },
                promotionBishop: {
                    text: 'Bishop',
                    className: 'promotion-bishop',
                    visible: true
                },
                promotionKnight: {
                    text: 'Knight',
                    className: 'promotion-knight',
                    visible: true
                }
            }, [
            {
                className: "promotion-queen",
                eventName: "click",
                execute: () => { resolve(turn == PieceColor.WHITE ? PieceType.QUEEN.toUpperCase() : PieceType.QUEEN) }
            },
            {
                className: "promotion-rook",
                eventName: "click",
                execute: () => { resolve(turn == PieceColor.WHITE ? PieceType.ROOK.toUpperCase() : PieceType.ROOK) }
            },
            {
                className: "promotion-bishop",
                eventName: "click",
                execute: () => { resolve(turn == PieceColor.WHITE ? PieceType.BISHOP.toUpperCase() : PieceType.BISHOP) }
            },
            {
                className: "promotion-knight",
                eventName: "click",
                execute: () => { resolve(turn == PieceColor.WHITE ? PieceType.KNIGHT.toUpperCase() : PieceType.KNIGHT) }
            },
        ]
        )
    })
}


const GamePageUtils = {
    showGameError,
    askPromotionPiece
}

export default GamePageUtils
