export type NotificationType = 'success' | 'error' | 'warning' | 'info'

interface NotificationOptions {
  duration?: number
}

class NotificationService {
  // Loading state management
  private loadingStates = new Map<string, boolean>()
  private loadingCallbacks = new Map<string, (() => void)[]>()

  // Simple notification method using browser notification or console
  success(message: string, _options?: NotificationOptions) {
    console.log('✅ Success:', message)
    // Here you would integrate with your notification library
  }

  error(message: string, _options?: NotificationOptions) {
    console.error('❌ Error:', message)
    // Here you would integrate with your notification library
  }

  warning(message: string, _options?: NotificationOptions) {
    console.warn('⚠️ Warning:', message)
    // Here you would integrate with your notification library
  }

  info(message: string, _options?: NotificationOptions) {
    console.info('ℹ️ Info:', message)
    // Here you would integrate with your notification library
  }

  private showToast(message: string, type: NotificationType) {
    // Create a simple toast element
    const toast = document.createElement('div')
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 12px 24px;
      border-radius: 4px;
      color: white;
      font-family: Arial, sans-serif;
      font-size: 14px;
      z-index: 9999;
      max-width: 400px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      animation: slideIn 0.3s ease-out;
    `

    // Set background color based on type
    const colors = {
      success: '#4caf50',
      error: '#f44336',
      warning: '#ff9800',
      info: '#2196f3'
    }
    toast.style.backgroundColor = colors[type]

    toast.textContent = message
    document.body.appendChild(toast)

    // Add CSS animation
    if (!document.getElementById('toast-styles')) {
      const style = document.createElement('style')
      style.id = 'toast-styles'
      style.textContent = `
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(100%); opacity: 0; }
        }
      `
      document.head.appendChild(style)
    }

    // Auto remove after 5 seconds
    setTimeout(() => {
      toast.style.animation = 'slideOut 0.3s ease-in'
      setTimeout(() => {
        if (document.body.contains(toast)) {
          document.body.removeChild(toast)
        }
      }, 300)
    }, 5000)
  }

  setLoading(key: string, isLoading: boolean) {
    this.loadingStates.set(key, isLoading)
    
    // Notify all callbacks for this key
    const callbacks = this.loadingCallbacks.get(key) || []
    callbacks.forEach(callback => callback())
  }

  isLoading(key: string): boolean {
    return this.loadingStates.get(key) || false
  }

  onLoadingChange(key: string, callback: () => void) {
    if (!this.loadingCallbacks.has(key)) {
      this.loadingCallbacks.set(key, [])
    }
    this.loadingCallbacks.get(key)?.push(callback)

    // Return cleanup function
    return () => {
      const callbacks = this.loadingCallbacks.get(key) || []
      const index = callbacks.indexOf(callback)
      if (index > -1) {
        callbacks.splice(index, 1)
      }
    }
  }

  // Utility methods for common operations
  async handleAsyncOperation<T>(
    operation: () => Promise<T>,
    loadingKey: string,
    successMessage?: string,
    errorMessage?: string
  ): Promise<T | null> {
    try {
      this.setLoading(loadingKey, true)
      const result = await operation()
      
      if (successMessage) {
        this.success(successMessage)
      }
      
      return result
    } catch (error: any) {
      const message = errorMessage || error.message || 'An error occurred'
      this.error(message)
      return null
    } finally {
      this.setLoading(loadingKey, false)
    }
  }
}

// Export singleton instance
export const notificationService = new NotificationService()
export default notificationService 