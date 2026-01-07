import { useState, useEffect } from 'react'
import { ChevronDown, ChevronUp, Search, Filter, ExternalLink, MessageSquare } from 'lucide-react'
import { useGame } from './gamification/GameProvider'

const interviewQuestions = {
  'System Design': [
    {
      id: 1,
      question: 'Design a calendar scheduling system that can handle millions of appointments. How would you handle conflicts, time zones, and scalability?',
      answer: 'Key considerations: 1) Database design with proper indexing on time slots, 2) Use optimistic locking for conflict resolution, 3) Store all times in UTC, convert on display, 4) Partition data by date ranges, 5) Use caching for frequently accessed slots, 6) Implement rate limiting, 7) Consider using a queue system for booking operations, 8) Use database transactions with proper isolation levels.',
      tags: ['scalability', 'database', 'concurrency'],
      source: 'Glassdoor',
      sourceUrl: 'https://www.glassdoor.com',
    },
    {
      id: 2,
      question: 'How would you design a system to handle real-time notifications for a Salesforce application?',
      answer: 'Architecture: 1) Use Platform Events or Change Data Capture for real-time updates, 2) Implement WebSocket connections for client-server communication, 3) Use a message queue (RabbitMQ, Kafka) for reliable delivery, 4) Implement exponential backoff for retries, 5) Use Redis for pub/sub and caching, 6) Consider using Salesforce Streaming API, 7) Implement notification preferences and batching, 8) Monitor and handle connection failures gracefully.',
      tags: ['real-time', 'messaging', 'salesforce'],
      source: 'LeetCode Discuss',
      sourceUrl: 'https://leetcode.com/discuss',
    },
    {
      id: 3,
      question: 'Design a system to handle large data volumes (LDV) in Salesforce. What are the key patterns?',
      answer: 'LDV Patterns: 1) Use indexed fields in WHERE clauses, 2) Implement pagination with OFFSET or cursor-based pagination, 3) Use batch processing for bulk operations, 4) Leverage SOSL for text searches, 5) Use selective filters (indexed fields only), 6) Implement data archiving strategies, 7) Use custom indexes for frequently queried fields, 8) Consider using Big Objects for historical data, 9) Avoid SOQL in loops, 10) Use Database.queryLocator for large result sets.',
      tags: ['ldv', 'performance', 'salesforce'],
      source: 'Salesforce Trailblazer Community',
      sourceUrl: 'https://trailhead.salesforce.com',
    },
    {
      id: 4,
      question: 'How would you design a multi-tenant SaaS application on Salesforce?',
      answer: 'Multi-tenant Design: 1) Use Salesforce orgs or Platform Licenses for isolation, 2) Implement tenant-specific data segregation using custom fields or objects, 3) Use sharing rules and profiles for access control, 4) Implement tenant-specific configuration objects, 5) Use namespacing for custom code, 6) Design scalable data models that don\'t cause data skew, 7) Implement tenant-level rate limiting, 8) Use Platform Events for cross-tenant communication if needed, 9) Monitor governor limits per tenant.',
      tags: ['multi-tenant', 'architecture', 'salesforce'],
      source: 'Glassdoor',
      sourceUrl: 'https://www.glassdoor.com',
    },
  ],
  'Frontend': [
    {
      id: 5,
      question: 'How would you optimize a React application for performance, specifically for INP (Interaction to Next Paint)?',
      answer: 'INP Optimization: 1) Debounce/throttle event handlers, 2) Use React.memo, useMemo, useCallback appropriately, 3) Code split with React.lazy and Suspense, 4) Use passive event listeners, 5) Break up long tasks with setTimeout or scheduler.postTask, 6) Use requestIdleCallback for non-critical work, 7) Minimize JavaScript bundle size, 8) Use Web Workers for heavy computations, 9) Optimize re-renders with proper state management, 10) Use virtual scrolling for long lists, 11) Implement proper loading states.',
      tags: ['react', 'performance', 'inp'],
      source: 'Blind',
      sourceUrl: 'https://www.teamblind.com',
    },
    {
      id: 6,
      question: 'How would you build a responsive calendar component using CSS Grid?',
      answer: 'CSS Grid Calendar: 1) Use `display: grid` with `grid-template-columns: repeat(7, 1fr)` for 7 days, 2) Use `grid-auto-rows: minmax(60px, auto)` for flexible row heights, 3) Use `grid-column` to span multi-day events, 4) Use `grid-row` for time slots, 5) Implement responsive breakpoints with media queries, 6) Use `grid-template-areas` for named layout regions, 7) Handle overlapping events with z-index and positioning, 8) Use CSS variables for theming, 9) Implement drag-and-drop with proper grid calculations.',
      tags: ['css', 'grid', 'calendar', 'frontend'],
      source: 'Glassdoor',
      sourceUrl: 'https://www.glassdoor.com',
    },
    {
      id: 7,
      question: 'Explain how you would implement state management in a large React application. When would you use Redux vs Context API?',
      answer: 'State Management Strategy: Use Context API for: 1) Theme/UI state, 2) User authentication, 3) Simple global state. Use Redux for: 1) Complex state logic, 2) Time-travel debugging needs, 3) Middleware requirements (logging, async), 4) Large teams needing predictable state updates. Best practices: 1) Keep state as local as possible, 2) Use Redux Toolkit for modern Redux, 3) Normalize state shape, 4) Use selectors for derived state, 5) Implement proper action creators, 6) Consider Zustand or Jotai for simpler alternatives.',
      tags: ['react', 'state-management', 'redux'],
      source: 'LeetCode Discuss',
      sourceUrl: 'https://leetcode.com/discuss',
    },
    {
      id: 8,
      question: 'How would you handle form validation and error handling in a React application?',
      answer: 'Form Validation: 1) Use libraries like React Hook Form or Formik, 2) Implement client-side validation with schema validation (Yup, Zod), 3) Show inline error messages, 4) Disable submit button during validation, 5) Handle async validation for server-side checks, 6) Implement proper error boundaries, 7) Use try-catch for API calls, 8) Display user-friendly error messages, 9) Log errors to monitoring service (Sentry), 10) Implement retry logic for network errors, 11) Use toast notifications for success/error feedback.',
      tags: ['react', 'forms', 'validation'],
      source: 'Glassdoor',
      sourceUrl: 'https://www.glassdoor.com',
    },
  ],
  'LeetCode': [
    {
      id: 9,
      question: 'Given two calendars and a meeting duration, find all available time slots where a meeting can be scheduled. (LeetCode-style)',
      answer: 'Approach: 1) Merge overlapping intervals in each calendar, 2) Find gaps between meetings in both calendars, 3) Check if gap duration >= meeting duration, 4) Return overlapping available slots. Time: O(n log n) for sorting, O(n) for merging. Space: O(n). Key: Two-pointer technique, interval merging.',
      tags: ['algorithms', 'intervals', 'two-pointers'],
      source: 'LeetCode',
      sourceUrl: 'https://leetcode.com',
    },
    {
      id: 10,
      question: 'Implement a rate limiter that allows N requests per minute. (System Design + Coding)',
      answer: 'Solutions: 1) Sliding Window: Use Redis with sorted sets, 2) Token Bucket: Refill tokens at fixed rate, 3) Fixed Window: Count requests per time window. Implementation: Use a queue to track request timestamps, remove old entries, check if count < limit. For distributed: Use Redis with atomic operations. Time: O(1) average, O(n) worst case cleanup.',
      tags: ['algorithms', 'rate-limiting', 'data-structures'],
      source: 'LeetCode',
      sourceUrl: 'https://leetcode.com',
    },
    {
      id: 11,
      question: 'Design a data structure to efficiently find available time slots in a calendar. (LeetCode + System Design)',
      answer: 'Data Structures: 1) Interval Tree: O(log n) insert/search, 2) Balanced BST: Store intervals, search for overlaps, 3) Segment Tree: For range queries, 4) Simple approach: Sorted array with binary search O(log n). For calendar: Use TreeMap/Red-Black Tree to maintain sorted intervals, merge overlapping, find gaps. Consider timezone handling and recurring events.',
      tags: ['data-structures', 'intervals', 'trees'],
      source: 'LeetCode',
      sourceUrl: 'https://leetcode.com',
    },
    {
      id: 12,
      question: 'Given a list of meetings with start/end times, find the minimum number of meeting rooms needed. (LeetCode 253)',
      answer: 'Approach: 1) Sort meetings by start time, 2) Use a min-heap to track end times of ongoing meetings, 3) For each meeting: if start >= min(end times), reuse room, else need new room, 4) Track max rooms needed. Time: O(n log n), Space: O(n). Alternative: Use sweep line algorithm with start/end events.',
      tags: ['algorithms', 'heap', 'greedy'],
      source: 'LeetCode',
      sourceUrl: 'https://leetcode.com',
    },
  ],
  'Backend': [
    {
      id: 13,
      question: 'How would you handle data skew in Salesforce? What causes it and how do you prevent it?',
      answer: 'Data Skew Solutions: 1) Redistribute data across multiple parent records (bucket pattern), 2) Use sharing rules instead of manual sharing for skewed relationships, 3) Avoid owner-based sharing for skewed data, 4) Use custom sharing logic that doesn\'t cascade, 5) Implement data archiving for old records, 6) Use junction objects to break up many-to-many relationships, 7) Monitor sharing calculation performance, 8) Consider using Platform Events for decoupled updates.',
      tags: ['salesforce', 'data-skew', 'performance'],
      source: 'Salesforce Trailblazer Community',
      sourceUrl: 'https://trailhead.salesforce.com',
    },
    {
      id: 14,
      question: 'Explain Salesforce governor limits and how you would work within them for a scheduling system.',
      answer: 'Governor Limits: SOQL (100 queries, 50K rows), DML (150 statements, 10K records), Heap (6MB sync, 12MB async), CPU (10s sync, 60s async). Strategies: 1) Use batch classes for large operations, 2) Leverage @future/queueable for async, 3) Use Database.queryLocator, 4) Bulkify all operations, 5) Avoid SOQL/DML in loops, 6) Use collections efficiently, 7) Implement pagination, 8) Use Platform Events for decoupling, 9) Monitor limits with Limits class.',
      tags: ['salesforce', 'governor-limits', 'best-practices'],
      source: 'Glassdoor',
      sourceUrl: 'https://www.glassdoor.com',
    },
    {
      id: 15,
      question: 'How would you implement optimistic vs pessimistic locking in a Salesforce scheduling system?',
      answer: 'Optimistic: 1) Add version number or LastModifiedDate field, 2) Read version with data, 3) Update only if version matches, 4) Handle StaleObjectException, 5) Retry with fresh data. Pessimistic: 1) Use FOR UPDATE in SOQL to lock rows, 2) Lock acquired during transaction, 3) Automatically released on commit/rollback, 4) Other transactions wait. Use optimistic for high-read scenarios, pessimistic for critical integrity needs.',
      tags: ['salesforce', 'concurrency', 'locking'],
      source: 'Salesforce Documentation',
      sourceUrl: 'https://developer.salesforce.com',
    },
    {
      id: 16,
      question: 'How would you design an API for a scheduling system? Consider REST principles, versioning, and error handling.',
      answer: 'API Design: 1) RESTful endpoints (GET /appointments, POST /appointments, PUT /appointments/:id), 2) Use proper HTTP status codes, 3) Implement pagination (limit, offset, cursor), 4) Version API (/v1/appointments), 5) Use consistent error format {error, message, code}, 6) Implement rate limiting, 7) Use authentication (OAuth 2.0, JWT), 8) Include request/response logging, 9) Implement idempotency keys, 10) Use HATEOAS for discoverability, 11) Document with OpenAPI/Swagger.',
      tags: ['api-design', 'rest', 'backend'],
      source: 'Glassdoor',
      sourceUrl: 'https://www.glassdoor.com',
    },
  ],
  'Salesforce-Specific': [
    {
      id: 17,
      question: 'Explain the difference between Lookup and Master-Detail relationships in Salesforce.',
      answer: 'Lookup: Optional relationship, child can exist without parent, no cascade delete, can be reparented, no rollup summary fields. Master-Detail: Required relationship, child deleted when parent deleted, cannot be reparented, supports rollup summary fields, ownership determined by parent. Use Master-Detail when: 1) Child cannot exist without parent, 2) Need rollup summaries, 3) Need cascade delete. Use Lookup for: 1) Optional relationships, 2) Need flexibility to reparent.',
      tags: ['salesforce', 'relationships', 'data-model'],
      source: 'Salesforce Documentation',
      sourceUrl: 'https://developer.salesforce.com',
    },
    {
      id: 18,
      question: 'How would you handle bulk data operations in Salesforce? Explain batch classes.',
      answer: 'Batch Classes: 1) Implement Database.Batchable interface, 2) start() returns Database.QueryLocator or Iterable, 3) execute() processes batches (200 records default), 4) finish() runs after all batches. Best practices: 1) Keep batch size small for complex operations, 2) Use stateful for maintaining state across batches, 3) Handle governor limits per batch, 4) Implement error handling and logging, 5) Use Database.executeBatch() to invoke, 6) Monitor with AsyncApexJob, 7) Consider using Queueable for smaller operations.',
      tags: ['salesforce', 'batch', 'bulk-operations'],
      source: 'Salesforce Trailblazer Community',
      sourceUrl: 'https://trailhead.salesforce.com',
    },
    {
      id: 19,
      question: 'What are Platform Events and when would you use them?',
      answer: 'Platform Events: Asynchronous messaging for decoupled communication. Use cases: 1) Real-time notifications, 2) Cross-org communication, 3) Integration with external systems, 4) Event-driven architecture. Implementation: 1) Create custom platform event, 2) Publish events with EventBus.publish(), 3) Subscribe with triggers or CometD, 4) Handle in Apex triggers or Lightning components. Benefits: Decoupling, scalability, reliability. Consider: Delivery guarantees, ordering, replay capability.',
      tags: ['salesforce', 'platform-events', 'messaging'],
      source: 'Salesforce Documentation',
      sourceUrl: 'https://developer.salesforce.com',
    },
    {
      id: 20,
      question: 'How would you implement sharing and security in a Salesforce application?',
      answer: 'Sharing Model: 1) Organization-wide defaults (Private, Public Read Only, Public Read/Write), 2) Role hierarchy for vertical access, 3) Sharing rules for horizontal access, 4) Manual sharing for exceptions, 5) Apex managed sharing for programmatic access. Security: 1) Field-level security (FLS), 2) Object permissions, 3) Profile and permission sets, 4) Apex with sharing keyword, 5) SOQL with security enforced, 6) Use Security.stripInaccessible() for FLS. Best practices: Principle of least privilege, regular access reviews.',
      tags: ['salesforce', 'security', 'sharing'],
      source: 'Glassdoor',
      sourceUrl: 'https://www.glassdoor.com',
    },
  ],
}

function SalesforceInterviewQuestions({ initialCategory }) {
  const gameState = useGame()
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || 'All')
  const [selectedSources, setSelectedSources] = useState(new Set())
  const [expandedQuestions, setExpandedQuestions] = useState(new Set())
  const [searchQuery, setSearchQuery] = useState('')
  const [viewedQuestions, setViewedQuestions] = useState(new Set())

  const categories = ['All', ...Object.keys(interviewQuestions)]
  
  // Get all unique sources from questions
  const allSources = Array.from(new Set(
    Object.values(interviewQuestions).flat().map(q => q.source)
  )).sort()

  const getSourceColor = (source) => {
    const colors = {
      'Glassdoor': 'bg-blue-100 text-blue-700 border-blue-300',
      'LeetCode': 'bg-orange-100 text-orange-700 border-orange-300',
      'LeetCode Discuss': 'bg-orange-100 text-orange-700 border-orange-300',
      'Salesforce Documentation': 'bg-green-100 text-green-700 border-green-300',
      'Salesforce Trailblazer Community': 'bg-purple-100 text-purple-700 border-purple-300',
      'Blind': 'bg-gray-100 text-gray-700 border-gray-300',
    }
    return colors[source] || 'bg-gray-100 text-gray-700 border-gray-300'
  }

  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory)
    }
  }, [initialCategory])

  const toggleQuestion = (questionId) => {
    const newExpanded = new Set(expandedQuestions)
    if (newExpanded.has(questionId)) {
      newExpanded.delete(questionId)
    } else {
      newExpanded.add(questionId)
      // Award XP for viewing a question (only once per question)
      if (!viewedQuestions.has(questionId)) {
        setViewedQuestions(prev => new Set([...prev, questionId]))
        gameState.actions.questionView()
      }
    }
    setExpandedQuestions(newExpanded)
  }

  const toggleSource = (source) => {
    const newSources = new Set(selectedSources)
    if (newSources.has(source)) {
      newSources.delete(source)
    } else {
      newSources.add(source)
    }
    setSelectedSources(newSources)
  }

  const clearAllFilters = () => {
    setSelectedCategory('All')
    setSelectedSources(new Set())
    setSearchQuery('')
  }

  const getFilteredQuestions = () => {
    let allQuestions = []
    
    // Filter by category
    if (selectedCategory === 'All') {
      Object.values(interviewQuestions).forEach(categoryQuestions => {
        allQuestions.push(...categoryQuestions)
      })
    } else {
      allQuestions = interviewQuestions[selectedCategory] || []
    }

    // Filter by sources (if any selected)
    if (selectedSources.size > 0) {
      allQuestions = allQuestions.filter(q => selectedSources.has(q.source))
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      allQuestions = allQuestions.filter(q => 
        q.question.toLowerCase().includes(query) ||
        q.answer.toLowerCase().includes(query) ||
        q.tags.some(tag => tag.toLowerCase().includes(query)) ||
        q.source.toLowerCase().includes(query)
      )
    }

    return allQuestions
  }

  const filteredQuestions = getFilteredQuestions()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-2">
          <MessageSquare className="w-6 h-6 text-salesforce-blue" />
          <h2 className="text-2xl font-bold text-salesforce-dark-blue">
            Interview Questions
          </h2>
        </div>
        <p className="text-salesforce-gray">
          Real questions from Salesforce Software Engineer interviews, sourced from multiple platforms
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions, answers, tags, or sources..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:border-salesforce-blue focus:ring-2 focus:ring-salesforce-light-blue focus:outline-none transition-all"
            />
          </div>
          {(selectedCategory !== 'All' || selectedSources.size > 0 || searchQuery) && (
            <button
              onClick={clearAllFilters}
              className="px-4 py-2.5 text-sm font-medium text-salesforce-gray hover:text-salesforce-blue border border-gray-300 rounded-lg hover:border-salesforce-blue transition-colors whitespace-nowrap"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Question Type Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-5 h-5 text-salesforce-gray" />
          <h3 className="text-sm font-semibold text-salesforce-dark-blue">Question Type</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.filter(cat => cat !== 'All').map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category === selectedCategory ? 'All' : category)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                selectedCategory === category
                  ? 'bg-salesforce-blue text-white shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              selectedCategory === 'All'
                ? 'bg-salesforce-blue text-white shadow-sm'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Types
          </button>
        </div>
      </div>

      {/* Source Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
        <div className="flex items-center gap-2 mb-3">
          <ExternalLink className="w-5 h-5 text-salesforce-gray" />
          <h3 className="text-sm font-semibold text-salesforce-dark-blue">Source</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {allSources.map(source => {
            const isSelected = selectedSources.has(source)
            const sourceColorClasses = getSourceColor(source)
            return (
              <button
                key={source}
                onClick={() => toggleSource(source)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all border ${
                  isSelected
                    ? `${sourceColorClasses} border-current shadow-sm`
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-transparent'
                }`}
              >
                {source}
              </button>
            )
          })}
          {selectedSources.size > 0 && (
            <button
              onClick={() => setSelectedSources(new Set())}
              className="px-4 py-2 text-sm font-medium rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all"
            >
              All Sources
            </button>
          )}
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-3">
        {filteredQuestions.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <p className="text-salesforce-gray text-lg">
              No questions found matching your search criteria.
            </p>
            <p className="text-salesforce-gray text-sm mt-2">
              Try adjusting your filters or search terms.
            </p>
          </div>
        ) : (
          filteredQuestions.map((question) => {
            const isExpanded = expandedQuestions.has(question.id)
            const category = Object.keys(interviewQuestions).find(cat => 
              interviewQuestions[cat].some(q => q.id === question.id)
            )
            
            return (
              <div
                key={question.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all"
              >
                {/* Question Header */}
                <button
                  onClick={() => toggleQuestion(question.id)}
                  className="w-full text-left p-5 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      {/* Category and Source */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-semibold px-2.5 py-1 bg-salesforce-light-blue text-salesforce-blue rounded-md">
                          {category}
                        </span>
                        <a
                          href={question.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className={`text-xs font-medium px-2.5 py-1 rounded-md border flex items-center gap-1 ${getSourceColor(question.source)} hover:opacity-80 transition-opacity`}
                        >
                          {question.source}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                        <div className="flex gap-1 flex-wrap">
                          {question.tags.map(tag => (
                            <span
                              key={tag}
                              className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      {/* Question Text */}
                      <h3 className="font-semibold text-salesforce-dark-blue text-base leading-snug pr-4">
                        {question.question}
                      </h3>
                    </div>
                    
                    {/* Expand Icon */}
                    <div className="flex-shrink-0 pt-1">
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-salesforce-blue" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                </button>

                {/* Answer Section */}
                {isExpanded && (
                  <div className="px-5 pb-5 border-t border-gray-100 bg-gray-50">
                    <div className="pt-5">
                      <div className="bg-white border-l-4 border-salesforce-blue p-5 rounded-r-lg shadow-sm">
                        <div className="flex items-center gap-2 mb-3">
                          <h4 className="font-semibold text-salesforce-dark-blue">
                            Answer
                          </h4>
                          <span className="text-xs text-salesforce-gray">
                            Source: {question.source}
                          </span>
                        </div>
                        <div className="prose prose-sm max-w-none">
                          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                            {question.answer}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>

      {/* Stats Footer */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-sm">
          <div className="text-salesforce-gray">
            <span className="font-medium text-salesforce-dark-blue">{filteredQuestions.length}</span> question{filteredQuestions.length !== 1 ? 's' : ''} shown
            {selectedCategory !== 'All' && (
              <span> • Type: <span className="font-medium text-salesforce-dark-blue">{selectedCategory}</span></span>
            )}
            {selectedSources.size > 0 && (
              <span> • {selectedSources.size} source{selectedSources.size !== 1 ? 's' : ''} selected</span>
            )}
          </div>
          <div className="text-salesforce-gray">
            Total: <span className="font-medium text-salesforce-dark-blue">{Object.values(interviewQuestions).flat().length}</span> questions across <span className="font-medium text-salesforce-dark-blue">{Object.keys(interviewQuestions).length}</span> categories
          </div>
        </div>
      </div>
    </div>
  )
}

export default SalesforceInterviewQuestions
