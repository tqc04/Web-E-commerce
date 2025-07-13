#!/usr/bin/env pwsh

# 🚀 AI E-commerce Platform - Full Stack Runner
# This script runs both React frontend and Spring Boot backend

Write-Host "🎯 AI E-commerce Platform - Full Stack Development" -ForegroundColor Green
Write-Host "🎨 Frontend: React + Vite + Material-UI" -ForegroundColor Cyan
Write-Host "🖥️ Backend: Spring Boot + MySQL + OpenAI" -ForegroundColor Blue
Write-Host ""

# Check dependencies
Write-Host "🔍 Checking dependencies..." -ForegroundColor Yellow

# Check Node.js
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Node.js 16+ first: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Check Java
if (-not (Get-Command java -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Java is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Java 17+ first" -ForegroundColor Yellow
    exit 1
}

# Check Maven
if (-not (Get-Command mvn -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Maven is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Maven first: https://maven.apache.org/" -ForegroundColor Yellow
    exit 1
}

$nodeVersion = node --version
$javaVersion = java -version 2>&1 | Select-Object -First 1
Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green
Write-Host "✅ Java: $javaVersion" -ForegroundColor Green
Write-Host ""

# Check if ports are available
$frontendPort = 3000
$backendPort = 8081

$frontendInUse = netstat -an | findstr ":$frontendPort"
$backendInUse = netstat -an | findstr ":$backendPort"

if ($frontendInUse) {
    Write-Host "⚠️ Port $frontendPort is already in use (Frontend)" -ForegroundColor Yellow
    Write-Host "Please stop the service using port $frontendPort or choose a different port" -ForegroundColor Yellow
    Write-Host ""
}

if ($backendInUse) {
    Write-Host "⚠️ Port $backendPort is already in use (Backend)" -ForegroundColor Yellow
    Write-Host "Please stop the service using port $backendPort" -ForegroundColor Yellow
    Write-Host ""
}

# Install frontend dependencies if needed
Write-Host "📦 Checking frontend dependencies..." -ForegroundColor Yellow
if (-not (Test-Path "frontend/node_modules")) {
    Write-Host "Installing frontend dependencies..." -ForegroundColor Blue
    Set-Location frontend
    npm install
    Set-Location ..
    Write-Host "✅ Frontend dependencies installed" -ForegroundColor Green
} else {
    Write-Host "✅ Frontend dependencies already installed" -ForegroundColor Green
}

# Build backend if needed
Write-Host "🔨 Checking backend build..." -ForegroundColor Yellow
if (-not (Test-Path "project/project/target/project-0.0.1-SNAPSHOT.jar")) {
    Write-Host "Building backend..." -ForegroundColor Blue
    Set-Location project/project
    mvn clean package -DskipTests -q
    Set-Location ../..
    Write-Host "✅ Backend built successfully" -ForegroundColor Green
} else {
    Write-Host "✅ Backend already built" -ForegroundColor Green
}

Write-Host ""
Write-Host "🚀 Starting Full Stack Application..." -ForegroundColor Green
Write-Host ""

# Create run commands
$frontendCommand = "cd frontend && npm run dev"
$backendCommand = "cd project/project && mvn spring-boot:run"

Write-Host "📋 Manual Instructions (if needed):" -ForegroundColor Yellow
Write-Host ""
Write-Host "Terminal 1 (Backend):" -ForegroundColor Blue
Write-Host "  cd project/project" -ForegroundColor Gray
Write-Host "  mvn spring-boot:run" -ForegroundColor Gray
Write-Host "  🌐 Backend URL: http://localhost:8081" -ForegroundColor Green
Write-Host ""
Write-Host "Terminal 2 (Frontend):" -ForegroundColor Cyan
Write-Host "  cd frontend" -ForegroundColor Gray
Write-Host "  npm run dev" -ForegroundColor Gray
Write-Host "  🌐 Frontend URL: http://localhost:3000" -ForegroundColor Green
Write-Host "  📡 API Proxy: Automatically proxies to backend" -ForegroundColor Yellow
Write-Host ""

# Option to run automatically
Write-Host "🎯 Auto-start options:" -ForegroundColor Yellow
Write-Host "1. Start Backend only" -ForegroundColor White
Write-Host "2. Start Frontend only" -ForegroundColor White
Write-Host "3. Show instructions only (current)" -ForegroundColor White
Write-Host "4. Exit" -ForegroundColor White
Write-Host ""

$choice = Read-Host "Choose option (1-4)"

switch ($choice) {
    "1" {
        Write-Host "🚀 Starting Backend (Spring Boot)..." -ForegroundColor Blue
        Write-Host "Access at: http://localhost:8081" -ForegroundColor Green
        Write-Host "Health check: http://localhost:8081/actuator/health" -ForegroundColor Yellow
        Write-Host ""
        Set-Location project/project
        mvn spring-boot:run
    }
    "2" {
        Write-Host "🚀 Starting Frontend (React + Vite)..." -ForegroundColor Cyan
        Write-Host "Access at: http://localhost:3000" -ForegroundColor Green
        Write-Host "Note: Backend must be running on port 8081 for API calls" -ForegroundColor Yellow
        Write-Host ""
        Set-Location frontend
        npm run dev
    }
    "3" {
        Write-Host "📋 Instructions displayed above. Run manually in separate terminals." -ForegroundColor Yellow
    }
    "4" {
        Write-Host "👋 Goodbye!" -ForegroundColor Green
        exit 0
    }
    default {
        Write-Host "📋 Invalid choice. Showing instructions only." -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "🎉 Development URLs:" -ForegroundColor Green
Write-Host "  🖥️ Backend API: http://localhost:8081" -ForegroundColor Blue
Write-Host "  🎨 Frontend App: http://localhost:3000" -ForegroundColor Cyan
Write-Host "  💚 Health Check: http://localhost:8081/actuator/health" -ForegroundColor Green
Write-Host ""
Write-Host "📚 Features Available:" -ForegroundColor Yellow
Write-Host "  🏠 Home - Features showcase" -ForegroundColor White
Write-Host "  🛍️ Products - Material-UI catalog with search" -ForegroundColor White
Write-Host "  💬 AI Chat - Real-time chatbot interface" -ForegroundColor White
Write-Host "  📦 Orders - Order management with details" -ForegroundColor White
Write-Host "  👔 Admin - Dashboard with analytics" -ForegroundColor White
Write-Host ""
Write-Host "Happy coding! 🚀✨" -ForegroundColor Green 