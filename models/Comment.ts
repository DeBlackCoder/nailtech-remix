import mongoose, { Schema, Document } from "mongoose";
export interface IComment extends Document { name: string; message: string; rating?: number; createdAt: Date; }
const CommentSchema = new Schema<IComment>({
  name: { type: String, required: true }, message: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5 }, createdAt: { type: Date, default: Date.now },
});
export default mongoose.models.Comment || mongoose.model<IComment>("Comment", CommentSchema);
