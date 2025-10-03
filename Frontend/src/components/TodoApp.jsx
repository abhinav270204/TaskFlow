import { useState } from 'react'
import { Plus, Search, Filter } from 'lucide-react'
import TodoItem from './TodoItem'
import { useTodos } from '../contexts/TodoContext'

function TodoApp() {
  const { todos, addTodo, toggleTodo, deleteTodo, editTodo, toggleImportant } = useTodos()
  const [inputValue, setInputValue] = useState('')
  const [priority, setPriority] = useState('medium')
  const [dueDate, setDueDate] = useState('')
  const [category, setCategory] = useState('')
  const [assignedTo, setAssignedTo] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterPriority, setFilterPriority] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [showFilters, setShowFilters] = useState(false)

  const handleAddTodo = async () => {
    if (inputValue.trim()) {
      try {
        await addTodo({
          text: inputValue.trim(),
          priority,
          dueDate: dueDate || null,
          category: category.trim() || null,
          assignedTo: assignedTo.trim() || null
        })
        setInputValue('')
        setPriority('medium')
        setDueDate('')
        setCategory('')
        setAssignedTo('')
      } catch (error) {
        console.error('Error adding todo:', error)
      }
    }
  }

  const filteredTodos = todos.filter(todo => {
    const matchesSearch = todo.text.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPriority = filterPriority === 'all' || todo.priority === filterPriority
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'completed' && todo.completed) ||
      (filterStatus === 'pending' && !todo.completed) ||
      (filterStatus === 'important' && todo.important)
    return matchesSearch && matchesPriority && matchesStatus
  })

  const completedCount = todos.filter(todo => todo.completed).length
  const importantCount = todos.filter(todo => todo.important).length

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-blue-100 rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        My To-Do List
      </h1>
      
      {/* Add Task Form */}
      <div className="bg-white p-4 rounded-lg mb-6 shadow">
        <div className="flex mb-3">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddTodo()}
            placeholder="Add a new task..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleAddTodo}
            className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Plus size={20} />
          </button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>
          
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Category"
            className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          <input
            type="text"
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
            placeholder="Assign to"
            className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-4 rounded-lg mb-6 shadow">
        <div className="flex items-center space-x-3 mb-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search tasks..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 flex items-center space-x-2"
          >
            <Filter size={16} />
            <span>Filters</span>
          </button>
        </div>
        
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Tasks</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="important">Important</option>
            </select>
          </div>
        )}
      </div>

      <div className="space-y-2 mb-4">
        {filteredTodos.map(todo => (
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

      {todos.length > 0 && (
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">{todos.length}</div>
              <div className="text-sm text-gray-600">Total Tasks</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{completedCount}</div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">{todos.length - completedCount}</div>
              <div className="text-sm text-gray-600">Pending</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">{importantCount}</div>
              <div className="text-sm text-gray-600">Important</div>
            </div>
          </div>
        </div>
      )}

      {filteredTodos.length === 0 && todos.length > 0 && (
        <div className="text-center text-gray-500 py-8">
          No tasks match your current filters.
        </div>
      )}
      
      {todos.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          No tasks yet. Add one above!
        </div>
      )}
    </div>
  )
}

export default TodoApp