import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const builderLeads = await prisma.builderLead.findMany({
      where: { userId: session.user.id },
      include: {
        lead: {
          select: {
            address: true,
            city: true,
            state: true,
            homeValue: true,
            lotSizeSqFt: true,
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    })

    return NextResponse.json(builderLeads)
  } catch (error) {
    console.error("Pipeline fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
