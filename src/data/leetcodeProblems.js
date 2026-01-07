// LeetCode Problems for Salesforce Interviews (6 months data)
export const leetcodeProblems = [
  {
    id: 2957,
    title: "Remove Adjacent Almost-Equal Characters",
    difficulty: "Medium",
    acceptance: "52.8%",
    categories: ["String", "Greedy"],
    leetcodeUrl: "https://leetcode.com/problems/remove-adjacent-almost-equal-characters/",
    description: `You are given a 0-indexed string word.

In one operation, you can pick any index i and change word[i] to any lowercase English letter.

Return the minimum number of operations needed to make sure that no two adjacent characters in word are equal.

Example 1:
Input: word = "aab"
Output: 0
Explanation: No operation is needed because no two adjacent characters are equal.

Example 2:
Input: word = "abacaba"
Output: 2`,
    solutions: [
      {
        name: "Naive Greedy",
        approach: "Check each adjacent pair and modify if needed",
        time: "O(n)",
        space: "O(1)",
        code: `function minOperations(word) {
  let operations = 0;
  for (let i = 1; i < word.length; i++) {
    if (word[i] === word[i - 1]) {
      operations++;
      // Change current character to avoid future conflicts
      word[i] = word[i] === 'z' ? 'a' : String.fromCharCode(word.charCodeAt(i) + 1);
      if (i < word.length - 1 && word[i] === word[i + 1]) {
        word[i] = word[i] === 'z' ? 'a' : String.fromCharCode(word.charCodeAt(i) + 1);
      }
    }
  }
  return operations;
}`,
      },
      {
        name: "Optimal Greedy",
        approach: "Track minimum operations with state",
        time: "O(n)",
        space: "O(1)",
        code: `function minOperations(word) {
  let operations = 0;
  for (let i = 1; i < word.length; i++) {
    if (word[i] === word[i - 1]) {
      operations++;
      // Always change to a safe character
      word = word.substring(0, i) + String.fromCharCode(
        (word.charCodeAt(i) - 'a'.charCodeAt(0) + 1) % 26 + 'a'.charCodeAt(0)
      ) + word.substring(i + 1);
    }
  }
  return operations;
}`,
      },
    ],
  },
  {
    id: 628,
    title: "Maximum Product of Three Numbers",
    difficulty: "Easy",
    acceptance: "45.6%",
    categories: ["Array", "Math", "Sorting"],
    leetcodeUrl: "https://leetcode.com/problems/maximum-product-of-three-numbers/",
    description: `Given an integer array nums, find three numbers whose product is maximum and return the maximum product.

Example 1:
Input: nums = [1,2,3]
Output: 6

Example 2:
Input: nums = [1,2,3,4]
Output: 24`,
    solutions: [
      {
        name: "Sorting Approach",
        approach: "Sort array and consider two cases",
        time: "O(n log n)",
        space: "O(1)",
        code: `function maximumProduct(nums) {
  nums.sort((a, b) => a - b);
  const n = nums.length;
  // Case 1: three largest positive numbers
  // Case 2: two smallest negative numbers * largest positive
  return Math.max(
    nums[n - 1] * nums[n - 2] * nums[n - 3],
    nums[0] * nums[1] * nums[n - 1]
  );
}`,
      },
      {
        name: "Optimal - Single Pass",
        approach: "Track min/max values in one pass",
        time: "O(n)",
        space: "O(1)",
        code: `function maximumProduct(nums) {
  let min1 = Infinity, min2 = Infinity;
  let max1 = -Infinity, max2 = -Infinity, max3 = -Infinity;
  
  for (const num of nums) {
    if (num <= min1) {
      min2 = min1;
      min1 = num;
    } else if (num <= min2) {
      min2 = num;
    }
    
    if (num >= max1) {
      max3 = max2;
      max2 = max1;
      max1 = num;
    } else if (num >= max2) {
      max3 = max2;
      max2 = num;
    } else if (num >= max3) {
      max3 = num;
    }
  }
  
  return Math.max(max1 * max2 * max3, min1 * min2 * max1);
}`,
      },
    ],
  },
  {
    id: 460,
    title: "LFU Cache",
    difficulty: "Hard",
    acceptance: "48.2%",
    categories: ["Hash Table", "Linked List", "Design"],
    leetcodeUrl: "https://leetcode.com/problems/lfu-cache/",
    description: `Design and implement a data structure for a Least Frequently Used (LFU) cache.

Implement the LFUCache class:
- LFUCache(int capacity) Initializes the object with the capacity of the data structure.
- int get(int key) Gets the value of the key if the key exists in the cache. Otherwise, returns -1.
- void put(int key, int value) Update the value of the key if present, or insert the key if not already present. When the cache reaches its capacity, it should invalidate and remove the least frequently used key before inserting a new item.`,
    solutions: [
      {
        name: "Naive - Hash Map with Frequency",
        approach: "Use Map to track frequency",
        time: "O(n)",
        space: "O(capacity)",
        code: `class LFUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
    this.freq = new Map();
    this.minFreq = 0;
  }
  
  get(key) {
    if (!this.cache.has(key)) return -1;
    const { value, frequency } = this.cache.get(key);
    this.cache.set(key, { value, frequency: frequency + 1 });
    this.updateFrequency(key, frequency, frequency + 1);
    return value;
  }
  
  put(key, value) {
    if (this.capacity === 0) return;
    
    if (this.cache.has(key)) {
      const { frequency } = this.cache.get(key);
      this.cache.set(key, { value, frequency: frequency + 1 });
      this.updateFrequency(key, frequency, frequency + 1);
    } else {
      if (this.cache.size >= this.capacity) {
        this.evictLFU();
      }
      this.cache.set(key, { value, frequency: 1 });
      this.updateFrequency(key, 0, 1);
      this.minFreq = 1;
    }
  }
  
  updateFrequency(key, oldFreq, newFreq) {
    // Implementation details...
  }
  
  evictLFU() {
    // Remove least frequently used
  }
}`,
      },
      {
        name: "Optimal - Doubly Linked List + Hash Map",
        approach: "Use DLL for O(1) operations",
        time: "O(1)",
        space: "O(capacity)",
        code: `class Node {
  constructor(key, val, freq) {
    this.key = key;
    this.val = val;
    this.freq = freq;
    this.prev = null;
    this.next = null;
  }
}

class DoublyLinkedList {
  constructor() {
    this.head = new Node(0, 0, 0);
    this.tail = new Node(0, 0, 0);
    this.head.next = this.tail;
    this.tail.prev = this.head;
    this.size = 0;
  }
  
  addNode(node) {
    node.prev = this.head;
    node.next = this.head.next;
    this.head.next.prev = node;
    this.head.next = node;
    this.size++;
  }
  
  removeNode(node) {
    node.prev.next = node.next;
    node.next.prev = node.prev;
    this.size--;
  }
  
  removeTail() {
    const lastNode = this.tail.prev;
    this.removeNode(lastNode);
    return lastNode;
  }
}

class LFUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
    this.freqMap = new Map();
    this.minFreq = 0;
  }
  
  get(key) {
    if (!this.cache.has(key)) return -1;
    const node = this.cache.get(key);
    this.updateNode(node);
    return node.val;
  }
  
  put(key, value) {
    if (this.capacity === 0) return;
    
    if (this.cache.has(key)) {
      const node = this.cache.get(key);
      node.val = value;
      this.updateNode(node);
    } else {
      if (this.cache.size >= this.capacity) {
        const freqList = this.freqMap.get(this.minFreq);
        const nodeToRemove = freqList.removeTail();
        this.cache.delete(nodeToRemove.key);
      }
      const newNode = new Node(key, value, 1);
      this.cache.set(key, newNode);
      
      if (!this.freqMap.has(1)) {
        this.freqMap.set(1, new DoublyLinkedList());
      }
      this.freqMap.get(1).addNode(newNode);
      this.minFreq = 1;
    }
  }
  
  updateNode(node) {
    const currentFreq = node.freq;
    const freqList = this.freqMap.get(currentFreq);
    freqList.removeNode(node);
    
    if (currentFreq === this.minFreq && freqList.size === 0) {
      this.minFreq++;
    }
    
    node.freq++;
    if (!this.freqMap.has(node.freq)) {
      this.freqMap.set(node.freq, new DoublyLinkedList());
    }
    this.freqMap.get(node.freq).addNode(node);
  }
}`,
      },
    ],
  },
  {
    id: 443,
    title: "String Compression",
    difficulty: "Medium",
    acceptance: "59.3%",
    categories: ["Two Pointers", "String"],
    leetcodeUrl: "https://leetcode.com/problems/string-compression/",
    description: `Given an array of characters chars, compress it using the following algorithm:

Begin with an empty string s. For each group of consecutive repeating characters in chars:
- If the group's length is 1, append the character to s.
- Otherwise, append the character followed by the group's length.

The compressed string s should not be returned separately, but instead, be stored in the input character array chars.`,
    solutions: [
      {
        name: "Naive - Build New String",
        approach: "Create new compressed string",
        time: "O(n)",
        space: "O(n)",
        code: `function compress(chars) {
  let compressed = '';
  let i = 0;
  while (i < chars.length) {
    let char = chars[i];
    let count = 0;
    while (i < chars.length && chars[i] === char) {
      count++;
      i++;
    }
    compressed += char;
    if (count > 1) {
      compressed += count.toString();
    }
  }
  return compressed.split('');
}`,
      },
      {
        name: "Optimal - In-Place",
        approach: "Modify array in place using two pointers",
        time: "O(n)",
        space: "O(1)",
        code: `function compress(chars) {
  let write = 0;
  let read = 0;
  
  while (read < chars.length) {
    let char = chars[read];
    let count = 0;
    
    while (read < chars.length && chars[read] === char) {
      read++;
      count++;
    }
    
    chars[write++] = char;
    
    if (count > 1) {
      const countStr = count.toString();
      for (let i = 0; i < countStr.length; i++) {
        chars[write++] = countStr[i];
      }
    }
  }
  
  return write;
}`,
      },
    ],
  },
  {
    id: 146,
    title: "LRU Cache",
    difficulty: "Medium",
    acceptance: "46.5%",
    categories: ["Hash Table", "Linked List", "Design"],
    leetcodeUrl: "https://leetcode.com/problems/lru-cache/",
    description: `Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.

Implement the LRUCache class:
- LRUCache(int capacity) Initialize the LRU cache with positive size capacity.
- int get(int key) Return the value of the key if the key exists, otherwise return -1.
- void put(int key, int value) Update the value of the key if the key exists. Otherwise, add the key-value pair to the cache. If the number of keys exceeds the capacity from this operation, evict the least recently used key.`,
    solutions: [
      {
        name: "Using Map",
        approach: "Leverage Map's insertion order",
        time: "O(1)",
        space: "O(capacity)",
        code: `class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
  }
  
  get(key) {
    if (!this.cache.has(key)) return -1;
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }
  
  put(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
      this.cache.delete(this.cache.keys().next().value);
    }
    this.cache.set(key, value);
  }
}`,
      },
      {
        name: "Doubly Linked List + Hash Map",
        approach: "Traditional LRU implementation",
        time: "O(1)",
        space: "O(capacity)",
        code: `class Node {
  constructor(key, val) {
    this.key = key;
    this.val = val;
    this.prev = null;
    this.next = null;
  }
}

class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
    this.head = new Node(0, 0);
    this.tail = new Node(0, 0);
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }
  
  addNode(node) {
    node.prev = this.head;
    node.next = this.head.next;
    this.head.next.prev = node;
    this.head.next = node;
  }
  
  removeNode(node) {
    node.prev.next = node.next;
    node.next.prev = node.prev;
  }
  
  moveToHead(node) {
    this.removeNode(node);
    this.addNode(node);
  }
  
  popTail() {
    const lastNode = this.tail.prev;
    this.removeNode(lastNode);
    return lastNode;
  }
  
  get(key) {
    const node = this.cache.get(key);
    if (!node) return -1;
    this.moveToHead(node);
    return node.val;
  }
  
  put(key, value) {
    const node = this.cache.get(key);
    if (!node) {
      const newNode = new Node(key, value);
      this.cache.set(key, newNode);
      this.addNode(newNode);
      
      if (this.cache.size > this.capacity) {
        const tail = this.popTail();
        this.cache.delete(tail.key);
      }
    } else {
      node.val = value;
      this.moveToHead(node);
    }
  }
}`,
      },
    ],
  },
  {
    id: 2571,
    title: "Minimum Operations to Reduce an Integer to 0",
    difficulty: "Medium",
    acceptance: "60.3%",
    categories: ["Dynamic Programming", "Greedy", "Bit Manipulation"],
    leetcodeUrl: "https://leetcode.com/problems/minimum-operations-to-reduce-an-integer-to-0/",
    description: `You are given a positive integer n, you can do one of the following operations:
1. Decrement n by 1
2. If n is even, decrement by n / 2

Return the minimum number of operations to reduce n to 0.`,
    solutions: [
      {
        name: "Recursive DP",
        approach: "Memoized recursion",
        time: "O(n)",
        space: "O(n)",
        code: `function minOperations(n) {
  const memo = new Map();
  
  function dp(num) {
    if (num === 0) return 0;
    if (memo.has(num)) return memo.get(num);
    
    let result = 1 + dp(num - 1);
    if (num % 2 === 0) {
      result = Math.min(result, 1 + dp(num / 2));
    }
    
    memo.set(num, result);
    return result;
  }
  
  return dp(n);
}`,
      },
      {
        name: "Optimal - Greedy",
        approach: "Bit manipulation greedy approach",
        time: "O(log n)",
        space: "O(1)",
        code: `function minOperations(n) {
  let operations = 0;
  while (n > 0) {
    if (n % 2 === 0) {
      n = n / 2;
      operations++;
    } else {
      n = n - 1;
      operations++;
    }
  }
  return operations;
}`,
      },
    ],
  },
  {
    id: 1143,
    title: "Longest Common Subsequence",
    difficulty: "Medium",
    acceptance: "58.7%",
    categories: ["Dynamic Programming", "String"],
    leetcodeUrl: "https://leetcode.com/problems/longest-common-subsequence/",
    description: `Given two strings text1 and text2, return the length of their longest common subsequence. If there is no common subsequence, return 0.

A subsequence of a string is a new string generated from the original string with some characters (can be none) deleted without changing the relative order of the remaining characters.`,
    solutions: [
      {
        name: "Recursive",
        approach: "Top-down recursion",
        time: "O(2^(m+n))",
        space: "O(m+n)",
        code: `function longestCommonSubsequence(text1, text2) {
  function lcs(i, j) {
    if (i === 0 || j === 0) return 0;
    if (text1[i - 1] === text2[j - 1]) {
      return 1 + lcs(i - 1, j - 1);
    }
    return Math.max(lcs(i - 1, j), lcs(i, j - 1));
  }
  return lcs(text1.length, text2.length);
}`,
      },
      {
        name: "Memoized DP",
        approach: "Top-down with memoization",
        time: "O(m*n)",
        space: "O(m*n)",
        code: `function longestCommonSubsequence(text1, text2) {
  const memo = new Map();
  
  function lcs(i, j) {
    if (i === 0 || j === 0) return 0;
    const key = \`\${i},\${j}\`;
    if (memo.has(key)) return memo.get(key);
    
    let result;
    if (text1[i - 1] === text2[j - 1]) {
      result = 1 + lcs(i - 1, j - 1);
    } else {
      result = Math.max(lcs(i - 1, j), lcs(i, j - 1));
    }
    
    memo.set(key, result);
    return result;
  }
  
  return lcs(text1.length, text2.length);
}`,
      },
      {
        name: "Optimal - Bottom-up DP",
        approach: "2D DP table",
        time: "O(m*n)",
        space: "O(m*n)",
        code: `function longestCommonSubsequence(text1, text2) {
  const m = text1.length;
  const n = text2.length;
  const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));
  
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (text1[i - 1] === text2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }
  
  return dp[m][n];
}`,
      },
    ],
  },
  {
    id: 3295,
    title: "Report Spam Message",
    difficulty: "Medium",
    acceptance: "48.4%",
    categories: ["Array", "Hash Table"],
    leetcodeUrl: "https://leetcode.com/problems/report-spam-message/",
    description: `You are given an array of messages and an array of bannedWords. Return whether each message should be reported as spam.`,
    solutions: [
      {
        name: "Naive - String Matching",
        approach: "Check each word against banned list",
        time: "O(n*m*k)",
        space: "O(1)",
        code: `function reportSpam(messages, bannedWords) {
  const bannedSet = new Set(bannedWords);
  return messages.map(msg => {
    const words = msg.toLowerCase().split(/\\W+/);
    return words.some(word => bannedSet.has(word));
  });
}`,
      },
      {
        name: "Optimal - Set Lookup",
        approach: "Use Set for O(1) lookup",
        time: "O(n*m)",
        space: "O(b)",
        code: `function reportSpam(messages, bannedWords) {
  const bannedSet = new Set(bannedWords.map(w => w.toLowerCase()));
  return messages.map(msg => {
    const words = msg.toLowerCase().split(/\\W+/);
    return words.some(word => bannedSet.has(word));
  });
}`,
      },
    ],
  },
  {
    id: 3613,
    title: "Minimize Maximum Component Cost",
    difficulty: "Medium",
    acceptance: "43.2%",
    categories: ["Graph", "Union Find", "Binary Search"],
    leetcodeUrl: "https://leetcode.com/problems/minimize-maximum-component-cost/",
    description: `Given a graph and edge costs, minimize the maximum component cost.`,
    solutions: [
      {
        name: "Union Find",
        approach: "Use union find with cost tracking",
        time: "O(n log n)",
        space: "O(n)",
        code: `class UnionFind {
  constructor(n) {
    this.parent = Array.from({length: n}, (_, i) => i);
    this.size = Array(n).fill(1);
    this.cost = Array(n).fill(0);
  }
  
  find(x) {
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]);
    }
    return this.parent[x];
  }
  
  union(x, y, edgeCost) {
    const px = this.find(x);
    const py = this.find(y);
    if (px === py) return;
    
    if (this.size[px] < this.size[py]) {
      this.parent[px] = py;
      this.cost[py] += this.cost[px] + edgeCost;
      this.size[py] += this.size[px];
    } else {
      this.parent[py] = px;
      this.cost[px] += this.cost[py] + edgeCost;
      this.size[px] += this.size[py];
    }
  }
}`,
      },
    ],
  },
  {
    id: 740,
    title: "Delete and Earn",
    difficulty: "Medium",
    acceptance: "57.0%",
    categories: ["Dynamic Programming", "Array"],
    leetcodeUrl: "https://leetcode.com/problems/delete-and-earn/",
    description: `You are given an integer array nums. You want to maximize the number of points you get by performing the following operation any number of times:
- Pick any nums[i] and delete it to earn nums[i] points. Afterwards, you must delete every element equal to nums[i] - 1 and every element equal to nums[i] + 1.`,
    solutions: [
      {
        name: "Naive Recursion",
        approach: "Try all possibilities",
        time: "O(2^n)",
        space: "O(n)",
        code: `function deleteAndEarn(nums) {
  function dfs(remaining) {
    if (remaining.length === 0) return 0;
    let maxEarn = 0;
    for (let i = 0; i < remaining.length; i++) {
      const num = remaining[i];
      const filtered = remaining.filter(n => n !== num - 1 && n !== num && n !== num + 1);
      maxEarn = Math.max(maxEarn, num + dfs(filtered));
    }
    return maxEarn;
  }
  return dfs(nums);
}`,
      },
      {
        name: "Optimal - DP",
        approach: "Transform to house robber problem",
        time: "O(n + k)",
        space: "O(k)",
        code: `function deleteAndEarn(nums) {
  const points = new Map();
  let maxNum = 0;
  
  for (const num of nums) {
    points.set(num, (points.get(num) || 0) + num);
    maxNum = Math.max(maxNum, num);
  }
  
  let twoBack = 0;
  let oneBack = points.get(1) || 0;
  
  for (let num = 2; num <= maxNum; num++) {
    const temp = oneBack;
    oneBack = Math.max(oneBack, twoBack + (points.get(num) || 0));
    twoBack = temp;
  }
  
  return oneBack;
}`,
      },
    ],
  },
  {
    id: 49,
    title: "Group Anagrams",
    difficulty: "Medium",
    acceptance: "71.9%",
    categories: ["Hash Table", "String", "Sorting"],
    leetcodeUrl: "https://leetcode.com/problems/group-anagrams/",
    description: `Given an array of strings strs, group the anagrams together. You can return the answer in any order.`,
    solutions: [
      {
        name: "Sorting Approach",
        approach: "Sort each string and use as key",
        time: "O(n*k*log k)",
        space: "O(n*k)",
        code: `function groupAnagrams(strs) {
  const groups = new Map();
  
  for (const str of strs) {
    const sorted = str.split('').sort().join('');
    if (!groups.has(sorted)) {
      groups.set(sorted, []);
    }
    groups.get(sorted).push(str);
  }
  
  return Array.from(groups.values());
}`,
      },
      {
        name: "Optimal - Character Count",
        approach: "Use character count as key",
        time: "O(n*k)",
        space: "O(n*k)",
        code: `function groupAnagrams(strs) {
  const groups = new Map();
  
  for (const str of strs) {
    const count = Array(26).fill(0);
    for (const char of str) {
      count[char.charCodeAt(0) - 'a'.charCodeAt(0)]++;
    }
    const key = count.join(',');
    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key).push(str);
  }
  
  return Array.from(groups.values());
}`,
      },
    ],
  },
  {
    id: 2451,
    title: "Odd String Difference",
    difficulty: "Easy",
    acceptance: "61.7%",
    categories: ["Array", "Hash Table", "String"],
    leetcodeUrl: "https://leetcode.com/problems/odd-string-difference/",
    description: `You are given an array of strings words, where each string is of the same length. One string is different from the others. Find and return it.`,
    solutions: [
      {
        name: "Compare Differences",
        approach: "Compare difference arrays",
        time: "O(n*k)",
        space: "O(k)",
        code: `function oddString(words) {
  const getDifference = (word) => {
    const diff = [];
    for (let i = 1; i < word.length; i++) {
      diff.push(word.charCodeAt(i) - word.charCodeAt(i - 1));
    }
    return diff.join(',');
  };
  
  const diff1 = getDifference(words[0]);
  const diff2 = getDifference(words[1]);
  
  if (diff1 === diff2) {
    for (let i = 2; i < words.length; i++) {
      if (getDifference(words[i]) !== diff1) {
        return words[i];
      }
    }
  } else {
    const diff3 = getDifference(words[2]);
    return diff3 === diff1 ? words[1] : words[0];
  }
}`,
      },
    ],
  },
  {
    id: 545,
    title: "Boundary of Binary Tree",
    difficulty: "Medium",
    acceptance: "47.7%",
    categories: ["Tree", "DFS"],
    leetcodeUrl: "https://leetcode.com/problems/boundary-of-binary-tree/",
    description: `The boundary of a binary tree is the concatenation of the root, the left boundary, the leaves, and the right boundary.`,
    solutions: [
      {
        name: "Three Pass",
        approach: "Collect left boundary, leaves, right boundary separately",
        time: "O(n)",
        space: "O(n)",
        code: `function boundaryOfBinaryTree(root) {
  if (!root) return [];
  if (!root.left && !root.right) return [root.val];
  
  const leftBoundary = [];
  const leaves = [];
  const rightBoundary = [];
  
  function getLeftBoundary(node) {
    if (!node || (!node.left && !node.right)) return;
    leftBoundary.push(node.val);
    if (node.left) getLeftBoundary(node.left);
    else getLeftBoundary(node.right);
  }
  
  function getLeaves(node) {
    if (!node) return;
    if (!node.left && !node.right) {
      leaves.push(node.val);
      return;
    }
    getLeaves(node.left);
    getLeaves(node.right);
  }
  
  function getRightBoundary(node) {
    if (!node || (!node.left && !node.right)) return;
    rightBoundary.push(node.val);
    if (node.right) getRightBoundary(node.right);
    else getRightBoundary(node.left);
  }
  
  getLeftBoundary(root.left);
  getLeaves(root);
  getRightBoundary(root.right);
  
  return [root.val, ...leftBoundary, ...leaves, ...rightBoundary.reverse()];
}`,
      },
    ],
  },
  {
    id: 3,
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    acceptance: "38.2%",
    categories: ["Hash Table", "String", "Sliding Window"],
    leetcodeUrl: "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
    description: `Given a string s, find the length of the longest substring without repeating characters.`,
    solutions: [
      {
        name: "Brute Force",
        approach: "Check all substrings",
        time: "O(n^3)",
        space: "O(min(n,m))",
        code: `function lengthOfLongestSubstring(s) {
  let maxLen = 0;
  for (let i = 0; i < s.length; i++) {
    for (let j = i; j < s.length; j++) {
      const substring = s.substring(i, j + 1);
      const chars = new Set(substring);
      if (chars.size === substring.length) {
        maxLen = Math.max(maxLen, substring.length);
      }
    }
  }
  return maxLen;
}`,
      },
      {
        name: "Optimal - Sliding Window",
        approach: "Use two pointers with HashMap",
        time: "O(n)",
        space: "O(min(n,m))",
        code: `function lengthOfLongestSubstring(s) {
  const charMap = new Map();
  let maxLen = 0;
  let left = 0;
  
  for (let right = 0; right < s.length; right++) {
    const char = s[right];
    if (charMap.has(char) && charMap.get(char) >= left) {
      left = charMap.get(char) + 1;
    }
    charMap.set(char, right);
    maxLen = Math.max(maxLen, right - left + 1);
  }
  
  return maxLen;
}`,
      },
    ],
  },
  {
    id: 56,
    title: "Merge Intervals",
    difficulty: "Medium",
    acceptance: "50.8%",
    categories: ["Array", "Sorting"],
    leetcodeUrl: "https://leetcode.com/problems/merge-intervals/",
    description: `Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.`,
    solutions: [
      {
        name: "Sort and Merge",
        approach: "Sort by start time, then merge",
        time: "O(n log n)",
        space: "O(n)",
        code: `function merge(intervals) {
  intervals.sort((a, b) => a[0] - b[0]);
  const merged = [];
  let current = intervals[0];
  
  for (let i = 1; i < intervals.length; i++) {
    if (current[1] >= intervals[i][0]) {
      current[1] = Math.max(current[1], intervals[i][1]);
    } else {
      merged.push(current);
      current = intervals[i];
    }
  }
  merged.push(current);
  return merged;
}`,
      },
      {
        name: "Optimal - Reduce",
        approach: "Use reduce for cleaner code",
        time: "O(n log n)",
        space: "O(n)",
        code: `function merge(intervals) {
  intervals.sort((a, b) => a[0] - b[0]);
  return intervals.reduce((merged, interval) => {
    if (!merged.length || merged[merged.length - 1][1] < interval[0]) {
      merged.push(interval);
    } else {
      merged[merged.length - 1][1] = Math.max(
        merged[merged.length - 1][1],
        interval[1]
      );
    }
    return merged;
  }, []);
}`,
      },
    ],
  },
  {
    id: 1319,
    title: "Number of Operations to Make Network Connected",
    difficulty: "Medium",
    acceptance: "65.9%",
    categories: ["DFS", "Union Find", "Graph"],
    leetcodeUrl: "https://leetcode.com/problems/number-of-operations-to-make-network-connected/",
    description: `You are given a computer network with n computers. Return the minimum number of operations to make all computers connected.`,
    solutions: [
      {
        name: "Union Find",
        approach: "Find connected components",
        time: "O(n*α(n))",
        space: "O(n)",
        code: `function makeConnected(n, connections) {
  if (connections.length < n - 1) return -1;
  
  const parent = Array.from({length: n}, (_, i) => i);
  
  function find(x) {
    if (parent[x] !== x) {
      parent[x] = find(parent[x]);
    }
    return parent[x];
  }
  
  function union(x, y) {
    parent[find(x)] = find(y);
  }
  
  for (const [a, b] of connections) {
    union(a, b);
  }
  
  let components = 0;
  for (let i = 0; i < n; i++) {
    if (find(i) === i) components++;
  }
  
  return components - 1;
}`,
      },
    ],
  },
  {
    id: 20,
    title: "Valid Parentheses",
    difficulty: "Easy",
    acceptance: "43.4%",
    categories: ["String", "Stack"],
    leetcodeUrl: "https://leetcode.com/problems/valid-parentheses/",
    description: `Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.`,
    solutions: [
      {
        name: "Stack Approach",
        approach: "Use stack to match parentheses",
        time: "O(n)",
        space: "O(n)",
        code: `function isValid(s) {
  const stack = [];
  const pairs = {
    '(': ')',
    '{': '}',
    '[': ']'
  };
  
  for (const char of s) {
    if (pairs[char]) {
      stack.push(char);
    } else {
      if (stack.length === 0 || pairs[stack.pop()] !== char) {
        return false;
      }
    }
  }
  
  return stack.length === 0;
}`,
      },
    ],
  },
  {
    id: 1209,
    title: "Remove All Adjacent Duplicates in String II",
    difficulty: "Medium",
    acceptance: "60.7%",
    categories: ["String", "Stack"],
    leetcodeUrl: "https://leetcode.com/problems/remove-all-adjacent-duplicates-in-string-ii/",
    description: `You are given a string s and an integer k. Remove k adjacent duplicates and return the final string.`,
    solutions: [
      {
        name: "Stack with Count",
        approach: "Track character counts in stack",
        time: "O(n)",
        space: "O(n)",
        code: `function removeDuplicates(s, k) {
  const stack = [];
  
  for (const char of s) {
    if (stack.length && stack[stack.length - 1][0] === char) {
      stack[stack.length - 1][1]++;
      if (stack[stack.length - 1][1] === k) {
        stack.pop();
      }
    } else {
      stack.push([char, 1]);
    }
  }
  
  return stack.map(([char, count]) => char.repeat(count)).join('');
}`,
      },
    ],
  },
  {
    id: 124,
    title: "Binary Tree Maximum Path Sum",
    difficulty: "Hard",
    acceptance: "41.9%",
    categories: ["Dynamic Programming", "Tree", "DFS"],
    leetcodeUrl: "https://leetcode.com/problems/binary-tree-maximum-path-sum/",
    description: `A path in a binary tree is a sequence of nodes where each pair of adjacent nodes has an edge connecting them. Return the maximum path sum.`,
    solutions: [
      {
        name: "DFS with Global Max",
        approach: "Track max path through each node",
        time: "O(n)",
        space: "O(h)",
        code: `function maxPathSum(root) {
  let maxSum = -Infinity;
  
  function dfs(node) {
    if (!node) return 0;
    
    const leftSum = Math.max(0, dfs(node.left));
    const rightSum = Math.max(0, dfs(node.right));
    
    const currentPathSum = node.val + leftSum + rightSum;
    maxSum = Math.max(maxSum, currentPathSum);
    
    return node.val + Math.max(leftSum, rightSum);
  }
  
  dfs(root);
  return maxSum;
}`,
      },
    ],
  },
  {
    id: 215,
    title: "Kth Largest Element in an Array",
    difficulty: "Medium",
    acceptance: "68.7%",
    categories: ["Array", "Divide and Conquer", "Sorting", "Heap"],
    leetcodeUrl: "https://leetcode.com/problems/kth-largest-element-in-an-array/",
    description: `Given an integer array nums and an integer k, return the kth largest element in the array.`,
    solutions: [
      {
        name: "Sorting",
        approach: "Sort and return kth element",
        time: "O(n log n)",
        space: "O(1)",
        code: `function findKthLargest(nums, k) {
  nums.sort((a, b) => b - a);
  return nums[k - 1];
}`,
      },
      {
        name: "Optimal - Quick Select",
        approach: "Use partition algorithm",
        time: "O(n) average",
        space: "O(1)",
        code: `function findKthLargest(nums, k) {
  function partition(left, right, pivotIndex) {
    const pivotValue = nums[pivotIndex];
    [nums[pivotIndex], nums[right]] = [nums[right], nums[pivotIndex]];
    let storeIndex = left;
    
    for (let i = left; i < right; i++) {
      if (nums[i] > pivotValue) {
        [nums[storeIndex], nums[i]] = [nums[i], nums[storeIndex]];
        storeIndex++;
      }
    }
    [nums[right], nums[storeIndex]] = [nums[storeIndex], nums[right]];
    return storeIndex;
  }
  
  function select(left, right, k) {
    if (left === right) return nums[left];
    
    let pivotIndex = left + Math.floor(Math.random() * (right - left + 1));
    pivotIndex = partition(left, right, pivotIndex);
    
    if (k === pivotIndex) {
      return nums[k];
    } else if (k < pivotIndex) {
      return select(left, pivotIndex - 1, k);
    } else {
      return select(pivotIndex + 1, right, k);
    }
  }
  
  return select(0, nums.length - 1, k - 1);
}`,
      },
    ],
  },
  {
    id: 332,
    title: "Reconstruct Itinerary",
    difficulty: "Hard",
    acceptance: "44.1%",
    categories: ["DFS", "Graph", "Eulerian Circuit"],
    leetcodeUrl: "https://leetcode.com/problems/reconstruct-itinerary/",
    description: `You are given a list of airline tickets. Reconstruct the itinerary in order.`,
    solutions: [
      {
        name: "DFS with Backtracking",
        approach: "Try all paths until valid one found",
        time: "O(n!)",
        space: "O(n)",
        code: `function findItinerary(tickets) {
  const graph = new Map();
  for (const [from, to] of tickets) {
    if (!graph.has(from)) graph.set(from, []);
    graph.get(from).push(to);
  }
  
  for (const destinations of graph.values()) {
    destinations.sort();
  }
  
  const result = [];
  function dfs(airport) {
    while (graph.has(airport) && graph.get(airport).length > 0) {
      const next = graph.get(airport).shift();
      dfs(next);
    }
    result.push(airport);
  }
  
  dfs('JFK');
  return result.reverse();
}`,
      },
    ],
  },
  {
    id: 863,
    title: "All Nodes Distance K in Binary Tree",
    difficulty: "Medium",
    acceptance: "67.3%",
    categories: ["Tree", "DFS", "BFS"],
    leetcodeUrl: "https://leetcode.com/problems/all-nodes-distance-k-in-binary-tree/",
    description: `Given the root of a binary tree, the value of a target node target, and an integer k, return an array of the values of all nodes that have a distance k from the target node.`,
    solutions: [
      {
        name: "BFS from Target",
        approach: "Build parent map then BFS",
        time: "O(n)",
        space: "O(n)",
        code: `function distanceK(root, target, k) {
  const parentMap = new Map();
  const visited = new Set();
  const result = [];
  
  function buildParentMap(node, parent) {
    if (!node) return;
    parentMap.set(node, parent);
    buildParentMap(node.left, node);
    buildParentMap(node.right, node);
  }
  
  buildParentMap(root, null);
  
  function bfs(start, distance) {
    const queue = [[start, 0]];
    visited.add(start);
    
    while (queue.length) {
      const [node, dist] = queue.shift();
      
      if (dist === k) {
        result.push(node.val);
        continue;
      }
      
      for (const neighbor of [node.left, node.right, parentMap.get(node)]) {
        if (neighbor && !visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push([neighbor, dist + 1]);
        }
      }
    }
  }
  
  bfs(target, 0);
  return result;
}`,
      },
    ],
  },
  {
    id: 329,
    title: "Longest Increasing Path in a Matrix",
    difficulty: "Hard",
    acceptance: "56.1%",
    categories: ["Dynamic Programming", "DFS", "Memoization"],
    leetcodeUrl: "https://leetcode.com/problems/longest-increasing-path-in-a-matrix/",
    description: `Given an m x n integers matrix, return the length of the longest increasing path in matrix.`,
    solutions: [
      {
        name: "DFS with Memoization",
        approach: "Memoize longest path from each cell",
        time: "O(m*n)",
        space: "O(m*n)",
        code: `function longestIncreasingPath(matrix) {
  const m = matrix.length;
  const n = matrix[0].length;
  const memo = Array(m).fill().map(() => Array(n).fill(0));
  let maxPath = 0;
  
  const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];
  
  function dfs(i, j) {
    if (memo[i][j] > 0) return memo[i][j];
    
    let maxLen = 1;
    for (const [di, dj] of directions) {
      const ni = i + di;
      const nj = j + dj;
      if (ni >= 0 && ni < m && nj >= 0 && nj < n && 
          matrix[ni][nj] > matrix[i][j]) {
        maxLen = Math.max(maxLen, 1 + dfs(ni, nj));
      }
    }
    
    memo[i][j] = maxLen;
    return maxLen;
  }
  
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      maxPath = Math.max(maxPath, dfs(i, j));
    }
  }
  
  return maxPath;
}`,
      },
    ],
  },
  {
    id: 268,
    title: "Missing Number",
    difficulty: "Easy",
    acceptance: "71.3%",
    categories: ["Array", "Hash Table", "Math", "Bit Manipulation"],
    leetcodeUrl: "https://leetcode.com/problems/missing-number/",
    description: `Given an array nums containing n distinct numbers in the range [0, n], return the only number in the range that is missing from the array.`,
    solutions: [
      {
        name: "Hash Set",
        approach: "Use set to find missing number",
        time: "O(n)",
        space: "O(n)",
        code: `function missingNumber(nums) {
  const numSet = new Set(nums);
  for (let i = 0; i <= nums.length; i++) {
    if (!numSet.has(i)) return i;
  }
}`,
      },
      {
        name: "Optimal - Math",
        approach: "Use sum formula",
        time: "O(n)",
        space: "O(1)",
        code: `function missingNumber(nums) {
  const n = nums.length;
  const expectedSum = (n * (n + 1)) / 2;
  const actualSum = nums.reduce((sum, num) => sum + num, 0);
  return expectedSum - actualSum;
}`,
      },
      {
        name: "Optimal - XOR",
        approach: "Use XOR property",
        time: "O(n)",
        space: "O(1)",
        code: `function missingNumber(nums) {
  let missing = nums.length;
  for (let i = 0; i < nums.length; i++) {
    missing ^= i ^ nums[i];
  }
  return missing;
}`,
      },
    ],
  },
  {
    id: 347,
    title: "Top K Frequent Elements",
    difficulty: "Medium",
    acceptance: "65.5%",
    categories: ["Array", "Hash Table", "Heap", "Sorting"],
    leetcodeUrl: "https://leetcode.com/problems/top-k-frequent-elements/",
    description: `Given an integer array nums and an integer k, return the k most frequent elements.`,
    solutions: [
      {
        name: "Sort by Frequency",
        approach: "Count then sort",
        time: "O(n log n)",
        space: "O(n)",
        code: `function topKFrequent(nums, k) {
  const count = new Map();
  for (const num of nums) {
    count.set(num, (count.get(num) || 0) + 1);
  }
  
  return Array.from(count.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, k)
    .map(([num]) => num);
}`,
      },
      {
        name: "Optimal - Bucket Sort",
        approach: "Use frequency buckets",
        time: "O(n)",
        space: "O(n)",
        code: `function topKFrequent(nums, k) {
  const count = new Map();
  for (const num of nums) {
    count.set(num, (count.get(num) || 0) + 1);
  }
  
  const buckets = Array(nums.length + 1).fill().map(() => []);
  for (const [num, freq] of count.entries()) {
    buckets[freq].push(num);
  }
  
  const result = [];
  for (let i = buckets.length - 1; i >= 0 && result.length < k; i--) {
    result.push(...buckets[i]);
  }
  
  return result.slice(0, k);
}`,
      },
    ],
  },
  {
    id: 11,
    title: "Container With Most Water",
    difficulty: "Medium",
    acceptance: "59.2%",
    categories: ["Array", "Two Pointers", "Greedy"],
    leetcodeUrl: "https://leetcode.com/problems/container-with-most-water/",
    description: `You are given an integer array height of length n. Return the maximum amount of water a container can store.`,
    solutions: [
      {
        name: "Brute Force",
        approach: "Check all pairs",
        time: "O(n^2)",
        space: "O(1)",
        code: `function maxArea(height) {
  let maxWater = 0;
  for (let i = 0; i < height.length; i++) {
    for (let j = i + 1; j < height.length; j++) {
      const area = Math.min(height[i], height[j]) * (j - i);
      maxWater = Math.max(maxWater, area);
    }
  }
  return maxWater;
}`,
      },
      {
        name: "Optimal - Two Pointers",
        approach: "Start from both ends",
        time: "O(n)",
        space: "O(1)",
        code: `function maxArea(height) {
  let left = 0;
  let right = height.length - 1;
  let maxWater = 0;
  
  while (left < right) {
    const area = Math.min(height[left], height[right]) * (right - left);
    maxWater = Math.max(maxWater, area);
    
    if (height[left] < height[right]) {
      left++;
    } else {
      right--;
    }
  }
  
  return maxWater;
}`,
      },
    ],
  },
  {
    id: 200,
    title: "Number of Islands",
    difficulty: "Medium",
    acceptance: "63.5%",
    categories: ["Array", "DFS", "BFS", "Union Find"],
    leetcodeUrl: "https://leetcode.com/problems/number-of-islands/",
    description: `Given an m x n 2D binary grid grid which represents a map of '1's (land) and '0's (water), return the number of islands.`,
    solutions: [
      {
        name: "DFS",
        approach: "DFS to mark visited islands",
        time: "O(m*n)",
        space: "O(m*n)",
        code: `function numIslands(grid) {
  if (!grid || grid.length === 0) return 0;
  
  const m = grid.length;
  const n = grid[0].length;
  let count = 0;
  
  function dfs(i, j) {
    if (i < 0 || i >= m || j < 0 || j >= n || grid[i][j] === '0') {
      return;
    }
    
    grid[i][j] = '0';
    dfs(i + 1, j);
    dfs(i - 1, j);
    dfs(i, j + 1);
    dfs(i, j - 1);
  }
  
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (grid[i][j] === '1') {
        count++;
        dfs(i, j);
      }
    }
  }
  
  return count;
}`,
      },
    ],
  },
  {
    id: 213,
    title: "House Robber II",
    difficulty: "Medium",
    acceptance: "44.4%",
    categories: ["Array", "Dynamic Programming"],
    leetcodeUrl: "https://leetcode.com/problems/house-robber-ii/",
    description: `You are a professional robber planning to rob houses arranged in a circle. Return the maximum amount of money you can rob.`,
    solutions: [
      {
        name: "Two Pass DP",
        approach: "Rob first house or skip it",
        time: "O(n)",
        space: "O(n)",
        code: `function rob(nums) {
  if (nums.length === 1) return nums[0];
  if (nums.length === 2) return Math.max(nums[0], nums[1]);
  
  function robLinear(houses) {
    let prev2 = 0;
    let prev1 = 0;
    
    for (const money of houses) {
      const temp = prev1;
      prev1 = Math.max(prev2 + money, prev1);
      prev2 = temp;
    }
    
    return prev1;
  }
  
  return Math.max(
    robLinear(nums.slice(0, -1)),
    robLinear(nums.slice(1))
  );
}`,
      },
    ],
  },
  {
    id: 2380,
    title: "Time Needed to Rearrange a Binary String",
    difficulty: "Medium",
    acceptance: "52.3%",
    categories: ["String", "Simulation"],
    leetcodeUrl: "https://leetcode.com/problems/time-needed-to-rearrange-a-binary-string/",
    description: `You are given a binary string s. In one second, all occurrences of "01" are simultaneously replaced with "10". Return the number of seconds needed to complete the process.`,
    solutions: [
      {
        name: "Simulation",
        approach: "Simulate each second",
        time: "O(n^2)",
        space: "O(n)",
        code: `function secondsToRemoveOccurrences(s) {
  let seconds = 0;
  let str = s;
  
  while (str.includes('01')) {
    str = str.replace(/01/g, '10');
    seconds++;
  }
  
  return seconds;
}`,
      },
      {
        name: "Optimal - Count",
        approach: "Count ones and zeros",
        time: "O(n)",
        space: "O(1)",
        code: `function secondsToRemoveOccurrences(s) {
  let zeros = 0;
  let seconds = 0;
  
  for (const char of s) {
    if (char === '0') {
      zeros++;
    } else if (zeros > 0) {
      seconds = Math.max(seconds + 1, zeros);
    }
  }
  
  return seconds;
}`,
      },
    ],
  },
  {
    id: 155,
    title: "Min Stack",
    difficulty: "Medium",
    acceptance: "57.5%",
    categories: ["Stack", "Design"],
    leetcodeUrl: "https://leetcode.com/problems/min-stack/",
    description: `Design a stack that supports push, pop, top, and retrieving the minimum element in constant time.`,
    solutions: [
      {
        name: "Two Stacks",
        approach: "Maintain separate min stack",
        time: "O(1) all operations",
        space: "O(n)",
        code: `class MinStack {
  constructor() {
    this.stack = [];
    this.minStack = [];
  }
  
  push(val) {
    this.stack.push(val);
    if (this.minStack.length === 0 || val <= this.minStack[this.minStack.length - 1]) {
      this.minStack.push(val);
    }
  }
  
  pop() {
    const val = this.stack.pop();
    if (val === this.minStack[this.minStack.length - 1]) {
      this.minStack.pop();
    }
    return val;
  }
  
  top() {
    return this.stack[this.stack.length - 1];
  }
  
  getMin() {
    return this.minStack[this.minStack.length - 1];
  }
}`,
      },
    ],
  },
  {
    id: 994,
    title: "Rotting Oranges",
    difficulty: "Medium",
    acceptance: "57.8%",
    categories: ["Array", "BFS", "Matrix"],
    leetcodeUrl: "https://leetcode.com/problems/rotting-oranges/",
    description: `You are given an m x n grid where each cell can have one of three values: 0 (empty), 1 (fresh orange), or 2 (rotten orange). Return the minimum number of minutes until no cell has a fresh orange.`,
    solutions: [
      {
        name: "BFS",
        approach: "Multi-source BFS",
        time: "O(m*n)",
        space: "O(m*n)",
        code: `function orangesRotting(grid) {
  const m = grid.length;
  const n = grid[0].length;
  const queue = [];
  let freshCount = 0;
  
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (grid[i][j] === 2) {
        queue.push([i, j, 0]);
      } else if (grid[i][j] === 1) {
        freshCount++;
      }
    }
  }
  
  const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];
  let minutes = 0;
  
  while (queue.length) {
    const [i, j, time] = queue.shift();
    minutes = time;
    
    for (const [di, dj] of directions) {
      const ni = i + di;
      const nj = j + dj;
      if (ni >= 0 && ni < m && nj >= 0 && nj < n && grid[ni][nj] === 1) {
        grid[ni][nj] = 2;
        freshCount--;
        queue.push([ni, nj, time + 1]);
      }
    }
  }
  
  return freshCount === 0 ? minutes : -1;
}`,
      },
    ],
  },
  {
    id: 1219,
    title: "Path with Maximum Gold",
    difficulty: "Medium",
    acceptance: "68.3%",
    categories: ["Array", "Backtracking", "Matrix"],
    leetcodeUrl: "https://leetcode.com/problems/path-with-maximum-gold/",
    description: `In a gold mine grid, return the maximum amount of gold you can collect.`,
    solutions: [
      {
        name: "DFS Backtracking",
        approach: "Try all paths from each cell",
        time: "O(4^k)",
        space: "O(k)",
        code: `function getMaximumGold(grid) {
  const m = grid.length;
  const n = grid[0].length;
  let maxGold = 0;
  
  function dfs(i, j, currentGold) {
    if (i < 0 || i >= m || j < 0 || j >= n || grid[i][j] === 0) {
      return currentGold;
    }
    
    const gold = grid[i][j];
    grid[i][j] = 0;
    
    const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];
    let maxPath = currentGold + gold;
    
    for (const [di, dj] of directions) {
      maxPath = Math.max(maxPath, dfs(i + di, j + dj, currentGold + gold));
    }
    
    grid[i][j] = gold;
    return maxPath;
  }
  
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (grid[i][j] !== 0) {
        maxGold = Math.max(maxGold, dfs(i, j, 0));
      }
    }
  }
  
  return maxGold;
}`,
      },
    ],
  },
  {
    id: 1522,
    title: "Diameter of N-Ary Tree",
    difficulty: "Medium",
    acceptance: "75.4%",
    categories: ["Tree", "DFS"],
    leetcodeUrl: "https://leetcode.com/problems/diameter-of-n-ary-tree/",
    description: `Given a root of an N-ary tree, return the diameter of the tree.`,
    solutions: [
      {
        name: "DFS",
        approach: "Track two longest paths through each node",
        time: "O(n)",
        space: "O(h)",
        code: `function diameter(root) {
  let maxDiameter = 0;
  
  function dfs(node) {
    if (!node || !node.children || node.children.length === 0) {
      return 0;
    }
    
    let max1 = 0;
    let max2 = 0;
    
    for (const child of node.children) {
      const height = 1 + dfs(child);
      if (height > max1) {
        max2 = max1;
        max1 = height;
      } else if (height > max2) {
        max2 = height;
      }
    }
    
    maxDiameter = Math.max(maxDiameter, max1 + max2);
    return max1;
  }
  
  dfs(root);
  return maxDiameter;
}`,
      },
    ],
  },
  {
    id: 25,
    title: "Reverse Nodes in k-Group",
    difficulty: "Hard",
    acceptance: "64.9%",
    categories: ["Linked List", "Recursion"],
    leetcodeUrl: "https://leetcode.com/problems/reverse-nodes-in-k-group/",
    description: `Given the head of a linked list, reverse the nodes of the list k at a time, and return the modified list.`,
    solutions: [
      {
        name: "Iterative",
        approach: "Reverse k nodes at a time",
        time: "O(n)",
        space: "O(1)",
        code: `function reverseKGroup(head, k) {
  function reverseLinkedList(head, k) {
    let prev = null;
    let current = head;
    for (let i = 0; i < k; i++) {
      const next = current.next;
      current.next = prev;
      prev = current;
      current = next;
    }
    return [prev, current];
  }
  
  function getLength(head) {
    let len = 0;
    while (head) {
      len++;
      head = head.next;
    }
    return len;
  }
  
  const length = getLength(head);
  const dummy = { next: head };
  let groupPrev = dummy;
  
  while (length - (groupPrev.next === head ? 0 : getLength(head)) >= k) {
    const kth = getKth(groupPrev, k);
    const groupNext = kth.next;
    
    const [newHead, nextGroup] = reverseLinkedList(groupPrev.next, k);
    groupPrev.next = newHead;
    groupPrev.next.next = nextGroup;
    groupPrev = getKth(groupPrev, k);
  }
  
  return dummy.next;
}

function getKth(curr, k) {
  while (curr && k > 0) {
    curr = curr.next;
    k--;
  }
  return curr;
}`,
      },
    ],
  },
  {
    id: 5,
    title: "Longest Palindromic Substring",
    difficulty: "Medium",
    acceptance: "37.0%",
    categories: ["String", "Dynamic Programming"],
    leetcodeUrl: "https://leetcode.com/problems/longest-palindromic-substring/",
    description: `Given a string s, return the longest palindromic substring in s.`,
    solutions: [
      {
        name: "Expand Around Centers",
        approach: "Check odd and even length palindromes",
        time: "O(n^2)",
        space: "O(1)",
        code: `function longestPalindrome(s) {
  let start = 0;
  let maxLen = 1;
  
  function expandAroundCenter(left, right) {
    while (left >= 0 && right < s.length && s[left] === s[right]) {
      left--;
      right++;
    }
    return right - left - 1;
  }
  
  for (let i = 0; i < s.length; i++) {
    const len1 = expandAroundCenter(i, i);
    const len2 = expandAroundCenter(i, i + 1);
    const len = Math.max(len1, len2);
    
    if (len > maxLen) {
      maxLen = len;
      start = i - Math.floor((len - 1) / 2);
    }
  }
  
  return s.substring(start, start + maxLen);
}`,
      },
      {
        name: "Optimal - Manacher's Algorithm",
        approach: "Linear time palindrome detection",
        time: "O(n)",
        space: "O(n)",
        code: `function longestPalindrome(s) {
  const transformed = '#' + s.split('').join('#') + '#';
  const n = transformed.length;
  const p = Array(n).fill(0);
  let center = 0;
  let right = 0;
  let maxLen = 0;
  let centerIndex = 0;
  
  for (let i = 0; i < n; i++) {
    const mirror = 2 * center - i;
    
    if (i < right) {
      p[i] = Math.min(right - i, p[mirror]);
    }
    
    let leftBound = i - (p[i] + 1);
    let rightBound = i + (p[i] + 1);
    
    while (leftBound >= 0 && rightBound < n && 
           transformed[leftBound] === transformed[rightBound]) {
      p[i]++;
      leftBound--;
      rightBound++;
    }
    
    if (i + p[i] > right) {
      center = i;
      right = i + p[i];
    }
    
    if (p[i] > maxLen) {
      maxLen = p[i];
      centerIndex = i;
    }
  }
  
  const start = (centerIndex - maxLen) / 2;
  return s.substring(start, start + maxLen);
}`,
      },
    ],
  },
];

