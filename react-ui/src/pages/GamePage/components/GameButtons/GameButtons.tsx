import './GameButtons.css'

export default function GameButtons(
  props: {
    gameOver: boolean
  }
) {
  return (
    <div className="game-buttons">
      {/* {!props.gameOver ? <a className="game-buttons-forfeit">Forfeit</a> : null} */}
    </div>
  )
}