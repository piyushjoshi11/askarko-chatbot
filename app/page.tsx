"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Users,
  BookOpen,
  Search,
  Briefcase,
  ArrowRight,
  TrendingUp,
  MessageCircle,
  X,
  Network,
  Bot,
  Newspaper,
  Flame,
} from "lucide-react";
import { LoginModal } from "./components/login-modal";
import { Logo } from "./components/logo";
import { MagicVessel } from "./components/magic-vessel";
import { ChatBot } from "./components/chat-bot";
import { TabbedInterface } from "./components/tabbed-interface";
import { useRouter } from "next/navigation";

export default function AskArkoHome() {
  const [showLogin, setShowLogin] = useState(false)
  const [showChatBot, setShowChatBot] = useState(false)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  const userJourneys = [
    {
      id: "news-feed",
      title: "News Feed",
      description: "Stay updated with team announcements, events, and project milestones",
      icon: <Newspaper className="w-8 h-8 text-cyan-400" />,
      features: [
        "Team updates and announcements",
        "Event notifications",
        "Project milestones",
        "Social engagement features",
      ],
      route: "/news",
    },
    {
      id: "onboard-dev",
      title: "Onboard as Dev",
      description: "Get oriented with your assigned project through personalized learning pathways",
      icon: <Users className="w-8 h-8 text-purple-400" />,
      features: ["Project-specific pathways", "Point of contacts", "Client stakeholders", "Learning modules"],
      route: "/onboard",
    },
    {
      id: "learn-project",
      title: "Learn a Project",
      description: "Explore any project through AI-powered conversations and get actionable insights",
      icon: <BookOpen className="w-8 h-8 text-cyan-400" />,
      features: ["AI chat interface", "Summarized answers", "Related documentation", "Follow-up suggestions"],
      route: "/learn",
    },
    {
      id: "explore-domain",
      title: "Explore Domain",
      description: "Discover projects and initiatives across different domains and teams",
      icon: <Search className="w-8 h-8 text-purple-400" />,
      features: ["Domain exploration", "Cross-team insights", "Technology landscapes", "Best practices"],
      route: "/explore",
    },
    {
      id: "bd-initiative",
      title: "BD for New Initiative",
      description: "Find similar projects, generate proposals, and create business development materials",
      icon: <Briefcase className="w-8 h-8 text-cyan-400" />,
      features: ["Similar project matching", "Data summarization", "PPT generation", "Team recommendations"],
      route: "/business-development",
    },
  ]

  const handleJourneySelect = (route: string) => {
    setShowLogin(true)
    sessionStorage.setItem("intendedRoute", route)
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gray-900 font-inter relative">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="fixed inset-0 w-full h-full object-cover z-0"
        src="https://cdn.pixabay.com/video/2015/08/11/304-135918292_large.mp4"
      />
      {/* Overlay for readability */}
      <div className="fixed inset-0 bg-black/70 z-0 pointer-events-none" />

      {/* Main Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-gray-800 rounded-b-3xl bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              <Logo />
              {/* User Journey Navigation */}
              <div className="flex items-center space-x-4">
                {userJourneys.map((journey) => (
                  <Button
                    key={journey.id}
                    variant="ghost"
                    className="text-gray-300 hover:text-purple-400 px-4 py-2 rounded-xl font-medium transition-colors duration-200"
                    onClick={() => handleJourneySelect(journey.route)}
                  >
                    {journey.title}
                  </Button>
                ))}
                <Button className="btn-primary px-8 py-3 rounded-2xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                  Sign up
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          {/* Hero Section */}
          <div className="text-center mb-2">
            
            <h1 className="text-6xl font-extrabold text-white mb-4">
              Welcome to{" "}
                <span className="bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent text-7xl font-extrabold tracking-tight drop-shadow-lg">
                AskArko
                </span>
            </h1>
            {/* <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-gray-800 to-gray-700 text-gray-300 px-5 py-2 rounded-full text-sm font-medium mb-6 shadow-lg">
              <Target className="w-4 h-4 text-cyan-400" />
              <span className="font-small">
                Amgen Operations • Articulus Project
              </span>
            </div> */}

            <p className="text-2xl text-gray-300 max-w-4xl mx-auto mb-8 leading-relaxed">
              Your AI-powered knowledge companion for the Articulus initiative.
              Discover projects, learn from presentations, connect with teams,
              and accelerate your understanding of Amgen Operations initiatives.
            </p>
            

          <div className="inline-flex items-center space-x-4 bg-gradient-to-r from-gray-800 to-gray-700 text-gray-300 px-8 py-4 rounded-full text-md font-normal mb-8 shadow-xl">
            <div className="flex items-center space-x-3">
              <Network className="w-4 h-4 text-cyan-400" />
              <span>Cross-team Knowledge Sharing</span>
            </div>
            <div className="flex items-center space-x-3">
              <Bot className="w-4 h-4 text-purple-400" />
              <span>AI-Powered Insights</span>
            </div>
            <div className="flex items-center space-x-3">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span>Comprehensive Documentation</span>
            </div>
          </div>

          {/* Large Magic Vessel - Main Focus with more space */}
          <div className="mb-16 flex justify-center min-h-[200px] items-center">
            <MagicVessel className="scale-150" />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <Button className="btn-primary px-10 py-4 text-xl font-bold rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
              Begin your journey
              <ArrowRight className="w-6 h-6 ml-3" />
            </Button>
            
            <Button 
              onClick={() => {
                document.getElementById('quiz-section')?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 px-10 py-4 text-xl font-bold rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 text-white"
            >
              🧠 Quiz Challenge
              <Flame className="w-6 h-6 ml-3" />
            </Button>
          </div>
        </div>
        </main>

        {/* User Journeys */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold text-center text-white mb-6">Choose Your Journey</h2>
          <p className="text-center text-gray-400 mb-16 max-w-3xl mx-auto text-lg leading-relaxed font-normal">
            Select the path that best matches your current needs and goals within the Amgen Operations ecosystem.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {userJourneys.map((journey) => (
              <Card
                key={journey.id}
                className="card-dark hover-lift cursor-pointer group rounded-3xl border-2 border-gray-700 hover:border-purple-500 transition-all duration-500 shadow-xl hover:shadow-2xl"
                onClick={() => handleJourneySelect(journey.route)}
              >
                <CardHeader className="pb-6 rounded-t-3xl">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-gradient-to-br from-gray-800 to-gray-700 rounded-2xl shadow-lg">
                        {journey.icon}
                      </div>
                      <div>
                        <CardTitle className="text-xl font-bold text-white group-hover:gradient-text-primary transition-all duration-300">
                          {journey.title}
                        </CardTitle>
                      </div>
                    </div>
                    <ArrowRight className="w-6 h-6 text-gray-400 group-hover:text-purple-400 transition-colors duration-300 transform group-hover:translate-x-1" />
                  </div>
                </CardHeader>

                <CardContent className="space-y-6 px-6 pb-8">
                  <p className="text-gray-300 leading-relaxed text-base font-normal">{journey.description}</p>

                  <div className="space-y-3">
                    <h4 className="font-bold text-white text-sm">Key Features:</h4>
                    <div className="grid grid-cols-1 gap-2">
                      {journey.features.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-3 text-sm text-gray-400">
                          <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full"></div>
                          <span className="font-normal">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button className="w-full mt-6 btn-secondary rounded-xl py-3 text-base font-normal">
                    Get Started
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="card-dark rounded-3xl p-10 shadow-2xl border-2 border-gray-700">
          <h3 className="text-3xl font-bold text-center text-white mb-10 flex items-center justify-center space-x-3">
            <TrendingUp className="w-8 h-8 text-purple-400" />
            <span>Articulus Knowledge Base</span>
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
            {[
              {
                value: "47",
                label: "Active Projects",
                color: "text-cyan-400",
                bg: "bg-cyan-900/20",
              },
              {
                value: "128",
                label: "Presentations",
                color: "text-purple-400",
                bg: "bg-purple-900/20",
              },
              {
                value: "89",
                label: "Video Recordings",
                color: "text-cyan-400",
                bg: "bg-cyan-900/20",
              },
              {
                value: "15",
                label: "Teams",
                color: "text-purple-400",
                bg: "bg-purple-900/20",
              },
            ].map((stat, index) => (
              <div key={index} className={`text-center p-6 rounded-2xl ${stat.bg} border border-gray-600`}>
                <div className={`text-4xl font-bold ${stat.color} mb-3`}>{stat.value}</div>
                <div className="text-base text-gray-400 font-normal">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quiz Arena Section - Always Visible */}
      {/* <section id="quiz-section" className="py-24 bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-6">
              🧠 Quiz Arena Challenge
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Think you're smart? Let AskArko test your knowledge with brutal questions and even more brutal roasts! 
              Get ready to have your ego demolished! 🔥
            </p>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-3xl border border-gray-700 overflow-hidden shadow-2xl">
            <div className="h-[700px]">
              <TabbedInterface />
            </div>
          </div>
        </div>
      </section> */}

      {/* Floating Chat Bot Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <Button
          onClick={() => setShowChatBot(true)}
          className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-110"
        >
          <MessageCircle className="w-8 h-8 text-white" />
        </Button>
      </div>

      {/* Chat Bot Modal */}
      {showChatBot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-4xl h-[900px] bg-gray-900 rounded-3xl shadow-2xl border-2 border-gray-700 overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-700 bg-gradient-to-r from-gray-800 to-gray-700">
              <div className="flex items-center space-x-3">
                <div>
                  <h3 className="text-xl font-bold text-white">Chat with AskArko</h3>
                  <p className="text-sm text-gray-400 font-normal">Your AI Knowledge Assistant</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowChatBot(false)}
                className="text-gray-400 hover:text-white rounded-full p-2"
              >
                <X className="w-6 h-6" />
              </Button>
            </div>
            <div className="h-[calc(100%-88px)]">
              <TabbedInterface />
            </div>
          </div>
        </div>
      )}

      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
    </div>
  )
}
