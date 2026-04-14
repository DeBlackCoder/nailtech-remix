import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Booking from "@/models/Booking";
import { validateBooking } from "@/lib/validations";
export async function GET() {
  try { await connectDB(); } catch { return NextResponse.json({ error: "Database connection failed" }, { status: 500 }); }
  try { const bookings = await Booking.find({}).sort({ createdAt: -1 }); return NextResponse.json(bookings); }
  catch { return NextResponse.json({ error: "Internal server error" }, { status: 500 }); }
}
export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Missing required fields: name, phone, service, date, time" }, { status: 400 }); }
  const errors = validateBooking(body);
  if (errors.length > 0) return NextResponse.json({ error: `Missing required fields: ${errors.map(e => e.replace("Missing required field: ", "")).join(", ")}` }, { status: 400 });
  try { await connectDB(); } catch { return NextResponse.json({ error: "Database connection failed" }, { status: 500 }); }
  try {
    const duplicate = await Booking.findOne({ service: body.service, date: body.date, time: body.time, status: { $ne: "completed" } });
    if (duplicate) return NextResponse.json({ error: "This time slot is already booked" }, { status: 409 });
    const booking = await Booking.create(body);
    return NextResponse.json(booking, { status: 201 });
  } catch { return NextResponse.json({ error: "Internal server error" }, { status: 500 }); }
}
