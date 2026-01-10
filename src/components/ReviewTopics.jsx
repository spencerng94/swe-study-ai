import { useState, useEffect, useRef } from 'react'
import { BookOpen, Save, Sparkles, Bot, User, Send, Loader, Plus, X, FileText, MessageSquare } from 'lucide-react'
import { savedTopicsService } from '../lib/dataService'

function ReviewTopics() {
  const [activeTab, setActiveTab] = useState('new')
  const [savedTopics, setSavedTopics] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    loadSavedTopics()
    
    // Listen for topic saved events
    const handleTopicSaved = () => {
      loadSavedTopics()
      setActiveTab('saved') // Switch to saved tab when topic is saved
    }
    
    window.addEventListener('topicSaved', handleTopicSaved)
    return () => window.removeEventListener('topicSaved', handleTopicSaved)
  }, [])

  const loadSavedTopics = async () => {
    setIsLoading(true)
    const topics = await savedTopicsService.load()
    setSavedTopics(topics)
    setIsLoading(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-4 sm:p-6">
        <div className="flex items-center gap-3 mb-2">
          <BookOpen className="w-6 h-6 text-salesforce-blue" />
          <h2 className="text-2xl font-bold text-salesforce-dark-blue dark:text-white">
            Review Topics
          </h2>
        </div>
        <p className="text-salesforce-gray dark:text-slate-400">
          Jot down topics you want to review, get lessons, and interact with AI tutor. Save them for future review.
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-slate-700">
        <nav className="flex gap-2 -mb-px">
          <button
            onClick={() => setActiveTab('new')}
            className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'new'
                ? 'border-salesforce-blue text-salesforce-blue dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-slate-400 dark:hover:text-slate-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              New Topic
            </div>
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'saved'
                ? 'border-salesforce-blue text-salesforce-blue dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-slate-400 dark:hover:text-slate-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Saved Topics ({savedTopics.length})
            </div>
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'new' && <NewTopicTab onTopicSaved={loadSavedTopics} />}
        {activeTab === 'saved' && (
          <SavedTopicsTab 
            topics={savedTopics} 
            isLoading={isLoading}
            onDelete={loadSavedTopics}
          />
        )}
      </div>
    </div>
  )
}

function NewTopicTab({ onTopicSaved }) {
  const [topicInput, setTopicInput] = useState('')
  const [messages, setMessages] = useState([])
  const [isGeneratingLesson, setIsGeneratingLesson] = useState(false)
  const [isTutorActive, setIsTutorActive] = useState(false)
  const [currentLesson, setCurrentLesson] = useState(null)
  const [canSave, setCanSave] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleGetLesson = async () => {
    if (!topicInput.trim()) return

    setIsGeneratingLesson(true)
    setIsTutorActive(true)
    setCanSave(false)
    setMessages([])

    // Simulate AI lesson generation
    setTimeout(() => {
      const topic = topicInput.trim()
      const lesson = generateLesson(topic)
      setCurrentLesson({
        topic,
        content: lesson,
        timestamp: new Date().toISOString()
      })

      setMessages([
        {
          type: 'ai',
          content: `Great! Let's learn about **${topic}**. Here's a comprehensive lesson:\n\n${lesson}`,
          timestamp: new Date()
        }
      ])

      setIsGeneratingLesson(false)
      setCanSave(true)
    }, 1500)
  }

  const handleTutorMessage = async (userMessage) => {
    if (!userMessage.trim() || isGeneratingLesson) return

    // Add user message
    const newMessages = [...messages, { 
      type: 'user', 
      content: userMessage.trim(),
      timestamp: new Date()
    }]
    setMessages(newMessages)

    setIsGeneratingLesson(true)

    // Simulate AI tutor response
    setTimeout(() => {
      const response = generateTutorResponse(userMessage.trim(), currentLesson?.topic || topicInput)
      
      setMessages([
        ...newMessages,
        {
          type: 'ai',
          content: response,
          timestamp: new Date()
        }
      ])
      setIsGeneratingLesson(false)
    }, 1000)
  }

  const handleSave = async (summarize = false) => {
    if (!currentLesson) return

    setIsGeneratingLesson(true)

    const savedTopic = {
      id: Date.now().toString(),
      topic: currentLesson.topic,
      lesson: summarize && currentLesson.content.length > 1000
        ? currentLesson.content.substring(0, 1000) + '...\n\n[Summary: Full lesson saved but summarized for quick reference]'
        : currentLesson.content,
      conversation: messages.map(m => ({
        type: m.type,
        content: m.content,
        timestamp: m.timestamp
      })),
      summarized: summarize && currentLesson.content.length > 1000,
      timestamp: currentLesson.timestamp,
      updatedAt: new Date().toISOString()
    }

    await savedTopicsService.save(savedTopic)
    setIsGeneratingLesson(false)

    // Reset form
    setTopicInput('')
    setMessages([])
    setCurrentLesson(null)
    setIsTutorActive(false)
    setCanSave(false)

    // Notify parent
    onTopicSaved()
    window.dispatchEvent(new CustomEvent('topicSaved'))

    // Show success message
    alert('Topic saved! Switch to "Saved Topics" tab to review it.')
  }

  return (
    <div className="space-y-6">
      {/* Topic Input */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-4 sm:p-6">
        <label className="block text-sm font-medium text-salesforce-dark-blue dark:text-white mb-2">
          What topic would you like to review?
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={topicInput}
            onChange={(e) => setTopicInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleGetLesson()}
            placeholder="e.g., data normalization, closures, optimistic locking..."
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:border-salesforce-blue focus:ring-2 focus:ring-salesforce-light-blue focus:outline-none"
            disabled={isGeneratingLesson || isTutorActive}
          />
          <button
            onClick={handleGetLesson}
            disabled={!topicInput.trim() || isGeneratingLesson || isTutorActive}
            className="px-6 py-2 bg-salesforce-blue text-white rounded-lg hover:bg-salesforce-dark-blue transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isGeneratingLesson ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Get Lesson
              </>
            )}
          </button>
        </div>
      </div>

      {/* Lesson & Chat Area */}
      {(isTutorActive || messages.length > 0) && (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-salesforce-blue" />
              <h3 className="text-lg font-semibold text-salesforce-dark-blue dark:text-white">
                AI Tutor Chat
              </h3>
            </div>
            {canSave && (
              <div className="flex gap-2">
                <button
                  onClick={() => handleSave(false)}
                  disabled={isGeneratingLesson}
                  className="px-4 py-2 bg-salesforce-blue text-white rounded-lg hover:bg-salesforce-dark-blue transition-colors disabled:opacity-50 flex items-center gap-2 text-sm"
                >
                  <Save className="w-4 h-4" />
                  Save Full
                </button>
                {currentLesson && currentLesson.content.length > 1000 && (
                  <button
                    onClick={() => handleSave(true)}
                    disabled={isGeneratingLesson}
                    className="px-4 py-2 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-slate-300 rounded-lg hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors disabled:opacity-50 flex items-center gap-2 text-sm"
                  >
                    <Save className="w-4 h-4" />
                    Save Summary
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Messages */}
          <div className="mb-4 max-h-[500px] overflow-y-auto space-y-4 min-h-[200px]">
            {messages.length === 0 && isGeneratingLesson && (
              <div className="flex items-center justify-center h-32">
                <div className="text-center">
                  <Loader className="w-8 h-8 animate-spin text-salesforce-blue mx-auto mb-2" />
                  <p className="text-salesforce-gray dark:text-slate-400">Generating lesson...</p>
                </div>
              </div>
            )}
            
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.type === 'ai' && (
                  <div className="w-8 h-8 rounded-full bg-salesforce-blue flex items-center justify-center flex-shrink-0">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-lg p-4 ${
                    message.type === 'user'
                      ? 'bg-salesforce-blue text-white'
                      : 'bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-slate-200'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{message.content}</div>
                </div>
                {message.type === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>
            ))}
            
            {isGeneratingLesson && messages.length > 0 && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-full bg-salesforce-blue flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="bg-gray-100 dark:bg-slate-700 rounded-lg p-4">
                  <Loader className="w-5 h-5 animate-spin text-salesforce-blue" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Tutor Input */}
          <TutorInput 
            onSend={handleTutorMessage}
            disabled={isGeneratingLesson}
          />
        </div>
      )}
    </div>
  )
}

function TutorInput({ onSend, disabled }) {
  const [input, setInput] = useState('')

  const handleSend = () => {
    if (!input.trim() || disabled) return
    onSend(input)
    setInput('')
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex gap-2">
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Ask questions or request clarifications..."
        className="flex-1 px-4 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:border-salesforce-blue focus:ring-2 focus:ring-salesforce-light-blue focus:outline-none resize-none"
        rows={2}
        disabled={disabled}
      />
      <button
        onClick={handleSend}
        disabled={!input.trim() || disabled}
        className="px-6 py-2 bg-salesforce-blue text-white rounded-lg hover:bg-salesforce-dark-blue transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      >
        <Send className="w-4 h-4" />
        Send
      </button>
    </div>
  )
}

function SavedTopicsTab({ topics, isLoading, onDelete }) {
  const [selectedTopic, setSelectedTopic] = useState(null)

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this topic?')) {
      await savedTopicsService.delete(id)
      onDelete()
      if (selectedTopic?.id === id) {
        setSelectedTopic(null)
      }
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="w-8 h-8 animate-spin text-salesforce-blue" />
      </div>
    )
  }

  if (topics.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-12 text-center">
        <FileText className="w-16 h-16 text-gray-300 dark:text-slate-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-salesforce-dark-blue dark:text-white mb-2">
          No saved topics yet
        </h3>
        <p className="text-salesforce-gray dark:text-slate-400">
          Go to "New Topic" tab to create and save your first review topic.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Topic List */}
      <div className="lg:col-span-1">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-4">
          <h3 className="font-semibold text-salesforce-dark-blue dark:text-white mb-4">
            Your Topics ({topics.length})
          </h3>
          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {topics.map((topic) => (
              <button
                key={topic.id}
                onClick={() => setSelectedTopic(topic)}
                className={`w-full text-left p-3 rounded-lg border transition-colors ${
                  selectedTopic?.id === topic.id
                    ? 'border-salesforce-blue bg-salesforce-light-blue dark:bg-slate-700'
                    : 'border-gray-200 dark:border-slate-700 hover:border-salesforce-blue/50 hover:bg-gray-50 dark:hover:bg-slate-700/50'
                }`}
              >
                <div className="font-medium text-sm text-salesforce-dark-blue dark:text-white mb-1">
                  {topic.topic}
                </div>
                <div className="text-xs text-salesforce-gray dark:text-slate-400">
                  {new Date(topic.timestamp).toLocaleDateString()}
                </div>
                {topic.summarized && (
                  <div className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                    (Summarized)
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Topic Detail */}
      <div className="lg:col-span-2">
        {selectedTopic ? (
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-4 sm:p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-salesforce-dark-blue dark:text-white mb-2">
                  {selectedTopic.topic}
                </h2>
                <p className="text-sm text-salesforce-gray dark:text-slate-400">
                  Saved on {new Date(selectedTopic.timestamp).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => handleDelete(selectedTopic.id)}
                className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                title="Delete topic"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="prose dark:prose-invert max-w-none mb-6">
              <div className="bg-gray-50 dark:bg-slate-900/50 rounded-lg p-4 border border-gray-200 dark:border-slate-700">
                <h3 className="text-lg font-semibold text-salesforce-dark-blue dark:text-white mb-3">
                  Lesson Content
                </h3>
                <div className="whitespace-pre-wrap text-gray-800 dark:text-slate-200">
                  {selectedTopic.lesson}
                </div>
              </div>
            </div>

            {selectedTopic.conversation && selectedTopic.conversation.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-salesforce-dark-blue dark:text-white mb-4">
                  Conversation History
                </h3>
                <div className="space-y-4 max-h-[400px] overflow-y-auto">
                  {selectedTopic.conversation.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex gap-3 ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {msg.type === 'ai' && (
                        <div className="w-8 h-8 rounded-full bg-salesforce-blue flex items-center justify-center flex-shrink-0">
                          <Bot className="w-5 h-5 text-white" />
                        </div>
                      )}
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          msg.type === 'user'
                            ? 'bg-salesforce-blue text-white'
                            : 'bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-slate-200'
                        }`}
                      >
                        <div className="whitespace-pre-wrap text-sm">{msg.content}</div>
                      </div>
                      {msg.type === 'user' && (
                        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                          <User className="w-5 h-5 text-white" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-12 text-center">
            <MessageSquare className="w-16 h-16 text-gray-300 dark:text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-salesforce-dark-blue dark:text-white mb-2">
              Select a topic to review
            </h3>
            <p className="text-salesforce-gray dark:text-slate-400">
              Choose a topic from the list to view the lesson and conversation history.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

// Simulated AI functions - can be replaced with real API calls
function generateLesson(topic) {
  const lower = topic.toLowerCase()
  
  if (lower.includes('normalization') || lower.includes('normalize')) {
    return `# Data Normalization

## What is Normalization?
Normalization is the process of organizing data in a database to reduce redundancy and improve data integrity.

## Normal Forms
1. **First Normal Form (1NF)**: Each column contains atomic values
2. **Second Normal Form (2NF)**: 1NF + all non-key attributes fully dependent on primary key
3. **Third Normal Form (3NF)**: 2NF + no transitive dependencies

## Benefits
- Reduces data redundancy
- Improves data integrity
- Simplifies updates
- Prevents anomalies

## When to Normalize
- When data integrity is critical
- When writes are frequent
- When storage space is a concern

## When to Denormalize
- When read performance is critical
- When writes are infrequent
- When complex joins slow down queries

## Salesforce Context
- Use normalized design for core objects (Accounts, Contacts)
- Denormalize for reporting objects or frequently queried data
- Consider formula fields for calculated values`
  }

  if (lower.includes('closure')) {
    return `# JavaScript Closures

## What is a Closure?
A closure gives you access to an outer function's scope from an inner function, even after the outer function has returned.

## Example
\`\`\`javascript
function createCounter() {
    let count = 0; // Private variable
    
    return {
        increment: () => ++count,
        decrement: () => --count,
        getValue: () => count
    };
}

const counter1 = createCounter();
const counter2 = createCounter();
// Each has its own 'count' variable!
\`\`\`

## Common Use Cases
- Data privacy (private variables)
- Function factories
- Event handlers
- React hooks (useState, useEffect)`
  }

  if (lower.includes('optimistic') && lower.includes('lock')) {
    return `# Optimistic Locking

## What is Optimistic Locking?
Optimistic locking assumes conflicts are rare and checks for changes before committing updates.

## How It Works
1. Read record with version number
2. Make changes locally
3. Check version on save
4. Handle StaleObjectException if version changed

## Advantages
- Better for high-read scenarios
- No locking overhead
- Allows concurrent reads

## Disadvantages
- Need to handle conflicts
- Retry logic required

## Salesforce Implementation
\`\`\`javascript
Appointment__c appt = [SELECT Id, Version__c FROM Appointment__c WHERE Id = :id];
appt.Status__c = 'Booked';
try {
    update appt;
} catch (DmlException e) {
    // Retry with fresh data
}
\`\`\``
  }

  // Default lesson
  return `# ${topic}

This is a comprehensive lesson about **${topic}**.

## Key Concepts
- Important concept 1
- Important concept 2
- Important concept 3

## Best Practices
- Practice 1
- Practice 2
- Practice 3

## Common Mistakes
- Mistake 1
- Mistake 2

## Next Steps
1. Review related topics
2. Practice with examples
3. Test your understanding`
}

function generateTutorResponse(message, topic) {
  const lower = message.toLowerCase()
  
  if (lower.includes('example') || lower.includes('show me')) {
    return `Here's an example related to **${topic}**:

\`\`\`javascript
// Example code demonstrating the concept
function example() {
    // Implementation here
    return result;
}
\`\`\`

Would you like me to explain any part of this example in more detail?`
  }

  if (lower.includes('why') || lower.includes('when')) {
    return `Great question! Here's when and why we use **${topic}**:

**When to use:**
- Scenario 1
- Scenario 2

**Why it matters:**
- Benefit 1
- Benefit 2

Does this help clarify? Feel free to ask more questions!`
  }

  return `That's a great question about **${topic}**! 

Here's a helpful explanation:
- Point 1: Detailed explanation
- Point 2: Additional context
- Point 3: Practical consideration

Is there anything specific you'd like me to clarify further?`
}

export default ReviewTopics
