// AI E-commerce Platform - API Communication Module

// ===== API Configuration =====
// Use relative URL when integrated with Spring Boot
const API_BASE_URL = '/api';
const API_CONFIG = {
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
};

// ===== API Helper Functions =====
class APIClient {
    constructor(baseURL = API_BASE_URL) {
        this.baseURL = baseURL;
        this.defaultHeaders = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };
    }

    // Generic request method
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            method: 'GET',
            headers: { ...this.defaultHeaders, ...options.headers },
            signal: options.signal || this.createTimeoutSignal(10000), // 10 second timeout
            ...options
        };

        // Add body for POST/PUT requests
        if (config.body && typeof config.body === 'object') {
            config.body = JSON.stringify(config.body);
        }

        try {
            console.log(`🌐 API Request: ${config.method} ${url}`);
            const response = await fetch(url, config);
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`);
            }

            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                const data = await response.json();
                console.log(`✅ API Response:`, data);
                return data;
            } else {
                const text = await response.text();
                console.log(`✅ API Response (text):`, text);
                return text;
            }
        } catch (error) {
            console.error(`❌ API Error: ${config.method} ${url}`, error);
            
            if (error.name === 'AbortError') {
                throw new Error('Request timeout - please try again');
            }
            
            throw error;
        }
    }

    // Create timeout signal
    createTimeoutSignal(timeoutMs) {
        const controller = new AbortController();
        setTimeout(() => controller.abort(), timeoutMs);
        return controller.signal;
    }

    // GET request
    async get(endpoint, params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const url = queryString ? `${endpoint}?${queryString}` : endpoint;
        return await this.request(url);
    }

    // POST request
    async post(endpoint, data = {}) {
        return await this.request(endpoint, {
            method: 'POST',
            body: data
        });
    }

    // PUT request
    async put(endpoint, data = {}) {
        return await this.request(endpoint, {
            method: 'PUT',
            body: data
        });
    }

    // DELETE request
    async delete(endpoint) {
        return await this.request(endpoint, {
            method: 'DELETE'
        });
    }
}

// ===== API Instance =====
const api = new APIClient();

// ===== API Functions =====

// User Management
async function loginUser(credentials) {
    return await api.post('/auth/login', credentials);
}

async function registerUser(userData) {
    return await api.post('/users', userData);
}

async function getCurrentUser() {
    return await api.get('/users/current');
}

async function getAllUsers() {
    return await api.get('/users');
}

async function getUserById(userId) {
    return await api.get(`/users/${userId}`);
}

async function updateUser(userId, userData) {
    return await api.put(`/users/${userId}`, userData);
}

async function deleteUser(userId) {
    return await api.delete(`/users/${userId}`);
}

// Product Management
async function getAllProducts(page = 0, size = 10) {
    return await api.get('/products', { page, size });
}

async function getProductById(productId) {
    return await api.get(`/products/${productId}`);
}

async function searchProducts(query, page = 0, size = 10) {
    return await api.get('/products/search', { query, page, size });
}

async function getProductsByCategory(categoryId, page = 0, size = 10) {
    return await api.get(`/products/category/${categoryId}`, { page, size });
}

async function createProduct(productData) {
    return await api.post('/products', productData);
}

async function updateProduct(productId, productData) {
    return await api.put(`/products/${productId}`, productData);
}

async function deleteProduct(productId) {
    return await api.delete(`/products/${productId}`);
}

// Order Management
async function createOrder(orderData) {
    return await api.post('/orders', orderData);
}

async function getAllOrders(page = 0, size = 10) {
    return await api.get('/orders', { page, size });
}

async function getOrderById(orderId) {
    return await api.get(`/orders/${orderId}`);
}

async function getUserOrders(userId, page = 0, size = 10) {
    return await api.get(`/orders/user/${userId}`, { page, size });
}

async function updateOrderStatus(orderId, status) {
    return await api.put(`/orders/${orderId}/status`, { status });
}

async function cancelOrder(orderId) {
    return await api.delete(`/orders/${orderId}`);
}

// Payment Management
async function processPayment(paymentData) {
    return await api.post('/payments', paymentData);
}

async function getPaymentById(paymentId) {
    return await api.get(`/payments/${paymentId}`);
}

async function getOrderPayments(orderId) {
    return await api.get(`/payments/order/${orderId}`);
}

// Chatbot / AI Assistant
async function createChatSession(userId) {
    return await api.post('/chatbot/sessions', { userId });
}

async function getChatSession(sessionId) {
    return await api.get(`/chatbot/sessions/${sessionId}`);
}

async function sendChatMessage(sessionId, message) {
    return await api.post(`/chatbot/sessions/${sessionId}/messages`, { message });
}

async function getChatHistory(sessionId) {
    return await api.get(`/chatbot/sessions/${sessionId}/messages`);
}

// AI Services
async function getProductRecommendations(userId, limit = 10) {
    return await api.get(`/ai/recommendations/${userId}`, { limit });
}

async function analyzeUserBehavior(userId) {
    return await api.get(`/ai/behavior/${userId}`);
}

async function detectFraud(transactionData) {
    return await api.post('/ai/fraud-detection', transactionData);
}

async function generateContent(prompt) {
    return await api.post('/ai/content', { prompt });
}

// Inventory Management
async function getInventory(page = 0, size = 10) {
    return await api.get('/inventory', { page, size });
}

async function getInventoryItem(itemId) {
    return await api.get(`/inventory/${itemId}`);
}

async function updateInventoryItem(itemId, itemData) {
    return await api.put(`/inventory/${itemId}`, itemData);
}

async function addInventoryItem(itemData) {
    return await api.post('/inventory', itemData);
}

async function deleteInventoryItem(itemId) {
    return await api.delete(`/inventory/${itemId}`);
}

// Analytics & Statistics
async function getDashboardStats() {
    return await api.get('/analytics/dashboard');
}

async function getSalesAnalytics(period = 'month') {
    return await api.get('/analytics/sales', { period });
}

async function getUserAnalytics(userId) {
    return await api.get(`/analytics/users/${userId}`);
}

async function getProductAnalytics(productId) {
    return await api.get(`/analytics/products/${productId}`);
}

// Health Check
async function checkHealth() {
    try {
        const response = await fetch('/actuator/health');
        return response.ok;
    } catch (error) {
        console.error('Health check failed:', error);
        return false;
    }
}

// ===== Error Handling Utility =====
function handleApiError(error, context = '') {
    console.error(`API Error ${context}:`, error);
    
    if (error.message.includes('404')) {
        return { success: false, error: 'Resource not found' };
    } else if (error.message.includes('401')) {
        return { success: false, error: 'Authentication required' };
    } else if (error.message.includes('403')) {
        return { success: false, error: 'Access forbidden' };
    } else if (error.message.includes('500')) {
        return { success: false, error: 'Server error' };
    } else {
        return { success: false, error: 'Network error' };
    }
}

// ===== Export for usage =====
window.api = {
    // User functions
    loginUser,
    registerUser,
    getCurrentUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    
    // Product functions
    getAllProducts,
    getProductById,
    searchProducts,
    getProductsByCategory,
    createProduct,
    updateProduct,
    deleteProduct,
    
    // Order functions
    createOrder,
    getAllOrders,
    getOrderById,
    getUserOrders,
    updateOrderStatus,
    cancelOrder,
    
    // Payment functions
    processPayment,
    getPaymentById,
    getOrderPayments,
    
    // Chatbot functions
    createChatSession,
    getChatSession,
    sendChatMessage,
    getChatHistory,
    
    // AI functions
    getProductRecommendations,
    analyzeUserBehavior,
    detectFraud,
    generateContent,
    
    // Inventory functions
    getInventory,
    getInventoryItem,
    updateInventoryItem,
    addInventoryItem,
    deleteInventoryItem,
    
    // Analytics functions
    getDashboardStats,
    getSalesAnalytics,
    getUserAnalytics,
    getProductAnalytics,
    
    // Utility functions
    checkHealth,
    handleApiError
};

// ===== API Testing Utilities =====
window.testAPI = {
    async testAll() {
        console.log('🧪 Testing API endpoints...');
        
        try {
            // Test health check
            const healthy = await checkHealth();
            console.log('Health check:', healthy ? '✅' : '❌');
            
            // Test products
            const products = await getAllProducts(0, 5);
            console.log('Products:', products ? '✅' : '❌');
            
            // Test users
            const users = await getAllUsers();
            console.log('Users:', users ? '✅' : '❌');
            
            // Test orders
            const orders = await getAllOrders(0, 5);
            console.log('Orders:', orders ? '✅' : '❌');
            
            console.log('✅ API testing completed');
            return true;
        } catch (error) {
            console.error('❌ API testing failed:', error);
            return false;
        }
    },
    
    async testChatbot() {
        console.log('🤖 Testing Chatbot API...');
        
        try {
            // Create session
            const session = await createChatSession(1);
            console.log('Session created:', session ? '✅' : '❌');
            
            if (session && session.id) {
                // Send message
                const response = await sendChatMessage(session.id, 'Hello!');
                console.log('Message sent:', response ? '✅' : '❌');
                
                // Get history
                const history = await getChatHistory(session.id);
                console.log('History retrieved:', history ? '✅' : '❌');
            }
            
            console.log('✅ Chatbot testing completed');
            return true;
        } catch (error) {
            console.error('❌ Chatbot testing failed:', error);
            return false;
        }
    }
};

// Log API module loaded
console.log('🚀 API Module loaded successfully'); 