import { getSourceCodes } from "@/lib/data";
import { ProductGrid } from "@/components/ProductGrid";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { items } = await getSourceCodes({ sort: "popular", limit: 20 });

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-gray-800/40">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(124,58,237,0.22),transparent)]" />
        <div className="relative mx-auto max-w-7xl px-6 py-14 text-center sm:py-18">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-xs font-semibold text-violet-300">
            <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
            Pay with Bakong KHQR — Instant Download
          </div>
          <h1 className="mt-5 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            <span className="bg-gradient-to-r from-white via-white to-gray-400 bg-clip-text text-transparent">
              RLS{" "}
            </span>
            <span className="text-violet-400">Store</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-400 sm:text-lg">
            Premium .rar source code files — web templates, FiveM resources &amp; more.
            Click Buy and pay instantly with Bakong KHQR.
          </p>
        </div>
      </section>

      {/* Products */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">All Products</h2>
          <span className="text-sm text-gray-500">{items.length} items</span>
        </div>
        <ProductGrid products={items} />
      </section>
    </div>
  );
}
