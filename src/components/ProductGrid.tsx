import type { SourceCode } from "@/lib/data";
import Link from "next/link";

export function ProductGrid({ products }: { products: SourceCode[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
      {products.map((p) => (
        <div
          key={p.id}
          className="group flex flex-col overflow-hidden rounded-xl border border-gray-800 bg-gray-900 transition-all hover:border-violet-500/40 hover:shadow-lg hover:shadow-violet-900/10"
        >
          {/* Image */}
          <Link href={`/product/${p.id}`} className="relative block aspect-[4/3] overflow-hidden bg-gray-800">
            <img
              src={p.imageUrl}
              alt={p.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent" />
            <span className="absolute left-2 top-2 rounded-md bg-gray-950/80 px-1.5 py-0.5 text-[10px] font-medium text-gray-300 backdrop-blur-sm">
              {p.category}
            </span>
          </Link>

          {/* Info */}
          <div className="flex flex-1 flex-col justify-between p-3">
            <Link href={`/product/${p.id}`}>
              <h3 className="text-sm font-bold text-white leading-tight group-hover:text-violet-400 transition-colors truncate">
                {p.title}
              </h3>
            </Link>

            <div className="mt-1.5 flex items-center gap-1 text-[10px] text-gray-500">
              <span>{p.fileSize}</span>
              <span>·</span>
              <span>{p.sales} sold</span>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <span className="text-lg font-extrabold text-white">${p.price}</span>
              <Link
                href={`/checkout/${p.id}`}
                className="rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 px-3 py-1.5 text-xs font-semibold text-white transition-all hover:from-violet-500 hover:to-fuchsia-500"
              >
                Buy
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
