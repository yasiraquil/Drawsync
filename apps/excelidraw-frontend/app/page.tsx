"use client";
import React from "react";
import {
  Github,
  Heart,
  Share2,
  Lock,
  Sparkles,
  PenTool,
  Zap,
  Users,
  Globe,
  ArrowRight,
  Star,
} from "lucide-react";
import { useRouter } from "next/navigation";

function App() {
  const Router = useRouter();
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm bg-white/5 fixed w-full z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-xl">
              <PenTool className="h-6 w-6 text-white" />
            </div>
            <span className="ml-3 text-xl font-bold text-white">DrawSync</span>
          </div>
          <div className="flex items-center space-x-4">
            <a
              href="https://github.com/yasiraquil/Drawsync"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all duration-300"
            >
              <Github className="h-5 w-5" />
              <span className="hidden sm:inline">GitHub</span>
            </a>
            <button
              onClick={() => Router.push("/signin")}
              className="px-4 py-2 rounded-lg text-white hover:bg-white/10 transition-all duration-300"
            >
              Sign In
            </button>
            <button
              onClick={() => Router.push("/signup")}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:opacity-90 transition-all duration-300 font-medium"
            >
              Get Started
            </button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 mb-8">
              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
              <span className="text-sm text-blue-200">
                Real-time Collaborative Whiteboard
              </span>
            </div>

            <h1 className="text-5xl sm:text-7xl font-bold mb-6 leading-tight">
              <span className="text-white">Sketch ideas</span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                together, anywhere
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              DrawSync is a real-time collaborative whiteboard that lets your
              team sketch diagrams, brainstorm ideas, and plan projects with
              beautiful hand-drawn aesthetics.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <button
                onClick={() => Router.push("/signup")}
                className="group flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:-translate-y-1"
              >
                Start Drawing Free
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <a
                href="https://github.com/yasiraquil/Drawsync"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-300 px-6 py-4 rounded-xl border border-white/20 hover:bg-white/10 transition-all duration-300"
              >
                <Github className="h-5 w-5" />
                View on GitHub
              </a>
            </div>

            {/* Preview Window */}
            <div className="relative mx-auto max-w-5xl">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur-3xl opacity-20"></div>
              <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-2 shadow-2xl border border-white/10">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="ml-4 text-sm text-gray-400">
                    DrawSync Canvas
                  </span>
                </div>
                <div className="aspect-video bg-slate-950 rounded-b-xl flex items-center justify-center overflow-hidden">
                  <div className="grid grid-cols-3 gap-8 p-8">
                    <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-2 border-dashed border-blue-400/50 rounded-xl p-6 text-blue-300">
                      <PenTool className="h-8 w-8 mb-2" />
                      <span>Sketch</span>
                    </div>
                    <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-2 border-dashed border-purple-400/50 rounded-xl p-6 text-purple-300">
                      <Users className="h-8 w-8 mb-2" />
                      <span>Collaborate</span>
                    </div>
                    <div className="bg-gradient-to-br from-pink-500/20 to-orange-500/20 border-2 border-dashed border-pink-400/50 rounded-xl p-6 text-pink-300">
                      <Zap className="h-8 w-8 mb-2" />
                      <span>Create</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Everything you need to collaborate
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Powerful features designed for teams who want to think visually
              and work together seamlessly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 hover:border-blue-500/50 transition-all duration-300">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Share2 className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Real-time Collaboration
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Work together with your team in real-time. See cursors move,
                shapes appear, and ideas flow instantly across any distance.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 hover:border-purple-500/50 transition-all duration-300">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Lock className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Private & Secure Rooms
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Create password-protected rooms for sensitive projects. Your
                ideas stay secure with our authentication system.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 hover:border-pink-500/50 transition-all duration-300">
              <div className="bg-gradient-to-br from-pink-500 to-pink-600 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Sparkles className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Hand-drawn Aesthetics
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Create beautiful diagrams that look naturally hand-drawn.
                Perfect for presentations, documentation, and brainstorming.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="border-y border-white/10 bg-gradient-to-r from-blue-900/20 via-purple-900/20 to-pink-900/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                  ∞
                </div>
                <div className="text-gray-400">Unlimited Canvases</div>
              </div>
              <div className="text-center">
                <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                  Real-time
                </div>
                <div className="text-gray-400">Sync & Updates</div>
              </div>
              <div className="text-center">
                <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-pink-400 to-orange-400 bg-clip-text text-transparent mb-2">
                  100%
                </div>
                <div className="text-gray-400">Free & Open Source</div>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <Globe className="h-12 w-12 text-blue-400" />
                </div>
                <div className="text-gray-400">Works Everywhere</div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Ready to start collaborating?
            </h2>
            <p className="text-gray-400 mb-10 max-w-xl mx-auto">
              Join the community of creators, designers, and teams who use
              DrawSync to bring their ideas to life.
            </p>
            <button
              onClick={() => Router.push("/signup")}
              className="group inline-flex items-center gap-2 bg-white text-slate-900 px-8 py-4 rounded-xl text-lg font-semibold hover:shadow-2xl hover:shadow-white/25 transition-all duration-300 transform hover:-translate-y-1"
            >
              Get Started — It&apos;s Free
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <Heart className="h-4 w-4 text-red-500 fill-red-500" />
              <span className="text-gray-400">
                Made with love by{" "}
                <a
                  href="https://github.com/yasiraquil"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  @yasiraquil
                </a>
              </span>
            </div>
            <div className="flex items-center space-x-6">
              <a
                href="https://github.com/yasiraquil/Drawsync"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
              >
                <Github className="h-4 w-4" />
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
