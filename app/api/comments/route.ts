import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Comment from "@/models/Comment";
import { validateComment } from "@/lib/validations";
export async function GET() {
  try { await connectDB(); } catch { return NextResponse.json({ error: "Database connection failed" }, { status: 500 }); }
  try { const comments = await Comment.find({}).sort({ createdAt: -1 }); return NextResponse.json(comments); }
  catch { return NextResponse.json({ error: "Internal server error" }, { status: 500 }); }
}
export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Missing required fields: name, message" }, { status: 400 }); }
  const errors = validateComment(body);
  if (errors.length > 0) return NextResponse.json({ error: `Missing required fields: ${errors.map(e => e.replace("Missing required field: ", "")).join(", ")}` }, { status: 400 });
  try { await connectDB(); } catch { return NextResponse.json({ error: "Database connection failed" }, { status: 500 }); }
  try { const comment = await Comment.create(body); return NextResponse.json(comment, { status: 201 }); }
  catch { return NextResponse.json({ error: "Internal server error" }, { status: 500 }); }
}
