import * as mongoose from 'mongoose';
import { genderEnum } from '../enums/gender.enum';

export const UserSchema = new mongoose.Schema({
  email: { type: String, required: true },
  avatar: { type: String, default: null },
  avatar_id: { type: String, default: null },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  gender: { type: String, required: true, enum: Object.values(genderEnum) },
});
