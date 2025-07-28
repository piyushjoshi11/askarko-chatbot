"use client"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Logo } from "./logo"
import { ThemeToggle } from "./theme-toggle"
import { Home, Users, BookOpen, Search, Briefcase, Newspaper, MessageCircle, Settings, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"

const navigationItems = [
  { id: "home", label: "Home", icon: Home, href: "/" },
  { id: "news", label: "News Feed", icon: Newspaper, href: "/news" },
  { id: "onboard", label: "Onboard as Dev", icon: Users, href: "/onboard" },
  { id: "learn", label: "Learn a Project", icon: BookOpen, href: "/learn" },
  { id: "explore", label: "Explore Domain", icon: Search, href: "/explore" },
  { id: "business", label: "Business Development", icon: Briefcase, href: "/business-development" },
]

const bottomItems = [
  { id: "chat", label: "AI Chat", icon: MessageCircle, action: "chat" },
  { id: "settings", label: "Settings", icon: Settings, action: "settings" },
  { id: "logout", label: "Sign Out", icon: LogOut, action: "logout" },
]

export function VerticalNavigation() {
  const router = useRouter()
  const pathname = usePathname()
  const [showChat, setShowChat] = useState(false)

  const handleNavigation = (href: string) => {
    router.push(href)
  }

  const handleAction = (action: string) => {
    switch (action) {
      case "chat":
        setShowChat(true)
        break
      case "settings":
        // Handle settings
        break
      case "logout":
        // Handle logout
        break
    }
  }

  return (
    <TooltipProvider>
      <nav className="fixed left-0 top-0 h-full w-20 bg-nav border-r border-nav-border flex flex-col items-center py-6 z-50">
        {/* Logo */}
        <div className="mb-8">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="cursor-pointer" onClick={() => handleNavigation("/")}>
                <Logo size="sm" showText={false} />
              </div>
            </TooltipTrigger>
            <TooltipContent side="right" className="bg-tooltip text-tooltip-foreground border-tooltip-border">
              <p className="font-bold">AskArko</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Theme Toggle */}
        {/* <div className="mb-6">
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <ThemeToggle />
              </div>
            </TooltipTrigger>
            <TooltipContent side="right" className="bg-tooltip text-tooltip-foreground border-tooltip-border">
              <p className="font-normal">Toggle Theme</p>
            </TooltipContent>
          </Tooltip>
        </div> */}

        {/* Main Navigation */}
        <div className="flex-1 flex flex-col space-y-4">
          {navigationItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Tooltip key={item.id}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "w-12 h-12 p-0 rounded-xl transition-all duration-200",
                      isActive
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : "text-nav-foreground hover:text-nav-foreground-hover hover:bg-nav-hover",
                    )}
                    onClick={() => handleNavigation(item.href)}
                  >
                    <Icon className="w-6 h-6" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right" className="bg-tooltip text-tooltip-foreground border-tooltip-border">
                  <p className="font-normal">{item.label}</p>
                </TooltipContent>
              </Tooltip>
            )
          })}
        </div>

        {/* Bottom Actions */}
        <div className="flex flex-col space-y-4">
          {bottomItems.map((item) => {
            const Icon = item.icon

            return (
              <Tooltip key={item.id}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-12 h-12 p-0 rounded-xl text-nav-foreground hover:text-nav-foreground-hover hover:bg-nav-hover transition-all duration-200"
                    onClick={() => handleAction(item.action)}
                  >
                    <Icon className="w-5 h-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right" className="bg-tooltip text-tooltip-foreground border-tooltip-border">
                  <p className="font-normal">{item.label}</p>
                </TooltipContent>
              </Tooltip>
            )
          })}
        </div>
      </nav>
    </TooltipProvider>
  )
}
