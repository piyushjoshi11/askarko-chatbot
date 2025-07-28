"use client"

import { useChat } from "ai/react"
import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Send, Bot, User, Copy, ThumbsUp, ThumbsDown, RefreshCw, Mic, MicOff, Paperclip, Sparkles } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface EnhancedChatProps {
  apiEndpoint: string
  initialMessage?: string
  placeholder?: string
  title?: string
  suggestions?: string[]
  className?: string
}

export function EnhancedChat({
  apiEndpoint,
  initialMessage,
  placeholder = "Type your message...",
  title = "AI Assistant",
  suggestions = [],
  className = "",
}: EnhancedChatProps) {
  const [isListening, setIsListening] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(true)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  const { messages, input, handleInputChange, handleSubmit, isLoading, reload, setMessages } = useChat({
    api: apiEndpoint,
    initialMessages: initialMessage
      ? [
          {
            id: "welcome",
            role: "assistant",
            content: initialMessage,
          },
        ]
      : [],
  })

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSuggestionClick = (suggestion: string) => {
    const syntheticEvent = {
      preventDefault: () => {},
      target: { elements: { message: { value: suggestion } } },
    } as any

    // Add user message
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        role: "user",
        content: suggestion,
      },
    ])

    setShowSuggestions(false)
    handleSubmit(syntheticEvent)
  }

  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
    toast({
      title: "Copied to clipboard",
      description: "Message content has been copied.",
    })
  }

  const handleFeedback = (messageId: string, type: "positive" | "negative") => {
    toast({
      title: "Feedback received",
      description: `Thank you for your ${type} feedback!`,
    })
  }

  const toggleVoiceInput = () => {
    if ("webkitSpeechRecognition" in window) {
      const recognition = new (window as any).webkitSpeechRecognition()
      recognition.continuous = false
      recognition.interimResults = false
      recognition.lang = "en-US"

      if (!isListening) {
        recognition.start()
        setIsListening(true)

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript
          handleInputChange({ target: { value: transcript } } as any)
          setIsListening(false)
        }

        recognition.onerror = () => {
          setIsListening(false)
          toast({
            title: "Voice input error",
            description: "Could not recognize speech. Please try again.",
            variant: "destructive",
          })
        }

        recognition.onend = () => {
          setIsListening(false)
        }
      } else {
        recognition.stop()
        setIsListening(false)
      }
    } else {
      toast({
        title: "Voice input not supported",
        description: "Your browser doesn't support voice input.",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className={`h-full flex flex-col ${className}`}>
      <CardHeader className="border-b">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bot className="w-5 h-5 text-blue-600" />
            <span>{title}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
              <Sparkles className="w-3 h-3 mr-1" />
              AI-Powered
            </Badge>
            <Button variant="ghost" size="sm" onClick={() => reload()}>
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0 flex flex-col flex-1">
        {/* Messages */}
        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start space-x-3 ${
                  message.role === "user" ? "flex-row-reverse space-x-reverse" : ""
                }`}
              >
                <Avatar className="w-8 h-8">
                  <AvatarFallback
                    className={message.role === "user" ? "bg-blue-100 text-blue-600" : "bg-indigo-100 text-indigo-600"}
                  >
                    {message.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </AvatarFallback>
                </Avatar>

                <div className={`flex-1 max-w-3xl ${message.role === "user" ? "text-right" : ""}`}>
                  <div
                    className={`inline-block p-4 rounded-lg ${
                      message.role === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{message.content}</div>
                  </div>

                  {/* Message actions for assistant messages */}
                  {message.role === "assistant" && (
                    <div className="flex items-center space-x-2 mt-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopyMessage(message.content)}
                        className="text-xs"
                      >
                        <Copy className="w-3 h-3 mr-1" />
                        Copy
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleFeedback(message.id, "positive")}
                        className="text-xs"
                      >
                        <ThumbsUp className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleFeedback(message.id, "negative")}
                        className="text-xs"
                      >
                        <ThumbsDown className="w-3 h-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Suggestions */}
            {showSuggestions && suggestions.length > 0 && messages.length <= 1 && (
              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-700">Suggested questions:</div>
                <div className="grid grid-cols-1 gap-2">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="text-left p-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors text-sm"
                      disabled={isLoading}
                    >
                      "{suggestion}"
                    </button>
                  ))}
                </div>
              </div>
            )}

            {isLoading && (
              <div className="flex items-start space-x-3">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-indigo-100 text-indigo-600">
                    <Bot className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input Form */}
        <div className="border-t p-4">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex space-x-2">
              <div className="flex-1 relative">
                <Textarea
                  value={input}
                  onChange={handleInputChange}
                  placeholder={placeholder}
                  className="min-h-[44px] max-h-32 resize-none pr-20"
                  disabled={isLoading}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleSubmit(e as any)
                    }
                  }}
                />
                <div className="absolute right-2 top-2 flex space-x-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={toggleVoiceInput}
                    className={`p-1 ${isListening ? "text-red-600" : "text-gray-400"}`}
                  >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </Button>
                  <Button type="button" variant="ghost" size="sm" className="p-1 text-gray-400">
                    <Paperclip className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <Button type="submit" disabled={isLoading || !input.trim()} className="self-end">
                <Send className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Press Enter to send • Shift+Enter for new line</span>
              {isListening && <span className="text-red-600 animate-pulse">Listening...</span>}
            </div>
          </form>
        </div>
      </CardContent>
    </Card>
  )
}
