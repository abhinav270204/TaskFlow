import { useState, useEffect } from 'react'
import { Flag, Mail, MailOpen, Star, Archive, Trash2, Reply, Forward, Search, Filter, SortAsc } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'

function FlaggedEmail() {
  const [emails, setEmails] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterBy, setFilterBy] = useState('all')
  const [sortBy, setSortBy] = useState('date')
  const [selectedEmails, setSelectedEmails] = useState([])

  useEffect(() => {
    const savedEmails = localStorage.getItem('flaggedEmails')
    if (savedEmails) {
      setEmails(JSON.parse(savedEmails))
    } else {
      // Sample data
      const sampleEmails = [
        {
          id: uuidv4(),
          sender: 'john.doe@company.com',
          subject: 'Urgent: Project Deadline Update',
          preview: 'The project deadline has been moved to next Friday...',
          date: new Date('2024-01-15T10:30:00'),
          isRead: false,
          isStarred: true,
          priority: 'high',
          flagged: true,
          category: 'work'
        },
        {
          id: uuidv4(),
          sender: 'marketing@newsletter.com',
          subject: 'Weekly Newsletter - Tech Updates',
          preview: 'This week in technology: AI breakthroughs and more...',
          date: new Date('2024-01-14T08:15:00'),
          isRead: true,
          isStarred: false,
          priority: 'low',
          flagged: true,
          category: 'newsletter'
        }
      ]
      setEmails(sampleEmails)
      localStorage.setItem('flaggedEmails', JSON.stringify(sampleEmails))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('flaggedEmails', JSON.stringify(emails))
  }, [emails])

  const toggleRead = (id) => {
    setEmails(emails.map(email =>
      email.id === id ? { ...email, isRead: !email.isRead } : email
    ))
  }

  const toggleStar = (id) => {
    setEmails(emails.map(email =>
      email.id === id ? { ...email, isStarred: !email.isStarred } : email
    ))
  }

  const toggleFlag = (id) => {
    setEmails(emails.map(email =>
      email.id === id ? { ...email, flagged: !email.flagged } : email
    ))
  }

  const deleteEmail = (id) => {
    setEmails(emails.filter(email => email.id !== id))
    setSelectedEmails(selectedEmails.filter(emailId => emailId !== id))
  }

  const archiveEmail = (id) => {
    setEmails(emails.map(email =>
      email.id === id ? { ...email, archived: true } : email
    ))
  }

  const toggleSelectEmail = (id) => {
    setSelectedEmails(prev =>
      prev.includes(id) 
        ? prev.filter(emailId => emailId !== id)
        : [...prev, id]
    )
  }

  const selectAllEmails = () => {
    const visibleEmails = getFilteredAndSortedEmails()
    setSelectedEmails(
      selectedEmails.length === visibleEmails.length 
        ? [] 
        : visibleEmails.map(email => email.id)
    )
  }

  const bulkDelete = () => {
    setEmails(emails.filter(email => !selectedEmails.includes(email.id)))
    setSelectedEmails([])
  }

  const bulkArchive = () => {
    setEmails(emails.map(email =>
      selectedEmails.includes(email.id) ? { ...email, archived: true } : email
    ))
    setSelectedEmails([])
  }

  const getFilteredAndSortedEmails = () => {
    let filtered = emails.filter(email => !email.archived)

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(email =>
        email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        email.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
        email.preview.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Category filter
    if (filterBy !== 'all') {
      filtered = filtered.filter(email => {
        switch (filterBy) {
          case 'unread': return !email.isRead
          case 'starred': return email.isStarred
          case 'high-priority': return email.priority === 'high'
          case 'work': return email.category === 'work'
          default: return true
        }
      })
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.date) - new Date(a.date)
        case 'sender':
          return a.sender.localeCompare(b.sender)
        case 'subject':
          return a.subject.localeCompare(b.subject)
        case 'priority': {
          const priorityOrder = { high: 3, medium: 2, low: 1 }
          return priorityOrder[b.priority] - priorityOrder[a.priority]
        }
        default:
          return 0
      }
    })

    return filtered
  }

  const formatDate = (date) => {
    const now = new Date()
    const emailDate = new Date(date)
    const diffTime = Math.abs(now - emailDate)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return 'Today'
    if (diffDays === 2) return 'Yesterday'
    if (diffDays <= 7) return `${diffDays - 1} days ago`
    return emailDate.toLocaleDateString()
  }

  const filteredEmails = getFilteredAndSortedEmails()

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Flag className="text-red-500" size={24} />
          <h1 className="text-2xl font-bold text-gray-800">Flagged Emails</h1>
          <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm">
            {filteredEmails.length}
          </span>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-wrap gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex-1 min-w-64">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search emails..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Filter size={16} className="text-gray-500" />
          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All</option>
            <option value="unread">Unread</option>
            <option value="starred">Starred</option>
            <option value="high-priority">High Priority</option>
            <option value="work">Work</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <SortAsc size={16} className="text-gray-500" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="date">Date</option>
            <option value="sender">Sender</option>
            <option value="subject">Subject</option>
            <option value="priority">Priority</option>
          </select>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedEmails.length > 0 && (
        <div className="flex items-center justify-between mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <span className="text-blue-800 font-medium">
            {selectedEmails.length} email{selectedEmails.length > 1 ? 's' : ''} selected
          </span>
          <div className="flex space-x-2">
            <button
              onClick={bulkArchive}
              className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 flex items-center space-x-1"
            >
              <Archive size={14} />
              <span>Archive</span>
            </button>
            <button
              onClick={bulkDelete}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 flex items-center space-x-1"
            >
              <Trash2 size={14} />
              <span>Delete</span>
            </button>
          </div>
        </div>
      )}

      {/* Email List Header */}
      <div className="flex items-center mb-2 px-4 py-2 bg-gray-100 rounded-t-lg">
        <input
          type="checkbox"
          checked={selectedEmails.length === filteredEmails.length && filteredEmails.length > 0}
          onChange={selectAllEmails}
          className="mr-3"
        />
        <span className="text-sm text-gray-600 font-medium">Select All</span>
      </div>

      {/* Email List */}
      <div className="border border-gray-200 rounded-b-lg">
        {filteredEmails.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Flag size={48} className="mx-auto mb-4 text-gray-300" />
            <p className="text-lg">No flagged emails found</p>
            <p className="text-sm">Emails you flag will appear here</p>
          </div>
        ) : (
          filteredEmails.map((email, index) => (
            <div
              key={email.id}
              className={`flex items-center p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors ${
                !email.isRead ? 'bg-blue-50' : 'bg-white'
              } ${index === filteredEmails.length - 1 ? 'border-b-0' : ''}`}
            >
              <input
                type="checkbox"
                checked={selectedEmails.includes(email.id)}
                onChange={() => toggleSelectEmail(email.id)}
                className="mr-3"
              />

              <button
                onClick={() => toggleStar(email.id)}
                className={`mr-3 p-1 rounded ${
                  email.isStarred ? 'text-yellow-500' : 'text-gray-300 hover:text-yellow-500'
                }`}
              >
                <Star size={16} fill={email.isStarred ? 'currentColor' : 'none'} />
              </button>

              <button
                onClick={() => toggleFlag(email.id)}
                className={`mr-3 p-1 rounded ${
                  email.flagged ? 'text-red-500' : 'text-gray-300 hover:text-red-500'
                }`}
              >
                <Flag size={16} fill={email.flagged ? 'currentColor' : 'none'} />
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-2">
                    <span className={`font-medium truncate ${
                      !email.isRead ? 'text-gray-900' : 'text-gray-600'
                    }`}>
                      {email.sender}
                    </span>
                    {email.priority === 'high' && (
                      <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                        High Priority
                      </span>
                    )}
                    <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                      {email.category}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500 whitespace-nowrap ml-4">
                    {formatDate(email.date)}
                  </span>
                </div>
                
                <div className="mb-1">
                  <span className={`font-medium ${
                    !email.isRead ? 'text-gray-900' : 'text-gray-700'
                  }`}>
                    {email.subject}
                  </span>
                </div>
                
                <p className="text-sm text-gray-500 truncate">
                  {email.preview}
                </p>
              </div>

              <div className="flex items-center space-x-1 ml-4">
                <button
                  onClick={() => toggleRead(email.id)}
                  className="p-2 text-gray-400 hover:text-blue-600 rounded"
                  title={email.isRead ? 'Mark as unread' : 'Mark as read'}
                >
                  {email.isRead ? <MailOpen size={16} /> : <Mail size={16} />}
                </button>
                
                <button
                  className="p-2 text-gray-400 hover:text-green-600 rounded"
                  title="Reply"
                >
                  <Reply size={16} />
                </button>
                
                <button
                  className="p-2 text-gray-400 hover:text-blue-600 rounded"
                  title="Forward"
                >
                  <Forward size={16} />
                </button>
                
                <button
                  onClick={() => archiveEmail(email.id)}
                  className="p-2 text-gray-400 hover:text-yellow-600 rounded"
                  title="Archive"
                >
                  <Archive size={16} />
                </button>
                
                <button
                  onClick={() => deleteEmail(email.id)}
                  className="p-2 text-gray-400 hover:text-red-600 rounded"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Stats */}
      {filteredEmails.length > 0 && (
        <div className="mt-4 flex justify-between text-sm text-gray-600">
          <span>
            {filteredEmails.filter(e => !e.isRead).length} unread, {filteredEmails.filter(e => e.isStarred).length} starred
          </span>
          <span>
            {filteredEmails.length} total flagged emails
          </span>
        </div>
      )}
    </div>
  )
}

export default FlaggedEmail