import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Box,
  Chip,
  Rating,
  Avatar,
  Paper,
  IconButton,
  Divider,
} from '@mui/material';
import {
  ShoppingCart,
  Favorite,
  Star,
  TrendingUp,
  LocalShipping,
  Security,
  SupportAgent,
  VerifiedUser,
  ArrowForward,
  PlayArrow,
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { apiService } from '../services/api';

const HomePage: React.FC = () => {
  // Mock data for featured products
  const featuredProducts = [
    {
      id: 1,
      name: 'Gaming Laptop Pro',
      price: 1299.99,
      originalPrice: 1499.99,
      rating: 4.8,
      reviews: 124,
      image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400',
      category: 'Gaming',
      badge: 'Hot',
    },
    {
      id: 2,
      name: 'Wireless Headphones',
      price: 199.99,
      originalPrice: 249.99,
      rating: 4.6,
      reviews: 89,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
      category: 'Audio',
      badge: 'Sale',
    },
    {
      id: 3,
      name: 'Smartphone X',
      price: 899.99,
      originalPrice: 999.99,
      rating: 4.9,
      reviews: 256,
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',
      category: 'Mobile',
      badge: 'New',
    },
    {
      id: 4,
      name: '4K Monitor',
      price: 399.99,
      originalPrice: 499.99,
      rating: 4.7,
      reviews: 67,
      image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400',
      category: 'Computers',
      badge: 'Popular',
    },
  ];

  const [categories, setCategories] = useState<any[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    apiService.getCategoriesWithCount()
      .then((data) => setCategories(data))
      .finally(() => setLoadingCategories(false));
  }, []);

  const stats = [
    { number: '50K+', label: 'Happy Customers', icon: '😊' },
    { number: '100K+', label: 'Products Sold', icon: '📦' },
    { number: '24/7', label: 'Customer Support', icon: '🛟' },
    { number: '99%', label: 'Satisfaction Rate', icon: '⭐' },
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Tech Enthusiast',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100',
      rating: 5,
      comment: 'Amazing selection of products and excellent customer service. The AI assistant helped me find exactly what I needed!',
    },
    {
      name: 'Mike Chen',
      role: 'Gamer',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
      rating: 5,
      comment: 'Best prices for gaming gear. Fast shipping and the products are exactly as described. Highly recommended!',
    },
    {
      name: 'Emily Davis',
      role: 'Student',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
      rating: 5,
      comment: 'Perfect for my laptop needs. The support team was incredibly helpful when I had questions about compatibility.',
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: { xs: 6, md: 10 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                variant="h2"
                component="h1"
                sx={{
                  fontWeight: 'bold',
                  mb: 2,
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                }}
              >
                Welcome to ShopPro
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  mb: 3,
                  opacity: 0.9,
                  lineHeight: 1.4,
                }}
              >
                Your ultimate destination for cutting-edge technology and innovative AI-powered shopping experiences
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  component={Link}
                  to="/products"
                  variant="contained"
                  size="large"
                  startIcon={<ShoppingCart />}
                  sx={{
                    py: 1.5,
                    px: 4,
                    borderRadius: 3,
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    textTransform: 'none',
                    backgroundColor: 'white',
                    color: 'primary.main',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    },
                  }}
                >
                  Shop Now
                </Button>
                <Button
                  component={Link}
                  to="/ai-assistant"
                  variant="outlined"
                  size="large"
                  startIcon={<PlayArrow />}
                  sx={{
                    py: 1.5,
                    px: 4,
                    borderRadius: 3,
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    textTransform: 'none',
                    borderColor: 'white',
                    color: 'white',
                    '&:hover': {
                      borderColor: 'white',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    },
                  }}
                >
                  Try AI Assistant
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600"
                  alt="Hero Product"
                  style={{
                    width: '100%',
                    maxWidth: 500,
                    height: 'auto',
                    borderRadius: 20,
                    boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Stats Section */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={3}>
          {stats.map((stat, index) => (
            <Grid item xs={6} md={3} key={index}>
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  textAlign: 'center',
                  borderRadius: 3,
                  transition: 'transform 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                <Typography variant="h3" sx={{ fontSize: '2.5rem', fontWeight: 'bold', mb: 1 }}>
                  {stat.icon}
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 1 }}>
                  {stat.number}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {stat.label}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Categories Section */}
      <Box sx={{ bgcolor: 'background.default', py: 6 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            component="h2"
            sx={{
              textAlign: 'center',
              fontWeight: 'bold',
              mb: 1,
              letterSpacing: 1,
              textShadow: '0 2px 8px rgba(0,0,0,0.08)',
              transition: 'color 0.3s',
              '&:hover': { color: 'primary.main' },
            }}
          >
            Shop by Category
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{
              textAlign: 'center',
              mb: 5,
              opacity: 0.85,
              fontStyle: 'italic',
              letterSpacing: 0.5,
            }}
          >
            Discover our wide range of products
          </Typography>

          {loadingCategories ? (
            <Typography align="center">Loading categories...</Typography>
          ) : (
            <Grid container spacing={4} justifyContent="center">
              {categories.map((category) => (
                <Grid item xs={12} sm={6} md={2} key={category.id}>
                  <Card
                    component={Link}
                    to={`/products?category=${category.slug}`}
                    sx={{
                      textDecoration: 'none',
                      height: 180,
                      borderRadius: 4,
                      boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'transform 0.25s cubic-bezier(.4,2,.6,1), box-shadow 0.25s',
                      '&:hover': {
                        transform: 'scale(1.07) translateY(-6px)',
                        boxShadow: '0 12px 32px rgba(0,0,0,0.18)',
                        borderColor: 'primary.main',
                      },
                    }}
                  >
                    {category.imageUrl && (
                      <CardMedia
                        component="img"
                        image={category.imageUrl}
                        alt={category.name}
                        sx={{ height: 70, width: 70, objectFit: 'cover', borderRadius: 2, mb: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.10)' }}
                      />
                    )}
                    <CardContent sx={{ textAlign: 'center', p: 0 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 0, fontSize: 18 }}>
                        {category.name}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
      </Box>

      {/* Featured Products */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography
              variant="h3"
              component="h2"
              sx={{
                fontWeight: 'bold',
                mb: 1,
              }}
            >
              Featured Products
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Handpicked products for you
            </Typography>
          </Box>
          <Button
            component={Link}
            to="/products"
            variant="outlined"
            endIcon={<ArrowForward />}
            sx={{
              borderRadius: 3,
              textTransform: 'none',
              fontWeight: 'bold',
            }}
          >
            View All
          </Button>
        </Box>

        <Grid container spacing={3}>
          {featuredProducts.map((product) => (
            <Grid item xs={12} sm={6} md={3} key={product.id}>
              <Card
                sx={{
                  height: '100%',
                  borderRadius: 3,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
                  },
                }}
              >
                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={product.image}
                    alt={product.name}
                    sx={{ objectFit: 'cover' }}
                  />
                  <Chip
                    label={product.badge}
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 12,
                      left: 12,
                      backgroundColor: 'primary.main',
                      color: 'white',
                      fontWeight: 'bold',
                    }}
                  />
                  <IconButton
                    sx={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      '&:hover': {
                        backgroundColor: 'white',
                      },
                    }}
                  >
                    <Favorite />
                  </IconButton>
                </Box>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="caption" color="primary.main" sx={{ fontWeight: 'bold' }}>
                    {product.category}
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {product.name}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Rating value={product.rating} precision={0.1} size="small" readOnly />
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                      ({product.reviews})
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                      ${product.price}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        textDecoration: 'line-through',
                        color: 'text.secondary',
                      }}
                    >
                      ${product.originalPrice}
                    </Typography>
                  </Box>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<ShoppingCart />}
                    sx={{
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 'bold',
                    }}
                  >
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Features Section */}
      <Box sx={{ bgcolor: 'background.default', py: 6 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            component="h2"
            sx={{
              textAlign: 'center',
              fontWeight: 'bold',
              mb: 1,
            }}
          >
            Why Choose ShopPro?
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{
              textAlign: 'center',
              mb: 5,
            }}
          >
            We provide the best shopping experience
          </Typography>

          <Grid container spacing={4}>
            <Grid item xs={12} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    backgroundColor: 'primary.main',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 3,
                  }}
                >
                  <LocalShipping sx={{ fontSize: 40, color: 'white' }} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                  Fast Shipping
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Free shipping on orders over $50. Get your products delivered within 2-3 business days.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    backgroundColor: 'primary.main',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 3,
                  }}
                >
                  <Security sx={{ fontSize: 40, color: 'white' }} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                  Secure Payments
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Your payment information is protected with bank-level security and encryption.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    backgroundColor: 'primary.main',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 3,
                  }}
                >
                  <SupportAgent sx={{ fontSize: 40, color: 'white' }} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                  24/7 Support
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Our customer support team is available 24/7 to help you with any questions.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    backgroundColor: 'primary.main',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 3,
                  }}
                >
                  <VerifiedUser sx={{ fontSize: 40, color: 'white' }} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                  Quality Guarantee
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  All our products come with a 30-day money-back guarantee and warranty.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography
          variant="h3"
          component="h2"
          sx={{
            textAlign: 'center',
            fontWeight: 'bold',
            mb: 1,
          }}
        >
          What Our Customers Say
        </Typography>
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{
            textAlign: 'center',
            mb: 5,
          }}
        >
          Don't just take our word for it
        </Typography>

        <Grid container spacing={4}>
          {testimonials.map((testimonial, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Paper
                elevation={2}
                sx={{
                  p: 4,
                  borderRadius: 3,
                  height: '100%',
                  transition: 'transform 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Avatar
                    src={testimonial.avatar}
                    sx={{ width: 60, height: 60, mr: 2 }}
                  />
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      {testimonial.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {testimonial.role}
                    </Typography>
                  </Box>
                </Box>
                <Rating value={testimonial.rating} readOnly sx={{ mb: 2 }} />
                <Typography variant="body1" sx={{ fontStyle: 'italic', lineHeight: 1.6 }}>
                  "{testimonial.comment}"
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: 4, // giảm từ 8 xuống 4 để sát Footer hơn
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="h3"
              component="h2"
              sx={{
                fontWeight: 'bold',
                mb: 2,
              }}
            >
              Ready to Start Shopping?
            </Typography>
            <Typography
              variant="h6"
              sx={{
                mb: 4,
                opacity: 0.9,
              }}
            >
              Join thousands of satisfied customers and discover amazing products
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                component={Link}
                to="/products"
                variant="contained"
                size="large"
                startIcon={<ShoppingCart />}
                sx={{
                  py: 1.5,
                  px: 4,
                  borderRadius: 3,
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  textTransform: 'none',
                  backgroundColor: 'white',
                  color: 'primary.main',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  },
                }}
              >
                Browse Products
              </Button>
              <Button
                component={Link}
                to="/signup"
                variant="outlined"
                size="large"
                sx={{
                  py: 1.5,
                  px: 4,
                  borderRadius: 3,
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  textTransform: 'none',
                  borderColor: 'white',
                  color: 'white',
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                Create Account
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage; 