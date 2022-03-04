import mongoose from 'mongoose';
import { PieceColor } from '../../model/piece';
const { Schema } = mongoose;

export interface GameObject {
  _id: string,
  player_white: PieceColor,
  player_black?: PieceColor,
  board: string,
  winner?: PieceColor,
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