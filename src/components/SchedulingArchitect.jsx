import { useState, useEffect } from 'react'
import { ChevronRight } from 'lucide-react'
import SchemaCanvas from './scheduling/SchemaCanvas'
import ConcurrencySimulator from './scheduling/ConcurrencySimulator'

function SchedulingArchitect({ initialTab }) {
  const [activeTab, setActiveTab] = useState(initialTab || 'schema')

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab)
    }
  }, [initialTab])

  const tabs = [
    { id: 'schema', label: 'Database Schema Designer' },
    { id: 'concurrency', label: 'Concurrency Simulator' },
  ]

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-salesforce-dark-blue mb-2">
          Scheduling System Architect
        </h2>
        <p className="text-salesforce-gray">
          Design database schemas and understand concurrency patterns for scheduling systems
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
          {activeTab === 'schema' && <SchemaCanvas />}
          {activeTab === 'concurrency' && <ConcurrencySimulator />}
        </div>
      </div>
    </div>
  )
}

export default SchedulingArchitect
