import { useState } from 'react'
import { Check, X, Edit2, Save, Calendar, Star, Tag, User } from 'lucide-react'

function TodoItem({ todo, onToggle, onDelete, onEdit, onToggleImportant }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(todo.text)

  const handleSave = () => {
    if (editText.trim()) {
      onEdit(todo._id || todo.id, editText.trim())
      setIsEditing(false)
    }
  }

  const handleCancel = () => {
    setEditText(todo.text)
    setIsEditing(false)
  }

  return (
    <div className={`flex items-center p-4 border rounded-xl shadow-sm transition-all duration-200 hover:shadow-md ${
      todo.completed 
        ? 'bg-slate-50 border-slate-200' 
        : 'bg-white border-slate-200 hover:border-slate-300'
    }`}>
      <button
        onClick={() => onToggle(todo._id || todo.id)}
        className={`mr-4 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
          todo.completed 
            ? 'bg-emerald-500 border-emerald-500 text-white scale-110' 
            : 'border-slate-300 hover:border-emerald-500 hover:bg-emerald-50'
        }`}
      >
        {todo.completed && <Check size={12} />}
      </button>

      {isEditing ? (
        <div className="flex-1 flex items-center space-x-2">
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSave()}
            className="flex-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            autoFocus
          />
          <button
            onClick={handleSave}
            className="p-1 text-green-600 hover:text-green-800"
          >
            <Save size={16} />
          </button>
          <button
            onClick={handleCancel}
            className="p-1 text-gray-600 hover:text-gray-800"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <span className={`font-medium ${
                todo.completed 
                  ? 'line-through text-slate-500' 
                  : 'text-slate-800'
              }`}>
                {todo.text}
              </span>
              {todo.important && (
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
              )}
              {todo.priority && (
                <span className={`px-2 py-1 text-xs rounded-full ${
                  todo.priority === 'high' ? 'bg-red-100 text-red-800' :
                  todo.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {todo.priority}
                </span>
              )}
              {todo.category && (
                <span className="flex items-center px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">
                  <Tag className="w-3 h-3 mr-1" />
                  {todo.category}
                </span>
              )}
            </div>
            {(todo.dueDate || todo.assignedTo) && (
              <div className="flex items-center mt-1 text-xs text-gray-500 space-x-3">
                {todo.dueDate && (
                  <div className={`flex items-center ${
                    new Date(todo.dueDate) < new Date() && !todo.completed ? 'text-red-600' : ''
                  }`}>
                    <Calendar size={12} className="mr-1" />
                    {new Date(todo.dueDate).toLocaleDateString()}
                    {new Date(todo.dueDate) < new Date() && !todo.completed && (
                      <span className="ml-1 text-red-600 font-semibold">Overdue</span>
                    )}
                  </div>
                )}
                {todo.assignedTo && (
                  <div className="flex items-center">
                    <User size={12} className="mr-1" />
                    <span>{todo.assignedTo}</span>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="flex space-x-1">
            <button
              onClick={() => onToggleImportant(todo._id || todo.id)}
              className={`p-2 rounded-lg transition-all duration-200 ${
                todo.important 
                  ? 'text-amber-500 hover:text-amber-600 hover:bg-amber-50' 
                  : 'text-slate-400 hover:text-amber-500 hover:bg-amber-50'
              }`}
            >
              <Star size={16} className={todo.important ? 'fill-current' : ''} />
            </button>
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
            >
              <Edit2 size={16} />
            </button>
            <button
              onClick={() => onDelete(todo._id || todo.id)}
              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}


export default TodoItem