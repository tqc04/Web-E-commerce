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
  Select,
  MenuItem,
  InputLabel,
  FormHelperText,
  Autocomplete,
  Chip,
} from '@mui/material'
import {
  ShoppingCart,
  Payment,
  LocalShipping,
  CheckCircle,
  CreditCard,
  AccountBalance,
  Money,
  LocationOn,
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import { apiService } from '../services/api'
import notificationService from '../services/notificationService'

const steps = ['Review Cart', 'Shipping Address', 'Payment Method', 'Confirmation']

interface Province {
  provinceID: number
  provinceName: string
  code: string
}

interface Commune {
  wardCode: string
  wardName: string
  districtID: number
  code: string
}

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate()
  const { cart, cartLoading, clearCart } = useCart()
  const { user, isAuthenticated } = useAuth()
  
  const [activeStep, setActiveStep] = useState(0)
  const [loading, setLoading] = useState(false)
  
  // Shipping data
  const [provinces, setProvinces] = useState<Province[]>([])
  const [communes, setCommunes] = useState<Commune[]>([])
  const [shippingFee, setShippingFee] = useState(30000) // Default 30,000 VND
  
  // Search states
  const [provinceSearchTerm, setProvinceSearchTerm] = useState('')
  const [communeSearchTerm, setCommuneSearchTerm] = useState('')
  const [filteredProvinces, setFilteredProvinces] = useState<Province[]>([])
  const [filteredCommunes, setFilteredCommunes] = useState<Commune[]>([])
  
  // Form states
  const [shippingAddress, setShippingAddress] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    provinceId: null as string | null,
    communeCode: null as string | null,
    provinceName: '',
    communeName: ''
  })
  
  const [billingAddress, setBillingAddress] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    provinceId: null as string | null,
    communeCode: null as string | null,
    provinceName: '',
    communeName: ''
  })
  
  const [paymentMethod, setPaymentMethod] = useState('credit_card')
  const [sameAsBilling, setSameAsBilling] = useState(true)
  const [orderNumber, setOrderNumber] = useState<string | null>(null)

  // Load provinces on component mount
  useEffect(() => {
    loadProvinces()
  }, [])

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

  // Update form when user data is loaded
  useEffect(() => {
    if (user) {
      setShippingAddress(prev => ({
        ...prev,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || ''
      }))
      setBillingAddress(prev => ({
        ...prev,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || ''
      }))
    }
  }, [user])

  const loadProvinces = async () => {
    try {
      const response = await fetch('http://localhost:8081/api/shipping/provinces')
      if (response.ok) {
        const data = await response.json()
        console.log('Loaded provinces:', data)
        setProvinces(data)
        setFilteredProvinces(data)
      } else {
        console.error('Failed to load provinces:', response.status)
      }
    } catch (error) {
      console.error('Error loading provinces:', error)
    }
  }

  const searchProvinces = async (searchTerm: string) => {
    try {
      const response = await fetch(`http://localhost:8081/api/shipping/provinces/search?q=${encodeURIComponent(searchTerm)}`)
      if (response.ok) {
        const data = await response.json()
        setFilteredProvinces(data)
      } else {
        // Fallback to client-side filtering
        const filtered = provinces.filter(province => 
          province.provinceName.toLowerCase().includes(searchTerm.toLowerCase())
        )
        setFilteredProvinces(filtered)
      }
    } catch (error) {
      console.error('Error searching provinces:', error)
      // Fallback to client-side filtering
      const filtered = provinces.filter(province => 
        province.provinceName.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredProvinces(filtered)
    }
  }

  const loadCommunes = async (provinceCode: string) => {
    try {
      const response = await fetch(`http://localhost:8081/api/shipping/provinces/${provinceCode}/communes`)
      if (response.ok) {
        const data = await response.json()
        console.log('Loaded communes:', data)
        console.log('First commune structure:', data[0])
        console.log('Communes count:', data.length)
        setCommunes(data)
        setFilteredCommunes(data)
      } else {
        console.error('Failed to load communes:', response.status)
      }
    } catch (error) {
      console.error('Error loading communes:', error)
    }
  }

  const searchCommunes = async (searchTerm: string) => {
    if (!shippingAddress.provinceId || shippingAddress.provinceId === '') return
    
    const province = provinces.find(p => p.provinceID.toString() === shippingAddress.provinceId)
    if (!province) return
    
    try {
      const response = await fetch(`http://localhost:8081/api/shipping/provinces/${province.code}/communes/search?q=${encodeURIComponent(searchTerm)}`)
      if (response.ok) {
        const data = await response.json()
        setFilteredCommunes(data)
      } else {
        // Fallback to client-side filtering
        const filtered = communes.filter(commune => 
          commune.wardName.toLowerCase().includes(searchTerm.toLowerCase())
        )
        setFilteredCommunes(filtered)
      }
    } catch (error) {
      console.error('Error searching communes:', error)
      // Fallback to client-side filtering
      const filtered = communes.filter(commune => 
        commune.wardName.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredCommunes(filtered)
    }
  }

  const calculateShippingFee = async () => {
    if (!shippingAddress.provinceId || !shippingAddress.communeCode) {
      return
    }

    try {
      const requestBody = {
        toDistrictId: parseInt(shippingAddress.provinceId), // Use provinceId as districtId for compatibility
        toWardCode: shippingAddress.communeCode,
        insuranceValue: cart ? Math.round(cart.subtotal * 1000) : 0, // Convert to VND
        weight: 500 // Default 500g
      }
      
      console.log('Calculating shipping fee with:', requestBody)
      
      const response = await fetch('http://localhost:8081/api/shipping/calculate-fee', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      })

      if (response.ok) {
        const data = await response.json()
        console.log('Shipping fee calculated:', data)
        setShippingFee(data.shippingFee)
      } else {
        console.error('Failed to calculate shipping fee:', response.status)
        const errorData = await response.json()
        console.error('Error details:', errorData)
      }
    } catch (error) {
      console.error('Error calculating shipping fee:', error)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }

  const handleProvinceChange = (provinceId: string) => {
    const province = provinces.find(p => p.provinceID.toString() === provinceId)
    setShippingAddress(prev => ({
      ...prev,
      provinceId,
      provinceName: province?.provinceName || '',
      communeCode: '',
      communeName: ''
    }))
    
    if (provinceId && province) {
      loadCommunes(province.code)
    }
  }

  const handleCommuneChange = (communeCode: string) => {
    const commune = communes.find(c => c.wardCode === communeCode)
    setShippingAddress(prev => ({
      ...prev,
      communeCode,
      communeName: commune?.wardName || ''
    }))
    
    // Calculate shipping fee when commune is selected
    setTimeout(() => calculateShippingFee(), 100)
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
    console.log('handlePlaceOrder - user:', user, 'cart:', cart)
    
    if (!cart || !user) {
      notificationService.error('Unable to place order - missing user or cart data')
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
        shippingAddress: `${shippingAddress.firstName} ${shippingAddress.lastName}\n${shippingAddress.address}\n${shippingAddress.communeName}, ${shippingAddress.provinceName}`,
        billingAddress: sameAsBilling 
          ? `${shippingAddress.firstName} ${shippingAddress.lastName}\n${shippingAddress.address}\n${shippingAddress.communeName}, ${shippingAddress.provinceName}`
          : `${billingAddress.firstName} ${billingAddress.lastName}\n${billingAddress.address}\n${billingAddress.communeName}, ${billingAddress.provinceName}`,
        paymentMethod: paymentMethod,
        shippingFee: shippingFee
      }
      
      console.log('Order data being sent:', orderData)

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
               shippingAddress.provinceId && shippingAddress.provinceId !== '' &&
               shippingAddress.communeCode && shippingAddress.communeCode !== ''
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
          <Typography variant="body1" sx={{ mb: 3 }}>
            Thank you for your purchase! We'll send you an email confirmation with tracking details.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/')}
            sx={{ mr: 2 }}
          >
            Continue Shopping
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate('/orders')}
          >
            View Orders
          </Button>
        </Paper>
      </Container>
    )
  }

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Review Your Cart
            </Typography>
            <List>
              {cart.items.map((item) => (
                <ListItem key={item.productId} divider>
                  <ListItemAvatar>
                    <Avatar src={item.productImage} alt={item.productName} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={item.productName}
                    secondary={`Quantity: ${item.quantity} | Price: ${formatPrice(item.productPrice)}`}
                  />
                  <Typography variant="h6">
                    {formatPrice(item.productPrice * item.quantity)}
                  </Typography>
                </ListItem>
              ))}
            </List>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>Subtotal:</Typography>
              <Typography>{formatPrice(cart.subtotal)}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>Shipping:</Typography>
              <Typography>{formatPrice(shippingFee)}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>Tax:</Typography>
              <Typography>{formatPrice(cart.taxAmount)}</Typography>
            </Box>
            <Divider sx={{ my: 1 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h6" fontWeight="bold">Total:</Typography>
              <Typography variant="h6" fontWeight="bold">
                {formatPrice(cart.totalAmount + shippingFee)}
              </Typography>
            </Box>
          </Box>
        )

      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Shipping Address
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  value={shippingAddress.firstName}
                  onChange={(e) => setShippingAddress(prev => ({ ...prev, firstName: e.target.value }))}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  value={shippingAddress.lastName}
                  onChange={(e) => setShippingAddress(prev => ({ ...prev, lastName: e.target.value }))}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={shippingAddress.email}
                  onChange={(e) => setShippingAddress(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  value={shippingAddress.phone}
                  onChange={(e) => setShippingAddress(prev => ({ ...prev, phone: e.target.value }))}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  value={shippingAddress.address}
                  onChange={(e) => setShippingAddress(prev => ({ ...prev, address: e.target.value }))}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Autocomplete
                  options={filteredProvinces}
                  getOptionLabel={(option) => option.provinceName}
                  value={provinces.find(p => p.provinceID.toString() === (shippingAddress.provinceId || '')) || null}
                  onChange={(event, newValue) => {
                    if (newValue) {
                      handleProvinceChange(newValue.provinceID.toString())
                    }
                  }}
                  onInputChange={(event, newInputValue) => {
                    setProvinceSearchTerm(newInputValue)
                    searchProvinces(newInputValue)
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Tỉnh/Thành phố *"
                      required
                      placeholder="Tìm kiếm tỉnh/thành..."
                    />
                  )}
                  renderOption={(props, option) => (
                    <Box component="li" {...props}>
                      <Typography variant="body2">
                        {option.provinceName}
                      </Typography>
                    </Box>
                  )}
                  filterOptions={(x) => x} // Disable built-in filtering
                  noOptionsText="Không tìm thấy tỉnh/thành"
                  loading={provinces.length === 0}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Autocomplete
                  options={filteredCommunes}
                  getOptionLabel={(option) => option.wardName}
                  value={communes.find(c => c.wardCode === (shippingAddress.communeCode || '')) || null}
                  onChange={(event, newValue) => {
                    if (newValue) {
                      handleCommuneChange(newValue.wardCode)
                    }
                  }}
                  onInputChange={(event, newInputValue) => {
                    setCommuneSearchTerm(newInputValue)
                    searchCommunes(newInputValue)
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Phường/Xã *"
                      required
                      placeholder="Tìm kiếm phường/xã..."
                      disabled={!shippingAddress.provinceId || shippingAddress.provinceId === ''}
                    />
                  )}
                  renderOption={(props, option) => (
                    <Box component="li" {...props}>
                      <Typography variant="body2">
                        {option.wardName}
                      </Typography>
                    </Box>
                  )}
                  filterOptions={(x) => x} // Disable built-in filtering
                  noOptionsText="Không tìm thấy phường/xã"
                  loading={communes.length === 0}
                  disabled={!shippingAddress.provinceId || shippingAddress.provinceId === ''}
                />
              </Grid>
            </Grid>
            
            {shippingFee > 0 && (
              <Alert severity="info" sx={{ mt: 2 }}>
                <Typography variant="body2">
                  Shipping fee: {formatPrice(shippingFee)}
                </Typography>
              </Alert>
            )}
          </Box>
        )

      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
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
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CreditCard sx={{ mr: 1 }} />
                      Credit Card
                    </Box>
                  }
                />
                <FormControlLabel
                  value="bank_transfer"
                  control={<Radio />}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <AccountBalance sx={{ mr: 1 }} />
                      Bank Transfer
                    </Box>
                  }
                />
                <FormControlLabel
                  value="cod"
                  control={<Radio />}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Money sx={{ mr: 1 }} />
                      Cash on Delivery
                    </Box>
                  }
                />
              </RadioGroup>
            </FormControl>
          </Box>
        )

      default:
        return null
    }
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom align="center" fontWeight="bold">
        Checkout
      </Typography>
      
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            {renderStepContent(activeStep)}
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                variant="outlined"
              >
                Back
              </Button>
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={!isStepValid(activeStep) || loading}
                endIcon={loading ? <CircularProgress size={20} /> : null}
              >
                {activeStep === steps.length - 1 ? 'Place Order' : 'Next'}
              </Button>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 3, position: 'sticky', top: 20 }}>
            <Typography variant="h6" gutterBottom>
              Order Summary
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                {cart.items.length} item(s)
              </Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>Subtotal:</Typography>
              <Typography>{formatPrice(cart.subtotal)}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>Shipping:</Typography>
              <Typography>{formatPrice(shippingFee)}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>Tax:</Typography>
              <Typography>{formatPrice(cart.taxAmount)}</Typography>
            </Box>
            <Divider sx={{ my: 1 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h6" fontWeight="bold">Total:</Typography>
              <Typography variant="h6" fontWeight="bold">
                {formatPrice(cart.totalAmount + shippingFee)}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  )
}

export default CheckoutPage 