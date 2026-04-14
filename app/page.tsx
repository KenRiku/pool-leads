import Link from "next/link"
import { Waves, CheckCircle, Star, ArrowRight, MapPin, Brain, Mail, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-slate-700/50 bg-slate-900/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="relative">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/25">
                  <Waves className="w-4 h-4 text-white" />
                </div>
                <div className="absolute inset-0 rounded-lg bg-cyan-400/20 blur-sm group-hover:blur-md transition-all" />
              </div>
              <span className="font-bold text-lg tracking-tight">
                <span className="text-white">Pool</span>
                <span className="text-cyan-400"> Leads</span>
              </span>
            </Link>
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" size="sm">Sign In</Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-sm font-medium mb-6">
            <Star className="w-3.5 h-3.5" />
            AI-Powered Lead Generation
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
            Stop Buying{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Shared Leads
            </span>
          </h1>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto mb-10">
            Pool Leads delivers exclusive, AI-analyzed homeowner leads in your service area. Know which properties have the perfect backyard before you even knock on the door.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup">
              <Button size="lg" className="w-full sm:w-auto gap-2">
                Start Free Trial <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Sign in to Dashboard
              </Button>
            </Link>
          </div>
          <p className="text-slate-500 text-sm mt-4">No credit card required · 14-day free trial</p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-y border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-cyan-400 mb-2">3.2x</div>
              <div className="text-slate-400">Higher close rate vs. shared leads</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-cyan-400 mb-2">10k+</div>
              <div className="text-slate-400">Qualified leads generated monthly</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-cyan-400 mb-2">$48k</div>
              <div className="text-slate-400">Average pool project value</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-slate-100 mb-4">Everything you need to close more pools</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Our platform combines satellite analysis, homeowner data, and AI to surface the best opportunities in your market.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-xl border border-slate-700/50 bg-slate-800/40 backdrop-blur-sm p-6 shadow-lg">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-100 mb-2">Geo-Targeted Leads</h3>
              <p className="text-slate-400 text-sm">Set your service zip codes and receive leads exclusively in your area. No competing with other builders for the same prospects.</p>
            </div>
            <div className="rounded-xl border border-slate-700/50 bg-slate-800/40 backdrop-blur-sm p-6 shadow-lg">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-100 mb-2">AI Pool Renderings</h3>
              <p className="text-slate-400 text-sm">Generate personalized pool renderings for each property using satellite data and AI. Give homeowners a vision before the first meeting.</p>
            </div>
            <div className="rounded-xl border border-slate-700/50 bg-slate-800/40 backdrop-blur-sm p-6 shadow-lg">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-4">
                <Mail className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-100 mb-2">Direct Mail Postcards</h3>
              <p className="text-slate-400 text-sm">Send personalized postcards with pool renderings directly to homeowners. Our print-and-mail fulfillment handles everything automatically.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-slate-100 mb-4">Up and running in minutes</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Three simple steps to start getting exclusive pool leads delivered to your dashboard.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Set Your Service Area", desc: "Enter your zip codes and we instantly identify every eligible property in your territory." },
              { step: "02", title: "Review Scored Leads", desc: "Each lead is pre-scored for pool potential based on lot size, sun exposure, home value, and more." },
              { step: "03", title: "Reach Out & Close", desc: "Send AI-generated postcards or call directly. Track every touchpoint in your pipeline dashboard." },
            ].map(({ step, title, desc }) => (
              <div key={step} className="flex gap-5">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-cyan-500/25">
                  {step}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-100 mb-2">{title}</h3>
                  <p className="text-slate-400 text-sm">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-slate-100 mb-4">Trusted by pool builders nationwide</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="rounded-xl border border-slate-700/50 bg-slate-800/40 p-6 shadow-lg">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-cyan-400 fill-cyan-400" />
                ))}
              </div>
              <p className="text-slate-300 mb-4 text-sm leading-relaxed">
                "Pool Leads completely changed how we find customers. We went from spending $8k/month on shared lead services to $699/month for exclusive leads that actually convert. Closed 6 pools in our first 60 days."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm">M</div>
                <div>
                  <div className="text-sm font-semibold text-slate-200">Marcus T.</div>
                  <div className="text-xs text-slate-500">AquaBlue Pools, Phoenix AZ</div>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-slate-700/50 bg-slate-800/40 p-6 shadow-lg">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-cyan-400 fill-cyan-400" />
                ))}
              </div>
              <p className="text-slate-300 mb-4 text-sm leading-relaxed">
                "The AI rendering feature is a game-changer. I send a postcard with a rendering of THEIR backyard and the close rate is incredible. Homeowners call ME before I even reach out."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold text-sm">S</div>
                <div>
                  <div className="text-sm font-semibold text-slate-200">Sarah K.</div>
                  <div className="text-xs text-slate-500">Lone Star Pools, Dallas TX</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-slate-100 mb-4">Simple, transparent pricing</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">All plans include exclusive leads. No shared databases, no bidding wars.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Starter */}
            <div className="rounded-xl border border-slate-700/50 bg-slate-800/40 p-6 shadow-lg flex flex-col">
              <div className="mb-6">
                <div className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-2">Starter</div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-slate-100">$299</span>
                  <span className="text-slate-400">/mo</span>
                </div>
                <p className="text-slate-500 text-sm mt-2">Perfect for builders just getting started with exclusive leads.</p>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {["Up to 3 zip codes", "50 leads/month", "Pipeline dashboard", "Email support"].map(feature => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-slate-300">
                    <CheckCircle className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link href="/signup">
                <Button variant="outline" className="w-full">Get Started</Button>
              </Link>
            </div>

            {/* Pro - highlighted */}
            <div className="rounded-xl border-2 border-cyan-500/50 bg-slate-800/60 p-6 shadow-xl shadow-cyan-500/10 flex flex-col relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="px-3 py-1 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold">MOST POPULAR</span>
              </div>
              <div className="mb-6">
                <div className="text-sm font-medium text-cyan-400 uppercase tracking-wider mb-2">Pro</div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-slate-100">$699</span>
                  <span className="text-slate-400">/mo</span>
                </div>
                <p className="text-slate-400 text-sm mt-2">For growing builders who want AI-powered outreach.</p>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {["Up to 10 zip codes", "200 leads/month", "AI pool renderings", "Direct mail postcards", "Pipeline dashboard", "Priority support"].map(feature => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-slate-300">
                    <CheckCircle className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link href="/signup">
                <Button className="w-full">Get Started</Button>
              </Link>
            </div>

            {/* Premium */}
            <div className="rounded-xl border border-slate-700/50 bg-slate-800/40 p-6 shadow-lg flex flex-col">
              <div className="mb-6">
                <div className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-2">Premium</div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-slate-100">$1,499</span>
                  <span className="text-slate-400">/mo</span>
                </div>
                <p className="text-slate-500 text-sm mt-2">For high-volume builders dominating their market.</p>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {["Unlimited zip codes", "Unlimited leads", "AI pool renderings", "Direct mail postcards", "CRM integrations", "Dedicated account manager", "Custom reporting"].map(feature => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-slate-300">
                    <CheckCircle className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link href="/signup">
                <Button variant="outline" className="w-full">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
              <Waves className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold">
              <span className="text-white">Pool</span>
              <span className="text-cyan-400"> Leads</span>
            </span>
          </div>
          <p className="text-slate-500 text-sm">© {new Date().getFullYear()} Pool Leads. All rights reserved.</p>
          <div className="flex items-center gap-6 text-sm text-slate-500">
            <Link href="/login" className="hover:text-slate-300 transition-colors">Sign In</Link>
            <Link href="/signup" className="hover:text-slate-300 transition-colors">Get Started</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
