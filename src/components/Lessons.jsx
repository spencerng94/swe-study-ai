import { useState, useEffect } from 'react'
import { BookOpen, ChevronRight, CheckCircle, Code, Lightbulb, Target, ArrowLeft } from 'lucide-react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

// Lesson data - comprehensive but concise lessons for each Study Guide topic
const lessons = {
  'database-design-schema': {
    id: 'database-design-schema',
    title: 'Database Design & Schema',
    session: 'Session 1',
    duration: '10 min read',
    sections: [
      {
        title: 'Normalization vs Denormalization',
        content: `**Normalization** reduces data redundancy by organizing data into separate tables with relationships. **Denormalization** intentionally adds redundancy to improve read performance.

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
      },
      {
        title: 'Lookup vs Master-Detail Relationships',
        content: `**Lookup Relationship:**
- Optional (child can exist without parent)
- No cascade delete
- Can be reparented
- No rollup summary fields
- Use for: Flexible, optional relationships

**Master-Detail Relationship:**
- Required (child deleted when parent deleted)
- Cascade delete
- Cannot be reparented
- Supports rollup summary fields
- Ownership determined by parent
- Use for: Strong dependencies, need rollups

**Decision Framework:**
1. Does the child make sense without the parent? → Lookup
2. Do you need rollup summaries? → Master-Detail
3. Do you need cascade delete? → Master-Detail
4. Do you need flexibility to reparent? → Lookup`,
      },
      {
        title: 'Indexing Strategies',
        content: `**Indexed Fields in Salesforce:**
- Primary keys (Id)
- Foreign keys (lookup/master-detail fields)
- Fields with external IDs
- Standard fields (Name, Email, etc.)
- Custom fields marked as "Unique" or "External ID"

**Best Practices:**
1. **Use indexed fields in WHERE clauses** - Always filter on indexed fields when possible
2. **Avoid functions on indexed fields** - WHERE UPPER(Name) = 'TEST' won't use index
3. **Combine indexed fields** - Multiple indexed filters improve selectivity
4. **Avoid null comparisons** - WHERE Field__c != null may not use index efficiently

**Query Optimization:**
\`\`\`sql
-- Good: Uses index on AccountId
SELECT Id FROM Contact WHERE AccountId = '001...'

-- Bad: Function prevents index usage
SELECT Id FROM Contact WHERE UPPER(Email) = 'TEST@EXAMPLE.COM'

-- Good: Multiple indexed fields
SELECT Id FROM Contact 
WHERE AccountId = '001...' AND Email = 'test@example.com'
\`\`\``,
      },
      {
        title: 'Data Deprecation & Archiving',
        content: `**Archiving Strategy:**
1. **Identify old data** - Set criteria (e.g., records older than 2 years)
2. **Use Big Objects** - For historical data that's rarely accessed
3. **Implement soft deletes** - Use status fields instead of hard deletes
4. **Archive to external storage** - For compliance/audit requirements

**Salesforce Big Objects:**
- Store billions of records
- Optimized for historical data
- Limited query capabilities (no joins, limited WHERE clauses)
- Use for: Audit logs, historical transactions, compliance data

**Deprecation Plan:**
1. Mark records as deprecated (status field)
2. Hide from UI but keep in database
3. Archive after retention period
4. Delete after compliance period expires`,
      },
    ],
    keyTakeaways: [
      'Normalize for integrity, denormalize for performance',
      'Master-Detail for strong dependencies, Lookup for flexibility',
      'Always filter on indexed fields in WHERE clauses',
      'Plan archiving strategy early to avoid data bloat',
    ],
  },
  'performance-optimization': {
    id: 'performance-optimization',
    title: 'Performance Optimization',
    session: 'Session 1',
    duration: '12 min read',
    sections: [
      {
        title: 'SOQL Query Optimization',
        content: `**Governor Limits:**
- 100 SOQL queries per transaction
- 50,000 rows per query
- 6MB heap (synchronous), 12MB (asynchronous)

**Optimization Techniques:**

1. **Selective Filters:**
\`\`\`sql
-- Good: Indexed field, selective
SELECT Id FROM Account WHERE Id = '001...'

-- Bad: Non-indexed, non-selective
SELECT Id FROM Account WHERE Description LIKE '%test%'
\`\`\`

2. **Limit Results:**
\`\`\`sql
-- Always use LIMIT when you know max records needed
SELECT Id FROM Contact WHERE AccountId = '001...' LIMIT 100
\`\`\`

3. **Select Only Needed Fields:**
\`\`\`sql
-- Good: Only select what you need
SELECT Id, Name FROM Account

-- Bad: SELECT * wastes resources
SELECT * FROM Account
\`\`\`

4. **Avoid SOQL in Loops:**
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
Map<Id, List<Contact>> contactsByAccount = new Map<Id, List<Contact>>();
for (Contact c : [SELECT Id, AccountId FROM Contact WHERE AccountId IN :accountIds]) {
    if (!contactsByAccount.containsKey(c.AccountId)) {
        contactsByAccount.put(c.AccountId, new List<Contact>());
    }
    contactsByAccount.get(c.AccountId).add(c);
}
\`\`\``,
      },
      {
        title: 'Pagination Strategies',
        content: `**OFFSET Pagination:**
\`\`\`sql
-- First page
SELECT Id, Name FROM Account ORDER BY Name LIMIT 200 OFFSET 0

-- Second page
SELECT Id, Name FROM Account ORDER BY Name LIMIT 200 OFFSET 200
\`\`\`
- Simple but inefficient for large offsets
- OFFSET 10000 means scanning 10,000 rows

**Cursor-Based Pagination (Better for LDV):**
\`\`\`javascript
// Use last record's field value as cursor
String lastName = null;
List<Account> accounts = [SELECT Id, Name FROM Account 
                          ORDER BY Name LIMIT 200];
if (accounts.size() == 200) {
    lastName = accounts[199].Name;
    // Next query: WHERE Name > :lastName
}
\`\`\`

**Database.queryLocator for Large Results:**
\`\`\`javascript
// In batch class
public Database.QueryLocator start(Database.BatchableContext bc) {
    return Database.getQueryLocator('SELECT Id FROM Account');
}
\`\`\``,
      },
      {
        title: 'Selective Filters & Indexes',
        content: `**Selectivity Rules:**
- Indexed fields are automatically selective
- Custom fields need to be marked as "External ID" or "Unique" to be indexed
- Formula fields with functions are NOT indexed

**Making Queries Selective:**
1. Use indexed fields in WHERE clause
2. Combine multiple indexed filters (AND)
3. Use equality (=) over inequality (!=, <, >)
4. Avoid null checks when possible

**Example:**
\`\`\`sql
-- Selective: Uses index on AccountId
SELECT Id FROM Contact WHERE AccountId = '001...'

-- Less selective: May not use index efficiently
SELECT Id FROM Contact WHERE AccountId != null
\`\`\``,
      },
      {
        title: 'Governor Limits Workarounds',
        content: `**Strategies:**

1. **Batch Processing:**
\`\`\`javascript
// Process in batches of 200
Database.executeBatch(new MyBatchClass());
\`\`\`

2. **Async Processing:**
\`\`\`javascript
// @future method for async execution
@future
public static void processAsync(Set<Id> recordIds) {
    // 12MB heap, 60s CPU time
}
\`\`\`

3. **Queueable for Chaining:**
\`\`\`javascript
public class MyQueueable implements Queueable {
    public void execute(QueueableContext qc) {
        // Process batch
        System.enqueueJob(new MyQueueable()); // Chain next batch
    }
}
\`\`\`

4. **Platform Events for Decoupling:**
\`\`\`javascript
// Publish event instead of direct processing
EventBus.publish(new MyEvent__e(Data__c = 'value'));
\`\`\``,
      },
    ],
    keyTakeaways: [
      'Always use selective filters on indexed fields',
      'Avoid SOQL in loops - bulkify queries',
      'Use cursor-based pagination for large datasets',
      'Leverage batch/async processing for governor limits',
    ],
  },
  'data-skew-concurrency': {
    id: 'data-skew-concurrency',
    title: 'Data Skew & Concurrency',
    session: 'Session 1',
    duration: '15 min read',
    sections: [
      {
        title: 'Understanding Data Skew',
        content: `**What is Data Skew?**
Data skew occurs when a small number of parent records have a disproportionate number of child records.

**Example:**
- Account A has 100,000 Contacts
- Accounts B-Z each have < 100 Contacts
- Account A causes performance issues

**Impact:**
1. **Sharing Calculation Bottlenecks** - Recalculating sharing for Account A affects all 100K contacts
2. **Lock Contention** - Multiple users updating contacts on Account A cause locks
3. **Query Timeouts** - Queries involving Account A are slow
4. **Governor Limit Issues** - Processing Account A's children hits limits

**Detection:**
\`\`\`sql
-- Find accounts with most contacts
SELECT AccountId, COUNT(Id) cnt 
FROM Contact 
GROUP BY AccountId 
ORDER BY COUNT(Id) DESC 
LIMIT 10
\`\`\``,
      },
      {
        title: 'Preventing Data Skew',
        content: `**Bucket Pattern:**
Instead of one Account with 100K contacts, create multiple "bucket" accounts:

\`\`\`javascript
// Distribute contacts across buckets
String bucketId = '001' + String.valueOf(Math.mod(contactHash, 10));
// Creates 10 bucket accounts
\`\`\`

**Best Practices:**
1. **Monitor parent-child ratios** - Set alerts for skewed relationships
2. **Use junction objects** - Break up many-to-many relationships
3. **Archive old data** - Move historical records to Big Objects
4. **Design for distribution** - Plan data model to avoid natural skew

**Sharing Strategy:**
- Use sharing rules instead of manual sharing for skewed data
- Avoid owner-based sharing for highly skewed relationships
- Use public read/write for non-sensitive skewed data`,
      },
      {
        title: 'Optimistic Locking',
        content: `**How It Works:**
1. Read record with version number (LastModifiedDate or custom field)
2. User modifies data
3. On save, check if version matches
4. If version matches → save succeeds
5. If version differs → StaleObjectException thrown

**Implementation:**
\`\`\`javascript
// Read with version
Appointment__c appt = [SELECT Id, Version__c, Status__c 
                       FROM Appointment__c WHERE Id = :apptId];

// Modify
appt.Status__c = 'Booked';

try {
    update appt; // Fails if version changed
} catch (DmlException e) {
    if (e.getMessage().contains('ENTITY_IS_DELETED') || 
        e.getMessage().contains('ENTITY_IS_LOCKED')) {
        // Retry with fresh data
        appt = [SELECT Id, Version__c, Status__c 
                FROM Appointment__c WHERE Id = :apptId];
        // Re-apply changes and retry
    }
}
\`\`\`

**Use Cases:**
- High-read, low-write scenarios
- When conflicts are rare
- Better performance (no locking overhead)`,
      },
      {
        title: 'Pessimistic Locking',
        content: `**How It Works:**
1. Use FOR UPDATE in SOQL query
2. Record is locked for the transaction
3. Other transactions wait until lock is released
4. Lock automatically released on commit/rollback

**Implementation:**
\`\`\`javascript
// Lock the record
Appointment__c appt = [SELECT Id, Status__c 
                       FROM Appointment__c 
                       WHERE Id = :apptId 
                       FOR UPDATE];

// Modify (other transactions wait)
appt.Status__c = 'Booked';
update appt;
// Lock released after commit
\`\`\`

**Use Cases:**
- Critical data integrity needs
- High-conflict scenarios
- When you need guaranteed consistency

**Trade-offs:**
- Slower (blocks other transactions)
- Can cause deadlocks if not careful
- Use sparingly`,
      },
    ],
    keyTakeaways: [
      'Data skew causes sharing, lock, and query performance issues',
      'Use bucket pattern to distribute skewed data',
      'Optimistic locking for high-read, pessimistic for high-conflict',
      'Monitor parent-child ratios to detect skew early',
    ],
  },
  'system-architecture': {
    id: 'system-architecture',
    title: 'System Architecture',
    session: 'Session 1',
    duration: '12 min read',
    sections: [
      {
        title: 'Multi-Tenant Architecture',
        content: `**Salesforce Multi-Tenancy:**
- All customers share the same infrastructure
- Data isolation through metadata and sharing model
- Governor limits ensure fair resource usage

**Design Patterns:**

1. **Org-Based Isolation:**
- Separate Salesforce org per tenant
- Highest isolation, highest cost
- Use for: Enterprise customers, compliance requirements

2. **Platform License Isolation:**
- Separate Platform License per tenant
- Good isolation, moderate cost
- Use for: Mid-market customers

3. **Data Segregation:**
- Single org with tenant identifier field
- Custom sharing rules for isolation
- Use for: SMB customers, cost-effective

**Best Practices:**
- Use namespacing for custom code
- Tenant-specific configuration objects
- Monitor governor limits per tenant
- Design data model to prevent cross-tenant access`,
      },
      {
        title: 'Real-Time vs Batch Processing',
        content: `**Real-Time Processing:**
- Immediate response required
- Use Platform Events, Change Data Capture
- Higher resource usage
- Use for: Notifications, critical updates

**Batch Processing:**
- Can be delayed (minutes/hours)
- Use Batch Apex, Scheduled Jobs
- Efficient resource usage
- Use for: Reports, data aggregation, ETL

**Decision Framework:**
1. **User waiting for response?** → Real-time
2. **Can it wait minutes/hours?** → Batch
3. **High volume?** → Batch
4. **Critical business process?** → Real-time

**Hybrid Approach:**
- Real-time for user-facing updates
- Batch for background processing
- Use Platform Events to trigger batch jobs`,
      },
      {
        title: 'Platform Events & Messaging',
        content: `**Platform Events:**
- Asynchronous, decoupled messaging
- Pub/sub model
- Replay capability
- Use for: Cross-org communication, event-driven architecture

**Implementation:**
\`\`\`javascript
// Publish event
MyEvent__e event = new MyEvent__e(Data__c = 'value');
EventBus.publish(event);

// Subscribe (in trigger or component)
trigger MyEventTrigger on MyEvent__e (after insert) {
    for (MyEvent__e event : Trigger.New) {
        // Process event
    }
}
\`\`\`

**Use Cases:**
- Real-time notifications
- Integration with external systems
- Decoupling complex processes
- Cross-org communication

**Benefits:**
- Scalability (async processing)
- Reliability (replay on failure)
- Decoupling (loose coupling between components)`,
      },
      {
        title: 'High Availability & Reliability',
        content: `**Design Principles:**

1. **Idempotency:**
- Operations can be safely retried
- Use unique identifiers to prevent duplicates
- Critical for async processing

2. **Error Handling:**
\`\`\`javascript
try {
    // Operation
} catch (Exception e) {
    // Log error
    // Retry with exponential backoff
    // Notify administrators
}
\`\`\`

3. **Circuit Breaker Pattern:**
- Stop calling failing services
- Fail fast instead of waiting
- Automatically retry after cooldown

4. **Monitoring & Alerts:**
- Track error rates
- Monitor governor limit usage
- Alert on performance degradation
- Use Salesforce Health Cloud or custom monitoring`,
      },
    ],
    keyTakeaways: [
      'Choose isolation level based on tenant requirements and cost',
      'Use real-time for user-facing, batch for background processing',
      'Platform Events enable scalable, decoupled architectures',
      'Design for idempotency and error recovery',
    ],
  },
  'javascript-fundamentals': {
    id: 'javascript-fundamentals',
    title: 'JavaScript Fundamentals',
    session: 'Session 2',
    duration: '20 min read',
    sections: [
      {
        title: 'Array Methods Cheat Sheet',
        content: `**Essential Array Methods - Quick Reference**

**1. .map() - Transform each element**
Returns a new array with transformed values. Does not modify original array.

\`\`\`javascript
const numbers = [1, 2, 3, 4];
const doubled = numbers.map(n => n * 2);
// [2, 4, 6, 8]

const users = [{ name: 'John', age: 30 }, { name: 'Jane', age: 25 }];
const names = users.map(user => user.name);
// ['John', 'Jane']

// With index
const indexed = numbers.map((n, i) => n * i);
// [0, 2, 6, 12]
\`\`\`

**2. .filter() - Keep elements matching condition**
Returns a new array with elements that pass the test. Does not modify original array.

\`\`\`javascript
const numbers = [1, 2, 3, 4, 5, 6];
const evens = numbers.filter(n => n % 2 === 0);
// [2, 4, 6]

const users = [
  { name: 'John', age: 30 },
  { name: 'Jane', age: 17 },
  { name: 'Bob', age: 25 }
];
const adults = users.filter(user => user.age >= 18);
// [{ name: 'John', age: 30 }, { name: 'Bob', age: 25 }]
\`\`\`

**3. .reduce() - Accumulate values into single result**
Most powerful method. Reduces array to a single value. Can return any type.

\`\`\`javascript
// Sum all numbers
const numbers = [1, 2, 3, 4, 5];
const sum = numbers.reduce((acc, current) => acc + current, 0);
// 15

// Group by property
const users = [
  { name: 'John', role: 'admin' },
  { name: 'Jane', role: 'user' },
  { name: 'Bob', role: 'admin' }
];
const grouped = users.reduce((acc, user) => {
  if (!acc[user.role]) acc[user.role] = [];
  acc[user.role].push(user);
  return acc;
}, {});
// { admin: [{...}, {...}], user: [{...}] }

// Flatten array
const nested = [[1, 2], [3, 4], [5, 6]];
const flat = nested.reduce((acc, arr) => [...acc, ...arr], []);
// [1, 2, 3, 4, 5, 6]

// Find max value
const max = numbers.reduce((max, current) => current > max ? current : max, numbers[0]);
// 5
\`\`\`

**4. .forEach() - Execute function for each element**
Used for side effects (logging, DOM updates). Returns undefined. Does not modify original array.

\`\`\`javascript
const numbers = [1, 2, 3];
numbers.forEach(n => console.log(n * 2));
// Logs: 2, 4, 6

const users = [{ name: 'John' }, { name: 'Jane' }];
users.forEach((user, index) => {
  console.log(\`User \${index}: \${user.name}\`);
});
// Logs: User 0: John, User 1: Jane
\`\`\`

**5. .find() - Find first matching element**
Returns the first element that satisfies the condition, or undefined.

\`\`\`javascript
const users = [
  { id: 1, name: 'John' },
  { id: 2, name: 'Jane' },
  { id: 3, name: 'Bob' }
];
const user = users.find(u => u.id === 2);
// { id: 2, name: 'Jane' }

const found = users.find(u => u.name.startsWith('J'));
// { id: 1, name: 'John' } (first match)
\`\`\`

**6. .findIndex() - Find index of first matching element**
Returns the index of the first element that satisfies the condition, or -1.

\`\`\`javascript
const numbers = [10, 20, 30, 40];
const index = numbers.findIndex(n => n > 25);
// 2

const users = [{ name: 'John' }, { name: 'Jane' }];
const janeIndex = users.findIndex(u => u.name === 'Jane');
// 1
\`\`\`

**7. .some() - Test if any element passes**
Returns true if at least one element passes the test, false otherwise.

\`\`\`javascript
const numbers = [1, 2, 3, 4, 5];
const hasEven = numbers.some(n => n % 2 === 0);
// true

const hasNegative = numbers.some(n => n < 0);
// false

const users = [{ age: 17 }, { age: 25 }, { age: 30 }];
const hasMinor = users.some(u => u.age < 18);
// true
\`\`\`

**8. .every() - Test if all elements pass**
Returns true if all elements pass the test, false otherwise.

\`\`\`javascript
const numbers = [2, 4, 6, 8];
const allEven = numbers.every(n => n % 2 === 0);
// true

const allPositive = numbers.every(n => n > 0);
// true

const users = [{ age: 18 }, { age: 20 }, { age: 17 }];
const allAdults = users.every(u => u.age >= 18);
// false
\`\`\`

**9. .includes() - Check if array contains value**
Returns true if array includes the value, false otherwise. Uses strict equality (===).

\`\`\`javascript
const fruits = ['apple', 'banana', 'orange'];
const hasApple = fruits.includes('apple');
// true

const hasGrape = fruits.includes('grape');
// false

const numbers = [1, 2, 3, NaN];
numbers.includes(NaN); // true (unlike indexOf)
\`\`\`

**10. .sort() - Sort array in place**
Sorts array elements and returns the same array (mutates original). Default is string sort.

\`\`\`javascript
// String sort (default)
const fruits = ['banana', 'apple', 'cherry'];
fruits.sort();
// ['apple', 'banana', 'cherry']

// Number sort (ascending)
const numbers = [10, 5, 40, 25, 1000, 1];
numbers.sort((a, b) => a - b);
// [1, 5, 10, 25, 40, 1000]

// Number sort (descending)
numbers.sort((a, b) => b - a);
// [1000, 40, 25, 10, 5, 1]

// Object sort
const users = [
  { name: 'John', age: 30 },
  { name: 'Jane', age: 25 },
  { name: 'Bob', age: 35 }
];
users.sort((a, b) => a.age - b.age);
// Sorted by age: Jane (25), John (30), Bob (35)
\`\`\`

**11. .slice() - Extract portion of array**
Returns a shallow copy of portion of array. Does not modify original array.

\`\`\`javascript
const numbers = [0, 1, 2, 3, 4, 5];
const firstThree = numbers.slice(0, 3);
// [0, 1, 2] (original unchanged)

const lastTwo = numbers.slice(-2);
// [4, 5]

const middle = numbers.slice(2, 4);
// [2, 3]

// Copy entire array
const copy = numbers.slice();
// [0, 1, 2, 3, 4, 5] (new array)
\`\`\`

**12. .splice() - Add/remove elements in place**
Modifies array by removing/replacing elements. Returns array of removed elements.

\`\`\`javascript
const numbers = [1, 2, 3, 4, 5];

// Remove 2 elements starting at index 1
const removed = numbers.splice(1, 2);
// removed: [2, 3], numbers: [1, 4, 5]

// Insert elements at index 1
numbers.splice(1, 0, 'a', 'b');
// numbers: [1, 'a', 'b', 4, 5] (inserted, nothing removed)

// Replace elements
numbers.splice(1, 2, 'x', 'y');
// Removed 'a', 'b', inserted 'x', 'y'
// numbers: [1, 'x', 'y', 4, 5]
\`\`\`

**Method Comparison Quick Reference:**
- **Returns new array**: map, filter, slice, concat, flat
- **Returns single value**: reduce, find, some, every, includes
- **Modifies original**: sort, splice, reverse, push, pop, shift, unshift
- **Returns index**: findIndex, indexOf
- **Side effects only**: forEach`,
      },
      {
        title: 'Closures - Deep Dive with Examples',
        content: `**What is a Closure?**
A closure gives you access to an outer function's scope from an inner function, even after the outer function has returned. The inner function "closes over" variables from the outer scope.

**Basic Closure Example:**
\`\`\`javascript
function createCounter() {
    let count = 0; // Private variable - only accessible via closures
    
    return {
        increment: () => ++count,
        decrement: () => --count,
        getValue: () => count
    };
}

const counter1 = createCounter();
const counter2 = createCounter();

console.log(counter1.increment()); // 1
console.log(counter1.increment()); // 2
console.log(counter2.increment()); // 1 (separate closure!)
console.log(counter1.getValue());  // 2
// Each counter has its own private 'count' variable!
\`\`\`

**Common Closure Pattern - Data Privacy:**
\`\`\`javascript
function createBankAccount(initialBalance) {
    let balance = initialBalance; // Private - cannot access directly
    
    return {
        deposit: (amount) => {
            balance += amount;
            return balance;
        },
        withdraw: (amount) => {
            if (amount <= balance) {
                balance -= amount;
                return balance;
            }
            throw new Error('Insufficient funds');
        },
        getBalance: () => balance // Read-only access
    };
}

const account = createBankAccount(100);
account.deposit(50);  // 150
account.withdraw(30); // 120
console.log(account.balance); // undefined (private!)
console.log(account.getBalance()); // 120
\`\`\`

**Closure in Loops - Classic Gotcha:**
\`\`\`javascript
// Problem: All functions reference the same 'i'
for (var i = 0; i < 3; i++) {
    setTimeout(() => console.log(i), 100); // Logs: 3, 3, 3
}

// Solution 1: Use let (block scope)
for (let i = 0; i < 3; i++) {
    setTimeout(() => console.log(i), 100); // Logs: 0, 1, 2
}

// Solution 2: IIFE (Immediately Invoked Function Expression)
for (var i = 0; i < 3; i++) {
    (function(index) {
        setTimeout(() => console.log(index), 100);
    })(i); // Creates new closure for each iteration
}
\`\`\`

**Function Factory Pattern:**
\`\`\`javascript
function createMultiplier(multiplier) {
    // 'multiplier' is captured in closure
    return function(number) {
        return number * multiplier;
    };
}

const double = createMultiplier(2);
const triple = createMultiplier(3);

console.log(double(5));  // 10
console.log(triple(5));  // 15

// More complex factory
function createValidator(rules) {
    return function(value) {
        return rules.every(rule => rule(value));
    };
}

const isEmail = createValidator([
    v => v.includes('@'),
    v => v.includes('.'),
    v => v.length > 5
]);

console.log(isEmail('test@example.com')); // true
console.log(isEmail('invalid'));          // false
\`\`\`

**Closure with Event Handlers:**
\`\`\`javascript
function setupButtons() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach((button, index) => {
        // Closure captures 'index' for each button
        button.addEventListener('click', function() {
            console.log(\`Button \${index} clicked!\`);
            // Each button remembers its own index
        });
    });
}

// In React - closure in useEffect
function Component() {
    const [count, setCount] = useState(0);
    
    useEffect(() => {
        const interval = setInterval(() => {
            setCount(c => c + 1); // Closure over 'setCount'
        }, 1000);
        
        return () => clearInterval(interval);
    }, []); // Empty deps - closure ensures fresh reference
}
\`\`\`

**Module Pattern (Private Methods):**
\`\`\`javascript
const calculator = (function() {
    // Private variables and functions
    let result = 0;
    
    function validate(num) {
        return typeof num === 'number' && !isNaN(num);
    }
    
    // Public API
    return {
        add: (num) => {
            if (validate(num)) result += num;
            return this;
        },
        subtract: (num) => {
            if (validate(num)) result -= num;
            return this;
        },
        getResult: () => result,
        reset: () => {
            result = 0;
            return this;
        }
    };
})();

calculator.add(10).subtract(3).add(5);
console.log(calculator.getResult()); // 12
// 'validate' is not accessible outside - private!
\`\`\`

**Key Takeaways:**
- Closures allow inner functions to access outer scope variables
- Variables in closure persist even after outer function returns
- Each closure has its own independent set of variables
- Useful for data privacy, function factories, and event handlers
- Be careful with closures in loops - use let or IIFE`,
      },
      {
        title: 'Event Loop: Microtasks vs Macrotasks',
        content: `**Execution Order:**
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
- Critical for understanding async behavior in React

**React Implications:**
- useState updates are batched (microtask timing)
- useEffect runs after render (microtask)
- setTimeout in useEffect runs later (macrotask)`,
      },
      {
        title: 'Pure Functions & Side Effects',
        content: `**Pure Function:**
- Same input → Same output
- No side effects
- Predictable, testable

**Impure Function:**
- May have different outputs
- Has side effects (API calls, DOM updates, logging)

**Example:**
\`\`\`javascript
// Pure
function add(a, b) {
    return a + b;
}

// Impure - side effect
function addWithLog(a, b) {
    console.log(a, b); // Side effect!
    return a + b;
}

// Impure - non-deterministic
function randomAdd(a, b) {
    return a + b + Math.random();
}
\`\`\`

**In React:**
- Keep business logic pure
- Isolate side effects in useEffect, event handlers
- Pure functions are easier to memoize`,
      },
      {
        title: 'Async/Await & Promises',
        content: `**Promises:**
\`\`\`javascript
fetch('/api/data')
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error(error));
\`\`\`

**Async/Await:**
\`\`\`javascript
async function fetchData() {
    try {
        const response = await fetch('/api/data');
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error(error);
    }
}
\`\`\`

**Key Points:**
- async functions always return a Promise
- await pauses execution until Promise resolves
- Use try/catch for error handling
- Parallel execution with Promise.all()

**React Example:**
\`\`\`javascript
useEffect(() => {
    async function loadData() {
        const data = await fetchData();
        setData(data);
    }
    loadData();
}, []);
\`\`\``,
      },
    ],
    keyTakeaways: [
      'map/filter/reduce are essential - map transforms, filter selects, reduce accumulates',
      'Use .find() for single element, .filter() for multiple, .some()/.every() for boolean checks',
      'Closures provide data privacy, function factories, and are key to React hooks',
      'Be careful with closures in loops - use let or IIFE to create proper closures',
      'Microtasks (Promises) execute before macrotasks (setTimeout)',
      'Keep business logic pure, isolate side effects',
      'Async/await makes asynchronous code more readable',
    ],
  },
  'react-best-practices': {
    id: 'react-best-practices',
    title: 'React Best Practices',
    session: 'Session 2',
    duration: '18 min read',
    sections: [
      {
        title: 'INP (Interaction to Next Paint) Optimization',
        content: `**What is INP?**
Measures responsiveness - time from user interaction to next paint. Target: < 200ms.

**Optimization Techniques:**

1. **Debounce/Throttle Event Handlers:**
\`\`\`javascript
const debouncedSearch = useMemo(
    () => debounce((value) => {
        // Search logic
    }, 300),
    []
);
\`\`\`

2. **Break Up Long Tasks:**
\`\`\`javascript
// Use scheduler.postTask or setTimeout
setTimeout(() => {
    // Heavy computation
}, 0);
\`\`\`

3. **Use Passive Event Listeners:**
\`\`\`javascript
element.addEventListener('scroll', handler, { passive: true });
\`\`\`

4. **Code Splitting:**
\`\`\`javascript
const HeavyComponent = React.lazy(() => import('./HeavyComponent'));

<Suspense fallback={<Loading />}>
    <HeavyComponent />
</Suspense>
\`\`\``,
      },
      {
        title: 'Memoization: useMemo & useCallback',
        content: `**useMemo - Memoize Expensive Calculations:**
\`\`\`javascript
const expensiveValue = useMemo(() => {
    return computeExpensiveValue(a, b);
}, [a, b]); // Only recompute if a or b changes
\`\`\`

**useCallback - Memoize Functions:**
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
- ❌ Premature optimization

**React.memo:**
\`\`\`javascript
const MyComponent = React.memo(({ name }) => {
    return <div>{name}</div>;
}, (prevProps, nextProps) => {
    // Custom comparison
    return prevProps.name === nextProps.name;
});
\`\`\``,
      },
      {
        title: 'State Management',
        content: `**When to Use Context API:**
- Theme/UI state
- User authentication
- Simple global state
- Low-frequency updates

**When to Use Redux:**
- Complex state logic
- Time-travel debugging
- Middleware needs (logging, async)
- Large teams, predictable updates

**Best Practices:**
1. **Keep state local** - Only lift state when necessary
2. **Normalize state shape** - Flat structure, avoid nesting
3. **Use selectors** - Derive state, don't duplicate
4. **Avoid prop drilling** - Use Context or state management

**Example:**
\`\`\`javascript
// Good: Local state
const [count, setCount] = useState(0);

// Good: Lifted when needed
const [user, setUser] = useState(null); // Shared across components

// Good: Context for theme
const ThemeContext = createContext();
\`\`\``,
      },
      {
        title: 'Forms & Validation',
        content: `**React Hook Form (Recommended):**
\`\`\`javascript
const { register, handleSubmit, formState: { errors } } = useForm();

<form onSubmit={handleSubmit(onSubmit)}>
    <input {...register('email', { required: true })} />
    {errors.email && <span>Email required</span>}
</form>
\`\`\`

**Validation Strategies:**
1. **Client-side** - Immediate feedback (React Hook Form, Formik)
2. **Schema validation** - Yup, Zod for type-safe validation
3. **Server-side** - Always validate on backend
4. **Async validation** - Check uniqueness, availability

**Error Handling:**
\`\`\`javascript
try {
    await submitForm(data);
    showSuccess();
} catch (error) {
    if (error.response?.status === 400) {
        setFieldErrors(error.response.data.errors);
    } else {
        showGenericError();
    }
}
\`\`\``,
      },
    ],
    keyTakeaways: [
      'Optimize INP with debouncing, code splitting, and task breaking',
      'Use memoization strategically - not everywhere',
      'Keep state local, lift when needed, use Context/Redux appropriately',
      'Validate on both client and server, handle errors gracefully',
    ],
  },
  'css-layout': {
    id: 'css-layout',
    title: 'CSS & Layout',
    session: 'Session 2',
    duration: '10 min read',
    sections: [
      {
        title: 'CSS Grid for Calendars',
        content: `**Basic Calendar Grid:**
\`\`\`css
.calendar {
    display: grid;
    grid-template-columns: repeat(7, 1fr); /* 7 days */
    grid-auto-rows: minmax(60px, auto);
    gap: 1px;
}
\`\`\`

**Multi-Day Events:**
\`\`\`css
.event {
    grid-column: 2 / 5; /* Spans from column 2 to 5 */
}
\`\`\`

**Responsive Design:**
\`\`\`css
@media (max-width: 768px) {
    .calendar {
        grid-template-columns: 1fr; /* Stack on mobile */
    }
}
\`\`\`

**Handling Overlaps:**
\`\`\`css
.event {
    position: relative;
    z-index: 1;
}

.event.overlapping {
    z-index: 2;
    margin-left: 20px; /* Offset for visual separation */
}
\`\`\``,
      },
      {
        title: 'Overlapping Events',
        content: `**Algorithm for Overlapping Events:**

1. **Group overlapping events:**
\`\`\`javascript
function groupOverlapping(events) {
    // Sort by start time
    events.sort((a, b) => a.start - b.start);
    
    const groups = [];
    let currentGroup = [events[0]];
    
    for (let i = 1; i < events.length; i++) {
        if (events[i].start < currentGroup[currentGroup.length - 1].end) {
            currentGroup.push(events[i]);
        } else {
            groups.push(currentGroup);
            currentGroup = [events[i]];
        }
    }
    groups.push(currentGroup);
    return groups;
}
\`\`\`

2. **Calculate column positions:**
\`\`\`javascript
function assignColumns(group) {
    group.forEach((event, index) => {
        event.column = index;
        event.span = 1; // Can be optimized for better layout
    });
}
\`\`\`

3. **Apply CSS Grid:**
\`\`\`javascript
event.style.gridColumn = \`\${event.column + 1} / \${event.column + event.span + 1}\`;
\`\`\``,
      },
      {
        title: 'Modern CSS Patterns',
        content: `**CSS Variables (Custom Properties):**
\`\`\`css
:root {
    --primary-color: #0176D3;
    --spacing: 1rem;
}

.button {
    background: var(--primary-color);
    padding: var(--spacing);
}
\`\`\`

**Flexbox for Components:**
\`\`\`css
.container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
}
\`\`\`

**Grid for Layouts:**
\`\`\`css
.layout {
    display: grid;
    grid-template-areas: 
        "header header"
        "sidebar main"
        "footer footer";
    grid-template-columns: 200px 1fr;
}
\`\`\``,
      },
    ],
    keyTakeaways: [
      'CSS Grid is ideal for calendar layouts with repeat(7, 1fr)',
      'Handle overlaps by grouping and assigning columns',
      'Use CSS variables for theming and maintainability',
      'Combine Grid for layout, Flexbox for components',
    ],
  },
  'problem-solving-coding': {
    id: 'problem-solving-coding',
    title: 'Problem Solving & Coding',
    session: 'Session 2',
    duration: '12 min read',
    sections: [
      {
        title: 'Algorithm Problem-Solving Framework',
        content: `**Step-by-Step Approach:**

1. **Understand the Problem:**
   - Read carefully, identify inputs/outputs
   - Ask clarifying questions
   - Identify edge cases

2. **Plan Your Approach:**
   - Think out loud
   - Discuss trade-offs
   - Consider time/space complexity

3. **Code the Solution:**
   - Start with brute force if needed
   - Optimize incrementally
   - Write clean, readable code

4. **Test & Refine:**
   - Test with examples
   - Handle edge cases
   - Optimize if needed

**Example: Meeting Rooms Problem**
- Input: Array of [start, end] intervals
- Output: Minimum rooms needed
- Approach: Sort by start, use min-heap for end times`,
      },
      {
        title: 'Key Data Structures',
        content: `**Trees:**
- Binary Search Tree: O(log n) search
- Use for: Sorted data, range queries

**Heaps:**
- Min-heap: Smallest element at root
- Max-heap: Largest element at root
- Use for: Priority queues, finding kth largest

**Intervals:**
- Merge overlapping intervals
- Find gaps between intervals
- Use for: Calendar problems, scheduling

**Hash Maps:**
- O(1) average lookup
- Use for: Frequency counting, caching

**Example - Interval Merging:**
\`\`\`javascript
function mergeIntervals(intervals) {
    intervals.sort((a, b) => a[0] - b[0]);
    const merged = [intervals[0]];
    
    for (let i = 1; i < intervals.length; i++) {
        const last = merged[merged.length - 1];
        if (intervals[i][0] <= last[1]) {
            last[1] = Math.max(last[1], intervals[i][1]);
        } else {
            merged.push(intervals[i]);
        }
    }
    return merged;
}
\`\`\``,
      },
      {
        title: 'Explaining Your Thought Process',
        content: `**Communication Tips:**

1. **Think Out Loud:**
   - "I'm thinking about using a hash map because..."
   - "The time complexity would be O(n) because..."
   - "An edge case to consider is..."

2. **Discuss Trade-offs:**
   - "We could use an array, but a hash map is faster for lookups"
   - "This uses O(n) space, but we could optimize to O(1) if..."

3. **Ask Questions:**
   - "Should I handle empty input?"
   - "What's the expected input size?"
   - "Are there any constraints I should know about?"

4. **Show Your Reasoning:**
   - Explain why you chose an approach
   - Discuss alternatives you considered
   - Acknowledge limitations`,
      },
      {
        title: 'Writing Clean Code',
        content: `**Principles:**

1. **Meaningful Names:**
\`\`\`javascript
// Bad
const x = (a, b) => a + b;

// Good
const calculateTotal = (price, tax) => price + tax;
\`\`\`

2. **Small Functions:**
\`\`\`javascript
// Bad: Does too much
function processData(data) {
    // 50 lines of mixed logic
}

// Good: Single responsibility
function validateData(data) { }
function transformData(data) { }
function saveData(data) { }
\`\`\`

3. **Avoid Magic Numbers:**
\`\`\`javascript
// Bad
if (users.length > 100) { }

// Good
const MAX_USERS = 100;
if (users.length > MAX_USERS) { }
\`\`\`

4. **Handle Edge Cases:**
\`\`\`javascript
if (!data || data.length === 0) {
    return [];
}
\`\`\``,
      },
    ],
    keyTakeaways: [
      'Follow a structured problem-solving framework',
      'Know when to use trees, heaps, intervals, hash maps',
      'Communicate your thought process clearly',
      'Write clean, readable code with meaningful names',
    ],
  },
}

function Lessons({ initialLessonId }) {
  const [selectedLesson, setSelectedLesson] = useState(initialLessonId || null)

  // Get lesson ID from URL hash or navigation event
  useEffect(() => {
    const handleNavigate = (event) => {
      if (event.detail?.lessonId) {
        setSelectedLesson(event.detail.lessonId)
        window.location.hash = event.detail.lessonId
      }
    }

    const hash = window.location.hash.slice(1)
    if (hash && lessons[hash]) {
      setSelectedLesson(hash)
    }

    window.addEventListener('navigate', handleNavigate)
    return () => window.removeEventListener('navigate', handleNavigate)
  }, [])

  useEffect(() => {
    if (initialLessonId) {
      setSelectedLesson(initialLessonId)
    }
  }, [initialLessonId])

  const lessonList = Object.values(lessons)

  if (selectedLesson && lessons[selectedLesson]) {
    const lesson = lessons[selectedLesson]
    return <LessonDetail lesson={lesson} onBack={() => setSelectedLesson(null)} />
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-2">
          <BookOpen className="w-6 h-6 text-salesforce-blue" />
          <h2 className="text-2xl font-bold text-salesforce-dark-blue">
            Study Lessons
          </h2>
        </div>
        <p className="text-salesforce-gray">
          Comprehensive lessons mapped to your Study Guide topics. Deep dive into each concept quickly and thoroughly.
        </p>
      </div>

      {/* Session 1 Lessons */}
      <div>
        <h3 className="text-lg font-semibold text-salesforce-dark-blue mb-4">
          Session 1: Systems Design + Architecture/Data Concepts
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {lessonList.filter(l => l.session === 'Session 1').map(lesson => (
            <LessonCard key={lesson.id} lesson={lesson} onClick={() => setSelectedLesson(lesson.id)} />
          ))}
        </div>
      </div>

      {/* Session 2 Lessons */}
      <div>
        <h3 className="text-lg font-semibold text-salesforce-dark-blue mb-4 mt-8">
          Session 2: Front End Development
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {lessonList.filter(l => l.session === 'Session 2').map(lesson => (
            <LessonCard key={lesson.id} lesson={lesson} onClick={() => setSelectedLesson(lesson.id)} />
          ))}
        </div>
      </div>
    </div>
  )
}

function LessonCard({ lesson, onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-white rounded-lg border-2 border-gray-200 p-6 text-left hover:border-salesforce-blue hover:shadow-md transition-all w-full"
    >
      <div className="flex items-start justify-between mb-3">
        <h4 className="font-bold text-lg text-salesforce-dark-blue flex-1">
          {lesson.title}
        </h4>
        <ChevronRight className="w-5 h-5 text-salesforce-gray flex-shrink-0 ml-2" />
      </div>
      <div className="flex items-center gap-2 text-sm text-salesforce-gray mb-3">
        <span className="px-2 py-1 bg-salesforce-light-blue text-salesforce-blue rounded text-xs font-medium">
          {lesson.session}
        </span>
        <span>•</span>
        <span>{lesson.duration}</span>
      </div>
      <p className="text-sm text-gray-600">
        {lesson.sections.length} sections • {lesson.keyTakeaways.length} key takeaways
      </p>
    </button>
  )
}

function LessonDetail({ lesson, onBack }) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-salesforce-blue hover:text-salesforce-dark-blue mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back to Lessons</span>
        </button>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-1 bg-salesforce-light-blue text-salesforce-blue rounded text-xs font-medium">
                {lesson.session}
              </span>
              <span className="text-sm text-salesforce-gray">{lesson.duration}</span>
            </div>
            <h1 className="text-3xl font-bold text-salesforce-dark-blue mb-2">
              {lesson.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Lesson Content */}
      <div className="space-y-6">
        {lesson.sections.map((section, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-salesforce-dark-blue mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-salesforce-blue text-white flex items-center justify-center text-sm font-bold">
                {index + 1}
              </span>
              {section.title}
            </h2>
            <div className="prose prose-sm max-w-none">
              <div className="text-gray-700 leading-relaxed dark:text-slate-300">
                {(() => {
                  // First, extract all code blocks from the content
                  const content = section.content
                  const parts = []
                  let lastIndex = 0
                  let partKey = 0
                  
                  // Find all code blocks using a more robust regex
                  // Handles: ```language\ncode``` or ```\ncode``` or ```language\ncode```
                  const codeBlockRegex = /```(\w+)?\s*\n([\s\S]*?)```/g
                  let match
                  
                  while ((match = codeBlockRegex.exec(content)) !== null) {
                    // Add text before the code block
                    if (match.index > lastIndex) {
                      const textBefore = content.substring(lastIndex, match.index).trim()
                      if (textBefore) {
                        parts.push({ type: 'text', content: textBefore, key: partKey++ })
                      }
                    }
                    
                    // Add the code block
                    const language = match[1] || 'javascript'
                    const code = match[2].trim()
                    parts.push({ type: 'code', language, code, key: partKey++ })
                    
                    lastIndex = match.index + match[0].length
                  }
                  
                  // Add remaining text after last code block
                  if (lastIndex < content.length) {
                    const textAfter = content.substring(lastIndex).trim()
                    if (textAfter) {
                      parts.push({ type: 'text', content: textAfter, key: partKey++ })
                    }
                  }
                  
                  // If no code blocks found, treat entire content as text
                  if (parts.length === 0) {
                    parts.push({ type: 'text', content: content, key: partKey++ })
                  }
                  
                  // Render each part
                  const renderedParts = []
                  parts.forEach((part) => {
                    if (part.type === 'code') {
                      renderedParts.push(
                        <div key={part.key} className="my-6 rounded-lg overflow-hidden border border-gray-300 dark:border-slate-700 shadow-sm bg-gray-900 dark:bg-slate-950">
                          <SyntaxHighlighter
                            language={part.language}
                            style={vscDarkPlus}
                            customStyle={{
                              margin: 0,
                              padding: '1.25rem',
                              fontSize: '0.875rem',
                              lineHeight: '1.6',
                              fontFamily: 'Monaco, Menlo, "Ubuntu Mono", "Courier New", monospace',
                              background: 'transparent',
                            }}
                            showLineNumbers={true}
                            lineNumberStyle={{
                              minWidth: '3em',
                              paddingRight: '1em',
                              color: '#6b7280',
                              userSelect: 'none',
                            }}
                            codeTagProps={{
                              style: {
                                fontFamily: 'inherit',
                              }
                            }}
                          >
                            {part.code}
                          </SyntaxHighlighter>
                        </div>
                      )
                    } else {
                      // Render text content with formatting
                      part.content.split('\n\n').forEach((paragraph, pIdx) => {
                        if (!paragraph.trim()) return
                        
                  const lines = paragraph.split('\n')
                        renderedParts.push(
                          <div key={`${part.key}-${pIdx}`} className="mb-4">
                      {lines.map((line, lIdx) => {
                        if (line.trim() === '') return null
                        
                        // Process inline formatting
                              const lineParts = []
                        let key = 0
                        
                        // Match **bold**, `code`, and regular text
                        const matches = []
                        
                              // Find all bold matches
                              let boldRegex = /\*\*(.*?)\*\*/g
                              let boldMatch
                              while ((boldMatch = boldRegex.exec(line)) !== null) {
                                matches.push({ type: 'bold', start: boldMatch.index, end: boldMatch.index + boldMatch[0].length, content: boldMatch[1] })
                              }
                              
                              // Find all code matches (using new regex instance)
                              let codeRegex = /`([^`]+)`/g
                              let codeMatch
                              while ((codeMatch = codeRegex.exec(line)) !== null) {
                                matches.push({ type: 'code', start: codeMatch.index, end: codeMatch.index + codeMatch[0].length, content: codeMatch[1] })
                        }
                        
                        matches.sort((a, b) => a.start - b.start)
                        
                        let textIndex = 0
                              matches.forEach((m) => {
                          if (m.start > textIndex) {
                                  lineParts.push(<span key={key++}>{line.substring(textIndex, m.start)}</span>)
                          }
                          if (m.type === 'bold') {
                                  lineParts.push(<strong key={key++} className="text-salesforce-dark-blue dark:text-blue-400 font-semibold">{m.content}</strong>)
                          } else if (m.type === 'code') {
                                  lineParts.push(<code key={key++} className="bg-gray-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-sm font-mono text-purple-600 dark:text-purple-400">{m.content}</code>)
                          }
                          textIndex = m.end
                        })
                        if (textIndex < line.length) {
                                lineParts.push(<span key={key++}>{line.substring(textIndex)}</span>)
                        }
                        
                              if (lineParts.length === 0) {
                                lineParts.push(<span key={key++}>{line}</span>)
                        }
                        
                              return <p key={lIdx} className="mb-2 leading-relaxed">{lineParts}</p>
                      })}
                    </div>
                  )
                      })
                    }
                  })
                  
                  return renderedParts
                })()}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Key Takeaways */}
      <div className="bg-salesforce-light-blue border-l-4 border-salesforce-blue rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-5 h-5 text-salesforce-blue" />
          <h3 className="font-bold text-salesforce-dark-blue">Key Takeaways</h3>
        </div>
        <ul className="space-y-2">
          {lesson.keyTakeaways.map((takeaway, index) => (
            <li key={index} className="flex items-start gap-2 text-salesforce-dark-blue">
              <CheckCircle className="w-5 h-5 text-salesforce-blue flex-shrink-0 mt-0.5" />
              <span>{takeaway}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Lessons
