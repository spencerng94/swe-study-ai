import { useState } from 'react'
import { CheckCircle, XCircle, AlertCircle, Code2 } from 'lucide-react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

function PureFunctionChecker() {
  const [code, setCode] = useState(`function add(a, b) {
  return a + b;
}`)
  const [analysis, setAnalysis] = useState(null)

  const checkPurity = () => {
    const codeLower = code.toLowerCase()
    let isPure = true
    const issues = []
    const positives = []

    // Check for side effects indicators
    const sideEffectPatterns = [
      { pattern: /console\.(log|warn|error|info)/, issue: 'Uses console.log/warn/error (side effect)' },
      { pattern: /document\./, issue: 'Manipulates DOM (side effect)' },
      { pattern: /window\./, issue: 'Accesses/modifies window object (side effect)' },
      { pattern: /localstorage|sessionstorage/, issue: 'Uses localStorage/sessionStorage (side effect)' },
      { pattern: /fetch\(|axios\.|\.get\(|\.post\(/, issue: 'Makes HTTP requests (side effect)' },
      { pattern: /math\.random\(/, issue: 'Uses Math.random() (non-deterministic)' },
      { pattern: /date\.now\(|new date\(/i, issue: 'Uses Date.now() or new Date() (non-deterministic)' },
      { pattern: /mutate|push\(|pop\(|shift\(|unshift\(|splice\(|sort\(/, issue: 'Mutates arrays/objects (side effect)' },
      { pattern: /this\./, issue: 'Uses this keyword (may have side effects)' },
    ]

    sideEffectPatterns.forEach(({ pattern, issue }) => {
      if (pattern.test(codeLower)) {
        isPure = false
        issues.push(issue)
      }
    })

    // Check for pure function indicators
    if (codeLower.includes('return')) {
      positives.push('Has return statement')
    }
    if (!codeLower.includes('=') || codeLower.match(/const|let|var/)) {
      positives.push('Uses immutable patterns')
    }
    if (!codeLower.includes('this')) {
      positives.push('No this keyword')
    }

    // Check if function takes parameters
    if (codeLower.match(/function\s+\w+\s*\([^)]*\)/)) {
      positives.push('Takes parameters (not relying on external state)')
    }

    // Check for mutation of parameters
    if (codeLower.match(/function\s+\w+\s*\([^)]*\)\s*\{[^}]*\1\s*=/)) {
      isPure = false
      issues.push('Mutates function parameters')
    }

    setAnalysis({
      isPure,
      issues,
      positives,
    })
  }

  return (
    <div className="space-y-6">
      <div className="bg-salesforce-light-blue border border-salesforce-blue rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-salesforce-blue mt-0.5 flex-shrink-0" />
          <div className="text-sm text-salesforce-dark-blue">
            <p className="font-semibold mb-1">Pure Function Rules:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>No side effects (no DOM manipulation, API calls, console.log, etc.)</li>
              <li>Same input always produces same output (deterministic)</li>
              <li>Doesn't mutate external state or function parameters</li>
              <li>Relies only on its input parameters</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Code Input */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-salesforce-blue" />
            <h3 className="font-semibold text-salesforce-dark-blue">Paste Your Function</h3>
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full h-64 p-4 border-2 border-gray-300 rounded-lg font-mono text-sm focus:border-salesforce-blue focus:outline-none resize-none"
            placeholder="function myFunction(a, b) {&#10;  // Your code here&#10;}"
          />
          <button
            onClick={checkPurity}
            className="w-full px-6 py-3 bg-salesforce-blue text-white rounded-lg hover:bg-salesforce-dark-blue transition-colors font-medium"
          >
            Analyze Function
          </button>
        </div>

        {/* Analysis Results */}
        <div className="space-y-4">
          <h3 className="font-semibold text-salesforce-dark-blue">Analysis Results</h3>
          
          {analysis ? (
            <div className="bg-white border-2 rounded-lg p-6 space-y-4">
              <div className={`flex items-center gap-3 p-4 rounded-lg ${
                analysis.isPure
                  ? 'bg-green-50 border-2 border-green-300'
                  : 'bg-red-50 border-2 border-red-300'
              }`}>
                {analysis.isPure ? (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-600" />
                )}
                <div>
                  <p className={`font-bold text-lg ${
                    analysis.isPure ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {analysis.isPure ? 'Pure Function ✓' : 'Not a Pure Function ✗'}
                  </p>
                  <p className={`text-sm ${
                    analysis.isPure ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {analysis.isPure
                      ? 'This function has no side effects and is deterministic.'
                      : 'This function has side effects or is non-deterministic.'}
                  </p>
                </div>
              </div>

              {analysis.positives.length > 0 && (
                <div>
                  <h4 className="font-semibold text-green-800 mb-2">Positive Indicators:</h4>
                  <ul className="space-y-1">
                    {analysis.positives.map((positive, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-green-700">
                        <CheckCircle className="w-4 h-4" />
                        {positive}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {analysis.issues.length > 0 && (
                <div>
                  <h4 className="font-semibold text-red-800 mb-2">Issues Found:</h4>
                  <ul className="space-y-1">
                    {analysis.issues.map((issue, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-red-700">
                        <XCircle className="w-4 h-4" />
                        {issue}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
              <p className="text-salesforce-gray">
                Paste your function code and click "Analyze Function" to check if it's pure
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Examples */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <h3 className="font-semibold text-salesforce-dark-blue mb-3">Example Functions:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded border border-green-300 overflow-hidden">
            <div className="px-4 py-2 bg-green-50 border-b border-green-300">
              <p className="font-semibold text-green-800">✓ Pure Function:</p>
            </div>
            <div className="rounded-b-lg overflow-hidden">
              <SyntaxHighlighter
                language="javascript"
                style={vscDarkPlus}
                customStyle={{
                  margin: 0,
                  padding: '1rem',
                  fontSize: '0.875rem',
                  lineHeight: '1.5',
                }}
                showLineNumbers={true}
              >
                {`function add(a, b) {
  return a + b;
}`}
              </SyntaxHighlighter>
            </div>
          </div>
          <div className="bg-white rounded border border-red-300 overflow-hidden">
            <div className="px-4 py-2 bg-red-50 border-b border-red-300">
              <p className="font-semibold text-red-800">✗ Impure Function:</p>
            </div>
            <div className="rounded-b-lg overflow-hidden">
              <SyntaxHighlighter
                language="javascript"
                style={vscDarkPlus}
                customStyle={{
                  margin: 0,
                  padding: '1rem',
                  fontSize: '0.875rem',
                  lineHeight: '1.5',
                }}
                showLineNumbers={true}
              >
                {`function add(a, b) {
  console.log(a, b);
  return a + b;
}`}
              </SyntaxHighlighter>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PureFunctionChecker
