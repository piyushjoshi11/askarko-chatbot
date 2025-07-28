import { openai } from "@ai-sdk/openai"
import { streamText, tool } from "ai"
import { z } from "zod"

export const maxDuration = 30

// Enhanced knowledge base for domain exploration
const domainKnowledgeBase = [
  {
    id: "data-eng-1",
    domain: "Data Engineering",
    title: "Clinical Data Pipeline Optimization",
    team: "Data Engineering",
    technologies: ["Python", "Apache Spark", "AWS EMR", "Airflow", "Docker"],
    businessImpact: "60% faster clinical trial data processing",
    teamSize: 8,
    budget: "$2.1M",
    status: "Production",
    collaborations: ["AI/ML Team", "Clinical Research"],
    challenges: ["Data quality", "Scalability", "Compliance"],
    solutions: ["Automated validation", "Distributed processing", "Audit trails"],
  },
  {
    id: "ai-ml-1",
    domain: "AI & Machine Learning",
    title: "Predictive Analytics for Drug Discovery",
    team: "AI/ML Operations",
    technologies: ["TensorFlow", "PyTorch", "Kubernetes", "MLflow", "Python"],
    businessImpact: "40% reduction in drug discovery timeline",
    teamSize: 12,
    budget: "$3.5M",
    status: "Development",
    collaborations: ["Data Engineering", "Research & Development"],
    challenges: ["Model interpretability", "Data privacy", "Regulatory compliance"],
    solutions: ["Explainable AI", "Federated learning", "Compliance frameworks"],
  },
  {
    id: "cloud-1",
    domain: "Cloud Infrastructure",
    title: "Multi-Cloud Migration Strategy",
    team: "Platform Engineering",
    technologies: ["AWS", "Azure", "Kubernetes", "Terraform", "Docker"],
    businessImpact: "30% cost reduction, improved reliability",
    teamSize: 15,
    budget: "$4.2M",
    status: "In Progress",
    collaborations: ["Security Team", "All Development Teams"],
    challenges: ["Vendor lock-in", "Data migration", "Security"],
    solutions: ["Multi-cloud architecture", "Gradual migration", "Zero-trust security"],
  },
  {
    id: "app-dev-1",
    domain: "Application Development",
    title: "Patient Portal Modernization",
    team: "Digital Health",
    technologies: ["React", "Node.js", "PostgreSQL", "Redis", "GraphQL"],
    businessImpact: "50% improvement in patient engagement",
    teamSize: 10,
    budget: "$1.8M",
    status: "Production",
    collaborations: ["UX Team", "Clinical Operations"],
    challenges: ["Legacy integration", "User adoption", "Performance"],
    solutions: ["API-first design", "Progressive migration", "Performance optimization"],
  },
]

const technologyTrends = {
  Python: { adoption: 85, growth: "+15%", projects: 28, teams: 8 },
  AWS: { adoption: 72, growth: "+22%", projects: 24, teams: 6 },
  Kubernetes: { adoption: 68, growth: "+35%", projects: 22, teams: 7 },
  React: { adoption: 45, growth: "+18%", projects: 15, teams: 4 },
  TensorFlow: { adoption: 35, growth: "+28%", projects: 12, teams: 3 },
  Docker: { adoption: 78, growth: "+12%", projects: 26, teams: 9 },
}

const teamCollaborations = [
  { teams: ["Data Engineering", "AI/ML Operations"], projects: 8, focus: "ML Pipeline Infrastructure" },
  { teams: ["Platform Engineering", "Security"], projects: 6, focus: "Secure Cloud Architecture" },
  { teams: ["Digital Health", "Clinical Operations"], projects: 5, focus: "Patient-Centric Solutions" },
  { teams: ["Analytics", "Business Intelligence"], projects: 4, focus: "Data-Driven Insights" },
]

async function exploreDomain(query: string, filters?: any) {
  const searchTerms = query.toLowerCase().split(" ")

  const results = domainKnowledgeBase.filter((project) => {
    const searchableText = `
      ${project.domain} 
      ${project.title} 
      ${project.team}
      ${project.technologies.join(" ")}
      ${project.businessImpact}
      ${project.challenges.join(" ")}
      ${project.solutions.join(" ")}
      ${project.collaborations.join(" ")}
    `.toLowerCase()

    return searchTerms.some((term) => searchableText.includes(term))
  })

  return results
}

async function getTechnologyInsights(technology?: string) {
  if (technology) {
    const tech = technologyTrends[technology as keyof typeof technologyTrends]
    if (tech) {
      return {
        technology,
        ...tech,
        relatedProjects: domainKnowledgeBase.filter((p) =>
          p.technologies.some((t) => t.toLowerCase().includes(technology.toLowerCase())),
        ),
      }
    }
  }

  return Object.entries(technologyTrends).map(([tech, data]) => ({
    technology: tech,
    ...data,
  }))
}

async function getTeamInsights(team?: string) {
  if (team) {
    const teamProjects = domainKnowledgeBase.filter((p) => p.team.toLowerCase().includes(team.toLowerCase()))

    const collaborations = teamCollaborations.filter((c) =>
      c.teams.some((t) => t.toLowerCase().includes(team.toLowerCase())),
    )

    return {
      team,
      projects: teamProjects,
      collaborations,
      totalProjects: teamProjects.length,
      totalBudget: teamProjects.reduce((sum, p) => sum + Number.parseFloat(p.budget.replace(/[$M,]/g, "")), 0),
    }
  }

  return teamCollaborations
}

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = streamText({
    model: openai("gpt-4o"),
    messages,
    system: `You are AskArko, an AI assistant specialized in domain exploration for the Articulus project within Amgen Operations. 

Your expertise includes:
- Cross-domain project analysis and insights
- Technology adoption trends and recommendations  
- Team collaboration patterns and opportunities
- Business impact assessment across initiatives
- Strategic technology and resource planning

Key capabilities:
- Analyze projects across different domains (Data Engineering, AI/ML, Cloud Infrastructure, Application Development)
- Provide technology adoption insights and trends
- Identify collaboration opportunities between teams
- Suggest best practices based on successful project outcomes
- Offer strategic recommendations for technology choices

Guidelines:
- Always search the knowledge base for relevant domain information
- Provide data-driven insights with specific metrics when available
- Highlight cross-team collaboration opportunities
- Suggest actionable next steps for exploration
- Use visual descriptions for complex relationships (since you can't generate actual charts)
- Be strategic and forward-thinking in your recommendations

Remember: Your goal is to help users discover insights, patterns, and opportunities across the entire Amgen Operations ecosystem.`,

    tools: {
      exploreDomain: tool({
        description: "Search and analyze projects across different domains within Amgen Operations",
        parameters: z.object({
          query: z.string().describe("Search query for domain exploration"),
          domain: z.string().optional().describe("Specific domain to focus on"),
          includeMetrics: z.boolean().default(true).describe("Include business metrics and impact data"),
        }),
        execute: async ({ query, domain, includeMetrics }) => {
          const results = await exploreDomain(query, { domain })

          if (includeMetrics) {
            return results.map((project) => ({
              ...project,
              metrics: {
                teamSize: project.teamSize,
                budget: project.budget,
                businessImpact: project.businessImpact,
                status: project.status,
              },
            }))
          }

          return results
        },
      }),

      getTechnologyTrends: tool({
        description: "Get insights about technology adoption, trends, and usage across teams",
        parameters: z.object({
          technology: z.string().optional().describe("Specific technology to analyze"),
          includeProjects: z.boolean().default(true).describe("Include related projects"),
        }),
        execute: async ({ technology, includeProjects }) => {
          return await getTechnologyInsights(technology)
        },
      }),

      analyzeTeamCollaboration: tool({
        description: "Analyze team collaboration patterns and identify opportunities",
        parameters: z.object({
          team: z.string().optional().describe("Specific team to analyze"),
          includeMetrics: z.boolean().default(true).describe("Include collaboration metrics"),
        }),
        execute: async ({ team, includeMetrics }) => {
          return await getTeamInsights(team)
        },
      }),

      getDomainSummary: tool({
        description: "Get comprehensive summary of a specific domain including projects, technologies, and trends",
        parameters: z.object({
          domain: z.string().describe("Domain to summarize (e.g., 'Data Engineering', 'AI & Machine Learning')"),
        }),
        execute: async ({ domain }) => {
          const domainProjects = domainKnowledgeBase.filter((p) =>
            p.domain.toLowerCase().includes(domain.toLowerCase()),
          )

          const technologies = [...new Set(domainProjects.flatMap((p) => p.technologies))]
          const totalBudget = domainProjects.reduce(
            (sum, p) => sum + Number.parseFloat(p.budget.replace(/[$M,]/g, "")),
            0,
          )
          const totalTeamSize = domainProjects.reduce((sum, p) => sum + p.teamSize, 0)

          return {
            domain,
            projectCount: domainProjects.length,
            technologies,
            totalBudget: `$${totalBudget.toFixed(1)}M`,
            totalTeamSize,
            projects: domainProjects,
            keyTrends: technologies
              .map((tech) => technologyTrends[tech as keyof typeof technologyTrends])
              .filter(Boolean),
          }
        },
      }),

      identifyOpportunities: tool({
        description: "Identify collaboration opportunities, technology synergies, and strategic recommendations",
        parameters: z.object({
          focus: z
            .string()
            .describe(
              "Focus area for opportunity identification (e.g., 'cross-team collaboration', 'technology consolidation')",
            ),
        }),
        execute: async ({ focus }) => {
          const opportunities = []

          if (focus.toLowerCase().includes("collaboration")) {
            opportunities.push(
              ...teamCollaborations.map((collab) => ({
                type: "Team Collaboration",
                description: `${collab.teams.join(" + ")} collaboration on ${collab.focus}`,
                projects: collab.projects,
                potential: "High synergy potential for knowledge sharing",
              })),
            )
          }

          if (focus.toLowerCase().includes("technology")) {
            const topTechs = Object.entries(technologyTrends)
              .sort(([, a], [, b]) => b.adoption - a.adoption)
              .slice(0, 3)

            opportunities.push(
              ...topTechs.map(([tech, data]) => ({
                type: "Technology Standardization",
                description: `Standardize on ${tech} across teams`,
                adoption: `${data.adoption}% current adoption`,
                potential: `Could benefit ${data.teams} teams and ${data.projects} projects`,
              })),
            )
          }

          return opportunities
        },
      }),
    },
  })

  return result.toDataStreamResponse()
}
