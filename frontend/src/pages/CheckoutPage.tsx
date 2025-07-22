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
import axios from 'axios';

const steps = ['Review Cart', 'Shipping Address', 'Payment Method', 'Confirmation']

interface Province {
  provinceID: number
  provinceName: string
  code: string
}

// Sửa interface Commune cho đúng dữ liệu GHN
interface Commune {
  id: string;
  name: string;
}

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate()
  const { cart, cartLoading, clearCart } = useCart()
  const { user, isAuthenticated } = useAuth()
  
  const [activeStep, setActiveStep] = useState(0)
  const [loading, setLoading] = useState(false)
  
  // Shipping data
  const [provinces, setProvinces] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [wards, setWards] = useState<any[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<any | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<any | null>(null);
  const [selectedWard, setSelectedWard] = useState<any | null>(null);
  
  // Form states
  // Sửa state shippingAddress để lưu districtId và wardCode
  const [shippingAddress, setShippingAddress] = useState<{
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    provinceId: string | null;
    communeCode: string | null;
    districtId: number | null;
    provinceName: string;
    communeName: string;
    districtName: string;
    note: string;
  }>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    provinceId: null,
    communeCode: null,
    districtId: null,
    provinceName: '',
    communeName: '',
    districtName: '',
    note: ''
  });
  
  const [billingAddress, setBillingAddress] = useState<{
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    provinceId: string | null;
    communeCode: string | null;
    districtId: number | null;
    provinceName: string;
    communeName: string;
    districtName: string;
  }>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    provinceId: null,
    communeCode: null,
    districtId: null,
    provinceName: '',
    communeName: '',
    districtName: ''
  });
  
  const [paymentMethod, setPaymentMethod] = useState('credit_card')
  const [sameAsBilling, setSameAsBilling] = useState(true)
  const [orderNumber, setOrderNumber] = useState<string | null>(null)
  const [shippingFee, setShippingFee] = useState<number | null>(null);

  // Load provinces on component mount
  useEffect(() => {
    axios.get('/api/shipping/ghn/provinces')
      .then(res => setProvinces(res.data.data))
      .catch(() => setProvinces([]));
  }, []);

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

  // Sửa lại các hàm lấy tỉnh, huyện, xã/phường để gọi API GHN qua backend proxy
  // Ví dụ: /api/shipping/ghn/provinces, /api/shipping/ghn/districts?province_id=, /api/shipping/ghn/wards?district_id=

  // Load provinces on component mount
  useEffect(() => {
    axios.get('/api/shipping/ghn/provinces')
      .then(res => setProvinces(res.data.data))
      .catch(() => setProvinces([]));
  }, []);

  const handleProvinceChange = (province: any) => {
    setSelectedProvince(province);
    setSelectedDistrict(null);
    setSelectedWard(null);
    setDistricts([]);
    setWards([]);
    setShippingAddress(prev => ({
      ...prev,
      provinceId: province?.ProvinceID || null,
      provinceName: province?.ProvinceName || '',
      districtId: null,
      districtName: '',
      communeCode: null,
      communeName: ''
    }));
    if (province) {
      axios.get(`/api/shipping/ghn/districts?province_id=${province.ProvinceID}`)
        .then(res => setDistricts(res.data.data))
        .catch(() => setDistricts([]));
    }
  };

  const handleDistrictChange = (district: any) => {
    setSelectedDistrict(district);
    setSelectedWard(null);
    setWards([]);
    setShippingAddress(prev => ({
      ...prev,
      districtId: district?.DistrictID || null,
      districtName: district?.DistrictName || '',
      communeCode: null,
      communeName: ''
    }));
    if (district) {
      axios.get(`/api/shipping/ghn/wards?district_id=${district.DistrictID}`)
        .then(res => setWards(res.data.data))
        .catch(() => setWards([]));
    }
  };

  const handleWardChange = (ward: any) => {
    setSelectedWard(ward);
    setShippingAddress(prev => ({
      ...prev,
      communeCode: ward?.WardCode || null,
      communeName: ward?.WardName || ''
    }));
  };

  // Sửa fetchWarehouseForFirstProduct trả về đầy đủ các mã (ép kiểu string)
  const fetchWarehouseForFirstProduct = async (productId: number) => {
    try {
      const res = await fetch(`http://localhost:8081/api/inventory/product/${productId}`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.warehouse) {
          return {
            provinceCode: data.warehouse.provinceCode ? String(data.warehouse.provinceCode) : (data.warehouse.province ? String(data.warehouse.province) : ''),
            districtCode: data.warehouse.districtCode ? String(data.warehouse.districtCode) : (data.warehouse.districtId ? String(data.warehouse.districtId) : ''),
            wardCode: data.warehouse.wardCode ? String(data.warehouse.wardCode) : '',
          };
        }
      }
    } catch (e) {}
    // fallback HCM Q1
    return { provinceCode: '79', districtCode: '1454', wardCode: '20109' };
  };

  // Sửa calculateShippingFee để lấy districtCode từ selectedWard.parent_code nếu có
  const calculateShippingFee = async () => {
    // Lấy mã từ selectedProvince, selectedDistrict, selectedWard (GHN)
    const toProvinceId = selectedProvince?.ProvinceID;
    const toDistrictId = selectedDistrict?.DistrictID;
    const toWardCode = selectedWard?.WardCode;
    if (!toProvinceId || !toDistrictId || !toWardCode || !cart || !cart.items.length) {
      setShippingFee(null);
      notificationService.error('Vui lòng chọn đầy đủ Tỉnh, Huyện, Xã để tính phí vận chuyển!');
      return;
    }
    // Lấy thông tin kho gửi cho sản phẩm đầu tiên (địa chỉ kho gửi phải lấy từ DB, không lấy từ địa chỉ nhận)
    const firstProductId = cart.items[0].productId;
    const warehouse = await fetchWarehouseForFirstProduct(firstProductId);
    const fromProvinceId = warehouse.provinceCode;
    const fromDistrictId = warehouse.districtCode;
    const fromWardCode = warehouse.wardCode;
    try {
      const requestBody = {
        fromProvinceId,
        fromDistrictId,
        fromWardCode,
        toProvinceId,
        toDistrictId,
        toWardCode,
        weight: 1000
      };
      console.log('Shipping fee payload:', requestBody);
      const response = await fetch('http://localhost:8081/api/shipping/calculate-fee-v2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });
      if (response.ok) {
        const data = await response.json();
        console.log('Shipping fee response:', data);
        if (data.fee !== undefined) {
          setShippingFee(data.fee);
        } else if (data.shippingFee !== undefined) {
          setShippingFee(data.shippingFee);
        } else {
          setShippingFee(null);
          notificationService.error('Không lấy được phí vận chuyển từ server!');
        }
      } else {
        setShippingFee(null);
        notificationService.error('Không lấy được phí vận chuyển từ server!');
      }
    } catch (error) {
      setShippingFee(null);
      notificationService.error('Lỗi khi tính phí vận chuyển!');
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }

  // Khi chọn tỉnh/thành phố, load xã/phường theo provinceCode


  // Tự động cập nhật phí shipping khi thay đổi địa chỉ giao hàng
  useEffect(() => {
    if (selectedProvince && selectedDistrict && selectedWard) {
      calculateShippingFee();
    } else {
      setShippingFee(null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProvince, selectedDistrict, selectedWard]);

  // Khi bấm Next ở bước Shipping Address, nếu shippingFee chưa xác định thì gọi lại calculateShippingFee trước khi sang bước tiếp theo
  const handleNext = async () => {
    if (activeStep === 1) {
      // Đảm bảo đã có phí ship trước khi sang bước tiếp
      if (shippingFee === null) {
        await calculateShippingFee();
        if (shippingFee === null) {
          notificationService.error('Vui lòng nhập đầy đủ địa chỉ để tính phí vận chuyển!');
          return;
        }
      }
    }
    if (activeStep === steps.length - 1) {
      handlePlaceOrder();
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  // Sửa handlePlaceOrder để gửi shipping_address và billing_address là chuỗi địa chỉ đầy đủ
  const handlePlaceOrder = async () => {
    console.log('handlePlaceOrder - user:', user, 'cart:', cart)

    if (!cart || !user) {
      notificationService.error('Unable to place order - missing user or cart data')
      return
    }

    try {
      setLoading(true)

      // Gộp địa chỉ đầy đủ
      const fullShippingAddress = [
        shippingAddress.address,
        shippingAddress.communeName,
        shippingAddress.districtName,
        shippingAddress.provinceName
      ].filter(Boolean).join(', ');
      const fullBillingAddress = sameAsBilling
        ? fullShippingAddress
        : [
            billingAddress.address,
            billingAddress.communeName,
            billingAddress.districtName,
            billingAddress.provinceName
          ].filter(Boolean).join(', ');

      // Prepare order data
      const orderData = {
        userId: user.id,
        items: cart.items.map(item => ({
          productId: item.productId,
          quantity: item.quantity
        })),
        shippingAddress: fullShippingAddress,
        billingAddress: fullBillingAddress,
        paymentMethod: paymentMethod,
        shippingFee: shippingFee,
        note: shippingAddress.note
      }

      console.log('Order data being sent:', orderData)

      const orderResponse = await apiService.createOrder(orderData)

      if (orderResponse.success) {
        setOrderNumber(orderResponse.data.orderNumber)
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
              <Grid item xs={12} sm={4}>
                <Autocomplete
                  options={provinces}
                  getOptionLabel={option => option.ProvinceName || ''}
                  value={selectedProvince}
                  onChange={(e, value) => handleProvinceChange(value)}
                  renderInput={params => <TextField {...params} label="Tỉnh/Thành phố *" required />}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Autocomplete
                  options={districts}
                  getOptionLabel={option => option.DistrictName || ''}
                  value={selectedDistrict}
                  onChange={(e, value) => handleDistrictChange(value)}
                  renderInput={params => <TextField {...params} label="Quận/Huyện *" required />}
                  disabled={!selectedProvince}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Autocomplete
                  options={wards}
                  getOptionLabel={option => option.WardName || ''}
                  value={selectedWard}
                  onChange={(e, value) => handleWardChange(value)}
                  renderInput={params => <TextField {...params} label="Xã/Phường *" required />}
                  disabled={!selectedDistrict}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Ghi chú (Note)"
                  value={shippingAddress.note}
                  onChange={(e) => setShippingAddress(prev => ({ ...prev, note: e.target.value }))}
                  multiline
                  minRows={2}
                  placeholder="Ghi chú cho đơn hàng (nếu có)"
                />
              </Grid>
            </Grid>
          </Box>
        )

      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Order Summary
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
              <Typography>{shippingFee !== null ? formatPrice(shippingFee) : 'Chưa xác định'}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>Tax:</Typography>
              <Typography>{formatPrice(cart.taxAmount)}</Typography>
            </Box>
            <Divider sx={{ my: 1 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h6" fontWeight="bold">Total:</Typography>
              <Typography variant="h6" fontWeight="bold">
                {formatPrice(cart.totalAmount + (shippingFee || 0))}
              </Typography>
            </Box>
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
              <Typography>{shippingFee !== null ? formatPrice(shippingFee) : 'Chưa xác định'}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>Tax:</Typography>
              <Typography>{formatPrice(cart.taxAmount)}</Typography>
            </Box>
            <Divider sx={{ my: 1 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h6" fontWeight="bold">Total:</Typography>
              <Typography variant="h6" fontWeight="bold">
                {formatPrice(cart.totalAmount + (shippingFee || 0))}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  )
}

export default CheckoutPage 