# E-commerce Backend API Test Script
# PowerShell script to test main API endpoints

$BASE_URL = "http://localhost:8081"
$HEADERS = @{
    "Content-Type" = "application/json"
    "Accept" = "application/json"
}

Write-Host "🚀 Starting E-commerce Backend API Tests..." -ForegroundColor Green
Write-Host "Base URL: $BASE_URL" -ForegroundColor Yellow

# Function to test API endpoint
function Test-Endpoint {
    param(
        [string]$Method,
        [string]$Endpoint,
        [string]$Description,
        [string]$Body = $null
    )
    
    Write-Host "`n📡 Testing: $Description" -ForegroundColor Cyan
    Write-Host "   Method: $Method $Endpoint" -ForegroundColor Gray
    
    try {
        $url = "$BASE_URL$Endpoint"
        
        if ($Body) {
            $response = Invoke-RestMethod -Uri $url -Method $Method -Headers $HEADERS -Body $Body -ErrorAction Stop
        } else {
            $response = Invoke-RestMethod -Uri $url -Method $Method -Headers $HEADERS -ErrorAction Stop
        }
        
        Write-Host "   ✅ SUCCESS" -ForegroundColor Green
        
        # Show response preview
        if ($response -is [array]) {
            Write-Host "   📦 Response: Array with $($response.Count) items" -ForegroundColor Gray
        } elseif ($response -is [string]) {
            $preview = if ($response.Length -gt 100) { $response.Substring(0, 100) + "..." } else { $response }
            Write-Host "   📦 Response: $preview" -ForegroundColor Gray
        } else {
            $jsonResponse = $response | ConvertTo-Json -Depth 2 -Compress
            $preview = if ($jsonResponse.Length -gt 100) { $jsonResponse.Substring(0, 100) + "..." } else { $jsonResponse }
            Write-Host "   📦 Response: $preview" -ForegroundColor Gray
        }
        
        return $response
    }
    catch {
        Write-Host "   ❌ FAILED: $($_.Exception.Message)" -ForegroundColor Red
        return $null
    }
}

# Test 1: Health Check
Write-Host "`n🏥 HEALTH CHECKS" -ForegroundColor Magenta
Test-Endpoint -Method "GET" -Endpoint "/actuator/health" -Description "Application Health Check"

# Test 2: Create User
Write-Host "`n👤 USER MANAGEMENT" -ForegroundColor Magenta
$createUserBody = @{
    username = "testuser$(Get-Random)"
    email = "test$(Get-Random)@example.com"
    password = "password123"
    firstName = "Test"
    lastName = "User"
} | ConvertTo-Json

$user = Test-Endpoint -Method "POST" -Endpoint "/api/users" -Description "Create User" -Body $createUserBody

if ($user) {
    $userId = $user.id
    Write-Host "   👤 Created user with ID: $userId" -ForegroundColor Green
    
    # Test get user
    Test-Endpoint -Method "GET" -Endpoint "/api/users/$userId" -Description "Get User by ID"
    
    # Test update preferences
    $preferencesBody = @("electronics", "gaming", "technology") | ConvertTo-Json
    Test-Endpoint -Method "POST" -Endpoint "/api/users/$userId/preferences" -Description "Update User Preferences" -Body $preferencesBody
    
    # Test get recommendations
    Test-Endpoint -Method "GET" -Endpoint "/api/users/$userId/recommendations?limit=5" -Description "Get User Recommendations"
}

# Test 3: Product Management
Write-Host "`n🛍️ PRODUCT MANAGEMENT" -ForegroundColor Magenta
Test-Endpoint -Method "GET" -Endpoint "/api/products?page=0&size=5" -Description "Get Products (Paginated)"
Test-Endpoint -Method "GET" -Endpoint "/api/products/1" -Description "Get Product by ID"
Test-Endpoint -Method "GET" -Endpoint "/api/products/search?query=gaming" -Description "Search Products"
Test-Endpoint -Method "GET" -Endpoint "/api/products/1/similar?limit=3" -Description "Get Similar Products"

# Test 4: AI Features
Write-Host "`n🤖 AI FEATURES" -ForegroundColor Magenta

# Test sentiment analysis
$sentimentBody = @{
    text = "This product is amazing! Great quality and fast delivery."
} | ConvertTo-Json

Test-Endpoint -Method "POST" -Endpoint "/api/ai/analyze-sentiment" -Description "Analyze Sentiment" -Body $sentimentBody

# Test embedding generation
$embeddingBody = @{
    text = "High-performance gaming laptop with RGB keyboard"
} | ConvertTo-Json

Test-Endpoint -Method "POST" -Endpoint "/api/ai/generate-embedding" -Description "Generate Embedding" -Body $embeddingBody

# Test product description generation
$productDescBody = @{
    productName = "Gaming Mouse"
    category = "Electronics"
    brand = "TechBrand"
    features = @("RGB Lighting", "12000 DPI", "Wireless")
    specifications = @("Optical Sensor", "6 Buttons", "Battery Life: 70hrs")
} | ConvertTo-Json

Test-Endpoint -Method "POST" -Endpoint "/api/ai/generate-product-description" -Description "Generate Product Description" -Body $productDescBody

# Test 5: Chatbot
Write-Host "`n💬 CHATBOT" -ForegroundColor Magenta
if ($userId) {
    $chatSessionBody = @{
        userId = $userId
        initialMessage = "Hello, I need help finding a gaming laptop"
    } | ConvertTo-Json

    $chatSession = Test-Endpoint -Method "POST" -Endpoint "/api/chatbot/session" -Description "Start Chat Session" -Body $chatSessionBody
    
    if ($chatSession) {
        $sessionId = $chatSession.id
        Write-Host "   💬 Created chat session with ID: $sessionId" -ForegroundColor Green
        
        # Test send message
        $messageBody = @{
            sessionId = $sessionId
            message = "What gaming laptops do you recommend under $1500?"
        } | ConvertTo-Json
        
        Test-Endpoint -Method "POST" -Endpoint "/api/chatbot/message" -Description "Send Chat Message" -Body $messageBody
        
        # Test get session details
        Test-Endpoint -Method "GET" -Endpoint "/api/chatbot/session/$sessionId" -Description "Get Chat Session Details"
    }
}

# Test 6: Orders
Write-Host "`n📦 ORDER MANAGEMENT" -ForegroundColor Magenta
if ($userId) {
    $orderBody = @{
        userId = $userId
        items = @(
            @{
                productId = 1
                quantity = 1
            }
        )
        shippingAddress = "123 Test St, Test City, 12345"
        billingAddress = "123 Test St, Test City, 12345"
        paymentMethod = "CREDIT_CARD"
    } | ConvertTo-Json -Depth 3

    $order = Test-Endpoint -Method "POST" -Endpoint "/api/orders" -Description "Create Order" -Body $orderBody
    
    if ($order) {
        $orderId = $order.id
        Write-Host "   📦 Created order with ID: $orderId" -ForegroundColor Green
        
        # Test get order
        Test-Endpoint -Method "GET" -Endpoint "/api/orders/$orderId" -Description "Get Order by ID"
        
        # Test get user orders
        Test-Endpoint -Method "GET" -Endpoint "/api/orders/user/$userId?page=0&size=10" -Description "Get User Orders"
    }
}

# Test 7: Recommendations
Write-Host "`n🎯 RECOMMENDATIONS" -ForegroundColor Magenta
if ($userId) {
    Test-Endpoint -Method "GET" -Endpoint "/api/recommendations/user/$userId?limit=5" -Description "Get User Recommendations"
}
Test-Endpoint -Method "GET" -Endpoint "/api/recommendations/similar/1?limit=3" -Description "Get Similar Product Recommendations"
Test-Endpoint -Method "GET" -Endpoint "/api/recommendations/seasonal?limit=5" -Description "Get Seasonal Recommendations"

# Test 8: Inventory
Write-Host "`n📊 INVENTORY MANAGEMENT" -ForegroundColor Magenta
Test-Endpoint -Method "GET" -Endpoint "/api/inventory/forecast/1?days=30" -Description "Forecast Product Demand"
Test-Endpoint -Method "GET" -Endpoint "/api/inventory/analysis/1" -Description "Analyze Inventory"

# Test 9: Payment Analysis
Write-Host "`n💳 PAYMENT ANALYSIS" -ForegroundColor Magenta
if ($userId) {
    Test-Endpoint -Method "GET" -Endpoint "/api/payments/user-behavior/$userId" -Description "Analyze User Payment Behavior"
}

# Summary
Write-Host "`n🎉 API Testing Complete!" -ForegroundColor Green
Write-Host "✅ All major endpoints have been tested" -ForegroundColor Green
Write-Host "📋 Check the results above for any failures" -ForegroundColor Yellow
Write-Host "🔍 For detailed API documentation, visit: $BASE_URL/swagger-ui.html" -ForegroundColor Cyan

# Additional helpful commands
Write-Host "`n📝 Useful Commands:" -ForegroundColor Magenta
Write-Host "• Check app health: curl $BASE_URL/actuator/health" -ForegroundColor Gray
Write-Host "• View Swagger UI: $BASE_URL/swagger-ui.html" -ForegroundColor Gray
Write-Host "• View H2 Console: $BASE_URL/h2-console (if H2 is configured)" -ForegroundColor Gray 