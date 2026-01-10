import { useState, useEffect } from 'react'
import { Bookmark, Trash2, Eye, X, CheckCircle, Lightbulb, BookmarkCheck } from 'lucide-react'
import { savedGameFlashcardsService } from '../../lib/dataService'

function SavedGameQuestions() {
  const [savedFlashcards, setSavedFlashcards] = useState([])
  const [selectedFlashcard, setSelectedFlashcard] = useState(null)
  const [showAnswer, setShowAnswer] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadSavedFlashcards()
    
    // Listen for updates
    const handleUpdate = () => {
      loadSavedFlashcards()
    }
    window.addEventListener('savedGameFlashcardsUpdated', handleUpdate)
    
    return () => {
      window.removeEventListener('savedGameFlashcardsUpdated', handleUpdate)
    }
  }, [])

  const loadSavedFlashcards = async () => {
    setIsLoading(true)
    const saved = await savedGameFlashcardsService.load()
    // Sort by most recently saved first
    saved.sort((a, b) => new Date(b.savedAt || 0) - new Date(a.savedAt || 0))
    setSavedFlashcards(saved)
    setIsLoading(false)
  }

  const deleteFlashcard = async (id) => {
    if (window.confirm('Are you sure you want to remove this question from your saved list?')) {
      await savedGameFlashcardsService.delete(id)
      if (selectedFlashcard?.id === id) {
        setSelectedFlashcard(null)
        setShowAnswer(false)
      }
      loadSavedFlashcards()
    }
  }

  const formatAnswer = (answer) => {
    if (!answer) return ''
    
    // Process <text> tags first
    let processedAnswer = answer.replace(/<text>([^<]*?)<\/text>/gi, '<text>$1</text>')
    
    // Split by numbered lists
    let formatted = processedAnswer
      .replace(/(\d+\))\s+/g, '\n\n$1 ')
      .replace(/(\d+\.)\s+/g, '\n\n$1 ')
      .replace(/:\s+/g, ':\n  • ')
      .replace(/;\s+/g, ';\n  • ')
      .replace(/\n{3,}/g, '\n\n')
      .trim()
    
    const lines = formatted.split('\n')
    const processedLines = lines.map((line, index) => {
      line = line.trim()
      if (!line) return ''
      
      if (/^\d+[\)\.]\s/.test(line)) {
        return `<div class="mb-2 pl-4"><span class="font-semibold text-blue-600 dark:text-blue-400">${line.match(/^\d+[\)\.]\s/)[0]}</span><span class="ml-2">${line.replace(/^\d+[\)\.]\s/, '')}</span></div>`
      }
      
      if (line.startsWith('•')) {
        return `<div class="mb-1 pl-4 text-slate-700 dark:text-slate-300">${line}</div>`
      }
      
      // Style <text> tags as inline code with red text
      line = line.replace(/&lt;text&gt;([^&]*?)&lt;\/text&gt;/gi, '<code class="px-1.5 py-0.5 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded text-sm font-mono font-semibold">$1</code>')
      line = line.replace(/<text>([^<]*?)<\/text>/gi, '<code class="px-1.5 py-0.5 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded text-sm font-mono font-semibold">$1</code>')
      
      // Check for key terms
      line = line.replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded text-sm font-mono">$1</code>')
      line = line.replace(/([A-Z][A-Z\s]+)/g, (match) => {
        if (match.length > 2 && match.length < 20) {
          return `<strong class="text-purple-600 dark:text-purple-400">${match}</strong>`
        }
        return match
      })
      
      if (index === 0) {
        return `<p class="mb-3 text-slate-800 dark:text-slate-200 leading-relaxed">${line}</p>`
      }
      return `<p class="mb-2 text-slate-700 dark:text-slate-300 leading-relaxed">${line}</p>`
    })
    
    return processedLines.filter(l => l).join('')
  }

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-slate-600 dark:text-slate-400">Loading saved questions...</p>
      </div>
    )
  }

  if (savedFlashcards.length === 0) {
    return (
      <div className="p-8 text-center">
        <Bookmark className="w-16 h-16 mx-auto text-slate-300 dark:text-slate-700 mb-4" />
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Saved Questions Yet</h3>
        <p className="text-slate-600 dark:text-slate-400 mb-4">
          Questions you save from Game Mode will appear here.
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-500">
          Play Game Mode and click the bookmark icon to save questions for later review.
        </p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BookmarkCheck className="w-6 h-6 text-yellow-500" />
            Saved Game Questions
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            {savedFlashcards.length} {savedFlashcards.length === 1 ? 'question' : 'questions'} saved
          </p>
        </div>
      </div>

      {selectedFlashcard ? (
        // Detail view
        <div className="space-y-4">
          <button
            onClick={() => {
              setSelectedFlashcard(null)
              setShowAnswer(false)
            }}
            className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
            Back to list
          </button>

          <div className="p-6 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700 border-2 border-blue-200 dark:border-blue-700">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2 uppercase tracking-wide">
                  {selectedFlashcard.category}
                </div>
                <div className="text-lg font-bold text-slate-900 dark:text-white">
                  {selectedFlashcard.question}
                </div>
              </div>
              <button
                onClick={() => deleteFlashcard(selectedFlashcard.id)}
                className="flex-shrink-0 ml-4 p-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                title="Remove from saved"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            {!showAnswer ? (
              <button
                onClick={() => setShowAnswer(true)}
                className="w-full py-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <Eye className="w-4 h-4" />
                Show Answer
              </button>
            ) : (
              <div className="mt-4 p-5 rounded-lg bg-white/80 dark:bg-slate-900/80 border-2 border-blue-200 dark:border-blue-700">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Answer</span>
                </div>
                <div 
                  className="text-sm text-slate-700 dark:text-slate-300 prose prose-sm max-w-none dark:prose-invert"
                  dangerouslySetInnerHTML={{ __html: formatAnswer(selectedFlashcard.answer) }}
                />
              </div>
            )}
          </div>
        </div>
      ) : (
        // List view
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {savedFlashcards.map((flashcard) => (
            <div
              key={flashcard.id}
              className="p-5 rounded-xl bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-slate-800 dark:to-slate-700 border-2 border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all cursor-pointer group"
              onClick={() => {
                setSelectedFlashcard(flashcard)
                setShowAnswer(false)
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                  {flashcard.category}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteFlashcard(flashcard.id)
                  }}
                  className="p-1.5 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-200 dark:hover:bg-red-900/50"
                  title="Remove from saved"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3 line-clamp-3">
                {flashcard.question}
              </h3>
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <Bookmark className="w-3 h-3" />
                <span>
                  Saved {new Date(flashcard.savedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default SavedGameQuestions
