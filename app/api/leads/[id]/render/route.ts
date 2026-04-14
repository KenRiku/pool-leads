import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

interface RouteParams {
  params: Promise<{ id: string }>
}

const POOL_IMAGE_URLS = [
  "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&h=600&fit=crop",
]

export async function POST(req: NextRequest, { params }: RouteParams) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params

  try {
    // Verify ownership and get lead data
    const builderLead = await prisma.builderLead.findFirst({
      where: { id, userId: session.user.id },
      include: { lead: true },
    })

    if (!builderLead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 })
    }

    // Pick a pool image based on the lead's lot size for some variety
    const imageIndex = builderLead.lead.lotSizeSqFt % POOL_IMAGE_URLS.length
    const renderedImageUrl = POOL_IMAGE_URLS[imageIndex]

    // Optionally enrich with AI description if Anthropic SDK is configured
    try {
      const { default: Anthropic } = await import("@anthropic-ai/sdk")
      const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

      const { lead } = builderLead
      await client.messages.create({
        model: "claude-opus-4-6",
        max_tokens: 256,
        messages: [
          {
            role: "user",
            content: `Describe in 2-3 sentences what an ideal pool design would look like for a ${lead.lotSizeSqFt.toLocaleString()} sqft property in ${lead.city}, ${lead.state}, built in ${lead.yearBuilt || "the 1990s"}, with ${lead.sunExposure || "moderate"} sun exposure. Be specific and enticing.`,
          },
        ],
      })
    } catch {
      // AI enrichment is optional — continue without it
    }

    // Update the BuilderLead with the rendered image URL
    const updated = await prisma.builderLead.update({
      where: { id },
      data: { renderedImageUrl },
    })

    return NextResponse.json({ renderedImageUrl: updated.renderedImageUrl })
  } catch (error) {
    console.error("Render error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
