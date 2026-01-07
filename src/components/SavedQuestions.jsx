import { useState, useEffect } from 'react'
import { Bookmark, Trash2, Search, Filter, ExternalLink } from 'lucide-react'
import { savedQuestionsService } from '../lib/dataService'

function SavedQuestions() {
  const [savedQuestions, setSavedQuestions] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [expandedItems, setExpandedItems] = useState(new Set())
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadSavedQuestions()
    
    // Listen for new saves from other tabs
    const handleStorageChange = () => {
      loadSavedQuestions()
    }
    window.addEventListener('storage', handleStorageChange)
    
    // Listen for custom save events (same tab)
    const handleQuestionSaved = () => {
      loadSavedQuestions()
    }
    window.addEventListener('questionSaved', handleQuestionSaved)
    
    // Also check on focus (for same-tab updates)
    window.addEventListener('focus', loadSavedQuestions)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('questionSaved', handleQuestionSaved)
      window.removeEventListener('focus', loadSavedQuestions)
    }
  }, [])

  const loadSavedQuestions = async () => {
    setIsLoading(true)
    const saved = await savedQuestionsService.load()
    // Sort by most recent first
    saved.sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0))
    setSavedQuestions(saved)
    setIsLoading(false)
  }

  const deleteQuestion = async (id) => {
    if (window.confirm('Are you sure you want to delete this saved question?')) {
      await savedQuestionsService.delete(id)
      loadSavedQuestions()
    }
  }

  const toggleExpand = (id) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedItems(newExpanded)
  }

  const categories = ['All', ...new Set(savedQuestions.map(q => q.category))]

  const filteredQuestions = savedQuestions.filter(q => {
    const matchesCategory = selectedCategory === 'All' || q.category === selectedCategory
    const matchesSearch = !searchQuery.trim() || 
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <Bookmark className="w-6 h-6 text-salesforce-blue" />
            <h2 className="text-2xl font-bold text-salesforce-dark-blue">
              Saved Questions
            </h2>
          </div>
          <span className="text-sm text-salesforce-gray">
            {savedQuestions.length} saved
          </span>
        </div>
        <p className="text-salesforce-gray">
          Your saved questions and answers from the AI Tutor
        </p>
      </div>

      {/* Filters */}
      {savedQuestions.length > 0 && (
        <>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search saved questions..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-salesforce-blue focus:ring-2 focus:ring-salesforce-light-blue focus:outline-none"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-salesforce-gray" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:border-salesforce-blue focus:ring-2 focus:ring-salesforce-light-blue focus:outline-none bg-white"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Questions List */}
          <div className="space-y-4">
            {filteredQuestions.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <p className="text-salesforce-gray">
                  No saved questions match your search criteria.
                </p>
              </div>
            ) : (
              filteredQuestions.map((item) => {
                const isExpanded = expandedItems.has(item.id)
                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
                  >
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs font-semibold px-2 py-1 bg-salesforce-light-blue text-salesforce-blue rounded">
                              {item.category}
                            </span>
                            {item.summarized && (
                              <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded">
                                Summarized
                              </span>
                            )}
                            <span className="text-xs text-salesforce-gray">
                              {new Date(item.timestamp).toLocaleDateString()}
                            </span>
                          </div>
                          <h3 className="font-semibold text-salesforce-dark-blue text-lg mb-2">
                            {item.question}
                          </h3>
                        </div>
                        <button
                          onClick={() => deleteQuestion(item.id)}
                          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      <button
                        onClick={() => toggleExpand(item.id)}
                        className="text-sm text-salesforce-blue hover:text-salesforce-dark-blue transition-colors"
                      >
                        {isExpanded ? 'Hide Answer' : 'Show Answer'}
                      </button>

                      {isExpanded && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="bg-salesforce-light-blue border-l-4 border-salesforce-blue p-4 rounded">
                            <h4 className="font-semibold text-salesforce-dark-blue mb-2">
                              Answer:
                            </h4>
                            <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                              {item.answer}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </>
      )}

      {/* Empty State */}
      {savedQuestions.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <Bookmark className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-salesforce-gray text-lg mb-2">
            No saved questions yet
          </p>
          <p className="text-sm text-gray-400">
            Use the AI Tutor to ask questions and save the ones you want to review later
          </p>
        </div>
      )}
    </div>
  )
}

export default SavedQuestions
