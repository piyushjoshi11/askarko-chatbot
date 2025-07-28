"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, FileText, Video, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function KnowledgeUpload() {
  const [isUploading, setIsUploading] = useState(false)
  const [contentType, setContentType] = useState<"document" | "video" | "text">("document")
  const { toast } = useToast()

  const handleUpload = async (formData: FormData) => {
    setIsUploading(true)
    try {
      const response = await fetch("/api/knowledge/upload", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        toast({
          title: "Knowledge Added",
          description: "Your content has been successfully added to the knowledge base.",
        })
      } else {
        throw new Error("Upload failed")
      }
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "There was an error adding your content. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="content-type">Content Type</Label>
        <Select value={contentType} onValueChange={(value: "document" | "video" | "text") => setContentType(value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="document">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4" />
                <span>Document</span>
              </div>
            </SelectItem>
            <SelectItem value="video">
              <div className="flex items-center space-x-2">
                <Video className="w-4 h-4" />
                <span>Video Recording</span>
              </div>
            </SelectItem>
            <SelectItem value="text">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4" />
                <span>Text Content</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <form action={handleUpload} className="space-y-4">
        <div>
          <Label htmlFor="title">Project Title</Label>
          <Input id="title" name="title" placeholder="Enter project title" required />
        </div>

        <div>
          <Label htmlFor="presenter">Presenter</Label>
          <Input id="presenter" name="presenter" placeholder="Presenter name" required />
        </div>

        <div>
          <Label htmlFor="team">Team/Department</Label>
          <Input id="team" name="team" placeholder="Team or department" required />
        </div>

        {contentType === "text" ? (
          <div>
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              name="content"
              placeholder="Enter project details, technology stack, solutions, outcomes..."
              rows={6}
              required
            />
          </div>
        ) : (
          <div>
            <Label htmlFor="file">Upload File</Label>
            <Input
              id="file"
              name="file"
              type="file"
              accept={contentType === "video" ? "video/*" : ".pdf,.doc,.docx,.txt"}
              required
            />
          </div>
        )}

        <div>
          <Label htmlFor="tags">Tags (comma-separated)</Label>
          <Input id="tags" name="tags" placeholder="technology, solution, outcome, etc." />
        </div>

        <input type="hidden" name="contentType" value={contentType} />

        <Button type="submit" disabled={isUploading} className="w-full">
          {isUploading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              Add to Knowledge Base
            </>
          )}
        </Button>
      </form>
    </div>
  )
}
