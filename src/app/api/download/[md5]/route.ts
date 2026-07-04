import { getTransactionByMd5, getSourceCodeById } from "@/lib/data";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const PRODUCT_DOWNLOAD_URLS = {
  1: "https://drive.google.com/file/d/1mIMcWVtbFCUlPNo-dnxIyyQIrtM87ltO/view?usp=sharing",
  2: "https://drive.google.com/file/d/1TnMeNQZvxAgyPqmV5sAhxXn6wLdq9ZuI/view?usp=sharing",
} as const;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ md5: string }> }
) {
  const { md5 } = await params;

  // 1. Find the transaction
  const transaction = await getTransactionByMd5(md5);
  if (!transaction) {
    return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
  }

  // 2. Verify payment
  if (transaction.status !== "PAID") {
    return NextResponse.json({ error: "Payment not completed" }, { status: 403 });
  }

  // 3. Get the product
  const product = await getSourceCodeById(transaction.productId);
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  // 4. Redirect to the correct Google Drive link for the product
  const downloadUrl = PRODUCT_DOWNLOAD_URLS[product.id as keyof typeof PRODUCT_DOWNLOAD_URLS] ?? PRODUCT_DOWNLOAD_URLS[1];
  return NextResponse.redirect(downloadUrl);
}
