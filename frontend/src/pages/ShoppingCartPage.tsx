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

interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
  image: string
  category: string
  brand: string
  stockQuantity: number
}

const ShoppingCartPage: React.FC = () => {
  const navigate = useNavigate()
  
  // Mock cart items
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 1,
      name: 'Gaming Laptop Pro Max',
      price: 1299.99,
      quantity: 1,
      image: '/api/placeholder/150/150',
      category: 'Electronics',
      brand: 'TechBrand',
      stockQuantity: 15
    },
    {
      id: 2,
      name: 'Wireless Gaming Mouse Elite',
      price: 79.99,
      quantity: 2,
      image: '/api/placeholder/150/150',
      category: 'Gaming',
      brand: 'GameMaster',
      stockQuantity: 50
    },
    {
      id: 3,
      name: 'Premium Noise-Cancelling Headphones',
      price: 199.99,
      quantity: 1,
      image: '/api/placeholder/150/150',
      category: 'Audio',
      brand: 'SoundWave',
      stockQuantity: 30
    }
  ])

  const [promoCode, setPromoCode] = useState('')
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null)
  const [promoDiscount, setPromoDiscount] = useState(0)

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(id)
      return
    }
    
    setCartItems(prev => 
      prev.map(item => 
        item.id === id 
          ? { ...item, quantity: Math.min(newQuantity, item.stockQuantity) }
          : item
      )
    )
  }

  const removeItem = (id: number) => {
    setCartItems(prev => prev.filter(item => item.id !== id))
  }

  const applyPromoCode = () => {
    const validPromoCodes = {
      'SAVE10': 10,
      'WELCOME20': 20,
      'STUDENT15': 15,
      'TECH25': 25
    }
    
    if (validPromoCodes[promoCode as keyof typeof validPromoCodes]) {
      setAppliedPromo(promoCode)
      setPromoDiscount(validPromoCodes[promoCode as keyof typeof validPromoCodes])
      setPromoCode('')
    } else {
      alert('Invalid promo code. Try: SAVE10, WELCOME20, STUDENT15, or TECH25')
    }
  }

  const removePromoCode = () => {
    setAppliedPromo(null)
    setPromoDiscount(0)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  // Calculations
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const discountAmount = (subtotal * promoDiscount) / 100
  const shippingCost = subtotal > 50 ? 0 : 9.99
  const tax = (subtotal - discountAmount) * 0.08 // 8% tax
  const total = subtotal - discountAmount + shippingCost + tax

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  const handleCheckout = () => {
    // Here you would typically integrate with a payment processor
    console.log('Proceeding to checkout with:', { cartItems, total, appliedPromo })
    alert(`Checkout functionality would be implemented here. Total: ${formatPrice(total)}`)
  }

  if (cartItems.length === 0) {
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
        <Typography variant="body1" color="text.secondary">
          <Chip label={totalItems} color="primary" sx={{ mr: 1 }} />
          {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Cart Items */}
        <Grid item xs={12} md={8}>
          <Box sx={{ borderRadius: 3, overflow: 'hidden' }}>
            {cartItems.map((item, index) => (
              <Box key={item.id}>
                <Box sx={{ p: 3 }}>
                  <Grid container spacing={3} alignItems="center">
                    {/* Product Image */}
                    <Grid item xs={12} sm={3}>
                      <Box
                        component="img"
                        src={item.image}
                        alt={item.name}
                        sx={{ 
                          width: '100%',
                          height: 120,
                          objectFit: 'cover',
                          borderRadius: 2,
                          cursor: 'pointer'
                        }}
                        onClick={() => navigate(`/products/${item.id}`)}
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
                        onClick={() => navigate(`/products/${item.id}`)}
                      >
                        {item.name}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                        <Chip label={item.category} size="small" color="primary" variant="outlined" />
                        <Chip label={item.brand} size="small" color="secondary" variant="outlined" />
                      </Box>

                      <Typography variant="h6" color="primary" fontWeight="bold" gutterBottom>
                        {formatPrice(item.price)}
                      </Typography>

                      <Typography variant="body2" color="text.secondary">
                        {item.stockQuantity < 10 && (
                          <Chip 
                            label={`Only ${item.stockQuantity} left!`} 
                            size="small" 
                            color="warning" 
                            sx={{ mr: 1 }}
                          />
                        )}
                        In Stock: {item.stockQuantity}
                      </Typography>
                    </Grid>

                    {/* Quantity & Actions */}
                    <Grid item xs={12} sm={3}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 }}>
                        {/* Quantity Controls */}
                        <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: 2 }}>
                          <IconButton 
                            size="small" 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Remove fontSize="small" />
                          </IconButton>
                          
                          <TextField
                            size="small"
                            value={item.quantity}
                            onChange={(e) => {
                              const value = parseInt(e.target.value) || 1
                              updateQuantity(item.id, value)
                            }}
                            inputProps={{
                              min: 1,
                              max: item.stockQuantity,
                              style: { textAlign: 'center', width: '40px' }
                            }}
                            variant="outlined"
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                '& fieldset': { border: 'none' },
                              },
                            }}
                          />
                          
                          <IconButton 
                            size="small" 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity >= item.stockQuantity}
                          >
                            <Add fontSize="small" />
                          </IconButton>
                        </Box>

                        {/* Item Total */}
                        <Typography variant="h6" fontWeight="bold">
                          {formatPrice(item.price * item.quantity)}
                        </Typography>

                        {/* Actions */}
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <IconButton size="small" color="primary">
                            <FavoriteOutlined fontSize="small" />
                          </IconButton>
                          
                          <IconButton 
                            size="small" 
                            color="error"
                            onClick={() => removeItem(item.id)}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
                
                {index < cartItems.length - 1 && <Divider />}
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
              {appliedPromo ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chip
                    label={`${appliedPromo} (-${promoDiscount}%)`}
                    color="success"
                    onDelete={removePromoCode}
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
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                  <Button
                    variant="outlined"
                    onClick={applyPromoCode}
                    disabled={!promoCode}
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
                <Typography variant="body2">Subtotal ({totalItems} items)</Typography>
                <Typography variant="body2">{formatPrice(subtotal)}</Typography>
              </Box>

              {appliedPromo && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="success.main">
                    Discount ({appliedPromo})
                  </Typography>
                  <Typography variant="body2" color="success.main">
                    -{formatPrice(discountAmount)}
                  </Typography>
                </Box>
              )}

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">
                  Shipping
                  {subtotal > 50 && (
                    <Chip label="FREE" size="small" color="success" sx={{ ml: 1 }} />
                  )}
                </Typography>
                <Typography variant="body2">
                  {shippingCost === 0 ? 'FREE' : formatPrice(shippingCost)}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Tax</Typography>
                <Typography variant="body2">{formatPrice(tax)}</Typography>
              </Box>
            </Box>

            <Divider sx={{ mb: 2 }} />

            {/* Total */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6" fontWeight="bold">
                Total
              </Typography>
              <Typography variant="h6" fontWeight="bold" color="primary">
                {formatPrice(total)}
              </Typography>
            </Box>

            {/* Shipping Alert */}
            {subtotal < 50 && (
              <Alert 
                severity="info" 
                sx={{ mb: 3, borderRadius: 2 }}
                icon={<LocalShippingOutlined />}
              >
                Add {formatPrice(50 - subtotal)} more for FREE shipping!
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