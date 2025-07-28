import { openai } from "@ai-sdk/openai"
import { streamText, tool } from "ai"
import { z } from "zod"

export const maxDuration = 30

// Business development focused knowledge base
const businessProjectsDB = [
  {
    id: "bd-1",
    title: "Clinical Data Analytics Platform",
    domain: "Clinical Research",
    budget: 2300000,
    duration: 18,
    teamSize: 12,
    technologies: ["Python", "AWS", "TensorFlow", "React", "PostgreSQL"],
    businessDrivers: ["Faster clinical trials", "Regulatory compliance", "Cost reduction"],
    outcomes: {
      costSavings: 1200000,
      timeReduction: 40,
      efficiencyGain: 35,
      roi: 152,
    },
    risks: ["Data compliance", "Integration complexity", "Regulatory changes"],
    successFactors: ["Strong stakeholder engagement", "Agile methodology", "Executive sponsorship"],
    teamStructure: {
      "Project Manager": 1,
      "Data Scientists": 3,
      "Software Engineers": 4,
      "DevOps Engineers": 2,
      "QA Engineers": 2,
    },
    budgetBreakdown: {
      Personnel: 70,
      Infrastructure: 15,
      "Software Licenses": 10,
      Contingency: 5,
    },
  },
  {
    id: "bd-2",
    title: "Supply Chain Optimization",
    domain: "Operations",
    budget: 3100000,
    duration: 24,
    teamSize: 15,
    technologies: ["R", "Tableau", "SAP", "Power BI", "Oracle"],
    businessDrivers: ["Supply chain efficiency", "Cost optimization", "Risk mitigation"],
    outcomes: {
      costSavings: 2500000,
      timeReduction: 25,
      efficiencyGain: 30,
      roi: 180,
    },
    risks: ["Vendor dependencies", "Change management", "Integration challenges"],
    successFactors: ["Executive sponsorship", "Cross-functional team", "Change management"],
    teamStructure: {
      "Project Manager": 1,
      "Business Analysts": 4,
      "Data Analysts": 3,
      "Software Engineers": 3,
      "Operations Specialists": 4,
    },
    budgetBreakdown: {
      Personnel: 65,
      "Software/Systems": 20,
      Training: 10,
      Contingency: 5,
    },
  },
  {
    id: "bd-3",
    title: "Regulatory Compliance Automation",
    domain: "Compliance",
    budget: 1800000,
    duration: 12,
    teamSize: 8,
    technologies: ["Java", "Spring Boot", "PostgreSQL", "Angular", "Docker"],
    businessDrivers: ["Compliance efficiency", "Risk reduction", "Audit readiness"],
    outcomes: {
      costSavings: 800000,
      timeReduction: 60,
      efficiencyGain: 45,
      roi: 144,
    },
    risks: ["Regulatory changes", "Legacy system integration", "User adoption"],
    successFactors: ["Regulatory expertise", "Iterative development", "User training"],
    teamStructure: {
      "Project Manager": 1,
      "Compliance Specialists": 2,
      "Software Engineers": 3,
      "QA Engineers": 2,
    },
    budgetBreakdown: {
      Personnel: 75,
      Infrastructure: 12,
      "Compliance Tools": 8,
      Contingency: 5,
    },
  },
]

const industryBenchmarks = {
  "Clinical Research": {
    avgBudget: 2500000,
    avgDuration: 16,
    avgTeamSize: 10,
    avgROI: 145,
    commonTechnologies: ["Python", "R", "AWS", "TensorFlow", "React"],
  },
  Operations: {
    avgBudget: 2800000,
    avgDuration: 20,
    avgTeamSize: 12,
    avgROI: 165,
    commonTechnologies: ["SAP", "Tableau", "Power BI", "Oracle", "Python"],
  },
  Compliance: {
    avgBudget: 1600000,
    avgDuration: 14,
    avgTeamSize: 8,
    avgROI: 135,
    commonTechnologies: ["Java", "Spring", "Angular", "PostgreSQL", "Docker"],
  },
}

async function findSimilarProjects(description: string, filters?: any) {
  // Simple keyword matching for demo
  const keywords = description.toLowerCase().split(" ")

  const scored = businessProjectsDB.map((project) => {
    let score = 0

    // Check title and domain
    keywords.forEach((keyword) => {
      if (project.title.toLowerCase().includes(keyword)) score += 3
      if (project.domain.toLowerCase().includes(keyword)) score += 2
      if (project.businessDrivers.some((driver) => driver.toLowerCase().includes(keyword))) score += 2
      if (project.technologies.some((tech) => tech.toLowerCase().includes(keyword))) score += 1
    })

    return { ...project, similarity: Math.min(95, Math.max(60, score * 10)) }
  })

  return scored.sort((a, b) => b.similarity - a.similarity).slice(0, 5)
}

async function generateBusinessCase(projectData: any) {
  return {
    executiveSummary: {
      objective: projectData.objective || "Transform business operations through technology innovation",
      investment: projectData.budget || 2000000,
      expectedROI: projectData.expectedROI || 150,
      timeline: projectData.timeline || 18,
    },
    marketAnalysis: {
      industryTrends: ["Digital transformation", "AI/ML adoption", "Cloud migration"],
      competitiveAdvantage: "First-mover advantage in automated processes",
      marketSize: "$2.5B addressable market",
    },
    financialProjection: {
      year1: { investment: 1200000, savings: 300000, netBenefit: -900000 },
      year2: { investment: 800000, savings: 1500000, netBenefit: 700000 },
      year3: { investment: 200000, savings: 2000000, netBenefit: 1800000 },
    },
    riskAssessment: {
      technical: "Medium - proven technologies",
      financial: "Low - conservative estimates",
      operational: "Medium - change management required",
    },
  }
}

async function recommendTeamStructure(projectType: string, budget: number, duration: number) {
  const baseRoles = {
    "Project Manager": { count: 1, monthlyCost: 15000 },
    "Technical Lead": { count: 1, monthlyCost: 18000 },
    "Software Engineers": { count: Math.ceil(budget / 500000), monthlyCost: 12000 },
    "QA Engineers": { count: Math.ceil(budget / 1000000), monthlyCost: 10000 },
    "DevOps Engineer": { count: 1, monthlyCost: 14000 },
  }

  // Adjust based on project type
  if (projectType.toLowerCase().includes("data") || projectType.toLowerCase().includes("analytics")) {
    baseRoles["Data Scientists"] = { count: 2, monthlyCost: 16000 }
    baseRoles["Data Engineers"] = { count: 2, monthlyCost: 14000 }
  }

  if (projectType.toLowerCase().includes("compliance") || projectType.toLowerCase().includes("regulatory")) {
    baseRoles["Compliance Specialists"] = { count: 2, monthlyCost: 13000 }
  }

  const totalMonthlyCost = Object.values(baseRoles).reduce((sum, role) => sum + role.count * role.monthlyCost, 0)

  return {
    roles: baseRoles,
    totalMonthlyCost,
    totalProjectCost: totalMonthlyCost * duration,
    utilizationRate: 0.85,
    recommendations: [
      "Consider hybrid team with contractors for specialized skills",
      "Plan for 15% buffer in team size for knowledge transfer",
      "Include change management resources for user adoption",
    ],
  }
}

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = streamText({
    model: openai("gpt-4o"),
    messages,
    system: `You are AskArko, a specialized Business Development AI assistant for the Articulus project within Amgen Operations.

Your expertise includes:
- Finding and analyzing similar projects for business case development
- Generating comprehensive business development materials (presentations, budgets, team structures)
- Providing data-driven insights on project success factors and risks
- Creating financial projections and ROI analysis
- Recommending optimal team structures and resource allocation
- Identifying industry benchmarks and best practices

Key capabilities:
- Search historical project database for similar initiatives
- Generate executive presentations and technical specifications
- Create detailed budget breakdowns and resource plans
- Analyze success patterns and risk factors from past projects
- Provide strategic recommendations based on data insights

Guidelines:
- Always ground recommendations in data from similar projects
- Provide specific, actionable insights with quantified benefits
- Include both optimistic and realistic scenarios in projections
- Highlight key success factors and potential risks
- Suggest concrete next steps for project planning
- Format responses for business stakeholders (clear, concise, data-driven)

Remember: Your goal is to accelerate business development by leveraging insights from Amgen Operations' project history and best practices.`,

    tools: {
      findSimilarProjects: tool({
        description: "Search for projects similar to the proposed initiative to inform business case development",
        parameters: z.object({
          description: z.string().describe("Description of the proposed project or initiative"),
          domain: z.string().optional().describe("Business domain (e.g., Clinical Research, Operations, Compliance)"),
          budgetRange: z.string().optional().describe("Expected budget range"),
          includeMetrics: z.boolean().default(true).describe("Include detailed success metrics and outcomes"),
        }),
        execute: async ({ description, domain, budgetRange, includeMetrics }) => {
          const projects = await findSimilarProjects(description, { domain, budgetRange })

          if (includeMetrics) {
            return projects.map((project) => ({
              ...project,
              benchmarkData: industryBenchmarks[project.domain as keyof typeof industryBenchmarks],
            }))
          }

          return projects
        },
      }),

      generateBusinessCase: tool({
        description: "Generate a comprehensive business case including financial projections and risk analysis",
        parameters: z.object({
          projectTitle: z.string().describe("Title of the proposed project"),
          objective: z.string().describe("Primary business objective"),
          budget: z.number().describe("Proposed budget in USD"),
          timeline: z.number().describe("Project timeline in months"),
          domain: z.string().describe("Business domain"),
        }),
        execute: async ({ projectTitle, objective, budget, timeline, domain }) => {
          const businessCase = await generateBusinessCase({
            title: projectTitle,
            objective,
            budget,
            timeline,
            domain,
          })

          return {
            ...businessCase,
            benchmarks: industryBenchmarks[domain as keyof typeof industryBenchmarks],
            similarProjects: await findSimilarProjects(objective),
          }
        },
      }),

      recommendTeamStructure: tool({
        description: "Recommend optimal team structure and resource allocation based on project requirements",
        parameters: z.object({
          projectType: z.string().describe("Type of project (e.g., data analytics, compliance automation)"),
          budget: z.number().describe("Total project budget"),
          duration: z.number().describe("Project duration in months"),
          complexity: z.enum(["low", "medium", "high"]).describe("Project complexity level"),
        }),
        execute: async ({ projectType, budget, duration, complexity }) => {
          const teamStructure = await recommendTeamStructure(projectType, budget, duration)

          // Adjust for complexity
          const complexityMultiplier = complexity === "high" ? 1.3 : complexity === "medium" ? 1.1 : 1.0

          return {
            ...teamStructure,
            adjustedForComplexity: {
              multiplier: complexityMultiplier,
              adjustedCost: teamStructure.totalProjectCost * complexityMultiplier,
              reasoning: `${complexity} complexity projects typically require ${Math.round((complexityMultiplier - 1) * 100)}% additional resources`,
            },
          }
        },
      }),

      analyzeSuccessFactors: tool({
        description: "Analyze success factors and risks based on historical project data",
        parameters: z.object({
          projectDomain: z.string().describe("Project domain to analyze"),
          includeRisks: z.boolean().default(true).describe("Include risk analysis"),
        }),
        execute: async ({ projectDomain, includeRisks }) => {
          const domainProjects = businessProjectsDB.filter((p) =>
            p.domain.toLowerCase().includes(projectDomain.toLowerCase()),
          )

          const successFactors = [...new Set(domainProjects.flatMap((p) => p.successFactors))]
          const risks = includeRisks ? [...new Set(domainProjects.flatMap((p) => p.risks))] : []

          const avgROI = domainProjects.reduce((sum, p) => sum + p.outcomes.roi, 0) / domainProjects.length
          const avgDuration = domainProjects.reduce((sum, p) => sum + p.duration, 0) / domainProjects.length

          return {
            successFactors: successFactors.map((factor) => ({
              factor,
              frequency: domainProjects.filter((p) => p.successFactors.includes(factor)).length,
              impact: "High", // Simplified for demo
            })),
            risks: risks.map((risk) => ({
              risk,
              frequency: domainProjects.filter((p) => p.risks.includes(risk)).length,
              severity: "Medium", // Simplified for demo
            })),
            benchmarks: {
              averageROI: Math.round(avgROI),
              averageDuration: Math.round(avgDuration),
              sampleSize: domainProjects.length,
            },
          }
        },
      }),

      generatePresentationOutline: tool({
        description: "Generate outline for executive presentation or technical specification document",
        parameters: z.object({
          documentType: z
            .enum(["executive", "technical", "financial", "team"])
            .describe("Type of document to generate"),
          projectTitle: z.string().describe("Project title"),
          audience: z.string().describe("Target audience (e.g., executives, technical team, stakeholders)"),
        }),
        execute: async ({ documentType, projectTitle, audience }) => {
          const outlines = {
            executive: {
              title: `${projectTitle} - Executive Summary`,
              slides: [
                "Executive Summary & Key Recommendations",
                "Business Problem & Opportunity",
                "Proposed Solution Overview",
                "Financial Impact & ROI Analysis",
                "Implementation Timeline & Milestones",
                "Team Structure & Resource Requirements",
                "Risk Assessment & Mitigation",
                "Success Metrics & KPIs",
                "Investment Request & Next Steps",
              ],
            },
            technical: {
              title: `${projectTitle} - Technical Architecture`,
              sections: [
                "Technical Requirements & Constraints",
                "System Architecture Overview",
                "Technology Stack & Rationale",
                "Data Architecture & Flow",
                "Security & Compliance Considerations",
                "Integration Points & APIs",
                "Scalability & Performance",
                "Development & Deployment Strategy",
                "Testing & Quality Assurance",
                "Monitoring & Maintenance",
              ],
            },
            financial: {
              title: `${projectTitle} - Financial Analysis`,
              sections: [
                "Investment Summary",
                "Cost Breakdown Analysis",
                "Revenue/Savings Projections",
                "ROI & Payback Analysis",
                "Sensitivity Analysis",
                "Funding Requirements",
                "Budget Timeline",
                "Cost-Benefit Comparison",
              ],
            },
            team: {
              title: `${projectTitle} - Team Structure & RACI`,
              sections: [
                "Organizational Structure",
                "Role Definitions & Responsibilities",
                "RACI Matrix",
                "Reporting Structure",
                "Communication Plan",
                "Resource Allocation",
                "Skills Assessment & Training",
                "Performance Metrics",
              ],
            },
          }

          return {
            ...outlines[documentType],
            audience,
            estimatedPages: documentType === "executive" ? 12 : documentType === "technical" ? 24 : 8,
            deliveryFormat: ["PowerPoint", "PDF", "Interactive Dashboard"],
          }
        },
      }),
    },
  })

  return result.toDataStreamResponse()
}
