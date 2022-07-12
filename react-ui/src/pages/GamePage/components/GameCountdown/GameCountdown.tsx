import './GameCountdown.css'

export default function GameCountdown(
  props: {
    game_over: boolean
    initalTime: number
  }
) {
  return (
    <div className="game-countdown">
      {
        !props.game_over ?
          <>
            <h3 className="time-left">Time Left</h3>
            <div className="time-container">
              {props.initalTime}
            </div>
          </>
          : null
      }
    </div>
  )
}
