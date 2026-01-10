export const definitions = [
  {
    category: 'Salesforce - Data & Queries',
    categoryId: 'salesforce-data',
    icon: '💾',
    terms: [
      {
        term: 'LDV',
        abbreviation: 'Large Data Volumes',
        definition: 'LDV refers to Salesforce orgs with 50K+ records per object or 1M+ total records. Requires special optimization strategies for queries, data access, and storage.',
        relatedTerms: ['SOQL', 'Indexes', 'Governor Limits', 'Data Skew']
      },
      {
        term: 'SOQL',
        abbreviation: 'Salesforce Object Query Language',
        definition: 'SOQL is the query language used to retrieve records from Salesforce databases. It is similar to SQL but operates only on Salesforce data. Must be selective (use indexed fields) for LDV scenarios.',
        relatedTerms: ['SOSL', 'DML', 'Governor Limits', 'Indexes']
      },
      {
        term: 'SOSL',
        abbreviation: 'Salesforce Object Search Language',
        definition: 'SOSL is used for full-text search across multiple Salesforce objects. More efficient than SOQL for text searches in LDV scenarios.',
        relatedTerms: ['SOQL', 'Full-Text Search']
      },
      {
        term: 'DML',
        abbreviation: 'Data Manipulation Language',
        definition: 'DML operations in Salesforce include INSERT, UPDATE, UPSERT, DELETE, and UNDELETE. Subject to governor limits (150 DML statements per transaction, 10K records per operation).',
        relatedTerms: ['SOQL', 'Governor Limits', 'Bulk Operations']
      },
      {
        term: 'Governor Limits',
        abbreviation: null,
        definition: 'Salesforce platform limits that prevent runaway code. Key limits: 100 SOQL queries per transaction, 150 DML statements, 50K SOQL rows, 10K DML records, 6MB heap (sync), 12MB heap (async), 10s CPU (sync), 60s CPU (async).',
        relatedTerms: ['SOQL', 'DML', 'Heap', 'CPU Time']
      },
      {
        term: 'Data Skew',
        abbreviation: null,
        definition: 'Occurs when a small number of parent records have a disproportionate number of child records. Causes sharing calculation bottlenecks, lock contention during DML, and query timeouts.',
        relatedTerms: ['LDV', 'Lock Contention', 'Sharing', 'Account Data Skew']
      },
      {
        term: 'Account Data Skew',
        abbreviation: null,
        definition: 'Specific form of data skew where a single Account has 10K+ Contacts/Opportunities. Solutions include creating "bucket" Accounts or using custom junction object patterns.',
        relatedTerms: ['Data Skew', 'Lock Contention']
      },
      {
        term: 'Lock Contention',
        abbreviation: null,
        definition: 'Occurs when multiple transactions try to modify the same record simultaneously. Data skew increases lock contention, causing DML operations to fail with "UNABLE_TO_LOCK_ROW" errors.',
        relatedTerms: ['Data Skew', 'DML', 'Concurrency']
      },
      {
        term: 'Selective Query',
        abbreviation: null,
        definition: 'A SOQL query that uses indexed fields in WHERE clauses and returns a small percentage of records. Essential for LDV performance. Non-selective queries can cause timeouts.',
        relatedTerms: ['SOQL', 'Indexes', 'LDV']
      },
      {
        term: 'Indexed Fields',
        abbreviation: null,
        definition: 'Fields that Salesforce automatically indexes for query optimization. Includes standard fields (Id, Name, CreatedDate, etc.), custom fields with External IDs, and formula fields with functions.',
        relatedTerms: ['SOQL', 'Selective Query', 'LDV']
      }
    ]
  },
  {
    category: 'Salesforce - Architecture & Design',
    categoryId: 'salesforce-architecture',
    icon: '🏗️',
    terms: [
      {
        term: 'Sharing Rules',
        abbreviation: null,
        definition: 'Automated rules that extend record access to users based on criteria. Prefer sharing rules over manual sharing for skewed data to avoid sharing recalculation bottlenecks.',
        relatedTerms: ['Data Skew', 'Sharing Recalculation', 'Manual Sharing']
      },
      {
        term: 'Sharing Recalculation',
        abbreviation: null,
        definition: 'Process where Salesforce recalculates record-level access when ownership or sharing changes. Can become a bottleneck with data skew, especially when child records are modified.',
        relatedTerms: ['Data Skew', 'Sharing Rules', 'Owner-Based Sharing']
      },
      {
        term: 'Batch Apex',
        abbreviation: null,
        definition: 'Asynchronous Apex class that processes large volumes of data in batches. Allows processing up to 50 million records. Essential for LDV operations that exceed transaction limits.',
        relatedTerms: ['Governor Limits', 'Async Processing', 'LDV']
      },
      {
        term: 'Queueable',
        abbreviation: null,
        definition: 'Asynchronous Apex interface that allows chaining jobs. Better than @future methods for complex async processing. Can chain up to 50 queueable jobs.',
        relatedTerms: ['@future', 'Async Processing', 'Governor Limits']
      },
      {
        term: '@future',
        abbreviation: null,
        definition: 'Apex annotation that runs methods asynchronously. Limited to 50 calls per transaction. Consider Queueable or Batch Apex for more complex scenarios.',
        relatedTerms: ['Queueable', 'Async Processing', 'Governor Limits']
      },
      {
        term: 'Database.queryLocator',
        abbreviation: null,
        definition: 'Used in Batch Apex to query large result sets efficiently. Returns a query locator that processes records in batches without loading all records into memory.',
        relatedTerms: ['Batch Apex', 'LDV', 'SOQL']
      },
      {
        term: 'Pagination',
        abbreviation: null,
        definition: 'Technique for processing large datasets in smaller chunks. Use OFFSET/LIMIT in SOQL or Batch Apex for LDV scenarios. Avoid OFFSET with large numbers (performance degrades).',
        relatedTerms: ['SOQL', 'LDV', 'Batch Apex']
      }
    ]
  },
  {
    category: 'Frontend - Performance & Metrics',
    categoryId: 'frontend-performance',
    icon: '⚡',
    terms: [
      {
        term: 'INP',
        abbreviation: 'Interaction to Next Paint',
        definition: 'Core Web Vital that measures responsiveness - time from user interaction to next paint. Target: <200ms. Replaced FID in 2024. Measures ALL interactions, not just the first.',
        relatedTerms: ['FID', 'Core Web Vitals', 'Responsiveness', 'LCP', 'CLS']
      },
      {
        term: 'FID',
        abbreviation: 'First Input Delay',
        definition: 'Previous Core Web Vital that measured only the FIRST user interaction delay. Replaced by INP in 2024 as it provides a more comprehensive view of real-world UX.',
        relatedTerms: ['INP', 'Core Web Vitals', 'Responsiveness']
      },
      {
        term: 'LCP',
        abbreviation: 'Largest Contentful Paint',
        definition: 'Core Web Vital measuring loading performance. Time from navigation to when the largest content element is rendered. Target: <2.5s.',
        relatedTerms: ['INP', 'CLS', 'Core Web Vitals', 'Loading Performance']
      },
      {
        term: 'CLS',
        abbreviation: 'Cumulative Layout Shift',
        definition: 'Core Web Vital measuring visual stability. Quantifies unexpected layout shifts during page load. Target: <0.1.',
        relatedTerms: ['LCP', 'INP', 'Core Web Vitals', 'Visual Stability']
      },
      {
        term: 'Core Web Vitals',
        abbreviation: null,
        definition: 'Google\'s set of metrics for measuring user experience: LCP (loading), INP (interactivity), CLS (visual stability). These metrics impact SEO rankings.',
        relatedTerms: ['LCP', 'INP', 'CLS', 'FID']
      },
      {
        term: 'Debouncing',
        abbreviation: null,
        definition: 'Technique to limit function execution rate. Delays function execution until after a specified time period has passed since the last invocation. Useful for search inputs, resize handlers.',
        relatedTerms: ['Throttling', 'Event Handlers', 'Performance']
      },
      {
        term: 'Throttling',
        abbreviation: null,
        definition: 'Technique to limit function execution rate. Ensures function executes at most once per specified time interval. Useful for scroll handlers, mousemove events.',
        relatedTerms: ['Debouncing', 'Event Handlers', 'Performance']
      },
      {
        term: 'Passive Event Listeners',
        abbreviation: null,
        definition: 'Event listeners that declare they will not call preventDefault(). Allows browser to optimize scrolling performance by not blocking on touch/wheel events.',
        relatedTerms: ['Event Handlers', 'Performance', 'Scrolling']
      }
    ]
  },
  {
    category: 'Frontend - JavaScript',
    categoryId: 'frontend-javascript',
    icon: '📜',
    terms: [
      {
        term: 'Closure',
        abbreviation: null,
        definition: 'A function that has access to variables in its outer (enclosing) lexical scope, even after the outer function has returned. Enables data privacy, function factories, and module patterns.',
        relatedTerms: ['Lexical Scope', 'Scope Chain', 'Higher-Order Functions']
      },
      {
        term: 'Event Loop',
        abbreviation: null,
        definition: 'JavaScript runtime mechanism that handles asynchronous operations. Continuously checks call stack and task queues. Order: 1) Execute sync code, 2) Process microtasks (Promises), 3) Process macrotasks (setTimeout, I/O).',
        relatedTerms: ['Call Stack', 'Microtasks', 'Macrotasks', 'Async']
      },
      {
        term: 'Microtasks',
        abbreviation: null,
        definition: 'High-priority async tasks (Promises, queueMicrotask) that execute before macrotasks. Processed after each macrotask completes, before the next macrotask starts.',
        relatedTerms: ['Event Loop', 'Macrotasks', 'Promises']
      },
      {
        term: 'Macrotasks',
        abbreviation: null,
        definition: 'Lower-priority async tasks (setTimeout, setInterval, I/O) that execute after microtasks complete. Processed one at a time from the task queue.',
        relatedTerms: ['Event Loop', 'Microtasks', 'setTimeout']
      },
      {
        term: 'Hoisting',
        abbreviation: null,
        definition: 'JavaScript behavior of moving declarations to the top of their scope. `var` declarations are hoisted and initialized as `undefined`. `let` and `const` are hoisted but remain in Temporal Dead Zone until declaration line.',
        relatedTerms: ['var', 'let', 'const', 'Temporal Dead Zone']
      },
      {
        term: 'Temporal Dead Zone (TDZ)',
        abbreviation: null,
        definition: 'Period between entering scope and variable declaration where accessing `let` or `const` variables throws ReferenceError. Variables are hoisted but not accessible until declared.',
        relatedTerms: ['Hoisting', 'let', 'const', 'var']
      },
      {
        term: 'Promise',
        abbreviation: null,
        definition: 'Object representing eventual completion (or failure) of an async operation. States: pending, fulfilled, rejected. Enables chaining with .then() and error handling with .catch().',
        relatedTerms: ['Async', 'async/await', 'Microtasks', 'Event Loop']
      },
      {
        term: 'async/await',
        abbreviation: null,
        definition: 'Syntactic sugar over Promises that makes async code look synchronous. `async` functions return Promises. `await` pauses execution until Promise resolves. Enables try/catch error handling.',
        relatedTerms: ['Promise', 'Async', 'Error Handling']
      },
      {
        term: 'Scope Chain',
        abbreviation: null,
        definition: 'Hierarchy of scopes from current scope to global scope. JavaScript searches up the chain to find variable declarations. Enables closures and lexical scoping.',
        relatedTerms: ['Closure', 'Lexical Scope', 'Scope']
      },
      {
        term: 'Lexical Scope',
        abbreviation: null,
        definition: 'Scope determined by where variables and functions are written in code (static), not where they are called (dynamic). JavaScript uses lexical scoping.',
        relatedTerms: ['Closure', 'Scope Chain', 'Static vs Dynamic Scope']
      }
    ]
  },
  {
    category: 'Frontend - CSS & Layout',
    categoryId: 'frontend-css',
    icon: '🎨',
    terms: [
      {
        term: 'CSS Grid',
        abbreviation: null,
        definition: 'Two-dimensional layout system for creating grid-based layouts. Use `display: grid` with `grid-template-columns` and `grid-template-rows`. Ideal for calendar layouts, complex responsive designs.',
        relatedTerms: ['Flexbox', 'Layout', 'Responsive Design']
      },
      {
        term: 'Flexbox',
        abbreviation: 'Flexible Box Layout',
        definition: 'One-dimensional layout system for distributing space and aligning items in a container. Use `display: flex`. Ideal for navigation bars, card layouts, centering content.',
        relatedTerms: ['CSS Grid', 'Layout', 'Responsive Design']
      },
      {
        term: 'grid-template-columns',
        abbreviation: null,
        definition: 'CSS Grid property that defines the number and size of columns. Common values: `repeat(7, 1fr)` for 7 equal columns, `repeat(auto-fit, minmax(200px, 1fr))` for responsive columns.',
        relatedTerms: ['CSS Grid', 'Responsive Design']
      },
      {
        term: 'grid-column',
        abbreviation: null,
        definition: 'CSS Grid shorthand property for positioning items. Defines start and end column lines: `grid-column: 1 / 3` spans columns 1-2. Used for spanning multi-day events in calendars.',
        relatedTerms: ['CSS Grid', 'Layout']
      },
      {
        term: 'z-index',
        abbreviation: null,
        definition: 'CSS property controlling stacking order of positioned elements. Higher values appear on top. Only works on positioned elements (relative, absolute, fixed, sticky).',
        relatedTerms: ['CSS', 'Positioning', 'Layering']
      },
      {
        term: 'grid-auto-flow',
        abbreviation: null,
        definition: 'CSS Grid property controlling how auto-placed items are inserted. Values: `row` (default), `column`, `dense`. `dense` fills gaps by backtracking to place smaller items.',
        relatedTerms: ['CSS Grid', 'Auto-placement']
      }
    ]
  },
  {
    category: 'Frontend - React & Modern Patterns',
    categoryId: 'frontend-react',
    icon: '⚛️',
    terms: [
      {
        term: 'Hooks',
        abbreviation: null,
        definition: 'React functions that let you use state and lifecycle features in functional components. Common hooks: useState, useEffect, useContext, useCallback, useMemo, useRef.',
        relatedTerms: ['React', 'Functional Components', 'State Management']
      },
      {
        term: 'useState',
        abbreviation: null,
        definition: 'React Hook that adds state to functional components. Returns [state, setState]. State updates trigger re-renders. Functional updates recommended for derived state.',
        relatedTerms: ['Hooks', 'React', 'State']
      },
      {
        term: 'useEffect',
        abbreviation: null,
        definition: 'React Hook for side effects (data fetching, subscriptions, DOM manipulation). Runs after render. Can return cleanup function. Dependency array controls when effect runs.',
        relatedTerms: ['Hooks', 'React', 'Side Effects', 'Lifecycle']
      },
      {
        term: 'useCallback',
        abbreviation: null,
        definition: 'React Hook that memoizes functions. Returns memoized callback that only changes if dependencies change. Prevents unnecessary re-renders of child components.',
        relatedTerms: ['Hooks', 'React', 'Performance', 'Memoization']
      },
      {
        term: 'useMemo',
        abbreviation: null,
        definition: 'React Hook that memoizes expensive computations. Returns memoized value that only recalculates when dependencies change. Use for expensive calculations, not all values.',
        relatedTerms: ['Hooks', 'React', 'Performance', 'Memoization']
      },
      {
        term: 'Virtual DOM',
        abbreviation: null,
        definition: 'React\'s in-memory representation of the real DOM. React compares virtual DOM trees (diffing) and updates only changed nodes (reconciliation). Enables efficient updates.',
        relatedTerms: ['React', 'DOM', 'Performance', 'Reconciliation']
      },
      {
        term: 'Reconciliation',
        abbreviation: null,
        definition: 'React\'s process of comparing previous and current virtual DOM trees and updating the real DOM efficiently. Uses keys for list optimization. Minimizes DOM manipulations.',
        relatedTerms: ['React', 'Virtual DOM', 'Performance', 'Keys']
      }
    ]
  }
]

export const getDefinitionByTerm = (term) => {
  for (const category of definitions) {
    const found = category.terms.find(t => t.term === term || t.abbreviation === term)
    if (found) return found
  }
  return null
}

export const searchDefinitions = (query) => {
  const lowerQuery = query.toLowerCase()
  const results = []
  
  for (const category of definitions) {
    const matchingTerms = category.terms.filter(term => {
      const termMatch = term.term.toLowerCase().includes(lowerQuery)
      const abbrevMatch = term.abbreviation?.toLowerCase().includes(lowerQuery)
      const defMatch = term.definition.toLowerCase().includes(lowerQuery)
      return termMatch || abbrevMatch || defMatch
    })
    
    if (matchingTerms.length > 0) {
      results.push({
        ...category,
        terms: matchingTerms
      })
    }
  }
  
  return results
}
