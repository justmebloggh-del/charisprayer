import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A1628] to-[#1a2e50] flex items-center justify-center text-center px-6">
      <div>
        <div className="text-7xl mb-6">🙏</div>
        <h1 className="font-serif text-5xl font-bold text-white mb-4">Page Not Found</h1>
        <p className="text-white/50 mb-8 max-w-sm mx-auto">This page doesn't exist, but God's grace does. Let's get you back home.</p>
        <Link href="/" className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-400 text-[#0A1628] font-bold px-8 py-4 rounded-2xl hover:opacity-90 transition-opacity">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
