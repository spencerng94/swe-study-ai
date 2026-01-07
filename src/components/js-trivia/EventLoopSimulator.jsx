import { useState } from 'react'
import { Play, RotateCcw, ArrowRight, Info } from 'lucide-react'

function EventLoopSimulator() {
  const [codeBlocks, setCodeBlocks] = useState([
    { id: 1, type: 'sync', code: 'console.log("1")', executed: false },
    { id: 2, type: 'promise', code: 'Promise.resolve().then(() => console.log("2"))', executed: false },
    { id: 3, type: 'timeout', code: 'setTimeout(() => console.log("3"), 0)', executed: false },
    { id: 4, type: 'promise', code: 'Promise.resolve().then(() => console.log("4"))', executed: false },
  ])
  const [executionLog, setExecutionLog] = useState([])
  const [isRunning, setIsRunning] = useState(false)

  const executeCode = async () => {
    setIsRunning(true)
    setExecutionLog([])
    
    // Reset all blocks
    setCodeBlocks(prev => prev.map(b => ({ ...b, executed: false })))

    // Simulate execution order
    const log = []
    
    // 1. Synchronous code executes first
    const syncBlocks = codeBlocks.filter(b => b.type === 'sync')
    syncBlocks.forEach(block => {
      log.push({ message: `Executing: ${block.code}`, type: 'sync' })
      setCodeBlocks(prev => prev.map(b => 
        b.id === block.id ? { ...b, executed: true } : b
      ))
    })

    // 2. Microtasks (Promises) execute next
    const promiseBlocks = codeBlocks.filter(b => b.type === 'promise')
    promiseBlocks.forEach(block => {
      log.push({ message: `Microtask: ${block.code}`, type: 'promise' })
      setCodeBlocks(prev => prev.map(b => 
        b.id === block.id ? { ...b, executed: true } : b
      ))
    })

    // 3. Macrotasks (setTimeout) execute last
    const timeoutBlocks = codeBlocks.filter(b => b.type === 'timeout')
    timeoutBlocks.forEach(block => {
      log.push({ message: `Macrotask: ${block.code}`, type: 'timeout' })
      setCodeBlocks(prev => prev.map(b => 
        b.id === block.id ? { ...b, executed: true } : b
      ))
    })

    // Update log with delays for visualization
    for (let i = 0; i < log.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800))
      setExecutionLog(prev => [...prev, log[i]])
    }

    setIsRunning(false)
  }

  const reset = () => {
    setCodeBlocks(prev => prev.map(b => ({ ...b, executed: false })))
    setExecutionLog([])
  }

  const addBlock = (type) => {
    const newBlock = {
      id: Date.now(),
      type,
      code: type === 'sync' 
        ? 'console.log("sync")'
        : type === 'promise'
        ? 'Promise.resolve().then(() => console.log("promise"))'
        : 'setTimeout(() => console.log("timeout"), 0)',
      executed: false,
    }
    setCodeBlocks([...codeBlocks, newBlock])
  }

  const removeBlock = (id) => {
    setCodeBlocks(codeBlocks.filter(b => b.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="bg-salesforce-light-blue border border-salesforce-blue rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-salesforce-blue mt-0.5 flex-shrink-0" />
          <div className="text-sm text-salesforce-dark-blue">
            <p className="font-semibold mb-1">Event Loop Execution Order:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li><strong>Synchronous code</strong> executes immediately</li>
              <li><strong>Microtasks</strong> (Promises, queueMicrotask) execute next - before any macrotasks</li>
              <li><strong>Macrotasks</strong> (setTimeout, setInterval) execute after all microtasks</li>
            </ol>
            <p className="mt-2">This is why Promises resolve before setTimeout, even if setTimeout has 0ms delay!</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Code Blocks Area */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-salesforce-dark-blue">Code Blocks</h3>
            <div className="flex gap-2">
              <button
                onClick={() => addBlock('sync')}
                className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
              >
                + Sync
              </button>
              <button
                onClick={() => addBlock('promise')}
                className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200"
              >
                + Promise
              </button>
              <button
                onClick={() => addBlock('timeout')}
                className="px-3 py-1 text-xs bg-orange-100 text-orange-700 rounded hover:bg-orange-200"
              >
                + setTimeout
              </button>
            </div>
          </div>

          <div className="space-y-2">
            {codeBlocks.map((block) => (
              <div
                key={block.id}
                className={`p-3 rounded-lg border-2 flex items-center justify-between ${
                  block.executed
                    ? 'bg-green-50 border-green-300'
                    : block.type === 'sync'
                    ? 'bg-blue-50 border-blue-300'
                    : block.type === 'promise'
                    ? 'bg-green-50 border-green-300'
                    : 'bg-orange-50 border-orange-300'
                }`}
              >
                <div className="flex items-center gap-3 flex-1">
                  <span className={`text-xs font-semibold px-2 py-1 rounded ${
                    block.type === 'sync'
                      ? 'bg-blue-200 text-blue-800'
                      : block.type === 'promise'
                      ? 'bg-green-200 text-green-800'
                      : 'bg-orange-200 text-orange-800'
                  }`}>
                    {block.type === 'sync' ? 'SYNC' : block.type === 'promise' ? 'MICROTASK' : 'MACROTASK'}
                  </span>
                  <code className="text-sm text-gray-700">{block.code}</code>
                </div>
                <button
                  onClick={() => removeBlock(block.id)}
                  className="text-red-500 hover:text-red-700 ml-2"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Event Loop Visualization */}
        <div className="space-y-4">
          <h3 className="font-semibold text-salesforce-dark-blue">Execution Order</h3>
          
          <div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-300 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm font-medium">Call Stack (Synchronous)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium">Microtask Queue (Promises)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span className="text-sm font-medium">Macrotask Queue (setTimeout)</span>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4 min-h-[200px]">
            {executionLog.length === 0 ? (
              <p className="text-salesforce-gray text-center py-8">
                Execution log will appear here...
              </p>
            ) : (
              <div className="space-y-2">
                {executionLog.map((log, idx) => (
                  <div
                    key={idx}
                    className={`p-2 rounded flex items-center gap-2 ${
                      log.type === 'sync'
                        ? 'bg-blue-50 border-l-4 border-blue-500'
                        : log.type === 'promise'
                        ? 'bg-green-50 border-l-4 border-green-500'
                        : 'bg-orange-50 border-l-4 border-orange-500'
                    }`}
                  >
                    <ArrowRight className="w-4 h-4" />
                    <span className="text-sm">{log.message}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={executeCode}
          disabled={isRunning || codeBlocks.length === 0}
          className="flex items-center gap-2 px-6 py-3 bg-salesforce-blue text-white rounded-lg hover:bg-salesforce-dark-blue transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Play className="w-4 h-4" />
          {isRunning ? 'Executing...' : 'Execute Code Blocks'}
        </button>
        <button
          onClick={reset}
          className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </button>
      </div>
    </div>
  )
}

export default EventLoopSimulator
