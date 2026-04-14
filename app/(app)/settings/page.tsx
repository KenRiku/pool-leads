"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { Loader2, User, MapPin, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface SettingsData {
  name: string
  email: string
  company: string
  serviceZips: string
  plan: string
}

const PLAN_LABELS: Record<string, string> = {
  free: "Free Trial",
  starter: "Starter",
  pro: "Pro",
  premium: "Premium",
}

const PLAN_COLORS: Record<string, string> = {
  free: "bg-slate-700/50 text-slate-300 border-slate-600",
  starter: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  pro: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
  premium: "bg-purple-500/10 text-purple-400 border-purple-500/30",
}

export default function SettingsPage() {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState<SettingsData>({
    name: "",
    email: "",
    company: "",
    serviceZips: "",
    plan: "free",
  })

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch("/api/settings")
        if (!res.ok) throw new Error("Failed to fetch settings")
        const data = await res.json()
        setFormData({
          name: data.name || "",
          email: data.email || "",
          company: data.company || "",
          serviceZips: (data.serviceZips || []).join(", "),
          plan: data.plan || "free",
        })
      } catch {
        setError("Failed to load settings")
      } finally {
        setLoading(false)
      }
    }
    fetchSettings()
  }, [])

  function handleChange(field: keyof SettingsData) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData(prev => ({ ...prev, [field]: e.target.value }))
      setSaved(false)
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError("")
    setSaved(false)

    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          company: formData.company,
          serviceZips: formData.serviceZips,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || "Failed to save settings")
      } else {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      }
    } catch {
      setError("Something went wrong")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex items-center gap-3 text-slate-400">
          <Loader2 className="w-5 h-5 animate-spin" />
          Loading settings...
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-100">Settings</h1>
        <p className="text-slate-400 mt-1 text-sm">Manage your account and service area</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Plan badge */}
        <div className="rounded-xl border border-slate-700/50 bg-slate-800/40 p-5 shadow-lg">
          <div className="flex items-center gap-3 mb-1">
            <CreditCard className="w-4 h-4 text-slate-400" />
            <h2 className="text-sm font-semibold text-slate-300">Current Plan</h2>
          </div>
          <div className="mt-3">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${
                PLAN_COLORS[formData.plan] || PLAN_COLORS.free
              }`}
            >
              {PLAN_LABELS[formData.plan] || formData.plan}
            </span>
          </div>
        </div>

        {/* Profile */}
        <div className="rounded-xl border border-slate-700/50 bg-slate-800/40 p-5 shadow-lg space-y-4">
          <div className="flex items-center gap-3">
            <User className="w-4 h-4 text-slate-400" />
            <h2 className="text-sm font-semibold text-slate-300">Profile</h2>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Full name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={handleChange("name")}
              placeholder="Your name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              disabled
              className="opacity-60 cursor-not-allowed"
            />
            <p className="text-xs text-slate-500">Email address cannot be changed.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="company">Company name</Label>
            <Input
              id="company"
              value={formData.company}
              onChange={handleChange("company")}
              placeholder="Your company"
            />
          </div>
        </div>

        {/* Service area */}
        <div className="rounded-xl border border-slate-700/50 bg-slate-800/40 p-5 shadow-lg space-y-4">
          <div className="flex items-center gap-3">
            <MapPin className="w-4 h-4 text-slate-400" />
            <h2 className="text-sm font-semibold text-slate-300">Service Area</h2>
          </div>

          <div className="space-y-2">
            <Label htmlFor="serviceZips">Service Zip Codes (comma-separated)</Label>
            <Input
              id="serviceZips"
              value={formData.serviceZips}
              onChange={handleChange("serviceZips")}
              placeholder="85001, 85002, 85003"
            />
            <p className="text-xs text-slate-500">
              Adding new zip codes will automatically surface leads from those areas on your next dashboard load.
            </p>
          </div>
        </div>

        {error && (
          <div className="rounded-lg bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {saved && (
          <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/30 px-4 py-3 text-sm text-emerald-400">
            Settings saved successfully!
          </div>
        )}

        <Button type="submit" disabled={saving} className="w-full sm:w-auto">
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </form>
    </div>
  )
}
