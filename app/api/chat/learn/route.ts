import { openai } from "@ai-sdk/openai"
import { streamText, tool } from "ai"
import { z } from "zod"

export const maxDuration = 30

// Enhanced mock knowledge base with more detailed project information
const projectKnowledgeBase = [
  {
    id: "data-pipeline-opt",
    title: "Data Pipeline Optimization",
    presenter: "Sarah Chen",
    team: "Data Engineering",
    businessContext:
      "Clinical trial data processing was taking 8+ hours daily, creating bottlenecks for research teams and delaying critical analysis.",
    problemDefinition:
      "Legacy ETL processes couldn't scale with increasing data volumes from multiple clinical sites. Manual interventions required, high error rates.",
    technologyStack: ["Python", "Apache Spark", "AWS EMR", "S3", "Airflow", "Docker"],
    solution:
      "Implemented distributed processing using Apache Spark on AWS EMR with automated orchestration via Airflow. Containerized all components for consistency.",
    outcomes:
      "60% reduction in processing time, 95% fewer manual interventions, $200K annual cost savings, improved data quality scores from 85% to 98%",
    keyLearnings:
      "Proper data partitioning strategy crucial for Spark performance. Monitoring and alerting essential for production pipelines.",
    stakeholders: ["Clinical Research Teams", "Data Scientists", "Regulatory Affairs", "IT Operations"],
    relatedProjects: ["Real-time Analytics Dashboard", "ML Model Training Pipeline"],
    tags: ["data-engineering", "spark", "aws", "etl", "clinical-data"],
  },
  {
    id: "ml-deployment",
    title: "ML Model Deployment Platform",
    presenter: "Mike Rodriguez",
    team: "AI/ML Operations",
    businessContext:
      "Data scientists were struggling to deploy models to production, taking weeks to months for each deployment with high failure rates.",
    problemDefinition:
      "No standardized deployment process, manual model versioning, lack of monitoring, difficult rollbacks, inconsistent environments.",
    technologyStack: ["TensorFlow", "Kubernetes", "Docker", "MLflow", "Prometheus", "Grafana", "Python", "FastAPI"],
    solution:
      "Built MLOps platform with automated CI/CD pipelines, model registry, A/B testing framework, and comprehensive monitoring dashboard.",
    outcomes:
      "80% faster model deployment (weeks to days), 99.5% uptime, automated rollbacks, 40% increase in model deployment frequency",
    keyLearnings:
      "Model monitoring as important as deployment. Feature drift detection crucial for model performance. Automated testing prevents production issues.",
    stakeholders: ["Data Science Teams", "Product Teams", "DevOps", "Business Stakeholders"],
    relatedProjects: ["Data Pipeline Optimization", "Real-time Analytics Dashboard"],
    tags: ["mlops", "kubernetes", "tensorflow", "deployment", "monitoring"],
  },
  {
    id: "api-migration",
    title: "API Gateway Migration",
    presenter: "Alex Johnson",
    team: "Platform Engineering",
    businessContext:
      "Monolithic API was becoming a bottleneck for development teams, causing deployment delays and scalability issues.",
    problemDefinition:
      "Single point of failure, difficult to scale individual components, technology lock-in, slow development cycles, poor fault isolation.",
    technologyStack: [
      "Node.js",
      "Express",
      "Docker",
      "Kubernetes",
      "MongoDB",
      "Redis",
      "Kong API Gateway",
      "Prometheus",
    ],
    solution:
      "Migrated to microservices architecture with API gateway for routing, authentication, and rate limiting. Implemented circuit breakers and health checks.",
    outcomes:
      "99.9% uptime achieved, 40% performance improvement, 60% faster feature delivery, improved developer productivity",
    keyLearnings:
      "Gradual migration strategy essential. Service mesh complexity requires careful planning. Monitoring and observability critical for microservices.",
    stakeholders: ["Development Teams", "Product Teams", "Infrastructure", "Customer Support"],
    relatedProjects: ["Container Orchestration Platform", "Monitoring Infrastructure"],
    tags: ["microservices", "api-gateway", "nodejs", "kubernetes", "migration"],
  },
  {
    id: "analytics-dashboard",
    title: "Real-time Analytics Dashboard",
    presenter: "Lisa Wang",
    team: "Analytics & Insights",
    businessContext:
      "Business stakeholders needed real-time visibility into key metrics for faster decision-making and operational efficiency.",
    problemDefinition:
      "Batch reporting with 24-hour delays, manual report generation, inconsistent metrics across teams, no self-service analytics.",
    technologyStack: ["React", "D3.js", "WebSocket", "Apache Kafka", "ClickHouse", "Node.js", "Docker"],
    solution:
      "Built real-time dashboard with streaming data pipeline using Kafka, columnar database for fast queries, and WebSocket for live updates.",
    outcomes:
      "Real-time decision making enabled, 90% reduction in report generation time, 50% increase in data-driven decisions, improved operational visibility",
    keyLearnings:
      "User experience crucial for adoption. Data freshness vs. system performance trade-offs. Proper caching strategy essential for performance.",
    stakeholders: ["Business Leaders", "Operations Teams", "Data Analysts", "Product Managers"],
    relatedProjects: ["Data Pipeline Optimization", "Business Intelligence Platform"],
    tags: ["analytics", "real-time", "react", "kafka", "dashboard"],
  },
]

async function searchProjects(query: string, filters?: any) {
  // Enhanced search logic
  const searchTerms = query.toLowerCase().split(" ")

  const results = projectKnowledgeBase.filter((project) => {
    const searchableText = `
      ${project.title} 
      ${project.businessContext} 
      ${project.problemDefinition} 
      ${project.solution} 
      ${project.outcomes}
      ${project.technologyStack.join(" ")}
      ${project.tags.join(" ")}
      ${project.team}
    `.toLowerCase()

    return searchTerms.some((term) => searchableText.includes(term))
  })

  return results.map((project) => ({
    ...project,
    relevanceScore: 0.9, // Mock relevance score
  }))
}

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = streamText({
    model: openai("gpt-4o"),
    messages,
    system: `You are AskArko, an AI assistant for the Articulus project within Amgen Operations. Your role is to help users learn about projects through detailed, conversational explanations.

Key guidelines:
- Always search the knowledge base first before answering project-related questions
- Provide comprehensive answers covering business context, technical details, and outcomes
- Use a conversational, educational tone that encourages learning
- When discussing projects, include relevant stakeholders, technology choices, and lessons learned
- Suggest related projects and next steps for deeper learning
- If information isn't in the knowledge base, clearly state this and offer to help with general guidance
- Present information in a structured, easy-to-understand format
- Encourage follow-up questions and deeper exploration

Remember: Your goal is to facilitate knowledge sharing and help users understand the full context of projects within Amgen Operations.`,

    tools: {
      searchProjects: tool({
        description:
          "Search the Articulus knowledge base for detailed project information including business context, technical details, and outcomes",
        parameters: z.object({
          query: z.string().describe("Search query for finding relevant projects"),
          includeDetails: z.boolean().default(true).describe("Whether to include detailed project information"),
        }),
        execute: async ({ query, includeDetails }) => {
          const results = await searchProjects(query)

          if (!includeDetails) {
            return results.map((r) => ({
              title: r.title,
              team: r.team,
              summary: r.businessContext.substring(0, 100) + "...",
            }))
          }

          return results
        },
      }),

      getRelatedProjects: tool({
        description: "Find projects related to a specific project or technology",
        parameters: z.object({
          projectId: z.string().describe("ID of the project to find related projects for"),
          technology: z.string().optional().describe("Technology to find related projects for"),
        }),
        execute: async ({ projectId, technology }) => {
          const project = projectKnowledgeBase.find((p) => p.id === projectId)
          if (project) {
            const related = projectKnowledgeBase.filter(
              (p) =>
                project.relatedProjects.includes(p.title) ||
                (technology && p.technologyStack.some((tech) => tech.toLowerCase().includes(technology.toLowerCase()))),
            )
            return related
          }
          return []
        },
      }),

      suggestNextSteps: tool({
        description: "Suggest next learning steps based on user's current interest",
        parameters: z.object({
          currentTopic: z.string().describe("The topic or project the user is currently learning about"),
          userRole: z.string().optional().describe("User's role or interest area"),
        }),
        execute: async ({ currentTopic, userRole }) => {
          // Mock suggestions based on topic
          const suggestions = [
            {
              type: "documentation",
              title: "Technical Documentation",
              description: `Deep dive into ${currentTopic} implementation details`,
            },
            {
              type: "team",
              title: "Connect with Team",
              description: `Reach out to team members working on ${currentTopic}`,
            },
            {
              type: "related",
              title: "Explore Related Projects",
              description: `Discover projects that complement ${currentTopic}`,
            },
          ]

          return suggestions
        },
      }),
    },
  })

  return result.toDataStreamResponse()
}
