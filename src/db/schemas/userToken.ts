import mongoose from 'mongoose';
const { Schema } = mongoose;

export interface UserTokenObject {
  _id: string,     // token
  username: string, 
}

const userToken = new Schema({
  _id: { type: String, required: true },
  username: { type: String, required: true },
}, { collection: 'userTokens' });

export default mongoose.model("UserTokenSchema", userToken)