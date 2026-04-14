"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface LeadNotesFormProps {
  leadId: string
  initialNotes: string | null
}

export function LeadNotesForm({ leadId, initialNotes }: LeadNotesFormProps) {
  const router = useRouter()
  const [notes, setNotes] = useState(initialNotes || "")
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState("")

  async function handleSave() {
    setLoading(true)
    setError("")
    setSaved(false)

    try {
      const res = await fetch(`/api/leads/${leadId}/notes`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || "Failed to save notes")
      } else {
        setSaved(true)
        router.refresh()
        setTimeout(() => setSaved(false), 2000)
      }
    } catch {
      setError("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-3">
      <Textarea
        value={notes}
        onChange={e => setNotes(e.target.value)}
        placeholder="Add notes about this lead — contact history, project preferences, budget discussed..."
        rows={5}
      />

      {error && <p className="text-xs text-red-400">{error}</p>}

      <Button
        onClick={handleSave}
        disabled={loading}
        className="w-full"
        variant={saved ? "success" : "default"}
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Saving...
          </>
        ) : saved ? (
          "Saved!"
        ) : (
          "Save Notes"
        )}
      </Button>
    </div>
  )
}
