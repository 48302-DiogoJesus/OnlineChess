import mongoose from 'mongoose';
import { PieceColor } from '../../model/piece';
const { Schema } = mongoose;

export interface GameObject {
  _id: string,
  player_white: string,   // username of player1
  player_black: string | null,  // username of player2
  board: string,
  winner: PieceColor | null,
  turn: PieceColor
}

const Game = new Schema({
  _id: { type: String, required: true },
  player_white: { type: String, required: true },
  player_black: { type: String, required: false },
  board: { type: String, required: true },
  winner: { type: String, required: false },
  turn: { type: String, required: true }
}, { collection: 'Games' });

export default mongoose.model("GameSchema", Game)