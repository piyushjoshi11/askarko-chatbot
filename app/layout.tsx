import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { VerticalNavigation } from "@/components/vertical-navigation"

export const metadata: Metadata = {
  title: "AskArko - Articulus Knowledge Assistant",
  description: "AI-powered knowledge assistant for Amgen Operations",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-euclid bg-gray-900">
        <div className="flex min-h-screen">
          <VerticalNavigation />
          <main className="flex-1 ml-20">{children}</main>
        </div>
      </body>
    </html>
  )
}
4