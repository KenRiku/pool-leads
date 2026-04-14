import { redirect } from "next/navigation"
import Link from "next/link"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { formatCurrency, STATUS_LABELS, STATUS_COLORS, LEAD_STATUSES } from "@/lib/utils"
import { DashboardFilters } from "@/components/dashboard-filters"
import { BarChart3, TrendingUp, Users } from "lucide-react"

async function getDashboardData(userId: string, serviceZips: string[]) {
  // Find leads matching service zips
  const leads = await prisma.lead.findMany({
    where: { zipCode: { in: serviceZips } },
  })

  // Upsert BuilderLead records for each matching lead
  if (leads.length > 0) {
    await Promise.all(
      leads.map(lead =>
        prisma.builderLead.upsert({
          where: { userId_leadId: { userId, leadId: lead.id } },
          update: {},
          create: {
            userId,
            leadId: lead.id,
            status: "new",
          },
        })
      )
    )
  }

  // Fetch all BuilderLeads with lead data
  const builderLeads = await prisma.builderLead.findMany({
    where: { userId },
    include: { lead: true },
    orderBy: { createdAt: "desc" },
  })

  return builderLeads
}

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { serviceZips: true, name: true, company: true },
  })

  if (!user) redirect("/login")

  const builderLeads = await getDashboardData(session.user.id, user.serviceZips)

  // Compute stats
  const stats = LEAD_STATUSES.reduce(
    (acc, status) => {
      acc[status] = builderLeads.filter(bl => bl.status === status).length
      return acc
    },
    {} as Record<string, number>
  )

  const statCards = [
    { label: "Total Leads", value: builderLeads.length, icon: Users, color: "text-cyan-400" },
    { label: "New", value: stats.new || 0, color: "text-blue-400" },
    { label: "Contacted", value: stats.contacted || 0, color: "text-yellow-400" },
    { label: "Interested", value: stats.interested || 0, color: "text-orange-400" },
    { label: "Quoted", value: stats.quoted || 0, color: "text-purple-400" },
    { label: "Won", value: stats.won || 0, color: "text-emerald-400" },
  ]

  const leadsForClient = builderLeads.map(bl => ({
    id: bl.id,
    status: bl.status,
    address: bl.lead.address,
    city: bl.lead.city,
    state: bl.lead.state,
    homeValue: bl.lead.homeValue,
    lotSizeSqFt: bl.lead.lotSizeSqFt,
  }))

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-100">
          Welcome back, {user.name?.split(" ")[0]}
        </h1>
        <p className="text-slate-400 mt-1">
          Showing leads for zip codes: {user.serviceZips.join(", ")}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {statCards.map(({ label, value, color }) => (
          <div
            key={label}
            className="rounded-xl border border-slate-700/50 bg-slate-800/40 backdrop-blur-sm p-4 shadow-lg"
          >
            <div className={`text-2xl font-bold ${color}`}>{value}</div>
            <div className="text-xs text-slate-400 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Pipeline bar */}
      {builderLeads.length > 0 && (
        <div className="rounded-xl border border-slate-700/50 bg-slate-800/40 p-4 mb-6 flex items-center gap-4">
          <TrendingUp className="w-4 h-4 text-cyan-400 flex-shrink-0" />
          <div className="flex-1 flex gap-1 h-3 rounded-full overflow-hidden">
            {LEAD_STATUSES.filter(s => (stats[s] || 0) > 0).map(status => {
              const pct = ((stats[status] || 0) / builderLeads.length) * 100
              const colors: Record<string, string> = {
                new: "bg-blue-500",
                contacted: "bg-yellow-500",
                interested: "bg-orange-500",
                quoted: "bg-purple-500",
                won: "bg-emerald-500",
                lost: "bg-slate-600",
              }
              return (
                <div
                  key={status}
                  className={`${colors[status]} h-full transition-all`}
                  style={{ width: `${pct}%` }}
                  title={`${STATUS_LABELS[status]}: ${stats[status]}`}
                />
              )
            })}
          </div>
          <span className="text-xs text-slate-400 flex-shrink-0">
            {stats.won || 0} won of {builderLeads.length}
          </span>
        </div>
      )}

      {/* Filterable leads table */}
      <DashboardFilters leads={leadsForClient} />
    </div>
  )
}
