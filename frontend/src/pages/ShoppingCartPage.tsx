import React, { useState } from 'react'
import {
  Box,
  Container,
  Typography,
  Button,
  IconButton,
  Grid,
  Divider,
  Chip,
  TextField,
  Alert,
  CircularProgress,
} from '@mui/material'
import {
  Add,
  Remove,
  Delete,
  FavoriteOutlined,
  ShareOutlined,
  ShoppingBag,
  PaymentOutlined,
  SecurityOutlined,
  LocalShippingOutlined,
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import notificationService from '../services/notificationService'

const ShoppingCartPage: React.FC = () => {
  const navigate = useNavigate()
  const { 
    cart, 
    cartLoading, 
    updateCartItem, 
    removeFromCart, 
    clearCart,
    applyPromoCode,
    removePromoCode 
  } = useCart()
  
  const [promoCode, setPromoCode] = useState('')

  const updateQuantity = async (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      await handleRemoveItem(productId)
      return
    }
    
    try {
      const success = await updateCartItem(productId, newQuantity)
      if (!success) {
        notificationService.error('Failed to update cart item')
      }
    } catch (error) {
      notificationService.error('Failed to update cart item')
    }
  }

  const handleRemoveItem = async (productId: number) => {
    try {
      const success = await removeFromCart(productId)
      if (success) {
        notificationService.success('Product removed from cart')
      } else {
        notificationService.error('Failed to remove product from cart')
      }
    } catch (error) {
      notificationService.error('Failed to remove product from cart')
    }
  }

  const handleApplyPromoCode = async () => {
    if (!promoCode.trim()) {
      notificationService.error('Please enter a promo code')
      return
    }

    try {
      const success = await applyPromoCode(promoCode.toUpperCase())
      if (success) {
        setPromoCode('')
        notificationService.success('Promo code applied successfully')
      } else {
        notificationService.error('Invalid promo code. Try: SAVE10, WELCOME20, STUDENT15, or TECH25')
      }
    } catch (error) {
      notificationService.error('Failed to apply promo code')
    }
  }

  const handleRemovePromoCode = async () => {
    try {
      const success = await removePromoCode()
      if (success) {
        notificationService.success('Promo code removed')
      }
    } catch (error) {
      notificationService.error('Failed to remove promo code')
    }
  }

  const handleClearCart = async () => {
    try {
      const success = await clearCart()
      if (success) {
        notificationService.success('Cart cleared')
      }
    } catch (error) {
      notificationService.error('Failed to clear cart')
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  const handleCheckout = () => {
    if (!cart || cart.items.length === 0) {
      notificationService.error('Your cart is empty')
      return
    }
    
    // Navigate to checkout or implement checkout logic
    console.log('Proceeding to checkout with:', cart)
    navigate('/checkout')
  }

  // Show loading state
  if (cartLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading cart...
        </Typography>
      </Container>
    )
  }

  // Show empty cart
  if (!cart || cart.items.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ textAlign: 'center', borderRadius: 3, p: 8 }}>
          <ShoppingBag sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h4" gutterBottom fontWeight="bold">
            Your cart is empty
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Looks like you haven't added any items to your cart yet.
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={<ShoppingBag />}
            onClick={() => navigate('/products')}
            sx={{ borderRadius: 3, px: 4 }}
          >
            Continue Shopping
          </Button>
        </Box>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
          Shopping Cart
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Chip label={cart.totalItems} color="primary" size="small" />
          <Typography variant="body1" color="text.secondary">
            {cart.totalItems} {cart.totalItems === 1 ? 'item' : 'items'} in your cart
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={4}>
        {/* Cart Items */}
        <Grid item xs={12} md={8}>
          <Box sx={{ borderRadius: 3, overflow: 'hidden' }}>
            {cart.items.map((item, index) => (
              <Box key={item.productId}>
                <Box sx={{ p: 3 }}>
                  <Grid container spacing={3} alignItems="center">
                    {/* Product Image */}
                    <Grid item xs={12} sm={3}>
                      <Box
                        component="img"
                        src={item.productImage || '/api/placeholder/120/120'}
                        alt={item.productName}
                        sx={{ 
                          width: '100%',
                          height: 120,
                          objectFit: 'cover',
                          borderRadius: 2,
                          cursor: 'pointer'
                        }}
                        onClick={() => navigate(`/products/${item.productId}`)}
                      />
                    </Grid>

                    {/* Product Details */}
                    <Grid item xs={12} sm={6}>
                      <Typography 
                        variant="h6" 
                        gutterBottom 
                        sx={{ 
                          cursor: 'pointer',
                          '&:hover': { color: 'primary.main' }
                        }}
                        onClick={() => navigate(`/products/${item.productId}`)}
                      >
                        {item.productName}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                        <Chip label={item.categoryName || 'General'} size="small" color="primary" variant="outlined" />
                        <Chip label={item.brandName || 'Generic'} size="small" color="secondary" variant="outlined" />
                      </Box>

                      <Typography variant="h6" color="primary" fontWeight="bold" gutterBottom>
                        {formatPrice(item.productPrice)}
                      </Typography>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                        {item.stockQuantity && item.stockQuantity < 10 && (
                          <Chip 
                            label={`Only ${item.stockQuantity} left!`} 
                            size="small" 
                            color="warning" 
                            variant="filled"
                          />
                        )}
                        <Typography variant="body2" color="text.secondary">
                          In Stock: {item.stockQuantity || 'N/A'}
                        </Typography>
                      </Box>
                    </Grid>

                    {/* Quantity & Actions */}
                    <Grid item xs={12} sm={3}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 }}>
                        {/* Quantity Controls */}
                        <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: 2 }}>
                          <IconButton 
                            size="small" 
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            disabled={item.quantity <= 1 || cartLoading}
                          >
                            <Remove fontSize="small" />
                          </IconButton>
                          
                          <TextField
                            size="small"
                            value={item.quantity}
                            onChange={(e) => {
                              const value = parseInt(e.target.value) || 1
                              updateQuantity(item.productId, value)
                            }}
                            inputProps={{
                              min: 1,
                              max: item.stockQuantity,
                              style: { textAlign: 'center', width: '40px' }
                            }}
                            variant="outlined"
                            disabled={cartLoading}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                '& fieldset': { border: 'none' },
                              },
                            }}
                          />
                          
                          <IconButton 
                            size="small" 
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            disabled={item.stockQuantity && item.quantity >= item.stockQuantity || cartLoading}
                          >
                            <Add fontSize="small" />
                          </IconButton>
                        </Box>

                        {/* Item Total */}
                        <Typography variant="h6" fontWeight="bold">
                          {formatPrice(item.subtotal)}
                        </Typography>

                        {/* Actions */}
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <IconButton size="small" color="primary">
                            <FavoriteOutlined fontSize="small" />
                          </IconButton>
                          
                          <IconButton 
                            size="small" 
                            color="error"
                            onClick={() => handleRemoveItem(item.productId)}
                            disabled={cartLoading}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
                
                {index < cart.items.length - 1 && <Divider />}
              </Box>
            ))}
          </Box>

          {/* Continue Shopping */}
          <Box sx={{ mt: 3 }}>
            <Button
              variant="outlined"
              startIcon={<ShoppingBag />}
              onClick={() => navigate('/products')}
              sx={{ borderRadius: 2 }}
            >
              Continue Shopping
            </Button>
          </Box>
        </Grid>

        {/* Order Summary */}
        <Grid item xs={12} md={4}>
          <Box sx={{ p: 3, borderRadius: 3, position: 'sticky', top: 100 }}>
            <Typography variant="h5" gutterBottom fontWeight="bold">
              Order Summary
            </Typography>

            {/* Promo Code */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" gutterBottom fontWeight="bold">
                Promo Code
              </Typography>
              {cart.promoCode ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chip
                    label={`${cart.promoCode} (Applied)`}
                    color="success"
                    onDelete={handleRemovePromoCode}
                    icon={<ShareOutlined />}
                  />
                </Box>
              ) : (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Enter promo code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    disabled={cartLoading}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                  <Button
                    variant="outlined"
                    onClick={handleApplyPromoCode}
                    disabled={!promoCode || cartLoading}
                    sx={{ borderRadius: 2, minWidth: 'auto', px: 2 }}
                  >
                    Apply
                  </Button>
                </Box>
              )}
            </Box>

            <Divider sx={{ mb: 2 }} />

            {/* Price Breakdown */}
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Subtotal ({cart.totalItems} items)</Typography>
                <Typography variant="body2">{formatPrice(cart.subtotal)}</Typography>
              </Box>

              {cart.promoCode && cart.discountAmount > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="success.main">
                    Discount ({cart.promoCode})
                  </Typography>
                  <Typography variant="body2" color="success.main">
                    -{formatPrice(cart.discountAmount)}
                  </Typography>
                </Box>
              )}

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">
                  Shipping
                  {cart.shippingAmount === 0 && (
                    <Chip label="FREE" size="small" color="success" sx={{ ml: 1 }} />
                  )}
                </Typography>
                <Typography variant="body2">
                  {cart.shippingAmount === 0 ? 'FREE' : formatPrice(cart.shippingAmount)}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Tax</Typography>
                <Typography variant="body2">{formatPrice(cart.taxAmount)}</Typography>
              </Box>
            </Box>

            <Divider sx={{ mb: 2 }} />

            {/* Total */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6" fontWeight="bold">
                Total
              </Typography>
              <Typography variant="h6" fontWeight="bold" color="primary">
                {formatPrice(cart.totalAmount)}
              </Typography>
            </Box>

            
            {cart.subtotal < 50 && (
              <Alert 
                severity="info" 
                sx={{ mb: 3, borderRadius: 2 }}
                icon={<LocalShippingOutlined />}
              >
                Add {formatPrice(50 - cart.subtotal)} more for FREE shipping!
              </Alert>
            )}

            {/* Checkout Button */}
            <Button
              fullWidth
              variant="contained"
              size="large"
              startIcon={<PaymentOutlined />}
              onClick={handleCheckout}
              sx={{ 
                borderRadius: 3,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                mb: 2
              }}
            >
              Proceed to Checkout
            </Button>

            {/* Security Info */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
              <SecurityOutlined sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary">
                Secure 256-bit SSL encryption
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Container>
  )
}

export default ShoppingCartPage 