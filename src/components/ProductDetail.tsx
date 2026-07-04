import type { SourceCode } from "@/lib/data";
import Link from "next/link";

export function ProductDetail({ product }: { product: SourceCode }) {
  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center gap-2 text-sm text-gray-500">
        <Link href="/" className="hover:text-violet-400 transition-colors">Home</Link>
        <span>/</span>
        <span className="text-gray-200 truncate">{product.title}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-5">
        {/* Image */}
        <div className="lg:col-span-3">
          <div className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-900">
            <img src={product.imageUrl} alt={product.title} className="w-full object-cover aspect-video" />
          </div>

          <div className="mt-8">
            <h2 className="text-lg font-semibold text-white">Description</h2>
            <p className="mt-3 leading-relaxed text-gray-400">{product.description}</p>
          </div>

          {/* Details grid */}
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "File Name", value: product.title },
              { label: "Size", value: product.fileSize },
              { label: "Category", value: product.category },
              { label: "Sales", value: String(product.sales) },
            ].map((d) => (
              <div key={d.label} className="rounded-xl border border-gray-800 bg-gray-900 p-3 text-center">
                <p className="text-xs text-gray-500">{d.label}</p>
                <p className="mt-0.5 text-sm font-semibold text-white truncate">{d.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-2">
          <div className="sticky top-24 rounded-2xl border border-gray-800 bg-gray-900 p-6">
            <span className="inline-block rounded-lg bg-violet-600/20 px-3 py-1 text-xs font-medium text-violet-400">
              {product.category}
            </span>
            <h1 className="mt-3 text-xl font-bold text-white">{product.title}</h1>

            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-3xl font-extrabold text-white">${product.price}</span>
              <span className="text-sm text-gray-500">USD</span>
            </div>

            <div className="mt-2 flex items-center gap-1 text-sm text-gray-500">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              {product.sales} purchases
            </div>

            {/* Buy Now */}
            <div className="mt-6">
              <Link
                href={`/checkout/${product.id}`}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 py-3.5 font-bold text-white shadow-lg shadow-violet-600/20 transition-all hover:from-violet-500 hover:to-fuchsia-500 hover:shadow-violet-500/30"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                Buy Now — ${product.price}
              </Link>
            </div>

            <p className="mt-4 text-center text-xs text-gray-500">
              Pay instantly with <span className="font-semibold text-violet-400">Bakong KHQR</span>
            </p>

            <div className="mt-6 space-y-2.5 border-t border-gray-800 pt-5">
              {[
                "Complete source code (.rar archive)",
                "Instant download after payment",
                "Well-documented code",
                "Easy to customize & deploy",
              ].map((f) => (
                <div key={f} className="flex items-center gap-2.5 text-sm text-gray-400">
                  <svg className="h-4 w-4 flex-shrink-0 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {f}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
