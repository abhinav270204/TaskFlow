import { useState } from 'react'
import { Plus, Star } from 'lucide-react'
import TodoItem from '../TodoItem'
import { useTodos } from '../../contexts/TodoContext'

function Important() {
  const { getImportantTodos, addTodo, toggleTodo, deleteTodo, editTodo, toggleImportant } = useTodos()
  const [inputValue, setInputValue] = useState('')
  const [filter, setFilter] = useState('all')
  
  const importantTodos = getImportantTodos()

  const handleAddTodo = () => {
    if (inputValue.trim()) {
      addTodo({
        text: inputValue,
        important: true
      })
      setInputValue('')
    }
  }

  const filteredTodos = importantTodos.filter(todo => {
    if (filter === 'completed') return todo.completed
    if (filter === 'pending') return !todo.completed
    return true
  })

  const completedCount = importantTodos.filter(todo => todo.completed).length

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-6">
        <h1 className="text-3xl font-bold text-slate-800 flex items-center mb-4">
          <div className="p-3 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-xl mr-4">
            <Star className="text-white" size={28} />
          </div>
          Important Tasks
        </h1>
        
        <div className="flex mb-4">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddTodo()}
            placeholder="Add an important task..."
            className="flex-1 px-4 py-3 border border-slate-300 rounded-l-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
          <button
            onClick={handleAddTodo}
            className="px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-600 text-white rounded-r-xl hover:from-amber-600 hover:to-yellow-700 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all duration-200"
          >
            <Plus size={20} />
          </button>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              filter === 'all' ? 'bg-amber-500 text-white shadow-md' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All ({importantTodos.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              filter === 'pending' ? 'bg-orange-500 text-white shadow-md' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Pending ({importantTodos.filter(t => !t.completed).length})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              filter === 'completed' ? 'bg-emerald-500 text-white shadow-md' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Completed ({completedCount})
          </button>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        {filteredTodos.map(todo => (
          <TodoItem
            key={todo._id}
            todo={todo}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
            onEdit={editTodo}
            onToggleImportant={toggleImportant}
          />
        ))}
      </div>

      {importantTodos.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
          <div className="text-sm text-slate-600 text-center">
            {completedCount} of {importantTodos.length} important tasks completed
          </div>
        </div>
      )}

      {filteredTodos.length === 0 && importantTodos.length > 0 && (
        <div className="text-center text-gray-500 py-8">
          No tasks match the current filter.
        </div>
      )}

      {importantTodos.length === 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
          <div className="p-4 bg-gradient-to-r from-amber-100 to-yellow-100 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
            <Star className="text-amber-600" size={32} />
          </div>
          <p className="text-xl font-semibold text-slate-800 mb-2">No important tasks yet</p>
          <p className="text-slate-600">Add tasks and mark them as important!</p>
        </div>
      )}
    </div>
  )
}

export default Important