import mongoose from 'mongoose';
const { Schema } = mongoose;

export interface UserAuthenticationObject {
  _id: string           // username,
  password: string      // hashed password
  token: string         
}

const userAuthentication = new Schema({
  _id: { type: String, required: true },
  password: { type: String, required: true },
  token: { type: String, required: true }
}, { collection: 'UsersAuthentication' });

export default mongoose.model("UserAuthenticationSchema", userAuthentication)