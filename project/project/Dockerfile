# Multi-stage build for E-commerce AI Platform
# Supports both Maven and Gradle builds

ARG BUILD_TOOL=maven

# ========================================
# Stage 1: Build with Maven
# ========================================
FROM maven:3.9.6-openjdk-17-slim AS maven-build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline -B
COPY src ./src
RUN mvn clean package -DskipTests -B


# ========================================
# Stage 3: Runtime Selection
# ========================================

FROM gradle-build AS build-gradle

# ========================================
# Stage 4: Final Runtime Image
# ========================================
FROM openjdk:17-jre-slim AS runtime

LABEL maintainer="E-commerce AI Team"
LABEL description="E-commerce platform with AI integration"
LABEL version="1.0.0"

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    wget \
    && rm -rf /var/lib/apt/lists/*

# Create app user
RUN groupadd -r appuser && useradd -r -g appuser appuser

# Set working directory
WORKDIR /app

# Copy application jar based on build tool
ARG BUILD_TOOL
COPY --from=build-${BUILD_TOOL} /app/target/*.jar app.jar 2>/dev/null || \
     COPY --from=build-${BUILD_TOOL} /app/build/libs/*.jar app.jar

# Create directories for logs and uploads
RUN mkdir -p /app/logs /app/uploads && \
    chown -R appuser:appuser /app

# Switch to non-root user
USER appuser

# Expose application port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:8080/actuator/health || exit 1

# JVM optimization
ENV JAVA_OPTS="-Xms512m -Xmx2g -XX:+UseG1GC -XX:MaxGCPauseMillis=200 -XX:+UnlockExperimentalVMOptions -XX:+UseContainerSupport"

# Application configuration
ENV SPRING_PROFILES_ACTIVE=docker
ENV TZ=Asia/Ho_Chi_Minh

# Run the application
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"] 