import { getSourceCodeById, createTransaction } from "@/lib/data";
import { generateKHQR } from "@/lib/bakong";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { productId, currency = "USD" } = body;

    if (!productId) {
      return NextResponse.json(
        { error: "productId is required" },
        { status: 400 }
      );
    }

    const product = await getSourceCodeById(Number(productId));
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const amount = Number(product.price);
    const billNumber = `SC-${Date.now()}-${productId}`;

    const { qrString, md5, deeplink, qrDataUrl } = await generateKHQR({
      amount,
      currency: currency as "USD" | "KHR",
      billNumber,
      productTitle: product.title,
    });

    // Store transaction in DB
    const transaction = await createTransaction({
      productId: Number(productId),
      amount: String(product.price),
      currency,
      md5,
      qrString,
      deeplink,
    });

    return Response.json({
      transactionId: transaction.id,
      qrDataUrl,
      md5,
      deeplink,
      amount: product.price,
      currency,
      productTitle: product.title,
      productId: product.id,
    });
  } catch (error) {
    console.error("Checkout generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate payment QR" },
      { status: 500 }
    );
  }
}
