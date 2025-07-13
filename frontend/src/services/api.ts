import axios, { AxiosInstance, AxiosResponse } from 'axios'

// Base API configuration
const API_BASE_URL = '/api'
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
    const token = localStorage.getItem('auth_token')
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

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
      })
      if (search) params.append('search', search)
      if (category) params.append('category', category)

      const response = await apiClient.get(`/products?${params}`)
      return {
        data: response.data,
        success: true,
      }
    } catch (error) {
      console.warn('Backend not available, using mock data for products:', error)
      
      // Mock products data
      const mockProducts: Product[] = [
        {
          id: 1,
          name: 'Gaming Laptop Pro Max',
          description: 'High-performance gaming laptop with RTX 4080, 32GB RAM, and 1TB SSD. Perfect for gaming and content creation.',
          price: 1299.99,
          imageUrl: '/api/placeholder/400/300',
          category: 'Electronics',
          brand: 'TechBrand',
          stockQuantity: 15,
          rating: 4.8,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        },
        {
          id: 2,
          name: 'Wireless Gaming Mouse Elite',
          description: 'Professional wireless gaming mouse with RGB lighting, 16000 DPI sensor, and 100-hour battery life.',
          price: 79.99,
          imageUrl: '/api/placeholder/400/300',
          category: 'Gaming',
          brand: 'GameMaster',
          stockQuantity: 50,
          rating: 4.6,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        },
        {
          id: 3,
          name: 'Premium Noise-Cancelling Headphones',
          description: 'Studio-quality headphones with active noise cancellation, 30-hour battery, and premium comfort.',
          price: 199.99,
          imageUrl: '/api/placeholder/400/300',
          category: 'Audio',
          brand: 'SoundWave',
          stockQuantity: 30,
          rating: 4.9,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        },
        {
          id: 4,
          name: 'Smart Fitness Watch Pro',
          description: 'Advanced fitness tracker with heart rate monitoring, GPS, and 7-day battery life.',
          price: 299.99,
          imageUrl: '/api/placeholder/400/300',
          category: 'Mobile',
          brand: 'MobileTech',
          stockQuantity: 25,
          rating: 4.7,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        },
        {
          id: 5,
          name: 'Ultrawide Gaming Monitor',
          description: '34-inch curved ultrawide monitor with 144Hz refresh rate, 1ms response time, and HDR support.',
          price: 449.99,
          imageUrl: '/api/placeholder/400/300',
          category: 'Computers',
          brand: 'ComputeMax',
          stockQuantity: 12,
          rating: 4.5,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        },
        {
          id: 6,
          name: 'Mechanical Gaming Keyboard RGB',
          description: 'Professional mechanical keyboard with Cherry MX switches, RGB backlighting, and programmable macros.',
          price: 129.99,
          imageUrl: '/api/placeholder/400/300',
          category: 'Gaming',
          brand: 'GameMaster',
          stockQuantity: 40,
          rating: 4.4,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        },
        {
          id: 7,
          name: 'Wireless Charging Pad Fast',
          description: 'Fast wireless charging pad compatible with all Qi-enabled devices. Includes USB-C cable.',
          price: 29.99,
          imageUrl: '/api/placeholder/400/300',
          category: 'Mobile',
          brand: 'MobileTech',
          stockQuantity: 100,
          rating: 4.3,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        },
        {
          id: 8,
          name: 'Bluetooth Speaker Waterproof',
          description: 'Portable waterproof Bluetooth speaker with 360-degree sound and 12-hour battery life.',
          price: 89.99,
          imageUrl: '/api/placeholder/400/300',
          category: 'Audio',
          brand: 'SoundWave',
          stockQuantity: 60,
          rating: 4.2,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        },
        {
          id: 9,
          name: 'USB-C Hub Multi-port',
          description: '7-in-1 USB-C hub with HDMI, USB 3.0, SD card reader, and 100W power delivery.',
          price: 49.99,
          imageUrl: '/api/placeholder/400/300',
          category: 'Computers',
          brand: 'ComputeMax',
          stockQuantity: 80,
          rating: 4.1,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        },
        {
          id: 10,
          name: 'Gaming Chair Ergonomic',
          description: 'Professional gaming chair with lumbar support, adjustable armrests, and premium leather.',
          price: 299.99,
          imageUrl: '/api/placeholder/400/300',
          category: 'Gaming',
          brand: 'GameMaster',
          stockQuantity: 20,
          rating: 4.6,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        },
        {
          id: 11,
          name: 'Smartphone 128GB Pro',
          description: 'Latest smartphone with 108MP camera, 5G connectivity, and all-day battery life.',
          price: 699.99,
          imageUrl: '/api/placeholder/400/300',
          category: 'Mobile',
          brand: 'MobileTech',
          stockQuantity: 35,
          rating: 4.8,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        },
        {
          id: 12,
          name: 'Webcam 4K HD Pro',
          description: '4K webcam with auto-focus, noise-canceling microphone, and wide-angle lens.',
          price: 149.99,
          imageUrl: '/api/placeholder/400/300',
          category: 'Computers',
          brand: 'ComputeMax',
          stockQuantity: 45,
          rating: 4.4,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        }
      ]

      // Filter by search if provided
      let filteredProducts = mockProducts
      if (search) {
        filteredProducts = mockProducts.filter(product =>
          product.name.toLowerCase().includes(search.toLowerCase()) ||
          product.description.toLowerCase().includes(search.toLowerCase()) ||
          product.category.toLowerCase().includes(search.toLowerCase())
        )
      }

      // Filter by category if provided
      if (category) {
        filteredProducts = filteredProducts.filter(product =>
          product.category.toLowerCase() === category.toLowerCase()
        )
      }

      // Pagination
      const startIndex = page * size
      const endIndex = startIndex + size
      const paginatedProducts = filteredProducts.slice(startIndex, endIndex)

      return {
        data: {
          content: paginatedProducts,
          totalElements: filteredProducts.length
        },
        success: true,
      }
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

  // Chatbot API
  async sendChatMessage(sessionId: string, message: string): Promise<ApiResponse<ChatMessage>> {
    try {
      const response = await apiClient.post('/chatbot/chat', {
        sessionId,
        message,
      })
      return {
        data: response.data,
        success: true,
      }
    } catch (error) {
      console.error('Failed to send chat message:', error)
      throw error
    }
  }

  async createChatSession(): Promise<ApiResponse<{ sessionId: string }>> {
    try {
      const response = await apiClient.post('/chatbot/session')
      return {
        data: response.data,
        success: true,
      }
    } catch (error) {
      console.error('Failed to create chat session:', error)
      throw error
    }
  }

  // Dashboard API
  async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    try {
      const response = await apiClient.get('/admin/dashboard/stats')
      return {
        data: response.data,
        success: true,
      }
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error)
      throw error
    }
  }

  // Recommendations API
  async getRecommendations(userId?: number): Promise<ApiResponse<Product[]>> {
    try {
      const url = userId ? `/recommendations?userId=${userId}` : '/recommendations'
      const response = await apiClient.get(url)
      return {
        data: response.data,
        success: true,
      }
    } catch (error) {
      console.error('Failed to fetch recommendations:', error)
      throw error
    }
  }

  /**
   * Mock login for testing (will be replaced with real API)
   */
  async login(username: string, password: string): Promise<ApiResponse<{ token: string, user: User }>> {
    // Mock users from our database
    const mockUsers = [
      {
        id: 4,
        username: 'admin',
        email: 'admin@example.com',
        firstName: 'Admin',
        lastName: 'User',
        role: 'ADMIN',
        createdAt: new Date().toISOString()
      },
      {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        role: 'USER',
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        username: 'gamer123',
        email: 'gamer@example.com',
        firstName: 'Gaming',
        lastName: 'Enthusiast',
        role: 'USER',
        createdAt: new Date().toISOString()
      },
      {
        id: 3,
        username: 'techfan',
        email: 'tech@example.com',
        firstName: 'Tech',
        lastName: 'Fan',
        role: 'USER',
        createdAt: new Date().toISOString()
      }
    ]

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Find user
    const user = mockUsers.find(u => u.username === username)
    
    if (!user || password !== 'password123') {
      throw new Error('Invalid username or password')
    }

    // Return successful login response
    return {
      data: {
        token: `mock_token_${user.id}_${Date.now()}`,
        user
      },
      message: 'Login successful',
      success: true
    }
  }

  /**
   * Mock logout
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
}

// Export singleton instance
export const apiService = new ApiService()
export default apiService 