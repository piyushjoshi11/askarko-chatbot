// Chat API integration
export interface ChatResponse {
  response: string;
  event_created?: boolean;
  event_details?: Record<string, any>;
  chat_history?: Array<{ role: "user" | "assistant"; content: string }>;

}

// Quiz interfaces
export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  difficulty: "easy" | "medium" | "hard" | "brutal"
  category: "technical" | "stupid" | "random"
  roast?: string
}

// Accept chat_history as argument
export async function chatWithBot(
  message: string,
  chat_history: Array<{ role: "user" | "assistant"; content: string }> = []
): Promise<ChatResponse> {
  const response = await axiosInstance.post("/chat", { message, chat_history });
  return response.data;
}

// Quiz API functions
export async function generateQuizQuestion(): Promise<QuizQuestion> {
  const response = await axiosInstance.post("/quiz/generate-question");
  return response.data;
}
export interface NewsPost {
  id: string
  author: {
    name: string
    avatar?: string
    role: string
  }
  content: string
  type: "event" | "announcement" | "update" | "achievement"
  timestamp: string
  event?: {
    title: string
    date: string
    time: string
    location?: string
    teamsLink?: string
    meetingRoom?: string
    theme?: string
    organizer?: string
    guest?: string
  }
  engagement: {
    likes: number
    comments: number
    shares: number
  }
  tags: string[]
  isPinned?: boolean
  isCalendarEvent?: boolean
}

export interface UpcomingEvent {
  id: string
  title: string
  date: string
  time: string
  type: "pulse" | "townhall" | "workshop" | "meeting"
  organizer: string
  location?: string
  teamsLink?: string
  attendees: number
  isToday?: boolean
  isThisWeek?: boolean
}

export interface UploadedFile {
  file: File
  preview?: string
  type: "image" | "video" | "document"
}

import { axiosInstance } from "@/config/axios-config"

// Mock data for development
/*
export const mockPosts: NewsPost[] = [
  {
    id: "1",
    author: {
      name: "Piyush",
      role: "Associate",
      avatar: "/api/placeholder/40/40",
    },
    content:
      "Exciting Pulse session coming up for our Data Engineering team! We'll be diving deep into our latest pipeline optimizations and sharing insights from recent projects. Don't miss this opportunity to connect and learn!",
    type: "event",
    timestamp: "2 hours ago",
    event: {
      title: "Pulse session for Data Engineering",
      date: "July 20th, 2025",
      time: "3:00 PM",
      teamsLink: "https://teams.microsoft.com/l/meetup-join/...",
      meetingRoom: "Conference Room A-204",
    },
    engagement: { likes: 24, comments: 8, shares: 3 },
    tags: ["Data Engineering", "Pulse Session", "Team Meeting"],
    isPinned: true,
    isCalendarEvent: true,
  },
  {
    id: "2",
    author: {
      name: "Arko",
      role: "DevOps Engineer",
      avatar: "/api/placeholder/40/40",
    },
    content:
      "Join us for an insightful Pulse session focused on DevOps best practices and our latest automation achievements. We'll be sharing our CI/CD improvements and discussing upcoming infrastructure changes.",
    type: "event",
    timestamp: "3 hours ago",
    event: {
      title: "Pulse session for DevOps",
      date: "July 20th, 2025",
      time: "3:00 PM",
      teamsLink: "https://teams.microsoft.com/l/meetup-join/...",
      meetingRoom: "Conference Room B-301",
    },
    engagement: { likes: 18, comments: 5, shares: 2 },
    tags: ["DevOps", "Pulse Session", "Automation"],
    isCalendarEvent: true,
  },
  {
    id: "3",
    author: {
      name: "Sunil Dolwani",
      role: "Principal",
      avatar: "/api/placeholder/40/40",
    },
    content:
      "Mark your calendars! Our quarterly Amgen Operations Townhall is approaching with an exciting theme - 'Crescendo'. We're honored to have Mohit Talwar join us as our special guest speaker. This will be a fantastic opportunity to align on our strategic initiatives and celebrate our collective achievements.",
    type: "announcement",
    timestamp: "1 day ago",
    event: {
      title: "Amgen Operations Townhall",
      date: "July 30th, 2025",
      time: "2:00 PM",
      theme: "Crescendo",
      organizer: "Sunil Dolwani",
      guest: "Mohit Talwar",
      teamsLink: "https://teams.microsoft.com/l/meetup-join/...",
    },
    engagement: { likes: 67, comments: 23, shares: 12 },
    tags: ["Townhall", "Leadership", "Strategy"],
    isPinned: true,
    isCalendarEvent: true,
  },
  {
    id: "4",
    author: {
      name: "Sarah Chen",
      role: "Data Scientist",
      avatar: "/api/placeholder/40/40",
    },
    content:
      "Thrilled to announce that our ML model deployment platform has achieved 99.9% uptime this quarter! This milestone represents months of hard work from our entire AI/ML team. Special thanks to everyone who contributed to this success. 🎉",
    type: "achievement",
    timestamp: "2 days ago",
    engagement: { likes: 45, comments: 15, shares: 8 },
    tags: ["AI/ML", "Achievement", "Platform"],
  },
  {
    id: "5",
    author: {
      name: "Mike Rodriguez",
      role: "Platform Engineer",
      avatar: "/api/placeholder/40/40",
    },
    content:
      "New Kubernetes cluster deployment completed successfully! We've upgraded our infrastructure to support better scalability and improved our deployment pipeline efficiency by 40%. Documentation and migration guides are now available on our internal wiki.",
    type: "update",
    timestamp: "3 days ago",
    engagement: { likes: 32, comments: 11, shares: 6 },
    tags: ["Infrastructure", "Kubernetes", "Platform"],
  },
]
*/

export const upcomingEvents: UpcomingEvent[] = [
  {
    id: "1",
    title: "Data Engineering Pulse Session",
    date: "July 20th, 2025",
    time: "3:00 PM",
    type: "pulse",
    organizer: "Piyush",
    location: "Conference Room A-204",
    teamsLink: "https://teams.microsoft.com/l/meetup-join/...",
    attendees: 24,
    isToday: true,
  },
  {
    id: "2",
    title: "DevOps Pulse Session",
    date: "July 20th, 2025",
    time: "3:00 PM",
    type: "pulse",
    organizer: "Arko",
    location: "Conference Room B-301",
    teamsLink: "https://teams.microsoft.com/l/meetup-join/...",
    attendees: 18,
    isToday: true,
  },
  {
    id: "3",
    title: "Security Awareness Workshop",
    date: "July 25th, 2025",
    time: "10:00 AM",
    type: "workshop",
    organizer: "Alex Johnson",
    location: "Training Center - Room 101",
    teamsLink: "https://teams.microsoft.com/l/meetup-join/...",
    attendees: 45,
    isThisWeek: true,
  },
  {
    id: "4",
    title: "Amgen Operations Townhall",
    date: "July 30th, 2025",
    time: "2:00 PM",
    type: "townhall",
    organizer: "Sunil Dolwani",
    teamsLink: "https://teams.microsoft.com/l/meetup-join/...",
    attendees: 150,
    isThisWeek: true,
  },
  {
    id: "5",
    title: "AI/ML Team Standup",
    date: "August 2nd, 2025",
    time: "9:00 AM",
    type: "meeting",
    organizer: "Sarah Chen",
    location: "Conference Room C-105",
    attendees: 12,
  },
  {
    id: "6",
    title: "Platform Engineering Review",
    date: "August 5th, 2025",
    time: "11:00 AM",
    type: "meeting",
    organizer: "Mike Rodriguez",
    location: "Conference Room D-202",
    teamsLink: "https://teams.microsoft.com/l/meetup-join/...",
    attendees: 8,
  },
]

// Fetch posts from API
export async function fetchPosts(): Promise<NewsPost[]> {
  const response = await axiosInstance.get("/news")
  return response.data
}

// Create a new post via API
export async function createPost(post: NewsPost): Promise<NewsPost> {
  const response = await axiosInstance.post("/post_news", post)
  return response.data
}

// Engagement API (like, comment, share)
export async function createPostEngagement(
  postId: string,
  action: "like" | "comment" | "share",
  payload?: Record<string, any>
): Promise<void> {
  await axiosInstance.post(`/news/${postId}/engagement`, { action, ...payload })
}

// Fetch comments for a post
export async function fetchComments(postId: string): Promise<Array<{ comment: string; created_at: string }>> {
  const response = await axiosInstance.get(`/news/${postId}/comments`)
  return response.data
}
