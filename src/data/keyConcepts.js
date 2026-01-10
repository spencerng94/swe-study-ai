export const keyConcepts = [
  {
    category: 'JavaScript Fundamentals',
    categoryId: 'js-fundamentals',
    icon: '📜',
    concepts: [
      {
        id: 'event-loop',
        title: 'JavaScript Event Loop',
        description: 'The event loop is the mechanism that allows JavaScript to perform non-blocking operations despite being single-threaded. It continuously checks the call stack and task queues, moving tasks from queues to the stack when the stack is empty.',
        detailedExplanation: `JavaScript's event loop ensures that while JavaScript is single-threaded, it can handle asynchronous operations efficiently. The event loop continuously monitors:
        
1. **Call Stack**: Where synchronous code executes
2. **Microtask Queue**: High-priority tasks (Promises, queueMicrotask)
3. **Macrotask Queue**: Lower-priority tasks (setTimeout, setInterval, I/O)

**Execution Order**:
- Execute all synchronous code from call stack
- Process ALL microtasks before any macrotask
- Process one macrotask
- Repeat`,
        diagram: `
┌─────────────────────────────────────────┐
│          JavaScript Runtime             │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────┐    ┌──────────────┐  │
│  │ Call Stack  │    │   Web APIs   │  │
│  │             │    │ (setTimeout, │  │
│  │ [sync code] │    │   DOM, I/O)  │  │
│  └──────┬──────┘    └──────┬───────┘  │
│         │                  │           │
│         │                  │ callback  │
│         │                  ▼           │
│         │          ┌──────────────┐   │
│         │          │ Microtask    │   │
│         │          │ Queue        │   │
│         │          │ [Promises]   │   │
│         │          └──────┬───────┘   │
│         │                 │           │
│         │                 │ callback  │
│         │                 ▼           │
│         │          ┌──────────────┐   │
│         │          │ Macrotask    │   │
│         │          │ Queue        │   │
│         │          │ [setTimeout] │   │
│         │          └──────┬───────┘   │
│         │                 │           │
│         │      Event Loop │           │
│         └─────────────────┘           │
│                                       │
│  Priority: Call Stack > Microtasks > │
│             Macrotasks                │
└───────────────────────────────────────┘`,
        codeExample: `
console.log('1'); // Sync

setTimeout(() => console.log('2'), 0); // Macrotask

Promise.resolve().then(() => console.log('3')); // Microtask

console.log('4'); // Sync

// Output: 1, 4, 3, 2
// Sync code runs first, then ALL microtasks,
// then macrotasks`,
        keyPoints: [
          'Single-threaded: Only one operation at a time',
          'Non-blocking: Async operations don\'t block execution',
          'Microtasks have higher priority than macrotasks',
          'Event loop ensures continuous execution flow'
        ],
        useCases: [
          'Understanding async/await behavior',
          'Debugging Promise timing issues',
          'Optimizing code execution order',
          'Understanding why setTimeout(0) doesn\'t execute immediately'
        ]
      },
      {
        id: 'closures',
        title: 'Closures',
        description: 'A closure is a function that has access to variables in its outer (enclosing) lexical scope, even after the outer function has returned.',
        detailedExplanation: `Closures are created when a function is defined inside another function and the inner function references variables from the outer scope. The inner function "closes over" these variables, preserving them even after the outer function completes execution.

**Key Characteristics**:
- Inner function has access to outer function's variables
- Variables persist even after outer function returns
- Each closure has its own copy of variables
- Enables data privacy and function factories`,
        codeExample: `
function outerFunction(x) {
  // Outer function's variable
  let outerVar = x;
  
  // Inner function forms a closure
  function innerFunction(y) {
    console.log(outerVar + y); // Accesses outerVar
  }
  
  return innerFunction;
}

const closure = outerFunction(10);
closure(5); // Output: 15

// outerVar is still accessible even though
// outerFunction has completed execution`,
        keyPoints: [
          'Functions "remember" their lexical scope',
          'Enables data privacy (module pattern)',
          'Each closure has independent variable copies',
          'Common in callbacks and event handlers'
        ],
        useCases: [
          'Creating private variables',
          'Function factories',
          'Memoization',
          'Event handlers with persistent state'
        ]
      },
      {
        id: 'promises-async',
        title: 'Promises & Async/Await',
        description: 'Promises represent eventual completion of async operations. Async/await provides syntactic sugar for working with Promises.',
        detailedExplanation: `**Promises** have three states:
- **Pending**: Initial state, operation not complete
- **Fulfilled**: Operation completed successfully
- **Rejected**: Operation failed

**Promise Chain**:
\`.then()\` handles fulfillment
\`.catch()\` handles rejection
\`.finally()\` always executes

**Async/Await** makes async code look synchronous:
- \`async\` functions return Promises
- \`await\` pauses execution until Promise resolves
- Enables try/catch error handling`,
        codeExample: `
// Promise Chain
fetch('/api/data')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error));

// Async/Await (cleaner)
async function fetchData() {
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}`,
        keyPoints: [
          'Promises are microtasks (high priority)',
          'Async/await is syntactic sugar over Promises',
          'Use try/catch with async/await for errors',
          'Promise.all() runs promises in parallel'
        ],
        useCases: [
          'API calls',
          'File operations',
          'Database queries',
          'Any asynchronous operation'
        ]
      }
    ]
  },
  {
    category: 'System Design',
    categoryId: 'system-design',
    icon: '🏗️',
    concepts: [
      {
        id: 'database-sharding',
        title: 'Database Sharding',
        description: 'Sharding is a database architecture pattern that splits data horizontally across multiple databases (shards) to improve performance and scalability.',
        detailedExplanation: `**Horizontal Partitioning**: Data is split by rows, not columns. Each shard contains a subset of data.

**Sharding Strategies**:
1. **Range-based**: Partition by value ranges (e.g., user IDs 1-1000 → shard 1)
2. **Hash-based**: Partition by hash function (consistent hashing)
3. **Directory-based**: Lookup table maps data to shards

**Benefits**:
- Distributes load across multiple servers
- Improves query performance (smaller datasets)
- Enables horizontal scaling

**Challenges**:
- Cross-shard queries are complex
- Rebalancing when adding/removing shards
- Maintaining referential integrity`,
        diagram: `
┌─────────────────────────────────────────┐
│           Application Layer             │
└──────────────────┬──────────────────────┘
                   │
         ┌─────────┴─────────┐
         │  Sharding Router  │
         │ (Determines Shard)│
         └─────────┬─────────┘
                   │
    ┌──────────────┼──────────────┐
    │              │              │
┌───▼───┐    ┌────▼────┐    ┌───▼───┐
│Shard 1│    │Shard 2  │    │Shard 3│
│Users  │    │Users    │    │Users  │
│1-1K   │    │1K-2K    │    │2K-3K  │
└───────┘    └─────────┘    └───────┘`,
        keyPoints: [
          'Horizontal data partitioning',
          'Each shard is independent',
          'Sharding key determines distribution',
          'Requires careful planning for queries'
        ],
        useCases: [
          'Large-scale user databases',
          'Time-series data (by date ranges)',
          'Geographic data (by region)',
          'E-commerce product catalogs'
        ],
        challenges: [
          'Cross-shard joins are expensive',
          'Resharding requires careful planning',
          'Hot shards can cause bottlenecks',
          'Consistency across shards'
        ]
      },
      {
        id: 'load-balancing',
        title: 'Load Balancing',
        description: 'Load balancing distributes incoming network traffic across multiple servers to ensure no single server is overwhelmed.',
        detailedExplanation: `**Types of Load Balancers**:

1. **Application Load Balancer (Layer 7)**:
   - Routes based on HTTP/HTTPS content
   - Can route based on URL path, headers
   - SSL termination

2. **Network Load Balancer (Layer 4)**:
   - Routes based on IP and port
   - Lower latency, high performance
   - TCP/UDP traffic

**Load Balancing Algorithms**:
- **Round Robin**: Distribute sequentially
- **Least Connections**: Route to server with fewest active connections
- **IP Hash**: Route based on client IP (session affinity)
- **Weighted**: Assign different capacities to servers`,
        diagram: `
┌──────────┐
│  Client  │
└────┬─────┘
     │
     ▼
┌──────────────────┐
│  Load Balancer   │
│  (Round Robin)   │
└────────┬─────────┘
     │
     ├─────────────┬──────────────┐
     ▼             ▼              ▼
┌────────┐   ┌────────┐    ┌────────┐
│Server 1│   │Server 2│    │Server 3│
│  33%   │   │  33%   │    │  33%   │
└────────┘   └────────┘    └────────┘`,
        keyPoints: [
          'Distributes traffic evenly',
          'Improves availability (removes failed servers)',
          'Enables horizontal scaling',
          'Session affinity for stateful apps'
        ],
        useCases: [
          'High-traffic web applications',
          'API servers',
          'Database read replicas',
          'Content delivery'
        ]
      },
      {
        id: 'caching',
        title: 'Caching Strategies',
        description: 'Caching stores frequently accessed data in fast storage to reduce latency and database load.',
        detailedExplanation: `**Cache Levels**:

1. **Application Cache**: In-memory (Redis, Memcached)
2. **CDN Cache**: Geographic distribution
3. **Browser Cache**: Client-side storage

**Caching Strategies**:

1. **Cache-Aside (Lazy Loading)**:
   - App checks cache first
   - If miss, fetch from DB, then cache
   - App manages cache population

2. **Write-Through**:
   - Write to cache and DB simultaneously
   - Always consistent, but slower writes

3. **Write-Back**:
   - Write to cache immediately
   - Write to DB asynchronously
   - Faster writes, risk of data loss

4. **Refresh-Ahead**:
   - Proactively refresh before expiration`,
        diagram: `
┌──────────┐
│   App    │
└────┬─────┘
     │
     ├─────────┐
     │         │
     ▼         ▼
┌────────┐  ┌──────┐
│ Cache  │  │  DB  │
│ (Fast) │  │(Slow)│
└────────┘  └──────┘

Cache-Aside Flow:
1. Check Cache → Miss
2. Query DB
3. Store in Cache
4. Return Data`,
        keyPoints: [
          'Reduces database load',
          'Improves response times',
          'Cache invalidation is critical',
          'TTL (Time To Live) prevents stale data'
        ],
        useCases: [
          'Frequently accessed data',
          'Expensive computations',
          'Session data',
          'API responses'
        ]
      },
      {
        id: 'message-queues',
        title: 'Message Queues',
        description: 'Message queues enable asynchronous communication between services, decoupling producers and consumers.',
        detailedExplanation: `**Components**:
- **Producer**: Sends messages to queue
- **Queue**: Buffer storing messages
- **Consumer**: Processes messages from queue

**Benefits**:
- Decouples services (producer doesn't wait for consumer)
- Handles traffic spikes (messages queue up)
- Enables reliable delivery
- Scales producers and consumers independently

**Use Cases**:
- Task queues (background jobs)
- Event-driven architecture
- Service communication
- Email notifications

**Popular Tools**: RabbitMQ, Apache Kafka, AWS SQS`,
        diagram: `
┌──────────┐
│Producer 1│──┐
└──────────┘  │
              │
┌──────────┐  │    ┌──────────┐
│Producer 2│──┼───▶│  Queue   │
└──────────┘  │    │          │
              │    │ [msg1]   │
┌──────────┐  │    │ [msg2]   │
│Producer 3│──┘    │ [msg3]   │
└──────────┘       └────┬─────┘
                        │
         ┌──────────────┼──────────────┐
         │              │              │
         ▼              ▼              ▼
    ┌────────┐    ┌────────┐    ┌────────┐
    │Consumer│    │Consumer│    │Consumer│
    │   1    │    │   2    │    │   3    │
    └────────┘    └────────┘    └────────┘`,
        keyPoints: [
          'Asynchronous communication',
          'Decouples services',
          'Handles traffic spikes',
          'At-least-once or exactly-once delivery'
        ],
        useCases: [
          'Background job processing',
          'Event streaming',
          'Microservice communication',
          'Notification systems'
        ]
      }
    ]
  },
  {
    category: 'Frontend Performance',
    categoryId: 'frontend-performance',
    icon: '⚡',
    concepts: [
      {
        id: 'lazy-loading',
        title: 'Lazy Loading',
        description: 'Lazy loading defers loading of non-critical resources until they are needed, improving initial page load performance.',
        detailedExplanation: `**Types of Lazy Loading**:

1. **Image Lazy Loading**:
   - Load images only when entering viewport
   - Use \`loading="lazy"\` attribute or Intersection Observer
   - Reduces initial bandwidth

2. **Code Splitting**:
   - Split JavaScript bundles
   - Load components on-demand
   - React.lazy(), dynamic imports

3. **Route-based Lazy Loading**:
   - Load routes when navigated to
   - Reduces initial bundle size

**Benefits**:
- Faster initial page load
- Reduced bandwidth usage
- Better user experience on slow connections
- Lower server costs`,
        codeExample: `
// React Lazy Loading
const LazyComponent = React.lazy(() => import('./LazyComponent'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LazyComponent />
    </Suspense>
  );
}

// Image Lazy Loading
<img 
  src="image.jpg" 
  loading="lazy" 
  alt="Description"
/>`,
        keyPoints: [
          'Defer non-critical resources',
          'Improves initial load time',
          'Use Intersection Observer API',
          'Code splitting reduces bundle size'
        ],
        useCases: [
          'Large image galleries',
          'Below-the-fold content',
          'Heavy JavaScript libraries',
          'Route-based code splitting'
        ]
      },
      {
        id: 'code-splitting',
        title: 'Code Splitting',
        description: 'Code splitting divides JavaScript bundles into smaller chunks that can be loaded on-demand, reducing initial bundle size.',
        detailedExplanation: `**Strategies**:

1. **Entry Point Splitting**:
   - Split by entry points (different pages)
   - Each route gets its own bundle

2. **Dynamic Imports**:
   - Load modules only when needed
   - \`import()\` returns a Promise

3. **Component-based Splitting**:
   - Split by components
   - React.lazy() for components

**Webpack Configuration**:
- Automatic splitting by entry points
- Manual splitting with SplitChunksPlugin
- Dynamic imports create separate chunks`,
        codeExample: `
// Dynamic Import
const loadModule = async () => {
  const module = await import('./heavy-module.js');
  module.doSomething();
};

// React Code Splitting
const Dashboard = React.lazy(() => import('./Dashboard'));
const Profile = React.lazy(() => import('./Profile'));

// Webpack automatic splitting
// Multiple entry points = multiple bundles`,
        diagram: `
Before Code Splitting:
┌────────────────────────┐
│   main.bundle.js       │
│   (2MB - slow load)    │
└────────────────────────┘

After Code Splitting:
┌──────────┐  ┌──────────┐  ┌──────────┐
│main.js   │  │route1.js │  │route2.js │
│(200KB)   │  │(500KB)   │  │(500KB)   │
└──────────┘  └──────────┘  └──────────┘
  Load first    Load on      Load on
              navigation   navigation`,
        keyPoints: [
          'Reduces initial bundle size',
          'Load chunks on-demand',
          'Improves Time to Interactive',
          'Webpack/Vite handle splitting automatically'
        ],
        useCases: [
          'Large React applications',
          'Admin panels with many routes',
          'Third-party libraries',
          'Feature flags'
        ]
      },
      {
        id: 'virtual-scrolling',
        title: 'Virtual Scrolling',
        description: 'Virtual scrolling renders only visible items in a long list, dramatically improving performance for large datasets.',
        detailedExplanation: `**How It Works**:
- Calculate visible viewport height
- Determine how many items fit
- Render only visible items + buffer
- Update as user scrolls

**Benefits**:
- Constant performance regardless of list size
- Reduced DOM nodes
- Lower memory usage
- Smooth scrolling

**Implementation**:
- Track scroll position
- Calculate visible range
- Render items in range
- Maintain scroll position`,
        diagram: `
┌──────────────────────────────┐
│      Viewport (500px)        │
│  ┌────────────────────────┐  │
│  │ Item 100 (rendered)    │  │
│  │ Item 101 (rendered)    │  │
│  │ Item 102 (rendered)    │  │
│  │ ...                    │  │
│  │ Item 110 (rendered)    │  │
│  └────────────────────────┘  │
│                              │
│  [10,000 total items]        │
│  [Only 10-20 rendered]       │
└──────────────────────────────┘`,
        keyPoints: [
          'Renders only visible items',
          'Performance independent of list size',
          'Requires item height calculation',
          'Popular libraries: react-window, react-virtualized'
        ],
        useCases: [
          'Long lists (1000+ items)',
          'Tables with many rows',
          'Infinite scroll',
          'Chat message history'
        ]
      }
    ]
  },
  {
    category: 'React Patterns',
    categoryId: 'react-patterns',
    icon: '⚛️',
    concepts: [
      {
        id: 'render-optimization',
        title: 'Render Optimization',
        description: 'Techniques to prevent unnecessary re-renders in React, improving application performance.',
        detailedExplanation: `**Causes of Unnecessary Renders**:
- State changes trigger component tree re-renders
- New object/array references in props
- Inline function definitions
- Context value changes

**Optimization Techniques**:

1. **React.memo()**: Prevents re-render if props haven't changed
2. **useMemo()**: Memoizes expensive computations
3. **useCallback()**: Memoizes functions
4. **Code Splitting**: Reduce bundle size
5. **React.lazy()**: Lazy load components`,
        codeExample: `
// React.memo - skip re-render
const ExpensiveComponent = React.memo(({ data }) => {
  return <div>{/* expensive render */}</div>;
});

// useMemo - memoize computation
const expensiveValue = useMemo(() => {
  return heavyComputation(data);
}, [data]);

// useCallback - memoize function
const handleClick = useCallback(() => {
  doSomething(id);
}, [id]);`,
        keyPoints: [
          'React.memo for component memoization',
          'useMemo for expensive calculations',
          'useCallback for function references',
          'Avoid creating new objects/arrays in render'
        ],
        useCases: [
          'Large component trees',
          'Expensive computations',
          'Lists with many items',
          'Components receiving stable props'
        ]
      },
      {
        id: 'state-management',
        title: 'State Management Patterns',
        description: 'Strategies for managing application state in React, from local state to global state management.',
        detailedExplanation: `**State Management Options**:

1. **Local State (useState)**:
   - Component-scoped state
   - Simple, no external dependencies
   - Use for UI-specific state

2. **Lifted State**:
   - Share state between siblings via parent
   - Props drilling can become cumbersome
   - Good for simple cases

3. **Context API**:
   - Share state across component tree
   - Avoids props drilling
   - Can cause unnecessary re-renders

4. **External State Libraries**:
   - Redux, Zustand, Recoil
   - Predictable state updates
   - DevTools, time-travel debugging`,
        diagram: `
Local State:
┌──────────┐
│Component │─── useState()
└──────────┘

Lifted State:
┌──────────┐
│  Parent  │─── useState()
└────┬─────┘
     │ props
┌────┴─────┐
│ Child 1  │  │ Child 2  │
└──────────┘  └──────────┘

Context:
┌──────────┐
│ Provider │─── Context
└────┬─────┘
     │
┌────┴─────┐
│ Consumer │
└──────────┘`,
        keyPoints: [
          'Choose based on scope and complexity',
          'Local state for UI-only concerns',
          'Context for shared app state',
          'Redux for complex state logic'
        ],
        useCases: [
          'Form inputs → useState',
          'Theme preferences → Context',
          'User authentication → Context/Redux',
          'Shopping cart → Redux/Zustand'
        ]
      }
    ]
  },
  {
    category: 'Database Concepts',
    categoryId: 'database',
    icon: '💾',
    concepts: [
      {
        id: 'indexing',
        title: 'Database Indexing',
        description: 'Indexes are data structures that improve the speed of data retrieval operations on database tables.',
        detailedExplanation: `**How Indexes Work**:
- Create a separate data structure pointing to table rows
- Like an index in a book - find page number quickly
- B-tree is common index structure

**Types of Indexes**:
1. **Primary Index**: Automatically created on primary key
2. **Secondary Index**: Created on non-primary columns
3. **Composite Index**: Multiple columns
4. **Clustered Index**: Determines physical order
5. **Non-clustered Index**: Separate structure

**Trade-offs**:
- ✅ Faster SELECT queries
- ✅ Faster JOINs and WHERE clauses
- ❌ Slower INSERT/UPDATE/DELETE
- ❌ Additional storage space`,
        diagram: `
Without Index:
┌──────────┐
│   Table  │
│  [Scan]  │─── Full table scan (slow)
└──────────┘

With Index:
┌──────────┐      ┌──────────┐
│  Index   │      │   Table  │
│  (B-Tree)│───▶  │  [Jump]  │
│  id→row  │      │  Direct  │
└──────────┘      └──────────┘
  Quick lookup      Fast access`,
        keyPoints: [
          'Speeds up SELECT queries',
          'Slows down writes (maintenance overhead)',
          'Use on frequently queried columns',
          'Balance between read and write performance'
        ],
        useCases: [
          'Foreign key columns',
          'Frequently filtered columns',
          'JOIN conditions',
          'ORDER BY columns'
        ]
      },
      {
        id: 'normalization',
        title: 'Database Normalization',
        description: 'Normalization is the process of organizing data to reduce redundancy and improve data integrity.',
        detailedExplanation: `**Normal Forms**:

1. **1NF (First Normal Form)**:
   - Each column contains atomic values
   - No repeating groups

2. **2NF (Second Normal Form)**:
   - In 1NF
   - All non-key attributes fully dependent on primary key

3. **3NF (Third Normal Form)**:
   - In 2NF
   - No transitive dependencies (A→B→C means A→C)

**Benefits**:
- Reduces data redundancy
- Prevents update anomalies
- Saves storage space
- Improves data integrity

**Trade-offs**:
- More tables = more JOINs
- Can impact query performance
- Sometimes denormalization needed for performance`,
        diagram: `
Unnormalized:
┌──────────────────────┐
│ Users                │
│ id, name, orders[]   │ ← Repeating groups
└──────────────────────┘

Normalized:
┌──────────┐    ┌──────────┐
│  Users   │    │  Orders  │
│ id, name │◄───│ user_id  │
└──────────┘    └──────────┘
                 1:N relation`,
        keyPoints: [
          'Eliminates data redundancy',
          'Prevents update anomalies',
          'More JOINs required',
          'Balance with performance needs'
        ],
        useCases: [
          'OLTP systems (transaction processing)',
          'Data integrity critical systems',
          'Reducing storage costs',
          'Maintaining consistency'
        ]
      }
    ]
  }
]

export const getConceptById = (id) => {
  for (const category of keyConcepts) {
    const concept = category.concepts.find(c => c.id === id)
    if (concept) return { ...concept, category: category.category }
  }
  return null
}

export const searchConcepts = (query) => {
  const lowerQuery = query.toLowerCase()
  const results = []
  
  for (const category of keyConcepts) {
    const matchingConcepts = category.concepts.filter(concept => {
      const titleMatch = concept.title.toLowerCase().includes(lowerQuery)
      const descMatch = concept.description.toLowerCase().includes(lowerQuery)
      const explMatch = concept.detailedExplanation?.toLowerCase().includes(lowerQuery)
      return titleMatch || descMatch || explMatch
    })
    
    if (matchingConcepts.length > 0) {
      results.push({
        ...category,
        concepts: matchingConcepts
      })
    }
  }
  
  return results
}
