"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Wand2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface LeadRenderButtonProps {
  leadId: string
  existingImageUrl: string | null
}

export function LeadRenderButton({ leadId, existingImageUrl }: LeadRenderButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState(existingImageUrl)
  const [error, setError] = useState("")

  async function handleGenerate() {
    setLoading(true)
    setError("")

    try {
      const res = await fetch(`/api/leads/${leadId}/render`, {
        method: "POST",
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || "Failed to generate rendering")
      } else {
        const data = await res.json()
        setImageUrl(data.renderedImageUrl)
        router.refresh()
      }
    } catch {
      setError("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {imageUrl ? (
        <div className="space-y-4">
          <div className="rounded-xl overflow-hidden border border-slate-700/50 aspect-video relative">
            <Image
              src={imageUrl}
              alt="Pool rendering"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          <Button
            onClick={handleGenerate}
            disabled={loading}
            variant="outline"
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Regenerating...
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4" />
                Regenerate Rendering
              </>
            )}
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="rounded-xl border border-dashed border-slate-700 bg-slate-800/30 aspect-video flex flex-col items-center justify-center gap-2 text-slate-500">
            <Wand2 className="w-8 h-8" />
            <p className="text-sm">No rendering generated yet</p>
          </div>
          <Button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4" />
                Generate Pool Rendering
              </>
            )}
          </Button>
        </div>
      )}

      {error && (
        <p className="text-xs text-red-400">{error}</p>
      )}
    </div>
  )
}
