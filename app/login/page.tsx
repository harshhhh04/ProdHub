'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Cpu, Shield, ArrowRight, Github } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleOAuthLogin = async (provider: 'google' | 'github') => {
    setLoading(true);
    const supabase = createClient();
    if (supabase) {
      await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/`
        }
      });
    } else {
      // Demo fallback login
      setTimeout(() => {
        router.push('/');
      }, 500);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Subtle Gradient Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30" />

      <div className="w-full max-w-md bg-zinc-900/80 border border-zinc-800 rounded-2xl p-8 shadow-2xl relative z-10 space-y-6 text-center">
        <div className="flex flex-col items-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-2">
            <Cpu className="w-6 h-6" />
          </div>
          <h1 className="font-mono font-bold text-xl tracking-tight text-zinc-100">ENGINEERING OS</h1>
          <p className="text-xs text-zinc-400">
            Personal Operating System for Embedded Systems Engineers
          </p>
        </div>

        <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800/80 text-[11px] text-zinc-400 font-mono text-left space-y-1">
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <Shield className="w-3.5 h-3.5" />
            <span>AUTHENTICATION PROTOCOL</span>
          </div>
          <p>Multi-tenant Row Level Security enabled via Supabase Postgres.</p>
        </div>

        <div className="space-y-3">
          {/* Google Login */}
          <button
            onClick={() => handleOAuthLogin('google')}
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-100 text-xs font-semibold flex items-center justify-center gap-3 transition-all border border-zinc-700/50"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* GitHub Login */}
          <button
            onClick={() => handleOAuthLogin('github')}
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-100 text-xs font-semibold flex items-center justify-center gap-3 transition-all border border-zinc-700/50"
          >
            <Github className="w-4 h-4 text-zinc-200" />
            <span>Continue with GitHub</span>
          </button>

          {/* Quick Direct Launch */}
          <button
            onClick={() => router.push('/')}
            className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/10"
          >
            <span>Launch Personal OS Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <p className="text-[10px] text-zinc-500 font-mono">
          Engineering OS v1.0 • Dark Mode Default
        </p>
      </div>
    </div>
  );
}
