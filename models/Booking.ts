import mongoose, { Schema, Document } from "mongoose";
export interface IBooking extends Document {
  name: string; phone: string; service: string; date: string; time: string; notes?: string; status: "pending" | "completed";
}
const BookingSchema = new Schema<IBooking>({
  name: { type: String, required: true }, phone: { type: String, required: true },
  service: { type: String, required: true, enum: ["Acrylic", "Gel", "Pedicure", "Nail Art"] },
  date: { type: String, required: true }, time: { type: String, required: true },
  notes: { type: String }, status: { type: String, enum: ["pending", "completed"], default: "pending" },
}, { timestamps: true });
export default mongoose.models.Booking || mongoose.model<IBooking>("Booking", BookingSchema);
