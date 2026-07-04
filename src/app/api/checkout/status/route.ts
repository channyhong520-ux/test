import { getTransactionByMd5, markTransactionPaid, markTransactionExpired, getSourceCodeById, incrementSales } from "@/lib/data";
import { checkPaymentStatus } from "@/lib/bakong";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { md5 } = body;

    if (!md5) {
      return NextResponse.json({ error: "md5 is required" }, { status: 400 });
    }

    const transaction = await getTransactionByMd5(md5);
    if (!transaction) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    // If already paid, return immediately
    if (transaction.status === "PAID") {
      return Response.json({ paid: true, status: "PAID" });
    }

    // Check if QR has expired (15 minutes)
    const createdAt = new Date(transaction.createdAt);
    const now = new Date();
    const diffMs = now.getTime() - createdAt.getTime();
    const diffMins = diffMs / 1000 / 60;

    if (diffMins > 15) {
      await markTransactionExpired(md5);
      return Response.json({ paid: false, status: "EXPIRED" });
    }

    // Check with Bakong API
    const result = await checkPaymentStatus(md5);

    if (result.paid) {
      // Mark transaction as paid
      await markTransactionPaid(md5);

      // Increment sales on the product
      await incrementSales(transaction.productId);

      const product = await getSourceCodeById(transaction.productId);

      return Response.json({
        paid: true,
        status: "PAID",
        product,
        transaction,
      });
    }

    return Response.json({ paid: false, status: "UNPAID" });
  } catch (error) {
    console.error("Checkout status error:", error);
    return NextResponse.json(
      { error: "Failed to check payment status" },
      { status: 500 }
    );
  }
}
