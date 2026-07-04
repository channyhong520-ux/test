import { NextResponse } from "next/server";
import { db } from "@/db";
import { sourceCodes } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  const rows = await db.select({ id: sourceCodes.id, title: sourceCodes.title, fileUrl: sourceCodes.fileUrl, category: sourceCodes.category, price: sourceCodes.price, fileSize: sourceCodes.fileSize }).from(sourceCodes).orderBy(sourceCodes.id);

  return NextResponse.json(rows);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, title, fileUrl } = body as { id?: number; title?: string; fileUrl?: string };

    if (!id || !title || !fileUrl) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await db.update(sourceCodes).set({ title, fileUrl }).where(eq(sourceCodes.id, id));

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Failed to save" }, { status: 500 });
  }
}
