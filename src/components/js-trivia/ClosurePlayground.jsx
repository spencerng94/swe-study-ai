import { useState } from 'react'
import { Play, RotateCcw, Info } from 'lucide-react'

function ClosurePlayground() {
  const [counters, setCounters] = useState([])
  const [counterId, setCounterId] = useState(1)

  // This function creates a closure - the inner function has access to 'count'
  // even after the outer function returns
  const createCounter = () => {
    let count = 0 // Private variable maintained in closure scope
    
    return {
      increment: () => {
        count++
        return count
      },
      decrement: () => {
        count--
        return count
      },
      getValue: () => count,
    }
  }

  const addCounter = () => {
    const newCounter = {
      id: counterId,
      instance: createCounter(),
      value: 0,
    }
    setCounters([...counters, newCounter])
    setCounterId(counterId + 1)
  }

  const incrementCounter = (id) => {
    setCounters(counters.map(c => {
      if (c.id === id) {
        const newValue = c.instance.increment()
        return { ...c, value: newValue }
      }
      return c
    }))
  }

  const decrementCounter = (id) => {
    setCounters(counters.map(c => {
      if (c.id === id) {
        const newValue = c.instance.decrement()
        return { ...c, value: newValue }
      }
      return c
    }))
  }

  const resetCounters = () => {
    setCounters([])
    setCounterId(1)
  }

  return (
    <div className="space-y-6">
      <div className="bg-salesforce-light-blue border border-salesforce-blue rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-salesforce-blue mt-0.5 flex-shrink-0" />
          <div className="text-sm text-salesforce-dark-blue">
            <p className="font-semibold mb-1">Understanding Closures:</p>
            <p>
              Each counter instance maintains its own private <code className="bg-white px-1 rounded">count</code> variable 
              in memory through a closure. Even though the outer function <code className="bg-white px-1 rounded">createCounter()</code> 
              has finished executing, the inner functions (increment, decrement) still have access to that variable. 
              This is why each counter maintains its own independent state!
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={addCounter}
          className="flex items-center gap-2 px-4 py-2 bg-salesforce-blue text-white rounded-lg hover:bg-salesforce-dark-blue transition-colors"
        >
          <Play className="w-4 h-4" />
          Create New Counter Instance
        </button>
        <button
          onClick={resetCounters}
          className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Reset All
        </button>
      </div>

      {counters.length === 0 ? (
        <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
          <p className="text-salesforce-gray">
            Click "Create New Counter Instance" to see how each counter maintains its own private state through closures
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {counters.map((counter) => (
            <div
              key={counter.id}
              className="bg-white border-2 border-salesforce-blue rounded-lg p-6 shadow-sm"
            >
              <div className="text-center mb-4">
                <p className="text-sm text-salesforce-gray mb-1">Counter Instance #{counter.id}</p>
                <div className="text-4xl font-bold text-salesforce-blue">
                  {counter.value}
                </div>
                <p className="text-xs text-salesforce-gray mt-2">
                  Private <code className="bg-gray-100 px-1 rounded">count</code> variable: {counter.value}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => decrementCounter(counter.id)}
                  className="flex-1 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-medium"
                >
                  - Decrement
                </button>
                <button
                  onClick={() => incrementCounter(counter.id)}
                  className="flex-1 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors font-medium"
                >
                  + Increment
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <h3 className="font-semibold text-salesforce-dark-blue mb-2">Code Explanation:</h3>
        <pre className="text-xs bg-white p-4 rounded border border-gray-200 overflow-x-auto">
          <code>{`function createCounter() {
  let count = 0; // Private variable in closure scope
  
  return {
    increment: () => ++count,  // Accesses 'count' from closure
    decrement: () => --count,  // Accesses 'count' from closure
    getValue: () => count      // Accesses 'count' from closure
  };
}

// Each instance has its own closure with its own 'count'
const counter1 = createCounter();
const counter2 = createCounter();
// counter1 and counter2 have separate 'count' variables!`}</code>
        </pre>
      </div>
    </div>
  )
}

export default ClosurePlayground
