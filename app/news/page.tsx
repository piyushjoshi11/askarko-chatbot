"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Calendar,
  Clock,
  MapPin,
  ExternalLink,
  Heart,
  MessageCircle,
  Share2,
  Plus,
  Video,
  Users,
  Building,
  Sparkles,
  Pin,
  Bookmark,
  CalendarPlus,
  Bell,
  ChevronRight,
  Upload,
  ImageIcon,
  FileText,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  // mockPosts, // <-- comment out mockPosts
  upcomingEvents,
  NewsPost,
  UpcomingEvent,
  UploadedFile,
  fetchPosts,
  createPost,
  createPostEngagement,
  fetchComments,
} from "../services/newsService"

export default function NewsPage() {
  const [posts, setPosts] = useState<NewsPost[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreatePost, setShowCreatePost] = useState(false)
  const [newPost, setNewPost] = useState("")
  const [postType, setPostType] = useState<"update" | "event" | "announcement">("update")
  const [isEvent, setIsEvent] = useState(false)
  const [markInCalendar, setMarkInCalendar] = useState(false)
  const [eventDetails, setEventDetails] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    teamsLink: "",
  })
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [dragActive, setDragActive] = useState(false)
  const [commentInputs, setCommentInputs] = useState<{ [postId: string]: string }>({})
  const [showCommentBox, setShowCommentBox] = useState<{ [postId: string]: boolean }>({})
  const [comments, setComments] = useState<{ [postId: string]: Array<{ comment: string; created_at: string }> }>({})

  // Fetch posts from API
  const loadPosts = async () => {
    setLoading(true)
    try {
      const apiPosts = await fetchPosts()
      setPosts(apiPosts)
    } catch (err) {
      // Optionally handle error
    }
    setLoading(false)
  }

  useEffect(() => {
    loadPosts()
  }, [])

  // Engagement API actions
  const handleLike = async (postId: string) => {
    try {
      await createPostEngagement(postId, "like")
      await loadPosts()
    } catch (err) {
      // Optionally handle error
    }
  }

  const handleComment = async (postId: string) => {
    setShowCommentBox((prev) => ({ ...prev, [postId]: !prev[postId] }))
    if (!showCommentBox[postId]) {
      // Fetch comments when opening the comment box
      try {
        const postComments = await fetchComments(postId)
        setComments((prev) => ({ ...prev, [postId]: postComments }))
      } catch (err) {}
    }
  }

  const submitComment = async (postId: string) => {
    const comment = commentInputs[postId]
    if (!comment?.trim()) return
    try {
      await createPostEngagement(postId, "comment", { comment })
      await loadPosts()
      // Refetch comments after posting
      const postComments = await fetchComments(postId)
      setComments((prev) => ({ ...prev, [postId]: postComments }))
      setCommentInputs((prev) => ({ ...prev, [postId]: "" }))
      setShowCommentBox((prev) => ({ ...prev, [postId]: true }))
    } catch (err) {}
  }

  const handleShare = async (postId: string) => {
    try {
      await createPostEngagement(postId, "share", { user: "You" })
      await loadPosts()
    } catch (err) {}
  }

  // Fetch posts from API on mount
  useEffect(() => {
    async function loadPosts() {
      setLoading(true)
      try {
        const apiPosts = await fetchPosts()
        setPosts(apiPosts)
      } catch (err) {
        // Optionally handle error
      }
      setLoading(false)
    }
    loadPosts()
  }, [])

  const getPostTypeIcon = (type: string) => {
    switch (type) {
      case "event":
        return <Calendar className="w-4 h-4" />
      case "announcement":
        return <Sparkles className="w-4 h-4" />
      case "achievement":
        return <Users className="w-4 h-4" />
      case "update":
        return <Building className="w-4 h-4" />
      default:
        return <MessageCircle className="w-4 h-4" />
    }
  }

  const getPostTypeColor = (type: string) => {
    switch (type) {
      case "event":
        return "bg-cyan-900 text-cyan-300 border-cyan-700"
      case "announcement":
        return "bg-purple-900 text-purple-300 border-purple-700"
      case "achievement":
        return "bg-green-900 text-green-300 border-green-700"
      case "update":
        return "bg-orange-900 text-orange-300 border-orange-700"
      default:
        return "bg-gray-800 text-gray-300 border-gray-600"
    }
  }

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case "pulse":
        return <Users className="w-4 h-4 text-cyan-400" />
      case "townhall":
        return <Sparkles className="w-4 h-4 text-purple-400" />
      case "workshop":
        return <Building className="w-4 h-4 text-orange-400" />
      case "meeting":
        return <MessageCircle className="w-4 h-4 text-green-400" />
      default:
        return <Calendar className="w-4 h-4 text-gray-400" />
    }
  }

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return

    const newFiles: UploadedFile[] = []

    Array.from(files).forEach((file) => {
      const fileType = file.type.startsWith("image/") ? "image" : file.type.startsWith("video/") ? "video" : "document"

      const uploadedFile: UploadedFile = {
        file,
        type: fileType,
      }

      // Create preview for images
      if (fileType === "image") {
        const reader = new FileReader()
        reader.onload = (e) => {
          uploadedFile.preview = e.target?.result as string
          setUploadedFiles((prev) => [...prev, uploadedFile])
        }
        reader.readAsDataURL(file)
      } else {
        newFiles.push(uploadedFile)
      }
    })

    if (newFiles.length > 0) {
      setUploadedFiles((prev) => [...prev, ...newFiles])
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files)
    }
  }

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case "image":
        return <ImageIcon className="w-4 h-4 text-green-400" />
      case "video":
        return <Video className="w-4 h-4 text-blue-400" />
      default:
        return <FileText className="w-4 h-4 text-gray-400" />
    }
  }

  const handleCreatePost = async () => {
    if (!newPost.trim()) return

    const post: NewsPost = {
      id: Date.now().toString(),
      author: {
        name: "You",
        role: "Team Member",
      },
      content: newPost,
      type: postType,
      timestamp: "Just now",
      engagement: { likes: 0, comments: 0, shares: 0 },
      tags: [postType.charAt(0).toUpperCase() + postType.slice(1)],
      isCalendarEvent: markInCalendar && isEvent,
      ...(isEvent && {
        event: {
          title: eventDetails.title,
          date: eventDetails.date,
          time: eventDetails.time,
          location: eventDetails.location,
          teamsLink: eventDetails.teamsLink,
        },
      }),
    }

    try {
      await createPost(post)
      await loadPosts()
    } catch (err) {
      // Optionally handle error
    }
    setNewPost("")
    setIsEvent(false)
    setMarkInCalendar(false)
    setUploadedFiles([])
    setEventDetails({ title: "", date: "", time: "", location: "", teamsLink: "" })
    setShowCreatePost(false)
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">News Feed</h1>
          <p className="text-gray-400 font-normal">Stay updated with the latest from Amgen Operations teams</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Feed */}
          <div className="lg:col-span-3 space-y-6">
            {/* Create Post */}
            <Card className="card-dark">
              <CardContent className="p-6">
                {!showCreatePost ? (
                  <Button
                    onClick={() => setShowCreatePost(true)}
                    className="w-full justify-start text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-xl py-3 font-normal"
                  >
                    <Plus className="w-5 h-5 mr-3" />
                    Share an update with your team...
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gray-300 font-normal">Post Type</Label>
                        <Select value={postType} onValueChange={(value: any) => setPostType(value)}>
                          <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-600">
                            <SelectItem value="update">Update</SelectItem>
                            <SelectItem value="event">Event</SelectItem>
                            <SelectItem value="announcement">Announcement</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center space-x-4 pt-6">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="is-event"
                            checked={isEvent}
                            onCheckedChange={setIsEvent}
                            className="border-gray-600"
                          />
                          <Label htmlFor="is-event" className="text-gray-300 font-normal">
                            This is an event
                          </Label>
                        </div>
                      </div>
                    </div>

                    <Textarea
                      placeholder="What's happening in your team?"
                      value={newPost}
                      onChange={(e) => setNewPost(e.target.value)}
                      className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 font-normal"
                      rows={3}
                    />

                    {/* File Upload Area */}
                    <div
                      className={cn(
                        "border-2 border-dashed rounded-lg p-4 transition-all",
                        dragActive ? "border-purple-500 bg-purple-900/10" : "border-gray-600 bg-gray-800/50",
                      )}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                    >
                      <div className="flex items-center justify-center space-x-4">
                        <input
                          type="file"
                          id="file-upload"
                          multiple
                          accept="image/*,video/*,.pdf,.doc,.docx,.txt"
                          onChange={(e) => handleFileUpload(e.target.files)}
                          className="hidden"
                        />
                        <label
                          htmlFor="file-upload"
                          className="flex items-center space-x-2 cursor-pointer text-gray-400 hover:text-white transition-colors"
                        >
                          <Upload className="w-5 h-5" />
                          <span className="font-normal">Upload photos, videos, or documents</span>
                        </label>
                        <div className="flex items-center space-x-2 text-gray-500">
                          <ImageIcon className="w-4 h-4" />
                          <Video className="w-4 h-4" />
                          <FileText className="w-4 h-4" />
                        </div>
                      </div>
                      {dragActive && (
                        <p className="text-center text-purple-400 text-sm mt-2 font-normal">Drop files here...</p>
                      )}
                    </div>

                    {/* Uploaded Files Preview */}
                    {uploadedFiles.length > 0 && (
                      <div className="space-y-3">
                        <Label className="text-gray-300 font-normal">Uploaded Files ({uploadedFiles.length})</Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {uploadedFiles.map((uploadedFile, index) => (
                            <div key={index} className="relative bg-gray-800 border border-gray-600 rounded-lg p-3">
                              <div className="flex items-center space-x-3">
                                {uploadedFile.type === "image" && uploadedFile.preview ? (
                                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-700">
                                    <img
                                      src={uploadedFile.preview || "/placeholder.svg"}
                                      alt="Preview"
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                ) : (
                                  <div className="w-12 h-12 rounded-lg bg-gray-700 flex items-center justify-center">
                                    {getFileIcon(uploadedFile.type)}
                                  </div>
                                )}
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-normal text-white truncate">{uploadedFile.file.name}</p>
                                  <p className="text-xs text-gray-400 font-normal">
                                    {(uploadedFile.file.size / 1024 / 1024).toFixed(2)} MB
                                  </p>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeFile(index)}
                                  className="text-gray-400 hover:text-red-400 p-1"
                                >
                                  <ImageIcon className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {isEvent && (
                      <Card className="bg-gray-800 border-gray-600">
                        <CardHeader>
                          <CardTitle className="text-lg text-white font-bold flex items-center space-x-2">
                            <Calendar className="w-5 h-5 text-cyan-400" />
                            <span>Event Details</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label className="text-gray-300 font-normal">Event Title</Label>
                              <Input
                                placeholder="Enter event title"
                                value={eventDetails.title}
                                onChange={(e) => setEventDetails({ ...eventDetails, title: e.target.value })}
                                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                              />
                            </div>
                            <div>
                              <Label className="text-gray-300 font-normal">Date</Label>
                              <Input
                                placeholder="e.g., July 25th, 2025"
                                value={eventDetails.date}
                                onChange={(e) => setEventDetails({ ...eventDetails, date: e.target.value })}
                                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                              />
                            </div>
                            <div>
                              <Label className="text-gray-300 font-normal">Time</Label>
                              <Input
                                placeholder="e.g., 3:00 PM"
                                value={eventDetails.time}
                                onChange={(e) => setEventDetails({ ...eventDetails, time: e.target.value })}
                                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                              />
                            </div>
                            <div>
                              <Label className="text-gray-300 font-normal">Location</Label>
                              <Input
                                placeholder="Room or Teams link"
                                value={eventDetails.location}
                                onChange={(e) => setEventDetails({ ...eventDetails, location: e.target.value })}
                                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                              />
                            </div>
                          </div>
                          <div>
                            <Label className="text-gray-300 font-normal">Teams Link (Optional)</Label>
                            <Input
                              placeholder="https://teams.microsoft.com/..."
                              value={eventDetails.teamsLink}
                              onChange={(e) => setEventDetails({ ...eventDetails, teamsLink: e.target.value })}
                              className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                            />
                          </div>
                          <div className="flex items-center space-x-2 p-3 bg-purple-900/20 border border-purple-700 rounded-lg">
                            <Checkbox
                              id="mark-calendar"
                              checked={markInCalendar}
                              onCheckedChange={setMarkInCalendar}
                              className="border-purple-500"
                            />
                            <CalendarPlus className="w-4 h-4 text-purple-400" />
                            <Label htmlFor="mark-calendar" className="text-purple-300 font-normal">
                              Mark in calendar for everyone
                            </Label>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <span className="font-normal">
                          {uploadedFiles.length > 0 &&
                            `${uploadedFiles.length} file${uploadedFiles.length > 1 ? "s" : ""} attached`}
                        </span>
                      </div>
                      <div className="flex space-x-3">
                        <Button variant="ghost" onClick={() => setShowCreatePost(false)} className="font-normal">
                          Cancel
                        </Button>
                        <Button onClick={handleCreatePost} className="btn-primary font-bold">
                          {markInCalendar ? "Share & Add to Calendar" : "Share Update"}
                          {uploadedFiles.length > 0 && (
                            <Badge className="ml-2 bg-white/20 text-white text-xs">{uploadedFiles.length}</Badge>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Posts */}
            <div className="space-y-6">
              {loading ? (
                <div className="text-gray-400 text-center py-8">Loading posts...</div>
              ) : (
                posts.map((post) => (
                  <Card key={post.id} className={cn("card-dark", post.isPinned && "border-purple-500")}>
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={post.author.avatar || "/placeholder.svg"} />
                            <AvatarFallback className="bg-purple-600 text-white font-bold">
                              {post.author.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center space-x-2">
                              <h3 className="font-bold text-white">{post.author.name}</h3>
                              {post.isPinned && <Pin className="w-4 h-4 text-purple-400" />}
                              {post.isCalendarEvent && <CalendarPlus className="w-4 h-4 text-cyan-400" />}
                            </div>
                            <p className="text-sm text-gray-400 font-normal">{post.author.role}</p>
                            <p className="text-xs text-gray-500 font-normal">{post.timestamp}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={cn("text-xs", getPostTypeColor(post.type))}>
                            {getPostTypeIcon(post.type)}
                            <span className="ml-1 capitalize font-normal">{post.type}</span>
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <p className="text-gray-300 leading-relaxed font-normal">{post.content}</p>

                      {/* Event Details */}
                      {post.event && (
                        <Card className="bg-gray-800 border-gray-600">
                          <CardContent className="p-4">
                            <h4 className="font-bold text-white mb-3">{post.event.title}</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                              <div className="flex items-center space-x-2 text-gray-300">
                                <Calendar className="w-4 h-4 text-cyan-400" />
                                <span className="font-normal">{post.event.date}</span>
                              </div>
                              <div className="flex items-center space-x-2 text-gray-300">
                                <Clock className="w-4 h-4 text-cyan-400" />
                                <span className="font-normal">{post.event.time}</span>
                              </div>
                              {post.event.location && (
                                <div className="flex items-center space-x-2 text-gray-300">
                                  <MapPin className="w-4 h-4 text-cyan-400" />
                                  <span className="font-normal">{post.event.location}</span>
                                </div>
                              )}
                              {post.event.meetingRoom && (
                                <div className="flex items-center space-x-2 text-gray-300">
                                  <Building className="w-4 h-4 text-cyan-400" />
                                  <span className="font-normal">{post.event.meetingRoom}</span>
                                </div>
                              )}
                              {post.event.theme && (
                                <div className="flex items-center space-x-2 text-gray-300">
                                  <Sparkles className="w-4 h-4 text-purple-400" />
                                  <span className="font-normal">Theme: {post.event.theme}</span>
                                </div>
                              )}
                              {post.event.organizer && (
                                <div className="flex items-center space-x-2 text-gray-300">
                                  <Users className="w-4 h-4 text-purple-400" />
                                  <span className="font-normal">Organized by {post.event.organizer}</span>
                                </div>
                              )}
                              {post.event.guest && (
                                <div className="flex items-center space-x-2 text-gray-300">
                                  <Users className="w-4 h-4 text-green-400" />
                                  <span className="font-normal">Guest: {post.event.guest}</span>
                                </div>
                              )}
                            </div>
                            {post.event.teamsLink && (
                              <Button
                                className="mt-3 btn-primary font-bold"
                                size="sm"
                                onClick={() => window.open(post.event?.teamsLink, "_blank")}
                              >
                                <Video className="w-4 h-4 mr-2" />
                                Join Teams Meeting
                                <ExternalLink className="w-3 h-3 ml-2" />
                              </Button>
                            )}
                          </CardContent>
                        </Card>
                      )}

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2">
                        {post.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="bg-gray-700 text-gray-300 font-normal">
                            #{tag}
                          </Badge>
                        ))}
                      </div>

                      {/* Engagement */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                        <div className="flex items-center space-x-6">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleLike(post.id)}
                            className="text-gray-400 hover:text-red-400 font-normal"
                          >
                            <Heart className="w-4 h-4 mr-2" />
                            {post.engagement.likes}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleComment(post.id)}
                            className="text-gray-400 hover:text-cyan-400 font-normal"
                          >
                            <MessageCircle className="w-4 h-4 mr-2" />
                            {post.engagement.comments}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleShare(post.id)}
                            className="text-gray-400 hover:text-purple-400 font-normal"
                          >
                            <Share2 className="w-4 h-4 mr-2" />
                            {post.engagement.shares}
                          </Button>
                        </div>
                        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-yellow-400">
                          <Bookmark className="w-4 h-4" />
                        </Button>
                      </div>
                      {showCommentBox[post.id] && (
                        <>
                          <div className="mt-2 flex items-center space-x-2">
                            <Input
                              value={commentInputs[post.id] || ""}
                              onChange={(e) => setCommentInputs((prev) => ({ ...prev, [post.id]: e.target.value }))}
                              placeholder="Add a comment..."
                              className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                            />
                            <Button size="sm" onClick={() => submitComment(post.id)} className="btn-primary font-bold">
                              Post
                            </Button>
                          </div>
                          {/* Comments List */}
                          <div className="mt-2 space-y-2">
                            {comments[post.id]?.length ? (
                              comments[post.id].map((c, idx) => (
                                <div key={idx} className="text-sm text-gray-300 bg-gray-800 rounded px-3 py-2">
                                  <span>{c.comment}</span>
                                  <span className="ml-2 text-xs text-gray-500">{new Date(c.created_at).toLocaleString()}</span>
                                </div>
                              ))
                            ) : (
                              <div className="text-xs text-gray-500">No comments yet.</div>
                            )}
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>

          {/* Right Sidebar - Upcoming Events */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              {/* Upcoming Events */}
              <Card className="card-dark">
                <CardHeader>
                  <CardTitle className="text-lg text-white font-bold flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-cyan-400" />
                    <span>Upcoming Events</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {upcomingEvents.map((event) => (
                    <div
                      key={event.id}
                      className={cn(
                        "p-3 rounded-lg border transition-all hover:bg-gray-800 cursor-pointer",
                        event.isToday
                          ? "bg-cyan-900/20 border-cyan-700"
                          : event.isThisWeek
                            ? "bg-purple-900/20 border-purple-700"
                            : "bg-gray-800 border-gray-600",
                      )}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {getEventTypeIcon(event.type)}
                          <h4 className="font-bold text-white text-sm">{event.title}</h4>
                        </div>
                        {event.isToday && <Badge className="bg-cyan-600 text-white text-xs font-normal">Today</Badge>}
                        {event.isThisWeek && !event.isToday && (
                          <Badge className="bg-purple-600 text-white text-xs font-normal">This Week</Badge>
                        )}
                      </div>

                      <div className="space-y-1 text-xs text-gray-400">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-3 h-3" />
                          <span className="font-normal">{event.date}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-3 h-3" />
                          <span className="font-normal">{event.time}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Users className="w-3 h-3" />
                          <span className="font-normal">by {event.organizer}</span>
                        </div>
                        {event.location && (
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-3 h-3" />
                            <span className="font-normal">{event.location}</span>
                          </div>
                        )}
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-gray-500 font-normal">{event.attendees} attendees</span>
                          {event.teamsLink && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 px-2 text-xs text-cyan-400 hover:text-cyan-300"
                              onClick={() => window.open(event.teamsLink, "_blank")}
                            >
                              <Video className="w-3 h-3 mr-1" />
                              Join
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  <Button variant="ghost" className="w-full text-gray-400 hover:text-white font-normal">
                    View All Events
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="card-dark">
                <CardHeader>
                  <CardTitle className="text-lg text-white font-bold">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start btn-secondary font-normal">
                    <CalendarPlus className="w-4 h-4 mr-3" />
                    Schedule Event
                  </Button>
                  <Button className="w-full justify-start btn-secondary font-normal">
                    <Bell className="w-4 h-4 mr-3" />
                    Set Reminder
                  </Button>
                  <Button className="w-full justify-start btn-secondary font-normal">
                    <Users className="w-4 h-4 mr-3" />
                    Invite Team
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
