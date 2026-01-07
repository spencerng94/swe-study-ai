import { useState, useEffect } from 'react'
import { TrendingUp, BookOpen, CheckCircle, Clock, Target, MessageSquare, Sparkles, Calendar, Star, Zap } from 'lucide-react'
import { useGame } from './gamification/GameProvider'
import { Achievements } from './gamification/Achievements'
import { DailyChallenges } from './gamification/DailyChallenges'

// Get progress data from localStorage
const getProgressData = () => {
  const savedQuestions = JSON.parse(localStorage.getItem('savedQuestions') || '[]')
  const studyGuideProgress = JSON.parse(localStorage.getItem('studyGuideProgress') || '{}')
  
  // Calculate Study Guide completion
  const completedItems = Object.keys(studyGuideProgress).filter(key => studyGuideProgress[key]).length
  const totalItems = 32 // Approximate total checklist items across both sessions
  
  // Get recent activity
  const recentActivity = savedQuestions
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 5)
  
  // Calculate category distribution
  const categoryCounts = {}
  savedQuestions.forEach(q => {
    categoryCounts[q.category] = (categoryCounts[q.category] || 0) + 1
  })
  
  return {
    savedQuestionsCount: savedQuestions.length,
    studyGuideProgress: Math.round((completedItems / totalItems) * 100),
    completedItems,
    totalItems,
    recentActivity,
    categoryCounts,
    topCategories: Object.entries(categoryCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([category]) => category)
  }
}

function Dashboard() {
  const gameState = useGame()
  const [progressData, setProgressData] = useState(() => getProgressData())

  useEffect(() => {
    // Update progress when storage changes
    const handleStorageChange = () => {
      setProgressData(getProgressData())
    }
    
    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('questionSaved', handleStorageChange)
    window.addEventListener('progressUpdated', handleStorageChange)
    
    // Also check on focus
    window.addEventListener('focus', handleStorageChange)
    
    // Initial load
    setProgressData(getProgressData())
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('questionSaved', handleStorageChange)
      window.removeEventListener('progressUpdated', handleStorageChange)
      window.removeEventListener('focus', handleStorageChange)
    }
  }, [])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-2">
          <TrendingUp className="w-6 h-6 text-salesforce-blue" />
          <h2 className="text-2xl font-bold text-salesforce-dark-blue">
            Progress Dashboard
          </h2>
        </div>
        <p className="text-salesforce-gray">
          Track your interview preparation progress and get personalized study recommendations
        </p>
      </div>

      {/* Gamification Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg shadow-sm border-2 border-yellow-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <Star className="w-6 h-6 text-yellow-600 fill-yellow-600" />
            <div className="text-2xl font-bold text-yellow-900">
              {gameState.levelProgress.level}
            </div>
          </div>
          <h3 className="font-semibold text-yellow-900 mb-1">Level</h3>
          <p className="text-xs text-yellow-700">Keep leveling up!</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg shadow-sm border-2 border-purple-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <Zap className="w-6 h-6 text-purple-600 fill-purple-600" />
            <div className="text-2xl font-bold text-purple-900">
              {gameState.totalXP || 0}
            </div>
          </div>
          <h3 className="font-semibold text-purple-900 mb-1">Total XP</h3>
          <p className="text-xs text-purple-700">Lifetime points earned</p>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg shadow-sm border-2 border-orange-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <Target className="w-6 h-6 text-orange-600 fill-orange-600" />
            <div className="text-2xl font-bold text-orange-900">
              {gameState.stats?.flashcardsCompleted || 0}
            </div>
          </div>
          <h3 className="font-semibold text-orange-900 mb-1">Flashcards</h3>
          <p className="text-xs text-orange-700">Completed today</p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg shadow-sm border-2 border-blue-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <MessageSquare className="w-6 h-6 text-blue-600 fill-blue-600" />
            <div className="text-2xl font-bold text-blue-900">
              {gameState.stats?.questionsViewed || 0}
            </div>
          </div>
          <h3 className="font-semibold text-blue-900 mb-1">Questions</h3>
          <p className="text-xs text-blue-700">Viewed today</p>
        </div>
      </div>

      {/* Daily Challenges */}
      <DailyChallenges />

      {/* Achievements Section */}
      <Achievements 
        achievements={gameState.achievements} 
        allAchievements={gameState.allAchievements}
      />

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ProgressCard
          title="Study Guide Progress"
          value={progressData.studyGuideProgress}
          subtitle={`${progressData.completedItems} of ${progressData.totalItems} items completed`}
          icon={CheckCircle}
          color="blue"
        />
        <ProgressCard
          title="Saved Questions"
          value={progressData.savedQuestionsCount}
          subtitle="Questions saved for review"
          icon={BookOpen}
          color="green"
        />
        <ProgressCard
          title="Days Until Interview"
          value={getDaysUntilInterview()}
          subtitle="Time remaining to prepare"
          icon={Clock}
          color="orange"
        />
      </div>

      {/* AI Study Schedule */}
      <AIStudySchedule 
        progressData={progressData}
      />

      {/* Recent Activity */}
      {progressData.recentActivity.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-salesforce-dark-blue mb-4">
            Recent Activity
          </h3>
          <div className="space-y-3">
            {progressData.recentActivity.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <BookOpen className="w-5 h-5 text-salesforce-blue" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700">
                    Saved question: {item.category}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(item.timestamp).toLocaleDateString()} at {new Date(item.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top Categories */}
      {progressData.topCategories.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-salesforce-dark-blue mb-4">
            Focus Areas
          </h3>
          <div className="flex flex-wrap gap-2">
            {progressData.topCategories.map((category, idx) => (
              <div
                key={idx}
                className="px-4 py-2 bg-salesforce-light-blue text-salesforce-blue rounded-lg font-medium"
              >
                {category}
              </div>
            ))}
          </div>
          <p className="text-sm text-salesforce-gray mt-3">
            Based on your saved questions, these are the topics you're focusing on most.
          </p>
        </div>
      )}
    </div>
  )
}

function ProgressCard({ title, value, subtitle, icon: Icon, color }) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-700',
    green: 'bg-green-100 text-green-700',
    orange: 'bg-orange-100 text-orange-700',
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-full ${colorClasses[color]} flex items-center justify-center`}>
          <Icon className="w-6 h-6" />
        </div>
        {typeof value === 'number' && value <= 100 && (
          <div className="text-2xl font-bold text-salesforce-dark-blue">
            {value}%
          </div>
        )}
        {typeof value === 'number' && value > 100 && (
          <div className="text-2xl font-bold text-salesforce-dark-blue">
            {value}
          </div>
        )}
      </div>
      <h3 className="font-semibold text-salesforce-dark-blue mb-1">{title}</h3>
      <p className="text-sm text-salesforce-gray">{subtitle}</p>
      {typeof value === 'number' && value <= 100 && (
        <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all ${
              color === 'blue' ? 'bg-salesforce-blue' :
              color === 'green' ? 'bg-green-600' : 'bg-orange-600'
            }`}
            style={{ width: `${value}%` }}
          />
        </div>
      )}
    </div>
  )
}

function getDaysUntilInterview() {
  const interviewDate = new Date('2026-01-12T20:45:00.000Z')
  const now = new Date()
  const difference = interviewDate.getTime() - now.getTime()
  if (difference > 0) {
    return Math.ceil(difference / (1000 * 60 * 60 * 24))
  }
  return 0
}

function AIStudySchedule({ progressData }) {
  const [schedule, setSchedule] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [userInput, setUserInput] = useState('')
  const [conversation, setConversation] = useState([])

  const generateSchedule = async (userMessage = '') => {
    setIsGenerating(true)
    
    // Simulate AI processing
    setTimeout(() => {
      const daysLeft = getDaysUntilInterview()
      const focusAreas = progressData.topCategories.length > 0 
        ? progressData.topCategories.join(', ')
        : 'all topics'
      
      const studyPlan = {
        morning: {
          time: '9:00 AM - 10:30 AM',
          activity: 'Review Lessons',
          topic: progressData.topCategories[0] || 'Database Design & Schema',
          duration: '90 min',
        },
        afternoon: {
          time: '2:00 PM - 3:30 PM',
          activity: 'Practice with Interactive Tools',
          topic: 'JS Trivia Lab or Scheduling Architect',
          duration: '90 min',
        },
        evening: {
          time: '7:00 PM - 8:00 PM',
          activity: 'Review Interview Questions',
          topic: focusAreas,
          duration: '60 min',
        },
      }

      const recommendation = `Based on your progress (${progressData.studyGuideProgress}% complete, ${progressData.savedQuestionsCount} saved questions), here's your recommended study schedule for today:

**Morning Session (${studyPlan.morning.time})**
- ${studyPlan.morning.activity}: ${studyPlan.morning.topic}
- Duration: ${studyPlan.morning.duration}
- Focus: Deep dive into concepts

**Afternoon Session (${studyPlan.afternoon.time})**
- ${studyPlan.afternoon.activity}: ${studyPlan.afternoon.topic}
- Duration: ${studyPlan.afternoon.duration}
- Focus: Hands-on practice

**Evening Session (${studyPlan.evening.time})**
- ${studyPlan.evening.activity}: ${studyPlan.evening.topic}
- Duration: ${studyPlan.evening.duration}
- Focus: Review and reinforce

**Tips:**
- Take 10-minute breaks between sessions
- Use AI Tutor if you get stuck
- Save important questions for later review
- ${daysLeft > 0 ? `You have ${daysLeft} days until your interview - stay consistent!` : 'Your interview is today - review key concepts!'}`

      const newMessage = {
        type: 'ai',
        content: recommendation,
        timestamp: new Date()
      }

      setConversation(prev => [...prev, newMessage])
      setSchedule(studyPlan)
      setIsGenerating(false)
    }, 1500)
  }

  const handleSendMessage = () => {
    if (!userInput.trim() || isGenerating) return

    const messageContent = userInput.trim()
    const userMessage = {
      type: 'user',
      content: messageContent,
      timestamp: new Date()
    }

    setConversation(prev => [...prev, userMessage])
    setUserInput('')
    setIsGenerating(true)
    
    // Generate response based on user input
    setTimeout(() => {
      let response = ''
      
      if (messageContent.toLowerCase().includes('shorter') || messageContent.toLowerCase().includes('less time')) {
        response = `Here's a shorter study schedule for today:

**Focused Session (2 hours)**
- 9:00 AM - 10:00 AM: Review one key lesson
- 7:00 PM - 8:00 PM: Practice with interactive tools

**Tips:**
- Focus on your weakest area
- Use the AI Tutor for quick clarifications
- Review saved questions during breaks`
      } else if (messageContent.toLowerCase().includes('react') || messageContent.toLowerCase().includes('frontend')) {
        response = `Here's a React-focused study schedule:

**Morning (9:00 AM - 10:30 AM)**
- Frontend Fundamentals: React concepts
- Review React Best Practices lesson
- Duration: 90 min

**Afternoon (2:00 PM - 3:00 PM)**
- JS Trivia Lab: Practice closures, event loop
- Duration: 60 min

**Evening (7:00 PM - 8:00 PM)**
- Review React Interview Questions
- Practice with React examples
- Duration: 60 min`
      } else if (messageContent.toLowerCase().includes('2 hours') || messageContent.toLowerCase().includes('limited time')) {
        response = `Here's a condensed 2-hour study plan:

**Session 1 (9:00 AM - 10:00 AM)**
- Quick lesson review or interview questions
- Focus on one specific topic

**Session 2 (7:00 PM - 8:00 PM)**
- Interactive practice or flashcards
- Reinforce what you learned

**Efficiency Tips:**
- Use AI Tutor for quick questions
- Focus on weak areas
- Review saved questions`
      } else {
        response = `I've updated your study schedule based on your request. Here's the revised plan:

**Morning Session (9:00 AM - 10:30 AM)**
- Review Lessons: Focus on key concepts
- Duration: 90 min

**Afternoon Session (2:00 PM - 3:30 PM)**
- Practice with Interactive Tools
- Duration: 90 min

**Evening Session (7:00 PM - 8:00 PM)**
- Review Interview Questions
- Duration: 60 min

Feel free to ask for more adjustments!`
      }

      const aiMessage = {
        type: 'ai',
        content: response,
        timestamp: new Date()
      }

      setConversation(prev => [...prev, aiMessage])
      setIsGenerating(false)
    }, 1200)
  }

  useEffect(() => {
    // Generate initial schedule on mount
    if (conversation.length === 0) {
      generateSchedule()
    }
  }, [])

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-4">
        <Calendar className="w-6 h-6 text-salesforce-blue" />
        <h3 className="text-lg font-bold text-salesforce-dark-blue">
          AI Study Schedule
        </h3>
      </div>
      <p className="text-sm text-salesforce-gray mb-4">
        Get a personalized study schedule for today. Ask questions or request changes!
      </p>

      {/* Conversation */}
      <div className="bg-gray-50 rounded-lg p-4 mb-4 max-h-96 overflow-y-auto">
        {conversation.length === 0 && !isGenerating && (
          <div className="text-center text-gray-500 py-8">
            <Sparkles className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p>Generating your study schedule...</p>
          </div>
        )}
        
        <div className="space-y-3">
          {conversation.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.type === 'ai' && (
                <div className="w-8 h-8 rounded-full bg-salesforce-blue flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
              )}
              <div
                className={`max-w-[85%] rounded-lg p-3 ${
                  msg.type === 'user'
                    ? 'bg-salesforce-blue text-white'
                    : 'bg-white text-gray-800 border border-gray-200'
                }`}
              >
                <div className="whitespace-pre-wrap text-sm">{msg.content}</div>
              </div>
              {msg.type === 'user' && (
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-semibold text-white">You</span>
                </div>
              )}
            </div>
          ))}
          
          {isGenerating && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-salesforce-blue flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="bg-white rounded-lg p-3 border border-gray-200">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-salesforce-blue rounded-full animate-pulse"></div>
                  <span>Generating schedule...</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Ask for changes or ask questions about the schedule..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:border-salesforce-blue focus:ring-2 focus:ring-salesforce-light-blue focus:outline-none text-sm"
        />
        <button
          onClick={handleSendMessage}
          disabled={!userInput.trim() || isGenerating}
          className="px-4 py-2 bg-salesforce-blue text-white rounded-lg hover:bg-salesforce-dark-blue transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <MessageSquare className="w-4 h-4" />
          Send
        </button>
      </div>

      {/* Quick Actions */}
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={() => {
            const message = 'Can you make the schedule shorter?'
            setUserInput(message)
            const userMsg = { type: 'user', content: message, timestamp: new Date() }
            setConversation(prev => [...prev, userMsg])
            setIsGenerating(true)
            setTimeout(() => {
              const response = `Here's a shorter study schedule for today:

**Focused Session (2 hours)**
- 9:00 AM - 10:00 AM: Review one key lesson
- 7:00 PM - 8:00 PM: Practice with interactive tools

**Tips:**
- Focus on your weakest area
- Use the AI Tutor for quick clarifications
- Review saved questions during breaks`
              setConversation(prev => [...prev, { type: 'ai', content: response, timestamp: new Date() }])
              setIsGenerating(false)
            }, 1200)
          }}
          className="px-3 py-1.5 text-xs bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Make it shorter
        </button>
        <button
          onClick={() => {
            const message = 'Focus more on React topics'
            setUserInput('')
            const userMsg = { type: 'user', content: message, timestamp: new Date() }
            setConversation(prev => [...prev, userMsg])
            setIsGenerating(true)
            setTimeout(() => {
              const response = `Here's a React-focused study schedule:

**Morning (9:00 AM - 10:30 AM)**
- Frontend Fundamentals: React concepts
- Review React Best Practices lesson
- Duration: 90 min

**Afternoon (2:00 PM - 3:00 PM)**
- JS Trivia Lab: Practice closures, event loop
- Duration: 60 min

**Evening (7:00 PM - 8:00 PM)**
- Review React Interview Questions
- Practice with React examples
- Duration: 60 min`
              setConversation(prev => [...prev, { type: 'ai', content: response, timestamp: new Date() }])
              setIsGenerating(false)
            }, 1200)
          }}
          className="px-3 py-1.5 text-xs bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Focus on React
        </button>
        <button
          onClick={() => {
            const message = 'I only have 2 hours today'
            setUserInput('')
            const userMsg = { type: 'user', content: message, timestamp: new Date() }
            setConversation(prev => [...prev, userMsg])
            setIsGenerating(true)
            setTimeout(() => {
              const response = `Here's a condensed 2-hour study plan:

**Session 1 (9:00 AM - 10:00 AM)**
- Quick lesson review or interview questions
- Focus on one specific topic

**Session 2 (7:00 PM - 8:00 PM)**
- Interactive practice or flashcards
- Reinforce what you learned

**Efficiency Tips:**
- Use AI Tutor for quick questions
- Focus on weak areas
- Review saved questions`
              setConversation(prev => [...prev, { type: 'ai', content: response, timestamp: new Date() }])
              setIsGenerating(false)
            }, 1200)
          }}
          className="px-3 py-1.5 text-xs bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          2 hours only
        </button>
        <button
          onClick={() => {
            setConversation([])
            generateSchedule()
          }}
          className="px-3 py-1.5 text-xs bg-salesforce-light-blue text-salesforce-blue rounded-lg hover:bg-salesforce-blue hover:text-white transition-colors"
        >
          Regenerate
        </button>
      </div>
    </div>
  )
}

export default Dashboard
