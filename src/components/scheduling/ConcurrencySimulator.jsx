import { useState } from 'react'
import { Play, RotateCcw, Lock, Unlock, AlertTriangle, Info } from 'lucide-react'

function ConcurrencySimulator() {
  const [lockType, setLockType] = useState('optimistic')
  const [isRunning, setIsRunning] = useState(false)
  const [scenario, setScenario] = useState(null)
  const [timeSlot, setTimeSlot] = useState({ id: 1, available: true, bookedBy: null })

  const simulateBooking = async () => {
    setIsRunning(true)
    setScenario(null)

    const user1 = { id: 1, name: 'User A' }
    const user2 = { id: 2, name: 'User B' }

    let newScenario
    if (lockType === 'optimistic') {
      // Optimistic Locking Simulation
      newScenario = {
        type: 'optimistic',
        steps: [
          { time: 0, action: 'Both users read slot availability: AVAILABLE', user: null },
          { time: 1, action: 'User A starts booking process...', user: user1 },
          { time: 2, action: 'User B starts booking process...', user: user2 },
          { time: 3, action: 'User A checks: slot still available? YES', user: user1 },
          { time: 4, action: 'User B checks: slot still available? YES', user: user2 },
          { time: 5, action: 'User A writes booking to database', user: user1 },
          { time: 6, action: 'User B writes booking to database', user: user2 },
          { time: 7, action: '⚠️ CONFLICT: Both users booked the same slot!', user: null, conflict: true },
          { time: 8, action: 'System detects version mismatch, rolls back User B', user: user2 },
          { time: 9, action: 'User B must retry with updated data', user: user2 },
        ],
      }
    } else {
      // Pessimistic Locking Simulation
      newScenario = {
        type: 'pessimistic',
        steps: [
          { time: 0, action: 'User A requests to book slot', user: user1 },
          { time: 1, action: '🔒 System LOCKs the slot for User A', user: user1 },
          { time: 2, action: 'User B requests to book the same slot', user: user2 },
          { time: 3, action: '❌ System REJECTS: Slot is locked by User A', user: user2, conflict: true },
          { time: 4, action: 'User B must wait or choose different slot', user: user2 },
          { time: 5, action: 'User A completes booking', user: user1 },
          { time: 6, action: '🔓 System UNLOCKs the slot', user: null },
          { time: 7, action: 'Slot is now BOOKED by User A', user: user1 },
        ],
      }
    }

    setScenario(newScenario)

    // Animate the steps
    for (let i = 0; i < newScenario.steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000))
    }

    setIsRunning(false)
  }

  const reset = () => {
    setScenario(null)
    setTimeSlot({ id: 1, available: true, bookedBy: null })
  }

  return (
    <div className="space-y-6">
      <div className="bg-salesforce-light-blue border border-salesforce-blue rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-salesforce-blue mt-0.5 flex-shrink-0" />
          <div className="text-sm text-salesforce-dark-blue">
            <p className="font-semibold mb-1">Concurrency Control Strategies:</p>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>Optimistic Locking:</strong> Assumes conflicts are rare. Checks version/timestamp before write. Faster but may need retries.</li>
              <li><strong>Pessimistic Locking:</strong> Locks resource during transaction. Prevents conflicts but can cause blocking/waiting.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Lock Type Selection */}
      <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
        <h3 className="font-semibold text-salesforce-dark-blue mb-4">Select Locking Strategy:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => setLockType('optimistic')}
            className={`p-4 rounded-lg border-2 transition-all text-left ${
              lockType === 'optimistic'
                ? 'border-salesforce-blue bg-salesforce-light-blue'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <Unlock className={`w-5 h-5 ${lockType === 'optimistic' ? 'text-salesforce-blue' : 'text-gray-500'}`} />
              <span className={`font-semibold ${lockType === 'optimistic' ? 'text-salesforce-blue' : 'text-gray-700'}`}>
                Optimistic Locking
              </span>
            </div>
            <p className="text-sm text-gray-600">
              Check before write, handle conflicts on commit. Better for high-read scenarios.
            </p>
          </button>
          <button
            onClick={() => setLockType('pessimistic')}
            className={`p-4 rounded-lg border-2 transition-all text-left ${
              lockType === 'pessimistic'
                ? 'border-salesforce-blue bg-salesforce-light-blue'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <Lock className={`w-5 h-5 ${lockType === 'pessimistic' ? 'text-salesforce-blue' : 'text-gray-500'}`} />
              <span className={`font-semibold ${lockType === 'pessimistic' ? 'text-salesforce-blue' : 'text-gray-700'}`}>
                Pessimistic Locking
              </span>
            </div>
            <p className="text-sm text-gray-600">
              Lock resource during transaction. Prevents conflicts but may cause blocking.
            </p>
          </button>
        </div>
      </div>

      {/* Simulation Controls */}
      <div className="flex gap-4">
        <button
          onClick={simulateBooking}
          disabled={isRunning}
          className="flex items-center gap-2 px-6 py-3 bg-salesforce-blue text-white rounded-lg hover:bg-salesforce-dark-blue transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Play className="w-4 h-4" />
          {isRunning ? 'Simulating...' : 'Simulate Concurrent Booking'}
        </button>
        <button
          onClick={reset}
          className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </button>
      </div>

      {/* Time Slot Status */}
      <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
        <h3 className="font-semibold text-salesforce-dark-blue mb-4">Time Slot Status:</h3>
        <div className={`p-6 rounded-lg border-2 ${
          timeSlot.available
            ? 'bg-green-50 border-green-300'
            : 'bg-red-50 border-red-300'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-lg">
                Slot #{timeSlot.id} - {timeSlot.available ? 'AVAILABLE' : 'BOOKED'}
              </p>
              {timeSlot.bookedBy && (
                <p className="text-sm text-gray-600 mt-1">
                  Booked by: {timeSlot.bookedBy}
                </p>
              )}
            </div>
            {!timeSlot.available && (
              <Lock className="w-8 h-8 text-red-600" />
            )}
          </div>
        </div>
      </div>

      {/* Simulation Steps */}
      {scenario && (
        <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
          <h3 className="font-semibold text-salesforce-dark-blue mb-4">
            Simulation Steps ({scenario.type === 'optimistic' ? 'Optimistic' : 'Pessimistic'} Locking):
          </h3>
          <div className="space-y-3">
            {scenario.steps.map((step, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-lg border-l-4 flex items-start gap-3 ${
                  step.conflict
                    ? 'bg-red-50 border-red-500'
                    : step.user
                    ? step.user.id === 1
                      ? 'bg-blue-50 border-blue-500'
                      : 'bg-purple-50 border-purple-500'
                    : 'bg-gray-50 border-gray-400'
                }`}
              >
                {step.conflict && <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-gray-500">T+{step.time}s</span>
                    {step.user && (
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                        step.user.id === 1
                          ? 'bg-blue-200 text-blue-800'
                          : 'bg-purple-200 text-purple-800'
                      }`}>
                        {step.user.name}
                      </span>
                    )}
                  </div>
                  <p className={`text-sm ${
                    step.conflict ? 'text-red-800 font-semibold' : 'text-gray-700'
                  }`}>
                    {step.action}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Comparison Table */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <h3 className="font-semibold text-salesforce-dark-blue mb-3">When to Use Each Strategy:</h3>
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-lg">
            <thead>
              <tr className="bg-salesforce-blue text-white">
                <th className="px-4 py-3 text-left">Criteria</th>
                <th className="px-4 py-3 text-left">Optimistic</th>
                <th className="px-4 py-3 text-left">Pessimistic</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200">
                <td className="px-4 py-3 font-medium">Conflict Frequency</td>
                <td className="px-4 py-3">Low (rare conflicts)</td>
                <td className="px-4 py-3">High (frequent conflicts)</td>
              </tr>
              <tr className="border-b border-gray-200 bg-gray-50">
                <td className="px-4 py-3 font-medium">Performance</td>
                <td className="px-4 py-3">Better (no blocking)</td>
                <td className="px-4 py-3">Slower (locks cause waits)</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="px-4 py-3 font-medium">Retry Logic</td>
                <td className="px-4 py-3">Required</td>
                <td className="px-4 py-3">Not needed</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="px-4 py-3 font-medium">Use Case</td>
                <td className="px-4 py-3">High-read, low-write scenarios</td>
                <td className="px-4 py-3">Critical data integrity needs</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default ConcurrencySimulator
