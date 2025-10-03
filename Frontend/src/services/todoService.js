const TODOS_KEY = 'taskflow_todos'

const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

const getTodosFromStorage = () => {
  const todos = localStorage.getItem(TODOS_KEY)
  return todos ? JSON.parse(todos) : []
}

const saveTodosToStorage = (todos) => {
  localStorage.setItem(TODOS_KEY, JSON.stringify(todos))
}

export const todoService = {
  getTodos: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(getTodosFromStorage())
      }, 100)
    })
  },
  
  createTodo: async (todo) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const todos = getTodosFromStorage()
        const newTodo = {
          ...todo,
          _id: generateId(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        todos.unshift(newTodo)
        saveTodosToStorage(todos)
        resolve(newTodo)
      }, 100)
    })
  },
  
  updateTodo: async (id, updates) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const todos = getTodosFromStorage()
        const index = todos.findIndex(todo => todo._id === id)
        if (index === -1) {
          reject(new Error('Todo not found'))
          return
        }
        const updatedTodo = {
          ...todos[index],
          ...updates,
          updatedAt: new Date().toISOString()
        }
        todos[index] = updatedTodo
        saveTodosToStorage(todos)
        resolve(updatedTodo)
      }, 100)
    })
  },
  
  deleteTodo: async (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const todos = getTodosFromStorage()
        const index = todos.findIndex(todo => todo._id === id)
        if (index === -1) {
          reject(new Error('Todo not found'))
          return
        }
        todos.splice(index, 1)
        saveTodosToStorage(todos)
        resolve({ success: true })
      }, 100)
    })
  }
}