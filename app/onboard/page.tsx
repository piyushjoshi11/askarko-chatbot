"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Users, Building2, BookOpen, CheckCircle, ArrowRight, Target, FileText, Video } from "lucide-react"
import { cn } from "@/lib/utils"
import { PageHeader } from "../components/page-header"

export default function OnboardingPage() {
  const [selectedProject, setSelectedProject] = useState<string | null>(null)
  const [currentStep, setCurrentStep] = useState(0)

  const projects = [
    {
      id: "data-pipeline",
      title: "Data Pipeline Optimization",
      team: "Data Engineering",
      description: "Apache Spark-based pipeline for processing clinical trial data",
      technologies: ["Python", "Apache Spark", "AWS", "Docker"],
      complexity: "Advanced",
      duration: "3-4 weeks onboarding",
    },
    {
      id: "ml-platform",
      title: "ML Model Deployment Platform",
      team: "AI/ML Operations",
      description: "MLOps platform for automated model deployment and monitoring",
      technologies: ["TensorFlow", "Kubernetes", "Python", "MLflow"],
      complexity: "Expert",
      duration: "4-5 weeks onboarding",
    },
    {
      id: "api-gateway",
      title: "API Gateway Migration",
      team: "Platform Engineering",
      description: "Microservices architecture migration from monolithic API",
      technologies: ["Node.js", "Docker", "Kubernetes", "MongoDB"],
      complexity: "Intermediate",
      duration: "2-3 weeks onboarding",
    },
  ]

  const onboardingSteps = [
    {
      id: "contacts",
      title: "Point of Contacts",
      description: "Meet your project team and key stakeholders",
      icon: <Users className="w-5 h-5" />,
      items: ["Project Lead", "Technical Mentor", "Product Owner", "Team Members"],
    },
    {
      id: "stakeholders",
      title: "Client Stakeholders",
      description: "Understand business context and client requirements",
      icon: <Building2 className="w-5 h-5" />,
      items: ["Business Sponsor", "End Users", "Compliance Team", "External Partners"],
    },
    {
      id: "project-details",
      title: "About the Project",
      description: "Deep dive into project goals, architecture, and processes",
      icon: <Target className="w-5 h-5" />,
      items: ["Project Charter", "Technical Architecture", "Development Process", "Success Metrics"],
    },
  ]

  const learningModules = [
    {
      type: "assignments",
      title: "Learning Assignments",
      icon: <FileText className="w-5 h-5 text-cyan-400" />,
      count: 8,
      description: "Hands-on tasks to get familiar with the codebase",
    },
    {
      type: "modules",
      title: "Learning Modules",
      icon: <BookOpen className="w-5 h-5 text-purple-400" />,
      count: 12,
      description: "Structured learning content and documentation",
    },
    {
      type: "cases",
      title: "Case Studies",
      icon: <Video className="w-5 h-5 text-cyan-400" />,
      count: 5,
      description: "Real-world scenarios and problem-solving examples",
    },
  ]

  const handleProjectSelect = (projectId: string) => {
    setSelectedProject(projectId)
    setCurrentStep(1)
  }

  const selectedProjectData = projects.find((p) => p.id === selectedProject)

  if (!selectedProject) {
    return (
      <div className="min-h-screen bg-gray-900">
        <PageHeader
          title="Developer Onboarding"
          subtitle="Select your assigned project to begin your personalized onboarding journey"
          showBack
        />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Choose Your Project</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              We'll create a customized learning pathway based on your project requirements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card
                key={project.id}
                className="card-dark hover:bg-gray-800 transition-all cursor-pointer group"
                onClick={() => handleProjectSelect(project.id)}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg group-hover:gradient-text-primary transition-colors duration-300 text-white">
                      {project.title}
                    </CardTitle>
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-purple-400 transition-colors duration-300" />
                  </div>
                  <Badge variant="secondary" className="w-fit bg-gray-700 text-gray-300">
                    {project.team}
                  </Badge>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-gray-400 text-sm">{project.description}</p>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Complexity:</span>
                      <Badge
                        variant={
                          project.complexity === "Expert"
                            ? "destructive"
                            : project.complexity === "Advanced"
                              ? "default"
                              : "secondary"
                        }
                        className={
                          project.complexity === "Expert"
                            ? "bg-red-900 text-red-300"
                            : project.complexity === "Advanced"
                              ? "bg-purple-600 text-white"
                              : "bg-gray-700 text-gray-300"
                        }
                      >
                        {project.complexity}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Duration:</span>
                      <span className="text-gray-300">{project.duration}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-300">Technologies:</div>
                    <div className="flex flex-wrap gap-1">
                      {project.technologies.map((tech, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs bg-gray-800 text-gray-400 border-gray-600"
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <PageHeader title="Developer Onboarding" subtitle={selectedProjectData?.title} showBack />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Button variant="ghost" onClick={() => setSelectedProject(null)} className="text-gray-400 hover:text-white">
              ← Back to Projects
            </Button>
          </div>

          <div className="card-dark rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-2xl font-bold text-white">{selectedProjectData?.title}</h1>
                <p className="text-gray-400 mt-1">{selectedProjectData?.description}</p>
              </div>
              <Badge variant="secondary" className="bg-gray-700 text-gray-300">
                {selectedProjectData?.team}
              </Badge>
            </div>

            <Progress value={(currentStep / 4) * 100} className="mb-4 h-2" />
            <p className="text-sm text-gray-400">
              Step {currentStep} of 4 • Estimated completion: {selectedProjectData?.duration}
            </p>
          </div>
        </div>

        {/* Onboarding Steps */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {onboardingSteps.map((step, index) => (
            <Card
              key={step.id}
              className={cn(
                "card-dark transition-all duration-300",
                currentStep > index + 1
                  ? "border-cyan-500"
                  : currentStep === index + 1
                    ? "border-purple-500 bg-gray-800"
                    : "border-gray-700",
              )}
            >
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div
                    className={cn(
                      "p-2 rounded-lg",
                      currentStep > index + 1
                        ? "bg-cyan-900 text-cyan-400"
                        : currentStep === index + 1
                          ? "bg-purple-900 text-purple-400"
                          : "bg-gray-800 text-gray-500",
                    )}
                  >
                    {currentStep > index + 1 ? <CheckCircle className="w-5 h-5" /> : step.icon}
                  </div>
                  <CardTitle className="text-lg text-white">{step.title}</CardTitle>
                </div>
              </CardHeader>

              <CardContent>
                <p className="text-gray-400 text-sm mb-4">{step.description}</p>

                <div className="space-y-2">
                  {step.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-center space-x-2 text-sm">
                      <div
                        className={cn(
                          "w-2 h-2 rounded-full",
                          currentStep > index + 1
                            ? "bg-cyan-400"
                            : currentStep === index + 1
                              ? "bg-purple-400"
                              : "bg-gray-600",
                        )}
                      ></div>
                      <span className="text-gray-300">{item}</span>
                    </div>
                  ))}
                </div>

                {currentStep === index + 1 && (
                  <Button className="w-full mt-4 btn-primary" onClick={() => setCurrentStep(currentStep + 1)}>
                    Complete {step.title}
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Learning Modules */}
        {currentStep >= 4 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2">Your Learning Path</h2>
              <p className="text-gray-400">Continue your onboarding with these personalized learning modules</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {learningModules.map((module) => (
                <Card key={module.type} className="card-dark hover:bg-gray-800 transition-all">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      {module.icon}
                      <CardTitle className="text-lg text-white">{module.title}</CardTitle>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-white">{module.count}</span>
                        <Badge variant="outline" className="bg-gray-800 text-gray-300 border-gray-600">
                          {module.count} items
                        </Badge>
                      </div>

                      <p className="text-gray-400 text-sm">{module.description}</p>

                      <Button className="w-full btn-secondary">
                        Start Learning
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
