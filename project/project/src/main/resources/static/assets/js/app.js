// AI E-commerce Platform - Main Application Logic

// ===== Global Variables =====
let currentUser = null;
let currentChatSession = null;
let cartItems = [];
let currentPage = 1;
let totalPages = 1;

// ===== Application Initialization =====
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    loadInitialData();
});

// ===== App Initialization =====
function initializeApp() {
    console.log('🚀 AI E-commerce Platform Initialized');
    
    // Check if backend is running
    checkBackendHealth();
    
    // Setup navigation
    setupNavigation();
    
    // Load user data from localStorage
    loadUserData();
    
    // Show home section by default
    showSection('home');
}

// ===== Event Listeners Setup =====
function setupEventListeners() {
    // Navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('href').substring(1);
            showSection(section);
            updateActiveNavLink(this);
        });
    });

    // Search functionality
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');
    
    if (searchBtn) {
        searchBtn.addEventListener('click', performSearch);
    }
    
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }

    // Filter functionality
    const categoryFilter = document.getElementById('categoryFilter');
    const sortFilter = document.getElementById('sortFilter');
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', performSearch);
    }
    
    if (sortFilter) {
        sortFilter.addEventListener('change', performSearch);
    }

    // Chat input
    const chatInput = document.getElementById('chatInput');
    if (chatInput) {
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendChatMessage();
            }
        });
    }
}

// ===== Navigation Functions =====
function showSection(sectionId) {
    console.log(`📍 Navigating to: ${sectionId}`);
    
    // Hide all sections
    document.querySelectorAll('.page-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        updatePageTitle(sectionId);
        loadSectionData(sectionId);
    }
}

function updateActiveNavLink(activeLink) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    activeLink.classList.add('active');
}

function updatePageTitle(sectionId) {
    const titles = {
        'home': 'AI Commerce - Home',
        'products': 'AI Commerce - Products',
        'chatbot': 'AI Commerce - AI Assistant',
        'orders': 'AI Commerce - Orders',
        'admin': 'AI Commerce - Admin Dashboard'
    };
    document.title = titles[sectionId] || 'AI Commerce';
}

function loadSectionData(sectionId) {
    switch(sectionId) {
        case 'home':
            loadDashboardStats();
            break;
        case 'products':
            loadProducts();
            break;
        case 'chatbot':
            initializeChatbot();
            break;
        case 'orders':
            loadOrders();
            break;
        case 'admin':
            loadAdminDashboard();
            break;
    }
}

// ===== Data Loading Functions =====
function loadInitialData() {
    // Load basic data that's needed across sections
    loadDashboardStats();
}

async function loadDashboardStats() {
    try {
        const stats = await api.getDashboardStats();
        
        if (stats) {
            // Animate counters with real data
            animateCounter('totalUsers', 0, stats.totalUsers || 1250, 2000);
            animateCounter('totalProducts', 0, stats.totalProducts || 3450, 2000);
            animateCounter('totalOrders', 0, stats.totalOrders || 890, 2000);
            animateCounter('totalRevenue', 0, stats.totalRevenue || 125000, 2000);
            
            // Update revenue display
            setTimeout(() => {
                const revenueElement = document.getElementById('totalRevenue');
                if (revenueElement) {
                    const revenue = stats.totalRevenue || 125000;
                    revenueElement.textContent = `$${revenue.toLocaleString()}`;
                }
            }, 2000);
        } else {
            throw new Error('No stats data received');
        }
    } catch (error) {
        console.error('Failed to load dashboard stats:', error);
        // Fallback to simulated stats
        const stats = {
            totalUsers: 1250,
            totalProducts: 3450,
            totalOrders: 890,
            totalRevenue: 125000
        };
        
        // Animate counters
        animateCounter('totalUsers', 0, stats.totalUsers, 2000);
        animateCounter('totalProducts', 0, stats.totalProducts, 2000);
        animateCounter('totalOrders', 0, stats.totalOrders, 2000);
        animateCounter('totalRevenue', 0, stats.totalRevenue, 2000);
        
        // Update revenue display
        setTimeout(() => {
            const revenueElement = document.getElementById('totalRevenue');
            if (revenueElement) {
                revenueElement.textContent = `$${stats.totalRevenue.toLocaleString()}`;
            }
        }, 2000);
    }
}

function animateCounter(elementId, start, end, duration) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const startTime = Date.now();
    const range = end - start;
    
    function updateCounter() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const current = Math.floor(start + (range * progress));
        
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    }
    
    updateCounter();
}

// ===== Products Section =====
async function loadProducts() {
    showLoadingSpinner('productsContainer');
    
    try {
        const response = await api.getAllProducts(currentPage - 1, 12);
        if (response && response.content) {
            displayProducts(response.content);
            updatePagination(response.totalPages, response.number + 1);
        } else {
            // Fallback to sample data if API fails
            console.warn('API failed, using sample data');
            const products = generateSampleProducts();
            displayProducts(products);
        }
    } catch (error) {
        console.error('Failed to load products:', error);
        showError('Failed to load products. Showing sample data.');
        const products = generateSampleProducts();
        displayProducts(products);
    }
}

function generateSampleProducts() {
    const categories = ['electronics', 'clothing', 'books', 'home'];
    const products = [];
    
    for (let i = 1; i <= 12; i++) {
        products.push({
            id: i,
            name: `Product ${i}`,
            price: Math.floor(Math.random() * 500) + 50,
            category: categories[Math.floor(Math.random() * categories.length)],
            rating: (Math.random() * 2 + 3).toFixed(1),
            image: `https://via.placeholder.com/300x200?text=Product+${i}`,
            description: `This is a sample description for Product ${i}. It's a great product with amazing features.`
        });
    }
    
    return products;
}

function displayProducts(products) {
    const container = document.getElementById('productsContainer');
    if (!container) return;
    
    container.innerHTML = '';
    
    products.forEach(product => {
        const productCard = `
            <div class="col-md-4 mb-4">
                <div class="product-card">
                    <div class="product-image">
                        <i class="bi bi-box"></i>
                    </div>
                    <div class="card-body p-3">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text">${product.description}</p>
                        <div class="d-flex justify-content-between align-items-center">
                            <span class="product-price">$${product.price}</span>
                            <div class="product-rating">
                                ${'★'.repeat(Math.floor(product.rating))}
                                <span class="text-muted">(${product.rating})</span>
                            </div>
                        </div>
                        <div class="d-flex gap-2 mt-3">
                            <button class="btn btn-primary btn-sm flex-fill" onclick="viewProduct(${product.id})">
                                <i class="bi bi-eye"></i> View
                            </button>
                            <button class="btn btn-success btn-sm flex-fill" onclick="addToCart(${product.id})">
                                <i class="bi bi-cart-plus"></i> Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += productCard;
    });
}

async function performSearch() {
    const searchTerm = document.getElementById('searchInput')?.value || '';
    const category = document.getElementById('categoryFilter')?.value || '';
    const sort = document.getElementById('sortFilter')?.value || '';
    
    console.log('🔍 Searching:', { searchTerm, category, sort });
    
    showLoadingSpinner('productsContainer');
    
    try {
        let response;
        if (searchTerm.trim()) {
            response = await api.searchProducts(searchTerm, currentPage - 1, 12);
        } else if (category) {
            response = await api.getProductsByCategory(category, currentPage - 1, 12);
        } else {
            response = await api.getAllProducts(currentPage - 1, 12);
        }
        
        if (response && response.content) {
            displayProducts(response.content);
            updatePagination(response.totalPages, response.number + 1);
        } else {
            showError('No products found');
            document.getElementById('productsContainer').innerHTML = '<div class="col-12 text-center"><p>No products found</p></div>';
        }
    } catch (error) {
        console.error('Search failed:', error);
        showError('Search failed. Please try again.');
        loadProducts(); // Fallback to load all products
    }
}

// ===== Chatbot Section =====
function initializeChatbot() {
    console.log('🤖 Initializing chatbot...');
    
    // Clear previous messages except welcome
    const messagesContainer = document.getElementById('chatMessages');
    if (messagesContainer) {
        messagesContainer.innerHTML = `
            <div class="message bot-message">
                <div class="message-content">
                    <i class="bi bi-robot"></i>
                    <span>Hello! I'm your AI shopping assistant. How can I help you today?</span>
                </div>
            </div>
        `;
    }
}

async function startChatSession() {
    console.log('🔄 Starting new chat session...');
    
    try {
        const session = await api.createChatSession({ userId: currentUser?.id || 1 });
        if (session) {
            currentChatSession = session;
            initializeChatbot();
            showSuccess('New chat session started!');
        }
    } catch (error) {
        console.error('Failed to start chat session:', error);
        // Fallback to local session
        currentChatSession = {
            id: Date.now(),
            userId: currentUser?.id || 1,
            messages: []
        };
        initializeChatbot();
        showError('Chat session started in offline mode');
    }
}

async function sendChatMessage() {
    const input = document.getElementById('chatInput');
    const message = input?.value?.trim();
    
    if (!message) return;
    
    // Add user message
    addChatMessage('user', message);
    
    // Clear input
    input.value = '';
    
    try {
        if (currentChatSession?.id) {
            const response = await api.sendChatMessage(currentChatSession.id, message);
            if (response && response.content) {
                addChatMessage('bot', response.content);
            } else {
                throw new Error('Invalid response format');
            }
        } else {
            throw new Error('No active chat session');
        }
    } catch (error) {
        console.error('Failed to send chat message:', error);
        // Fallback to mock response
        const responses = [
            "I'd be happy to help you with that! What specific product are you looking for?",
            "Based on your preferences, I can recommend some great products. Let me search for you.",
            "That's a great question! Our AI can help you find the perfect product match.",
            "I can help you with product recommendations, order tracking, or general shopping questions.",
            "Let me analyze your shopping pattern and suggest something perfect for you!"
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        addChatMessage('bot', randomResponse + " (Offline mode)");
    }
}

function addChatMessage(type, content) {
    const messagesContainer = document.getElementById('chatMessages');
    if (!messagesContainer) return;
    
    const messageElement = document.createElement('div');
    messageElement.className = `message ${type}-message`;
    
    const icon = type === 'user' ? 'bi-person' : 'bi-robot';
    messageElement.innerHTML = `
        <div class="message-content">
            <i class="bi ${icon}"></i>
            <span>${content}</span>
        </div>
    `;
    
    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// ===== Orders Section =====
async function loadOrders() {
    showLoadingSpinner('ordersContainer');
    
    try {
        const userId = currentUser?.id || 1;
        const response = await api.getUserOrders(userId, 0, 20);
        
        if (response && response.content) {
            displayOrders(response.content);
        } else {
            // Fallback to sample data if no orders or API fails
            console.warn('No orders found or API failed, using sample data');
            const orders = generateSampleOrders();
            displayOrders(orders);
        }
    } catch (error) {
        console.error('Failed to load orders:', error);
        showError('Failed to load orders. Showing sample data.');
        const orders = generateSampleOrders();
        displayOrders(orders);
    }
}

function generateSampleOrders() {
    const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    const orders = [];
    
    for (let i = 1; i <= 6; i++) {
        orders.push({
            id: i,
            orderNumber: `ORD-${1000 + i}`,
            date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
            status: statuses[Math.floor(Math.random() * statuses.length)],
            total: (Math.random() * 500 + 50).toFixed(2),
            items: Math.floor(Math.random() * 5) + 1
        });
    }
    
    return orders;
}

function displayOrders(orders) {
    const container = document.getElementById('ordersContainer');
    if (!container) return;
    
    container.innerHTML = '';
    
    orders.forEach(order => {
        const orderCard = `
            <div class="col-md-6 mb-4">
                <div class="order-card">
                    <div class="d-flex justify-content-between align-items-start mb-3">
                        <div>
                            <h5 class="mb-1">${order.orderNumber}</h5>
                            <p class="text-muted mb-0">${order.date}</p>
                        </div>
                        <span class="order-status status-${order.status}">${order.status}</span>
                    </div>
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <span class="text-muted">${order.items} items</span>
                            <span class="fw-bold ms-3">$${order.total}</span>
                        </div>
                        <button class="btn btn-outline-primary btn-sm" onclick="viewOrder(${order.id})">
                            <i class="bi bi-eye"></i> View Details
                        </button>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += orderCard;
    });
}

// ===== Admin Dashboard =====
function loadAdminDashboard() {
    console.log('👑 Loading admin dashboard...');
    
    // Load users by default
    loadUsers();
    
    // Setup tab event listeners
    document.querySelectorAll('[data-bs-toggle="tab"]').forEach(tab => {
        tab.addEventListener('shown.bs.tab', function(e) {
            const target = e.target.getAttribute('data-bs-target');
            const section = target.substring(1); // Remove #
            
            switch(section) {
                case 'users':
                    loadUsers();
                    break;
                case 'inventory':
                    loadInventory();
                    break;
                case 'analytics':
                    loadAnalytics();
                    break;
                case 'fraud':
                    loadFraudDetection();
                    break;
            }
        });
    });
}

async function loadUsers() {
    const container = document.getElementById('usersContent');
    if (!container) return;
    
    try {
        const users = await api.getAllUsers();
        
        if (users && users.length > 0) {
            let tableRows = '';
            users.forEach(user => {
                const status = user.isActive ? 'Active' : 'Inactive';
                const statusClass = user.isActive ? 'bg-success' : 'bg-danger';
                
                tableRows += `
                    <tr>
                        <td>${user.id}</td>
                        <td>${user.firstName || ''} ${user.lastName || ''}</td>
                        <td>${user.email}</td>
                        <td><span class="badge ${statusClass}">${status}</span></td>
                        <td>
                            <button class="btn btn-sm btn-outline-primary" onclick="editUser(${user.id})">Edit</button>
                            <button class="btn btn-sm btn-outline-danger" onclick="deleteUser(${user.id})">Delete</button>
                        </td>
                    </tr>
                `;
            });
            
            container.innerHTML = `
                <div class="table-responsive">
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${tableRows}
                        </tbody>
                    </table>
                </div>
            `;
        } else {
            throw new Error('No users data');
        }
    } catch (error) {
        console.error('Failed to load users:', error);
        // Fallback to sample data
        container.innerHTML = `
            <div class="table-responsive">
                <table class="table table-striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td>John Doe (Sample)</td>
                            <td>john@example.com</td>
                            <td><span class="badge bg-success">Active</span></td>
                            <td>
                                <button class="btn btn-sm btn-outline-primary">Edit</button>
                                <button class="btn btn-sm btn-outline-danger">Delete</button>
                            </td>
                        </tr>
                        <tr>
                            <td>2</td>
                            <td>Jane Smith (Sample)</td>
                            <td>jane@example.com</td>
                            <td><span class="badge bg-success">Active</span></td>
                            <td>
                                <button class="btn btn-sm btn-outline-primary">Edit</button>
                                <button class="btn btn-sm btn-outline-danger">Delete</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `;
    }
}

function loadInventory() {
    const container = document.getElementById('inventoryContent');
    if (!container) return;
    
    container.innerHTML = `
        <div class="row">
            <div class="col-md-6">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Inventory Overview</h5>
                        <p>Total Products: 3,450</p>
                        <p>Low Stock Items: 23</p>
                        <p>Out of Stock: 5</p>
                    </div>
                </div>
            </div>
            <div class="col-md-6">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Recent Activity</h5>
                        <p>✅ Product XYZ restocked</p>
                        <p>⚠️ Product ABC low stock</p>
                        <p>❌ Product DEF out of stock</p>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function loadAnalytics() {
    const container = document.getElementById('analyticsContent');
    if (!container) return;
    
    container.innerHTML = `
        <div class="row">
            <div class="col-md-8">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Sales Analytics</h5>
                        <canvas id="salesChart" width="400" height="200"></canvas>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Key Metrics</h5>
                        <p>📈 Revenue Growth: +15%</p>
                        <p>👥 New Customers: 234</p>
                        <p>🛒 Avg Order Value: $156</p>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function loadFraudDetection() {
    const container = document.getElementById('fraudContent');
    if (!container) return;
    
    container.innerHTML = `
        <div class="alert alert-info">
            <i class="bi bi-shield-check"></i>
            <strong>AI Fraud Detection System Active</strong>
            <p class="mb-0">Monitoring transactions for suspicious activity...</p>
        </div>
        <div class="row">
            <div class="col-md-6">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Fraud Statistics</h5>
                        <p>🔍 Transactions Analyzed: 10,543</p>
                        <p>⚠️ Flagged as Suspicious: 12</p>
                        <p>❌ Confirmed Fraud: 2</p>
                    </div>
                </div>
            </div>
            <div class="col-md-6">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Recent Alerts</h5>
                        <p>🚨 High-risk transaction detected</p>
                        <p>⚠️ Unusual spending pattern</p>
                        <p>✅ False positive resolved</p>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// ===== Utility Functions =====
function showLoadingSpinner(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = `
        <div class="col-12 text-center py-5">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-2 text-muted">Loading...</p>
        </div>
    `;
}

function hideLoadingSpinner(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = '';
}

function showError(message) {
    console.error('❌ Error:', message);
    
    // Create toast notification
    const toast = document.createElement('div');
    toast.className = 'toast align-items-center text-white bg-danger border-0';
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                <i class="fas fa-exclamation-triangle me-2"></i>
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;
    
    // Add to toast container
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
        document.body.appendChild(toastContainer);
    }
    
    toastContainer.appendChild(toast);
    
    // Show toast
    const bootstrapToast = new bootstrap.Toast(toast);
    bootstrapToast.show();
    
    // Remove toast after it hides
    toast.addEventListener('hidden.bs.toast', function () {
        toast.remove();
    });
}

function showSuccess(message) {
    console.log('✅ Success:', message);
    
    // Create toast notification
    const toast = document.createElement('div');
    toast.className = 'toast align-items-center text-white bg-success border-0';
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                <i class="fas fa-check-circle me-2"></i>
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;
    
    // Add to toast container
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
        document.body.appendChild(toastContainer);
    }
    
    toastContainer.appendChild(toast);
    
    // Show toast
    const bootstrapToast = new bootstrap.Toast(toast);
    bootstrapToast.show();
    
    // Remove toast after it hides
    toast.addEventListener('hidden.bs.toast', function () {
        toast.remove();
    });
}

// ===== User Functions =====
function loadUserData() {
    // Simulate loading user data
    const userData = localStorage.getItem('currentUser');
    if (userData) {
        currentUser = JSON.parse(userData);
        updateUIForLoggedInUser();
    }
}

function updateUIForLoggedInUser() {
    // Update UI elements when user is logged in
    const loginLink = document.querySelector('a[onclick="showLoginModal()"]');
    if (loginLink && currentUser) {
        loginLink.innerHTML = `<i class="bi bi-person-circle"></i> ${currentUser.name}`;
        loginLink.setAttribute('onclick', 'showUserProfile()');
    }
}

function showLoginModal() {
    // Simple login simulation
    const username = prompt('Enter username:');
    const password = prompt('Enter password:');
    
    if (username && password) {
        currentUser = {
            id: 1,
            name: username,
            email: `${username}@example.com`
        };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        updateUIForLoggedInUser();
        showSuccess('Login successful!');
    }
}

function showUserProfile() {
    alert(`User Profile:\nName: ${currentUser.name}\nEmail: ${currentUser.email}`);
}

// ===== Shopping Cart Functions =====
function addToCart(productId) {
    cartItems.push({ id: productId, quantity: 1 });
    updateCartBadge();
    showSuccess(`Product ${productId} added to cart!`);
}

function updateCartBadge() {
    const badge = document.getElementById('cartBadge');
    if (badge) {
        badge.textContent = cartItems.length;
    }
}

function showCart() {
    alert(`Cart contains ${cartItems.length} items`);
}

// ===== Product Functions =====
function viewProduct(productId) {
    alert(`Viewing product ${productId}`);
}

// ===== Order Functions =====
function viewOrder(orderId) {
    alert(`Viewing order ${orderId}`);
}

// ===== Pagination Functions =====
function updatePagination(totalPagesCount, currentPageNum) {
    totalPages = totalPagesCount;
    currentPage = currentPageNum;
    
    const pagination = document.getElementById('productsPagination');
    if (!pagination) return;
    
    pagination.innerHTML = '';
    
    // Previous button
    if (currentPage > 1) {
        pagination.innerHTML += `
            <li class="page-item">
                <a class="page-link" href="#" onclick="changePage(${currentPage - 1})">Previous</a>
            </li>
        `;
    }
    
    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        const activeClass = i === currentPage ? 'active' : '';
        pagination.innerHTML += `
            <li class="page-item ${activeClass}">
                <a class="page-link" href="#" onclick="changePage(${i})">${i}</a>
            </li>
        `;
    }
    
    // Next button
    if (currentPage < totalPages) {
        pagination.innerHTML += `
            <li class="page-item">
                <a class="page-link" href="#" onclick="changePage(${currentPage + 1})">Next</a>
            </li>
        `;
    }
}

function changePage(page) {
    currentPage = page;
    loadProducts();
}

// ===== Health Check =====
function checkBackendHealth() {
    fetch('/actuator/health')
        .then(response => {
            if (response.ok) {
                console.log('✅ Backend is healthy');
            } else {
                console.warn('⚠️ Backend health check failed');
            }
        })
        .catch(error => {
            console.error('❌ Backend connection failed:', error);
        });
}

// ===== Initialize pagination =====
updatePagination(3, 1);

console.log('🚀 App.js loaded successfully'); 