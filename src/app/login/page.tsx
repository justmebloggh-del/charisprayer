import { login } from './actions';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Admin Login | Charis Prayer' };

const PARTICLES = [
  { x: "8%",  y: "20%", s: 5  }, { x: "88%", y: "12%", s: 7  },
  { x: "78%", y: "75%", s: 4  }, { x: "15%", y: "78%", s: 6  },
  { x: "55%", y: "8%",  s: 4  }, { x: "92%", y: "55%", s: 3  },
  { x: "35%", y: "92%", s: 5  }, { x: "65%", y: "5%",  s: 3  },
];

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="min-h-screen bg-[#04090f] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#04090f] via-[#0A1628] to-[#0e1d38]" />
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 20% 50%, rgba(201,162,39,0.10) 0%, transparent 55%), radial-gradient(ellipse at 80% 20%, rgba(123,47,190,0.07) 0%, transparent 50%)" }} />

      {/* Decorative rings */}
      <div className="absolute top-[-15%] right-[-8%] w-[500px] h-[500px] rounded-full border border-amber-400/6 pointer-events-none" />
      <div className="absolute top-[-8%] right-[-4%] w-[340px] h-[340px] rounded-full border border-amber-400/4 pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full border border-purple-500/5 pointer-events-none" />

      {/* Particles */}
      {PARTICLES.map((p, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-amber-400/60 pointer-events-none animate-float"
          style={{ left: p.x, top: p.y, width: p.s, height: p.s, animationDelay: `${i * 0.3}s` }}
        />
      ))}

      {/* Card */}
      <div className="relative z-10 w-full max-w-md animate-slide-up">
        {/* Ministry branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-400 text-[#0A1628] font-black text-2xl font-serif shadow-2xl shadow-amber-400/30 mb-5 animate-logo-glow">
            CP
          </div>
          <h1 className="text-white font-serif text-3xl font-bold mb-2">Charis Prayer</h1>
          <p className="text-amber-400 text-xs font-semibold tracking-[3px] uppercase">Ministry Admin Dashboard</p>
        </div>

        {/* Glass card */}
        <div className="bg-white/[0.04] backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-[0_40px_80px_rgba(0,0,0,0.5)]">
          <div className="mb-7">
            <h2 className="text-white text-xl font-bold mb-1.5">Welcome back</h2>
            <p className="text-white/40 text-sm">Sign in to manage the ministry platform</p>
          </div>

          {params?.error && (
            <div className="flex items-start gap-3 bg-red-900/25 border border-red-700/40 rounded-xl p-4 mb-6">
              <span className="text-red-400 mt-0.5">⚠️</span>
              <p className="text-red-400 text-sm">{params.error}</p>
            </div>
          )}

          <form action={login} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="admin@charisprayer.org"
                className="w-full bg-white/6 border border-white/12 rounded-xl px-4 py-3 text-white text-sm placeholder-white/25 outline-none focus:border-amber-400/60 focus:bg-white/8 transition-all"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="••••••••••"
                className="w-full bg-white/6 border border-white/12 rounded-xl px-4 py-3 text-white text-sm placeholder-white/25 outline-none focus:border-amber-400/60 focus:bg-white/8 transition-all"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-amber-500 to-yellow-400 text-[#0A1628] font-bold py-3.5 rounded-2xl text-sm tracking-wide hover:opacity-90 hover:-translate-y-0.5 transition-all shadow-lg shadow-amber-400/25 mt-2"
            >
              🔐 Sign In to Dashboard
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-white/6" />
            <span className="text-white/20 text-xs">Charis Prayer Ministry</span>
            <div className="flex-1 h-px bg-white/6" />
          </div>

          <a
            href="/"
            className="flex items-center justify-center gap-2 text-white/35 text-sm hover:text-white/60 transition-colors"
          >
            ← Return to ministry website
          </a>
        </div>

        {/* Security note */}
        <div className="flex items-center justify-center gap-2 mt-5">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <p className="text-white/25 text-xs">Secured by Supabase Auth · SSL Encrypted</p>
        </div>
      </div>
    </div>
  );
}
