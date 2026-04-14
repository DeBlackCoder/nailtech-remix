import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Comment from "@/models/Comment";
export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try { await connectDB(); } catch { return NextResponse.json({ error: "Database connection failed" }, { status: 500 }); }
  try {
    const comment = await Comment.findByIdAndDelete(id);
    if (!comment) return NextResponse.json({ error: "Review not found" }, { status: 404 });
    return NextResponse.json({ message: "Review deleted" });
  } catch { return NextResponse.json({ error: "Internal server error" }, { status: 500 }); }
}
