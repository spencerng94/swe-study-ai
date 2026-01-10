import { useState, useEffect } from 'react'
import { ChevronRight, Code, FileCode } from 'lucide-react'
import FrontendJavaScriptFundamentals from './FrontendJavaScriptFundamentals'
import JSTriviaLab from './JSTriviaLab'

function JavaScriptPractice({ initialTab }) {
  const [activeTab, setActiveTab] = useState(initialTab || 'fundamentals')

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab)
    }
  }, [initialTab])

  const tabs = [
    { id: 'fundamentals', label: 'Fundamentals', icon: FileCode },
    { id: 'playground', label: 'Interactive Playgrounds', icon: Code },
  ]

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-6">
        <h2 className="text-2xl font-bold text-salesforce-dark-blue dark:text-white mb-2">
          JavaScript Practice
        </h2>
        <p className="text-salesforce-gray dark:text-slate-400">
          Master JavaScript and React fundamentals with interactive lessons and hands-on playgrounds
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700">
        <div className="flex border-b border-gray-200 dark:border-slate-700">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 font-medium transition-colors border-b-2 flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'border-salesforce-blue text-salesforce-blue dark:text-blue-400'
                    : 'border-transparent text-salesforce-gray dark:text-slate-400 hover:text-salesforce-dark-blue dark:hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            )
          })}
        </div>

        <div className="p-6">
          {activeTab === 'fundamentals' && <FrontendJavaScriptFundamentals />}
          {activeTab === 'playground' && <JSTriviaLab />}
        </div>
      </div>
    </div>
  )
}

export default JavaScriptPractice
