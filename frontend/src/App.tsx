import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Box } from '@mui/material'

// Components
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import HomePage from './pages/HomePage'
import ProductsPage from './pages/ProductsPage'
import ChatbotPage from './pages/ChatbotPage'
import OrdersPage from './pages/OrdersPage'
import AdminPage from './pages/AdminPage'
import LoginPage from './pages/LoginPage'
import ShoppingCartPage from './pages/ShoppingCartPage'

// Context
import { AuthProvider } from './contexts/AuthContext'

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        
        <Box component="main" sx={{ flexGrow: 1, paddingTop: '64px' }}>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            
            {/* Protected Routes */}
            <Route path="/" element={
              <ProtectedRoute requireAuth={false}>
                <HomePage />
              </ProtectedRoute>
            } />
            
            <Route path="/products" element={
              <ProtectedRoute requireAuth={false}>
                <ProductsPage />
              </ProtectedRoute>
            } />

            <Route path="/cart" element={
              <ProtectedRoute requireAuth={false}>
                <ShoppingCartPage />
              </ProtectedRoute>
            } />
            
            <Route path="/chatbot" element={
              <ProtectedRoute requireAuth={true}>
                <ChatbotPage />
              </ProtectedRoute>
            } />
            
            <Route path="/orders" element={
              <ProtectedRoute requireAuth={true}>
                <OrdersPage />
              </ProtectedRoute>
            } />
            
            <Route path="/admin" element={
              <ProtectedRoute requireAuth={true} requireAdmin={true}>
                <AdminPage />
              </ProtectedRoute>
            } />
          </Routes>
        </Box>

        <Footer />
      </Box>
    </AuthProvider>
  )
}

export default App 