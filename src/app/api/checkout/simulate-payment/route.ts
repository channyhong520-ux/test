import { getTransactionByMd5, markTransactionPaid, incrementSales, getSourceCodeById } from "@/lib/data";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// POST: Simulate a successful payment (for demo/testing)
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

    if (transaction.status === "PAID") {
      return Response.json({ success: true, message: "Already paid" });
    }

    // Mark as paid
    await markTransactionPaid(md5);
    await incrementSales(transaction.productId);

    const product = await getSourceCodeById(transaction.productId);

    return Response.json({
      success: true,
      message: "Payment simulated successfully",
      product,
    });
  } catch (error) {
    console.error("Simulate payment error:", error);
    return NextResponse.json(
      { error: "Failed to simulate payment" },
      { status: 500 }
    );
  }
}
