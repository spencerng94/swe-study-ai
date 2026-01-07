import { useState, useEffect } from 'react'
import { LayoutDashboard, Code, Database, BookOpen, MessageSquare, GraduationCap, FileCode, GraduationCap as LessonsIcon, Sparkles, Bookmark, Info, BarChart3, ChevronDown, ChevronRight, Settings, Moon, Sun, SlidersHorizontal, X, Menu, Users, Network, Target } from 'lucide-react'
import SchedulingArchitect from './components/SchedulingArchitect'
import SalesforceInterviewQuestions from './components/SalesforceInterviewQuestions'
import SalesforceLeetCodeQuestions from './components/SalesforceLeetCodeQuestions'
import StudyGuide from './components/StudyGuide'
import Flashcards from './components/Flashcards'
import JavaScriptPractice from './components/JavaScriptPractice'
import Lessons from './components/Lessons'
import AITutor from './components/AITutor'
import SavedQuestions from './components/SavedQuestions'
import About from './components/About'
import InterviewCountdown from './components/InterviewCountdown'
import ChatWidget from './components/ChatWidget'
import Dashboard from './components/Dashboard'
import { GameProvider, useGame } from './components/gamification/GameProvider'
import { XPBar } from './components/gamification/XPBar'
import { StreakCounter } from './components/gamification/StreakCounter'
import { QuickStartGame } from './components/gamification/QuickStartGame'

function AppContent() {
  const gameState = useGame()
  const [activeSection, setActiveSection] = useState('about')
  const [navigationParams, setNavigationParams] = useState({})
  const [expandedGroups, setExpandedGroups] = useState(() => new Set(['getting-started', 'study-materials']))
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const getPreferredTheme = () => {
    const stored = localStorage.getItem('prep-theme')
    if (stored === 'dark' || stored === 'light') return stored
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
  const [theme, setTheme] = useState(getPreferredTheme)

  const sectionGroups = [
    {
      id: 'getting-started',
      label: 'Getting Started',
      icon: Info,
      sections: [
        { id: 'about', label: 'About', icon: Info },
        { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
      ],
    },
    {
      id: 'study-materials',
      label: 'Study Materials',
      icon: GraduationCap,
      sections: [
        { id: 'study-guide', label: 'Study Guide', icon: GraduationCap },
        { id: 'lessons', label: 'Lessons', icon: LessonsIcon },
        { id: 'interview-questions', label: 'Interview Questions', icon: MessageSquare },
        { id: 'leetcode-questions', label: 'LeetCode Questions', icon: Code },
      ],
    },
    {
      id: 'practice-tools',
      label: 'Practice Tools',
      icon: Code,
      sections: [
        { id: 'flashcards', label: 'Flashcards', icon: BookOpen },
        { id: 'javascript-practice', label: 'JavaScript Practice', icon: FileCode },
        { id: 'scheduling', label: 'Scheduling Architect', icon: Database },
      ],
    },
    {
      id: 'ai-assistance',
      label: 'AI Assistance',
      icon: Sparkles,
      sections: [
        { id: 'ai-tutor', label: 'AI Tutor', icon: Sparkles },
        { id: 'saved-questions', label: 'Saved Questions', icon: Bookmark },
      ],
    },
  ]

  // Flatten sections for easy lookup
  const allSections = sectionGroups.flatMap(group => group.sections)

  // Track tool usage for gamification (only once per session)
  const [usedTools, setUsedTools] = useState(new Set())
  useEffect(() => {
    const practiceTools = ['javascript-practice', 'scheduling', 'flashcards']
    if (practiceTools.includes(activeSection) && !usedTools.has(activeSection)) {
      gameState.actions.toolUsage(activeSection)
      setUsedTools(prev => new Set([...prev, activeSection]))
    }
  }, [activeSection, usedTools, gameState])

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    localStorage.setItem('prep-theme', theme)
  }, [theme])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (event) => {
      const stored = localStorage.getItem('prep-theme')
      if (!stored) {
        setTheme(event.matches ? 'dark' : 'light')
      }
    }
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  }

  // Handle navigation events from Study Guide and Lessons
  useEffect(() => {
    const handleNavigate = (event) => {
      const { section, tab, category, lessonId } = event.detail
      setActiveSection(section)
      if (lessonId) {
        setNavigationParams({ lessonId })
        window.location.hash = lessonId
      } else {
        setNavigationParams({ tab, category })
      }
    }

    window.addEventListener('navigate', handleNavigate)
    return () => window.removeEventListener('navigate', handleNavigate)
  }, [])

  // Close mobile menu when section changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [activeSection])

  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* Mobile Menu Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 dark:bg-black/70 z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-72 bg-white/90 dark:bg-slate-900/95 border-r border-slate-200/80 dark:border-slate-800/80 shadow-xl backdrop-blur-xl flex-shrink-0 transition-all duration-300
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-4 lg:p-6 border-b border-slate-200/60 dark:border-slate-800/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-salesforce-blue via-blue-600 to-salesforce-dark-blue text-white flex items-center justify-center shadow-lg shadow-blue-500/30 dark:shadow-blue-500/20 transition-transform hover:scale-105">
                <LayoutDashboard className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-salesforce-dark-blue dark:text-white tracking-tight">
                  Prep Dashboard
                </h1>
                <p className="text-xs text-salesforce-gray dark:text-slate-400 mt-0.5">
                  Salesforce Interview Prep
                </p>
              </div>
            </div>
            {/* Close button for mobile */}
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-200px)]">
          {sectionGroups.map((group) => {
            const GroupIcon = group.icon
            const isExpanded = expandedGroups.has(group.id)
            const hasActiveSection = group.sections.some(s => s.id === activeSection)
            
            return (
              <div key={group.id} className="mb-2">
                {/* Group Header */}
                <button
                  onClick={() => {
                    const newExpanded = new Set(expandedGroups)
                    if (newExpanded.has(group.id)) {
                      newExpanded.delete(group.id)
                    } else {
                      newExpanded.add(group.id)
                    }
                    setExpandedGroups(newExpanded)
                  }}
                  className={`w-full flex items-center gap-2.5 px-3.5 py-3 sm:py-2.5 rounded-xl font-semibold text-xs uppercase tracking-wider transition-all duration-200 text-left group touch-manipulation ${
                    hasActiveSection
                      ? 'text-salesforce-blue bg-gradient-to-r from-salesforce-light-blue/80 to-blue-50/50 dark:from-slate-800/80 dark:to-slate-800/40 dark:text-blue-300 shadow-sm'
                      : 'text-salesforce-gray dark:text-slate-400 hover:text-salesforce-dark-blue hover:bg-slate-50/80 dark:hover:bg-slate-800/50 dark:hover:text-white'
                  }`}
                >
                  {isExpanded ? (
                    <ChevronDown className="w-3.5 h-3.5 flex-shrink-0 transition-transform" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 flex-shrink-0 transition-transform" />
                  )}
                  <GroupIcon className="w-4 h-4 flex-shrink-0" />
                  <span>{group.label}</span>
                </button>
                
                {/* Group Sections */}
                {isExpanded && (
                  <div className="ml-5 mt-2 space-y-1 border-l-2 border-slate-200/60 dark:border-slate-800/60 pl-3 animate-in slide-in-from-top-2 duration-200">
                    {group.sections.map((section) => {
                      const Icon = section.icon
                      return (
                        <button
                          key={section.id}
                          onClick={() => {
                            setActiveSection(section.id)
                            setNavigationParams({}) // Clear navigation params on manual navigation
                          }}
                          className={`w-full flex items-center gap-2.5 px-3.5 py-3 sm:py-2.5 rounded-lg font-medium transition-all duration-200 text-left group touch-manipulation ${
                            activeSection === section.id
                              ? 'bg-gradient-to-r from-salesforce-light-blue/90 to-blue-50/70 text-salesforce-blue dark:from-slate-800/90 dark:to-slate-800/60 dark:text-blue-200 shadow-sm scale-[1.02]'
                              : 'text-salesforce-gray dark:text-slate-400 hover:bg-slate-50/80 dark:hover:bg-slate-800/50 hover:text-salesforce-dark-blue dark:hover:text-white hover:translate-x-1'
                          }`}
                        >
                          <Icon className="w-4 h-4 flex-shrink-0" />
                          <span className="text-sm">{section.label}</span>
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        {/* Header */}
        <header className="bg-white/90 dark:bg-slate-900/95 border-b border-slate-200/80 dark:border-slate-800/80 shadow-sm flex-shrink-0 backdrop-blur-xl transition-all duration-300">
          <div className="px-4 lg:px-8 py-4 lg:py-5">
            {/* Mobile Header Row */}
            <div className="flex items-center justify-between mb-3 lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div className="flex items-center gap-2">
                <StreakCounter streak={gameState.streak} />
              </div>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                <InterviewCountdown />
                <div className="hidden sm:block h-6 w-px bg-slate-200/60 dark:bg-slate-800/60"></div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-salesforce-dark-blue dark:text-white tracking-tight">
                    {allSections.find(s => s.id === activeSection)?.label || 'Interview Prep Dashboard'}
                  </h2>
                  <p className="text-xs sm:text-sm text-salesforce-gray dark:text-slate-400 mt-1">
                    Full Stack Engineer (Scheduling ECCH) - Salesforce
                  </p>
                </div>
              </div>
              <div className="hidden lg:flex items-center gap-3">
                <StreakCounter streak={gameState.streak} />
              </div>
            </div>
            <XPBar levelProgress={gameState.levelProgress} recentXP={gameState.recentXP} />
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-gradient-to-b from-transparent to-slate-50/50 dark:to-slate-950/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 space-y-4 sm:space-y-6">
            <div className="rounded-2xl sm:rounded-3xl bg-white/80 dark:bg-slate-900/70 border border-slate-200/60 dark:border-slate-800/60 shadow-xl backdrop-blur-xl p-4 sm:p-6 lg:p-8 transition-all duration-300 hover:shadow-2xl">
              {activeSection === 'about' && <About />}
              {activeSection === 'dashboard' && <Dashboard />}
              {activeSection === 'study-guide' && <StudyGuide />}
              {activeSection === 'lessons' && <Lessons initialLessonId={navigationParams.lessonId} />}
              {activeSection === 'interview-questions' && (
                <SalesforceInterviewQuestions initialCategory={navigationParams.category} />
              )}
              {activeSection === 'leetcode-questions' && <SalesforceLeetCodeQuestions />}
              {activeSection === 'flashcards' && <Flashcards />}
              {activeSection === 'javascript-practice' && (
                <JavaScriptPractice initialTab={navigationParams.tab} />
              )}
              {activeSection === 'scheduling' && (
                <SchedulingArchitect initialTab={navigationParams.tab} />
              )}
              {activeSection === 'ai-tutor' && <AITutor />}
              {activeSection === 'saved-questions' && <SavedQuestions />}
            </div>
          </div>
        </main>
      </div>
      
      {/* Quick Start Game - Bottom Left */}
      <QuickStartGame />

      {/* Floating Controls - Bottom Right on Mobile, Bottom Right on Desktop */}
      <div className="fixed bottom-4 right-4 lg:bottom-6 lg:right-6 z-50 flex flex-col items-center gap-3">
        {/* Settings Button */}
        <button
          onClick={() => setIsSettingsOpen((prev) => !prev)}
          className={`w-12 h-12 lg:w-14 lg:h-14 rounded-2xl bg-gradient-to-br from-slate-700 via-slate-600 to-slate-700 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 text-white shadow-2xl border border-slate-600/40 dark:border-slate-700/40 flex items-center justify-center hover:shadow-blue-500/20 hover:scale-110 active:scale-95 transition-all duration-200 touch-manipulation ${
            isSettingsOpen ? 'ring-2 ring-salesforce-blue/50 ring-offset-2 ring-offset-white dark:ring-offset-slate-900' : ''
          }`}
          aria-label="Open settings"
        >
          <Settings className="w-5 h-5 lg:w-6 lg:h-6" />
        </button>
        
        {/* Chat Widget */}
        <ChatWidget theme={theme} />
      </div>

      {/* Settings Panel */}
      {isSettingsOpen && (
        <div className="fixed bottom-20 right-4 lg:bottom-24 lg:left-6 w-[calc(100vw-2rem)] sm:w-80 max-w-sm rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/95 dark:bg-slate-900/98 shadow-2xl backdrop-blur-xl z-50 p-4 sm:p-5 animate-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-salesforce-light-blue to-blue-100 dark:from-slate-800 dark:to-slate-700 text-salesforce-blue dark:text-blue-200 flex items-center justify-center shadow-sm">
                <SlidersHorizontal className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">Settings</p>
                <p className="text-xs text-salesforce-gray dark:text-slate-400">Personalize your workspace</p>
              </div>
            </div>
            <button
              onClick={() => setIsSettingsOpen(false)}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
              aria-label="Close settings"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-xl border border-slate-200/60 dark:border-slate-800/60 px-4 py-3.5 bg-gradient-to-r from-slate-50/80 to-white dark:from-slate-800/50 dark:to-slate-900/50 backdrop-blur-sm">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  {theme === 'dark' ? (
                    <Moon className="w-4 h-4 text-blue-400" />
                  ) : (
                    <Sun className="w-4 h-4 text-amber-500" />
                  )}
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">Dark Mode</p>
                </div>
                <p className="text-xs text-salesforce-gray dark:text-slate-400">Reduce glare for night sessions</p>
              </div>
              <button
                onClick={toggleTheme}
                className={`relative inline-flex h-9 w-16 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-salesforce-blue/50 focus:ring-offset-2 ${
                  theme === 'dark' 
                    ? 'bg-gradient-to-r from-salesforce-blue to-blue-600 shadow-lg shadow-blue-500/30' 
                    : 'bg-gradient-to-r from-slate-300 to-slate-400 dark:from-slate-600 dark:to-slate-700'
                }`}
                aria-label="Toggle dark mode"
              >
                <span className={`inline-block h-7 w-7 transform rounded-full bg-white shadow-lg transition-all duration-300 flex items-center justify-center ${
                  theme === 'dark' ? 'translate-x-8' : 'translate-x-1'
                }`}>
                  {theme === 'dark' ? (
                    <Moon className="w-4 h-4 text-slate-800" />
                  ) : (
                    <Sun className="w-4 h-4 text-amber-500" />
                  )}
                </span>
              </button>
            </div>
            <div className="rounded-xl border border-slate-200/60 dark:border-slate-800/60 px-4 py-3 bg-gradient-to-r from-salesforce-light-blue/60 to-blue-50/40 dark:from-slate-800/60 dark:to-slate-900/40 text-sm text-salesforce-dark-blue dark:text-slate-200">
              <p className="font-medium mb-1">💡 Tip</p>
              <p>Use the chat assistant for quick questions while you browse the dashboard.</p>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  )
}

function App() {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  )
}

export default App
