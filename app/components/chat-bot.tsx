"use client"

import { useState } from "react"
import { chatWithBot } from "../services/newsService"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Send, User, Sparkles, Calendar, MapPin, Clock, Users, Video } from "lucide-react"
import { Logo } from "./logo"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface ChatResponse {
  response: string;
  event_created?: boolean;
  event_details?: {
    title?: string;
    date?: string;
    time?: string;
    location?: string;
  };
  chat_history?: Array<{ role: string; content: string }>;
  event_form_required?: boolean;
}

export function ChatBot() {
  // Initial welcome message
  const initialMessages: Message[] = [
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hi! I'm AskArko, your AI Knowledge Assistant. I can help you learn about Amgen Operations projects, explore different domains, or assist with business development. What would you like to know?",
      timestamp: new Date(),
    },
  ]
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [eventFormVisible, setEventFormVisible] = useState(false)
  const [eventForm, setEventForm] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    teamsLink: "",
    meetingRoom: "",
    theme: "",
    organizer: "",
    guest: "",
  })

  const quickSuggestions = [
    "Tell me about recent projects",
    "What teams are working on AI/ML?",
    "Show me data engineering projects",
    "Help me plan a new initiative",
  ]

  // Helper to convert local messages to API chat_history format
  const getChatHistoryForApi = () =>
    messages
      .filter((m) => m.id !== "welcome") // Don't send welcome message to backend
      .map((m) => ({
        role: m.role,
        content: m.content,
      }))

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    setIsLoading(true)
    // Add user message locally for immediate feedback
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setInput("")

    try {
      const chatRes: ChatResponse = await chatWithBot(userMessage.content, getChatHistoryForApi())
      let aiContent = chatRes.response
      if (chatRes.event_created && chatRes.event_details) {
        aiContent += `\n\n✅ Event created: ${chatRes.event_details.title} on ${chatRes.event_details.date} at ${chatRes.event_details.time} (${chatRes.event_details.location})`;
      }
      // Show event form if backend requests it
      if (chatRes.event_form_required) { 
        setEventFormVisible(true)
        // Prefill form if event_details provided
        if (chatRes.event_details) {
          setEventForm({
            title: chatRes.event_details.title || "",
            date: chatRes.event_details.date || "",
            time: chatRes.event_details.time || "",
            location: chatRes.event_details.location || "",
            teamsLink: "",
            meetingRoom: "",
            theme: "",
            organizer: "",
            guest: "",
          })
        } else {
          setEventForm({ title: "", date: "", time: "", location: "", teamsLink: "", meetingRoom: "", theme: "", organizer: "", guest: "" })
        }
      } else {
        setEventFormVisible(false)
        setEventForm({ title: "", date: "", time: "", location: "", teamsLink: "", meetingRoom: "", theme: "", organizer: "", guest: "" })
      }
      // Use returned chat_history to update local state
      if (Array.isArray(chatRes.chat_history)) {
        // Merge timestamps for display (approximate, not exact)
        const updatedMessages: Message[] = chatRes.chat_history.map((msg, idx) => ({
          id: `${Date.now()}-${idx}`,
          role: msg.role === "user" ? "user" : "assistant",
          content: msg.content,
          timestamp: new Date(), // Could be improved with real timestamps if backend supports
        }))
        setMessages([initialMessages[0], ...updatedMessages])
      } else {
        // Fallback: add AI response
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: aiContent,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, aiResponse])
      }
    } catch (err) {
      setMessages((prev) => [...prev, {
        id: (Date.now() + 2).toString(),
        role: "assistant",
        content: "Sorry, there was an error processing your request.",
        timestamp: new Date(),
      }])
    }
    setIsLoading(false)
  }

  // Handle event form submit
  const handleEventFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!eventForm.title || !eventForm.date || !eventForm.time || !eventForm.location) return
    setIsLoading(true)
    setEventFormVisible(false)
    setInput("")
    // Send structured event details as message
    const eventMsg = `form: title: ${eventForm.title}, date: ${eventForm.date}, time: ${eventForm.time}, location: ${eventForm.location}`
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: eventMsg,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    try {
      const chatRes: ChatResponse = await chatWithBot(eventMsg, getChatHistoryForApi())
      let aiContent = chatRes.response
      if (chatRes.event_created && chatRes.event_details) {
        aiContent += `\n\n✅ Event created: ${chatRes.event_details.title} on ${chatRes.event_details.date} at ${chatRes.event_details.time} (${chatRes.event_details.location})`;
      }
      setEventForm({ title: "", date: "", time: "", location: "", teamsLink: "", meetingRoom: "", theme: "", organizer: "", guest: "" })
      setEventFormVisible(false)
      if (Array.isArray(chatRes.chat_history)) {
        const updatedMessages: Message[] = chatRes.chat_history.map((msg, idx) => ({
          id: `${Date.now()}-${idx}`,
          role: msg.role === "user" ? "user" : "assistant",
          content: msg.content,
          timestamp: new Date(),
        }))
        setMessages([initialMessages[0], ...updatedMessages])
      } else {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: aiContent,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, aiResponse])
      }
    } catch (err) {
      setMessages((prev) => [...prev, {
        id: (Date.now() + 2).toString(),
        role: "assistant",
        content: "Sorry, there was an error processing your request.",
        timestamp: new Date(),
      }])
    }
    setIsLoading(false)
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion)
  }

  return (
    <div className="flex flex-col h-full bg-gray-900">
      {/* Messages */}
      <ScrollArea className="flex-1 p-6">
        <div className="space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start space-x-4 ${
                message.role === "user" ? "flex-row-reverse space-x-reverse" : ""
              }`}
            >
              <Avatar className="w-10 h-10 border-2 border-gray-600">
                <AvatarFallback
                  className={
                    message.role === "user"
                      ? "bg-gradient-to-br from-purple-600 to-purple-700 text-white"
                      : "bg-gradient-to-br from-cyan-600 to-cyan-700 text-white"
                  }
                >
                  {message.role === "user" ? (
                    <User className="w-5 h-5" />
                  ) : (
                    <div className="w-6 h-6 relative">
                      <Logo size="sm" showText={false} className="scale-75" />
                    </div>
                  )}
                </AvatarFallback>
              </Avatar>

              <div className={`flex-1 max-w-md ${message.role === "user" ? "text-right" : ""}`}>
                <div
                  className={`inline-block p-4 rounded-2xl ${
                    message.role === "user"
                      ? "bg-gradient-to-br from-purple-600 to-purple-700 text-white"
                      : "bg-gradient-to-br from-gray-800 to-gray-700 text-gray-100 border border-gray-600"
                  }`}
                >
                  <div className="whitespace-pre-wrap leading-relaxed">{message.content}</div>
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-start space-x-4">
              <Avatar className="w-10 h-10 border-2 border-gray-600">
                <AvatarFallback className="bg-gradient-to-br from-cyan-600 to-cyan-700 text-white">
                  <div className="w-6 h-6 relative">
                    <Logo size="sm" showText={false} className="scale-75" />
                  </div>
                </AvatarFallback>
              </Avatar>
              <div className="bg-gradient-to-br from-gray-800 to-gray-700 p-4 rounded-2xl border border-gray-600">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          {/* Event creation form (shown when backend requests details) */}
          {eventFormVisible && (
            <form
              onSubmit={handleEventFormSubmit}
              className="bg-gray-800 border border-purple-500 rounded-xl p-6 space-y-4 max-w-2xl mx-auto"
            >
              <div className="text-lg font-bold text-purple-300 mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Create Event
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Event Title - Full width */}
                <div className="md:col-span-2">
                  <Label htmlFor="title" className="text-gray-300 text-sm font-medium">
                    Event Title *
                  </Label>
                  <Input
                    id="title"
                    placeholder="Enter event title"
                    value={eventForm.title}
                    onChange={e => setEventForm({ ...eventForm, title: e.target.value })}
                    className="bg-gray-900 border-gray-600 text-white placeholder-gray-400 mt-1"
                    disabled={isLoading}
                    required
                  />
                </div>

                {/* Date */}
                <div>
                  <Label htmlFor="date" className="text-gray-300 text-sm font-medium">
                    Date *
                  </Label>
                  <Input
                    id="date"
                    placeholder="July 23rd, 2025"
                    value={eventForm.date}
                    onChange={e => setEventForm({ ...eventForm, date: e.target.value })}
                    className="bg-gray-900 border-gray-600 text-white placeholder-gray-400 mt-1"
                    disabled={isLoading}
                    required
                  />
                </div>

                {/* Time */}
                <div>
                  <Label htmlFor="time" className="text-gray-300 text-sm font-medium">
                    Time *
                  </Label>
                  <Input
                    id="time"
                    placeholder="5:00 PM"
                    value={eventForm.time}
                    onChange={e => setEventForm({ ...eventForm, time: e.target.value })}
                    className="bg-gray-900 border-gray-600 text-white placeholder-gray-400 mt-1"
                    disabled={isLoading}
                    required
                  />
                </div>

                {/* Location */}
                <div>
                  <Label htmlFor="location" className="text-gray-300 text-sm font-medium">
                    Location *
                  </Label>
                  <Input
                    id="location"
                    placeholder="Conference Room A"
                    value={eventForm.location}
                    onChange={e => setEventForm({ ...eventForm, location: e.target.value })}
                    className="bg-gray-900 border-gray-600 text-white placeholder-gray-400 mt-1"
                    disabled={isLoading}
                    required
                  />
                </div>

                {/* Meeting Room */}
                <div>
                  <Label htmlFor="meetingRoom" className="text-gray-300 text-sm font-medium">
                    Meeting Room
                  </Label>
                  <Select value={eventForm.meetingRoom} onValueChange={value => setEventForm({ ...eventForm, meetingRoom: value })}>
                    <SelectTrigger className="bg-gray-900 border-gray-600 text-white mt-1">
                      <SelectValue placeholder="Select room" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      <SelectItem value="conf-a">Conference Room A</SelectItem>
                      <SelectItem value="conf-b">Conference Room B</SelectItem>
                      <SelectItem value="training">Training Room</SelectItem>
                      <SelectItem value="boardroom">Boardroom</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Teams Link */}
                <div className="md:col-span-2">
                  <Label htmlFor="teamsLink" className="text-gray-300 text-sm font-medium">
                    Teams Link
                  </Label>
                  <Input
                    id="teamsLink"
                    placeholder="https://teams.microsoft.com/l/meetup-join/..."
                    value={eventForm.teamsLink}
                    onChange={e => setEventForm({ ...eventForm, teamsLink: e.target.value })}
                    className="bg-gray-900 border-gray-600 text-white placeholder-gray-400 mt-1"
                    disabled={isLoading}
                  />
                </div>

                {/* Organizer */}
                <div>
                  <Label htmlFor="organizer" className="text-gray-300 text-sm font-medium">
                    Organizer
                  </Label>
                  <Input
                    id="organizer"
                    placeholder="Event organizer name"
                    value={eventForm.organizer}
                    onChange={e => setEventForm({ ...eventForm, organizer: e.target.value })}
                    className="bg-gray-900 border-gray-600 text-white placeholder-gray-400 mt-1"
                    disabled={isLoading}
                  />
                </div>

                {/* Theme */}
                <div>
                  <Label htmlFor="theme" className="text-gray-300 text-sm font-medium">
                    Theme
                  </Label>
                  <Select value={eventForm.theme} onValueChange={value => setEventForm({ ...eventForm, theme: value })}>
                    <SelectTrigger className="bg-gray-900 border-gray-600 text-white mt-1">
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      <SelectItem value="meeting">Meeting</SelectItem>
                      <SelectItem value="presentation">Presentation</SelectItem>
                      <SelectItem value="training">Training</SelectItem>
                      <SelectItem value="workshop">Workshop</SelectItem>
                      <SelectItem value="social">Social Event</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Guest */}
                <div className="md:col-span-2">
                  <Label htmlFor="guest" className="text-gray-300 text-sm font-medium">
                    Special Guests
                  </Label>
                  <Textarea
                    id="guest"
                    placeholder="List any special guests or speakers"
                    value={eventForm.guest}
                    onChange={e => setEventForm({ ...eventForm, guest: e.target.value })}
                    className="bg-gray-900 border-gray-600 text-white placeholder-gray-400 mt-1"
                    disabled={isLoading}
                    rows={2}
                  />
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <Button
                  type="submit"
                  className="btn-primary rounded-xl px-6 py-3 flex-1"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating..." : "Create Event"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEventFormVisible(false)}
                  className="border-gray-600 text-gray-300 hover:bg-gray-700 rounded-xl px-6 py-3"
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}

          {/* Quick Suggestions */}
          {messages.length === 1 && (
            <div className="space-y-3">
              <div className="text-sm font-medium text-gray-400 flex items-center space-x-2">
                <Sparkles className="w-4 h-4" />
                <span>Quick suggestions:</span>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {quickSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="text-left p-3 bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 text-gray-300 rounded-xl transition-all duration-300 text-sm border border-gray-600 hover:border-purple-500"
                    disabled={isLoading}
                  >
                    "{suggestion}"
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Form */}
      <div className="border-t border-gray-700 p-6 bg-gradient-to-r from-gray-800 to-gray-700">
        <div className="flex space-x-3">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything about Amgen Operations..."
            className="flex-1 bg-gray-900 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 rounded-xl py-3 px-4 text-base"
            disabled={isLoading}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
          />
          <Button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="btn-primary rounded-xl px-6 py-3"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
        <div className="text-xs text-gray-500 mt-2 text-center">Press Enter to send • Shift+Enter for new line</div>
      </div>
    </div>
  )
}
