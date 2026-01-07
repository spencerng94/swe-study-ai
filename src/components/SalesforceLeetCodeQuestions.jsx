import { useState, useEffect } from 'react'
import { ChevronDown, ChevronUp, ChevronRight, Search, Filter, ExternalLink, Code, Clock, TrendingUp } from 'lucide-react'
import { useGame } from './gamification/GameProvider'
import { leetcodeProblems } from '../data/leetcodeProblems'

// Simple syntax highlighter for JavaScript
function highlightCode(code) {
  // Escape HTML first
  let highlighted = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
  
  // Use a marker to protect already-highlighted sections
  const MARKER = '\x01'
  const parts = []
  
  // Store and mark comments first (they can contain anything)
  highlighted = highlighted.replace(/(\/\/.*$|\/\*[\s\S]*?\*\/)/gm, (match) => {
    const index = parts.length
    parts.push(`<span class="text-gray-500 dark:text-gray-400 italic">${match}</span>`)
    return `${MARKER}${index}${MARKER}`
  })
  
  // Store and mark strings
  highlighted = highlighted.replace(/(['"`])(?:(?=(\\?))\2.)*?\1/g, (match) => {
    const index = parts.length
    parts.push(`<span class="text-green-400 dark:text-emerald-400">${match}</span>`)
    return `${MARKER}${index}${MARKER}`
  })
  
  // Store and mark numbers
  highlighted = highlighted.replace(/\b(\d+\.?\d*)\b/g, (match) => {
    const index = parts.length
    parts.push(`<span class="text-orange-400 dark:text-orange-400">${match}</span>`)
    return `${MARKER}${index}${MARKER}`
  })
  
  // Keywords
  const keywords = /\b(function|class|const|let|var|if|else|for|while|return|new|this|super|extends|static|async|await|try|catch|finally|throw|import|export|from|default|typeof|instanceof|in|of|void|delete|break|continue|switch|case|do|with|debugger|yield|get|set|true|false|null|undefined|Infinity|NaN)\b/g
  highlighted = highlighted.replace(keywords, (match) => {
    const index = parts.length
    parts.push(`<span class="text-purple-400 dark:text-purple-400 font-semibold">${match}</span>`)
    return `${MARKER}${index}${MARKER}`
  })
  
  // Function calls
  highlighted = highlighted.replace(/\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*(?=\()/g, (match, funcName) => {
    const index = parts.length
    parts.push(`<span class="text-blue-400 dark:text-cyan-400">${funcName}</span>`)
    return `${MARKER}${index}${MARKER}(`
  })
  
  // Object properties
  highlighted = highlighted.replace(/\.([a-zA-Z_$][a-zA-Z0-9_$]*)/g, (match, prop) => {
    const index = parts.length
    parts.push(`.<span class="text-yellow-400 dark:text-yellow-400">${prop}</span>`)
    return `${MARKER}${index}${MARKER}`
  })
  
  // Operators - handle multi-character operators first (including === and arrow functions)
  // Note: After HTML escaping, > becomes &gt; and < becomes &lt;
  // Arrow function => becomes =&gt; after escaping
  const multiCharOps = [
    /(&gt;&gt;&gt;|&gt;&gt;|&lt;&lt;)/g, // Bit shift operators (after HTML escaping)
    /(===|!==|==|!=)/g, // Strict equality operators (before single =)
    /(&gt;=|&lt;=|&=)/g, // Comparison operators (after HTML escaping: >=, <=)
    /(\+=|\-=|\*=|\/=|%=)/g, // Compound assignment operators
    /(&&|\|\|)/g, // Logical operators
    /(=&gt;)/g, // Arrow function (after HTML escaping => becomes =&gt;)
  ]
  
  multiCharOps.forEach(pattern => {
    highlighted = highlighted.replace(pattern, (match) => {
      if (match.includes(MARKER)) return match
      const index = parts.length
      // Special styling for arrow functions
      const colorClass = match === '=&gt;' 
        ? 'text-cyan-400 dark:text-cyan-300 font-semibold' 
        : 'text-pink-400 dark:text-pink-400 font-medium'
      parts.push(`<span class="${colorClass}">${match}</span>`)
      return `${MARKER}${index}${MARKER}`
    })
  })
  
  // Single character operators (after multi-char to avoid partial matches)
  highlighted = highlighted.replace(/([+\-*/%=&lt;&gt;&|!^~?:])/g, (match) => {
    if (match.includes(MARKER)) return match
    const index = parts.length
    parts.push(`<span class="text-pink-400 dark:text-pink-400">${match}</span>`)
    return `${MARKER}${index}${MARKER}`
  })
  
  // Restore all parts
  parts.forEach((part, index) => {
    highlighted = highlighted.replace(`${MARKER}${index}${MARKER}`, part)
  })
  
  return highlighted
}

function SalesforceLeetCodeQuestions() {
  const gameState = useGame()
  
  // Extract all unique categories
  const allCategories = Array.from(new Set(
    leetcodeProblems.flatMap(p => p.categories)
  )).sort()

  // Organize categories into logical groups (defined before useState)
  const categoryGroups = {
    'Graph & Tree Algorithms': {
      categories: ['BFS', 'DFS', 'Tree', 'Graph', 'Union Find'],
      color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    },
    'Dynamic Programming': {
      categories: ['Dynamic Programming', 'Memoization'],
      color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
    },
    'Array & String': {
      categories: ['Array', 'String', 'Two Pointers', 'Sliding Window'],
      color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    },
    'Data Structures': {
      categories: ['Hash Table', 'Stack', 'Linked List', 'Heap', 'Design'],
      color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
    },
    'Algorithms': {
      categories: ['Sorting', 'Greedy', 'Backtracking', 'Divide and Conquer', 'Binary Search', 'Recursion'],
      color: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
    },
    'Math & Bit Manipulation': {
      categories: ['Math', 'Bit Manipulation'],
      color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300',
    },
    'Other': {
      categories: ['Matrix', 'Simulation', 'Eulerian Circuit'],
      color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
    },
  }

  // Get categories that exist in the problems
  const availableCategoryGroups = Object.entries(categoryGroups).map(([groupName, group]) => ({
    name: groupName,
    categories: group.categories.filter(cat => allCategories.includes(cat)),
    color: group.color,
  })).filter(group => group.categories.length > 0)

  const difficulties = ['All', 'Easy', 'Medium', 'Hard']

  // State hooks (after categoryGroups is defined)
  const [selectedDifficulty, setSelectedDifficulty] = useState('All')
  const [selectedCategories, setSelectedCategories] = useState(new Set())
  const [expandedProblems, setExpandedProblems] = useState(new Set())
  const [expandedCategoryGroups, setExpandedCategoryGroups] = useState(new Set(Object.keys(categoryGroups)))
  const [searchQuery, setSearchQuery] = useState('')
  const [viewedProblems, setViewedProblems] = useState(new Set())

  useEffect(() => {
    // Award XP for viewing problems (only once per problem)
    expandedProblems.forEach(problemId => {
      if (!viewedProblems.has(problemId)) {
        setViewedProblems(prev => new Set([...prev, problemId]))
        gameState.actions.questionView()
      }
    })
  }, [expandedProblems, viewedProblems, gameState])

  const toggleProblem = (problemId) => {
    const newExpanded = new Set(expandedProblems)
    if (newExpanded.has(problemId)) {
      newExpanded.delete(problemId)
    } else {
      newExpanded.add(problemId)
    }
    setExpandedProblems(newExpanded)
  }

  const toggleCategory = (category) => {
    const newCategories = new Set(selectedCategories)
    if (newCategories.has(category)) {
      newCategories.delete(category)
    } else {
      newCategories.add(category)
    }
    setSelectedCategories(newCategories)
  }

  const toggleCategoryGroup = (groupName) => {
    const newExpanded = new Set(expandedCategoryGroups)
    if (newExpanded.has(groupName)) {
      newExpanded.delete(groupName)
    } else {
      newExpanded.add(groupName)
    }
    setExpandedCategoryGroups(newExpanded)
  }

  const clearAllFilters = () => {
    setSelectedDifficulty('All')
    setSelectedCategories(new Set())
    setSearchQuery('')
  }

  const getFilteredProblems = () => {
    let filtered = leetcodeProblems

    // Filter by difficulty
    if (selectedDifficulty !== 'All') {
      filtered = filtered.filter(p => p.difficulty === selectedDifficulty)
    }

    // Filter by categories
    if (selectedCategories.size > 0) {
      filtered = filtered.filter(p => 
        p.categories.some(cat => selectedCategories.has(cat))
      )
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.categories.some(cat => cat.toLowerCase().includes(query)) ||
        p.id.toString().includes(query)
      )
    }

    return filtered
  }

  const filteredProblems = getFilteredProblems()

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-100 text-green-700 border-green-300'
      case 'Medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300'
      case 'Hard':
        return 'bg-red-100 text-red-700 border-red-300'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300'
    }
  }

  const getCategoryColor = (category) => {
    const colors = [
      'bg-blue-100 text-blue-700',
      'bg-purple-100 text-purple-700',
      'bg-pink-100 text-pink-700',
      'bg-indigo-100 text-indigo-700',
      'bg-cyan-100 text-cyan-700',
      'bg-orange-100 text-orange-700',
    ]
    const index = allCategories.indexOf(category) % colors.length
    return colors[index]
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-gray-200 dark:border-slate-800 p-6">
        <div className="flex items-center gap-3 mb-2">
          <Code className="w-6 h-6 text-salesforce-blue" />
          <h2 className="text-2xl font-bold text-salesforce-dark-blue dark:text-white">
            Salesforce LeetCode Questions
          </h2>
        </div>
        <p className="text-salesforce-gray dark:text-slate-400">
          Actual LeetCode problems from Salesforce interviews (6 months data)
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-gray-200 dark:border-slate-800 p-5">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by problem title, description, category, or ID..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-slate-700 rounded-lg focus:border-salesforce-blue focus:ring-2 focus:ring-salesforce-light-blue focus:outline-none transition-all bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
            />
          </div>
          {(selectedDifficulty !== 'All' || selectedCategories.size > 0 || searchQuery) && (
            <button
              onClick={clearAllFilters}
              className="px-4 py-2.5 text-sm font-medium text-salesforce-gray hover:text-salesforce-blue border border-gray-300 dark:border-slate-700 rounded-lg hover:border-salesforce-blue transition-colors whitespace-nowrap"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Difficulty Filter */}
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-gray-200 dark:border-slate-800 p-5">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-5 h-5 text-salesforce-gray dark:text-slate-400" />
          <h3 className="text-sm font-semibold text-salesforce-dark-blue dark:text-white">Difficulty</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {difficulties.map(difficulty => (
            <button
              key={difficulty}
              onClick={() => setSelectedDifficulty(difficulty)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all border ${
                selectedDifficulty === difficulty
                  ? difficulty === 'Easy' 
                    ? 'bg-green-500 text-white border-green-600 shadow-sm'
                    : difficulty === 'Medium'
                    ? 'bg-yellow-500 text-white border-yellow-600 shadow-sm'
                    : difficulty === 'Hard'
                    ? 'bg-red-500 text-white border-red-600 shadow-sm'
                    : 'bg-salesforce-blue text-white border-salesforce-blue shadow-sm'
                  : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700 border-transparent'
              }`}
            >
              {difficulty}
            </button>
          ))}
        </div>
      </div>

      {/* Category Filter - Organized by Groups */}
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-gray-200 dark:border-slate-800 p-5">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-salesforce-gray dark:text-slate-400" />
          <h3 className="text-sm font-semibold text-salesforce-dark-blue dark:text-white">Categories</h3>
        </div>
        <div className="space-y-3">
          {availableCategoryGroups.map((group) => {
            const isGroupExpanded = expandedCategoryGroups.has(group.name)
            const groupCategories = group.categories.filter(cat => allCategories.includes(cat))
            const selectedInGroup = groupCategories.filter(cat => selectedCategories.has(cat)).length
            
            return (
              <div key={group.name} className="border border-gray-200 dark:border-slate-700 rounded-lg overflow-hidden">
                {/* Group Header */}
                <button
                  onClick={() => toggleCategoryGroup(group.name)}
                  className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-800/50 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    {isGroupExpanded ? (
                      <ChevronDown className="w-4 h-4 text-salesforce-gray dark:text-slate-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-salesforce-gray dark:text-slate-400" />
                    )}
                    <span className={`text-sm font-semibold ${group.color}`}>
                      {group.name}
                    </span>
                    {selectedInGroup > 0 && (
                      <span className="text-xs bg-salesforce-blue text-white px-2 py-0.5 rounded-full">
                        {selectedInGroup}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-salesforce-gray dark:text-slate-400">
                    {groupCategories.length} {groupCategories.length === 1 ? 'category' : 'categories'}
                  </span>
                </button>
                
                {/* Group Categories */}
                {isGroupExpanded && (
                  <div className="p-3 pt-2 bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-700">
                    <div className="flex flex-wrap gap-2">
                      {groupCategories.map(category => {
                        const isSelected = selectedCategories.has(category)
                        return (
                          <button
                            key={category}
                            onClick={() => toggleCategory(category)}
                            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all border ${
                              isSelected
                                ? `${getCategoryColor(category)} border-current shadow-sm`
                                : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700 border-transparent'
                            }`}
                          >
                            {category}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Problems List */}
      <div className="space-y-3">
        {filteredProblems.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-gray-200 dark:border-slate-800 p-12 text-center">
            <p className="text-salesforce-gray dark:text-slate-400 text-lg">
              No problems found matching your search criteria.
            </p>
            <p className="text-salesforce-gray dark:text-slate-400 text-sm mt-2">
              Try adjusting your filters or search terms.
            </p>
          </div>
        ) : (
          filteredProblems.map((problem) => {
            const isExpanded = expandedProblems.has(problem.id)
            
            return (
              <div
                key={problem.id}
                className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-gray-200 dark:border-slate-800 overflow-hidden hover:shadow-md transition-all"
              >
                {/* Problem Header */}
                <button
                  onClick={() => toggleProblem(problem.id)}
                  className="w-full text-left p-5 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      {/* Problem ID, Difficulty, and Acceptance */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold px-2.5 py-1 bg-salesforce-light-blue dark:bg-salesforce-blue/20 text-salesforce-blue dark:text-blue-300 rounded-md">
                          #{problem.id}
                        </span>
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-md border ${getDifficultyColor(problem.difficulty)}`}>
                          {problem.difficulty}
                        </span>
                        <span className="text-xs text-salesforce-gray dark:text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {problem.acceptance}
                        </span>
                        <a
                          href={problem.leetcodeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-xs font-medium px-2.5 py-1 rounded-md border bg-orange-100 text-orange-700 border-orange-300 hover:opacity-80 transition-opacity flex items-center gap-1"
                        >
                          LeetCode
                          <ExternalLink className="w-3 h-3" />
                        </a>
                        <div className="flex gap-1 flex-wrap">
                          {problem.categories.map(category => (
                            <span
                              key={category}
                              className={`text-xs px-2 py-0.5 rounded ${getCategoryColor(category)}`}
                            >
                              {category}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      {/* Problem Title */}
                      <h3 className="font-semibold text-salesforce-dark-blue dark:text-white text-lg leading-snug pr-4">
                        {problem.title}
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

                {/* Problem Details */}
                {isExpanded && (
                  <div className="px-5 pb-5 border-t border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-900">
                    <div className="pt-5 space-y-6">
                      {/* Problem Description */}
                      <div className="bg-white dark:bg-slate-800 border-l-4 border-salesforce-blue p-5 rounded-r-lg shadow-sm">
                        <h4 className="font-semibold text-salesforce-dark-blue dark:text-white mb-3 flex items-center gap-2">
                          <Code className="w-4 h-4" />
                          Problem Description
                        </h4>
                        <div className="prose prose-sm max-w-none dark:prose-invert">
                          <pre className="whitespace-pre-wrap text-gray-700 dark:text-slate-300 leading-relaxed font-sans">
                            {problem.description}
                          </pre>
                        </div>
                      </div>

                      {/* Solutions */}
                      <div className="space-y-4">
                        <h4 className="font-semibold text-salesforce-dark-blue dark:text-white mb-3 flex items-center gap-2">
                          <Code className="w-4 h-4" />
                          Solutions
                        </h4>
                        {problem.solutions.map((solution, idx) => (
                          <div
                            key={idx}
                            className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-5 shadow-sm"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <h5 className="font-semibold text-salesforce-dark-blue dark:text-white">
                                  {solution.name}
                                </h5>
                                <p className="text-sm text-salesforce-gray dark:text-slate-400 mt-1">
                                  {solution.approach}
                                </p>
                              </div>
                              <div className="flex gap-3 text-xs text-salesforce-gray dark:text-slate-400">
                                <span>Time: <span className="font-semibold">{solution.time}</span></span>
                                <span>Space: <span className="font-semibold">{solution.space}</span></span>
                              </div>
                            </div>
                            <div className="bg-gray-900 dark:bg-slate-950 rounded-lg p-4 overflow-x-auto border border-gray-700 dark:border-slate-700 shadow-inner">
                              <pre className="text-sm font-mono leading-relaxed">
                                <code 
                                  className="text-gray-100 dark:text-slate-200"
                                  dangerouslySetInnerHTML={{ __html: highlightCode(solution.code) }}
                                />
                              </pre>
                            </div>
                          </div>
                        ))}
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
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-gray-200 dark:border-slate-800 p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-sm">
          <div className="text-salesforce-gray dark:text-slate-400">
            <span className="font-medium text-salesforce-dark-blue dark:text-white">{filteredProblems.length}</span> problem{filteredProblems.length !== 1 ? 's' : ''} shown
            {selectedDifficulty !== 'All' && (
              <span> • Difficulty: <span className="font-medium text-salesforce-dark-blue dark:text-white">{selectedDifficulty}</span></span>
            )}
            {selectedCategories.size > 0 && (
              <span> • {selectedCategories.size} categor{selectedCategories.size !== 1 ? 'ies' : 'y'} selected</span>
            )}
          </div>
          <div className="text-salesforce-gray dark:text-slate-400">
            Total: <span className="font-medium text-salesforce-dark-blue dark:text-white">{leetcodeProblems.length}</span> problems
          </div>
        </div>
      </div>
    </div>
  )
}

export default SalesforceLeetCodeQuestions
