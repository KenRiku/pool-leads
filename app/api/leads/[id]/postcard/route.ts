import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params

  try {
    // Verify ownership
    const builderLead = await prisma.builderLead.findFirst({
      where: { id, userId: session.user.id },
      include: { lead: true },
    })

    if (!builderLead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 })
    }

    // Create a Campaign record for this BuilderLead
    const campaign = await prisma.campaign.create({
      data: {
        builderLeadId: id,
        type: "postcard",
        status: "generated",
        pdfUrl: null,
      },
    })

    return NextResponse.json({
      campaignId: campaign.id,
      pdfUrl: null,
      status: campaign.status,
    })
  } catch (error) {
    console.error("Postcard error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
