import { useState } from 'react'
import { CheckSquare, Search, Bell, User, LogOut, Settings } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export default function Navbar() {
    const [showUserMenu, setShowUserMenu] = useState(false)
    const { user, logout } = useAuth()

    const handleLogout = () => {
        logout()
        setShowUserMenu(false)
    }

    return (
        <nav className="bg-white border-b border-slate-200 shadow-sm backdrop-blur-sm">
            <div className='max-w-7xl mx-auto px-6'>
                <div className='flex justify-between items-center h-16'>
                    <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                            <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg">
                                <CheckSquare size={20} className="text-white" />
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">TaskFlow</span>
                        </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                            <input 
                                type="text" 
                                placeholder="Search tasks..."
                                className="pl-10 pr-4 py-2 w-64 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            />
                        </div>
                        
                        <button className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            <Bell size={20} />
                        </button>
                        
                        <div className="relative">
                            <button 
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                className="flex items-center space-x-2 p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                                <User size={20} />
                                <span className="text-sm font-medium">{user?.name}</span>
                            </button>
                            
                            {showUserMenu && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-2 z-50">
                                    <div className="px-4 py-2 border-b border-slate-200">
                                        <p className="text-sm font-medium text-slate-800">{user?.name}</p>
                                        <p className="text-xs text-slate-600">{user?.email}</p>
                                    </div>
                                    <button className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                                        <Settings size={16} />
                                        <span>Settings</span>
                                    </button>
                                    <button 
                                        onClick={handleLogout}
                                        className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                    >
                                        <LogOut size={16} />
                                        <span>Sign out</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    )
}

