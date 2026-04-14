import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        name: true,
        email: true,
        company: true,
        serviceZips: true,
        plan: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error("Settings GET error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { name, company, serviceZips } = body

    const updateData: Record<string, unknown> = {}

    if (name !== undefined) {
      if (typeof name !== "string" || !name.trim()) {
        return NextResponse.json({ error: "Name cannot be empty" }, { status: 400 })
      }
      updateData.name = name.trim()
    }

    if (company !== undefined) {
      if (typeof company !== "string" || !company.trim()) {
        return NextResponse.json({ error: "Company name cannot be empty" }, { status: 400 })
      }
      updateData.company = company.trim()
    }

    if (serviceZips !== undefined) {
      const zipsArray: string[] = serviceZips
        .split(",")
        .map((z: string) => z.trim())
        .filter((z: string) => z.length > 0)

      if (zipsArray.length === 0) {
        return NextResponse.json({ error: "At least one service zip code is required" }, { status: 400 })
      }
      updateData.serviceZips = zipsArray
    }

    const updated = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
      select: {
        name: true,
        email: true,
        company: true,
        serviceZips: true,
        plan: true,
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error("Settings PATCH error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
