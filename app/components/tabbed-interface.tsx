"use client"

import { useState } from "react"
import { ChatBot } from "./chat-bot"
import { QuizTab } from "./quiz-tab"
import { MessageSquare, Brain, Trophy } from "lucide-react"

type TabType = "chat" | "quiz"

export function TabbedInterface() {
  const [activeTab, setActiveTab] = useState<TabType>("chat")

  const tabs = [
    {
      id: "chat" as TabType,
      label: "Chat",
      icon: MessageSquare,
      component: <ChatBot />
    },
    {
      id: "quiz" as TabType, 
      label: "Quiz Arena",
      icon: Brain,
      component: <QuizTab />
    }
  ]

  return (
    <div className="flex flex-col h-full bg-gray-900">
      {/* Tab Navigation */}
      <div className="border-b border-gray-700 bg-gray-800">
        <div className="flex">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium transition-colors duration-200 border-b-2 ${
                  activeTab === tab.id
                    ? "border-purple-500 text-purple-300 bg-gray-700"
                    : "border-transparent text-gray-400 hover:text-gray-300 hover:bg-gray-750"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.id === "quiz" && (
                  <Trophy className="w-3 h-3 text-yellow-400" />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        {tabs.find(tab => tab.id === activeTab)?.component}
      </div>
    </div>
  )
}
