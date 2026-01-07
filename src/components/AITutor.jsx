import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Save, Sparkles, Loader } from 'lucide-react'

// Simulated AI response system - can be replaced with real API
const categorizeQuestion = (question) => {
  const lower = question.toLowerCase()
  
  if (lower.includes('database') || lower.includes('schema') || lower.includes('normalization') || lower.includes('lookup') || lower.includes('master-detail')) {
    return 'Database Design'
  }
  if (lower.includes('performance') || lower.includes('optimization') || lower.includes('soql') || lower.includes('governor') || lower.includes('ldv')) {
    return 'Performance'
  }
  if (lower.includes('skew') || lower.includes('concurrency') || lower.includes('locking') || lower.includes('optimistic') || lower.includes('pessimistic')) {
    return 'Data Skew & Concurrency'
  }
  if (lower.includes('architecture') || lower.includes('system design') || lower.includes('multi-tenant') || lower.includes('platform event')) {
    return 'System Architecture'
  }
  if (lower.includes('closure') || lower.includes('scope') || lower.includes('event loop') || lower.includes('promise') || lower.includes('async')) {
    return 'JavaScript Fundamentals'
  }
  if (lower.includes('react') || lower.includes('memo') || lower.includes('inp') || lower.includes('state management') || lower.includes('hook')) {
    return 'React'
  }
  if (lower.includes('css') || lower.includes('grid') || lower.includes('layout') || lower.includes('calendar')) {
    return 'CSS & Layout'
  }
  if (lower.includes('algorithm') || lower.includes('data structure') || lower.includes('leetcode') || lower.includes('coding')) {
    return 'Problem Solving'
  }
  if (lower.includes('salesforce') || lower.includes('apex') || lower.includes('soql') || lower.includes('trigger')) {
    return 'Salesforce'
  }
  
  return 'General'
}

const generateAnswer = (question, category) => {
  // Simulated AI responses based on category and keywords
  // In production, this would call an actual AI API
  
  const lower = question.toLowerCase()
  
  // Database Design answers
  if (category === 'Database Design') {
    if (lower.includes('lookup') || lower.includes('master-detail')) {
      return {
        answer: `**Lookup vs Master-Detail Relationships:**

**Lookup Relationship:**
- Optional relationship (child can exist without parent)
- No cascade delete
- Can be reparented
- No rollup summary fields
- Use for: Flexible, optional relationships

**Master-Detail Relationship:**
- Required relationship (child deleted when parent deleted)
- Cascade delete
- Cannot be reparented
- Supports rollup summary fields
- Ownership determined by parent
- Use for: Strong dependencies, need rollups

**When to use each:**
- Use Master-Detail when the child cannot exist without the parent and you need rollup summaries
- Use Lookup for optional relationships where you need flexibility to reparent

**Example:**
- Order → Order Line Items: Master-Detail (line items don't exist without order)
- Account → Contact: Lookup (contacts can exist without account, though uncommon)`,
        category: 'Database Design'
      }
    }
    if (lower.includes('normalization') || lower.includes('denormalization')) {
      return {
        answer: `**Normalization vs Denormalization:**

**Normalization** reduces data redundancy by organizing data into separate tables with relationships.

**When to Normalize:**
- Data integrity is critical
- Writes are frequent
- Storage is a concern
- You need to avoid update anomalies

**When to Denormalize:**
- Read performance is critical
- Writes are infrequent
- You need faster queries
- Complex joins are slowing you down

**Salesforce Context:**
- Use normalized design for core objects (Accounts, Contacts)
- Denormalize for reporting objects or frequently queried data
- Consider using formula fields for calculated denormalized values`,
        category: 'Database Design'
      }
    }
  }
  
  // Performance answers
  if (category === 'Performance') {
    if (lower.includes('soql') || lower.includes('query')) {
      return {
        answer: `**SOQL Query Optimization:**

**Key Strategies:**
1. **Use selective filters** - Always filter on indexed fields
2. **Select only needed fields** - Avoid SELECT *
3. **Use LIMIT clause** - When you know max records needed
4. **Avoid SOQL in loops** - Bulkify queries instead

**Example:**
\`\`\`javascript
// Bad: Query in loop
for (Account acc : accounts) {
    List<Contact> contacts = [SELECT Id FROM Contact WHERE AccountId = :acc.Id];
}

// Good: Bulk query
Set<Id> accountIds = new Set<Id>();
for (Account acc : accounts) {
    accountIds.add(acc.Id);
}
List<Contact> contacts = [SELECT Id, AccountId FROM Contact WHERE AccountId IN :accountIds];
\`\`\`

**Indexed Fields:**
- Primary keys (Id)
- Foreign keys (lookup/master-detail fields)
- Fields with external IDs
- Standard fields (Name, Email, etc.)`,
        category: 'Performance'
      }
    }
    if (lower.includes('governor')) {
      return {
        answer: `**Salesforce Governor Limits:**

**Key Limits:**
- SOQL: 100 queries, 50K rows per transaction
- DML: 150 statements, 10K records
- Heap: 6MB (sync), 12MB (async)
- CPU: 10s (sync), 60s (async)

**Workarounds:**
1. **Batch Processing** - Use Database.executeBatch()
2. **Async Processing** - Use @future or Queueable
3. **Platform Events** - Decouple operations
4. **Bulkify** - Process records in batches

**Best Practices:**
- Always bulkify operations
- Use Database.queryLocator for large result sets
- Monitor limits with Limits class
- Design for governor limits from the start`,
        category: 'Performance'
      }
    }
  }
  
  // Data Skew answers
  if (category === 'Data Skew & Concurrency') {
    if (lower.includes('skew')) {
      return {
        answer: `**Data Skew in Salesforce:**

**What is Data Skew?**
When a small number of parent records have a disproportionate number of child records.

**Example:**
- Account A has 100,000 Contacts
- Accounts B-Z each have < 100 Contacts
- Account A causes performance issues

**Impact:**
1. Sharing calculation bottlenecks
2. Lock contention
3. Query timeouts
4. Governor limit issues

**Solutions:**
1. **Bucket Pattern** - Distribute data across multiple parent records
2. **Archive old data** - Move to Big Objects
3. **Use sharing rules** - Instead of manual sharing
4. **Monitor ratios** - Set alerts for skewed relationships`,
        category: 'Data Skew & Concurrency'
      }
    }
    if (lower.includes('locking') || lower.includes('optimistic') || lower.includes('pessimistic')) {
      return {
        answer: `**Optimistic vs Pessimistic Locking:**

**Optimistic Locking:**
- Check version before write
- Handle StaleObjectException
- Better for high-read scenarios
- No locking overhead

**Pessimistic Locking:**
- Use FOR UPDATE in SOQL
- Locks record during transaction
- Better for high-conflict scenarios
- Can cause blocking

**Implementation:**
\`\`\`javascript
// Optimistic
Appointment__c appt = [SELECT Id, Version__c FROM Appointment__c WHERE Id = :id];
appt.Status__c = 'Booked';
try {
    update appt;
} catch (DmlException e) {
    // Retry with fresh data
}

// Pessimistic
Appointment__c appt = [SELECT Id FROM Appointment__c WHERE Id = :id FOR UPDATE];
appt.Status__c = 'Booked';
update appt;
\`\`\``,
        category: 'Data Skew & Concurrency'
      }
    }
  }
  
  // React answers
  if (category === 'React') {
    if (lower.includes('memo') || lower.includes('usememo') || lower.includes('usecallback')) {
      return {
        answer: `**React Memoization:**

**useMemo** - Memoize expensive calculations:
\`\`\`javascript
const expensiveValue = useMemo(() => {
    return computeExpensiveValue(a, b);
}, [a, b]); // Only recompute if a or b changes
\`\`\`

**useCallback** - Memoize functions:
\`\`\`javascript
const handleClick = useCallback(() => {
    doSomething(id);
}, [id]); // Function reference stays same unless id changes
\`\`\`

**When to Use:**
- ✅ Expensive calculations
- ✅ Passing functions to memoized children
- ✅ Preventing unnecessary re-renders

**When NOT to Use:**
- ❌ Simple calculations
- ❌ Every function (overhead > benefit)
- ❌ Premature optimization`,
        category: 'React'
      }
    }
    if (lower.includes('inp') || lower.includes('performance')) {
      return {
        answer: `**INP (Interaction to Next Paint) Optimization:**

**Target:** < 200ms from user interaction to next paint

**Techniques:**
1. **Debounce/Throttle** - Delay event handlers
2. **Code Splitting** - Use React.lazy() and Suspense
3. **Break Up Long Tasks** - Use setTimeout or scheduler.postTask
4. **Passive Event Listeners** - For scroll/touch events
5. **Minimize Bundle Size** - Code splitting, tree shaking

**Example:**
\`\`\`javascript
const debouncedSearch = useMemo(
    () => debounce((value) => {
        // Search logic
    }, 300),
    []
);
\`\`\``,
        category: 'React'
      }
    }
  }
  
  // JavaScript answers
  if (category === 'JavaScript Fundamentals') {
    if (lower.includes('closure')) {
      return {
        answer: `**JavaScript Closures:**

A closure gives you access to an outer function's scope from an inner function, even after the outer function has returned.

**Example:**
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

**Common Use Cases:**
- Data privacy (private variables)
- Function factories
- Event handlers
- React hooks (useState, useEffect)`,
        category: 'JavaScript Fundamentals'
      }
    }
    if (lower.includes('event loop') || lower.includes('promise') || lower.includes('settimeout')) {
      return {
        answer: `**JavaScript Event Loop:**

**Execution Order:**
1. Synchronous code executes first
2. **Microtasks** execute next (Promises, queueMicrotask)
3. **Macrotasks** execute last (setTimeout, setInterval)

**Example:**
\`\`\`javascript
console.log('1'); // Sync
Promise.resolve().then(() => console.log('2')); // Microtask
setTimeout(() => console.log('3'), 0); // Macrotask
Promise.resolve().then(() => console.log('4')); // Microtask
console.log('5'); // Sync

// Output: 1, 5, 2, 4, 3
\`\`\`

**Why This Matters:**
- Promises resolve before setTimeout, even with 0ms delay
- All microtasks complete before next macrotask
- Critical for understanding async behavior in React`,
        category: 'JavaScript Fundamentals'
      }
    }
  }
  
  // Default answer
  return {
    answer: `I understand you're asking about "${question}". This is a great question for your Salesforce interview preparation!

Based on the context, this seems related to **${category}**. Here's a helpful answer:

**Key Points:**
- This topic is important for understanding ${category.toLowerCase()} in Salesforce development
- Consider reviewing the related lessons in the Study Guide
- Practice with the interactive tools available in this dashboard

**Next Steps:**
1. Check the "Lessons" section for detailed coverage
2. Review related interview questions
3. Practice with the interactive playgrounds

Would you like me to elaborate on any specific aspect of this topic?`,
    category: category
  }
}

function AITutor() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput('')
    setIsLoading(true)

    // Add user message
    const newMessages = [...messages, { type: 'user', content: userMessage }]
    setMessages(newMessages)

    // Simulate AI processing
    setTimeout(() => {
      const category = categorizeQuestion(userMessage)
      const response = generateAnswer(userMessage, category)
      
      setMessages([
        ...newMessages,
        {
          type: 'ai',
          content: response.answer,
          category: response.category,
          question: userMessage,
        }
      ])
      setIsLoading(false)
    }, 1000)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Sparkles className="w-6 h-6 text-salesforce-blue" />
          <h2 className="text-2xl font-bold text-salesforce-dark-blue">
            AI Tutor
          </h2>
        </div>
        <p className="text-salesforce-gray">
          Ask me anything about Salesforce, React, JavaScript, or system design. I'll categorize and answer your questions!
        </p>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6 overflow-y-auto min-h-[400px] max-h-[600px]">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-center">
            <div>
              <Bot className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-salesforce-gray">
                Ask me a question to get started!
              </p>
              <p className="text-sm text-gray-400 mt-2">
                Try: "What's the difference between Lookup and Master-Detail?"
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
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
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {message.type === 'ai' && message.category && (
                    <div className="mb-2">
                      <span className="text-xs font-semibold px-2 py-1 bg-salesforce-light-blue text-salesforce-blue rounded">
                        {message.category}
                      </span>
                    </div>
                  )}
                  <div className="whitespace-pre-wrap">{message.content}</div>
                  {message.type === 'ai' && (
                    <SaveQuestionButton
                      question={message.question}
                      answer={message.content}
                      category={message.category}
                    />
                  )}
                </div>
                {message.type === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-full bg-salesforce-blue flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="bg-gray-100 rounded-lg p-4">
                  <Loader className="w-5 h-5 animate-spin text-salesforce-blue" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask a question..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:border-salesforce-blue focus:ring-2 focus:ring-salesforce-light-blue focus:outline-none resize-none"
            rows={2}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="px-6 py-2 bg-salesforce-blue text-white rounded-lg hover:bg-salesforce-dark-blue transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            Send
          </button>
        </div>
      </div>
    </div>
  )
}

function SaveQuestionButton({ question, answer, category }) {
  const [showOptions, setShowOptions] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async (summarize = false) => {
    setIsSaving(true)
    
    let finalAnswer = answer
    if (summarize && answer.length > 500) {
      // Simple summarization - in production, use AI API
      finalAnswer = answer.substring(0, 500) + '...\n\n[Summary: Full answer saved but summarized for quick reference]'
    }

    const savedItem = {
      id: Date.now(),
      question,
      answer: finalAnswer,
      category: category || 'General',
      summarized: summarize && answer.length > 500,
      timestamp: new Date().toISOString(),
    }

    // Save to localStorage
    const saved = JSON.parse(localStorage.getItem('savedQuestions') || '[]')
    saved.push(savedItem)
    localStorage.setItem('savedQuestions', JSON.stringify(saved))

    setIsSaving(false)
    setShowOptions(false)
    
    // Dispatch event to notify SavedQuestions component
    window.dispatchEvent(new CustomEvent('questionSaved'))
    
    // Show success message
    alert('Question saved! Check the "Saved Questions" section.')
  }

  return (
    <div className="mt-3 pt-3 border-t border-gray-300">
      <button
        onClick={() => setShowOptions(!showOptions)}
        className="flex items-center gap-2 text-sm text-salesforce-blue hover:text-salesforce-dark-blue transition-colors"
      >
        <Save className="w-4 h-4" />
        Save Question
      </button>
      {showOptions && (
        <div className="mt-2 flex gap-2">
          <button
            onClick={() => handleSave(false)}
            disabled={isSaving}
            className="px-3 py-1.5 text-xs bg-salesforce-blue text-white rounded hover:bg-salesforce-dark-blue transition-colors disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save Full Answer'}
          </button>
          {answer.length > 500 && (
            <button
              onClick={() => handleSave(true)}
              disabled={isSaving}
              className="px-3 py-1.5 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Summarized'}
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default AITutor
