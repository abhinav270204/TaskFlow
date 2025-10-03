import { useState } from 'react'
import { Plus, Calendar, Sun } from 'lucide-react'
import TodoItem from '../TodoItem'
import { useTodos } from '../../contexts/TodoContext'

function MyDay() {
  const { getTodosForToday, addTodo, toggleTodo, deleteTodo, editTodo, toggleImportant } = useTodos()
  const [inputValue, setInputValue] = useState('')
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0])
  
  const todayTodos = getTodosForToday()

  const handleAddTodo = () => {
    if (inputValue.trim()) {
      addTodo({
        text: inputValue,
        dueDate: dueDate || new Date().toISOString().split('T')[0]
      })
      setInputValue('')
    }
  }

  const completedCount = todayTodos.filter(todo => todo.completed).length
  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-6">
        <h1 className="text-3xl font-bold text-slate-800 flex items-center mb-3">
          <div className="p-3 bg-gradient-to-r from-amber-400 to-orange-500 rounded-xl mr-4">
            <Sun className="text-white" size={28} />
          </div>
          My Day
        </h1>
        <p className="text-slate-600 text-lg">{today}</p>
      </div>
      
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
        <div className="flex mb-4">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddTodo()}
            placeholder="Add a task to My Day..."
            className="flex-1 px-4 py-3 border border-slate-300 rounded-l-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={handleAddTodo}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-r-xl hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
          >
            <Plus size={20} />
          </button>
        </div>
        
        <div className="flex items-center space-x-3">
          <Calendar size={16} className="text-slate-500" />
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <span className="text-sm text-slate-500">
            {dueDate ? 'Due: ' + new Date(dueDate).toLocaleDateString() : 'No due date'}
          </span>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        {todayTodos.map(todo => (
          <TodoItem
            key={todo._id || todo.id}
            todo={todo}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
            onEdit={editTodo}
            onToggleImportant={toggleImportant}
          />
        ))}
      </div>

      {todayTodos.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
          <div className="text-sm text-slate-600 text-center">
            {completedCount} of {todayTodos.length} tasks completed
          </div>
        </div>
      )}

      {todayTodos.length === 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
          <div className="p-4 bg-gradient-to-r from-amber-100 to-orange-100 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
            <Sun className="text-amber-600" size={32} />
          </div>
          <p className="text-xl font-semibold text-slate-800 mb-2">No tasks for today</p>
          <p className="text-slate-600">Add tasks to get started with your day!</p>
        </div>
      )}
    </div>
  )
}

export default MyDay