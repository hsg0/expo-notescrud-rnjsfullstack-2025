import mongoose from "mongoose";
import { nanoid } from "nanoid";

export const noteSchema = new mongoose.Schema({
  id: { type: String, default: () => nanoid(10), unique: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
}, { timestamps: true });

const noteModel = mongoose.model('Note', noteSchema);
export default noteModel;