import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Home, MapPin, Sun, CalendarDays, User, DollarSign, Maximize2 } from "lucide-react"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { formatCurrency, STATUS_LABELS, STATUS_COLORS, estimatePoolCost, estimateHomeValueLift } from "@/lib/utils"
import { cn } from "@/lib/utils"
import { LeadStatusForm } from "@/components/lead-status-form"
import { LeadNotesForm } from "@/components/lead-notes-form"
import { LeadRenderButton } from "@/components/lead-render-button"
import { LeadPostcardButton } from "@/components/lead-postcard-button"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function LeadDetailPage({ params }: PageProps) {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const { id } = await params

  const builderLead = await prisma.builderLead.findFirst({
    where: { id, userId: session.user.id },
    include: { lead: true },
  })

  if (!builderLead) notFound()

  const { lead } = builderLead
  const poolCost = estimatePoolCost(lead.lotSizeSqFt, lead.zipCode)
  const valueLift = estimateHomeValueLift(lead.homeValue, poolCost)

  const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY
  const mapImageUrl = googleMapsApiKey
    ? `https://maps.googleapis.com/maps/api/staticmap?center=${lead.lat},${lead.lng}&zoom=18&size=800x400&maptype=satellite&key=${googleMapsApiKey}`
    : null

  const detailItems = [
    { label: "Owner", value: lead.ownerName || "Not available", icon: User },
    { label: "Zip Code", value: lead.zipCode, icon: MapPin },
    { label: "Year Built", value: lead.yearBuilt?.toString() || "Unknown", icon: CalendarDays },
    { label: "Sun Exposure", value: lead.sunExposure || "Unknown", icon: Sun },
    { label: "Recent Sale", value: lead.recentSale ? "Yes" : "No", icon: DollarSign },
    { label: "Lot Size", value: `${lead.lotSizeSqFt.toLocaleString()} sqft`, icon: Maximize2 },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back link */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-100 transition-colors text-sm mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      {/* Property Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Home className="w-5 h-5 text-cyan-400" />
            <h1 className="text-2xl font-bold text-slate-100">{lead.address}</h1>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-slate-400 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {lead.city}, {lead.state} {lead.zipCode}
            </span>
            <span
              className={cn(
                "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
                STATUS_COLORS[builderLead.status] || STATUS_COLORS.new
              )}
            >
              {STATUS_LABELS[builderLead.status] || builderLead.status}
            </span>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="text-right">
            <div className="text-2xl font-bold text-slate-100">{formatCurrency(lead.homeValue)}</div>
            <div className="text-xs text-slate-400">Est. home value</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Map / Satellite Image */}
          <div className="rounded-xl border border-slate-700/50 bg-slate-800/40 overflow-hidden shadow-lg">
            <div className="px-4 py-3 border-b border-slate-700/50">
              <h2 className="text-sm font-semibold text-slate-300">Property View</h2>
            </div>
            {mapImageUrl ? (
              <div className="relative aspect-video">
                <Image
                  src={mapImageUrl}
                  alt={`Satellite view of ${lead.address}`}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            ) : (
              <div className="aspect-video bg-slate-800 flex flex-col items-center justify-center gap-2 text-slate-500">
                <MapPin className="w-10 h-10" />
                <div className="text-sm text-center">
                  <p>Satellite view unavailable</p>
                  <p className="text-xs mt-1">
                    Coordinates: {lead.lat.toFixed(6)}, {lead.lng.toFixed(6)}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Property Details Grid */}
          <div className="rounded-xl border border-slate-700/50 bg-slate-800/40 shadow-lg">
            <div className="px-4 py-3 border-b border-slate-700/50">
              <h2 className="text-sm font-semibold text-slate-300">Property Details</h2>
            </div>
            <div className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
              {detailItems.map(({ label, value, icon: Icon }) => (
                <div key={label} className="space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                    <Icon className="w-3.5 h-3.5" />
                    {label}
                  </div>
                  <div className="text-slate-200 text-sm font-medium">{value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Pool Economics */}
          <div className="rounded-xl border border-slate-700/50 bg-slate-800/40 shadow-lg">
            <div className="px-4 py-3 border-b border-slate-700/50">
              <h2 className="text-sm font-semibold text-slate-300">Pool Opportunity</h2>
            </div>
            <div className="p-4 grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-cyan-500/10 border border-cyan-500/20 p-4">
                <div className="text-xs text-slate-400 mb-1">Est. Pool Cost</div>
                <div className="text-xl font-bold text-cyan-400">{formatCurrency(poolCost)}</div>
              </div>
              <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-4">
                <div className="text-xs text-slate-400 mb-1">Est. Value Lift</div>
                <div className="text-xl font-bold text-emerald-400">+{formatCurrency(valueLift)}</div>
              </div>
            </div>
          </div>

          {/* AI Pool Rendering */}
          <div className="rounded-xl border border-slate-700/50 bg-slate-800/40 shadow-lg">
            <div className="px-4 py-3 border-b border-slate-700/50">
              <h2 className="text-sm font-semibold text-slate-300">AI Pool Rendering</h2>
              <p className="text-xs text-slate-500 mt-0.5">Generate a pool rendering for this property</p>
            </div>
            <div className="p-4">
              <LeadRenderButton
                leadId={builderLead.id}
                existingImageUrl={builderLead.renderedImageUrl}
              />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Management */}
          <div className="rounded-xl border border-slate-700/50 bg-slate-800/40 shadow-lg">
            <div className="px-4 py-3 border-b border-slate-700/50">
              <h2 className="text-sm font-semibold text-slate-300">Lead Status</h2>
            </div>
            <div className="p-4">
              <LeadStatusForm leadId={builderLead.id} currentStatus={builderLead.status} />
            </div>
          </div>

          {/* Notes */}
          <div className="rounded-xl border border-slate-700/50 bg-slate-800/40 shadow-lg">
            <div className="px-4 py-3 border-b border-slate-700/50">
              <h2 className="text-sm font-semibold text-slate-300">Notes</h2>
            </div>
            <div className="p-4">
              <LeadNotesForm leadId={builderLead.id} initialNotes={builderLead.notes} />
            </div>
          </div>

          {/* Postcard */}
          <div className="rounded-xl border border-slate-700/50 bg-slate-800/40 shadow-lg">
            <div className="px-4 py-3 border-b border-slate-700/50">
              <h2 className="text-sm font-semibold text-slate-300">Direct Mail</h2>
            </div>
            <div className="p-4">
              <LeadPostcardButton leadId={builderLead.id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
