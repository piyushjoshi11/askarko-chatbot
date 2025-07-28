"use client"

import { useChat } from "ai/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Send, Bot, User, Lightbulb, FileText, Users, MessageSquare, BookOpen, Target } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { PageHeader } from "../components/page-header"
import { cn } from "@/lib/utils"

export default function LearnPage() {
  const searchParams = useSearchParams()
  const isGuest = searchParams.get("mode") === "guest"

  const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages } = useChat({
    api: "/api/chat/learn",
    initialMessages: [
      {
        id: "welcome",
        role: "assistant",
        content: `Hello! I'm AskArko, your AI assistant for learning about Amgen Operations projects. I can help you understand any project in our knowledge base.

${isGuest ? "**Note: You're using guest access with limited functionality.**" : ""}

What project would you like to learn about today? You can ask me about:
• Project objectives and business context
• Technology stacks and architecture
• Team members and stakeholders  
• Implementation details and outcomes
• Related projects and best practices

Feel free to ask anything!`,
      },
    ],
  })

  const quickSuggestions = [
    {
      category: "Popular Projects",
      items: [
        "Tell me about the Data Pipeline Optimization project",
        "What's the ML Model Deployment Platform about?",
        "Explain the API Gateway Migration project",
      ],
    },
    {
      category: "Technology Focus",
      items: ["Show me all Python-based projects", "What projects use Kubernetes?", "Which teams work with AWS?"],
    },
    {
      category: "Learning Paths",
      items: [
        "I'm new to data engineering, what should I learn?",
        "Suggest projects for someone interested in ML",
        "What are the best practices for API development?",
      ],
    },
  ]

  const relatedResources = [
    {
      title: "Project Documentation",
      icon: <FileText className="w-4 h-4 text-cyan-400" />,
      count: 24,
      description: "Technical specs and guides",
    },
    {
      title: "Team Contacts",
      icon: <Users className="w-4 h-4 text-purple-400" />,
      count: 47,
      description: "Connect with project teams",
    },
    {
      title: "Video Presentations",
      icon: <BookOpen className="w-4 h-4 text-cyan-400" />,
      count: 18,
      description: "Recorded Articulus sessions",
    },
  ]

  const handleSuggestionClick = (suggestion: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        role: "user",
        content: suggestion,
      },
    ])

    const syntheticEvent = {
      preventDefault: () => {},
      target: { elements: { message: { value: suggestion } } },
    } as any

    handleSubmit(syntheticEvent)
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <PageHeader
        title="Learn a Project"
        subtitle="AI-powered project exploration"
        showBack
        badges={[
          {
            text: isGuest ? "Guest Mode" : "AI-Powered",
            variant: "secondary",
          },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Suggestions */}
            <Card className="card-dark">
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2 text-white">
                  <Lightbulb className="w-5 h-5 text-purple-400" />
                  <span>Quick Start</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {quickSuggestions.map((category, categoryIndex) => (
                  <div key={categoryIndex} className="space-y-2">
                    <h4 className="font-medium text-sm text-gray-300">{category.category}</h4>
                    <div className="space-y-1">
                      {category.items.map((item, itemIndex) => (
                        <Button
                          key={itemIndex}
                          onClick={() => handleSuggestionClick(item)}
                          variant="outline"
                          className="w-full justify-start text-sm btn-secondary text-left h-auto py-2 px-3"
                          disabled={isLoading}
                        >
                          <span className="text-xs text-gray-400 mr-2">"</span>
                          <span className="text-gray-300">{item}</span>
                          <span className="text-xs text-gray-400 ml-auto">"</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Related Resources */}
            <Card className="card-dark">
              <CardHeader>
                <CardTitle className="text-lg text-white">Related Resources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {relatedResources.map((resource, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-800">
                    <div className="flex items-center space-x-3">
                      {resource.icon}
                      <div>
                        <div className="font-medium text-sm text-white">{resource.title}</div>
                        <div className="text-xs text-gray-400">{resource.description}</div>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-xs bg-gray-700 text-gray-300">
                      {resource.count}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Chat Area */}
          <div className="lg:col-span-3">
            <Card className="card-dark h-[calc(100vh-16rem)]">
              <CardHeader className="border-b border-gray-800">
                <CardTitle className="flex items-center space-x-2 text-white">
                  <MessageSquare className="w-5 h-5 text-cyan-400" />
                  <span>Chat with AskArko</span>
                </CardTitle>
              </CardHeader>

              <CardContent className="p-0 flex flex-col h-full">
                {/* Messages */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={cn(
                          "flex items-start space-x-3",
                          message.role === "user" ? "flex-row-reverse space-x-reverse" : "",
                        )}
                      >
                        <Avatar className="w-8 h-8">
                          <AvatarFallback
                            className={cn(
                              message.role === "user" ? "bg-purple-600 text-white" : "bg-cyan-600 text-white",
                            )}
                          >
                            {message.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 max-w-3xl">
                          <div
                            className={cn(
                              "inline-block p-4 rounded-lg whitespace-pre-wrap",
                              message.role === "user" ? "bg-purple-600 text-white" : "bg-gray-800 text-gray-100",
                            )}
                          >
                            {message.content}
                          </div>

                          {/* Action buttons for assistant messages */}
                          {message.role === "assistant" && (
                            <div className="flex items-center space-x-2 mt-2">
                              <Button size="sm" variant="ghost" className="text-xs text-gray-400 hover:text-white">
                                <Target className="w-3 h-3 mr-1" />
                                Related Projects
                              </Button>
                              <Button size="sm" variant="ghost" className="text-xs text-gray-400 hover:text-white">
                                <Users className="w-3 h-3 mr-1" />
                                Team Contacts
                              </Button>
                              <Button size="sm" variant="ghost" className="text-xs text-gray-400 hover:text-white">
                                <FileText className="w-3 h-3 mr-1" />
                                Documentation
                              </Button>
                            </div>
                          )}
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
                      placeholder="Ask about any project, technology, team, or process..."
                      className="flex-1 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-purple-500"
                      disabled={isLoading}
                    />
                    <Button type="submit" disabled={isLoading || !input.trim()} className="btn-primary">
                      <Send className="w-4 h-4" />
                    </Button>
                  </form>

                  <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                    <span>Press Enter to send • Shift+Enter for new line</span>
                    {isGuest && <span className="text-yellow-400">Limited to basic queries in guest mode</span>}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
