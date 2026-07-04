import { getSourceCodeById, incrementSales } from "@/lib/data";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const PRODUCT_DOWNLOAD_URLS = {
  1: "https://drive.google.com/file/d/1mIMcWVtbFCUlPNo-dnxIyyQIrtM87ltO/view?usp=sharing",
  2: "https://drive.google.com/file/d/1TnMeNQZvxAgyPqmV5sAhxXn6wLdq9ZuI/view?usp=sharing",
} as const;

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

  const downloadUrl = PRODUCT_DOWNLOAD_URLS[product.id as keyof typeof PRODUCT_DOWNLOAD_URLS] ?? PRODUCT_DOWNLOAD_URLS[1];

  return Response.json({
    success: true,
    downloadUrl,
    message: `You've successfully purchased "${product.title}"!`,
  });
}
