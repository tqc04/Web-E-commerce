import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Box } from '@mui/material'

// Components
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'

// Pages
import HomePage from './pages/HomePage'
import ProductsPage from './pages/ProductsPage'
import ChatbotPage from './pages/ChatbotPage'
import OrdersPage from './pages/OrdersPage'
import AdminPage from './pages/AdminPage'
import AdminDashboard from './pages/AdminDashboard'
import LoginPage from './pages/LoginPage'
import ShoppingCartPage from './pages/ShoppingCartPage'
import FavoritesPage from './pages/FavoritesPage'
import SupportPage from './pages/SupportPage'
import ProfilePage from './pages/ProfilePage'

// Context
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { CartProvider } from './contexts/CartContext'

const AppContent: React.FC = () => {
  const { user } = useAuth()
  
  return (
    <CartProvider userId={user?.id}>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        
        <Box component="main" sx={{ flexGrow: 1, paddingTop: '64px' }}>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/support" element={<SupportPage />} />
            
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

            <Route path="/favorites" element={
              <ProtectedRoute requireAuth={true}>
                <FavoritesPage />
              </ProtectedRoute>
            } />

            <Route path="/profile" element={
              <ProtectedRoute requireAuth={true}>
                <ProfilePage />
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
            
            {/* Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute requireAuth={true} requireAdmin={true}>
                <AdminPage />
              </ProtectedRoute>
            } />
            
            <Route path="/admin/dashboard" element={
              <ProtectedRoute requireAuth={true} requireAdmin={true}>
                <AdminDashboard />
              </ProtectedRoute>
            } />

            {/* 404 Fallback */}
            <Route path="*" element={
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center', 
                minHeight: '50vh',
                textAlign: 'center',
                p: 4
              }}>
                <Box sx={{ fontSize: '6rem', mb: 2 }}>😞</Box>
                <Box sx={{ fontSize: '2rem', fontWeight: 'bold', mb: 1 }}>
                  404 - Page Not Found
                </Box>
                <Box sx={{ color: 'text.secondary', mb: 3 }}>
                  The page you're looking for doesn't exist.
                </Box>
                <Box 
                  component="a" 
                  href="/"
                  sx={{
                    color: 'primary.main',
                    textDecoration: 'none',
                    '&:hover': { textDecoration: 'underline' }
                  }}
                >
                  ← Back to Home
                </Box>
              </Box>
            } />
          </Routes>
        </Box>
        
        <Footer />
      </Box>
    </CartProvider>
  )
}

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App 