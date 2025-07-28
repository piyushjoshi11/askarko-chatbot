"use client"

import { useState } from "react"
import { useChat } from "ai/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  Download,
  FileText,
  PresentationIcon as PresentationChart,
  Users,
  DollarSign,
  Bot,
  User,
  Send,
  TrendingUp,
  BarChart3,
  PieChart,
  CheckCircle,
} from "lucide-react"

import { PageHeader } from "../components/page-header"
import { cn } from "@/lib/utils"

export default function BusinessDevelopmentPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedProjects, setSelectedProjects] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState("search")

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/chat/business-development",
    initialMessages: [
      {
        id: "welcome",
        role: "assistant",
        content: `Hello! I'm AskArko, your Business Development Assistant. I can help you:

• Find Similar Projects - Discover projects with similar scope, technology, or objectives
• Analyze Data - Get insights from past projects including budgets, timelines, and outcomes  
• Generate Materials - Create presentations, technical specs, and business cases
• Team Recommendations - Suggest optimal team structures based on successful projects

What type of initiative are you planning? Describe your project and I'll help you find relevant insights and generate the materials you need.`,
      },
    ],
  })

  const similarProjects = [
    {
      id: "proj-1",
      title: "Clinical Data Analytics Platform",
      team: "Data Science",
      similarity: 92,
      budget: "$2.3M",
      duration: "18 months",
      technologies: ["Python", "AWS", "TensorFlow", "React"],
      outcomes: "40% faster clinical trial analysis, $1.2M cost savings",
      keyLearnings: "Cloud-first architecture essential for scalability",
      riskFactors: ["Data compliance", "Integration complexity"],
      successFactors: ["Strong stakeholder engagement", "Agile methodology"],
    },
    {
      id: "proj-2",
      title: "Regulatory Compliance Automation",
      team: "Compliance Tech",
      similarity: 87,
      budget: "$1.8M",
      duration: "12 months",
      technologies: ["Java", "Spring Boot", "PostgreSQL", "Angular"],
      outcomes: "60% reduction in compliance reporting time",
      keyLearnings: "Stakeholder engagement critical for regulatory projects",
      riskFactors: ["Regulatory changes", "Legacy system integration"],
      successFactors: ["Regulatory expertise", "Iterative development"],
    },
    {
      id: "proj-3",
      title: "Supply Chain Optimization",
      team: "Operations",
      similarity: 78,
      budget: "$3.1M",
      duration: "24 months",
      technologies: ["R", "Tableau", "SAP", "Power BI"],
      outcomes: "25% improvement in supply chain efficiency",
      keyLearnings: "Integration complexity often underestimated",
      riskFactors: ["Vendor dependencies", "Change management"],
      successFactors: ["Executive sponsorship", "Cross-functional team"],
    },
  ]

  const generatedAssets = [
    {
      type: "presentation",
      title: "Executive Summary Presentation",
      description: "High-level overview for stakeholders",
      pages: 12,
      status: "ready",
      icon: <PresentationChart className="w-5 h-5 text-cyan-400" />,
    },
    {
      type: "technical",
      title: "Technical Architecture Deck",
      description: "Detailed technical approach and stack",
      pages: 24,
      status: "ready",
      icon: <FileText className="w-5 h-5 text-purple-400" />,
    },
    {
      type: "financial",
      title: "Budget & Resource Plan",
      description: "Cost breakdown and resource allocation",
      pages: 8,
      status: "ready",
      icon: <DollarSign className="w-5 h-5 text-cyan-400" />,
    },
    {
      type: "team",
      title: "Team Structure & RACI",
      description: "Recommended team composition",
      pages: 6,
      status: "ready",
      icon: <Users className="w-5 h-5 text-purple-400" />,
    },
  ]

  const handleProjectSelect = (projectId: string) => {
    setSelectedProjects((prev) =>
      prev.includes(projectId) ? prev.filter((id) => id !== projectId) : [...prev, projectId],
    )
  }

  const handleGenerateAssets = () => {
    setCurrentStep(3)
    setTimeout(() => setCurrentStep(4), 2000)
  }

  const progressSteps = [
    { id: 1, title: "Find Similar Projects", description: "Discover relevant past projects" },
    { id: 2, title: "Analyze & Summarize", description: "Extract insights and patterns" },
    { id: 3, title: "Generate Materials", description: "Create business documents" },
    { id: 4, title: "Download Assets", description: "Get your deliverables" },
  ]

  return (
    <div className="min-h-screen bg-gray-900">
      <PageHeader
        title="Business Development"
        subtitle="AI-powered project planning and material generation"
        showBack
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            {progressSteps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex flex-col items-center ${index < progressSteps.length - 1 ? "flex-1" : ""}`}>
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium mb-2",
                      currentStep >= step.id ? "bg-purple-600 text-white" : "bg-gray-700 text-gray-400",
                    )}
                  >
                    {currentStep > step.id ? <CheckCircle className="w-5 h-5" /> : step.id}
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-sm text-white">{step.title}</div>
                    <div className="text-xs text-gray-400">{step.description}</div>
                  </div>
                </div>
                {index < progressSteps.length - 1 && (
                  <div className={cn("flex-1 h-1 mx-4", currentStep > step.id ? "bg-purple-600" : "bg-gray-700")}></div>
                )}
              </div>
            ))}
          </div>
          <Progress value={(currentStep / 4) * 100} className="h-2" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="card-dark">
              <CardHeader>
                <CardTitle className="text-lg text-white">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start btn-secondary bg-transparent"
                  onClick={() => setActiveTab("search")}
                >
                  <Search className="w-4 h-4 mr-2" />
                  Find Similar Projects
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start btn-secondary bg-transparent"
                  onClick={() => setActiveTab("analyze")}
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Analyze Patterns
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start btn-secondary bg-transparent"
                  onClick={() => setActiveTab("generate")}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Generate Materials
                </Button>
              </CardContent>
            </Card>

            {selectedProjects.length > 0 && (
              <Card className="card-dark">
                <CardHeader>
                  <CardTitle className="text-lg text-white">Selected Projects</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {selectedProjects.map((projectId) => {
                      const project = similarProjects.find((p) => p.id === projectId)
                      return project ? (
                        <div key={projectId} className="p-2 bg-gray-800 rounded text-sm">
                          <div className="font-medium text-white">{project.title}</div>
                          <div className="text-xs text-gray-400">{project.team}</div>
                        </div>
                      ) : null
                    })}
                  </div>
                  <Button
                    className="w-full mt-3 btn-primary"
                    onClick={handleGenerateAssets}
                    disabled={selectedProjects.length === 0}
                  >
                    Generate Materials
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card className="h-[calc(100vh-20rem)] card-dark">
              <CardContent className="p-0 h-full">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
                  <div className="border-b border-gray-800 px-4 pt-4">
                    <TabsList className="bg-gray-800">
                      <TabsTrigger value="search" className="data-[state=active]:bg-gray-700 text-gray-300">
                        Project Search
                      </TabsTrigger>
                      <TabsTrigger value="chat" className="data-[state=active]:bg-gray-700 text-gray-300">
                        AI Assistant
                      </TabsTrigger>
                      <TabsTrigger value="analyze" className="data-[state=active]:bg-gray-700 text-gray-300">
                        Analysis
                      </TabsTrigger>
                      <TabsTrigger value="generate" className="data-[state=active]:bg-gray-700 text-gray-300">
                        Generate
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent value="search" className="flex-1 p-6 overflow-auto m-0">
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Project Description</label>
                          <Textarea
                            placeholder="Describe your new initiative, including objectives, scope, target outcomes, and any specific requirements..."
                            rows={4}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Domain/Area</label>
                            <Input
                              placeholder="e.g., Clinical, Manufacturing, IT"
                              className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Budget Range</label>
                            <Input
                              placeholder="e.g., $1M - $5M"
                              className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Timeline</label>
                            <Input
                              placeholder="e.g., 12-18 months"
                              className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                            />
                          </div>
                        </div>
                      </div>

                      {searchQuery && (
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-white">Similar Projects Found</h3>
                          <div className="space-y-4">
                            {similarProjects.map((project) => (
                              <Card
                                key={project.id}
                                className={cn(
                                  "cursor-pointer transition-all card-dark",
                                  selectedProjects.includes(project.id)
                                    ? "ring-2 ring-purple-500 bg-gray-800"
                                    : "hover:bg-gray-800",
                                )}
                                onClick={() => handleProjectSelect(project.id)}
                              >
                                <CardContent className="p-4">
                                  <div className="flex justify-between items-start mb-3">
                                    <div>
                                      <h3 className="font-semibold text-lg text-white">{project.title}</h3>
                                      <p className="text-gray-400">{project.team}</p>
                                    </div>
                                    <div className="text-right">
                                      <Badge
                                        variant={
                                          project.similarity >= 90
                                            ? "default"
                                            : project.similarity >= 80
                                              ? "secondary"
                                              : "outline"
                                        }
                                        className="mb-2 bg-purple-600 text-white"
                                      >
                                        {project.similarity}% match
                                      </Badge>
                                      <div className="text-sm text-gray-400">
                                        {project.budget} • {project.duration}
                                      </div>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                                    <div>
                                      <h4 className="font-medium text-sm text-gray-300 mb-1">Technologies</h4>
                                      <div className="flex flex-wrap gap-1">
                                        {project.technologies.map((tech, index) => (
                                          <Badge
                                            key={index}
                                            variant="outline"
                                            className="text-xs bg-gray-700 text-gray-300 border-gray-600"
                                          >
                                            {tech}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                    <div>
                                      <h4 className="font-medium text-sm text-gray-300 mb-1">Outcomes</h4>
                                      <p className="text-sm text-gray-400">{project.outcomes}</p>
                                    </div>
                                  </div>

                                  <div className="text-sm">
                                    <div className="mb-2">
                                      <span className="font-medium text-gray-300">Key Learning: </span>
                                      <span className="text-gray-400">{project.keyLearnings}</span>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="chat" className="flex-1 m-0">
                    <div className="flex flex-col h-full">
                      <ScrollArea className="flex-1 p-4">
                        <div className="space-y-4">
                          {messages.map((message) => (
                            <div
                              key={message.id}
                              className={`flex items-start space-x-3 ${
                                message.role === "user" ? "flex-row-reverse space-x-reverse" : ""
                              }`}
                            >
                              <Avatar className="w-8 h-8">
                                <AvatarFallback
                                  className={
                                    message.role === "user" ? "bg-purple-600 text-white" : "bg-cyan-600 text-white"
                                  }
                                >
                                  {message.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                                </AvatarFallback>
                              </Avatar>

                              <div className={`flex-1 max-w-3xl ${message.role === "user" ? "text-right" : ""}`}>
                                <div
                                  className={`inline-block p-4 rounded-lg ${
                                    message.role === "user" ? "bg-purple-600 text-white" : "bg-gray-800 text-gray-100"
                                  }`}
                                >
                                  <div className="whitespace-pre-wrap">{message.content}</div>
                                </div>
                              </div>
                            </div>
                          ))}

                          {isLoading && (
                            <div className="flex items-start space-x-3">
                              <Avatar className="w-8 h-8">
                                <AvatarFallback className="bg-cyan-600 text-white">
                                  <Bot className="w-4 h-4" />
                                </AvatarFallback>
                              </Avatar>
                              <div className="bg-gray-800 p-4 rounded-lg">
                                <div className="flex space-x-1">
                                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                  <div
                                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                    style={{ animationDelay: "0.1s" }}
                                  ></div>
                                  <div
                                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                    style={{ animationDelay: "0.2s" }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </ScrollArea>

                      <div className="border-t border-gray-800 p-4">
                        <form onSubmit={handleSubmit} className="flex space-x-2">
                          <Input
                            value={input}
                            onChange={handleInputChange}
                            placeholder="Ask about project planning, budgets, team structures, or risk analysis..."
                            className="flex-1 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-purple-500"
                            disabled={isLoading}
                          />
                          <Button type="submit" disabled={isLoading || !input.trim()} className="btn-primary">
                            <Send className="w-4 h-4" />
                          </Button>
                        </form>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="analyze" className="flex-1 p-6 overflow-auto m-0">
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="card-dark">
                          <CardHeader>
                            <CardTitle className="text-lg flex items-center space-x-2 text-white">
                              <TrendingUp className="w-5 h-5 text-cyan-400" />
                              <span>Success Patterns</span>
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              <div className="p-3 bg-green-900 rounded border border-green-700">
                                <div className="font-medium text-sm text-green-300">Strong Executive Sponsorship</div>
                                <div className="text-xs text-green-400">Found in 85% of successful projects</div>
                              </div>
                              <div className="p-3 bg-green-900 rounded border border-green-700">
                                <div className="font-medium text-sm text-green-300">Agile Methodology</div>
                                <div className="text-xs text-green-400">Reduced delivery time by 30%</div>
                              </div>
                              <div className="p-3 bg-green-900 rounded border border-green-700">
                                <div className="font-medium text-sm text-green-300">Cross-functional Teams</div>
                                <div className="text-xs text-green-400">Improved collaboration and outcomes</div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="card-dark">
                          <CardHeader>
                            <CardTitle className="text-lg flex items-center space-x-2 text-white">
                              <PieChart className="w-5 h-5 text-red-400" />
                              <span>Risk Factors</span>
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              <div className="p-3 bg-red-900 rounded border border-red-700">
                                <div className="font-medium text-sm text-red-300">Integration Complexity</div>
                                <div className="text-xs text-red-400">Most common cause of delays</div>
                              </div>
                              <div className="p-3 bg-red-900 rounded border border-red-700">
                                <div className="font-medium text-sm text-red-300">Scope Creep</div>
                                <div className="text-xs text-red-400">Average 25% budget increase</div>
                              </div>
                              <div className="p-3 bg-red-900 rounded border border-red-700">
                                <div className="font-medium text-sm text-red-300">Regulatory Changes</div>
                                <div className="text-xs text-red-400">Requires adaptive planning</div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="generate" className="flex-1 p-6 overflow-auto m-0">
                    {currentStep >= 4 ? (
                      <div className="space-y-6">
                        <div className="text-center">
                          <CheckCircle className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
                          <h3 className="text-xl font-bold text-white mb-2">Materials Generated Successfully!</h3>
                          <p className="text-gray-400">Your business development materials are ready for download.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {generatedAssets.map((asset, index) => (
                            <Card key={index} className="card-dark hover:bg-gray-800 transition-all">
                              <CardContent className="p-4">
                                <div className="flex items-start space-x-3">
                                  {asset.icon}
                                  <div className="flex-1">
                                    <h4 className="font-semibold text-white">{asset.title}</h4>
                                    <p className="text-sm text-gray-400 mb-2">{asset.description}</p>
                                    <div className="flex items-center justify-between">
                                      <Badge variant="secondary" className="bg-gray-700 text-gray-300">
                                        {asset.pages} pages
                                      </Badge>
                                      <Button size="sm" className="btn-primary">
                                        <Download className="w-4 h-4 mr-1" />
                                        Download
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-white mb-2">Ready to Generate Materials</h3>
                        <p className="text-gray-400 mb-6">
                          Select similar projects and I'll generate comprehensive business development materials for
                          your initiative.
                        </p>
                        <Button
                          onClick={handleGenerateAssets}
                          disabled={selectedProjects.length === 0}
                          size="lg"
                          className="btn-primary"
                        >
                          Generate Materials
                        </Button>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
