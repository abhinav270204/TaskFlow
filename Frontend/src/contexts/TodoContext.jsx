import { createContext, useContext, useState, useEffect } from 'react'
import { todoService } from '../services'
import { useAuth } from './AuthContext'

const TodoContext = createContext()

export const useTodos = () => {
  const context = useContext(TodoContext)
  if (!context) {
    throw new Error('useTodos must be used within a TodoProvider')
  }
  return context
}

export const TodoProvider = ({ children }) => {
  const [todos, setTodos] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { user } = useAuth()

  const fetchTodos = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await todoService.getTodos()
      setTodos(response)
    } catch (error) {
      setError(error.message)
      console.error('Error fetching todos:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTodos()
  }, [])

  const addTodo = async (todoData) => {
    try {
      setError(null)
      const newTodo = {
        text: todoData.text.trim(),
        completed: false,
        important: todoData.important || false,
        priority: todoData.priority || 'medium',
        dueDate: todoData.dueDate || null,
        category: todoData.category?.trim() || null,
        assignedTo: todoData.assignedTo?.trim() || null
      }
      const response = await todoService.createTodo(newTodo)
      setTodos(prev => [response, ...prev])
      return response
    } catch (error) {
      setError(error.message)
      throw error
    }
  }

  const toggleTodo = async (id) => {
    try {
      setError(null)
      const todo = todos.find(t => t._id === id)
      if (!todo) return
      
      const updatedTodo = { ...todo, completed: !todo.completed }
      const response = await todoService.updateTodo(id, updatedTodo)
      setTodos(prev => prev.map(todo =>
        todo._id === id ? response : todo
      ))
      return response
    } catch (error) {
      setError(error.message)
      throw error
    }
  }

  const deleteTodo = async (id) => {
    try {
      setError(null)
      await todoService.deleteTodo(id)
      setTodos(prev => prev.filter(todo => todo._id !== id))
    } catch (error) {
      setError(error.message)
      throw error
    }
  }

  const editTodo = async (id, updates) => {
    try {
      setError(null)
      const response = await todoService.updateTodo(id, updates)
      setTodos(prev => prev.map(todo =>
        todo._id === id ? response : todo
      ))
      return response
    } catch (error) {
      setError(error.message)
      throw error
    }
  }

  const toggleImportant = async (id) => {
    try {
      setError(null)
      const todo = todos.find(t => t._id === id)
      if (!todo) return
      
      const updatedTodo = { ...todo, important: !todo.important }
      const response = await todoService.updateTodo(id, updatedTodo)
      setTodos(prev => prev.map(todo =>
        todo._id === id ? response : todo
      ))
      return response
    } catch (error) {
      setError(error.message)
      throw error
    }
  }

  const getTodosForToday = () => {
    const today = new Date().toDateString()
    return todos.filter(todo => {
      if (!todo.dueDate && !todo.createdAt) return false
      return (todo.dueDate && new Date(todo.dueDate).toDateString() === today) ||
             (todo.createdAt && new Date(todo.createdAt).toDateString() === today)
    })
  }

  const getImportantTodos = () => {
    return todos.filter(todo => todo.important)
  }

  const getPlannedTodos = () => {
    return todos.filter(todo => todo.dueDate)
  }

  const getAssignedTodos = () => {
    return todos.filter(todo => todo.assignedTo)
  }

  const value = {
    todos,
    loading,
    error,
    addTodo,
    toggleTodo,
    deleteTodo,
    editTodo,
    toggleImportant,
    getTodosForToday,
    getImportantTodos,
    getPlannedTodos,
    getAssignedTodos,
    fetchTodos
  }

  return (
    <TodoContext.Provider value={value}>
      {children}
    </TodoContext.Provider>
  )
}

