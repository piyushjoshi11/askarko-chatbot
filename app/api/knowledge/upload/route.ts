import { type NextRequest, NextResponse } from "next/server"
import { addToKnowledgeBase } from "@/lib/knowledge-base"

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()

    const title = formData.get("title") as string
    const presenter = formData.get("presenter") as string
    const team = formData.get("team") as string
    const tags = (formData.get("tags") as string)?.split(",").map((tag) => tag.trim()) || []
    const contentType = formData.get("contentType") as "document" | "video" | "text"

    let content = ""

    if (contentType === "text") {
      content = formData.get("content") as string
    } else {
      const file = formData.get("file") as File
      if (file) {
        // In a real implementation, you would:
        // 1. Upload file to storage (S3, etc.)
        // 2. Process file (extract text from PDF, transcribe video, etc.)
        // 3. Generate embeddings
        content = `File uploaded: ${file.name} (${file.type})`
      }
    }

    const result = await addToKnowledgeBase({
      title,
      presenter,
      team,
      content,
      tags,
      type: contentType,
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Failed to upload content" }, { status: 500 })
  }
}
