#!/usr/bin/env pwsh

# Full Stack E-commerce Application Startup Script
# This script starts both the Spring Boot backend and React frontend

Write-Host "🚀 Starting Full Stack E-commerce Application..." -ForegroundColor Green
Write-Host ""

# Check if Java is installed
try {
    $javaVersion = java -version 2>&1 | Select-String "version"
    Write-Host "✅ Java found: $javaVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Java not found. Please install Java 17 or higher." -ForegroundColor Red
    exit 1
}

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found. Please install Node.js 16 or higher." -ForegroundColor Red
    exit 1
}

# Check if npm is installed
try {
    $npmVersion = npm --version
    Write-Host "✅ npm found: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm not found. Please install npm." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📋 Prerequisites check completed successfully!" -ForegroundColor Green
Write-Host ""

# Function to start backend
function Start-Backend {
    Write-Host "🔧 Starting Spring Boot Backend..." -ForegroundColor Yellow
    Write-Host "   Backend will be available at: http://localhost:8080" -ForegroundColor Cyan
    Write-Host "   API Documentation: http://localhost:8080/swagger-ui.html" -ForegroundColor Cyan
    Write-Host ""
    
    Set-Location "project/project"
    
    # Check if Maven wrapper exists
    if (Test-Path "mvnw.cmd") {
        Write-Host "   Using Maven wrapper..." -ForegroundColor Gray
        Start-Process -FilePath ".\mvnw.cmd" -ArgumentList "spring-boot:run" -NoNewWindow
    } else {
        Write-Host "   Using system Maven..." -ForegroundColor Gray
        Start-Process -FilePath "mvn" -ArgumentList "spring-boot:run" -NoNewWindow
    }
    
    Set-Location "../.."
}

# Function to start frontend
function Start-Frontend {
    Write-Host "🎨 Starting React Frontend..." -ForegroundColor Yellow
    Write-Host "   Frontend will be available at: http://localhost:5173" -ForegroundColor Cyan
    Write-Host ""
    
    Set-Location "frontend"
    
    # Install dependencies if node_modules doesn't exist
    if (-not (Test-Path "node_modules")) {
        Write-Host "   Installing frontend dependencies..." -ForegroundColor Gray
        npm install
    }
    
    # Start development server
    Write-Host "   Starting development server..." -ForegroundColor Gray
    Start-Process -FilePath "npm" -ArgumentList "run", "dev" -NoNewWindow
    
    Set-Location ".."
}

# Function to wait for services to start
function Wait-ForServices {
    Write-Host ""
    Write-Host "⏳ Waiting for services to start..." -ForegroundColor Yellow
    
    $backendReady = $false
    $frontendReady = $false
    $attempts = 0
    $maxAttempts = 30
    
    while (-not ($backendReady -and $frontendReady) -and $attempts -lt $maxAttempts) {
        $attempts++
        Write-Host "   Attempt $attempts/$maxAttempts..." -ForegroundColor Gray
        
        # Check backend
        if (-not $backendReady) {
            try {
                $response = Invoke-WebRequest -Uri "http://localhost:8080/actuator/health" -TimeoutSec 5 -ErrorAction SilentlyContinue
                if ($response.StatusCode -eq 200) {
                    $backendReady = $true
                    Write-Host "   ✅ Backend is ready!" -ForegroundColor Green
                }
            } catch {
                # Backend not ready yet
            }
        }
        
        # Check frontend
        if (-not $frontendReady) {
            try {
                $response = Invoke-WebRequest -Uri "http://localhost:5173" -TimeoutSec 5 -ErrorAction SilentlyContinue
                if ($response.StatusCode -eq 200) {
                    $frontendReady = $true
                    Write-Host "   ✅ Frontend is ready!" -ForegroundColor Green
                }
            } catch {
                # Frontend not ready yet
            }
        }
        
        if (-not ($backendReady -and $frontendReady)) {
            Start-Sleep -Seconds 2
        }
    }
    
    if ($backendReady -and $frontendReady) {
        Write-Host ""
        Write-Host "🎉 All services are running successfully!" -ForegroundColor Green
        Write-Host ""
        Write-Host "📱 Application URLs:" -ForegroundColor Cyan
        Write-Host "   Frontend: http://localhost:5173" -ForegroundColor White
        Write-Host "   Backend API: http://localhost:8080" -ForegroundColor White
        Write-Host "   API Docs: http://localhost:8080/swagger-ui.html" -ForegroundColor White
        Write-Host "   Database: http://localhost:8080/h2-console" -ForegroundColor White
        Write-Host ""
        Write-Host "🔑 Default Admin Credentials:" -ForegroundColor Cyan
        Write-Host "   Email: admin@example.com" -ForegroundColor White
        Write-Host "   Password: admin123" -ForegroundColor White
        Write-Host ""
        Write-Host "👤 Default User Credentials:" -ForegroundColor Cyan
        Write-Host "   Email: user@example.com" -ForegroundColor White
        Write-Host "   Password: user123" -ForegroundColor White
        Write-Host ""
        Write-Host "💡 Tips:" -ForegroundColor Yellow
        Write-Host "   - Press Ctrl+C to stop all services" -ForegroundColor Gray
        Write-Host "   - Check the console for any error messages" -ForegroundColor Gray
        Write-Host "   - Use the admin panel to manage products and users" -ForegroundColor Gray
        Write-Host ""
    } else {
        Write-Host ""
        Write-Host "⚠️  Some services may not have started properly." -ForegroundColor Yellow
        Write-Host "   Please check the console output for any error messages." -ForegroundColor Gray
        Write-Host ""
    }
}

# Function to handle cleanup on script exit
function Cleanup {
    Write-Host ""
    Write-Host "🛑 Stopping all services..." -ForegroundColor Yellow
    
    # Stop backend processes
    Get-Process -Name "java" -ErrorAction SilentlyContinue | Where-Object { $_.ProcessName -eq "java" } | Stop-Process -Force
    
    # Stop frontend processes
    Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object { $_.ProcessName -eq "node" } | Stop-Process -Force
    
    Write-Host "✅ All services stopped." -ForegroundColor Green
}

# Register cleanup function to run on script exit
trap { Cleanup; break }

# Main execution
try {
    # Start backend
    Start-Backend
    
    # Wait a bit for backend to start
    Start-Sleep -Seconds 5
    
    # Start frontend
    Start-Frontend
    
    # Wait for services to be ready
    Wait-ForServices
    
    # Keep script running
    Write-Host "🔄 Services are running. Press Ctrl+C to stop..." -ForegroundColor Green
    while ($true) {
        Start-Sleep -Seconds 10
    }
} catch {
    Write-Host "❌ An error occurred: $($_.Exception.Message)" -ForegroundColor Red
    Cleanup
    exit 1
} 