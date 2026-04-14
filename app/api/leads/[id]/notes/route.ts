import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params

  try {
    const body = await req.json()
    const { notes } = body

    if (typeof notes !== "string") {
      return NextResponse.json({ error: "Notes must be a string" }, { status: 400 })
    }

    // Verify ownership
    const existing = await prisma.builderLead.findFirst({
      where: { id, userId: session.user.id },
    })

    if (!existing) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 })
    }

    const updated = await prisma.builderLead.update({
      where: { id },
      data: { notes: notes.trim() || null },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error("Notes update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
