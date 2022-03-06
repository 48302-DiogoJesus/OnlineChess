import mongoose from 'mongoose';
const { Schema } = mongoose;

export interface UserPublicObject {
  _id?: string,             // username
  rank?: number             // player rank (numeric 1-99)
  friends?: string[],       // List with friends names
  public_profile?: boolean, // Defines the visibility of the user profile
  invites?: string[]        // Game Identifiers for which the player_black is himself
}

const userPublic = new Schema({
  _id: { type: String, required: true },
  rank: { type: String, required: true },
  friends: { type: [String], required: false},
  public_profile: { type: String, required: false},
  invites: { type: [String], required: false}
}, { collection: 'UsersPublic' });

export default mongoose.model("UserPublicSchema", userPublic)