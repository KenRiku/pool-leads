"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Loader2, ExternalLink } from "lucide-react"
import { cn, formatCurrency, STATUS_LABELS, STATUS_COLORS, LEAD_STATUSES } from "@/lib/utils"

interface PipelineLead {
  id: string
  status: string
  notes: string | null
  lead: {
    address: string
    city: string
    state: string
    homeValue: number
    lotSizeSqFt: number
  }
}

const STATUS_COLUMN_COLORS: Record<string, string> = {
  new: "border-blue-500/30 bg-blue-500/5",
  contacted: "border-yellow-500/30 bg-yellow-500/5",
  interested: "border-orange-500/30 bg-orange-500/5",
  quoted: "border-purple-500/30 bg-purple-500/5",
  won: "border-emerald-500/30 bg-emerald-500/5",
  lost: "border-slate-600/30 bg-slate-600/5",
}

const STATUS_HEADER_COLORS: Record<string, string> = {
  new: "text-blue-400",
  contacted: "text-yellow-400",
  interested: "text-orange-400",
  quoted: "text-purple-400",
  won: "text-emerald-400",
  lost: "text-slate-400",
}

export default function PipelinePage() {
  const [leads, setLeads] = useState<PipelineLead[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function fetchLeads() {
      try {
        const res = await fetch("/api/pipeline")
        if (!res.ok) throw new Error("Failed to fetch pipeline")
        const data = await res.json()
        setLeads(data)
      } catch {
        setError("Failed to load pipeline. Please refresh the page.")
      } finally {
        setLoading(false)
      }
    }
    fetchLeads()
  }, [])

  const columns = LEAD_STATUSES.map(status => ({
    status,
    label: STATUS_LABELS[status],
    leads: leads.filter(l => l.status === status),
  }))

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex items-center gap-3 text-slate-400">
          <Loader2 className="w-5 h-5 animate-spin" />
          Loading pipeline...
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-100">Pipeline</h1>
        <p className="text-slate-400 mt-1 text-sm">
          {leads.length} leads across {LEAD_STATUSES.length} stages
        </p>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map(({ status, label, leads: columnLeads }) => (
          <div
            key={status}
            className={cn(
              "flex-shrink-0 w-72 rounded-xl border p-3",
              STATUS_COLUMN_COLORS[status]
            )}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between mb-3 px-1">
              <span className={cn("text-sm font-semibold", STATUS_HEADER_COLORS[status])}>
                {label}
              </span>
              <span className="text-xs text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full">
                {columnLeads.length}
              </span>
            </div>

            {/* Cards */}
            <div className="space-y-2">
              {columnLeads.length === 0 ? (
                <div className="text-center py-8 text-slate-600 text-xs">
                  No leads
                </div>
              ) : (
                columnLeads.map(lead => (
                  <Link
                    key={lead.id}
                    href={`/leads/${lead.id}`}
                    className="block rounded-lg border border-slate-700/50 bg-slate-800/60 p-3 hover:bg-slate-700/60 transition-all hover:border-slate-600/60 group shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-slate-200 truncate group-hover:text-white transition-colors">
                          {lead.lead.address}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5 truncate">
                          {lead.lead.city}, {lead.lead.state}
                        </p>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-400 transition-colors flex-shrink-0 mt-0.5" />
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs text-cyan-400 font-medium">
                        {formatCurrency(lead.lead.homeValue)}
                      </span>
                      <span className="text-xs text-slate-500">
                        {lead.lead.lotSizeSqFt.toLocaleString()} sqft
                      </span>
                    </div>
                    {lead.notes && (
                      <p className="text-xs text-slate-500 mt-2 line-clamp-2 border-t border-slate-700/50 pt-2">
                        {lead.notes}
                      </p>
                    )}
                  </Link>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
