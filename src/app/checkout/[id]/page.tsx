import { getSourceCodeById } from "@/lib/data";
import { notFound } from "next/navigation";
import { CheckoutClient } from "@/components/CheckoutClient";

export const dynamic = "force-dynamic";

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getSourceCodeById(Number(id));

  if (!product) {
    notFound();
  }

  return <CheckoutClient product={product} />;
}
