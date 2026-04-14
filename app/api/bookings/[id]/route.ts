import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Booking from "@/models/Booking";
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid request body" }, { status: 400 }); }
  try { await connectDB(); } catch { return NextResponse.json({ error: "Database connection failed" }, { status: 500 }); }
  try {
    const booking = await Booking.findByIdAndUpdate(id, { status: body.status }, { new: true });
    if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    return NextResponse.json(booking);
  } catch { return NextResponse.json({ error: "Internal server error" }, { status: 500 }); }
}
export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try { await connectDB(); } catch { return NextResponse.json({ error: "Database connection failed" }, { status: 500 }); }
  try {
    const booking = await Booking.findByIdAndDelete(id);
    if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    return NextResponse.json({ message: "Booking deleted" });
  } catch { return NextResponse.json({ error: "Internal server error" }, { status: 500 }); }
}
