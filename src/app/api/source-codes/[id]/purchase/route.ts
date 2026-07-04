import { getSourceCodeById, incrementSales } from "@/lib/data";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const GOOGLE_DRIVE_DOWNLOAD_URL =
  "https://drive.google.com/file/d/1mIMcWVtbFCUlPNo-dnxIyyQIrtM87ltO/view?usp=sharing";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const product = await getSourceCodeById(Number(id));

  if (!product) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Simulate purchase - increment sales counter
  await incrementSales(Number(id));

  return Response.json({
    success: true,
    downloadUrl: GOOGLE_DRIVE_DOWNLOAD_URL,
    message: `You've successfully purchased "${product.title}"!`,
  });
}
