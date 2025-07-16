import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Box, CssBaseline, ThemeProvider } from '@mui/material'

import { CartProvider } from './contexts/CartContext'
import { AuthProvider } from './contexts/AuthContext'
import theme from './theme/theme'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import ProductsPage from './pages/ProductsPage'
import ShoppingCartPage from './pages/ShoppingCartPage'
import CheckoutPage from './pages/CheckoutPage'
import OrdersPage from './pages/OrdersPage'
import AdminPage from './pages/AdminPage'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ProfilePage from './pages/ProfilePage'
import FavoritesPage from './pages/FavoritesPage'
import WishlistPage from './pages/WishlistPage'
import ComparePage from './pages/ComparePage'
import ReviewsPage from './pages/ReviewsPage'
import ProductDetailPage from './pages/ProductDetailPage'
import ChatbotPage from './pages/ChatbotPage'
import SupportPage from './pages/SupportPage'

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <CartProvider>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            minHeight: '100vh'
          }}>
            <Navbar />
            <Box component="main" sx={{ 
              flexGrow: 1, 
              py: { xs: 2, sm: 3, md: 4 }
            }}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/products/:productId" element={<ProductDetailPage />} />
                <Route path="/cart" element={<ShoppingCartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/orders" element={<OrdersPage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/favorites" element={<FavoritesPage />} />
                <Route path="/wishlist" element={<WishlistPage />} />
                <Route path="/compare" element={<ComparePage />} />
                <Route path="/reviews" element={<ReviewsPage />} />
                <Route path="/ai-assistant" element={<ChatbotPage />} />
                <Route path="/support" element={<SupportPage />} />
              </Routes>
            </Box>
            <Footer />
          </Box>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
