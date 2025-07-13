import React from 'react'
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  TextField,
  InputAdornment,
  Avatar,
  Rating,
  Paper,
  Chip,
} from '@mui/material'
import {
  Search,
  ArrowForward,
  ShoppingCart,
  Star,
  People,
  Inventory,
  AttachMoney,
  LocalShipping,
  Security,
  SupportAgent,
  Email,
  PlayArrow,
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'

const HomePage: React.FC = () => {
  const navigate = useNavigate()

  const categories = [
    { name: 'Electronics', image: '/api/placeholder/200/150', count: '2,345+', color: '#1976d2' },
    { name: 'Gaming', image: '/api/placeholder/200/150', count: '1,876+', color: '#9c27b0' },
    { name: 'Computers', image: '/api/placeholder/200/150', count: '3,421+', color: '#f57c00' },
    { name: 'Mobile', image: '/api/placeholder/200/150', count: '4,567+', color: '#388e3c' },
    { name: 'Audio', image: '/api/placeholder/200/150', count: '1,234+', color: '#d32f2f' },
    { name: 'Accessories', image: '/api/placeholder/200/150', count: '987+', color: '#7b1fa2' },
  ]

  const featuredProducts = [
    {
      id: 1,
      name: 'Gaming Laptop Pro',
      price: 1299.99,
      originalPrice: 1599.99,
      image: '/api/placeholder/300/250',
      rating: 4.8,
      reviews: 245,
      badge: 'Best Seller'
    },
    {
      id: 2,
      name: 'Wireless Gaming Mouse',
      price: 79.99,
      originalPrice: 99.99,
      image: '/api/placeholder/300/250',
      rating: 4.6,
      reviews: 189,
      badge: 'New'
    },
    {
      id: 3,
      name: 'Premium Headphones',
      price: 199.99,
      originalPrice: 249.99,
      image: '/api/placeholder/300/250',
      rating: 4.9,
      reviews: 432,
      badge: '20% OFF'
    },
    {
      id: 4,
      name: 'Smart Fitness Watch',
      price: 299.99,
      originalPrice: 399.99,
      image: '/api/placeholder/300/250',
      rating: 4.7,
      reviews: 321,
      badge: 'Featured'
    },
  ]

  const testimonials = [
    {
      name: 'Sarah Johnson',
      avatar: '/api/placeholder/60/60',
      rating: 5,
      comment: 'Amazing shopping experience! Fast delivery and excellent customer service.',
      location: 'New York, USA'
    },
    {
      name: 'Michael Chen',
      avatar: '/api/placeholder/60/60',
      rating: 5,
      comment: 'The AI recommendations are spot on. Found exactly what I was looking for!',
      location: 'San Francisco, USA'
    },
    {
      name: 'Emma Wilson',
      avatar: '/api/placeholder/60/60',
      rating: 5,
      comment: 'Love the chatbot feature. It helped me choose the perfect laptop.',
      location: 'London, UK'
    },
  ]

  const stats = [
    { icon: <People sx={{ fontSize: 40 }} />, number: '1M+', label: 'Happy Customers' },
    { icon: <Inventory sx={{ fontSize: 40 }} />, number: '50K+', label: 'Products' },
    { icon: <LocalShipping sx={{ fontSize: 40 }} />, number: '99.9%', label: 'On-time Delivery' },
    { icon: <Star sx={{ fontSize: 40 }} />, number: '4.9/5', label: 'Customer Rating' },
  ]

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  const calculateDiscount = (original: number, current: number) => {
    return Math.round(((original - current) / original) * 100)
  }

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: { xs: 8, md: 12 },
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url(/api/placeholder/1920/1080) center/cover',
            opacity: 0.1,
            zIndex: 0,
          }
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography 
                variant="h2" 
                component="h1" 
                gutterBottom
                sx={{ 
                  fontWeight: 'bold',
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  lineHeight: 1.2
                }}
              >
                Discover Amazing Products
              </Typography>
              <Typography 
                variant="h5" 
                component="p" 
                gutterBottom 
                sx={{ 
                  mb: 4, 
                  opacity: 0.9,
                  fontSize: { xs: '1.1rem', md: '1.25rem' }
                }}
              >
                Shop the latest trends with AI-powered recommendations. 
                Fast delivery, secure payments, and 24/7 customer support.
              </Typography>
              
              <Box sx={{ mb: 4 }}>
                <TextField
                  fullWidth
                  placeholder="Search for products..."
                  variant="outlined"
                  sx={{
                    maxWidth: 500,
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      borderRadius: 3,
                      '& fieldset': { border: 'none' },
                    }
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <Button
                        variant="contained"
                        sx={{ 
                          borderRadius: 2,
                          px: 3,
                          background: 'linear-gradient(45deg, #667eea, #764ba2)'
                        }}
                      >
                        Search
                      </Button>
                    ),
                  }}
                />
              </Box>

              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/products')}
                  sx={{ 
                    px: 4,
                    py: 1.5,
                    borderRadius: 3,
                    backgroundColor: 'white',
                    color: 'primary.main',
                    fontWeight: 'bold',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      transform: 'translateY(-2px)',
                    }
                  }}
                  endIcon={<ArrowForward />}
                >
                  Shop Now
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  sx={{ 
                    px: 4,
                    py: 1.5,
                    borderRadius: 3,
                    borderColor: 'white',
                    color: 'white',
                    fontWeight: 'bold',
                    '&:hover': {
                      borderColor: 'white',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    }
                  }}
                  startIcon={<PlayArrow />}
                >
                  Watch Demo
                </Button>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: { xs: 300, md: 400 },
                }}
              >
                <img
                  src="/api/placeholder/500/400"
                  alt="Shopping Experience"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: 16,
                    boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Stats Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={4}>
          {stats.map((stat, index) => (
            <Grid item xs={6} md={3} key={index}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  textAlign: 'center',
                  background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                  borderRadius: 3,
                }}
              >
                <Box sx={{ color: 'primary.main', mb: 1 }}>
                  {stat.icon}
                </Box>
                <Typography variant="h4" fontWeight="bold" color="primary.main">
                  {stat.number}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stat.label}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Categories Section */}
      <Box sx={{ backgroundColor: '#f8f9fa', py: 8 }}>
        <Container maxWidth="lg">
          <Typography 
            variant="h3" 
            component="h2" 
            textAlign="center" 
            gutterBottom
            sx={{ fontWeight: 'bold', mb: 2 }}
          >
            Shop by Category
          </Typography>
          <Typography 
            variant="body1" 
            textAlign="center" 
            color="text.secondary" 
            sx={{ mb: 6, maxWidth: 600, mx: 'auto' }}
          >
            Explore our wide range of products across different categories
          </Typography>

          <Grid container spacing={3}>
            {categories.map((category, index) => (
              <Grid item xs={6} md={4} lg={2} key={index}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    borderRadius: 3,
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: 4,
                    },
                  }}
                  onClick={() => navigate('/products')}
                >
                  <CardMedia
                    component="img"
                    height="120"
                    image={category.image}
                    alt={category.name}
                  />
                  <CardContent sx={{ textAlign: 'center', py: 2 }}>
                    <Typography variant="h6" gutterBottom fontWeight="bold">
                      {category.name}
                    </Typography>
                    <Chip
                      label={category.count}
                      size="small"
                      sx={{ 
                        backgroundColor: category.color,
                        color: 'white',
                        fontWeight: 'bold'
                      }}
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Featured Products */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h3" component="h2" fontWeight="bold" gutterBottom>
              Featured Products
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Handpicked products just for you
            </Typography>
          </Box>
          <Button
            variant="outlined"
            onClick={() => navigate('/products')}
            endIcon={<ArrowForward />}
          >
            View All
          </Button>
        </Box>

        <Grid container spacing={3}>
          {featuredProducts.map((product) => (
            <Grid item xs={12} sm={6} md={3} key={product.id}>
              <Card
                sx={{
                  position: 'relative',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  borderRadius: 3,
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                  },
                }}
                onClick={() => navigate('/products')}
              >
                {product.badge && (
                  <Chip
                    label={product.badge}
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 8,
                      left: 8,
                      zIndex: 1,
                      backgroundColor: 'error.main',
                      color: 'white',
                      fontWeight: 'bold',
                    }}
                  />
                )}
                
                <CardMedia
                  component="img"
                  height="200"
                  image={product.image}
                  alt={product.name}
                />
                
                <CardContent>
                  <Typography variant="h6" gutterBottom noWrap>
                    {product.name}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Rating value={product.rating} precision={0.1} size="small" readOnly />
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                      ({product.reviews})
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="h6" color="primary" fontWeight="bold">
                      {formatPrice(product.price)}
                    </Typography>
                    {product.originalPrice > product.price && (
                      <>
                        <Typography 
                          variant="body2" 
                          sx={{ textDecoration: 'line-through' }}
                          color="text.secondary"
                        >
                          {formatPrice(product.originalPrice)}
                        </Typography>
                        <Chip
                          label={`-${calculateDiscount(product.originalPrice, product.price)}%`}
                          size="small"
                          color="error"
                          variant="outlined"
                        />
                      </>
                    )}
                  </Box>

                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<ShoppingCart />}
                    sx={{ mt: 2, borderRadius: 2 }}
                  >
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Why Choose Us */}
      <Box sx={{ backgroundColor: '#f8f9fa', py: 8 }}>
        <Container maxWidth="lg">
          <Typography 
            variant="h3" 
            component="h2" 
            textAlign="center" 
            gutterBottom
            sx={{ fontWeight: 'bold', mb: 2 }}
          >
            Why Choose ShopPro?
          </Typography>
          <Typography 
            variant="body1" 
            textAlign="center" 
            color="text.secondary" 
            sx={{ mb: 6, maxWidth: 600, mx: 'auto' }}
          >
            We provide the best shopping experience with cutting-edge technology
          </Typography>

          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <LocalShipping sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                <Typography variant="h5" gutterBottom fontWeight="bold">
                  Free Shipping
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Free shipping on all orders over $50. Fast and reliable delivery worldwide.
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Security sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                <Typography variant="h5" gutterBottom fontWeight="bold">
                  Secure Payments
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Your payment information is protected with bank-level security encryption.
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <SupportAgent sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                <Typography variant="h5" gutterBottom fontWeight="bold">
                  24/7 Support
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Our AI-powered support team is available around the clock to help you.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Testimonials */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography 
          variant="h3" 
          component="h2" 
          textAlign="center" 
          gutterBottom
          sx={{ fontWeight: 'bold', mb: 2 }}
        >
          What Our Customers Say
        </Typography>
        <Typography 
          variant="body1" 
          textAlign="center" 
          color="text.secondary" 
          sx={{ mb: 6, maxWidth: 600, mx: 'auto' }}
        >
          Join thousands of satisfied customers who love shopping with us
        </Typography>

        <Grid container spacing={4}>
          {testimonials.map((testimonial, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card
                elevation={2}
                sx={{
                  p: 3,
                  height: '100%',
                  borderRadius: 3,
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    sx={{ width: 56, height: 56, mr: 2 }}
                  />
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      {testimonial.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {testimonial.location}
                    </Typography>
                  </Box>
                </Box>
                
                <Rating value={testimonial.rating} readOnly sx={{ mb: 2 }} />
                
                <Typography variant="body2" color="text.secondary">
                  "{testimonial.comment}"
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Newsletter */}
      <Box sx={{ backgroundColor: 'primary.main', color: 'white', py: 8 }}>
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center' }}>
            <Email sx={{ fontSize: 60, mb: 2, opacity: 0.8 }} />
            <Typography variant="h4" gutterBottom fontWeight="bold">
              Stay Updated
            </Typography>
            <Typography variant="body1" sx={{ mb: 4, opacity: 0.9 }}>
              Subscribe to our newsletter and get 10% off your first order. 
              Be the first to know about new products and exclusive deals.
            </Typography>
            
            <Box sx={{ maxWidth: 500, mx: 'auto' }}>
              <TextField
                fullWidth
                placeholder="Enter your email address"
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'white',
                    borderRadius: 3,
                    '& fieldset': { border: 'none' },
                  }
                }}
                InputProps={{
                  endAdornment: (
                    <Button
                      variant="contained"
                      sx={{ 
                        borderRadius: 2,
                        px: 3,
                        backgroundColor: 'secondary.main',
                        '&:hover': {
                          backgroundColor: 'secondary.dark',
                        }
                      }}
                    >
                      Subscribe
                    </Button>
                  ),
                }}
              />
            </Box>
            
            <Typography variant="body2" sx={{ mt: 2, opacity: 0.7 }}>
              * You can unsubscribe at any time. No spam, we promise!
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  )
}

export default HomePage 