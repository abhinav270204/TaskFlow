import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Plus, Bell } from 'lucide-react'
import TodoItem from '../TodoItem'
import { useTodos } from '../../contexts/TodoContext'

function Calendar() {
  const { todos, addTodo, toggleTodo, deleteTodo, editTodo, toggleImportant } = useTodos()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [inputValue, setInputValue] = useState('')
  const [showAddTask, setShowAddTask] = useState(false)

  useEffect(() => {
    requestNotificationPermission()
    checkForNotifications()
  }, [todos])

  const requestNotificationPermission = () => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }

  const checkForNotifications = () => {
    const today = new Date()
    const todayStr = today.toDateString()
    
    todos.forEach(task => {
      const taskDate = new Date(task.dueDate)
      if (taskDate.toDateString() === todayStr && !task.completed && !task.notified) {
        showNotification(task)
      }
    })
  }

  const showNotification = (task) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Task Reminder', {
        body: `Don't forget: ${task.text}`,
        icon: '/favicon.ico'
      })
    }
  }

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      newDate.setMonth(prev.getMonth() + direction)
      return newDate
    })
  }

  const formatDate = (date) => {
    return date.toISOString().split('T')[0]
  }

  const getTasksForDate = (date) => {
    const dateStr = formatDate(date)
    return todos.filter(task => task.dueDate === dateStr)
  }

  const addTask = () => {
    if (inputValue.trim()) {
      addTodo({
        text: inputValue,
        dueDate: formatDate(selectedDate)
      })
      setInputValue('')
      setShowAddTask(false)
    }
  }

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate)
    const firstDay = getFirstDayOfMonth(currentDate)
    const days = []

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 border border-gray-200"></div>)
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
      const dayTasks = getTasksForDate(date)
      const isSelected = selectedDate.toDateString() === date.toDateString()
      const isToday = new Date().toDateString() === date.toDateString()

      days.push(
        <div
          key={day}
          onClick={() => setSelectedDate(date)}
          className={`h-24 border border-gray-200 p-1 cursor-pointer hover:bg-gray-50 ${
            isSelected ? 'bg-blue-100 border-blue-500' : ''
          } ${isToday ? 'bg-yellow-50' : ''}`}
        >
          <div className={`text-sm font-medium ${isToday ? 'text-blue-600' : 'text-gray-700'}`}>
            {day}
          </div>
          <div className="mt-1 space-y-1">
            {dayTasks.slice(0, 2).map(task => (
              <div
                key={task.id}
                className={`text-xs p-1 rounded truncate ${
                  task.completed ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                }`}
              >
                {task.text}
              </div>
            ))}
            {dayTasks.length > 2 && (
              <div className="text-xs text-gray-500">+{dayTasks.length - 2} more</div>
            )}
          </div>
        </div>
      )
    }

    return days
  }

  const selectedDateTasks = getTasksForDate(selectedDate)

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center">
          <Bell className="mr-2" size={28} />
          Calendar
        </h1>
        <button
          onClick={() => checkForNotifications()}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Check Notifications
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={() => navigateMonth(-1)}
                className="p-2 hover:bg-gray-100 rounded"
              >
                <ChevronLeft size={20} />
              </button>
              <h2 className="text-xl font-semibold">
                {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h2>
              <button
                onClick={() => navigateMonth(1)}
                className="p-2 hover:bg-gray-100 rounded"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-0 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="p-2 text-center text-sm font-medium text-gray-600">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-0 border border-gray-200">
              {renderCalendarDays()}
            </div>
          </div>
        </div>

        {/* Tasks for selected date */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">
              {selectedDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'short', 
                day: 'numeric' 
              })}
            </h3>
            <button
              onClick={() => setShowAddTask(!showAddTask)}
              className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              <Plus size={16} />
            </button>
          </div>

          {showAddTask && (
            <div className="mb-4">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTask()}
                placeholder="Add a task..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  onClick={addTask}
                  className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                >
                  Add
                </button>
                <button
                  onClick={() => setShowAddTask(false)}
                  className="px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="space-y-2">
            {selectedDateTasks.map(task => (
              <TodoItem
                key={task.id}
                todo={task}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
                onEdit={editTodo}
                onToggleImportant={toggleImportant}
              />
            ))}
          </div>

          {selectedDateTasks.length === 0 && (
            <div className="text-center text-gray-500 py-4">
              No tasks for this date
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Calendar