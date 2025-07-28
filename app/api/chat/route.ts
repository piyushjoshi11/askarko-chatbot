import { openai } from "@ai-sdk/openai"
import { streamText, tool } from "ai"
import { z } from "zod"
import { findRelevantContent } from "@/lib/knowledge-base"

export const maxDuration = 30

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = streamText({
    model: openai("gpt-4o"),
    messages,
    system: `You are AskArko, an AI assistant for the Articulus project within Amgen Operations. 

Your role is to help team members find information about ongoing projects, their technology stacks, business context, problem definitions, solutions, and outcomes based on the knowledge base of presentations and documentation from Articulus sessions.

Key guidelines:
- Always search the knowledge base before answering questions about specific projects
- Provide detailed, helpful responses about project details, technology choices, and outcomes
- If you don't find relevant information in the knowledge base, clearly state this
- Encourage knowledge sharing and cross-team collaboration
- Be professional but friendly, matching the collaborative spirit of Articulus
- When discussing projects, include context about business impact, technical approach, and lessons learned when available

Remember: Articulus is a Toastmasters-inspired initiative that promotes knowledge sharing and communication skills development within Amgen Operations.`,

    tools: {
      searchKnowledge: tool({
        description:
          "Search the Articulus knowledge base for information about projects, presentations, and documentation",
        parameters: z.object({
          query: z.string().describe("The search query to find relevant project information"),
          filters: z
            .object({
              team: z.string().optional().describe("Filter by team or department"),
              technology: z.string().optional().describe("Filter by technology stack"),
              presenter: z.string().optional().describe("Filter by presenter name"),
            })
            .optional(),
        }),
        execute: async ({ query, filters }) => {
          return await findRelevantContent(query, filters)
        },
      }),
    },
  })

  return result.toDataStreamResponse()
}
