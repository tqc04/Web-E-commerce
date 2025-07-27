import React, { Suspense } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { Box, CssBaseline, ThemeProvider } from '@mui/material'

import { CartProvider } from './contexts/CartContext'
import { AuthProvider } from './contexts/AuthContext'
import theme from './theme/theme'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
const ProductsPage = React.lazy(() => import('./pages/ProductsPage'));
const ProductDetailPage = React.lazy(() => import('./pages/ProductDetailPage'));
const ShoppingCartPage = React.lazy(() => import('./pages/ShoppingCartPage'));
const CheckoutPage = React.lazy(() => import('./pages/CheckoutPage'));
const OrdersPage = React.lazy(() => import('./pages/OrdersPage'));
const AdminPage = React.lazy(() => import('./pages/AdminPage'));
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ProfilePage from './pages/ProfilePage'
import FavoritesPage from './pages/FavoritesPage'
import WishlistPage from './pages/WishlistPage'
import ComparePage from './pages/ComparePage'
import ReviewsPage from './pages/ReviewsPage'
import ChatbotPage from './pages/ChatbotPage'
import SupportPage from './pages/SupportPage'
import VerifyEmailPage from './pages/VerifyEmailPage';
import OAuth2SuccessPage from './pages/OAuth2SuccessPage';
import OAuth2CompleteSignupPage from './pages/OAuth2CompleteSignupPage';
import { NotificationProvider } from './contexts/NotificationContext';


import axios from 'axios';



const api = axios.create({
    baseURL: '/api',
});

api.interceptors.request.use(config => {
    const token = localStorage.getItem('jwt');
    if (token) {
        config.headers = config.headers || {};
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

export const apiService = api;






function App() {
  const location = useLocation();
  const authPaths = ['/login', '/signup', '/forgot-password', '/verify-email'];
  const isAuthPage = authPaths.includes(location.pathname);
  return (
    <NotificationProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <Box sx={{
              minHeight: '100vh',
              display: 'flex',
              flexDirection: 'column',
              background: isAuthPage
                ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                : 'none',
              alignItems: isAuthPage ? 'center' : 'stretch',
              justifyContent: isAuthPage ? 'center' : 'flex-start',
              py: isAuthPage ? 8 : 0
            }}>
              <Suspense fallback={<div>Loading...</div>}>
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
                    <Route path="/verify-email" element={<VerifyEmailPage />} />
                    <Route path="/oauth2/success" element={<OAuth2SuccessPage />} />
                    <Route path="/oauth2/complete-signup" element={<OAuth2CompleteSignupPage />} />


                </Routes>
              </Suspense>
            </Box>
            {!isAuthPage && <Footer />}
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </NotificationProvider>
  )
}

export default App
