# AI E-commerce Platform - Integrated Build & Run Script
# This script builds and runs the Spring Boot application with integrated frontend

Write-Host "🚀 AI E-commerce Platform - Integrated Build & Run" -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Green

# Check if Maven is installed
$mvnVersion = mvn --version 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Maven is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Maven and try again" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Maven detected: $($mvnVersion.Split("`n")[0])" -ForegroundColor Green

# Change to project directory
$projectDir = "project"
if (Test-Path $projectDir) {
    Set-Location $projectDir
    Write-Host "📁 Changed to project directory" -ForegroundColor Green
} else {
    Write-Host "❌ Project directory not found" -ForegroundColor Red
    exit 1
}

# Clean previous build
Write-Host "🧹 Cleaning previous build..." -ForegroundColor Yellow
mvn clean
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Clean failed" -ForegroundColor Red
    exit 1
}

# Compile the project
Write-Host "🔨 Compiling project..." -ForegroundColor Yellow
mvn compile
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Compilation failed" -ForegroundColor Red
    exit 1
}

# Package the application
Write-Host "📦 Packaging application..." -ForegroundColor Yellow
mvn package -DskipTests
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Packaging failed" -ForegroundColor Red
    exit 1
}

# Check if jar file exists
$jarFile = "target/project-0.0.1-SNAPSHOT.jar"
if (Test-Path $jarFile) {
    Write-Host "✅ JAR file created successfully" -ForegroundColor Green
} else {
    Write-Host "❌ JAR file not found" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🌟 BUILD SUCCESSFUL!" -ForegroundColor Green
Write-Host "Frontend files are integrated in src/main/resources/static/" -ForegroundColor Green
Write-Host ""
Write-Host "🚀 Starting Spring Boot application..." -ForegroundColor Yellow
Write-Host "Server will start on: http://localhost:8081" -ForegroundColor Cyan
Write-Host "Frontend will be accessible at: http://localhost:8081" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

# Start the application
java -jar $jarFile 