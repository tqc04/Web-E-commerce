import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { apiService } from '../services/api'

// Cart Item interface
export interface CartItem {
  productId: number
  productName: string
  productSku: string
  productPrice: number
  quantity: number
  subtotal: number
  productImage?: string
  categoryName?: string
  brandName?: string
  stockQuantity?: number
  isActive?: boolean
}

// Cart interface
export interface Cart {
  userId?: number
  sessionId?: string
  items: CartItem[]
  totalItems: number
  subtotal: number
  taxAmount: number
  shippingAmount: number
  discountAmount: number
  totalAmount: number
  promoCode?: string
  createdAt: string
  updatedAt: string
}

// Cart Context Type
interface CartContextType {
  cart: Cart | null
  cartLoading: boolean
  addToCart: (productId: number, quantity?: number) => Promise<boolean>
  removeFromCart: (productId: number) => Promise<boolean>
  updateCartItem: (productId: number, quantity: number) => Promise<boolean>
  clearCart: () => Promise<boolean>
  applyPromoCode: (promoCode: string) => Promise<boolean>
  removePromoCode: () => Promise<boolean>
  getCartCount: () => number
  refreshCart: () => Promise<void>
  mergeGuestCart: (userId: number) => Promise<boolean>
}

// Create context
const CartContext = createContext<CartContextType | undefined>(undefined)

// Hook to use cart context
export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

// Cart Provider Props
interface CartProviderProps {
  children: ReactNode
  userId?: number // Optional for authenticated users
}

// Cart Provider Component
export const CartProvider: React.FC<CartProviderProps> = ({ children, userId }) => {
  const [cart, setCart] = useState<Cart | null>(null)
  const [cartLoading, setCartLoading] = useState(false)

  // Load cart on component mount and when userId changes
  useEffect(() => {
    loadCart()
  }, [userId])

  // Load cart from backend
  const loadCart = async () => {
    try {
      setCartLoading(true)
      const response = await apiService.getCart(userId)
      if (response.success) {
        setCart(response.data)
      }
    } catch (error) {
      console.error('Failed to load cart:', error)
      // Initialize empty cart on error
      setCart({
        items: [],
        totalItems: 0,
        subtotal: 0,
        taxAmount: 0,
        shippingAmount: 0,
        discountAmount: 0,
        totalAmount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
    } finally {
      setCartLoading(false)
    }
  }

  // Add product to cart
  const addToCart = async (productId: number, quantity: number = 1): Promise<boolean> => {
    try {
      setCartLoading(true)
      const response = await apiService.addToCart(productId, quantity, userId)
      if (response.success) {
        setCart(response.data)
        return true
      }
      return false
    } catch (error) {
      console.error('Failed to add to cart:', error)
      return false
    } finally {
      setCartLoading(false)
    }
  }

  // Remove product from cart
  const removeFromCart = async (productId: number): Promise<boolean> => {
    try {
      setCartLoading(true)
      const response = await apiService.removeFromCart(productId, userId)
      if (response.success) {
        setCart(response.data)
        return true
      }
      return false
    } catch (error) {
      console.error('Failed to remove from cart:', error)
      return false
    } finally {
      setCartLoading(false)
    }
  }

  // Update cart item quantity
  const updateCartItem = async (productId: number, quantity: number): Promise<boolean> => {
    try {
      setCartLoading(true)
      const response = await apiService.updateCartItem(productId, quantity, userId)
      if (response.success) {
        setCart(response.data)
        return true
      }
      return false
    } catch (error) {
      console.error('Failed to update cart item:', error)
      return false
    } finally {
      setCartLoading(false)
    }
  }

  // Clear entire cart
  const clearCart = async (): Promise<boolean> => {
    try {
      setCartLoading(true)
      const response = await apiService.clearCart(userId)
      if (response.success) {
        setCart(response.data)
        return true
      }
      return false
    } catch (error) {
      console.error('Failed to clear cart:', error)
      return false
    } finally {
      setCartLoading(false)
    }
  }

  // Apply promo code
  const applyPromoCode = async (promoCode: string): Promise<boolean> => {
    try {
      setCartLoading(true)
      const response = await apiService.applyPromoCode(promoCode, userId)
      if (response.success) {
        setCart(response.data)
        return true
      }
      return false
    } catch (error) {
      console.error('Failed to apply promo code:', error)
      return false
    } finally {
      setCartLoading(false)
    }
  }

  // Remove promo code
  const removePromoCode = async (): Promise<boolean> => {
    try {
      setCartLoading(true)
      const response = await apiService.removePromoCode(userId)
      if (response.success) {
        setCart(response.data)
        return true
      }
      return false
    } catch (error) {
      console.error('Failed to remove promo code:', error)
      return false
    } finally {
      setCartLoading(false)
    }
  }

  // Get cart item count
  const getCartCount = (): number => {
    return cart?.totalItems || 0
  }

  // Refresh cart
  const refreshCart = async (): Promise<void> => {
    await loadCart()
  }

  // Merge guest cart with user cart after login
  const mergeGuestCart = async (userId: number): Promise<boolean> => {
    try {
      setCartLoading(true)
      const response = await apiService.mergeGuestCart(userId)
      if (response.success) {
        setCart(response.data)
        return true
      }
      return false
    } catch (error) {
      console.error('Failed to merge guest cart:', error)
      return false
    } finally {
      setCartLoading(false)
    }
  }

  const value: CartContextType = {
    cart,
    cartLoading,
    addToCart,
    removeFromCart,
    updateCartItem,
    clearCart,
    applyPromoCode,
    removePromoCode,
    getCartCount,
    refreshCart,
    mergeGuestCart
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

export default CartContext 