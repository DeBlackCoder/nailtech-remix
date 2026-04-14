import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import RecentWork from "@/models/RecentWork";
export async function GET() {
  try { await connectDB(); } catch { return NextResponse.json({ error: "Database connection failed" }, { status: 500 }); }
  try { const works = await RecentWork.find({}).sort({ createdAt: -1 }); return NextResponse.json(works); }
  catch { return NextResponse.json({ error: "Internal server error" }, { status: 500 }); }
}
export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid request body" }, { status: 400 }); }
  if (!body.title || !body.description || !body.imageUrl) return NextResponse.json({ error: "Missing required fields: title, description, imageUrl" }, { status: 400 });
  try { await connectDB(); } catch { return NextResponse.json({ error: "Database connection failed" }, { status: 500 }); }
  try { const work = await RecentWork.create(body); return NextResponse.json(work, { status: 201 }); }
  catch { return NextResponse.json({ error: "Internal server error" }, { status: 500 }); }
}
