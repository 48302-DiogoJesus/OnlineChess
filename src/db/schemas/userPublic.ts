import mongoose from 'mongoose';
const { Schema } = mongoose;

export interface UserPublicObject {
  _id?: string,     // username
  rank?: number     // player rank (numeric 1-99)
}

const userPublic = new Schema({
  _id: { type: String, required: true },
  rank: { type: String, required: true },
}, { collection: 'UsersPublic' });

export default mongoose.model("UserPublicSchema", userPublic)