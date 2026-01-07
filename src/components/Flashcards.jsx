import { useState } from 'react'
import { BookOpen, Filter, Layers, PlayCircle, Tag, Sparkles } from 'lucide-react'
import ActiveRecallQuizzer from './ActiveRecallQuizzer'
import { flashcards, flashcardCategories } from '../data/flashcards'

const colorMap = {
  blue: 'bg-blue-50 text-blue-800 border-blue-200',
  amber: 'bg-amber-50 text-amber-800 border-amber-200',
  emerald: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  purple: 'bg-purple-50 text-purple-800 border-purple-200',
  indigo: 'bg-indigo-50 text-indigo-800 border-indigo-200',
}

function Flashcards() {
  const [selectedCategoryId, setSelectedCategoryId] = useState('all')

  const selectedCategoryLabel =
    selectedCategoryId === 'all'
      ? 'all'
      : flashcardCategories.find((cat) => cat.id === selectedCategoryId)?.label || 'all'

  const categoryStats = flashcardCategories.map((category) => ({
    ...category,
    total: flashcards.filter((card) => card.categoryId === category.id).length,
  }))

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-salesforce-blue text-white flex items-center justify-center flex-shrink-0">
          <BookOpen className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-salesforce-dark-blue">Flashcards</h2>
          <p className="text-salesforce-gray">
            Organize your deck by study categories, spot gaps quickly, and jump into active recall with one click.
          </p>
        </div>
      </div>

      {/* Category filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center gap-2 mb-3 text-salesforce-dark-blue font-semibold text-sm">
          <Filter className="w-4 h-4" />
          Filter by category
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategoryId('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
              selectedCategoryId === 'all'
                ? 'bg-salesforce-blue text-white border-salesforce-blue'
                : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
            }`}
          >
            All cards
          </button>
          {categoryStats.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategoryId(category.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors flex items-center gap-2 ${
                selectedCategoryId === category.id
                  ? 'bg-salesforce-blue text-white border-salesforce-blue'
                  : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
              }`}
            >
              <Tag className="w-4 h-4" />
              {category.label}
              <span className="text-xs opacity-80">({category.total})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Category overview grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categoryStats.map((category) => (
          <div
            key={category.id}
            className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex flex-col gap-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${colorMap[category.color]}`}>
                  <Layers className="w-4 h-4" />
                  <span className="text-xs font-semibold uppercase tracking-wide">Category</span>
                </div>
                <h3 className="text-lg font-bold text-salesforce-dark-blue mt-2">
                  {category.label}
                </h3>
                <p className="text-sm text-salesforce-gray mt-1">{category.summary}</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-salesforce-dark-blue">{category.total}</p>
                <p className="text-xs text-salesforce-gray">cards</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {category.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full border border-gray-200"
                >
                  {skill}
                </span>
              ))}
            </div>
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2 text-sm text-salesforce-gray">
                <Sparkles className="w-4 h-4" />
                Curated prompts for rapid recall
              </div>
              <button
                onClick={() => setSelectedCategoryId(category.id)}
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium bg-salesforce-blue text-white rounded-lg hover:bg-salesforce-dark-blue transition-colors"
              >
                <PlayCircle className="w-4 h-4" />
                Study this set
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Flashcard runner */}
      <ActiveRecallQuizzer initialCategory={selectedCategoryLabel} />
    </div>
  )
}

export default Flashcards
