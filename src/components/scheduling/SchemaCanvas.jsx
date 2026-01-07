import { useState } from 'react'
import { Plus, X, Link2, Database, Info } from 'lucide-react'

function SchemaCanvas() {
  const [tables, setTables] = useState([
    { id: 1, name: 'Users', x: 50, y: 50, fields: ['Id', 'Name', 'Email', 'Role'] },
    { id: 2, name: 'Appointments', x: 300, y: 50, fields: ['Id', 'UserId', 'StartTime', 'EndTime', 'Status'] },
    { id: 3, name: 'Resources', x: 550, y: 50, fields: ['Id', 'Name', 'Type', 'Capacity'] },
  ])
  const [relationships, setRelationships] = useState([
    { id: 1, from: 1, to: 2, type: 'lookup' },
  ])
  const [dragging, setDragging] = useState(null)
  const [draggingOffset, setDraggingOffset] = useState({ x: 0, y: 0 })
  const [showAddTable, setShowAddTable] = useState(false)
  const [newTableName, setNewTableName] = useState('')

  const handleMouseDown = (e, tableId) => {
    const table = tables.find(t => t.id === tableId)
    setDragging(tableId)
    setDraggingOffset({
      x: e.clientX - table.x,
      y: e.clientY - table.y,
    })
  }

  const handleMouseMove = (e) => {
    if (dragging) {
      setTables(tables.map(t => 
        t.id === dragging 
          ? { ...t, x: e.clientX - draggingOffset.x, y: e.clientY - draggingOffset.y }
          : t
      ))
    }
  }

  const handleMouseUp = () => {
    setDragging(null)
  }

  const addTable = () => {
    if (newTableName.trim()) {
      const newTable = {
        id: Date.now(),
        name: newTableName,
        x: Math.random() * 400 + 100,
        y: Math.random() * 300 + 100,
        fields: ['Id'],
      }
      setTables([...tables, newTable])
      setNewTableName('')
      setShowAddTable(false)
    }
  }

  const removeTable = (id) => {
    setTables(tables.filter(t => t.id !== id))
    setRelationships(relationships.filter(r => r.from !== id && r.to !== id))
  }

  const addRelationship = (fromId, toId) => {
    const existing = relationships.find(r => 
      (r.from === fromId && r.to === toId) || (r.from === toId && r.to === fromId)
    )
    if (!existing) {
      setRelationships([...relationships, {
        id: Date.now(),
        from: fromId,
        to: toId,
        type: 'lookup',
      }])
    }
  }

  const toggleRelationshipType = (relId) => {
    setRelationships(relationships.map(r =>
      r.id === relId
        ? { ...r, type: r.type === 'lookup' ? 'master-detail' : 'lookup' }
        : r
    ))
  }

  const getTableCenter = (table) => ({
    x: table.x + 120,
    y: table.y + 30,
  })

  return (
    <div className="space-y-6">
      <div className="bg-salesforce-light-blue border border-salesforce-blue rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-salesforce-blue mt-0.5 flex-shrink-0" />
          <div className="text-sm text-salesforce-dark-blue">
            <p className="font-semibold mb-1">Database Schema Design:</p>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>Lookup Relationship:</strong> Loose relationship, child can exist without parent</li>
              <li><strong>Master-Detail Relationship:</strong> Strong relationship, child deleted when parent is deleted</li>
              <li>Drag tables to reposition them on the canvas</li>
              <li>Click the link icon to create relationships between tables</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex gap-4 items-center">
        <button
          onClick={() => setShowAddTable(!showAddTable)}
          className="flex items-center gap-2 px-4 py-2 bg-salesforce-blue text-white rounded-lg hover:bg-salesforce-dark-blue transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Table
        </button>
        {showAddTable && (
          <div className="flex gap-2">
            <input
              type="text"
              value={newTableName}
              onChange={(e) => setNewTableName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTable()}
              placeholder="Table name..."
              className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-salesforce-blue focus:outline-none"
            />
            <button
              onClick={addTable}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Create
            </button>
          </div>
        )}
      </div>

      <div
        className="relative bg-gray-50 border-2 border-gray-300 rounded-lg overflow-hidden"
        style={{ height: '600px' }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* SVG for relationships */}
        <svg className="absolute inset-0 pointer-events-none" style={{ width: '100%', height: '100%' }}>
          {relationships.map(rel => {
            const fromTable = tables.find(t => t.id === rel.from)
            const toTable = tables.find(t => t.id === rel.to)
            if (!fromTable || !toTable) return null
            
            const from = getTableCenter(fromTable)
            const to = getTableCenter(toTable)
            
            return (
              <g key={rel.id}>
                <line
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  stroke={rel.type === 'master-detail' ? '#dc2626' : '#0176D3'}
                  strokeWidth="2"
                  markerEnd="url(#arrowhead)"
                />
                <text
                  x={(from.x + to.x) / 2}
                  y={(from.y + to.y) / 2 - 5}
                  textAnchor="middle"
                  className="text-xs fill-salesforce-dark-blue font-semibold pointer-events-auto"
                  onClick={() => toggleRelationshipType(rel.id)}
                  style={{ cursor: 'pointer' }}
                >
                  {rel.type === 'master-detail' ? 'M-D' : 'Lookup'}
                </text>
              </g>
            )
          })}
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="10"
              refX="9"
              refY="3"
              orient="auto"
            >
              <polygon points="0 0, 10 3, 0 6" fill="#0176D3" />
            </marker>
          </defs>
        </svg>

        {/* Tables */}
        {tables.map(table => (
          <div
            key={table.id}
            className="absolute bg-white border-2 border-salesforce-blue rounded-lg shadow-lg cursor-move"
            style={{
              left: `${table.x}px`,
              top: `${table.y}px`,
              width: '240px',
            }}
            onMouseDown={(e) => handleMouseDown(e, table.id)}
          >
            <div className="bg-salesforce-blue text-white px-4 py-2 flex items-center justify-between rounded-t-lg">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4" />
                <span className="font-semibold">{table.name}</span>
              </div>
              <div className="flex items-center gap-2">
                {tables.filter(t => t.id !== table.id).map(otherTable => (
                  <button
                    key={otherTable.id}
                    onClick={() => addRelationship(table.id, otherTable.id)}
                    className="p-1 hover:bg-salesforce-dark-blue rounded"
                    title={`Link to ${otherTable.name}`}
                  >
                    <Link2 className="w-3 h-3" />
                  </button>
                ))}
                <button
                  onClick={() => removeTable(table.id)}
                  className="p-1 hover:bg-red-600 rounded"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            </div>
            <div className="p-3 space-y-1">
              {table.fields.map((field, idx) => (
                <div key={idx} className="text-sm text-gray-700 px-2 py-1 bg-gray-50 rounded">
                  {field}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <h3 className="font-semibold text-salesforce-dark-blue mb-2">Relationship Types:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded border-2 border-salesforce-blue">
            <p className="font-semibold text-salesforce-blue mb-2">Lookup Relationship</p>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Optional relationship</li>
              <li>• Child record can exist without parent</li>
              <li>• Deleting parent doesn't delete child</li>
              <li>• Used for: Appointments → Users</li>
            </ul>
          </div>
          <div className="bg-white p-4 rounded border-2 border-red-500">
            <p className="font-semibold text-red-600 mb-2">Master-Detail Relationship</p>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Required relationship</li>
              <li>• Child cannot exist without parent</li>
              <li>• Deleting parent cascades to child</li>
              <li>• Used for: Line Items → Order</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SchemaCanvas
