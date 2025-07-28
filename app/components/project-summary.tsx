"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp } from "lucide-react"

export function ProjectSummary() {
  // This would typically come from your database
  const stats = {
    totalProjects: 24,
    totalPresentations: 18,
    totalVideos: 12,
    activeTeams: 8,
  }

  const recentProjects = [
    {
      title: "Data Pipeline Optimization",
      presenter: "Sarah Chen",
      team: "Data Engineering",
      tags: ["Python", "Apache Spark", "AWS"],
    },
    {
      title: "ML Model Deployment",
      presenter: "Mike Rodriguez",
      team: "AI/ML",
      tags: ["TensorFlow", "Kubernetes", "MLOps"],
    },
    {
      title: "API Gateway Migration",
      presenter: "Alex Johnson",
      team: "Platform",
      tags: ["Node.js", "Docker", "Microservices"],
    },
  ]

  return (
    <div className="space-y-6">
      {/* Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Knowledge Base Stats</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.totalProjects}</div>
              <div className="text-sm text-gray-500">Projects</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.totalPresentations}</div>
              <div className="text-sm text-gray-500">Presentations</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.totalVideos}</div>
              <div className="text-sm text-gray-500">Videos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.activeTeams}</div>
              <div className="text-sm text-gray-500">Teams</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Projects */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2">
            <TrendingUp className="w-5 h-5" />
            <span>Recent Projects</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentProjects.map((project, index) => (
              <div key={index} className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-medium text-sm">{project.title}</h4>
                <p className="text-xs text-gray-500 mb-2">
                  by {project.presenter} • {project.team}
                </p>
                <div className="flex flex-wrap gap-1">
                  {project.tags.map((tag, tagIndex) => (
                    <Badge key={tagIndex} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <button className="w-full text-left p-2 hover:bg-gray-50 rounded text-blue-600">
              "What ML projects are currently running?"
            </button>
            <button className="w-full text-left p-2 hover:bg-gray-50 rounded text-blue-600">
              "Show me Python-based solutions"
            </button>
            <button className="w-full text-left p-2 hover:bg-gray-50 rounded text-blue-600">
              "What are the latest AWS implementations?"
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
