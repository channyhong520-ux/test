import { getTransactionByMd5, getSourceCodeById } from "@/lib/data";
import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";

export const dynamic = "force-dynamic";

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

  // 4. Read the file
  const fileName = product.fileUrl.replace(/^\/files\//, "");
  const filePath = join(process.cwd(), "public", "files", fileName);

  try {
    const fileBuffer = await readFile(filePath);

    return new Response(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/x-rar-compressed",
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Content-Length": String(fileBuffer.length),
      },
    });
  } catch {
    return NextResponse.json({ error: "File not found on server" }, { status: 404 });
  }
}
