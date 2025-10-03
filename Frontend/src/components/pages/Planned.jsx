import { useState } from 'react'
import { Plus, Calendar, Clock, AlertTriangle } from 'lucide-react'
import TodoItem from '../TodoItem'
import { useTodos } from '../../contexts/TodoContext'

function Planned() {
  const { getPlannedTodos, addTodo, toggleTodo, deleteTodo, editTodo, toggleImportant } = useTodos()
  const [inputValue, setInputValue] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [filter, setFilter] = useState('all')
  
  const plannedTodos = getPlannedTodos()

  const handleAddTodo = () => {
    if (inputValue.trim() && dueDate) {
      addTodo({
        text: inputValue,
        dueDate: dueDate
      })
      setInputValue('')
      setDueDate('')
    }
  }

  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date().setHours(0, 0, 0, 0)
  }

  const isToday = (dueDate) => {
    const today = new Date().toDateString()
    return new Date(dueDate).toDateString() === today
  }

  const filteredTodos = plannedTodos.filter(todo => {
    if (filter === 'overdue') return isOverdue(todo.dueDate) && !todo.completed
    if (filter === 'today') return isToday(todo.dueDate)
    if (filter === 'upcoming') return new Date(todo.dueDate) > new Date()
    if (filter === 'completed') return todo.completed
    return true
  }).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))

  const overdueCount = plannedTodos.filter(todo => isOverdue(todo.dueDate) && !todo.completed).length
  const todayCount = plannedTodos.filter(todo => isToday(todo.dueDate) && !todo.completed).length

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center">
          <Calendar className="text-blue-500 mr-2" size={32} />
          Planned
        </h1>
        <div className="flex items-center space-x-4 text-sm">
          {overdueCount > 0 && (
            <div className="flex items-center text-red-600">
              <AlertTriangle size={16} className="mr-1" />
              {overdueCount} overdue
            </div>
          )}
          {todayCount > 0 && (
            <div className="flex items-center text-orange-600">
              <Clock size={16} className="mr-1" />
              {todayCount} due today
            </div>
          )}
        </div>
      </div>

      <div className="mb-6">
        <div className="flex mb-3">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddTodo()}
            placeholder="Add a planned task..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="px-3 py-3 border-t border-b border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleAddTodo}
            disabled={!inputValue.trim() || !dueDate}
            className="px-6 py-3 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-300"
          >
            <Plus size={20} />
          </button>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded text-sm ${
              filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            All ({plannedTodos.length})
          </button>
          <button
            onClick={() => setFilter('overdue')}
            className={`px-3 py-1 rounded text-sm ${
              filter === 'overdue' ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Overdue ({overdueCount})
          </button>
          <button
            onClick={() => setFilter('today')}
            className={`px-3 py-1 rounded text-sm ${
              filter === 'today' ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Today ({todayCount})
          </button>
          <button
            onClick={() => setFilter('upcoming')}
            className={`px-3 py-1 rounded text-sm ${
              filter === 'upcoming' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-3 py-1 rounded text-sm ${
              filter === 'completed' ? 'bg-gray-500 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Completed
          </button>
        </div>
      </div>
      
      <div className="space-y-2">
        {filteredTodos.map(todo => (
          <div key={todo.id} className={`border-l-4 ${
            isOverdue(todo.dueDate) && !todo.completed ? 'border-red-500' :
            isToday(todo.dueDate) ? 'border-orange-500' :
            'border-blue-500'
          } pl-4`}>
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

      {filteredTodos.length === 0 && plannedTodos.length > 0 && (
        <div className="text-center text-gray-500 py-8">
          No tasks match the current filter.
        </div>
      )}

      {plannedTodos.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          <Calendar className="mx-auto mb-4 text-gray-400" size={48} />
          <p className="text-lg mb-2">No planned tasks yet</p>
          <p className="text-sm">Add tasks with due dates to stay organized!</p>
        </div>
      )}
    </div>
  )
}

export default Planned