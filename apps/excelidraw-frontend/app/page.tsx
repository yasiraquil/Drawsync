"use client";
import React from "react";
import {
  Github,
  ArrowRight,
  Users,
  Zap,
  Shield,
  Palette,
  MousePointer2,
  Layers,
} from "lucide-react";
import { useRouter } from "next/navigation";

function App() {
  const Router = useRouter();
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="fixed w-full z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5">
        <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                className="w-5 h-5 text-black"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 19l7-7 3 3-7 7-3-3z" />
                <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
                <path d="M2 2l7.586 7.586" />
              </svg>
            </div>
            <span className="font-semibold text-lg">DrawSync</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm text-gray-400">
            <a href="#features" className="hover:text-white transition-colors">
              Features
            </a>
            <a
              href="https://github.com/yasiraquil/Drawsync"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors flex items-center gap-1.5"
            >
              <Github className="w-4 h-4" />
              GitHub
            </a>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => Router.push("/signin")}
              className="text-sm text-gray-400 hover:text-white transition-colors px-4 py-2"
            >
              Sign in
            </button>
            <button
              onClick={() => Router.push("/signup")}
              className="text-sm bg-white text-black px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Get Started
            </button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="pt-32 pb-20">
        <div className="max-w-6xl mx-auto px-6">
          {/* Hero */}
          <div className="text-center max-w-3xl mx-auto mb-20">


            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-[1.1]">
              Collaborative
              <br />
              <span className="text-gray-500">whiteboard for teams</span>
            </h1>

            <p className="text-lg text-gray-400 max-w-xl mx-auto mb-10 leading-relaxed">
              Sketch diagrams, brainstorm ideas, and plan projects together in
              real-time. Beautiful hand-drawn style that feels natural.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => Router.push("/signup")}
                className="group flex items-center gap-2 bg-white text-black px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-all"
              >
                Start drawing
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
              <a
                href="https://github.com/yasiraquil/Drawsync"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-400 hover:text-white px-6 py-3 rounded-lg border border-white/10 hover:border-white/20 transition-all"
              >
                <Github className="w-4 h-4" />
                View source
              </a>
            </div>
          </div>

          {/* Canvas Preview */}
          <div className="relative max-w-4xl mx-auto mb-32">
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent z-10 pointer-events-none"></div>
            <div className="bg-[#121212] rounded-xl border border-white/10 overflow-hidden shadow-2xl">
              {/* Window chrome */}
              <div className="flex items-center gap-2 px-4 py-3 bg-[#1a1a1a] border-b border-white/5">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f57]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#febc2e]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#28c840]"></div>
                </div>
                <div className="flex-1 text-center text-xs text-gray-500">
                  DrawSync Canvas
                </div>
              </div>
              {/* Canvas content */}
              <div className="aspect-[16/9] bg-[#0d0d0d] p-8 flex items-center justify-center">
                <div className="grid grid-cols-3 gap-6 text-center">
                  <div className="p-6 rounded-xl border-2 border-dashed border-gray-700 bg-gray-800/30">
                    <div className="w-12 h-12 bg-gray-700 rounded-lg mx-auto mb-3 flex items-center justify-center">
                      <MousePointer2 className="w-6 h-6 text-gray-400" />
                    </div>
                    <span className="text-sm text-gray-400">Draw shapes</span>
                  </div>
                  <div className="p-6 rounded-xl border-2 border-dashed border-gray-700 bg-gray-800/30">
                    <div className="w-12 h-12 bg-gray-700 rounded-lg mx-auto mb-3 flex items-center justify-center">
                      <Users className="w-6 h-6 text-gray-400" />
                    </div>
                    <span className="text-sm text-gray-400">
                      Collaborate live
                    </span>
                  </div>
                  <div className="p-6 rounded-xl border-2 border-dashed border-gray-700 bg-gray-800/30">
                    <div className="w-12 h-12 bg-gray-700 rounded-lg mx-auto mb-3 flex items-center justify-center">
                      <Layers className="w-6 h-6 text-gray-400" />
                    </div>
                    <span className="text-sm text-gray-400">
                      Organize rooms
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Features */}
          <section id="features" className="mb-32">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Built for collaboration
              </h2>
              <p className="text-gray-400 max-w-lg mx-auto">
                Everything you need to bring your team&apos;s ideas to life,
                from quick sketches to detailed diagrams.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-px bg-white/5 rounded-2xl overflow-hidden">
              {/* Real-time sync */}
              <div className="bg-[#0a0a0a] p-10">
                <Zap className="w-8 h-8 text-white mb-6" />
                <h3 className="text-xl font-semibold mb-3">Real-time sync</h3>
                <p className="text-gray-400 leading-relaxed">
                  See changes instantly as your team draws together. Every stroke syncs across all participants with zero delay.
                </p>
              </div>

              {/* Private rooms */}
              <div className="bg-[#0a0a0a] p-10">
                <Shield className="w-8 h-8 text-white mb-6" />
                <h3 className="text-xl font-semibold mb-3">Private rooms</h3>
                <p className="text-gray-400 leading-relaxed">
                  Create password-protected rooms for sensitive brainstorming sessions. Your ideas stay secure.
                </p>
              </div>

              {/* Hand-drawn style */}
              <div className="bg-[#0a0a0a] p-10">
                <Palette className="w-8 h-8 text-white mb-6" />
                <h3 className="text-xl font-semibold mb-3">Hand-drawn style</h3>
                <p className="text-gray-400 leading-relaxed">
                  Beautiful sketchy aesthetics that make diagrams feel natural and approachable.
                </p>
              </div>

              {/* Team presence */}
              <div className="bg-[#0a0a0a] p-10">
                <Users className="w-8 h-8 text-white mb-6" />
                <h3 className="text-xl font-semibold mb-3">Team presence</h3>
                <p className="text-gray-400 leading-relaxed">
                  See who&apos;s in your room and what they&apos;re working on in real-time.
                </p>
              </div>

              {/* Infinite canvas */}
              <div className="bg-[#0a0a0a] p-10">
                <Layers className="w-8 h-8 text-white mb-6" />
                <h3 className="text-xl font-semibold mb-3">Infinite canvas</h3>
                <p className="text-gray-400 leading-relaxed">
                  No limits on space. Zoom, pan, and organize your ideas freely.
                </p>
              </div>

              {/* Keyboard shortcuts */}
              <div className="bg-[#0a0a0a] p-10">
                <MousePointer2 className="w-8 h-8 text-white mb-6" />
                <h3 className="text-xl font-semibold mb-3">Keyboard shortcuts</h3>
                <p className="text-gray-400 leading-relaxed">
                  Speed up your workflow with intuitive keyboard shortcuts and quick actions.
                </p>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="text-center py-16 border-t border-white/5">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to start?
            </h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              Create your first room and start collaborating with your team in
              seconds.
            </p>
            <button
              onClick={() => Router.push("/signup")}
              className="bg-white text-black px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Get started for free
            </button>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-white rounded flex items-center justify-center">
                <svg
                  viewBox="0 0 24 24"
                  className="w-4 h-4 text-black"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 19l7-7 3 3-7 7-3-3z" />
                  <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
                </svg>
              </div>
              <span>DrawSync</span>
            </div>

            <div className="flex items-center gap-6">
              <a
                href="/terms"
                className="hover:text-white transition-colors"
              >
                Terms & Conditions
              </a>
              <a
                href="/privacy"
                className="hover:text-white transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="https://github.com/yasiraquil/Drawsync"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors flex items-center gap-1.5"
              >
                <Github className="w-4 h-4" />
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
