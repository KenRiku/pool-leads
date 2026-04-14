"use client"

import { useState } from "react"
import Link from "next/link"
import { signIn } from "next-auth/react"
import { Waves, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface FormData {
  name: string
  email: string
  password: string
  company: string
  serviceZips: string
}

interface FormErrors {
  name?: string
  email?: string
  password?: string
  company?: string
  serviceZips?: string
  general?: string
}

function validateForm(data: FormData): FormErrors {
  const errors: FormErrors = {}

  if (!data.name.trim()) errors.name = "Name is required"
  if (!data.email.trim()) {
    errors.email = "Email is required"
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "Please enter a valid email address"
  }
  if (!data.password) {
    errors.password = "Password is required"
  } else if (data.password.length < 8) {
    errors.password = "Password must be at least 8 characters"
  }
  if (!data.company.trim()) errors.company = "Company name is required"
  if (!data.serviceZips.trim()) errors.serviceZips = "At least one zip code is required"

  return errors
}

export default function SignupPage() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    company: "",
    serviceZips: "",
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [loading, setLoading] = useState(false)

  function handleChange(field: keyof FormData) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData(prev => ({ ...prev, [field]: e.target.value }))
      if (errors[field]) {
        setErrors(prev => ({ ...prev, [field]: undefined }))
      }
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrors({})

    const validationErrors = validateForm(formData)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        setErrors({ general: data.error || "Failed to create account. Please try again." })
        setLoading(false)
        return
      }

      // Sign in after successful registration
      await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirectTo: "/dashboard",
      })
    } catch {
      setErrors({ general: "Something went wrong. Please try again." })
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md">
      {/* Logo */}
      <div className="text-center mb-8">
        <Link href="/" className="inline-flex items-center gap-2.5 group">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/25">
              <Waves className="w-5 h-5 text-white" />
            </div>
            <div className="absolute inset-0 rounded-xl bg-cyan-400/20 blur-sm group-hover:blur-md transition-all" />
          </div>
          <span className="font-bold text-xl tracking-tight">
            <span className="text-white">Pool</span>
            <span className="text-cyan-400"> Leads</span>
          </span>
        </Link>
        <h1 className="text-2xl font-bold text-slate-100 mt-6">Create your account</h1>
        <p className="text-slate-400 text-sm mt-1">Start your 14-day free trial</p>
      </div>

      {/* Card */}
      <div className="rounded-xl border border-slate-700/50 bg-slate-800/40 backdrop-blur-sm shadow-xl p-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          {errors.general && (
            <div className="rounded-lg bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-400">
              {errors.general}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Full name</Label>
            <Input
              id="name"
              type="text"
              placeholder="John Smith"
              value={formData.name}
              onChange={handleChange("name")}
              autoComplete="name"
            />
            {errors.name && <p className="text-xs text-red-400">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange("email")}
              autoComplete="email"
            />
            {errors.email && <p className="text-xs text-red-400">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Min. 8 characters"
              value={formData.password}
              onChange={handleChange("password")}
              autoComplete="new-password"
            />
            {errors.password && <p className="text-xs text-red-400">{errors.password}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="company">Company name</Label>
            <Input
              id="company"
              type="text"
              placeholder="Your Pool Company LLC"
              value={formData.company}
              onChange={handleChange("company")}
              autoComplete="organization"
            />
            {errors.company && <p className="text-xs text-red-400">{errors.company}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="serviceZips">Service Zip Codes (comma-separated)</Label>
            <Input
              id="serviceZips"
              type="text"
              placeholder="85001, 85002, 85003"
              value={formData.serviceZips}
              onChange={handleChange("serviceZips")}
            />
            {errors.serviceZips && <p className="text-xs text-red-400">{errors.serviceZips}</p>}
            <p className="text-xs text-slate-500">Enter the zip codes where you provide pool installation services.</p>
          </div>

          <Button type="submit" className="w-full mt-2" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Creating account...
              </>
            ) : (
              "Create Account"
            )}
          </Button>
        </form>

        <p className="text-center text-sm text-slate-400 mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-cyan-400 hover:text-cyan-300 transition-colors font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
