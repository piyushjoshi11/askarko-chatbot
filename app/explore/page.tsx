"use client"

import { useChat } from "@ai-sdk/react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Send, Bot, User, Search, Filter, TrendingUp, Users, Code, Database, Cloud, Brain } from "lucide-react"
import { PageHeader } from "../components/page-header"
import { cn } from "@/lib/utils"

export default function ExplorePage() {
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("chat")

   const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/chat/explore",
    initialMessages: [
      {
        id: "welcome",
        role: "assistant",
        content: `Welcome to Domain Explorer! I'm AskArko, and I can help you discover projects, technologies, and insights across different domains within Amgen Operations.

You can explore by:
• Technology Stack - "Show me all Python projects" or "What teams use Kubernetes?"
• Teams & Departments - "What is the Data Engineering team working on?"
• Project Types - "Find all analytics projects" or "Show me automation initiatives"
• Business Domains - "What's happening in clinical research?" or "Supply chain projects"

What domain would you like to explore today?`,
      },
    ],
  })

  const domains = [
    {
      id: "data-engineering",
      name: "Data Engineering",
      icon: <Database className="w-6 h-6" />,
      color: "bg-cyan-900 text-cyan-300 border-cyan-700",
      projects: 12,
      technologies: ["Python", "Spark", "AWS", "Airflow"],
      description: "Data pipelines, ETL processes, and data infrastructure",
    },
    {
      id: "ai-ml",
      name: "AI & Machine Learning",
      icon: <Brain className="w-6 h-6" />,
      color: "bg-purple-900 text-purple-300 border-purple-700",
      projects: 8,
      technologies: ["TensorFlow", "PyTorch", "MLflow", "Kubernetes"],
      description: "ML models, AI applications, and MLOps platforms",
    },
    {
      id: "cloud-infrastructure",
      name: "Cloud Infrastructure",
      icon: <Cloud className="w-6 h-6" />,
      color: "bg-green-900 text-green-300 border-green-700",
      projects: 15,
      technologies: ["AWS", "Docker", "Kubernetes", "Terraform"],
      description: "Cloud platforms, containerization, and DevOps",
    },
    {
      id: "application-development",
      name: "Application Development",
      icon: <Code className="w-6 h-6" />,
      color: "bg-orange-900 text-orange-300 border-orange-700",
      projects: 18,
      technologies: ["React", "Node.js", "Java", "Spring"],
      description: "Web applications, APIs, and software development",
    },
  ]

  const trendingTopics = [
    { topic: "Kubernetes Migration", mentions: 24, trend: "+15%" },
    { topic: "ML Model Deployment", mentions: 18, trend: "+22%" },
    { topic: "Data Pipeline Optimization", mentions: 16, trend: "+8%" },
    { topic: "API Modernization", mentions: 14, trend: "+12%" },
    { topic: "Cloud Security", mentions: 12, trend: "+18%" },
  ]

  const quickQueries = [
    "What are the most popular technologies across all teams?",
    "Show me recent projects in clinical data analysis",
    "Which teams are working on automation initiatives?",
    "What are the biggest challenges mentioned in project presentations?",
    "Find projects that improved operational efficiency",
  ]

  const handleDomainSelect = (domainId: string) => {
    setSelectedDomain(domainId)
    const domain = domains.find((d) => d.id === domainId)
    if (domain) {
      const query = `Tell me about projects in ${domain.name}`
      handleQuickQuery(query)
    }
  }

  const handleQuickQuery = (query: string) => {
    const syntheticEvent = {
      preventDefault: () => {},
      target: { elements: { message: { value: query } } },
    } as any

    handleSubmit(syntheticEvent)
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <PageHeader title="Explore Domains" subtitle="Discover projects across teams and technologies" showBack />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Domain Cards */}
            <Card className="card-dark">
              <CardHeader>
                <CardTitle className="text-lg text-white">Domains</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {domains.map((domain) => (
                  <div
                    key={domain.id}
                    className={cn(
                      "p-3 rounded-lg cursor-pointer transition-all hover:opacity-80 border",
                      selectedDomain === domain.id ? "ring-2 ring-purple-500" : "",
                      domain.color,
                    )}
                    onClick={() => handleDomainSelect(domain.id)}
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      {domain.icon}
                      <div>
                        <div className="font-medium text-sm">{domain.name}</div>
                        <div className="text-xs opacity-75">{domain.projects} projects</div>
                      </div>
                    </div>
                    <p className="text-xs opacity-75 mb-2">{domain.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {domain.technologies.slice(0, 2).map((tech, index) => (
                        <Badge key={index} variant="secondary" className="text-xs bg-gray-800 text-gray-300">
                          {tech}
                        </Badge>
                      ))}
                      {domain.technologies.length > 2 && (
                        <Badge variant="secondary" className="text-xs bg-gray-800 text-gray-300">
                          +{domain.technologies.length - 2}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Trending Topics */}
            <Card className="card-dark">
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2 text-white">
                  <TrendingUp className="w-5 h-5 text-purple-400" />
                  <span>Trending</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {trendingTopics.map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div>
                      <div className="font-medium text-sm text-white">{item.topic}</div>
                      <div className="text-xs text-gray-400">{item.mentions} mentions</div>
                    </div>
                    <Badge variant="secondary" className="text-xs text-cyan-400 bg-cyan-900">
                      {item.trend}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Queries */}
            <Card className="card-dark">
              <CardHeader>
                <CardTitle className="text-lg text-white">Quick Queries</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {quickQueries.map((query, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickQuery(query)}
                    className="w-full text-left p-2 text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading}
                  >
                    "{query}"
                  </button>
                ))
                }
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card className="h-[calc(100vh-12rem)] card-dark">
              <CardHeader className="border-b border-gray-800">
                <CardTitle className="flex items-center space-x-2 text-white">
                  <Search className="w-5 h-5 text-cyan-400" />
                  <span>Domain Explorer</span>
                </CardTitle>
              </CardHeader>

              <CardContent className="p-0 h-full">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
                  <div className="border-b border-gray-800 px-4 pt-4">
                    <TabsList className="bg-gray-800">
                      <TabsTrigger value="chat" className="data-[state=active]:bg-gray-700 text-gray-300">
                        AI Chat
                      </TabsTrigger>
                      <TabsTrigger value="insights" className="data-[state=active]:bg-gray-700 text-gray-300">
                        Insights
                      </TabsTrigger>
                      <TabsTrigger value="network" className="data-[state=active]:bg-gray-700 text-gray-300">
                        Team Network
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent value="chat" className="flex-1 m-0">
                    <div className="flex flex-col h-full">
                      {/* Messages */}
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

                      {/* Input Form */}
                      <div className="border-t border-gray-800 p-4">
                        <form onSubmit={handleSubmit} className="flex space-x-2">
                          <Input
                            value={input}
                            onChange={handleInputChange}
                            placeholder="Explore domains, technologies, teams, or ask about cross-team insights..."
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

                  <TabsContent value="insights" className="flex-1 p-4 overflow-auto">
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card className="card-dark">
                          <CardHeader>
                            <CardTitle className="text-lg text-white">Technology Adoption</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              {[
                                { tech: "Python", usage: 85, projects: 28 },
                                { tech: "AWS", usage: 72, projects: 24 },
                                { tech: "Docker", usage: 68, projects: 22 },
                                { tech: "React", usage: 45, projects: 15 },
                              ].map((item, index) => (
                                <div key={index} className="space-y-1">
                                  <div className="flex justify-between text-sm">
                                    <span className="text-white">{item.tech}</span>
                                    <span className="text-gray-400">{item.projects} projects</span>
                                  </div>
                                  <div className="w-full bg-gray-700 rounded-full h-2">
                                    <div
                                      className="bg-purple-500 h-2 rounded-full"
                                      style={{ width: `${item.usage}%` }}
                                    ></div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="card-dark">
                          <CardHeader>
                            <CardTitle className="text-lg text-white">Team Collaboration</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              {[
                                { teams: "Data Eng ↔ AI/ML", projects: 8 },
                                { teams: "Platform ↔ DevOps", projects: 6 },
                                { teams: "Analytics ↔ Business", projects: 5 },
                                { teams: "Security ↔ Platform", projects: 4 },
                              ].map((item, index) => (
                                <div key={index} className="flex justify-between items-center p-2 bg-gray-800 rounded">
                                  <span className="text-sm text-white">{item.teams}</span>
                                  <Badge variant="secondary" className="bg-gray-700 text-gray-300">
                                    {item.projects} projects
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="network" className="flex-1 p-4">
                    <div className="text-center py-8">
                      <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-white mb-2">Team Network Visualization</h3>
                      <p className="text-gray-400 mb-4">
                        Interactive network showing team collaborations and project connections
                      </p>
                      <Button variant="outline" className="btn-secondary bg-transparent">
                        <Filter className="w-4 h-4 mr-2" />
                        Configure Network View
                      </Button>
                    </div>
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
