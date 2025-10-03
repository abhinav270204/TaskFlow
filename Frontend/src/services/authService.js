const USERS_KEY = 'taskflow_users'
const CURRENT_USER_KEY = 'taskflow_current_user'

const getUsersFromStorage = () => {
  const users = localStorage.getItem(USERS_KEY)
  return users ? JSON.parse(users) : []
}

const saveUsersToStorage = (users) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

const generateToken = () => {
  return 'local_' + Date.now().toString(36) + Math.random().toString(36).substr(2)
}

export const authService = {
  login: async (email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = getUsersFromStorage()
        const user = users.find(u => u.email === email && u.password === password)
        
        if (!user) {
          reject(new Error('Invalid email or password'))
          return
        }

        const token = generateToken()
        const userResponse = { id: user.id, name: user.name, email: user.email }
        
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(userResponse))
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userResponse))
        
        resolve({ token, user: userResponse })
      }, 500)
    })
  },

  register: async (name, email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = getUsersFromStorage()
        
        if (users.find(u => u.email === email)) {
          reject(new Error('User already exists with this email'))
          return
        }

        const newUser = {
          id: Date.now().toString(),
          name,
          email,
          password,
          createdAt: new Date().toISOString()
        }
        
        users.push(newUser)
        saveUsersToStorage(users)
        
        const token = generateToken()
        const userResponse = { id: newUser.id, name: newUser.name, email: newUser.email }
        
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(userResponse))
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userResponse))
        
        resolve({ token, user: userResponse })
      }, 500)
    })
  },

  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem(CURRENT_USER_KEY)
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  },

  getToken: () => {
    return localStorage.getItem('token')
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token')
  }
}