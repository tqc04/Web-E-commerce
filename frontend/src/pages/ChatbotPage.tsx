import React, { useState, useEffect, useRef } from 'react'
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Avatar,
  Divider,
  Card,
  CardContent,
  Chip,
  List,
  ListItem,
  Fade,
  CircularProgress,
} from '@mui/material'
import {
  Send,
  SmartToy,
  Person,
  Refresh,
  Clear,
} from '@mui/icons-material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiService, ChatMessage } from '../services/api'
import notificationService from '../services/notificationService'

const ChatbotPage: React.FC = () => {
  const [message, setMessage] = useState('')
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const queryClient = useQueryClient()

  // Create chat session
  const createSessionMutation = useMutation({
    mutationFn: () => apiService.createChatSession(),
    onSuccess: (response) => {
      if (response.success) {
        setSessionId(response.data.sessionId)
        setMessages([{
          id: Date.now(),
          sessionId: response.data.sessionId,
          message: "Hello! I'm your AI shopping assistant. How can I help you today?",
          messageType: 'BOT',
          timestamp: new Date().toISOString(),
        }])
        notificationService.success('Chat session started!')
      }
    },
    onError: (error: any) => {
      notificationService.error('Failed to start chat session')
    }
  })

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: ({ sessionId, message }: { sessionId: string, message: string }) =>
      apiService.sendChatMessage(sessionId, message),
    onSuccess: (response, variables) => {
      if (response.success) {
        // Add bot response to messages
        setMessages(prev => [...prev, {
          id: Date.now(),
          sessionId: variables.sessionId,
          message: response.data.response || 'Sorry, I could not process your request.',
          messageType: 'BOT',
          timestamp: new Date().toISOString(),
        }])
      }
    },
    onError: (error: any) => {
      notificationService.error('Failed to send message')
      // Add error message
      setMessages(prev => [...prev, {
        id: Date.now(),
        sessionId: sessionId!,
        message: 'Sorry, I encountered an error. Please try again.',
        messageType: 'BOT',
        timestamp: new Date().toISOString(),
      }])
    }
  })

  // Initialize session on component mount
  useEffect(() => {
    createSessionMutation.mutate()
  }, [])

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = () => {
    if (!message.trim() || !sessionId || sendMessageMutation.isPending) return

    // Add user message to state
    const userMessage: ChatMessage = {
      id: Date.now(),
      sessionId,
      message: message.trim(),
      messageType: 'USER',
      timestamp: new Date().toISOString(),
    }

    setMessages(prev => [...prev, userMessage])
    
    // Send to backend
    sendMessageMutation.mutate({ sessionId, message: message.trim() })
    
    // Clear input
    setMessage('')
  }

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSendMessage()
    }
  }

  const handleNewSession = () => {
    setMessages([])
    setSessionId(null)
    createSessionMutation.mutate()
  }

  const handleClearChat = () => {
    setMessages(messages.filter(msg => msg.messageType === 'BOT' && messages.indexOf(msg) === 0))
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const renderMessage = (msg: ChatMessage, index: number) => {
    const isBot = msg.messageType === 'BOT'
    
    return (
      <Fade in={true} timeout={300} key={msg.id || index}>
        <ListItem
          sx={{
            flexDirection: 'column',
            alignItems: isBot ? 'flex-start' : 'flex-end',
            px: 1,
            py: 0.5,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-end',
              maxWidth: '80%',
              gap: 1,
              flexDirection: isBot ? 'row' : 'row-reverse',
            }}
          >
            <Avatar
              sx={{
                width: 32,
                height: 32,
                bgcolor: isBot ? 'primary.main' : 'secondary.main',
              }}
            >
              {isBot ? <SmartToy /> : <Person />}
            </Avatar>
            
            <Paper
              elevation={1}
              sx={{
                px: 2,
                py: 1,
                bgcolor: isBot ? 'grey.100' : 'primary.main',
                color: isBot ? 'text.primary' : 'primary.contrastText',
                borderRadius: 2,
                borderTopLeftRadius: isBot ? 0.5 : 2,
                borderTopRightRadius: isBot ? 2 : 0.5,
              }}
            >
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                {msg.message}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  display: 'block',
                  mt: 0.5,
                  opacity: 0.7,
                  textAlign: isBot ? 'left' : 'right',
                }}
              >
                {formatTime(msg.timestamp)}
              </Typography>
            </Paper>
          </Box>
        </ListItem>
      </Fade>
    )
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          AI Assistant
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Get instant help with product recommendations, order assistance, and more
        </Typography>
      </Box>

      {/* Chat Controls */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 2 }}>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={handleNewSession}
          disabled={createSessionMutation.isPending}
          size="small"
        >
          New Chat
        </Button>
        <Button
          variant="outlined"
          startIcon={<Clear />}
          onClick={handleClearChat}
          disabled={messages.length <= 1}
          size="small"
        >
          Clear
        </Button>
        {sessionId && (
          <Chip
            label={`Session: ${sessionId.slice(0, 8)}...`}
            size="small"
            variant="outlined"
            color="primary"
          />
        )}
      </Box>

      {/* Chat Container */}
      <Paper 
        elevation={3} 
        sx={{ 
          height: 600,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Messages Area */}
        <Box
          sx={{
            flexGrow: 1,
            overflow: 'auto',
            px: 1,
            py: 2,
            backgroundColor: 'grey.50',
          }}
        >
          {createSessionMutation.isPending ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <CircularProgress />
            </Box>
          ) : (
            <List sx={{ width: '100%' }}>
              {messages.map((msg, index) => renderMessage(msg, index))}
              
              {/* Typing indicator */}
              {sendMessageMutation.isPending && (
                <ListItem sx={{ justifyContent: 'flex-start', px: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                      <SmartToy />
                    </Avatar>
                    <Paper
                      elevation={1}
                      sx={{
                        px: 2,
                        py: 1,
                        bgcolor: 'grey.100',
                        borderRadius: 2,
                        borderTopLeftRadius: 0.5,
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        AI is typing...
                      </Typography>
                      <CircularProgress size={16} sx={{ ml: 1 }} />
                    </Paper>
                  </Box>
                </ListItem>
              )}
              
              <div ref={messagesEndRef} />
            </List>
          )}
        </Box>

        <Divider />

        {/* Input Area */}
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              multiline
              maxRows={3}
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={!sessionId || sendMessageMutation.isPending}
              variant="outlined"
              size="small"
            />
            <Button
              variant="contained"
              onClick={handleSendMessage}
              disabled={!message.trim() || !sessionId || sendMessageMutation.isPending}
              sx={{ px: 3 }}
            >
              <Send />
            </Button>
          </Box>
          
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            Press Enter to send, Shift+Enter for new line
          </Typography>
        </Box>
      </Paper>

      {/* Quick Actions */}
      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Try asking:
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 1 }}>
          {[
            "What products do you recommend?",
            "Help me find electronics",
            "Check my order status",
            "What's on sale today?",
          ].map((suggestion, index) => (
            <Chip
              key={index}
              label={suggestion}
              variant="outlined"
              size="small"
              onClick={() => setMessage(suggestion)}
              sx={{ cursor: 'pointer' }}
            />
          ))}
        </Box>
      </Box>
    </Container>
  )
}

export default ChatbotPage 