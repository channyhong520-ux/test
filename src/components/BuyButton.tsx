"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function BuyButton({
  productId,
  productTitle,
}: {
  productId: number;
  productTitle: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  function handleCheckout() {
    setLoading(true);
    router.push(`/checkout/${productId}`);
  }

  return (
    <div className="mt-6 space-y-3">
      <button
        onClick={handleCheckout}
        disabled={loading}
        className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 py-3 font-semibold text-white transition-all hover:from-purple-500 hover:to-pink-500 hover:shadow-lg hover:shadow-purple-500/25 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Redirecting...
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            Pay with KHQR
          </span>
        )}
      </button>

      <p className="text-center text-xs text-gray-500">
        Powered by{" "}
        <span className="font-semibold text-purple-400">Bakong KHQR</span>
        {" "}— scan & pay instantly
      </p>
    </div>
  );
}
