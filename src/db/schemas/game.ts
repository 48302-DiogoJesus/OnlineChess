import mongoose from 'mongoose';
import { PieceColor } from '../../model/piece';
const { Schema } = mongoose;

export interface GameObject {
  _id: string,
  player_w: string,   // username of player1
  player_b: string | null,  // username of player2

  moves: string[],
  winner: PieceColor | null,
  views: number
}

const Game = new Schema({
  _id: { type: String, required: true },
  player_w: { type: String, required: true },
  player_b: { type: String, required: false },

  moves: [
    { type: String, required: true }
  ],
  winner: { type: String, required: false },
  views: { type: Number, required: true },
  // turn: { type: String, required: true }
}, { collection: 'Games' });

export default mongoose.model("GameSchema", Game)