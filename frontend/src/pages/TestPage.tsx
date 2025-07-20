import React from 'react'
import { Container, Typography, Box, Paper, Button } from '@mui/material'

const TestPage: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom align="center" fontWeight="bold">
        Test Page
      </Typography>
      
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" gutterBottom>
          Frontend is working!
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          This is a simple test page to verify that the frontend is rendering correctly.
        </Typography>
        
        <Box sx={{ mt: 3 }}>
          <Button variant="contained" color="primary" sx={{ mr: 2 }}>
            Test Button
          </Button>
          <Button variant="outlined" color="secondary">
            Another Button
          </Button>
        </Box>
      </Paper>
    </Container>
  )
}

export default TestPage 