import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, IconButton, Paper, Typography, TextField, Button, 
  List, ListItem, ListItemText, CircularProgress, Collapse
} from '@mui/material';
import { Chat as ChatIcon, Close as CloseIcon, Send as SendIcon, SmartToy as BotIcon } from '@mui/icons-material';
import api from '../utils/axiosConfig';

function SmartAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi there! I am your Smart ERP Assistant. How can I help you analyze your data today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await api.post('/chat', { message: userMessage });
      setMessages(prev => [...prev, { sender: 'bot', text: response.data.reply }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        sender: 'bot', 
        text: error.response?.status === 503 
          ? "I am currently offline. Please configure the GOOGLE_API_KEY in the backend .env file to enable my AI capabilities." 
          : error.response?.data?.message || "Sorry, I encountered an error while processing your request." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      {!isOpen && (
        <IconButton
          color="primary"
          onClick={() => setIsOpen(true)}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            backgroundColor: '#1976d2',
            color: 'white',
            boxShadow: 3,
            '&:hover': { backgroundColor: '#115293' },
            zIndex: 1000,
            width: 60,
            height: 60,
          }}
        >
          <ChatIcon fontSize="large" />
        </IconButton>
      )}

      {/* Chat Window */}
      <Collapse in={isOpen} unmountOnExit sx={{ position: 'fixed', bottom: 24, right: 24, zIndex: 1000 }}>
        <Paper elevation={6} sx={{ width: 350, height: 500, display: 'flex', flexDirection: 'column', borderRadius: 3, overflow: 'hidden' }}>
          {/* Header */}
          <Box sx={{ backgroundColor: '#1976d2', color: 'white', p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <BotIcon sx={{ mr: 1 }} />
              <Typography variant="h6" fontWeight="bold">Smart ERP Assistant</Typography>
            </Box>
            <IconButton size="small" onClick={() => setIsOpen(false)} sx={{ color: 'white' }}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Messages Area */}
          <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2, backgroundColor: '#f4f6f8' }}>
            <List>
              {messages.map((msg, index) => (
                <ListItem key={index} sx={{ justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start', mb: 1, p: 0 }}>
                  <Paper 
                    elevation={1} 
                    sx={{ 
                      p: 1.5, 
                      maxWidth: '80%', 
                      borderRadius: 2,
                      backgroundColor: msg.sender === 'user' ? '#1976d2' : 'white',
                      color: msg.sender === 'user' ? 'white' : 'text.primary',
                      borderBottomRightRadius: msg.sender === 'user' ? 0 : 8,
                      borderBottomLeftRadius: msg.sender === 'bot' ? 0 : 8,
                    }}
                  >
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                      {msg.text}
                    </Typography>
                  </Paper>
                </ListItem>
              ))}
              {isLoading && (
                <ListItem sx={{ justifyContent: 'flex-start', mb: 1, p: 0 }}>
                  <Paper elevation={1} sx={{ p: 1.5, borderRadius: 2, backgroundColor: 'white', borderBottomLeftRadius: 0 }}>
                    <CircularProgress size={20} />
                  </Paper>
                </ListItem>
              )}
              <div ref={messagesEndRef} />
            </List>
          </Box>

          {/* Input Area */}
          <Box sx={{ p: 1.5, backgroundColor: 'white', borderTop: '1px solid #e0e0e0', display: 'flex', alignItems: 'center' }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Ask me anything..."
              variant="outlined"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              sx={{ mr: 1, '& .MuiOutlinedInput-root': { borderRadius: 5 } }}
            />
            <IconButton 
              color="primary" 
              onClick={handleSend} 
              disabled={!input.trim() || isLoading}
              sx={{ backgroundColor: '#f0f7ff' }}
            >
              <SendIcon />
            </IconButton>
          </Box>
        </Paper>
      </Collapse>
    </>
  );
}

export default SmartAssistant;
