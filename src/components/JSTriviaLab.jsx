import { useState, useEffect } from 'react'
import { ChevronRight } from 'lucide-react'
import ClosurePlayground from './js-trivia/ClosurePlayground'
import EventLoopSimulator from './js-trivia/EventLoopSimulator'
import PureFunctionChecker from './js-trivia/PureFunctionChecker'

function JSTriviaLab({ initialTab }) {
  const [activeTab, setActiveTab] = useState(initialTab || 'closure')

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab)
    }
  }, [initialTab])

  const tabs = [
    { id: 'closure', label: 'Closure Playground' },
    { id: 'eventloop', label: 'Microtask vs Macrotask' },
    { id: 'pure', label: 'Pure Function Checker' },
  ]

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-salesforce-dark-blue mb-2">
          JS Trivia "Deep Dive" Lab
        </h2>
        <p className="text-salesforce-gray">
          Interactive playgrounds to understand JavaScript core concepts through hands-on exploration
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="flex border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-4 font-medium transition-colors border-b-2 ${
                activeTab === tab.id
                  ? 'border-salesforce-blue text-salesforce-blue'
                  : 'border-transparent text-salesforce-gray hover:text-salesforce-dark-blue'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === 'closure' && <ClosurePlayground />}
          {activeTab === 'eventloop' && <EventLoopSimulator />}
          {activeTab === 'pure' && <PureFunctionChecker />}
        </div>
      </div>
    </div>
  )
}

export default JSTriviaLab
