import { useState } from 'react'
import { Plus, List } from 'lucide-react'
import TodoItem from '../TodoItem'
import { useTodos } from '../../contexts/TodoContext'

function Tasks() {
  const { todos, addTodo, toggleTodo, deleteTodo, editTodo, toggleImportant } = useTodos()
  const [inputValue, setInputValue] = useState('')
  const [category, setCategory] = useState('')
  const [filter, setFilter] = useState('all')

  const handleAddTodo = () => {
    if (inputValue.trim()) {
      addTodo({
        text: inputValue,
        category: category || null
      })
      setInputValue('')
      setCategory('')
    }
  }

  const filteredTodos = todos.filter(todo => {
    if (filter === 'completed') return todo.completed
    if (filter === 'pending') return !todo.completed
    if (filter === 'important') return todo.important
    return true
  })

  const completedCount = todos.filter(todo => todo.completed).length

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-6">
        <h1 className="text-3xl font-bold text-slate-800 flex items-center mb-4">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl mr-4">
            <List className="text-white" size={28} />
          </div>
          All Tasks
        </h1>
        
        <div className="flex mb-4">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddTodo()}
            placeholder="Add a new task..."
            className="flex-1 px-4 py-3 border border-slate-300 rounded-l-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Category (optional)"
            className="px-3 py-3 border-t border-b border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={handleAddTodo}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-r-xl hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
          >
            <Plus size={20} />
          </button>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              filter === 'all' ? 'bg-blue-500 text-white shadow-md' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All ({todos.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              filter === 'pending' ? 'bg-orange-500 text-white shadow-md' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Pending ({todos.filter(t => !t.completed).length})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              filter === 'completed' ? 'bg-emerald-500 text-white shadow-md' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Completed ({completedCount})
          </button>
          <button
            onClick={() => setFilter('important')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              filter === 'important' ? 'bg-amber-500 text-white shadow-md' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Important ({todos.filter(t => t.important).length})
          </button>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        {filteredTodos.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
            onEdit={editTodo}
            onToggleImportant={toggleImportant}
          />
        ))}
      </div>

      {todos.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
          <div className="text-sm text-slate-600 text-center">
            {completedCount} of {todos.length} tasks completed
          </div>
        </div>
      )}

      {filteredTodos.length === 0 && todos.length > 0 && (
        <div className="text-center text-gray-500 py-8">
          No tasks match the current filter.
        </div>
      )}

      {todos.length === 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
          <div className="p-4 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
            <List className="text-blue-600" size={32} />
          </div>
          <p className="text-xl font-semibold text-slate-800 mb-2">No tasks yet</p>
          <p className="text-slate-600">Add your first task to get started!</p>
        </div>
      )}
    </div>
  )
}

export default Tasks