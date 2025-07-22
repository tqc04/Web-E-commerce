import React, { useState, useEffect, useRef } from 'react'
import {
  Container,
  Paper,
  Box,
  TextField,
  IconButton,
  Typography,
  Avatar,
  Chip,
  List,
  ListItem,
  Divider,
  Alert,
  CircularProgress,
  Fab,
  Tooltip,
  Card,
  CardContent
} from '@mui/material'
import {
  Send,
  SmartToy,
  Person,
  Clear,
  Refresh,
  QuestionAnswer,
  Help,
  ShoppingCart,
  Search,
  Support
} from '@mui/icons-material'
import { useAuth } from '../contexts/AuthContext'
import { apiService } from '../services/api'

interface ChatMessage {
  id?: number
  sessionId: string
  message: string
  response?: string
  messageType: 'USER' | 'BOT'
  timestamp: string
}

interface QuickAction {
  label: string
  icon: React.ReactNode
  message: string
  color: 'primary' | 'secondary' | 'default'
}

const ChatbotPage: React.FC = () => {
  const { isAuthenticated, user } = useAuth()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId, setSessionId] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  const quickActions: QuickAction[] = [
    {
      label: 'Find Products',
      icon: <Search />,
      message: 'Help me find products',
      color: 'primary'
    },
    {
      label: 'Order Status',
      icon: <ShoppingCart />,
      message: 'Check my order status',
      color: 'secondary'
    },
    {
      label: 'Recommendations',
      icon: <SmartToy />,
      message: 'Give me product recommendations',
      color: 'primary'
    },
    {
      label: 'Support',
      icon: <Support />,
      message: 'I need help with my account',
      color: 'default'
    }
  ]

  // Function to create a new chat session and set sessionId
  const createNewSession = async (initialMessage: string = '') => {
    if (!user) return
    try {
      const response = await apiService.createChatSession(user.id, initialMessage)
      if (response.success && response.data && response.data.id) {
        setSessionId(response.data.id)
        return response.data.id
      }
    } catch (e) {
      setError('Failed to create chat session')
    }
    return null
  }

  useEffect(() => {
    // On mount, create a new session
    const init = async () => {
      let newSessionId = null
      if (isAuthenticated && user) {
        newSessionId = await createNewSession()
      }
      // Add welcome message
      const welcomeMessage: ChatMessage = {
        sessionId: '',
        message: '',
        response: "Hello! I'm your AI shopping assistant. How can I help you today? I can help you find products, check orders, provide recommendations, and answer questions about our store.",
        messageType: 'BOT',
        timestamp: new Date().toISOString()
      }
      setMessages([welcomeMessage])
      if (newSessionId) setSessionId(newSessionId)
    }
    init()
    // eslint-disable-next-line
  }, [isAuthenticated, user])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = async (messageText?: string) => {
    const messageToSend = messageText || inputMessage.trim()
    
    if (!messageToSend) return

    if (!isAuthenticated || !user) {
      setError('Please log in to use the AI assistant')
      return
    }

    if (!sessionId) {
      // Create session if not exists
      const newSessionId = await createNewSession(messageToSend)
      if (!newSessionId) return
      setSessionId(newSessionId)
    }

    const userMessage: ChatMessage = {
      sessionId: sessionId ? sessionId.toString() : '',
      message: messageToSend,
      messageType: 'USER',
      timestamp: new Date().toISOString()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)
    setError(null)

    try {
      const response = await apiService.sendChatMessage(messageToSend, sessionId!)
      
      if (response.success) {
        const botMessage: ChatMessage = {
          sessionId: response.data.sessionId ? response.data.sessionId.toString() : '',
          message: response.data.message,
          response: response.data.response,
          messageType: 'BOT',
          timestamp: response.data.timestamp
        }
        
        setMessages(prev => [...prev, botMessage])
      }
    } catch (error: any) {
      console.error('Failed to send message:', error)
      
      // Fallback response for demo purposes
      const fallbackResponse: ChatMessage = {
        sessionId: sessionId ? sessionId.toString() : '',
        message: '',
        response: "I apologize, but I'm currently experiencing technical difficulties. Please try again later or contact our support team for assistance.",
        messageType: 'BOT',
        timestamp: new Date().toISOString()
      }
      
      setMessages(prev => [...prev, fallbackResponse])
      setError('Failed to connect to AI assistant. Using offline mode.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSendMessage()
    }
  }

  const handleClearChat = async () => {
    setMessages([])
    // Create a new session on clear
    let newSessionId = null
    if (isAuthenticated && user) {
      newSessionId = await createNewSession()
    }
    setSessionId(newSessionId)
    
    // Add welcome message again
    const welcomeMessage: ChatMessage = {
      sessionId: '',
      message: '',
      response: "Chat cleared! How can I help you today?",
      messageType: 'BOT',
      timestamp: new Date().toISOString()
    }
    setMessages([welcomeMessage])
  }

  const handleQuickAction = (action: QuickAction) => {
    handleSendMessage(action.message)
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  if (!isAuthenticated) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="warning">
          Please log in to use the AI Assistant.
        </Alert>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box display="flex" alignItems="center">
          <SmartToy sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
          <Box>
            <Typography variant="h4" component="h1">
              AI Shopping Assistant
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Your personal AI-powered shopping companion
            </Typography>
          </Box>
        </Box>
        
        <Box>
          <Tooltip title="Clear Chat">
            <IconButton onClick={handleClearChat}>
              <Clear />
            </IconButton>
          </Tooltip>
          <Tooltip title="Refresh">
            <IconButton onClick={() => window.location.reload()}>
              <Refresh />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box display="flex" gap={3} height="70vh">
        {/* Quick Actions Sidebar */}
        <Box width={300} display={{ xs: 'none', md: 'block' }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={2}>
                Get started with these common requests:
              </Typography>
              
              <Box display="flex" flexDirection="column" gap={1}>
                {quickActions.map((action, index) => (
                  <Chip
                    key={index}
                    icon={action.icon}
                    label={action.label}
                    onClick={() => handleQuickAction(action)}
                    color={action.color}
                    variant="outlined"
                    clickable
                    sx={{ 
                      justifyContent: 'flex-start',
                      '& .MuiChip-label': { flexGrow: 1, textAlign: 'left' }
                    }}
                  />
                ))}
              </Box>

              <Divider sx={{ my: 2 }} />
              
              <Typography variant="body2" color="text.secondary">
                💡 <strong>Tips:</strong>
                <br />• Ask about specific products
                <br />• Get personalized recommendations
                <br />• Check order status
                <br />• Get help with account issues
                <br />• Ask for shopping advice
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Chat Area */}
        <Paper sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
          {/* Messages */}
          <Box 
            sx={{ 
              flexGrow: 1, 
              overflowY: 'auto', 
              p: 2,
              maxHeight: 'calc(70vh - 100px)'
            }}
          >
            <List>
              {messages.map((msg, index) => (
                <ListItem 
                  key={index}
                  sx={{ 
                    flexDirection: 'column',
                    alignItems: msg.messageType === 'USER' ? 'flex-end' : 'flex-start',
                    mb: 2
                  }}
                >
                  <Box
                    display="flex"
                    alignItems="flex-start"
                    gap={1}
                    width="100%"
                    justifyContent={msg.messageType === 'USER' ? 'flex-end' : 'flex-start'}
                  >
                    {msg.messageType === 'BOT' && (
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        <SmartToy />
                      </Avatar>
                    )}
                    
                    <Box
                      sx={{
                        maxWidth: '70%',
                        bgcolor: msg.messageType === 'USER' ? 'primary.main' : 'grey.100',
                        color: msg.messageType === 'USER' ? 'white' : 'text.primary',
                        p: 2,
                        borderRadius: 2,
                        borderTopLeftRadius: msg.messageType === 'BOT' ? 0 : 2,
                        borderTopRightRadius: msg.messageType === 'USER' ? 0 : 2,
                      }}
                    >
                      <Typography variant="body1">
                        {msg.messageType === 'USER' ? msg.message : msg.response}
                      </Typography>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          opacity: 0.7,
                          display: 'block',
                          mt: 0.5,
                          textAlign: msg.messageType === 'USER' ? 'right' : 'left'
                        }}
                      >
                        {formatTime(msg.timestamp)}
                      </Typography>
                    </Box>

                    {msg.messageType === 'USER' && (
                      <Avatar sx={{ bgcolor: 'secondary.main' }}>
                        <Person />
                      </Avatar>
                    )}
                  </Box>
                </ListItem>
              ))}
              
              {isLoading && (
                <ListItem sx={{ justifyContent: 'flex-start' }}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      <SmartToy />
                    </Avatar>
                    <Box
                      sx={{
                        bgcolor: 'grey.100',
                        p: 2,
                        borderRadius: 2,
                        borderTopLeftRadius: 0,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                      }}
                    >
                      <CircularProgress size={20} />
                      <Typography variant="body2">AI is thinking...</Typography>
                    </Box>
                  </Box>
                </ListItem>
              )}
            </List>
            <div ref={messagesEndRef} />
          </Box>

          {/* Input Area */}
          <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
            <Box display="flex" gap={1}>
              <TextField
                fullWidth
                multiline
                maxRows={3}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message here... (Press Enter to send)"
                disabled={isLoading}
                variant="outlined"
                size="small"
              />
              <IconButton
                color="primary"
                onClick={() => handleSendMessage()}
                disabled={!inputMessage.trim() || isLoading}
                sx={{ alignSelf: 'flex-end' }}
              >
                <Send />
              </IconButton>
            </Box>
          </Box>
        </Paper>
      </Box>

      {/* Floating Help Button */}
      <Fab
        color="primary"
        aria-label="help"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
        }}
        onClick={() => handleSendMessage('How can you help me?')}
      >
        <Help />
      </Fab>
    </Container>
  )
}

export default ChatbotPage 