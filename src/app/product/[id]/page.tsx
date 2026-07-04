import { getSourceCodeById } from "@/lib/data";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/ProductDetail";

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getSourceCodeById(Number(id));

  if (!product) {
    notFound();
  }

  return <ProductDetail product={product} />;
}
