"use client"

import { useState } from "react"
import { Loader2, Mail, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

interface LeadPostcardButtonProps {
  leadId: string
}

interface CampaignResult {
  campaignId: string
  pdfUrl: string | null
  status: string
}

export function LeadPostcardButton({ leadId }: LeadPostcardButtonProps) {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<CampaignResult | null>(null)
  const [error, setError] = useState("")

  async function handleGenerate() {
    setLoading(true)
    setError("")

    try {
      const res = await fetch(`/api/leads/${leadId}/postcard`, {
        method: "POST",
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || "Failed to generate postcard")
      } else {
        const data = await res.json()
        setResult(data)
      }
    } catch {
      setError("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  if (result) {
    return (
      <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 space-y-3">
        <div className="flex items-center gap-2 text-emerald-400">
          <Mail className="w-4 h-4" />
          <span className="text-sm font-medium">Postcard campaign created!</span>
        </div>
        <p className="text-xs text-slate-400">
          Campaign ID: <span className="font-mono text-slate-300">{result.campaignId}</span>
        </p>
        {result.pdfUrl && (
          <a
            href={result.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            View PDF
          </a>
        )}
        <Button
          onClick={handleGenerate}
          disabled={loading}
          variant="outline"
          className="w-full"
          size="sm"
        >
          Generate Another
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-400">
        Generate a personalized direct mail postcard for this property with a custom pool rendering.
      </p>
      <Button
        onClick={handleGenerate}
        disabled={loading}
        variant="outline"
        className="w-full"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Mail className="w-4 h-4" />
            Generate Postcard
          </>
        )}
      </Button>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
}
