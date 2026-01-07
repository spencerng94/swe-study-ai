import { useState } from 'react'
import { ChevronDown, ChevronUp, Code, Lightbulb, MessageSquare, CheckCircle } from 'lucide-react'

// Concept order reasoning:
// 1. Pure vs Impure Functions - Foundation for understanding immutability and React patterns
// 2. Immutability - Core to React's philosophy
// 3. Referential Equality - Needed to understand why immutability matters
// 4. Closures - Fundamental JS concept, used everywhere in React
// 5. JavaScript Event Loop - Critical for async understanding
// 6. Props vs State - Core React concept
// 7. Controlled vs Uncontrolled Components - React pattern
// 8. useState vs useRef - Hook comparison
// 9. useEffect Common Pitfalls - Most misunderstood hook
// 10. Derived State - Common React pattern
// 11. Why React Re-renders - Core understanding
// 12. Memoization - Performance optimization
// 13. Event Delegation - DOM/browser concept

const concepts = [
  {
    id: 'pure-functions',
    title: 'Pure vs Impure Functions',
    order: 1,
  },
  {
    id: 'promises',
    title: 'Promises',
    order: 2,
  },
  {
    id: 'async-await',
    title: 'Async/Await',
    order: 3,
  },
  {
    id: 'closures',
    title: 'Closures',
    order: 4,
  },
  {
    id: 'scope-hoisting',
    title: 'Scope & Hoisting',
    order: 5,
  },
  {
    id: 'this-prototypes',
    title: 'this Binding & Prototypes',
    order: 6,
  },
  {
    id: 'event-loop',
    title: 'Event Loop & Task Queues',
    order: 7,
  },
  {
    id: 'dom-events',
    title: 'DOM & Event Propagation',
    order: 8,
  },
  {
    id: 'browser-apis',
    title: 'Browser APIs (Fetch, Storage, History)',
    order: 9,
  },
  {
    id: 'css-fundamentals',
    title: 'CSS Fundamentals (Cascade, Box Model, Layout)',
    order: 10,
  },
  {
    id: 'performance-basics',
    title: 'Performance Basics (Debounce/Throttle)',
    order: 11,
  },
  {
    id: 'accessibility-essentials',
    title: 'Accessibility Essentials',
    order: 12,
  },
  {
    id: 'security-basics',
    title: 'Security Basics (XSS, CORS, CSP)',
    order: 13,
  },
  {
    id: 'networking-caching',
    title: 'Networking & Caching',
    order: 14,
  },
  {
    id: 'state-management',
    title: 'State Management Patterns',
    order: 15,
  },
  {
    id: 'testing-tooling',
    title: 'Testing & Tooling Fundamentals',
    order: 16,
  },
  // Placeholder for other concepts - will implement incrementally
]

function ConceptCard({ concept, isExpanded, onToggle }) {
  if (concept.id === 'pure-functions') {
    return <PureFunctionsConcept isExpanded={isExpanded} onToggle={onToggle} />
  }
  if (concept.id === 'promises') {
    return <PromisesConcept isExpanded={isExpanded} onToggle={onToggle} />
  }
  if (concept.id === 'async-await') {
    return <AsyncAwaitConcept isExpanded={isExpanded} onToggle={onToggle} />
  }
  
  return (
    <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
      <p className="text-gray-500">Concept: {concept.title} - Coming soon</p>
    </div>
  )
}

function PureFunctionsConcept({ isExpanded, onToggle }) {
  const [inputA, setInputA] = useState(5)
  const [inputB, setInputB] = useState(3)
  const [impureCounter, setImpureCounter] = useState(0)
  const [callHistory, setCallHistory] = useState([])

  // Pure function
  const pureAdd = (a, b) => {
    return a + b
  }

  // Impure function
  const impureAdd = (a, b) => {
    setImpureCounter(prev => prev + 1)
    console.log(`Called ${impureCounter + 1} times`)
    return a + b
  }

  const handlePureCall = () => {
    const result = pureAdd(inputA, inputB)
    setCallHistory(prev => [...prev, { type: 'pure', a: inputA, b: inputB, result, timestamp: Date.now() }])
  }

  const handleImpureCall = () => {
    const result = impureAdd(inputA, inputB)
    setCallHistory(prev => [...prev, { type: 'impure', a: inputA, b: inputB, result, timestamp: Date.now() }])
  }

  return (
    <div className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full text-left p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-salesforce-blue text-white flex items-center justify-center font-bold text-sm">
            1
          </div>
          <h3 className="text-xl font-bold text-salesforce-dark-blue">
            Pure vs Impure Functions
          </h3>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-salesforce-gray" />
        ) : (
          <ChevronDown className="w-5 h-5 text-salesforce-gray" />
        )}
      </button>

      {isExpanded && (
        <div className="px-6 pb-6 space-y-6 border-t border-gray-200">
          {/* 1. One-sentence definition */}
          <div className="pt-6">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="w-5 h-5 text-salesforce-blue" />
              <h4 className="font-semibold text-salesforce-dark-blue">Definition</h4>
            </div>
            <p className="text-gray-700 leading-relaxed pl-7">
              A <strong>pure function</strong> always returns the same output for the same input and has no side effects, while an <strong>impure function</strong> may produce different outputs or cause side effects like modifying external state, making API calls, or logging.
            </p>
          </div>

          {/* 2. Why interviewers care */}
          <div className="bg-salesforce-light-blue border-l-4 border-salesforce-blue p-4 rounded">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="w-5 h-5 text-salesforce-blue" />
              <h4 className="font-semibold text-salesforce-dark-blue">Why Interviewers Care</h4>
            </div>
            <p className="text-sm text-salesforce-dark-blue pl-7">
              This reveals whether you understand functional programming principles, can write predictable code, and recognize when side effects are appropriate. Senior engineers distinguish between pure business logic and impure I/O operations.
            </p>
          </div>

          {/* 3. Intuition / mental model */}
          <div>
            <h4 className="font-semibold text-salesforce-dark-blue mb-3">Mental Model</h4>
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <p className="text-gray-700">
                Think of a <strong>pure function</strong> like a math formula: <code className="bg-white px-1 rounded">f(x) = x + 2</code>. Given x=3, it <em>always</em> returns 5, no matter when or how many times you call it. It doesn't change anything outside itself.
              </p>
              <p className="text-gray-700">
                An <strong>impure function</strong> is like a vending machine that might be out of stock, or a calculator that also updates a counter. Same input might give different results, or it affects the world around it.
              </p>
              <p className="text-gray-700 font-medium">
                In React: Pure functions are easier to test, reason about, and optimize. Impure functions are necessary for I/O (API calls, DOM updates) but should be isolated.
              </p>
            </div>
          </div>

          {/* 4. Code example */}
          <div>
            <h4 className="font-semibold text-salesforce-dark-blue mb-3 flex items-center gap-2">
              <Code className="w-5 h-5" />
              Code Example
            </h4>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-green-700 mb-2">✓ Pure Function:</p>
                <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{`// Same input → Same output, no side effects
function add(a, b) {
  return a + b;
}

add(2, 3); // Always returns 5
add(2, 3); // Always returns 5 (identical)`}</code>
                </pre>
              </div>
              <div>
                <p className="text-sm font-medium text-red-700 mb-2">✗ Impure Functions:</p>
                <pre className="bg-gray-900 text-red-400 p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{`// Side effect: modifies external variable
let counter = 0;
function impureAdd(a, b) {
  counter++; // Side effect!
  return a + b;
}

// Side effect: console.log
function addWithLog(a, b) {
  console.log(a, b); // Side effect!
  return a + b;
}

// Non-deterministic: different results
function randomAdd(a, b) {
  return a + b + Math.random(); // Different each time!
}

// Side effect: mutates input
function addToArray(arr, item) {
  arr.push(item); // Mutates input!
  return arr.length;
}`}</code>
                </pre>
              </div>
            </div>
          </div>

          {/* 5. Live UI example */}
          <div>
            <h4 className="font-semibold text-salesforce-dark-blue mb-3">Live Example</h4>
            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Input A</label>
                  <input
                    type="number"
                    value={inputA}
                    onChange={(e) => setInputA(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-salesforce-blue focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Input B</label>
                  <input
                    type="number"
                    value={inputB}
                    onChange={(e) => setInputB(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-salesforce-blue focus:outline-none"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={handlePureCall}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  Call Pure Function
                </button>
                <button
                  onClick={handleImpureCall}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Call Impure Function
                </button>
              </div>

              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Impure Function Call Count: <span className="font-bold text-red-600">{impureCounter}</span>
                </p>
                <p className="text-xs text-gray-600 mb-2">
                  Notice: Pure function calls don't increment the counter. Impure function calls do (side effect).
                </p>
              </div>

              {callHistory.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Call History:</p>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {callHistory.slice(-5).reverse().map((call, idx) => (
                      <div
                        key={idx}
                        className={`text-xs p-2 rounded ${
                          call.type === 'pure' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {call.type === 'pure' ? '✓' : '✗'} {call.type} add({call.a}, {call.b}) = {call.result}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 6. Salesforce-style interview question */}
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="w-5 h-5 text-yellow-700" />
              <h4 className="font-semibold text-yellow-900">Interview Question</h4>
            </div>
            <p className="text-yellow-900 pl-7 italic">
              "Can you explain the difference between pure and impure functions? Can you give me an example of when you'd use each in a React application?"
            </p>
          </div>

          {/* 7. Strong answer */}
          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
            <h4 className="font-semibold text-green-900 mb-2">Strong Answer</h4>
            <div className="text-green-900 text-sm space-y-2 pl-2">
              <p>
                <strong>"Pure functions</strong> are deterministic—same inputs always produce same outputs, with no side effects. They're ideal for business logic, calculations, and data transformations. For example, in React, I'd use a pure function to format a date or calculate a total price."
              </p>
              <p>
                <strong>"Impure functions</strong> have side effects—they might modify external state, make API calls, or log to console. In React, I'd use impure functions in useEffect hooks for data fetching, or in event handlers for DOM manipulation."
              </p>
              <p>
                <strong>"The key benefit</strong> of keeping most logic pure is testability and predictability. I can test a pure function with just inputs and expected outputs, without mocking external dependencies. In React, this also helps with memoization—React can safely skip re-rendering if pure function inputs haven't changed."
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function PromisesConcept({ isExpanded, onToggle }) {
  const [promiseState, setPromiseState] = useState('pending')
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const simulatePromise = (shouldSucceed = true) => {
    setPromiseState('pending')
    setResult(null)
    setError(null)

    const promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        if (shouldSucceed) {
          resolve('Data fetched successfully!')
        } else {
          reject('Network error occurred')
        }
      }, 1500)
    })

    promise
      .then((data) => {
        setPromiseState('fulfilled')
        setResult(data)
      })
      .catch((err) => {
        setPromiseState('rejected')
        setError(err)
      })
  }

  return (
    <div className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full text-left p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-salesforce-blue text-white flex items-center justify-center font-bold text-sm">
            2
          </div>
          <h3 className="text-xl font-bold text-salesforce-dark-blue">
            Promises
          </h3>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-salesforce-gray" />
        ) : (
          <ChevronDown className="w-5 h-5 text-salesforce-gray" />
        )}
      </button>

      {isExpanded && (
        <div className="px-6 pb-6 space-y-6 border-t border-gray-200">
          {/* 1. One-sentence definition */}
          <div className="pt-6">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="w-5 h-5 text-salesforce-blue" />
              <h4 className="font-semibold text-salesforce-dark-blue">Definition</h4>
            </div>
            <p className="text-gray-700 leading-relaxed pl-7">
              A <strong>Promise</strong> is a JavaScript object representing the eventual completion (or failure) of an asynchronous operation, with three states: <code className="bg-gray-100 px-1 rounded">pending</code>, <code className="bg-gray-100 px-1 rounded">fulfilled</code>, or <code className="bg-gray-100 px-1 rounded">rejected</code>.
            </p>
          </div>

          {/* 2. Why interviewers care */}
          <div className="bg-salesforce-light-blue border-l-4 border-salesforce-blue p-4 rounded">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="w-5 h-5 text-salesforce-blue" />
              <h4 className="font-semibold text-salesforce-dark-blue">Why Interviewers Care</h4>
            </div>
            <p className="text-sm text-salesforce-dark-blue pl-7">
              Promises are fundamental to modern JavaScript. Interviewers want to see that you understand asynchronous code flow, error handling, and can avoid callback hell. This is especially important for API calls, data fetching, and handling user interactions.
            </p>
          </div>

          {/* 3. Intuition / mental model */}
          <div>
            <h4 className="font-semibold text-salesforce-dark-blue mb-3">Mental Model</h4>
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <p className="text-gray-700">
                Think of a Promise like a <strong>receipt</strong> for a future value. When you order food, you get a receipt (Promise) immediately, but the food (value) comes later. The receipt has three possible outcomes:
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                <li><strong>Pending:</strong> "Your order is being prepared"</li>
                <li><strong>Fulfilled:</strong> "Here's your food!" (success)</li>
                <li><strong>Rejected:</strong> "Sorry, we're out of that item" (error)</li>
              </ul>
              <p className="text-gray-700 font-medium">
                Once a Promise is fulfilled or rejected, it can't change. You can chain <code className="bg-white px-1 rounded">.then()</code> and <code className="bg-white px-1 rounded">.catch()</code> to handle the result when it arrives.
              </p>
            </div>
          </div>

          {/* 4. Code example */}
          <div>
            <h4 className="font-semibold text-salesforce-dark-blue mb-3 flex items-center gap-2">
              <Code className="w-5 h-5" />
              Code Example
            </h4>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-green-700 mb-2">✓ Creating and Using Promises:</p>
                <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{`// Creating a Promise
const fetchUserData = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const success = Math.random() > 0.3; // 70% success rate
      if (success) {
        resolve({ id: 1, name: 'John Doe' });
      } else {
        reject('Failed to fetch user');
      }
    }, 1000);
  });
};

// Using the Promise
fetchUserData()
  .then(user => {
    console.log('User:', user);
    return user.id; // Can return a value for next .then()
  })
  .then(userId => {
    console.log('User ID:', userId);
  })
  .catch(error => {
    console.error('Error:', error);
  });

// Promise.all - wait for multiple promises
Promise.all([
  fetchUserData(),
  fetchUserData()
])
  .then(([user1, user2]) => {
    console.log('Both users:', user1, user2);
  })
  .catch(error => {
    // If ANY promise fails, this catches it
    console.error('One failed:', error);
  });`}</code>
                </pre>
              </div>
              <div>
                <p className="text-sm font-medium text-red-700 mb-2">✗ Common Mistakes:</p>
                <pre className="bg-gray-900 text-red-400 p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{`// ❌ Forgetting to return the promise
function fetchData() {
  fetch('/api/data'); // Missing return!
}

// ✅ Correct
function fetchData() {
  return fetch('/api/data');
}

// ❌ Not handling errors
fetchUserData()
  .then(user => console.log(user));
  // What if it fails? Unhandled rejection!

// ✅ Correct
fetchUserData()
  .then(user => console.log(user))
  .catch(error => console.error(error));

// ❌ Nested promises (callback hell)
fetchUserData()
  .then(user => {
    fetchUserPosts(user.id)
      .then(posts => {
        fetchUserComments(posts[0].id)
          .then(comments => {
            // Too nested!
          });
      });
  });`}</code>
                </pre>
              </div>
            </div>
          </div>

          {/* 5. Live UI example */}
          <div>
            <h4 className="font-semibold text-salesforce-dark-blue mb-3">Live Example</h4>
            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => simulatePromise(true)}
                  disabled={promiseState === 'pending'}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Simulate Success Promise
                </button>
                <button
                  onClick={() => simulatePromise(false)}
                  disabled={promiseState === 'pending'}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Simulate Failed Promise
                </button>
              </div>

              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Promise State:</p>
                <div className={`p-3 rounded-lg ${
                  promiseState === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  promiseState === 'fulfilled' ? 'bg-green-100 text-green-800' :
                  promiseState === 'rejected' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {promiseState === 'pending' && '⏳ Pending...'}
                  {promiseState === 'fulfilled' && `✅ Fulfilled: ${result}`}
                  {promiseState === 'rejected' && `❌ Rejected: ${error}`}
                  {promiseState !== 'pending' && promiseState !== 'fulfilled' && promiseState !== 'rejected' && 'Ready to test'}
                </div>
              </div>
            </div>
          </div>

          {/* 6. Salesforce-style interview question */}
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="w-5 h-5 text-yellow-700" />
              <h4 className="font-semibold text-yellow-900">Interview Question</h4>
            </div>
            <p className="text-yellow-900 pl-7 italic">
              "Can you explain what a Promise is? How would you handle multiple asynchronous operations that need to complete before proceeding?"
            </p>
          </div>

          {/* 7. Strong answer */}
          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
            <h4 className="font-semibold text-green-900 mb-2">Strong Answer</h4>
            <div className="text-green-900 text-sm space-y-2 pl-2">
              <p>
                <strong>"A Promise</strong> represents a value that will be available in the future. It starts in a pending state and transitions to either fulfilled (with a value) or rejected (with an error). Once settled, it can't change state."
              </p>
              <p>
                <strong>"For multiple operations,</strong> I'd use <code className="bg-white px-1 rounded">Promise.all()</code> if I need all to succeed, or <code className="bg-white px-1 rounded">Promise.allSettled()</code> if I want results regardless of failures. <code className="bg-white px-1 rounded">Promise.race()</code> is useful when I only need the first one to complete."
              </p>
              <p>
                <strong>"In React,</strong> I'd typically use Promises with <code className="bg-white px-1 rounded">useEffect</code> for data fetching, ensuring I handle both success and error cases. I'd also clean up any pending promises if the component unmounts."
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function AsyncAwaitConcept({ isExpanded, onToggle }) {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [executionLog, setExecutionLog] = useState([])

  const simulateAsyncOperation = async (shouldSucceed = true) => {
    setLoading(true)
    setResult(null)
    setError(null)
    setExecutionLog(['Starting async operation...'])

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      setExecutionLog(prev => [...prev, 'Promise resolved, processing data...'])

      if (shouldSucceed) {
        const data = 'User data fetched successfully!'
        setResult(data)
        setExecutionLog(prev => [...prev, `Success: ${data}`])
      } else {
        throw new Error('Network request failed')
      }
    } catch (err) {
      setError(err.message)
      setExecutionLog(prev => [...prev, `Error caught: ${err.message}`])
    } finally {
      setLoading(false)
      setExecutionLog(prev => [...prev, 'Operation completed (finally block)'])
    }
  }

  return (
    <div className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full text-left p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-salesforce-blue text-white flex items-center justify-center font-bold text-sm">
            3
          </div>
          <h3 className="text-xl font-bold text-salesforce-dark-blue">
            Async/Await
          </h3>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-salesforce-gray" />
        ) : (
          <ChevronDown className="w-5 h-5 text-salesforce-gray" />
        )}
      </button>

      {isExpanded && (
        <div className="px-6 pb-6 space-y-6 border-t border-gray-200">
          {/* 1. One-sentence definition */}
          <div className="pt-6">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="w-5 h-5 text-salesforce-blue" />
              <h4 className="font-semibold text-salesforce-dark-blue">Definition</h4>
            </div>
            <p className="text-gray-700 leading-relaxed pl-7">
              <strong>Async/await</strong> is syntactic sugar built on Promises that makes asynchronous code look and behave like synchronous code, using <code className="bg-gray-100 px-1 rounded">async</code> functions and the <code className="bg-gray-100 px-1 rounded">await</code> keyword to pause execution until a Promise resolves.
            </p>
          </div>

          {/* 2. Why interviewers care */}
          <div className="bg-salesforce-light-blue border-l-4 border-salesforce-blue p-4 rounded">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="w-5 h-5 text-salesforce-blue" />
              <h4 className="font-semibold text-salesforce-dark-blue">Why Interviewers Care</h4>
            </div>
            <p className="text-sm text-salesforce-dark-blue pl-7">
              Async/await is the modern standard for handling asynchronous operations. Interviewers want to see that you can write clean, readable async code, handle errors properly, and understand how it relates to Promises. This is essential for API calls, data fetching, and any I/O operations.
            </p>
          </div>

          {/* 3. Intuition / mental model */}
          <div>
            <h4 className="font-semibold text-salesforce-dark-blue mb-3">Mental Model</h4>
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <p className="text-gray-700">
                Think of <code className="bg-white px-1 rounded">await</code> like waiting in line at a coffee shop. When you say "I'll wait for my coffee," you pause what you're doing, but the world keeps moving. Once your coffee is ready, you continue.
              </p>
              <p className="text-gray-700">
                <code className="bg-white px-1 rounded">async</code> functions always return a Promise. Even if you don't explicitly return one, JavaScript wraps your return value in a resolved Promise.
              </p>
              <p className="text-gray-700 font-medium">
                The key benefit: async/await lets you write code that reads top-to-bottom, like synchronous code, but it's actually asynchronous under the hood. No more nested <code className="bg-white px-1 rounded">.then()</code> chains!
              </p>
            </div>
          </div>

          {/* 4. Code example */}
          <div>
            <h4 className="font-semibold text-salesforce-dark-blue mb-3 flex items-center gap-2">
              <Code className="w-5 h-5" />
              Code Example
            </h4>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-green-700 mb-2">✓ Using Async/Await:</p>
                <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{`// Basic async/await
async function fetchUser() {
  try {
    const response = await fetch('/api/user');
    const user = await response.json();
    return user;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw error; // Re-throw if needed
  }
}

// Multiple sequential awaits
async function fetchUserData() {
  const user = await fetchUser();
  const posts = await fetchUserPosts(user.id);
  const comments = await fetchPostComments(posts[0].id);
  return { user, posts, comments };
}

// Parallel execution with Promise.all
async function fetchAllData() {
  const [user, posts, comments] = await Promise.all([
    fetchUser(),
    fetchUserPosts(),
    fetchComments()
  ]);
  return { user, posts, comments };
}

// In React component
useEffect(() => {
  async function loadData() {
    try {
      setLoading(true);
      const data = await fetchUserData();
      setData(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }
  loadData();
}, []);`}</code>
                </pre>
              </div>
              <div>
                <p className="text-sm font-medium text-red-700 mb-2">✗ Common Mistakes:</p>
                <pre className="bg-gray-900 text-red-400 p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{`// ❌ Forgetting await - returns Promise, not value
async function getData() {
  const data = fetch('/api/data'); // Missing await!
  return data.json(); // Error: data is a Promise
}

// ✅ Correct
async function getData() {
  const response = await fetch('/api/data');
  return response.json();
}

// ❌ Not handling errors
async function fetchData() {
  const data = await fetch('/api/data'); // What if this fails?
  return data.json();
}

// ✅ Correct
async function fetchData() {
  try {
    const response = await fetch('/api/data');
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

// ❌ Sequential when parallel would be better
async function slow() {
  const a = await fetchA(); // Wait for A
  const b = await fetchB(); // Then wait for B
  // Total: time(A) + time(B)
}

// ✅ Parallel
async function fast() {
  const [a, b] = await Promise.all([
    fetchA(), // Start both
    fetchB()  // at the same time
  ]);
  // Total: max(time(A), time(B))
}`}</code>
                </pre>
              </div>
            </div>
          </div>

          {/* 5. Live UI example */}
          <div>
            <h4 className="font-semibold text-salesforce-dark-blue mb-3">Live Example</h4>
            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => simulateAsyncOperation(true)}
                  disabled={loading}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Loading...' : 'Simulate Success'}
                </button>
                <button
                  onClick={() => simulateAsyncOperation(false)}
                  disabled={loading}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Loading...' : 'Simulate Error'}
                </button>
              </div>

              {loading && (
                <div className="p-3 bg-yellow-100 text-yellow-800 rounded-lg">
                  ⏳ Async operation in progress...
                </div>
              )}

              {result && (
                <div className="p-3 bg-green-100 text-green-800 rounded-lg">
                  ✅ Success: {result}
                </div>
              )}

              {error && (
                <div className="p-3 bg-red-100 text-red-800 rounded-lg">
                  ❌ Error: {error}
                </div>
              )}

              {executionLog.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Execution Flow:</p>
                  <div className="space-y-1 max-h-32 overflow-y-auto bg-white p-2 rounded border">
                    {executionLog.map((log, idx) => (
                      <div key={idx} className="text-xs text-gray-700 font-mono">
                        {idx + 1}. {log}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 6. Salesforce-style interview question */}
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="w-5 h-5 text-yellow-700" />
              <h4 className="font-semibold text-yellow-900">Interview Question</h4>
            </div>
            <p className="text-yellow-900 pl-7 italic">
              "What's the difference between Promises and async/await? When would you use one over the other?"
            </p>
          </div>

          {/* 7. Strong answer */}
          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
            <h4 className="font-semibold text-green-900 mb-2">Strong Answer</h4>
            <div className="text-green-900 text-sm space-y-2 pl-2">
              <p>
                <strong>"Async/await is syntactic sugar</strong> over Promises—it's the same thing under the hood, but with cleaner syntax. <code className="bg-white px-1 rounded">async</code> functions always return Promises, and <code className="bg-white px-1 rounded">await</code> pauses execution until a Promise resolves."
              </p>
              <p>
                <strong>"I prefer async/await</strong> for most cases because it reads like synchronous code, making it easier to debug and reason about. However, <code className="bg-white px-1 rounded">Promise.all()</code> is still useful when I need parallel execution, and I'll use it even within async functions."
              </p>
              <p>
                <strong>"The key advantage</strong> is error handling with try/catch blocks, which feels more natural than chaining <code className="bg-white px-1 rounded">.catch()</code>. In React, I use async/await in <code className="bg-white px-1 rounded">useEffect</code> for data fetching, ensuring I handle loading and error states properly."
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function FrontendJavaScriptFundamentals() {
  const [expandedConcepts, setExpandedConcepts] = useState(() => new Set(['pure-functions']))

  const toggleConcept = (conceptId) => {
    const newExpanded = new Set(expandedConcepts)
    if (newExpanded.has(conceptId)) {
      newExpanded.delete(conceptId)
    } else {
      newExpanded.add(conceptId)
    }
    setExpandedConcepts(newExpanded)
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-salesforce-dark-blue mb-2">
          Frontend JavaScript Fundamentals
        </h2>
        <p className="text-salesforce-gray mb-4">
          Master the core concepts that come up in every Salesforce frontend interview. Each concept is designed to be learnable in under 5 minutes.
        </p>
        <div className="flex items-center gap-4 text-sm text-salesforce-gray">
          <span>16 concepts</span>
          <span>•</span>
          <span>~5 min per concept</span>
          <span>•</span>
          <span>Interview-focused</span>
        </div>
      </div>

      {/* Concept List */}
      <div className="space-y-4">
        {concepts.map((concept) => (
          <ConceptCard
            key={concept.id}
            concept={concept}
            isExpanded={expandedConcepts.has(concept.id)}
            onToggle={() => toggleConcept(concept.id)}
          />
        ))}
      </div>

      {/* Coming Soon Notice */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
        <p className="text-salesforce-gray">
          More concepts coming soon. Three concepts are fully implemented: Pure vs Impure Functions, Promises, and Async/Await.
        </p>
      </div>
    </div>
  )
}

export default FrontendJavaScriptFundamentals
