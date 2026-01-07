import { useState, useEffect } from 'react'
import { CheckCircle, Circle, BookOpen, Code, Database, Target, Clock, Link2 } from 'lucide-react'
import { useGame } from './gamification/GameProvider'
import { studyGuideService } from '../lib/dataService'

const studyPlan = {
  session1: {
    title: 'Session 1: Systems Design + Architecture/Data Concepts',
    duration: '60 minutes',
    focus: 'Lay out data to balance performance requirements for reads, writes, and deprecation',
    topics: [
      {
        name: 'Database Design & Schema',
        resources: [
          { type: 'practice', label: 'Schema Designer', link: 'scheduling', section: 'schema' },
          { type: 'questions', label: 'System Design Questions', category: 'System Design' },
          { type: 'questions', label: 'Backend Questions', category: 'Backend' },
        ],
        checklist: [
          'Understand normalization vs denormalization trade-offs',
          'Master Lookup vs Master-Detail relationships',
          'Design efficient indexing strategies',
          'Plan for data deprecation and archiving',
        ],
      },
      {
        name: 'Performance Optimization',
        resources: [
          { type: 'questions', label: 'LDV Best Practices', category: 'Backend' },
          { type: 'quiz', label: 'LDV Flashcards', link: 'quizzer' },
        ],
        checklist: [
          'Optimize SOQL queries for large data volumes',
          'Understand governor limits and workarounds',
          'Implement proper pagination strategies',
          'Use selective filters and indexed fields',
        ],
      },
      {
        name: 'Data Skew & Concurrency',
        resources: [
          { type: 'practice', label: 'Concurrency Simulator', link: 'scheduling', section: 'concurrency' },
          { type: 'questions', label: 'Data Skew Questions', category: 'Backend' },
          { type: 'quiz', label: 'Data Skew Flashcards', link: 'quizzer' },
        ],
        checklist: [
          'Identify and prevent data skew patterns',
          'Understand sharing calculation impact',
          'Master optimistic vs pessimistic locking',
          'Design for concurrent access patterns',
        ],
      },
      {
        name: 'System Architecture',
        resources: [
          { type: 'questions', label: 'System Design Questions', category: 'System Design' },
          { type: 'questions', label: 'Salesforce-Specific Architecture', category: 'Salesforce-Specific' },
        ],
        checklist: [
          'Design scalable multi-tenant systems',
          'Plan for real-time vs batch processing',
          'Understand Platform Events and messaging',
          'Design for high availability and reliability',
        ],
      },
    ],
  },
  session2: {
    title: 'Session 2: Front End Development',
    duration: '60 minutes',
    focus: 'Front-end development expertise, best practices, efficient coding, and problem-solving',
    topics: [
      {
        name: 'JavaScript Fundamentals',
        resources: [
          { type: 'practice', label: 'Closure Playground', link: 'js-trivia', section: 'closure' },
          { type: 'practice', label: 'Event Loop Simulator', link: 'js-trivia', section: 'eventloop' },
          { type: 'practice', label: 'Pure Function Checker', link: 'js-trivia', section: 'pure' },
          { type: 'questions', label: 'Frontend Questions', category: 'Frontend' },
        ],
        checklist: [
          'Master closures and scope',
          'Understand Event Loop (microtasks vs macrotasks)',
          'Write pure functions and avoid side effects',
          'Know async/await and Promise patterns',
        ],
      },
      {
        name: 'React Best Practices',
        resources: [
          { type: 'questions', label: 'React Performance Questions', category: 'Frontend' },
          { type: 'questions', label: 'State Management Questions', category: 'Frontend' },
        ],
        checklist: [
          'Optimize for INP (Interaction to Next Paint)',
          'Use React.memo, useMemo, useCallback effectively',
          'Implement proper state management',
          'Handle forms and validation',
        ],
      },
      {
        name: 'CSS & Layout',
        resources: [
          { type: 'questions', label: 'CSS Grid Questions', category: 'Frontend' },
          { type: 'quiz', label: 'CSS Grid Flashcards', link: 'quizzer' },
        ],
        checklist: [
          'Build responsive layouts with CSS Grid',
          'Create calendar components efficiently',
          'Handle overlapping events in UI',
          'Implement modern CSS patterns',
        ],
      },
      {
        name: 'Problem Solving & Coding',
        resources: [
          { type: 'questions', label: 'LeetCode Questions', category: 'LeetCode' },
        ],
        checklist: [
          'Practice algorithm problem-solving',
          'Master data structures (trees, intervals, heaps)',
          'Explain thought process clearly',
          'Write clean, efficient code',
        ],
      },
    ],
  },
}

function StudyGuide() {
  const gameState = useGame()
  const [activeSession, setActiveSession] = useState('session1')
  const [completedItems, setCompletedItems] = useState(new Set())
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadProgress = async () => {
      setIsLoading(true)
      const progress = await studyGuideService.load()
      const progressSet = new Set(Object.keys(progress).filter(key => progress[key]))
      setCompletedItems(progressSet)
      setIsLoading(false)
    }
    loadProgress()
  }, [])

  const toggleItem = async (sessionId, topicIndex, itemIndex) => {
    const key = `${sessionId}-${topicIndex}-${itemIndex}`
    const newCompleted = new Set(completedItems)
    const wasCompleted = newCompleted.has(key)
    
    if (wasCompleted) {
      newCompleted.delete(key)
    } else {
      newCompleted.add(key)
      // Award XP for completing a study guide item
      gameState.actions.studyGuideItem()
    }
    
    setCompletedItems(newCompleted)
    
    // Save using data service
    const progressObj = {}
    Array.from(newCompleted).forEach(item => {
      progressObj[item] = true
    })
    await studyGuideService.save(progressObj)
    
    // Also save to localStorage as fallback for Dashboard
    localStorage.setItem('studyGuideProgress', JSON.stringify(progressObj))
    
    // Dispatch event to update Dashboard
    window.dispatchEvent(new CustomEvent('progressUpdated'))
  }

  const getProgress = (session) => {
    const totalItems = session.topics.reduce((sum, topic) => sum + topic.checklist.length, 0)
    const completed = session.topics.reduce((sum, topic, topicIndex) => {
      return sum + topic.checklist.filter((_, itemIndex) => 
        completedItems.has(`${activeSession}-${topicIndex}-${itemIndex}`)
      ).length
    }, 0)
    return totalItems > 0 ? Math.round((completed / totalItems) * 100) : 0
  }

  // Map topic names to lesson IDs
  const topicToLessonMap = {
    'Database Design & Schema': 'database-design-schema',
    'Performance Optimization': 'performance-optimization',
    'Data Skew & Concurrency': 'data-skew-concurrency',
    'System Architecture': 'system-architecture',
    'JavaScript Fundamentals': 'javascript-fundamentals',
    'React Best Practices': 'react-best-practices',
    'CSS & Layout': 'css-layout',
    'Problem Solving & Coding': 'problem-solving-coding',
  }

  const navigateToResource = (resource) => {
    if (resource.type === 'practice' || resource.type === 'quiz') {
      window.location.hash = `#${resource.link}`
      window.dispatchEvent(new CustomEvent('navigate', { detail: { section: resource.link, tab: resource.section } }))
    } else if (resource.type === 'questions') {
      window.location.hash = '#interview-questions'
      window.dispatchEvent(new CustomEvent('navigate', { 
        detail: { section: 'interview-questions', category: resource.category } 
      }))
    }
  }

  const navigateToLesson = (topicName) => {
    const lessonId = topicToLessonMap[topicName]
    if (lessonId) {
      window.dispatchEvent(new CustomEvent('navigate', { 
        detail: { section: 'lessons', lessonId } 
      }))
    }
  }

  const currentSession = studyPlan[activeSession]
  const progress = getProgress(currentSession)

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-2">
          <BookOpen className="w-6 h-6 text-salesforce-blue" />
          <h2 className="text-2xl font-bold text-salesforce-dark-blue">
            Round 3 Study Guide
          </h2>
        </div>
        <p className="text-salesforce-gray">
          Structured preparation plan for your Salesforce Technical/Behavioral Interviews
        </p>
      </div>

      {/* Session Selector */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => setActiveSession('session1')}
          className={`p-6 rounded-lg border-2 text-left transition-all ${
            activeSession === 'session1'
              ? 'border-salesforce-blue bg-salesforce-light-blue'
              : 'border-gray-300 hover:border-gray-400 bg-white'
          }`}
        >
          <div className="flex items-center gap-3 mb-2">
            <Database className={`w-6 h-6 ${activeSession === 'session1' ? 'text-salesforce-blue' : 'text-gray-500'}`} />
            <h3 className={`font-bold text-lg ${activeSession === 'session1' ? 'text-salesforce-blue' : 'text-gray-700'}`}>
              Session 1
            </h3>
          </div>
          <p className="text-sm text-gray-600 mb-2">Systems Design + Architecture/Data Concepts</p>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Clock className="w-4 h-4" />
            <span>60 minutes</span>
          </div>
        </button>

        <button
          onClick={() => setActiveSession('session2')}
          className={`p-6 rounded-lg border-2 text-left transition-all ${
            activeSession === 'session2'
              ? 'border-salesforce-blue bg-salesforce-light-blue'
              : 'border-gray-300 hover:border-gray-400 bg-white'
          }`}
        >
          <div className="flex items-center gap-3 mb-2">
            <Code className={`w-6 h-6 ${activeSession === 'session2' ? 'text-salesforce-blue' : 'text-gray-500'}`} />
            <h3 className={`font-bold text-lg ${activeSession === 'session2' ? 'text-salesforce-blue' : 'text-gray-700'}`}>
              Session 2
            </h3>
          </div>
          <p className="text-sm text-gray-600 mb-2">Front End Development</p>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Clock className="w-4 h-4" />
            <span>60 minutes</span>
          </div>
        </button>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold text-salesforce-dark-blue">Study Progress</span>
          <span className="text-sm text-salesforce-gray">{progress}% Complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-salesforce-blue h-3 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Session Details */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-salesforce-dark-blue mb-2">
            {currentSession.title}
          </h3>
          <p className="text-salesforce-gray mb-4">{currentSession.focus}</p>
        </div>

        <div className="space-y-6">
          {currentSession.topics.map((topic, topicIndex) => (
            <div key={topicIndex} className="border-l-4 border-salesforce-blue pl-6 pb-6 last:pb-0">
              <div className="flex items-center gap-3 mb-3">
                <h4 className="font-bold text-lg text-salesforce-dark-blue flex-1">
                  {topic.name}
                </h4>
                {topicToLessonMap[topic.name] && (
                  <button
                    onClick={() => navigateToLesson(topic.name)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-salesforce-blue text-white rounded-lg hover:bg-salesforce-dark-blue transition-colors text-sm font-medium"
                  >
                    <BookOpen className="w-4 h-4" />
                    View Lesson
                  </button>
                )}
              </div>

              {/* Resources */}
              {topic.resources.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Practice Resources:</p>
                  <div className="flex flex-wrap gap-2">
                    {topic.resources.map((resource, idx) => (
                      <button
                        key={idx}
                        onClick={() => navigateToResource(resource)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-salesforce-light-blue text-salesforce-blue rounded-lg hover:bg-salesforce-blue hover:text-white transition-colors text-sm"
                      >
                        <Link2 className="w-3 h-3" />
                        {resource.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Checklist */}
              <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-700 mb-2">Study Checklist:</p>
                {topic.checklist.map((item, itemIndex) => {
                  const key = `${activeSession}-${topicIndex}-${itemIndex}`
                  const isCompleted = completedItems.has(key)
                  return (
                    <label
                      key={itemIndex}
                      className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      <button
                        onClick={() => toggleItem(activeSession, topicIndex, itemIndex)}
                        className="mt-0.5 flex-shrink-0"
                      >
                        {isCompleted ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <Circle className="w-5 h-5 text-gray-400" />
                        )}
                      </button>
                      <span className={`text-sm flex-1 ${isCompleted ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                        {item}
                      </span>
                    </label>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Study Tips */}
      <div className="bg-salesforce-light-blue border border-salesforce-blue rounded-lg p-6">
        <div className="flex items-start gap-3">
          <Target className="w-5 h-5 text-salesforce-blue mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-salesforce-dark-blue mb-2">Interview Tips:</h3>
            <ul className="text-sm text-salesforce-dark-blue space-y-1 list-disc list-inside">
              <li>Practice explaining your thought process out loud while solving problems</li>
              <li>Focus on clean, readable code over clever one-liners</li>
              <li>Ask clarifying questions before jumping into solutions</li>
              <li>Discuss trade-offs and alternatives when presenting solutions</li>
              <li>Be prepared to discuss scalability and performance implications</li>
              <li>Review Salesforce-specific patterns (governor limits, data skew, sharing)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudyGuide
