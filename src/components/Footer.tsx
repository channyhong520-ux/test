import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-white/[0.06] bg-gray-950">
      {/* Main footer */}
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-3">
              <img
                src="/images/brand-logo.jpg"
                alt="RLS Logo"
                className="h-10 w-10 rounded-xl object-cover shadow-lg shadow-violet-500/10"
              />
              <span className="text-lg font-bold tracking-tight">
                RLS<span className="text-violet-400"> Store</span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-gray-500">
              Premium source code files for web developers and FiveM creators. Instant download after payment via Bakong KHQR.
            </p>
            {/* Social links */}
            <div className="mt-5 flex gap-3">
              <a href="#" aria-label="Facebook" className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.06] text-gray-500 transition-colors hover:border-violet-500/30 hover:text-violet-400">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="#" aria-label="Telegram" className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.06] text-gray-500 transition-colors hover:border-violet-500/30 hover:text-violet-400">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
              </a>
              <a href="#" aria-label="YouTube" className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.06] text-gray-500 transition-colors hover:border-violet-500/30 hover:text-violet-400">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300">Products</h3>
            <ul className="mt-4 space-y-3">
              {[
                { label: "StoreWeb.rar", href: "/product/1" },
                { label: "FivemHud.rar", href: "/product/2" },
                { label: "FivemMinimap.rar", href: "/product/3" },
                { label: "FivemKhmerFlag.rar", href: "/product/4" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-500 transition-colors hover:text-violet-400">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300">Support</h3>
            <ul className="mt-4 space-y-3">
              {[
                { label: "How to Pay", href: "#" },
                { label: "Download Help", href: "#" },
                { label: "Contact Us", href: "#" },
                { label: "Refund Policy", href: "#" },
              ].map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-gray-500 transition-colors hover:text-violet-400">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Payment */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300">Payment</h3>
            <div className="mt-4 space-y-4">
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-700">
                    <span className="text-xs font-bold text-white">QR</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-200">Bakong KHQR</p>
                    <p className="text-xs text-gray-500">Scan &amp; Pay Instantly</p>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500">Supported banking apps:</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {["Bakong", "ABA", "ACLEDA", "Wing", "AMK", "BRED"].map((bank) => (
                    <span key={bank} className="rounded-md border border-white/[0.06] bg-white/[0.02] px-2 py-1 text-[11px] font-medium text-gray-400">
                      {bank}
                    </span>
                  ))}
                </div>
              </div>
              <p className="flex items-center gap-2 text-xs text-gray-500">
                <svg className="h-3.5 w-3.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Secure payment · USD &amp; KHR
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/[0.04]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-5 sm:flex-row">
          <p className="text-xs text-gray-600">
            &copy; {new Date().getFullYear()} RLS Store. All rights reserved.
          </p>
          <div className="flex items-center gap-5 text-xs text-gray-600">
            <a href="#" className="transition-colors hover:text-gray-400">Terms of Service</a>
            <span className="text-gray-800">·</span>
            <a href="#" className="transition-colors hover:text-gray-400">Privacy Policy</a>
            <span className="text-gray-800">·</span>
            <a href="#" className="transition-colors hover:text-gray-400">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
