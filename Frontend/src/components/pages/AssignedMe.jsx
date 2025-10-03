import { useState } from 'react'
import { Plus, User, Users, Clock, CheckCircle } from 'lucide-react'
import TodoItem from '../TodoItem'
import { useTodos } from '../../contexts/TodoContext'

function AssignedMe() {
  const { getAssignedTodos, addTodo, toggleTodo, deleteTodo, editTodo, toggleImportant } = useTodos()
  const [inputValue, setInputValue] = useState('')
  const [assignedBy, setAssignedBy] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [filter, setFilter] = useState('all')
  
  const todos = getAssignedTodos()

  const handleAddTodo = () => {
    if (inputValue.trim() && assignedBy.trim()) {
      addTodo({
        text: inputValue,
        assignedTo: 'Me',
        dueDate: dueDate || null,
        category: `Assigned by ${assignedBy}`
      })
      setInputValue('')
      setAssignedBy('')
      setDueDate('')
    }
  }

  const filteredTodos = todos.filter(todo => {
    if (filter === 'completed') return todo.completed
    if (filter === 'pending') return !todo.completed
    return true
  })

  const completedCount = todos.filter(todo => todo.completed).length
  const pendingCount = todos.filter(todo => !todo.completed).length

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center">
          <User className="text-purple-500 mr-2" size={32} />
          Assigned to me
        </h1>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center text-orange-600">
            <Clock size={16} className="mr-1" />
            {pendingCount} pending
          </div>
          <div className="flex items-center text-green-600">
            <CheckCircle size={16} className="mr-1" />
            {completedCount} completed
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddTodo()}
            placeholder="Task description..."
            className="px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <input
            type="text"
            value={assignedBy}
            onChange={(e) => setAssignedBy(e.target.value)}
            placeholder="Assigned by..."
            className="px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <div className="flex">
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="flex-1 px-3 py-3 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={handleAddTodo}
              disabled={!inputValue.trim() || !assignedBy.trim()}
              className="px-6 py-3 bg-purple-500 text-white rounded-r-md hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-300"
            >
              <Plus size={20} />
            </button>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded text-sm ${
              filter === 'all' ? 'bg-purple-500 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            All ({todos.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-3 py-1 rounded text-sm ${
              filter === 'pending' ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Pending ({pendingCount})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-3 py-1 rounded text-sm ${
              filter === 'completed' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Completed ({completedCount})
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {filteredTodos.map(todo => (
          <div key={todo.id} className="border-l-4 border-purple-500 pl-4">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Users size={14} />
                <span>Assigned by: <strong>{todo.category?.replace('Assigned by ', '') || 'Unknown'}</strong></span>
                {todo.dueDate && (
                  <span className="text-orange-600">
                    Due: {new Date(todo.dueDate).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
            <TodoItem
              todo={todo}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
              onEdit={editTodo}
              onToggleImportant={toggleImportant}
            />
          </div>
        ))}
      </div>

      {filteredTodos.length === 0 && todos.length > 0 && (
        <div className="text-center text-gray-500 py-8">
          No tasks match the current filter.
        </div>
      )}

      {todos.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          <User className="mx-auto mb-4 text-gray-400" size={48} />
          <p className="text-lg mb-2">No assigned tasks yet</p>
          <p className="text-sm">Tasks assigned to you will appear here!</p>
        </div>
      )}
    </div>
  )
}

export default AssignedMe