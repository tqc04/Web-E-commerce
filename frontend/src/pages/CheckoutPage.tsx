import React, { useState, useEffect } from 'react'
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  TextField,
  Button,
  Divider,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Stepper,
  Step,
  StepLabel,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
} from '@mui/material'
import {
  ShoppingCart,
  Payment,
  LocalShipping,
  CheckCircle,
  CreditCard,
  AccountBalance,
  Money,
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import { apiService } from '../services/api'
import notificationService from '../services/notificationService'

const steps = ['Review Cart', 'Shipping Address', 'Payment Method', 'Confirmation']

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate()
  const { cart, cartLoading, clearCart } = useCart()
  const { user, isAuthenticated } = useAuth()
  
  const [activeStep, setActiveStep] = useState(0)
  const [loading, setLoading] = useState(false)
  
  // Form states
  const [shippingAddress, setShippingAddress] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States'
  })
  
  const [billingAddress, setBillingAddress] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States'
  })
  
  const [paymentMethod, setPaymentMethod] = useState('credit_card')
  const [sameAsBilling, setSameAsBilling] = useState(true)
  const [orderNumber, setOrderNumber] = useState<string | null>(null)

  // Redirect if cart is empty
  useEffect(() => {
    if (!cartLoading && (!cart || cart.items.length === 0)) {
      navigate('/cart')
      notificationService.error('Your cart is empty')
    }
  }, [cart, cartLoading, navigate])

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      notificationService.error('Please login to continue checkout')
    }
  }, [isAuthenticated, navigate])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      handlePlaceOrder()
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1)
    }
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  const handlePlaceOrder = async () => {
    if (!cart || !user) {
      notificationService.error('Unable to place order')
      return
    }

    try {
      setLoading(true)
      
      // Prepare order data
      const orderData = {
        userId: user.id,
        items: cart.items.map(item => ({
          productId: item.productId,
          quantity: item.quantity
        })),
        shippingAddress: `${shippingAddress.firstName} ${shippingAddress.lastName}\n${shippingAddress.address}\n${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.zipCode}\n${shippingAddress.country}`,
        billingAddress: sameAsBilling 
          ? `${shippingAddress.firstName} ${shippingAddress.lastName}\n${shippingAddress.address}\n${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.zipCode}\n${shippingAddress.country}`
          : `${billingAddress.firstName} ${billingAddress.lastName}\n${billingAddress.address}\n${billingAddress.city}, ${billingAddress.state} ${billingAddress.zipCode}\n${billingAddress.country}`,
        paymentMethod: paymentMethod
      }

      const response = await apiService.createOrder(orderData)
      
      if (response.success) {
        setOrderNumber(response.data.orderNumber)
        setActiveStep(steps.length)
        await clearCart()
        notificationService.success('Order placed successfully!')
      } else {
        notificationService.error('Failed to place order')
      }
    } catch (error) {
      console.error('Order creation failed:', error)
      notificationService.error('Failed to place order')
    } finally {
      setLoading(false)
    }
  }

  const isStepValid = (step: number) => {
    switch (step) {
      case 0:
        return cart && cart.items.length > 0
      case 1:
        return shippingAddress.firstName && shippingAddress.lastName && 
               shippingAddress.email && shippingAddress.address && 
               shippingAddress.city && shippingAddress.state && shippingAddress.zipCode
      case 2:
        return paymentMethod !== ''
      default:
        return true
    }
  }

  // Show loading state
  if (cartLoading || !cart) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading checkout...
        </Typography>
      </Container>
    )
  }

  // Order confirmation step
  if (activeStep === steps.length) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
          <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
          <Typography variant="h4" gutterBottom fontWeight="bold">
            Order Confirmed!
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
            Order Number: {orderNumber}
          </Typography>
          <Typography variant="body1" sx={{ mb: 4 }}>
            Thank you for your order! We'll send you a confirmation email shortly.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              variant="contained"
              onClick={() => navigate('/orders')}
              sx={{ borderRadius: 2 }}
            >
              View Orders
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/products')}
              sx={{ borderRadius: 2 }}
            >
              Continue Shopping
            </Button>
          </Box>
        </Paper>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
        Checkout
      </Typography>

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Grid container spacing={4}>
        {/* Main Content */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            {/* Step 0: Review Cart */}
            {activeStep === 0 && (
              <Box>
                <Typography variant="h5" gutterBottom fontWeight="bold">
                  Review Your Order
                </Typography>
                
                <List>
                  {cart.items.map((item) => (
                    <ListItem key={item.productId} sx={{ py: 2 }}>
                      <ListItemAvatar>
                        <Avatar
                          src={item.productImage || '/api/placeholder/60/60'}
                          alt={item.productName}
                          sx={{ width: 60, height: 60 }}
                        />
                      </ListItemAvatar>
                      <ListItemText
                        primary={item.productName}
                        secondary={`Quantity: ${item.quantity} × ${formatPrice(item.productPrice)}`}
                        sx={{ ml: 2 }}
                      />
                      <Typography variant="h6" fontWeight="bold">
                        {formatPrice(item.subtotal)}
                      </Typography>
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}

            {/* Step 1: Shipping Address */}
            {activeStep === 1 && (
              <Box>
                <Typography variant="h5" gutterBottom fontWeight="bold">
                  Shipping Address
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="First Name"
                      value={shippingAddress.firstName}
                      onChange={(e) => setShippingAddress({...shippingAddress, firstName: e.target.value})}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Last Name"
                      value={shippingAddress.lastName}
                      onChange={(e) => setShippingAddress({...shippingAddress, lastName: e.target.value})}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Email"
                      type="email"
                      value={shippingAddress.email}
                      onChange={(e) => setShippingAddress({...shippingAddress, email: e.target.value})}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      value={shippingAddress.phone}
                      onChange={(e) => setShippingAddress({...shippingAddress, phone: e.target.value})}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Address"
                      value={shippingAddress.address}
                      onChange={(e) => setShippingAddress({...shippingAddress, address: e.target.value})}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="City"
                      value={shippingAddress.city}
                      onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      fullWidth
                      label="State"
                      value={shippingAddress.state}
                      onChange={(e) => setShippingAddress({...shippingAddress, state: e.target.value})}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      fullWidth
                      label="ZIP Code"
                      value={shippingAddress.zipCode}
                      onChange={(e) => setShippingAddress({...shippingAddress, zipCode: e.target.value})}
                      required
                    />
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* Step 2: Payment Method */}
            {activeStep === 2 && (
              <Box>
                <Typography variant="h5" gutterBottom fontWeight="bold">
                  Payment Method
                </Typography>
                
                <FormControl component="fieldset">
                  <FormLabel component="legend">Select Payment Method</FormLabel>
                  <RadioGroup
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    <FormControlLabel
                      value="credit_card"
                      control={<Radio />}
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CreditCard />
                          Credit Card
                        </Box>
                      }
                    />
                    <FormControlLabel
                      value="bank_transfer"
                      control={<Radio />}
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <AccountBalance />
                          Bank Transfer
                        </Box>
                      }
                    />
                    <FormControlLabel
                      value="cash_on_delivery"
                      control={<Radio />}
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Money />
                          Cash on Delivery
                        </Box>
                      }
                    />
                  </RadioGroup>
                </FormControl>

                {paymentMethod === 'credit_card' && (
                  <Alert severity="info" sx={{ mt: 2 }}>
                    Credit card payment will be processed securely. This is a demo - no real payment will be charged.
                  </Alert>
                )}
              </Box>
            )}

            {/* Navigation Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ borderRadius: 2 }}
              >
                Back
              </Button>
              
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={!isStepValid(activeStep) || loading}
                sx={{ borderRadius: 2 }}
              >
                {loading ? (
                  <CircularProgress size={24} sx={{ mr: 1 }} />
                ) : null}
                {activeStep === steps.length - 1 ? 'Place Order' : 'Next'}
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Order Summary Sidebar */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 3, position: 'sticky', top: 100 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Order Summary
            </Typography>

            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Subtotal ({cart.totalItems} items)</Typography>
                <Typography variant="body2">{formatPrice(cart.subtotal)}</Typography>
              </Box>

              {cart.discountAmount > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="success.main">
                    Discount {cart.promoCode && `(${cart.promoCode})`}
                  </Typography>
                  <Typography variant="body2" color="success.main">
                    -{formatPrice(cart.discountAmount)}
                  </Typography>
                </Box>
              )}

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Shipping</Typography>
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

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6" fontWeight="bold">
                Total
              </Typography>
              <Typography variant="h6" fontWeight="bold" color="primary">
                {formatPrice(cart.totalAmount)}
              </Typography>
            </Box>

            <Alert severity="success" icon={<LocalShipping />} sx={{ borderRadius: 2 }}>
              {cart.shippingAmount === 0 ? 'Free shipping included!' : 'Shipping calculated at checkout'}
            </Alert>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  )
}

export default CheckoutPage 