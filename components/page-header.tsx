"use client"

import type React from "react"

import { Logo } from "./logo"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

interface PageHeaderProps {
  title: string
  subtitle?: string
  showBack?: boolean
  badges?: Array<{
    text: string
    variant?: "default" | "secondary" | "outline"
    icon?: React.ReactNode
  }>
  className?: string
}

export function PageHeader({ title, subtitle, showBack = false, badges = [], className }: PageHeaderProps) {
  const router = useRouter()

  return (
    <header className={cn("border-b border-gray-800 sticky top-0 z-40 bg-gray-900", className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            {showBack && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                className="text-gray-400 hover:text-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            )}
            <Logo size="sm" />
            <div className="border-l border-gray-700 pl-4">
              <h1 className="text-xl font-bold text-white">{title}</h1>
              {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {badges.map((badge, index) => (
              <Badge
                key={index}
                variant={badge.variant || "secondary"}
                className="bg-gray-800 text-gray-300 border-gray-700"
              >
                {badge.icon}
                {badge.text}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </header>
  )
}
