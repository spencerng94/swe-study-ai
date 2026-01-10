import { useState } from 'react'
import { Search, BookOpen, ChevronDown, ChevronRight, Code, Lightbulb, ExternalLink } from 'lucide-react'
import { keyConcepts, searchConcepts } from '../data/keyConcepts'

function KeyConcepts() {
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedCategories, setExpandedCategories] = useState(() => {
    return new Set(keyConcepts.map(cat => cat.categoryId))
  })
  const [expandedConcepts, setExpandedConcepts] = useState(new Set())

  const toggleCategory = (categoryId) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId)
    } else {
      newExpanded.add(categoryId)
    }
    setExpandedCategories(newExpanded)
  }

  const toggleConcept = (conceptKey) => {
    const newExpanded = new Set(expandedConcepts)
    if (newExpanded.has(conceptKey)) {
      newExpanded.delete(conceptKey)
    } else {
      newExpanded.add(conceptKey)
    }
    setExpandedConcepts(newExpanded)
  }

  const displayConcepts = searchQuery
    ? searchConcepts(searchQuery)
    : keyConcepts

  const getConceptKey = (categoryId, conceptId) => `${categoryId}-${conceptId}`

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 text-white">
            <Lightbulb className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Key Concepts
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Important concepts with detailed explanations and diagrams
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search concepts (e.g., event loop, sharding, lazy loading)..."
            className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-800 focus:outline-none transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            >
              ✕
            </button>
          )}
        </div>

        {searchQuery && (
          <div className="mt-4 text-sm text-slate-600 dark:text-slate-400">
            Found {displayConcepts.reduce((sum, cat) => sum + cat.concepts.length, 0)} matching concept{displayConcepts.reduce((sum, cat) => sum + cat.concepts.length, 0) !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* Categories */}
      <div className="space-y-6">
        {displayConcepts.map((category) => (
          <div
            key={category.categoryId}
            className="rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden"
          >
            {/* Category Header */}
            <button
              onClick={() => toggleCategory(category.categoryId)}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{category.icon}</span>
                <div className="text-left">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    {category.category}
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {category.concepts.length} {category.concepts.length === 1 ? 'concept' : 'concepts'}
                  </p>
                </div>
              </div>
              {expandedCategories.has(category.categoryId) ? (
                <ChevronDown className="w-5 h-5 text-slate-400" />
              ) : (
                <ChevronRight className="w-5 h-5 text-slate-400" />
              )}
            </button>

            {/* Category Concepts */}
            {expandedCategories.has(category.categoryId) && (
              <div className="border-t border-slate-200 dark:border-slate-700">
                {category.concepts.map((concept, idx) => {
                  const conceptKey = getConceptKey(category.categoryId, concept.id)
                  const isExpanded = expandedConcepts.has(conceptKey)
                  
                  return (
                    <div
                      key={conceptKey}
                      className={`border-b border-slate-200 dark:border-slate-700 last:border-b-0 ${
                        idx % 2 === 0 ? 'bg-slate-50/50 dark:bg-slate-900/30' : ''
                      }`}
                    >
                      <button
                        onClick={() => toggleConcept(conceptKey)}
                        className="w-full px-6 py-4 text-left flex items-start gap-4 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
                      >
                        <div className="flex-shrink-0 mt-1">
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4 text-purple-500" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-slate-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1">
                            {concept.title}
                          </h3>
                          <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                            {concept.description}
                          </p>
                        </div>
                      </button>

                      {/* Expanded Content */}
                      {isExpanded && (
                        <div className="px-6 pb-6 pt-2 border-t border-slate-200 dark:border-slate-700 bg-slate-50/30 dark:bg-slate-900/20">
                          <div className="space-y-4">
                            {/* Detailed Explanation */}
                            {concept.detailedExplanation && (
                              <div className="prose prose-sm max-w-none dark:prose-invert">
                                <div className="text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                                  {concept.detailedExplanation.split('\n').map((line, idx) => {
                                    // Format bold text
                                    if (line.startsWith('**') && line.endsWith('**')) {
                                      return (
                                        <div key={idx} className="font-semibold text-slate-900 dark:text-white my-2">
                                          {line.replace(/\*\*/g, '')}
                                        </div>
                                      )
                                    }
                                    // Format list items
                                    if (line.trim().match(/^\d+\./)) {
                                      return (
                                        <div key={idx} className="ml-4 mb-1">
                                          {line}
                                        </div>
                                      )
                                    }
                                    return <div key={idx}>{line || <br />}</div>
                                  })}
                                </div>
                              </div>
                            )}

                            {/* Diagram */}
                            {concept.diagram && (
                              <div className="mt-4 p-4 rounded-lg bg-slate-900 dark:bg-black border-2 border-slate-700">
                                <div className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">
                                  Diagram
                                </div>
                                <pre className="text-xs text-green-400 dark:text-green-300 font-mono overflow-x-auto whitespace-pre">
                                  {concept.diagram.trim()}
                                </pre>
                              </div>
                            )}

                            {/* Code Example */}
                            {concept.codeExample && (
                              <div className="mt-4">
                                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide flex items-center gap-2">
                                  <Code className="w-4 h-4" />
                                  Code Example
                                </div>
                                <pre className="p-4 rounded-lg bg-slate-900 dark:bg-black border-2 border-slate-700 text-sm text-slate-100 font-mono overflow-x-auto">
                                  <code>{concept.codeExample.trim()}</code>
                                </pre>
                              </div>
                            )}

                            {/* Key Points */}
                            {concept.keyPoints && concept.keyPoints.length > 0 && (
                              <div className="mt-4">
                                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">
                                  Key Points
                                </div>
                                <ul className="space-y-2">
                                  {concept.keyPoints.map((point, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                                      <span className="text-purple-500 mt-1">•</span>
                                      <span>{point}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {/* Use Cases */}
                            {concept.useCases && concept.useCases.length > 0 && (
                              <div className="mt-4">
                                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">
                                  Use Cases
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  {concept.useCases.map((useCase, idx) => (
                                    <span
                                      key={idx}
                                      className="px-3 py-1 rounded-md bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm font-medium"
                                    >
                                      {useCase}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Challenges */}
                            {concept.challenges && concept.challenges.length > 0 && (
                              <div className="mt-4">
                                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">
                                  Challenges
                                </div>
                                <ul className="space-y-2">
                                  {concept.challenges.map((challenge, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                                      <span className="text-amber-500 mt-1">⚠</span>
                                      <span>{challenge}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Empty State */}
      {displayConcepts.length === 0 && (
        <div className="text-center py-12">
          <Lightbulb className="w-16 h-16 mx-auto text-slate-300 dark:text-slate-700 mb-4" />
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            No concepts found
          </h3>
          <p className="text-slate-600 dark:text-slate-400">
            Try a different search term
          </p>
        </div>
      )}
    </div>
  )
}

export default KeyConcepts
