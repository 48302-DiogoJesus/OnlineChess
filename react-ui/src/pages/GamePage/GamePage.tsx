import './GamePage.css'

import GameVS from './components/GameVS/GameVS'
import GameInfo from './components/GameInfo/GameInfo'
import GameCountdown from './components/GameCountdown/GameCountdown'
import GameChat from './components/GameChat/GameChat'
import GameButtons from './components/GameButtons/GameButtons'
import Board from './components/ChessBoard/Board/Board'
import GameHeader from './components/GameHeader/GameHeader'

import State from '../../state/State'

import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import Alerts from '../../utils/Alerts/sa-alerts'
import Server, { RemoteGame, ServerError } from '../../server/server'

import GamePageUtils from './utils'
import { BoardError } from '../../domain/errors'
import Multiplayer, { ClientType, IMultiplayerGS } from './GameState/MultiplayerGS'
import GameState from './GameState/GameState'
import Singleplayer from './GameState/Singleplayer'

// LOW TIME BECAUSE ON DEVELOPMENT
const UPDATE_GAME_TIMEOUT = 1000

export default function GamePage(props: any) {
  const navigate = useNavigate()

  // NEVER NULL BECAUSE OF THE ROUTE POINTING TO THIS COMPONENT 
  const game_id = useParams().game_id!!
  // Am i waiting for the game info to be retreived from the server ?
  const [waiting, setWaiting] = useState(true)
  const [gameState, setGameState] = useState(GameState.defaultGameState)
  const singleplayer = game_id == "sp"
  const multiplayerGS = gameState as IMultiplayerGS

  const local_username = State.getAppState().authentication.username

  // FIRST RENDER
  useEffect(() => {
    new Promise((resolve, reject) => {
      if (singleplayer) {
        startSingleplayerGame()
        resolve(null)
      } else {
        joinMultiplayerGame().then(() => resolve(null))
      }
    }).then(() => setWaiting(false))
    return () => { }
  }, [])

  // AUTO-REFRESH CALLS
  const [rr, setrr] = useState(true)
  const forceRR = () => { setrr(!rr) }
  useEffect(() => {

    while (true) {
      if (singleplayer)
        return

      // It is Multiplayer Game
      // Dont try update while i dont have the game
      if (waiting)
        return

      // I'm not a viewer
      // If game is Over
      if (gameState.winner != null)
        return

      // Always Update if i'm a viewer
      if (multiplayerGS.client_type == ClientType.VIEWER)
        break

      // Opponent has not been defined yet
      if (multiplayerGS.opponent_username == null)
        break

      // Game has started + I am a player
      // It's my turn AND 
      if (multiplayerGS.board.turn == multiplayerGS.local_pieces)
        return

      break
    }
    const timer = setTimeout(() => updateMultiplayerGame(), UPDATE_GAME_TIMEOUT)

    return () => clearTimeout(timer)
  }, [gameState.board, waiting, rr])

  function startSingleplayerGame() {
    setGameState(Singleplayer.buildSingleplayerGS())
  }

  /**
   * Join Multiplayer Game
   * Attempts to get the game identified by the ID passed as URI param
   * Based of of the [local_username] + the remote game it knows who we are: WHITE_PIECES, BLACK_PIECES or VIEWER
   * If we are supposed to be the black player and there is no black player yet we tell the server it's us
   * We update the local [gameState] based of of the remote Game we get from the server 
   */
  async function joinMultiplayerGame() {
    // const response = await State.joinGame(game_id)
    const response = await Server.getGame(game_id)

    if (!response.success) {
      await launchCriticalError(response.data)
      return
    }

    const remoteGame = response.data as RemoteGame
    const clientType = Multiplayer.calcClientType(remoteGame, local_username)

    if (clientType == ClientType.PLAYER_BLACK && remoteGame.player_b == null) {
      // JOIN AS BLACK
      const joinResponse = await Server.joinAsPlayerB(game_id)

      if (joinResponse.success) {
        const remoteGameJoin = joinResponse.data as RemoteGame
        setGameState(Multiplayer.buildMultiplayerGS(local_username!!, remoteGameJoin, clientType))
      } else {
        await launchCriticalError(joinResponse.data)
        return
      }
    } else {
      if (clientType == ClientType.VIEWER) {
        // Increment viewer count
        setGameState(Multiplayer.buildMultiplayerGS(remoteGame.player_w, remoteGame, clientType))
        Server.incrementViewers(game_id)
      } else {
        // WHITE_PIECES PLAYER
        setGameState(Multiplayer.buildMultiplayerGS(local_username!!, remoteGame, clientType))
        return
      }
    }
  }

  /**
   * Update Multiplayer Game
   * Updates the local game state if the remote game board is different
   */
  async function updateMultiplayerGame() {
    const state = (gameState as IMultiplayerGS)

    const response = await Server.getGame(state.game_id)

    forceRR()

    if (response.success) {
      const remoteGame = response.data as RemoteGame
      const newMultiplayerGS = Multiplayer.updateFromRemote(state, remoteGame)
      if (!GameState.areGameStatesEqual(state, newMultiplayerGS)) {
        setGameState(newMultiplayerGS)
        return
      }
    } else {
      // On error ignore it and gamestate won't be updated.
      return
    }
    // On error ignore it and gamestate won't be updated.
    return
  }

  /**
   * Handle Make Move
   * Performs a move on the local board and if it succeeds AND we are !singlePlayer validate with the server(updates remote game on success)
   * If on singleplayer just swap the [local_pieces] to play as the opponent
   */
  async function handleMakeMove(move: string) {
    if (gameState.board.turn != gameState.local_pieces) {
      Alerts.showNotification("Not your turn!")
      return
    }
    // Validate move Locally (should never fail)
    try {
      const promotion: boolean = gameState.board.isPromotionMove(move)
      if (promotion) {
        const pieceAsString = await GamePageUtils.askPromotionPiece(gameState.local_pieces)
        const promotionMove = pieceAsString + move.substring(1)
        gameState.board.makeMove(promotionMove)
        // MODIFY CHAR OF THE MOVE TO THE PROMOTION PIECE CHOOSEN
      } else {
        gameState.board.makeMove(move)
      }
    } catch (err) {
      Alerts.showNotification((err as BoardError).message)
      return
    }
    // SINGLEPLAYER
    if (singleplayer) {
      setGameState(Singleplayer.switchTurn(gameState))
      return
    }
    // MULTIPLAYER
    else {
      // Validate with server
      const response = await Server.makeMove(game_id, move)
      if (!response.success) {
        Alerts.showNotification(`Invalid Move: ${(response.data as ServerError).message}`)
        return
      }
      const remoteGame = response.data as RemoteGame
      // Change local state from server game response
      const newGameState = Multiplayer.updateFromRemote(gameState as IMultiplayerGS, remoteGame)
      setGameState(newGameState)
    }
  }

  function launchCriticalError(err: BoardError | ServerError) {
    return GamePageUtils.showGameError(game_id, navigate, err.message)
  }

  return (
    <div className="global-container">
      {
        !waiting ?
          (
            <div className="game-container">

              <div className="game-container-row">
                <GameHeader singleplayer={singleplayer} game_id={game_id} game_over={gameState.board.winner != null} />
              </div>

              <hr className="separator" />

              {
                singleplayer ?
                  <div className="singleplayer-piece-turn">
                    {
                      gameState.board.winner === null ?
                        <>Turn : {gameState.board.turn === 'w' ? 'WHITE' : 'BLACK'}</>
                        :
                        <>
                          {gameState.board.winner === 'w' ? 'WHITE' : 'BLACK'} pieces won!
                          <button onClick={startSingleplayerGame} className="green-btn restart">RESTART</button>
                        </>
                    }
                  </div>
                  : null
              }

              <div className="game-container-row">
                {
                  !singleplayer ?
                    <>
                      <GameVS
                        singleplayer={singleplayer}
                        local_player_username={multiplayerGS.local_username} local_player_pieces={multiplayerGS.local_pieces}
                        opponent_username={multiplayerGS.opponent_username} opponent_pieces={multiplayerGS.opponent_pieces}
                      />
                      <GameCountdown game_over={gameState.board.winner != null} initalTime={60} />
                    </>
                    : null
                }
              </div>

              <div className="game-container-row">
                <Board
                  singleplayer={singleplayer}
                  board={gameState.board}
                  local_player_pieces={multiplayerGS.local_pieces}
                  isViewer={multiplayerGS.client_type === ClientType.VIEWER}
                  turn={gameState.board.turn}
                  game_over={gameState.board.winner != null}
                  onMakeMove={handleMakeMove}
                  onError={launchCriticalError}
                />
                {
                  !singleplayer ?
                    <GameChat game_id={game_id} local_player_username={multiplayerGS.local_username} opponent_username={multiplayerGS.opponent_username} />
                    : null
                }
              </div>

              <div className="game-container-row">
                <GameInfo
                  singleplayer={singleplayer}
                  game_over={multiplayerGS.winner_username != null}
                  turn_username={multiplayerGS.turn_username}
                  winner_username={multiplayerGS.winner_username}
                  winner_pieces={multiplayerGS.winner}
                  opponent_username={multiplayerGS.opponent_username}
                  views={multiplayerGS.views}
                />

                {
                  !singleplayer ?
                    <GameButtons gameOver={multiplayerGS.winner_username != null} />
                    : null
                }
              </div>
            </div>
          )
          : null
      }
    </div >
  )
}
