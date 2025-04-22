import { Schema } from 'mongoose';

export interface UserDocument extends Document {
  email: string;
  password: string;
  token?: string; 
}


export const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  token:{
    type: String,
  }
});
