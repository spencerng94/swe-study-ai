import { useState } from 'react'
import { Search, BookOpen, ChevronDown, ChevronRight, Hash, Bookmark } from 'lucide-react'
import { definitions, searchDefinitions } from '../data/definitions'

function Definitions() {
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedCategories, setExpandedCategories] = useState(() => {
    // Start with all categories expanded
    return new Set(definitions.map(cat => cat.categoryId))
  })
  const [expandedTerms, setExpandedTerms] = useState(new Set())

  const toggleCategory = (categoryId) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId)
    } else {
      newExpanded.add(categoryId)
    }
    setExpandedCategories(newExpanded)
  }

  const toggleTerm = (termKey) => {
    const newExpanded = new Set(expandedTerms)
    if (newExpanded.has(termKey)) {
      newExpanded.delete(termKey)
    } else {
      newExpanded.add(termKey)
    }
    setExpandedTerms(newExpanded)
  }

  const displayDefinitions = searchQuery
    ? searchDefinitions(searchQuery)
    : definitions

  const getTermKey = (categoryId, term) => `${categoryId}-${term.term}`

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
            <BookOpen className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Definitions & Abbreviations
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Key terms, abbreviations, and concepts organized by category
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
            placeholder="Search definitions, abbreviations, or terms..."
            className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 focus:outline-none transition-all"
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
            Found {displayDefinitions.reduce((sum, cat) => sum + cat.terms.length, 0)} matching term{displayDefinitions.reduce((sum, cat) => sum + cat.terms.length, 0) !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* Categories */}
      <div className="space-y-4">
        {displayDefinitions.map((category) => (
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
                    {category.terms.length} {category.terms.length === 1 ? 'term' : 'terms'}
                  </p>
                </div>
              </div>
              {expandedCategories.has(category.categoryId) ? (
                <ChevronDown className="w-5 h-5 text-slate-400" />
              ) : (
                <ChevronRight className="w-5 h-5 text-slate-400" />
              )}
            </button>

            {/* Category Terms */}
            {expandedCategories.has(category.categoryId) && (
              <div className="border-t border-slate-200 dark:border-slate-700">
                {category.terms.map((term, idx) => {
                  const termKey = getTermKey(category.categoryId, term)
                  const isExpanded = expandedTerms.has(termKey)
                  
                  return (
                    <div
                      key={termKey}
                      className={`border-b border-slate-200 dark:border-slate-700 last:border-b-0 ${
                        idx % 2 === 0 ? 'bg-slate-50/50 dark:bg-slate-900/30' : ''
                      }`}
                    >
                      <button
                        onClick={() => toggleTerm(termKey)}
                        className="w-full px-6 py-4 text-left flex items-start gap-4 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
                      >
                        <div className="flex-shrink-0 mt-1">
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4 text-blue-500" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-slate-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                              {term.term}
                            </h3>
                            {term.abbreviation && (
                              <>
                                <span className="text-slate-400">•</span>
                                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                                  {term.abbreviation}
                                </span>
                              </>
                            )}
                          </div>
                          {isExpanded ? (
                            <div className="mt-3 space-y-3">
                              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                                {term.definition}
                              </p>
                              {term.relatedTerms && term.relatedTerms.length > 0 && (
                                <div>
                                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
                                    Related Terms
                                  </div>
                                  <div className="flex flex-wrap gap-2">
                                    {term.relatedTerms.map((relatedTerm) => (
                                      <span
                                        key={relatedTerm}
                                        className="px-2.5 py-1 rounded-md bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium"
                                      >
                                        {relatedTerm}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          ) : (
                            <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                              {term.definition}
                            </p>
                          )}
                        </div>
                      </button>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Empty State */}
      {displayDefinitions.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 mx-auto text-slate-300 dark:text-slate-700 mb-4" />
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            No definitions found
          </h3>
          <p className="text-slate-600 dark:text-slate-400">
            Try a different search term
          </p>
        </div>
      )}
    </div>
  )
}

export default Definitions
