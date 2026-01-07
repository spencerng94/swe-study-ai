import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Bot, Loader, Sparkles } from 'lucide-react'
import { savedQuestionsService } from '../lib/dataService'

// Get contextual information about user's progress
const getContextualInfo = async () => {
  const savedQuestions = await savedQuestionsService.load()
  
  // This would need to match the Study Guide structure
  // For now, we'll use a simplified version
  const progressInfo = {
    savedQuestionsCount: savedQuestions.length,
    recentTopics: savedQuestions.slice(0, 3).map(q => q.category),
  }
  
  return progressInfo
}

const generateContextualResponse = (question, context) => {
  const lower = question.toLowerCase()
  
  // Progress-related questions
  if (lower.includes('progress') || lower.includes('how am i doing') || lower.includes('where am i')) {
    return {
      answer: `Based on your activity:\n\n**Your Progress:**\n- You've saved ${context.savedQuestionsCount} question${context.savedQuestionsCount !== 1 ? 's' : ''} for review\n- Recent topics you've been studying: ${context.recentTopics.length > 0 ? context.recentTopics.join(', ') : 'None yet'}\n\n**Recommendations:**\n1. Continue following the Study Guide workflow\n2. Review your saved questions regularly\n3. Use the Active Recall Quizzer to test your knowledge\n4. Focus on areas where you've saved the most questions`,
      contextual: true
    }
  }
  
  // Study plan questions
  if (lower.includes('what should i study') || lower.includes('what next') || lower.includes('recommend')) {
    const recommendations = [
      'Review the Study Guide to see which topics you haven\'t covered yet',
      'Check the Lessons section for deep dives on specific topics',
      'Practice with the interactive tools (JS Trivia Lab, Scheduling Architect)',
      'Review Interview Questions in your weak areas',
      'Use Active Recall Quizzer for spaced repetition'
    ]
    
    return {
      answer: `**Recommended Next Steps:**\n\n${recommendations.map((r, i) => `${i + 1}. ${r}`).join('\n')}\n\n**Based on your saved questions**, you might want to focus on: ${context.recentTopics.length > 0 ? context.recentTopics.join(', ') : 'all topics equally'}`,
      contextual: true
    }
  }
  
  // Interview preparation questions
  if (lower.includes('interview') || lower.includes('prepare') || lower.includes('ready')) {
    return {
      answer: `**Interview Preparation Checklist:**\n\n✅ Review Study Guide topics\n✅ Complete Lessons for weak areas\n✅ Practice with interactive tools\n✅ Study Interview Questions\n✅ Test knowledge with flashcards\n✅ Review saved questions\n\n**Your Interview:** January 12, 2025 at 1:45 PM PDT\n\n**Focus Areas:**\n- Session 1: Systems Design + Architecture/Data Concepts\n- Session 2: Front End Development\n\nMake sure you're comfortable with both sessions!`,
      contextual: true
    }
  }
  
  // General questions - use a simplified AI response
  if (lower.includes('hello') || lower.includes('hi') || lower.includes('help')) {
    return {
      answer: `Hi! I'm your personal study assistant. I can help you with:\n\n• Tracking your progress\n• Recommending what to study next\n• Answering questions about the interview process\n• Providing study tips\n• Keeping you on track\n\n**Your Interview:** January 12, 2025 at 1:45 PM PDT\n\nAsk me anything about your preparation!`,
      contextual: true
    }
  }
  
  // Default response
  return {
    answer: `I understand you're asking about "${question}". As your study assistant, I can help you:\n\n• Track your progress through the Study Guide\n• Recommend what to focus on next\n• Answer questions about interview preparation\n• Provide study tips and strategies\n\nTry asking:\n- "How am I doing?"\n- "What should I study next?"\n- "Am I ready for the interview?"\n\nOr use the full AI Tutor section for detailed technical questions!`,
    contextual: true
  }
}

function ChatWidget({ theme = 'light' }) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      type: 'ai',
      content: 'Hi! I\'m your personal study assistant. I can help you track progress, recommend what to study, and keep you on track for your interview. How can I help?',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (isOpen) {
      scrollToBottom()
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen, messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput('')
    setIsLoading(true)

    // Add user message
    const newMessages = [...messages, { type: 'user', content: userMessage, timestamp: new Date() }]
    setMessages(newMessages)

    // Get contextual information
    const context = await getContextualInfo()

    // Simulate AI processing
    setTimeout(() => {
      const response = generateContextualResponse(userMessage, context)
      
      setMessages([
        ...newMessages,
        {
          type: 'ai',
          content: response.answer,
          timestamp: new Date()
        }
      ])
      setIsLoading(false)
    }, 800)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-salesforce-blue via-blue-600 to-salesforce-dark-blue text-white rounded-2xl shadow-2xl shadow-blue-500/30 dark:shadow-blue-500/20 hover:shadow-blue-500/40 border border-blue-500/20 dark:border-blue-400/20 transition-all duration-200 hover:scale-110 active:scale-95 flex items-center justify-center z-50 touch-manipulation"
          aria-label="Open chat assistant"
        >
          <MessageCircle className="w-5 h-5 lg:w-6 lg:h-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 lg:bottom-6 lg:left-6 w-[calc(100vw-2rem)] sm:w-96 max-w-sm lg:max-w-none h-[calc(100vh-6rem)] sm:h-[500px] max-h-[600px] bg-white/95 dark:bg-slate-900/98 rounded-2xl shadow-2xl border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-xl flex flex-col z-50 animate-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-salesforce-blue via-blue-600 to-salesforce-dark-blue text-white p-4 rounded-t-2xl flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm">Study Assistant</h3>
                <p className="text-xs opacity-90">Personalized help</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
              aria-label="Close chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-slate-50/50 to-white dark:from-slate-900/50 dark:to-slate-900">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-2.5 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.type === 'ai' && (
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-salesforce-blue to-blue-600 flex items-center justify-center flex-shrink-0 shadow-md">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl p-3.5 shadow-sm ${
                    message.type === 'user'
                      ? 'bg-gradient-to-br from-salesforce-blue to-blue-600 text-white'
                      : 'bg-white dark:bg-slate-800 text-gray-800 dark:text-slate-200 border border-slate-200/60 dark:border-slate-700/60'
                  }`}
                >
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</div>
                </div>
                {message.type === 'user' && (
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-slate-400 to-slate-500 dark:from-slate-600 dark:to-slate-700 flex items-center justify-center flex-shrink-0 shadow-md">
                    <span className="text-xs font-semibold text-white">You</span>
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-2.5 justify-start">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-salesforce-blue to-blue-600 flex items-center justify-center shadow-md">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-3.5 border border-slate-200/60 dark:border-slate-700/60 shadow-sm">
                  <Loader className="w-4 h-4 animate-spin text-salesforce-blue" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-slate-200/60 dark:border-slate-800/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-b-2xl">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything..."
                className="flex-1 px-4 py-2.5 border border-slate-300/60 dark:border-slate-700/60 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-salesforce-blue dark:focus:border-blue-500 focus:ring-2 focus:ring-salesforce-blue/20 dark:focus:ring-blue-500/20 focus:outline-none text-sm transition-all"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="px-4 py-2.5 bg-gradient-to-r from-salesforce-blue to-blue-600 text-white rounded-xl hover:from-salesforce-dark-blue hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg flex items-center justify-center"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ChatWidget
