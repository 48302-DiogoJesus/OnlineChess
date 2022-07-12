import './GameChat.css'

export default function GameChat(
  props: {
    local_player_username: string | null,
    opponent_username: string | null,
    game_id: string
  }
) {
  return (
    <div className="game-chat-container">
      <div className="game-chat">
        <ul className="game-chat-messages">
          <li className="game-chat-message">FUTURE FEATURE</li>
        </ul>
        <div className="game-chat-input">
          <input type="text" placeholder="Write a message here..." />
        </div>
      </div>
    </div>
  )
}