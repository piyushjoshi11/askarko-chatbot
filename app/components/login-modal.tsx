"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Building2, Users, UserCheck } from "lucide-react"
import { useRouter } from "next/navigation"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSSOLogin = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const intendedRoute = sessionStorage.getItem("intendedRoute") || "/learn"
    sessionStorage.removeItem("intendedRoute")

    onClose()
    router.push(intendedRoute)
  }

  const handleGuestAccess = () => {
    const intendedRoute = sessionStorage.getItem("intendedRoute") || "/learn"
    sessionStorage.removeItem("intendedRoute")

    onClose()
    router.push(intendedRoute + "?mode=guest")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-gray-800 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-white">Access AskArko</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="sso" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-700">
            <TabsTrigger
              value="sso"
              className="flex items-center justify-center space-x-2 py-2 rounded-md data-[state=active]:bg-gray-600 text-gray-300"
            >
              <Building2 className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-medium">SSO Login</span>
            </TabsTrigger>
            <TabsTrigger
              value="guest"
              className="flex items-center justify-center space-x-2 py-2 rounded-md data-[state=active]:bg-gray-600 text-gray-300"
            >
              <Users className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium">Guest Access</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sso" className="space-y-4 mt-6">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-cyan-900 rounded-full flex items-center justify-center mx-auto">
                <Building2 className="w-10 h-10 text-cyan-400" />
              </div>

              <div>
                <h3 className="font-semibold text-white">Amgen SSO Login</h3>
                <p className="text-sm text-gray-400 mt-1">Sign in with your Amgen credentials for full access</p>
              </div>

              <div className="space-y-2">
                <Badge variant="secondary" className="bg-cyan-900 text-cyan-300">
                  <UserCheck className="w-3 h-3 mr-1" />
                  Full Access
                </Badge>
                <div className="text-xs text-gray-400 space-y-1">
                  <div>• Access all projects and documentation</div>
                  <div>• Personalized recommendations</div>
                  <div>• Upload and contribute content</div>
                  <div>• Advanced analytics and insights</div>
                </div>
              </div>

              <Button onClick={handleSSOLogin} disabled={isLoading} className="w-full btn-primary">
                {isLoading ? "Authenticating..." : "Sign in with Amgen SSO"}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="guest" className="space-y-4 mt-6">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center mx-auto">
                <Users className="w-10 h-10 text-gray-400" />
              </div>

              <div>
                <h3 className="font-semibold text-white">Guest Access</h3>
                <p className="text-sm text-gray-400 mt-1">Explore AskArko with limited functionality</p>
              </div>

              <div className="space-y-2">
                <Badge variant="outline" className="bg-gray-700 text-gray-300 border-gray-600">
                  Limited Access
                </Badge>
                <div className="text-xs text-gray-400 space-y-1">
                  <div>• Browse public project information</div>
                  <div>• Basic AI chat functionality</div>
                  <div>• View general documentation</div>
                  <div>• No upload or contribution features</div>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <Label htmlFor="guest-name" className="text-gray-300">
                    Your Name (Optional)
                  </Label>
                  <Input
                    id="guest-name"
                    placeholder="Enter your name for personalization"
                    className="mt-1 bg-gray-700 text-white border-gray-600 placeholder-gray-400"
                  />
                </div>

                <Button onClick={handleGuestAccess} variant="outline" className="w-full btn-secondary bg-transparent">
                  Continue as Guest
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
