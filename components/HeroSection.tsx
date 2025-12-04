"use client";
import { Cloud, ArrowRight, Shield, Zap, Globe } from "lucide-react";
import Link from "next/link";

export default function DroplyHeroRedesign() {
  return (
    <div className="h-screen bg-gradient-to-b from-black via-black to-slate-950 text-white selection:bg-cyan-500/30 overflow-hidden font-sans relative">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        ></div>

        {/* Glowing Orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-cyan-500/15 rounded-full blur-[120px] animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-[120px] animate-pulse-slow delay-1000"></div>
      </div>

      <style jsx>{`
        @keyframes float-y {
          0%,
          100% {
            transform: translateY(0px) perspective(1000px) rotateX(5deg)
              rotateY(-5deg);
          }
          50% {
            transform: translateY(-20px) perspective(1000px) rotateX(5deg)
              rotateY(-5deg);
          }
        }
        @keyframes float-delayed {
          0%,
          100% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(-15px) translateX(5px);
          }
        }
        .perspective-container {
          perspective: 1000px;
        }
        .glass-card {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }
        .text-glow {
          text-shadow: 0 0 20px rgba(6, 182, 212, 0.5);
        }
        .animate-float-main {
          animation: float-y 6s ease-in-out infinite;
        }
        .animate-float-sub {
          animation: float-delayed 8s ease-in-out infinite;
        }
      `}</style>

      {/* Navigation */}
      <nav className="absolute top-0 w-full z-50 bg-transparent border-b border-transparent py-6">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <div className="w-10 h-10 bg-gradient-to-tr from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Cloud className="text-white" size={20} fill="currentColor" />
            </div>
            <span>Droply</span>
          </div>

          <div className="hidden md:flex gap-8 text-sm font-medium text-slate-400">
            <a href="#" className="hover:text-white transition-colors">
              Features
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Enterprise
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Pricing
            </a>
          </div>

          <div className="flex gap-4">
            <Link
              href="/sign-in"
              className="hidden sm:block px-5 py-2.5 text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/sign-up"
              className="px-5 py-2.5 text-sm font-medium bg-white text-slate-950 rounded-lg hover:bg-cyan-50 transition-all hover:scale-105 shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)]"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Content */}
      <section className="relative z-10 h-full flex items-center px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          {/* Text Content */}
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/30 border border-cyan-800/50 text-cyan-400 text-xs font-semibold mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              v2.0 is now live
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
              Infinite storage. <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 text-glow">
                Zero compromise.
              </span>
            </h1>

            <p className="text-lg text-slate-400 mb-10 leading-relaxed max-w-lg">
              Secure, lightning-fast cloud storage designed for modern teams.
              Sync your life across devices with end-to-end encryption built-in.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/sign-up"
                className="group px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl font-semibold text-white shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all hover:-translate-y-1 flex items-center justify-center gap-2"
              >
                Start Uploading
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
              <Link
                href="/demo"
                className="px-8 py-4 rounded-xl font-semibold text-white border border-white/10 hover:bg-white/5 transition-all flex items-center justify-center gap-2"
              >
                View Demo
              </Link>
            </div>

            <div className="mt-12 flex items-center gap-8 text-slate-500">
              <div className="flex items-center gap-2">
                <Shield size={18} className="text-cyan-500" />
                <span className="text-sm">AES-256 Encrypted</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap size={18} className="text-cyan-500" />
                <span className="text-sm">Lightning Sync</span>
              </div>
            </div>
          </div>

          {/* Visual Content (3D Cards) */}
          <div className="relative perspective-container hidden lg:block h-[500px]">
            {/* Decorative Background Glow for Cards */}
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 to-purple-500/10 rounded-full blur-3xl transform translate-y-10"></div>

            {/* Main Dashboard Card */}
            <div className="absolute top-10 left-10 right-0 h-[400px] glass-card rounded-2xl p-6 transform rotate-y-[-10deg] animate-float-main z-20">
              {/* Fake UI Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                </div>
                <div className="h-2 w-20 bg-white/10 rounded-full"></div>
              </div>

              {/* Fake UI Body */}
              <div className="grid grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="aspect-square rounded-xl bg-white/5 border border-white/5 flex flex-col items-center justify-center gap-3 hover:bg-white/10 transition-colors"
                  >
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        i === 0
                          ? "bg-blue-500/20 text-blue-400"
                          : i === 1
                            ? "bg-purple-500/20 text-purple-400"
                            : i === 2
                              ? "bg-orange-500/20 text-orange-400"
                              : "bg-slate-500/20 text-slate-400"
                      }`}
                    >
                      <Cloud size={20} />
                    </div>
                    <div className="h-1.5 w-12 bg-white/10 rounded-full"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating Element 1 (Storage Card) */}
            <div className="absolute -right-8 bottom-20 w-48 p-4 glass-card rounded-xl animate-float-sub z-30 bg-black/60">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-green-500/20 text-green-400">
                  <Shield size={18} />
                </div>
                <div>
                  <div className="text-xs text-slate-400">Security</div>
                  <div className="text-sm font-bold">Verified</div>
                </div>
              </div>
              <div className="h-1 w-full bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full w-[80%] bg-green-500"></div>
              </div>
            </div>

            {/* Floating Element 2 (Upload Status) */}
            <div
              className="absolute -left-8 top-32 w-56 p-4 glass-card rounded-xl animate-float-sub z-30 bg-black/60"
              style={{ animationDelay: "1s" }}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-slate-400">Syncing files...</span>
                <span className="text-xs text-cyan-400">84%</span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-blue-500/20 flex items-center justify-center text-blue-400">
                    <Globe size={14} />
                  </div>
                  <div className="flex-1">
                    <div className="h-1.5 w-20 bg-white/20 rounded-full mb-1"></div>
                    <div className="h-1 w-12 bg-white/10 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
