"use client";

import { useEffect, useState } from "react";

type Product = {
  id: number;
  title: string;
  fileUrl: string;
  category: string;
  price: string;
  fileSize: string;
};

export function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [status, setStatus] = useState("");
  const [savingId, setSavingId] = useState<number | null>(null);

  async function loadProducts() {
    const res = await fetch("/api/admin/products");
    if (res.ok) {
      const data = await res.json();
      setProducts(data);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  async function saveProduct(product: Product) {
    setSavingId(product.id);
    setStatus("");

    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: product.id,
          title: product.title,
          fileUrl: product.fileUrl,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update link");
      }

      setStatus(`Updated ${product.title}`);
      await loadProducts();
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSavingId(null);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <section className="rounded-3xl border border-white/[0.08] bg-gray-900/70 p-8 shadow-2xl shadow-black/20">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">Admin dashboard</p>
            <h1 className="mt-2 text-3xl font-bold text-white">Manage download links</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-400">
              Add or update each product’s download URL here. The links will be used for the purchase flow.
            </p>
          </div>
          <div className="rounded-xl border border-violet-500/30 bg-violet-500/10 px-4 py-3 text-sm text-violet-200">
            {products.length} entries ready
          </div>
        </div>

        {status ? (
          <div className="mt-6 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
            {status}
          </div>
        ) : null}

        <div className="mt-8 grid gap-4">
          {products.map((product) => (
            <div key={product.id} className="rounded-2xl border border-white/[0.06] bg-black/20 p-5">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Product #{product.id}</p>
                  <div className="mt-2 flex flex-col gap-3 md:flex-row md:items-center">
                    <input
                      value={product.title}
                      onChange={(e) =>
                        setProducts((prev) =>
                          prev.map((item) => (item.id === product.id ? { ...item, title: e.target.value } : item))
                        )
                      }
                      className="w-full rounded-xl border border-white/[0.08] bg-gray-950/80 px-4 py-3 text-sm text-white outline-none ring-0 md:max-w-xs"
                      placeholder="Product name"
                    />
                    <input
                      value={product.fileUrl}
                      onChange={(e) =>
                        setProducts((prev) =>
                          prev.map((item) => (item.id === product.id ? { ...item, fileUrl: e.target.value } : item))
                        )
                      }
                      className="w-full rounded-xl border border-white/[0.08] bg-gray-950/80 px-4 py-3 text-sm text-white outline-none ring-0"
                      placeholder="https://drive.google.com/..."
                    />
                  </div>
                </div>

                <button
                  onClick={() => saveProduct(product)}
                  disabled={savingId === product.id}
                  className="rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {savingId === product.id ? "Saving..." : "Save link"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
