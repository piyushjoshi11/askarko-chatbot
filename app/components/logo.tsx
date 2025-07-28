"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl"
  showText?: boolean
  className?: string
}

export function Logo({ size = "md", showText = true, className }: LogoProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  }

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
    xl: "text-3xl",
  }

  return (
    <div className={cn("flex items-center space-x-3", className)}>
      <div className={cn("relative rounded-lg overflow-hidden", sizeClasses[size])}>
        <Image src="/images/askarko-logo.png" alt="AskArko Logo" fill className="object-cover" priority />
      </div>
      {showText && (
        <div className="flex flex-col">
          <h1 className={cn("font-bold text-white", textSizeClasses[size])}>AskArko</h1>
          {size !== "sm" && <p className="text-sm text-gray-400">Articulus Knowledge Assistant</p>}
        </div>
      )}
    </div>
  )
}
