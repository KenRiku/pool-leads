"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, Eye } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatCurrency, STATUS_LABELS, STATUS_COLORS, LEAD_STATUSES } from "@/lib/utils"
import { cn } from "@/lib/utils"

interface LeadRow {
  id: string
  status: string
  address: string
  city: string
  state: string
  homeValue: number
  lotSizeSqFt: number
}

interface DashboardFiltersProps {
  leads: LeadRow[]
}

export function DashboardFilters({ leads }: DashboardFiltersProps) {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filtered = leads.filter(lead => {
    const matchesSearch =
      search === "" ||
      lead.address.toLowerCase().includes(search.toLowerCase()) ||
      lead.city.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === "all" || lead.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="rounded-xl border border-slate-700/50 bg-slate-800/30 shadow-lg overflow-hidden">
      {/* Filters */}
      <div className="p-4 border-b border-slate-700/50 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search by address or city..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="w-full sm:w-48">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {LEAD_STATUSES.map(status => (
                <SelectItem key={status} value={status}>
                  {STATUS_LABELS[status]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-slate-400">
            {leads.length === 0
              ? "No leads found for your service area yet. Make sure your zip codes are set correctly."
              : "No leads match your current filters."}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700/50">
                <th className="text-left px-4 py-3 text-slate-400 font-medium">Address</th>
                <th className="text-left px-4 py-3 text-slate-400 font-medium">City / State</th>
                <th className="text-left px-4 py-3 text-slate-400 font-medium">Home Value</th>
                <th className="text-left px-4 py-3 text-slate-400 font-medium">Lot Size</th>
                <th className="text-left px-4 py-3 text-slate-400 font-medium">Status</th>
                <th className="text-right px-4 py-3 text-slate-400 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/30">
              {filtered.map(lead => (
                <tr key={lead.id} className="hover:bg-slate-700/30 transition-colors">
                  <td className="px-4 py-3 text-slate-200 font-medium">{lead.address}</td>
                  <td className="px-4 py-3 text-slate-400">
                    {lead.city}, {lead.state}
                  </td>
                  <td className="px-4 py-3 text-slate-300">{formatCurrency(lead.homeValue)}</td>
                  <td className="px-4 py-3 text-slate-400">
                    {lead.lotSizeSqFt.toLocaleString()} sqft
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
                        STATUS_COLORS[lead.status] || STATUS_COLORS.new
                      )}
                    >
                      {STATUS_LABELS[lead.status] || lead.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/leads/${lead.id}`}
                      className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 transition-colors font-medium"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {filtered.length > 0 && (
        <div className="px-4 py-3 border-t border-slate-700/50 text-xs text-slate-500">
          Showing {filtered.length} of {leads.length} leads
        </div>
      )}
    </div>
  )
}
