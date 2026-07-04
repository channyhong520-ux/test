"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { SourceCode } from "@/lib/data";
import Link from "next/link";

type CheckoutStep = "loading" | "qr" | "paid" | "expired" | "error";

export function CheckoutClient({ product }: { product: SourceCode }) {
  const [step, setStep] = useState<CheckoutStep>("loading");
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [md5, setMd5] = useState("");
  const [deeplink, setDeeplink] = useState("");
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState(900);
  const [downloading, setDownloading] = useState(false);
  const hasTriggeredDownload = useRef(false);

  useEffect(() => {
    generateQR();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-download when step becomes "paid"
  useEffect(() => {
    if (step === "paid" && md5 && !hasTriggeredDownload.current) {
      hasTriggeredDownload.current = true;
      triggerDownload();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, md5]);

  function triggerDownload() {
    setDownloading(true);
    const link = document.createElement("a");
    link.href = `/api/download/${md5}`;
    link.download = product.title;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => setDownloading(false), 2000);
  }

  async function generateQR() {
    setStep("loading");
    setError("");
    setTimeLeft(900);
    hasTriggeredDownload.current = false;

    try {
      const res = await fetch("/api/checkout/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id, currency: "USD" }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to generate QR");
      }

      const data = await res.json();
      setQrDataUrl(data.qrDataUrl);
      setMd5(data.md5);
      setDeeplink(data.deeplink);
      setStep("qr");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setStep("error");
    }
  }

  const checkPayment = useCallback(async () => {
    if (!md5) return;
    try {
      const res = await fetch("/api/checkout/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ md5 }),
      });
      const data = await res.json();
      if (data.status === "PAID") {
        setStep("paid");
      } else if (data.status === "EXPIRED") {
        setStep("expired");
      }
    } catch {
      /* silently retry */
    }
  }, [md5]);

  useEffect(() => {
    if (step !== "qr" || !md5) return;

    const pollTimer = setInterval(checkPayment, 3000);
    const countdownTimer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setStep("expired");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(pollTimer);
      clearInterval(countdownTimer);
    };
  }, [step, md5, checkPayment]);

  async function simulatePayment() {
    try {
      const res = await fetch("/api/checkout/simulate-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ md5 }),
      });
      if (res.ok) setStep("paid");
    } catch {
      setError("Failed to simulate payment");
    }
  }

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <div className="mx-auto max-w-lg px-6 py-12">
      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center gap-2 text-sm text-gray-500">
        <Link href="/" className="hover:text-violet-400 transition-colors">Home</Link>
        <span>/</span>
        <Link href={`/product/${product.id}`} className="hover:text-violet-400 transition-colors truncate max-w-[180px]">{product.title}</Link>
        <span>/</span>
        <span className="text-gray-200">Checkout</span>
      </nav>

      {/* ── Loading ── */}
      {step === "loading" && (
        <div className="flex flex-col items-center py-24">
          <div className="h-14 w-14 animate-spin rounded-full border-4 border-gray-700 border-t-violet-500" />
          <p className="mt-6 text-lg text-gray-400">Generating KHQR code...</p>
        </div>
      )}

      {/* ── Error ── */}
      {step === "error" && (
        <div className="rounded-2xl border border-red-800/50 bg-red-950/30 p-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-900/40">
            <svg className="h-8 w-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="mt-4 text-xl font-bold text-red-400">Error</h2>
          <p className="mt-2 text-gray-400">{error}</p>
          <button onClick={generateQR} className="mt-6 rounded-xl bg-violet-600 px-6 py-3 font-semibold text-white hover:bg-violet-500">
            Try Again
          </button>
        </div>
      )}

      {/* ── QR Code ── */}
      {step === "qr" && (
        <div className="space-y-6">
          <div className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-900">
            <div className="bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 py-4 text-center">
              <h1 className="text-xl font-bold text-white">Scan to Pay</h1>
              <p className="mt-1 text-sm text-violet-100/80">
                Use Bakong or any partner bank app
              </p>
            </div>

            <div className="p-6">
              {/* Product info */}
              <div className="flex items-center gap-4 rounded-xl border border-gray-800 bg-gray-800/40 p-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-violet-600/20 text-xl">
                  📦
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-white text-sm">{product.title}</p>
                  <p className="text-xs text-gray-500">{product.category} · {product.fileSize}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xl font-bold text-white">${product.price}</p>
                  <p className="text-xs text-violet-400">USD</p>
                </div>
              </div>

              {/* QR */}
              <div className="mt-6 flex justify-center">
                <div className="rounded-2xl bg-white p-3 shadow-2xl shadow-black/30">
                  {qrDataUrl ? (
                    <img src={qrDataUrl} alt="KHQR Payment Code" className="h-64 w-64" />
                  ) : (
                    <div className="flex h-64 w-64 items-center justify-center">
                      <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-violet-500" />
                    </div>
                  )}
                </div>
              </div>

              {/* Merchant info */}
              <div className="mt-4 text-center text-xs text-gray-500">
                Paying to: <span className="text-gray-300">Coffee NT26</span> · sokpheng_phoeurn@bkrt
              </div>

              {/* Status + Timer */}
              <div className="mt-5 flex flex-col items-center gap-1.5">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
                  </span>
                  <span className="text-xs font-medium uppercase tracking-wider text-green-400">
                    Waiting for payment
                  </span>
                </div>
                <div className={`font-mono text-2xl font-bold ${timeLeft < 60 ? "text-red-400" : "text-gray-200"}`}>
                  {formatTime(timeLeft)}
                </div>
              </div>

              {/* Deeplink */}
              {deeplink && (
                <a
                  href={deeplink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 py-3 font-semibold text-white"
                >
                  📱 Open in Bakong App
                </a>
              )}

              {/* Simulate */}
              <div className="mt-6 border-t border-gray-800 pt-5">
                <button
                  onClick={simulatePayment}
                  className="w-full rounded-xl border border-dashed border-gray-700 bg-gray-800/40 py-3 text-sm text-gray-500 transition-colors hover:border-green-600 hover:text-green-400"
                >
                  ⚡ Simulate Successful Payment (Demo)
                </button>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
            <h3 className="font-semibold text-white">How to pay with Bakong KHQR</h3>
            <ol className="mt-4 space-y-3 text-sm text-gray-400">
              {[
                "Open Bakong app or any partner bank (ABA, ACLEDA, Wing, etc.)",
                "Tap Scan / QR Pay and scan the code above",
                <>Confirm payment of <strong className="text-white">${product.price} USD</strong></>,
                <>Your file <strong className="text-white">{product.title}</strong> will download automatically</>,
              ].map((text, i) => (
                <li key={i} className="flex gap-3">
                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-violet-600/20 text-xs font-bold text-violet-400">
                    {i + 1}
                  </span>
                  <span>{text}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}

      {/* ── Paid — auto download triggered ── */}
      {step === "paid" && (
        <div className="rounded-2xl border border-green-700/50 bg-green-950/30 p-10 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-900/40">
            <svg className="h-10 w-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-green-400">Payment Successful! 🎉</h2>
          <p className="mt-3 text-gray-400">
            Thank you for purchasing <strong className="text-white">{product.title}</strong>
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Amount paid: <span className="font-semibold text-white">${product.price} USD</span>
          </p>

          {/* Download status */}
          <div className="mt-6 rounded-xl border border-green-800/50 bg-green-950/40 p-4">
            {downloading ? (
              <div className="flex items-center justify-center gap-3 text-green-400">
                <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span className="font-semibold">Downloading {product.title}...</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-2 text-green-400">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span className="font-semibold">Download started automatically!</span>
                </div>
                <p className="text-xs text-gray-500">
                  Didn&apos;t start?{" "}
                  <button
                    onClick={triggerDownload}
                    className="text-violet-400 underline underline-offset-2 hover:text-violet-300"
                  >
                    Click here to download again
                  </button>
                </p>
              </div>
            )}
          </div>

          <div className="mt-8">
            <Link
              href="/"
              className="rounded-xl bg-violet-600 px-8 py-3 font-semibold text-white hover:bg-violet-500"
            >
              Back to Home
            </Link>
          </div>
        </div>
      )}

      {/* ── Expired ── */}
      {step === "expired" && (
        <div className="rounded-2xl border border-yellow-700/50 bg-yellow-950/30 p-10 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-yellow-900/40">
            <svg className="h-10 w-10 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-yellow-400">QR Code Expired</h2>
          <p className="mt-3 text-gray-400">The payment window has expired.</p>
          <button
            onClick={generateQR}
            className="mt-6 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-8 py-3 font-semibold text-white"
          >
            Generate New QR Code
          </button>
        </div>
      )}
    </div>
  );
}
