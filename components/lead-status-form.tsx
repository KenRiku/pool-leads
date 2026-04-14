"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LEAD_STATUSES, STATUS_LABELS } from "@/lib/utils"

interface LeadStatusFormProps {
  leadId: string
  currentStatus: string
}

export function LeadStatusForm({ leadId, currentStatus }: LeadStatusFormProps) {
  const router = useRouter()
  const [status, setStatus] = useState(currentStatus)
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState("")

  async function handleSave() {
    if (status === currentStatus) return
    setLoading(true)
    setError("")
    setSaved(false)

    try {
      const res = await fetch(`/api/leads/${leadId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || "Failed to update status")
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
      <Select value={status} onValueChange={setStatus}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {LEAD_STATUSES.map(s => (
            <SelectItem key={s} value={s}>
              {STATUS_LABELS[s]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {error && <p className="text-xs text-red-400">{error}</p>}

      <Button
        onClick={handleSave}
        disabled={loading || status === currentStatus}
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
          "Update Status"
        )}
      </Button>
    </div>
  )
}
