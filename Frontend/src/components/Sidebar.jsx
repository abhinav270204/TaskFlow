import { NavLink } from 'react-router-dom'
import { Sun, Star, Calendar, User, Flag, List, CheckSquare, Plus } from 'lucide-react'
import { useTodos } from '../contexts/TodoContext'

const Sidebar = () => {
  const { todos, getTodosForToday, getImportantTodos, getPlannedTodos, getAssignedTodos } = useTodos()
  
  const todayCount = getTodosForToday().filter(t => !t.completed).length
  const importantCount = getImportantTodos().filter(t => !t.completed).length
  const plannedCount = getPlannedTodos().filter(t => !t.completed).length
  const assignedCount = getAssignedTodos().filter(t => !t.completed).length
  const totalCount = todos.filter(t => !t.completed).length

  const navItems = [
    { to: "./pages/MyDay", icon: Sun, label: "My Day", count: todayCount, color: "text-amber-500" },
    { to: "/important", icon: Star, label: "Important", count: importantCount, color: "text-red-500" },
    { to: "/planned", icon: Calendar, label: "Planned", count: plannedCount, color: "text-blue-500" },
    { to: "./pages/Calendar", icon: Calendar, label: "Calendar", count: 0, color: "text-green-500" },
    { to: "/assigned", icon: User, label: "Assigned to me", count: assignedCount, color: "text-purple-500" },
    { to: "/flagged", icon: Flag, label: "Flagged Emails", count: 0, color: "text-orange-500" },
    { to: "/tasks", icon: List, label: "All Tasks", count: totalCount, color: "text-slate-600" }
  ]

  return (
    <div className='w-64 bg-white border-r border-slate-200 h-screen shadow-sm'>
      <div className='p-6 border-b border-slate-200'>
        <div className="flex items-center space-x-2 mb-4">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg">
            <CheckSquare size={16} className="text-white" />
          </div>
          <span className="font-semibold text-slate-800">TaskFlow</span>
        </div>
        <button className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2.5 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-sm">
          <Plus size={16} />
          <span className="font-medium">New Task</span>
        </button>
      </div>
      
      <nav className='p-4'>
        <ul className='space-y-1'>
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink 
                to={item.to} 
                className={({ isActive }) => 
                  `flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                    isActive 
                      ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`
                }
              >
                <div className="flex items-center space-x-3">
                  <item.icon size={18} className={`${item.color} group-hover:scale-110 transition-transform`} />
                  <span className="font-medium text-sm">{item.label}</span>
                </div>
                {item.count > 0 && (
                  <span className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-full font-medium">
                    {item.count}
                  </span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}

export default Sidebar

