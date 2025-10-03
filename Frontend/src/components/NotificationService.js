class NotificationService {
  constructor() {
    this.permission = Notification.permission
    this.init()
  }

  async init() {
    if ('Notification' in window) {
      if (this.permission === 'default') {
        this.permission = await Notification.requestPermission()
      }
    }
  }

  showNotification(title, options = {}) {
    if (this.permission === 'granted') {
      const notification = new Notification(title, {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        ...options
      })

      notification.onclick = () => {
        window.focus()
        notification.close()
      }

      // Auto close after 5 seconds
      setTimeout(() => {
        notification.close()
      }, 5000)

      return notification
    }
  }

  scheduleNotification(task, delay = 0) {
    setTimeout(() => {
      this.showNotification('Task Reminder', {
        body: `Don't forget: ${task.text}`,
        tag: `task-${task.id}`,
        requireInteraction: true
      })
    }, delay)
  }

  checkDailyTasks(tasks) {
    const today = new Date().toDateString()
    const todayTasks = tasks.filter(task => {
      const taskDate = new Date(task.dueDate)
      return taskDate.toDateString() === today && !task.completed && !task.notified
    })

    if (todayTasks.length > 0) {
      this.showNotification('Daily Tasks', {
        body: `You have ${todayTasks.length} task(s) due today!`,
        tag: 'daily-tasks'
      })
    }

    return todayTasks
  }
}

export default new NotificationService()