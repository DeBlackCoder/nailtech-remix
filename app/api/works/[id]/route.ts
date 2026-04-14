import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import RecentWork from "@/models/RecentWork";
export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try { await connectDB(); } catch { return NextResponse.json({ error: "Database connection failed" }, { status: 500 }); }
  try {
    const work = await RecentWork.findByIdAndDelete(id);
    if (!work) return NextResponse.json({ error: "Work not found" }, { status: 404 });
    return NextResponse.json({ message: "Work deleted" });
  } catch { return NextResponse.json({ error: "Internal server error" }, { status: 500 }); }
}
