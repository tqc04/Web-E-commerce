import axios, { AxiosInstance, AxiosResponse } from 'axios'

// Base API configuration
const API_BASE_URL = 'http://localhost:8081/api'
const REQUEST_TIMEOUT = 10000

// Create axios instance with default configuration
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: REQUEST_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

// Request interceptor for auth tokens
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token') || localStorage.getItem('jwt');
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token')
      // Redirect to login page if needed
    }
    return Promise.reject(error)
  }
)

// Types for API responses
export interface ApiResponse<T = any> {
  data: T
  message?: string
  success: boolean
}

export interface Product {
  id: number
  name: string
  description: string
  price: number
  imageUrl?: string
  category: string
  brand: string
  stockQuantity: number
  rating?: number
  createdAt: string
  updatedAt: string
}

export interface User {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  role: string
  createdAt: string
}

export interface Order {
  id: number
  orderNumber: string
  userId: number
  status: string
  totalAmount: number
  items: OrderItem[]
  createdAt: string
  updatedAt: string
}

export interface OrderItem {
  id: number
  productId: number
  product: Product
  quantity: number
  price: number
}

export interface ChatMessage {
  id?: number
  sessionId: string
  message: string
  response?: string
  messageType: 'USER' | 'BOT'
  timestamp: string
}

export interface DashboardStats {
  totalUsers: number
  totalProducts: number
  totalOrders: number
  totalRevenue: number
  recentOrders: Order[]
  topProducts: Product[]
}

// API Service class
class ApiService {
  // Health check
  async healthCheck(): Promise<any> {
    try {
      const response = await apiClient.get('/actuator/health')
      return response.data
    } catch (error) {
      console.error('Health check failed:', error)
      throw error
    }
  }

  // Products API
  async getProducts(page = 0, size = 12, search?: string, category?: string): Promise<ApiResponse<{ content: Product[], totalElements: number }>> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
        sort: 'id,asc'
      })
      if (search) params.append('search', search)
      if (category) params.append('category', category)

      console.log('Calling API:', `/products?${params}`)
      const response = await apiClient.get(`/products?${params}`)
      
      console.log('API Response:', response.data)
      return {
        data: response.data,
        success: true,
      }
    } catch (error: any) {
      console.error('Failed to fetch products from backend:', error)
      console.error('Error response:', error.response?.data)
      console.error('Error status:', error.response?.status)
      throw error
    }
  }

  async getProduct(id: number): Promise<ApiResponse<Product>> {
    try {
      const response = await apiClient.get(`/products/${id}`)
      return {
        data: response.data,
        success: true,
      }
    } catch (error) {
      console.error(`Failed to fetch product ${id}:`, error)
      throw error
    }
  }

  // Orders API
  async getOrders(page = 0, size = 10): Promise<ApiResponse<{ content: Order[], totalElements: number }>> {
    try {
      const response = await apiClient.get(`/orders?page=${page}&size=${size}`)
      return {
        data: response.data,
        success: true,
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error)
      throw error
    }
  }

  async createOrder(orderData: any): Promise<ApiResponse<Order>> {
    try {
      const response = await apiClient.post('/orders', orderData)
      return {
        data: response.data,
        success: true,
        message: 'Order created successfully',
      }
    } catch (error) {
      console.error('Failed to create order:', error)
      throw error
    }
  }

  async cancelOrder(orderId: number, reason: string): Promise<ApiResponse<void>> {
    try {
      const response = await apiClient.delete(`/orders/${orderId}`, {
        data: { reason }
      })
      return {
        data: response.data,
        success: true,
        message: 'Order cancelled successfully',
      }
    } catch (error) {
      console.error('Failed to cancel order:', error)
      throw error
    }
  }

  // Cart API
  async getCart(userId?: number): Promise<ApiResponse<any>> {
    try {
      const params = userId ? `?userId=${userId}` : ''
      const response = await apiClient.get(`/cart${params}`)
      return {
        data: response.data,
        success: true,
        message: 'Cart retrieved successfully',
      }
    } catch (error) {
      console.error('Failed to get cart:', error)
      throw error
    }
  }

  async addToCart(productId: number, quantity: number, userId?: number): Promise<ApiResponse<any>> {
    try {
      const params = userId ? `?userId=${userId}` : ''
      const response = await apiClient.post(`/cart/add${params}`, {
        productId,
        quantity
      })
      return {
        data: response.data,
        success: true,
        message: 'Product added to cart successfully',
      }
    } catch (error) {
      console.error('Failed to add to cart:', error)
      throw error
    }
  }

  async updateCartItem(productId: number, quantity: number, userId?: number): Promise<ApiResponse<any>> {
    try {
      const params = userId ? `?userId=${userId}` : ''
      const response = await apiClient.put(`/cart/update${params}`, {
        productId,
        quantity
      })
      return {
        data: response.data,
        success: true,
        message: 'Cart item updated successfully',
      }
    } catch (error) {
      console.error('Failed to update cart item:', error)
      throw error
    }
  }

  async removeFromCart(productId: number, userId?: number): Promise<ApiResponse<any>> {
    try {
      const params = userId ? `?userId=${userId}` : ''
      const response = await apiClient.delete(`/cart/remove/${productId}${params}`)
      return {
        data: response.data,
        success: true,
        message: 'Product removed from cart successfully',
      }
    } catch (error) {
      console.error('Failed to remove from cart:', error)
      throw error
    }
  }

  async clearCart(userId?: number): Promise<ApiResponse<any>> {
    try {
      const params = userId ? `?userId=${userId}` : ''
      const response = await apiClient.delete(`/cart/clear${params}`)
      return {
        data: response.data,
        success: true,
        message: 'Cart cleared successfully',
      }
    } catch (error) {
      console.error('Failed to clear cart:', error)
      throw error
    }
  }

  async applyPromoCode(promoCode: string, userId?: number): Promise<ApiResponse<any>> {
    try {
      const params = userId ? `?userId=${userId}` : ''
      const response = await apiClient.post(`/cart/promo${params}`, {
        promoCode
      })
      return {
        data: response.data,
        success: true,
        message: 'Promo code applied successfully',
      }
    } catch (error) {
      console.error('Failed to apply promo code:', error)
      throw error
    }
  }

  async removePromoCode(userId?: number): Promise<ApiResponse<any>> {
    try {
      const params = userId ? `?userId=${userId}` : ''
      const response = await apiClient.delete(`/cart/promo${params}`)
      return {
        data: response.data,
        success: true,
        message: 'Promo code removed successfully',
      }
    } catch (error) {
      console.error('Failed to remove promo code:', error)
      throw error
    }
  }

  async getCartItemCount(userId?: number): Promise<ApiResponse<number>> {
    try {
      const params = userId ? `?userId=${userId}` : ''
      const response = await apiClient.get(`/cart/count${params}`)
      return {
        data: response.data,
        success: true,
        message: 'Cart count retrieved successfully',
      }
    } catch (error) {
      console.error('Failed to get cart count:', error)
      throw error
    }
  }

  async mergeGuestCart(userId: number): Promise<ApiResponse<any>> {
    try {
      const response = await apiClient.post(`/cart/merge?userId=${userId}`)
      return {
        data: response.data,
        success: true,
        message: 'Guest cart merged successfully',
      }
    } catch (error) {
      console.error('Failed to merge guest cart:', error)
      throw error
    }
  }

  // Users API  
  async getUsers(page = 0, size = 10): Promise<ApiResponse<{ content: User[], totalElements: number }>> {
    try {
      const response = await apiClient.get(`/admin/users?page=${page}&size=${size}`)
      return {
        data: response.data,
        success: true,
      }
    } catch (error) {
      console.error('Failed to fetch users:', error)
      throw error
    }
  }

  /**
   * User login
   */
  async login(username: string, password: string): Promise<ApiResponse<{ token: string, user: User }>> {
    try {
      const response = await apiClient.post('/auth/login', {
        username,
        password
      })
      
      return {
        data: {
          token: response.data.token,
          user: response.data.user
        },
        message: response.data.message || 'Login successful',
        success: response.data.success || true
      }
    } catch (error: any) {
      console.error('Login failed:', error)
      throw error
    }
  }

  /**
   * User registration
   */
  async register(userData: {
    username: string
    email: string
    password: string
    firstName: string
    lastName: string
    phoneNumber?: string
  }): Promise<ApiResponse<{ user: User }>> {
    try {
      const response = await apiClient.post('/auth/register', userData)
      
      return {
        data: {
          user: response.data.user
        },
        message: response.data.message || 'Registration successful',
        success: response.data.success || true
      }
    } catch (error: any) {
      console.error('Registration failed:', error)
      throw error
    }
  }

  /**
   * Forgot password - Send reset email
   */
  async forgotPassword(email: string): Promise<ApiResponse<any>> {
    try {
      const response = await apiClient.post('/auth/forgot-password', { email })
      
      return {
        data: response.data,
        message: response.data.message || 'Reset email sent',
        success: response.data.success || true
      }
    } catch (error: any) {
      console.error('Forgot password failed:', error)
      throw error
    }
  }

  /**
   * Reset password with token
   */
  async resetPassword(token: string, password: string): Promise<ApiResponse<any>> {
    try {
      const response = await apiClient.post('/auth/reset-password', { token, password })
      
      return {
        data: response.data,
        message: response.data.message || 'Password reset successful',
        success: response.data.success || true
      }
    } catch (error: any) {
      console.error('Password reset failed:', error)
      throw error
    }
  }

  /**
   * Verify email with token
   */
  async verifyEmail(token: string): Promise<ApiResponse<any>> {
    try {
      const response = await apiClient.post('/auth/verify-email', { token })
      
      return {
        data: response.data,
        message: response.data.message || 'Email verified successfully',
        success: response.data.success || true
      }
    } catch (error: any) {
      console.error('Email verification failed:', error)
      throw error
    }
  }

  /**
   * Change password (authenticated user)
   */
  async changePassword(currentPassword: string, newPassword: string): Promise<ApiResponse<any>> {
    try {
      const response = await apiClient.post('/auth/change-password', {
        currentPassword,
        newPassword
      })
      
      return {
        data: response.data,
        message: response.data.message || 'Password changed successfully',
        success: response.data.success || true
      }
    } catch (error: any) {
      console.error('Password change failed:', error)
      throw error
    }
  }

  /**
   * Get user profile
   */
  async getUserProfile(): Promise<ApiResponse<User>> {
    try {
      const response = await apiClient.get('/users/profile')
      return {
        data: response.data,
        success: true
      }
    } catch (error: any) {
      console.error('Failed to fetch user profile:', error)
      throw error
    }
  }

  /**
   * Update user profile
   */
  async updateUserProfile(userData: Partial<User>): Promise<ApiResponse<User>> {
    try {
      const response = await apiClient.put('/users/profile', userData)
      return {
        data: response.data,
        message: 'Profile updated successfully',
        success: true
      }
    } catch (error: any) {
      console.error('Failed to update user profile:', error)
      throw error
    }
  }

  /**
   * Add product to favorites
   */
  async addToFavorites(productId: number): Promise<ApiResponse<any>> {
    try {
      const response = await apiClient.post(`/users/favorites/${productId}`)
      return {
        data: response.data,
        message: 'Added to favorites',
        success: true
      }
    } catch (error: any) {
      console.error('Failed to add to favorites:', error)
      throw error
    }
  }

  /**
   * Remove product from favorites
   */
  async removeFromFavorites(productId: number): Promise<ApiResponse<any>> {
    try {
      const response = await apiClient.delete(`/users/favorites/${productId}`)
      return {
        data: response.data,
        message: 'Removed from favorites',
        success: true
      }
    } catch (error: any) {
      console.error('Failed to remove from favorites:', error)
      throw error
    }
  }

  /**
   * Get user favorites
   */
  async getFavorites(): Promise<ApiResponse<Product[]>> {
    try {
      const response = await apiClient.get('/users/favorites')
      return {
        data: response.data,
        success: true
      }
    } catch (error: any) {
      console.error('Failed to fetch favorites:', error)
      throw error
    }
  }

  /**
   * Send AI chat message
   */
  async sendChatMessage(message: string, sessionId?: number): Promise<ApiResponse<ChatMessage>> {
    try {
      const response = await apiClient.post('/chatbot/message', {
        message,
        sessionId
      })
      return {
        data: response.data,
        success: true
      }
    } catch (error: any) {
      console.error('Failed to send chat message:', error)
      throw error
    }
  }

  /**
   * Get chat history
   */
  async getChatHistory(sessionId: string): Promise<ApiResponse<ChatMessage[]>> {
    try {
      const response = await apiClient.get(`/chatbot/history/${sessionId}`)
      return {
        data: response.data,
        success: true
      }
    } catch (error: any) {
      console.error('Failed to fetch chat history:', error)
      throw error
    }
  }

  /**
   * Create a new AI chat session
   */
  async createChatSession(userId: number, initialMessage: string = ''): Promise<ApiResponse<any>> {
    try {
      const response = await apiClient.post('/chatbot/session', {
        userId,
        initialMessage
      })
      return {
        data: response.data,
        success: true
      }
    } catch (error: any) {
      console.error('Failed to create chat session:', error)
      throw error
    }
  }

  /**
   * Logout
   */
  async logout(): Promise<void> {
    // Clear any stored tokens
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
  }

  // Inventory API
  async getInventory(page = 0, size = 10): Promise<ApiResponse<any>> {
    try {
      const response = await apiClient.get(`/admin/inventory?page=${page}&size=${size}`)
      return {
        data: response.data,
        success: true,
      }
    } catch (error) {
      console.error('Failed to fetch inventory:', error)
      throw error
    }
  }

  // Categories API
  async getCategoriesWithCount(): Promise<any[]> {
    const response = await apiClient.get('/categories/with-count');
    return response.data;
  }

  // Lấy danh sách huyện theo tỉnh
  async getDistrictsByProvince(provinceCode: string): Promise<any[]> {
    const response = await apiClient.get(`/shipping/districts/getByProvince?provinceCode=${provinceCode}`)
    return response.data
  }
  // Lấy danh sách xã/phường theo huyện
  async getWardsByDistrict(districtCode: string): Promise<any[]> {
    const response = await apiClient.get(`/shipping/wards/getByDistrict?districtCode=${districtCode}`)
    return response.data
  }
}

// Export singleton instance
export const apiService = new ApiService()
export default apiService 