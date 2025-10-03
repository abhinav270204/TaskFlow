import TodoApp from './components/TodoApp'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Login from './components/Login'
import MyDay from './components/pages/MyDay'
import Calendar from './components/pages/Calendar'
import Important from './components/pages/Important'
import Planned from './components/pages/Planned'
import AssignedMe from './components/pages/AssignedMe'
import FlaggedEmail from './components/pages/FlaggedEmail'
import Tasks from './components/pages/Tasks'
import { TodoProvider } from './contexts/TodoContext'
import { useAuth } from './contexts/AuthContext'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-slate-600">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return <Login />
  }

  return (
    <TodoProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
          <Navbar />
          <div className="flex">
            <Sidebar />
            <div className="ml-64 flex-1 p-6">
              <Routes>
                <Route path="/" element={<TodoApp />} />
                <Route path="/pages/MyDay" element={<MyDay />} />
                <Route path="/pages/Calendar" element={<Calendar />} />
                <Route path="/important" element={<Important />} />
                <Route path="/planned" element={<Planned />} />
                <Route path="/assigned" element={<AssignedMe />} />
                <Route path='/flagged' element={<FlaggedEmail />} />
                <Route path='/tasks' element={<Tasks />} />
              </Routes>
            </div>
          </div>
        </div>
      </BrowserRouter>
    </TodoProvider>
  )
}

export default App