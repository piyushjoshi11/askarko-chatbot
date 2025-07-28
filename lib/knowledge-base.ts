import { openai } from "@ai-sdk/openai"

const embeddingModel = openai.embedding("text-embedding-ada-002")

// Mock knowledge base - in production, this would be a proper database
const mockKnowledgeBase = [
  {
    id: "1",
    title: "Data Pipeline Optimization",
    presenter: "Sarah Chen",
    team: "Data Engineering",
    content:
      "Implemented Apache Spark-based data pipeline optimization reducing processing time by 60%. Used Python and AWS EMR for scalable data processing. Key outcomes: improved data freshness, reduced costs, better resource utilization.",
    tags: ["Python", "Apache Spark", "AWS", "Data Engineering", "Performance"],
    type: "presentation",
    embedding: null, // Would be populated with actual embeddings
  },
  {
    id: "2",
    title: "ML Model Deployment Platform",
    presenter: "Mike Rodriguez",
    team: "AI/ML",
    content:
      "Built MLOps platform using TensorFlow Serving and Kubernetes for automated model deployment. Implemented CI/CD pipelines for model versioning and A/B testing. Results: 80% faster model deployment, improved model monitoring.",
    tags: ["TensorFlow", "Kubernetes", "MLOps", "CI/CD", "Model Deployment"],
    type: "presentation",
    embedding: null,
  },
  {
    id: "3",
    title: "API Gateway Migration",
    presenter: "Alex Johnson",
    team: "Platform Engineering",
    content:
      "Migrated monolithic API to microservices architecture using Node.js and Docker. Implemented API gateway with rate limiting and authentication. Achieved 99.9% uptime and 40% performance improvement.",
    tags: ["Node.js", "Docker", "Microservices", "API Gateway", "Migration"],
    type: "presentation",
    embedding: null,
  },
  {
    id: "4",
    title: "Real-time Analytics Dashboard",
    presenter: "Lisa Wang",
    team: "Analytics",
    content:
      "Developed real-time analytics dashboard using React and WebSocket connections. Integrated with Kafka for streaming data processing. Business impact: real-time decision making, improved operational visibility.",
    tags: ["React", "WebSocket", "Kafka", "Real-time", "Analytics"],
    type: "presentation",
    embedding: null,
  },
]

export async function findRelevantContent(
  query: string,
  filters?: { team?: string; technology?: string; presenter?: string },
) {
  // In a real implementation, you would:
  // 1. Generate embedding for the query
  // 2. Search vector database for similar embeddings
  // 3. Apply filters
  // 4. Return ranked results

  // For now, we'll do simple text matching
  const results = mockKnowledgeBase.filter((item) => {
    const matchesQuery =
      item.content.toLowerCase().includes(query.toLowerCase()) ||
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase()))

    const matchesTeam = !filters?.team || item.team.toLowerCase().includes(filters.team.toLowerCase())

    const matchesTechnology =
      !filters?.technology || item.tags.some((tag) => tag.toLowerCase().includes(filters.technology.toLowerCase()))

    const matchesPresenter =
      !filters?.presenter || item.presenter.toLowerCase().includes(filters.presenter.toLowerCase())

    return matchesQuery && matchesTeam && matchesTechnology && matchesPresenter
  })

  return results.map((item) => ({
    title: item.title,
    presenter: item.presenter,
    team: item.team,
    content: item.content,
    tags: item.tags,
    relevanceScore: 0.8, // Mock relevance score
  }))
}

export async function addToKnowledgeBase(content: {
  title: string
  presenter: string
  team: string
  content: string
  tags: string[]
  type: "document" | "video" | "text"
}) {
  // In a real implementation, you would:
  // 1. Generate embeddings for the content
  // 2. Store in vector database
  // 3. Index for search

  console.log("Adding to knowledge base:", content)
  return { success: true, id: Date.now().toString() }
}
