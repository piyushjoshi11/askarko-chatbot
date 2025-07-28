"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Brain, Trophy, Skull, Flame, Zap, Target, AlertTriangle } from "lucide-react"
import { Logo } from "./logo"

interface Question {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  difficulty: "easy" | "medium" | "hard" | "brutal"
  category: "technical" | "stupid" | "random"
  roast?: string
}

interface QuizState {
  currentQuestion: Question | null
  score: number
  loserScore: number
  totalQuestions: number
  correctAnswers: number
  isAnswered: boolean
  selectedAnswer: number | null
  showRoast: boolean
  roastMessage: string
  streak: number
  maxStreak: number
  gameStarted: boolean
}

const DIFFICULTY_COLORS = {
  easy: "bg-green-500",
  medium: "bg-yellow-500", 
  hard: "bg-orange-500",
  brutal: "bg-red-500"
}

const CATEGORY_ICONS = {
  technical: <Brain className="w-4 h-4" />,
  stupid: <Skull className="w-4 h-4" />,
  random: <Zap className="w-4 h-4" />
}

export function QuizTab() {
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestion: null,
    score: 0,
    loserScore: parseInt(localStorage.getItem('arkoquiz_loser_score') || '0'),
    totalQuestions: 0,
    correctAnswers: 0,
    isAnswered: false,
    selectedAnswer: null,
    showRoast: false,
    roastMessage: "",
    streak: 0,
    maxStreak: parseInt(localStorage.getItem('arkoquiz_max_streak') || '0'),
    gameStarted: false
  })

  const [isLoading, setIsLoading] = useState(false)

  // Save loser score and max streak to localStorage
  useEffect(() => {
    localStorage.setItem('arkoquiz_loser_score', quizState.loserScore.toString())
    localStorage.setItem('arkoquiz_max_streak', quizState.maxStreak.toString())
  }, [quizState.loserScore, quizState.maxStreak])

  const generateQuestion = async (): Promise<Question> => {
    setIsLoading(true)
    
    try {
      // Import the API function
      const { generateQuizQuestion } = await import("../services/newsService")
      const apiQuestion = await generateQuizQuestion()
      
      // Convert API response to local Question interface
      const question: Question = {
        id: apiQuestion.id,
        question: apiQuestion.question,
        options: apiQuestion.options,
        correctAnswer: apiQuestion.correctAnswer,
        difficulty: apiQuestion.difficulty,
        category: apiQuestion.category,
        roast: apiQuestion.roast
      }
      
      setIsLoading(false)
      return question
    } catch (error) {
      console.error("Failed to generate question:", error)
      // Fallback to mock questions if API fails
      const mockQuestions: Question[] = [
        {
          id: "1",
          question: "What does 'API' stand for?",
          options: ["Application Programming Interface", "Advanced Programming Integration", "Automated Process Implementation", "All Programs Integrated"],
          correctAnswer: 0,
          difficulty: "easy",
          category: "technical",
          roast: "Really? API? That's like not knowing what a computer is. I'm embarrassed for your keyboard! 💻"
        },
        {
          id: "2", 
          question: "How many sides does a triangle have?",
          options: ["2", "3", "4", "It depends on the triangle"],
          correctAnswer: 1,
          difficulty: "easy",
          category: "stupid",
          roast: "You just failed at basic geometry. A triangle! TRIANGLE! Even a toddler with crayons knows this! 📐"
        },
        {
          id: "3",
          question: "Which HTTP status code indicates 'Not Found'?",
          options: ["200", "404", "500", "403"],
          correctAnswer: 1,
          difficulty: "medium",
          category: "technical",
          roast: "404: Your knowledge not found! It's the most famous HTTP code and you still got it wrong! 🤦‍♂️"
        },
        {
          id: "4",
          question: "What color do you get when you mix red and blue?",
          options: ["Green", "Yellow", "Purple", "Orange"],
          correctAnswer: 2,
          difficulty: "easy",
          category: "stupid",
          roast: "Color mixing! They teach this in kindergarten! I'm starting to think crayons were too advanced for you! 🖍️"
        },
        {
          id: "5",
          question: "In React, what hook is used for side effects?",
          options: ["useState", "useEffect", "useContext", "useCallback"],
          correctAnswer: 1,
          difficulty: "medium",
          category: "technical",
          roast: "useEffect is literally the second most basic React hook! Did you learn React from fortune cookies? 🥠"
        }
      ]
      
      const randomQuestion = mockQuestions[Math.floor(Math.random() * mockQuestions.length)]
      setIsLoading(false)
      return randomQuestion
    }
  }

  const generateRoast = (question: Question, selectedAnswer: number): string => {
    // Use API-generated roast if available
    if (question.roast) {
      return question.roast
    }
    
    // Fallback roasts by difficulty
    const roasts = {
      easy: [
        "Really? That was easier than explaining colors to a toddler. Even my grandmother's flip phone could have gotten that right! 📱",
        "Wow, you managed to fail at something a trained monkey could do. I'm actually impressed by your dedication to mediocrity! 🐒",
        "That question was so easy, it basically answered itself. But somehow you still found a way to mess it up. Remarkable! 🤦‍♂️"
      ],
      medium: [
        "I had faith in you... for about 2 seconds. Then you went and proved me wrong. Thanks for the reality check! 😤",
        "That was moderately challenging, and you moderately failed. At least you're consistent in your inconsistency! ⚖️",
        "I've seen better decision-making from a Magic 8-Ball. Maybe you should consult one next time? 🎱"
      ],
      hard: [
        "Ouch! That one actually required some brain cells, but it seems yours were taking a coffee break. ☕",
        "I respect the attempt, but your answer was about as accurate as a weather forecast. Better luck next time, champ! 🌧️",
        "That was genuinely difficult, and you genuinely blew it. At least you aimed high before falling flat! 🎯"
      ],
      brutal: [
        "BRUTAL! That question was meant to separate the experts from the wannabes. Guess which category you fell into? 💀",
        "I'm not even mad, I'm impressed. It takes real skill to be that confidently wrong about something so complex! 🔥",
        "That question was designed to humble the cocky, and mission accomplished! Your ego just got schooled harder than a freshman in calculus! 📚"
      ]
    }
    
    const categoryRoasts = roasts[question.difficulty]
    return categoryRoasts[Math.floor(Math.random() * categoryRoasts.length)]
  }

  const startQuiz = async () => {
    setQuizState(prev => ({ ...prev, gameStarted: true }))
    const question = await generateQuestion()
    setQuizState(prev => ({
      ...prev,
      currentQuestion: question,
      isAnswered: false,
      selectedAnswer: null,
      showRoast: false
    }))
  }

  const selectAnswer = (answerIndex: number) => {
    if (quizState.isAnswered) return
    
    setQuizState(prev => ({ ...prev, selectedAnswer: answerIndex }))
  }

  const submitAnswer = () => {
    if (quizState.selectedAnswer === null || !quizState.currentQuestion) return
    
    const isCorrect = quizState.selectedAnswer === quizState.currentQuestion.correctAnswer
    const newLoserScore = isCorrect ? quizState.loserScore : quizState.loserScore + 1
    const newStreak = isCorrect ? quizState.streak + 1 : 0
    const newMaxStreak = Math.max(newStreak, quizState.maxStreak)
    
    let roastMessage = ""
    if (!isCorrect) {
      roastMessage = generateRoast(quizState.currentQuestion, quizState.selectedAnswer)
    } else {
      const successMessages = [
        "Fine, you got one right. Don't let it go to your head! 🎉",
        "Wow, look who decided to use their brain today! Color me shocked! 🧠",
        "Correct! Even a broken clock is right twice a day. 🕐",
        "Not bad! Maybe there's hope for you after all... probably not, but maybe! ✨"
      ]
      roastMessage = successMessages[Math.floor(Math.random() * successMessages.length)]
    }
    
    setQuizState(prev => ({
      ...prev,
      isAnswered: true,
      loserScore: newLoserScore,
      score: isCorrect ? prev.score + 1 : prev.score,
      totalQuestions: prev.totalQuestions + 1,
      correctAnswers: isCorrect ? prev.correctAnswers + 1 : prev.correctAnswers,
      showRoast: true,
      roastMessage,
      streak: newStreak,
      maxStreak: newMaxStreak
    }))
  }

  const nextQuestion = async () => {
    const question = await generateQuestion()
    setQuizState(prev => ({
      ...prev,
      currentQuestion: question,
      isAnswered: false,
      selectedAnswer: null,
      showRoast: false
    }))
  }

  const resetQuiz = () => {
    setQuizState(prev => ({
      ...prev,
      currentQuestion: null,
      score: 0,
      totalQuestions: 0,
      correctAnswers: 0,
      isAnswered: false,
      selectedAnswer: null,
      showRoast: false,
      roastMessage: "",
      streak: 0,
      gameStarted: false
    }))
  }

  const getLoserTitle = (loserScore: number) => {
    if (loserScore === 0) return "Untested Newbie"
    if (loserScore <= 5) return "Casual Failure"
    if (loserScore <= 15) return "Professional Disappointment"
    if (loserScore <= 30) return "Certified Disaster"
    if (loserScore <= 50) return "Master of Mediocrity"
    return "Legendary Loser"
  }

  if (!quizState.gameStarted) {
    return (
      <div className="flex flex-col h-full bg-gray-900 p-6">
        <div className="flex-1 flex flex-col items-center justify-center space-y-8">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-3">
              <Brain className="w-12 h-12 text-purple-400" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                AskArko Quiz Arena
              </h1>
              <Flame className="w-12 h-12 text-orange-400" />
            </div>
            <p className="text-gray-300 text-lg max-w-2xl">
              Think you're smart? Let's find out! I'll ask you questions ranging from stupidly simple to brutally complex. 
              Get them wrong and prepare to be roasted harder than a coffee bean! ☕
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
            <Card className="bg-gray-800 border-red-500">
              <CardHeader className="text-center">
                <Skull className="w-8 h-8 text-red-400 mx-auto mb-2" />
                <CardTitle className="text-red-400">Loser Score</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-3xl font-bold text-red-400">{quizState.loserScore}</div>
                <div className="text-sm text-gray-400 mt-2">{getLoserTitle(quizState.loserScore)}</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800 border-yellow-500">
              <CardHeader className="text-center">
                <Flame className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <CardTitle className="text-yellow-400">Max Streak</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-3xl font-bold text-yellow-400">{quizState.maxStreak}</div>
                <div className="text-sm text-gray-400 mt-2">Best Run</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800 border-purple-500">
              <CardHeader className="text-center">
                <Trophy className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <CardTitle className="text-purple-400">Challenge</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-sm text-gray-300">Mixed difficulty</div>
                <div className="text-sm text-gray-400 mt-2">Technical & Random</div>
              </CardContent>
            </Card>
          </div>
          
          <Button
            onClick={startQuiz}
            className="btn-primary text-xl px-8 py-4 rounded-xl"
            disabled={isLoading}
          >
            {isLoading ? "Preparing your doom..." : "Start Quiz"}
          </Button>
          
          <div className="text-center text-gray-500 text-sm">
            <AlertTriangle className="w-4 h-4 inline mr-2" />
            Warning: Side effects may include bruised ego and existential crisis
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-gray-900">
      {/* Header Stats */}
      <div className="border-b border-gray-700 p-4">
        <div className="flex justify-between items-center">
          <div className="flex space-x-6">
            <div className="text-center">
              <div className="text-sm text-gray-400">Score</div>
              <div className="text-xl font-bold text-green-400">{quizState.score}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-400">Loser Score</div>
              <div className="text-xl font-bold text-red-400">{quizState.loserScore}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-400">Streak</div>
              <div className="text-xl font-bold text-yellow-400">{quizState.streak}</div>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button onClick={nextQuestion} variant="outline" size="sm" disabled={!quizState.isAnswered || isLoading}>
              Next Question
            </Button>
            <Button onClick={resetQuiz} variant="outline" size="sm">
              End Quiz
            </Button>
          </div>
        </div>
      </div>

      {/* Question Area */}
      <div className="flex-1 p-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
            <div className="text-gray-400">Generating your next challenge...</div>
          </div>
        ) : quizState.currentQuestion ? (
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Question Card */}
            <Card className="bg-gray-800 border-purple-500">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Badge className={`${DIFFICULTY_COLORS[quizState.currentQuestion.difficulty]} text-white`}>
                      {quizState.currentQuestion.difficulty.toUpperCase()}
                    </Badge>
                    <Badge variant="outline" className="border-gray-600 text-gray-300">
                      {CATEGORY_ICONS[quizState.currentQuestion.category]}
                      <span className="ml-1">{quizState.currentQuestion.category}</span>
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-400">
                    Question {quizState.totalQuestions + 1}
                  </div>
                </div>
                <CardTitle className="text-xl text-purple-300 leading-relaxed">
                  {quizState.currentQuestion.question}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-3">
                  {quizState.currentQuestion.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => selectAnswer(index)}
                      disabled={quizState.isAnswered}
                      className={`p-4 text-left rounded-xl border-2 transition-all duration-200 ${
                        quizState.selectedAnswer === index
                          ? 'border-purple-500 bg-purple-900/30'
                          : 'border-gray-600 bg-gray-800 hover:border-purple-400 hover:bg-gray-700'
                      } ${
                        quizState.isAnswered && quizState.currentQuestion
                          ? index === quizState.currentQuestion.correctAnswer
                            ? 'border-green-500 bg-green-900/30 text-green-300'
                            : quizState.selectedAnswer === index
                            ? 'border-red-500 bg-red-900/30 text-red-300'
                            : 'opacity-50'
                          : ''
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-sm font-medium">
                          {String.fromCharCode(65 + index)}
                        </span>
                        <span className="text-gray-200">{option}</span>
                      </div>
                    </button>
                  ))}
                </div>
                
                {!quizState.isAnswered && (
                  <Button
                    onClick={submitAnswer}
                    disabled={quizState.selectedAnswer === null}
                    className="btn-primary w-full mt-6 py-3 text-lg"
                  >
                    Submit Answer
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Roast Message */}
            {quizState.showRoast && (
              <Card className="bg-gray-800 border-orange-500">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <Avatar className="w-12 h-12 border-2 border-orange-500">
                      <AvatarFallback className="bg-gradient-to-br from-orange-600 to-red-700 text-white">
                        <div className="w-8 h-8 relative">
                          <Logo size="sm" showText={false} className="scale-75" />
                        </div>
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="text-orange-300 font-medium mb-2">Bot:</div>
                      <div className="text-gray-200 leading-relaxed">{quizState.roastMessage}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        ) : null}
      </div>
    </div>
  )
}
