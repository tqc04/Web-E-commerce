import React, { useState, useEffect } from 'react'
import {
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Box,
  Alert,
  IconButton,
  Chip,
  Skeleton,
  Fab,
  Tooltip
} from '@mui/material'
import {
  Favorite,
  FavoriteBorder,
  ShoppingCart,
  Share,
  Visibility,
  Delete,
  FilterList
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useCart } from '../contexts/CartContext'
import { apiService } from '../services/api'

interface Product {
  id: number
  name: string
  description: string
  price: number
  imageUrl?: string
  category: string
  brand: string
  stockQuantity: number
  rating?: number
  createdAt: string
  updatedAt: string
}

const FavoritesPage: React.FC = () => {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const { addToCart } = useCart()
  
  const [favorites, setFavorites] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  useEffect(() => {
    if (isAuthenticated) {
      loadFavorites()
    } else {
      setIsLoading(false)
    }
  }, [isAuthenticated])

  const loadFavorites = async () => {
    try {
      setIsLoading(true)
      const response = await apiService.getFavorites()
      
      if (response.success) {
        setFavorites(response.data || [])
      }
    } catch (error: any) {
      console.error('Failed to load favorites:', error)
      setMessage({
        type: 'error',
        text: 'Failed to load favorites. Please try again.'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveFromFavorites = async (productId: number) => {
    try {
      const response = await apiService.removeFromFavorites(productId)
      
      if (response.success) {
        setFavorites(prev => prev.filter(product => product.id !== productId))
        setMessage({
          type: 'success',
          text: 'Product removed from favorites'
        })
        
        // Clear message after 3 seconds
        setTimeout(() => setMessage(null), 3000)
      }
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to remove from favorites'
      })
    }
  }

  const handleAddToCart = async (product: Product) => {
    try {
      if (product.stockQuantity <= 0) {
        setMessage({
          type: 'error',
          text: 'This product is out of stock'
        })
        return
      }

      await addToCart(product.id, 1)
      setMessage({
        type: 'success',
        text: `${product.name} added to cart`
      })
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(null), 3000)
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to add to cart'
      })
    }
  }

  const handleProductClick = (productId: number) => {
    navigate(`/products/${productId}`)
  }

  const handleShareProduct = (product: Product) => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: `${window.location.origin}/products/${product.id}`
      })
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(`${window.location.origin}/products/${product.id}`)
      setMessage({
        type: 'success',
        text: 'Product link copied to clipboard'
      })
      setTimeout(() => setMessage(null), 3000)
    }
  }

  const ProductCard: React.FC<{ product: Product }> = ({ product }) => (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        position: 'relative',
        '&:hover': {
          boxShadow: 6,
          transform: 'translateY(-2px)',
          transition: 'all 0.3s ease-in-out'
        }
      }}
    >
      {/* Favorite Button */}
      <IconButton
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          zIndex: 1,
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 1)'
          }
        }}
        onClick={() => handleRemoveFromFavorites(product.id)}
      >
        <Favorite color="error" />
      </IconButton>

      {/* Product Image */}
      <CardMedia
        component="img"
        height="200"
        image={product.imageUrl || `https://via.placeholder.com/300x200?text=${encodeURIComponent(product.name)}`}
        alt={product.name}
        sx={{ 
          cursor: 'pointer',
          objectFit: 'cover'
        }}
        onClick={() => handleProductClick(product.id)}
      />

      {/* Product Content */}
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography 
          gutterBottom 
          variant="h6" 
          component="h2"
          sx={{ 
            cursor: 'pointer',
            '&:hover': { color: 'primary.main' }
          }}
          onClick={() => handleProductClick(product.id)}
        >
          {product.name}
        </Typography>
        
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ 
            mb: 2,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {product.description}
        </Typography>

        <Box display="flex" gap={1} mb={2}>
          <Chip 
            label={product.category} 
            size="small" 
            color="primary" 
            variant="outlined" 
          />
          <Chip 
            label={product.brand} 
            size="small" 
            variant="outlined" 
          />
        </Box>

        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="h6" color="primary">
            ${product.price.toFixed(2)}
          </Typography>
          {product.rating && (
            <Typography variant="body2" color="text.secondary">
              ⭐ {product.rating}/5
            </Typography>
          )}
        </Box>

        <Typography 
          variant="body2" 
          color={product.stockQuantity > 0 ? 'success.main' : 'error.main'}
        >
          {product.stockQuantity > 0 
            ? `${product.stockQuantity} in stock` 
            : 'Out of stock'
          }
        </Typography>
      </CardContent>

      {/* Actions */}
      <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
        <Button
          variant="contained"
          startIcon={<ShoppingCart />}
          onClick={() => handleAddToCart(product)}
          disabled={product.stockQuantity <= 0}
          size="small"
        >
          Add to Cart
        </Button>
        
        <Box>
          <Tooltip title="View Details">
            <IconButton 
              size="small"
              onClick={() => handleProductClick(product.id)}
            >
              <Visibility />
            </IconButton>
          </Tooltip>
          <Tooltip title="Share">
            <IconButton 
              size="small"
              onClick={() => handleShareProduct(product)}
            >
              <Share />
            </IconButton>
          </Tooltip>
        </Box>
      </CardActions>
    </Card>
  )

  const LoadingSkeleton: React.FC = () => (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Skeleton variant="rectangular" height={200} />
      <CardContent sx={{ flexGrow: 1 }}>
        <Skeleton variant="text" height={32} width="80%" />
        <Skeleton variant="text" height={20} width="100%" />
        <Skeleton variant="text" height={20} width="60%" />
        <Box display="flex" gap={1} my={1}>
          <Skeleton variant="rounded" height={24} width={60} />
          <Skeleton variant="rounded" height={24} width={60} />
        </Box>
        <Skeleton variant="text" height={24} width="40%" />
      </CardContent>
      <CardActions sx={{ px: 2, pb: 2 }}>
        <Skeleton variant="rounded" height={36} width={120} />
        <Skeleton variant="circular" height={40} width={40} />
      </CardActions>
    </Card>
  )

  if (!isAuthenticated) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="warning">
          Please log in to view your favorite products.
        </Alert>
      </Container>
    )
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            My Favorites
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {favorites.length > 0 
              ? `${favorites.length} favorite ${favorites.length === 1 ? 'product' : 'products'}`
              : 'No favorite products yet'
            }
          </Typography>
        </Box>
      </Box>

      {/* Messages */}
      {message && (
        <Alert severity={message.type} sx={{ mb: 3 }}>
          {message.text}
        </Alert>
      )}

      {/* Content */}
      {isLoading ? (
        <Grid container spacing={3}>
          {[...Array(8)].map((_, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <LoadingSkeleton />
            </Grid>
          ))}
        </Grid>
      ) : favorites.length === 0 ? (
        <Box textAlign="center" py={8}>
          <FavoriteBorder sx={{ fontSize: 100, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            No Favorites Yet
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={3}>
            Start browsing products and add items to your favorites to see them here.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/products')}
          >
            Browse Products
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {favorites.map((product) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
              <ProductCard product={product} />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="browse products"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
        }}
        onClick={() => navigate('/products')}
      >
        <ShoppingCart />
      </Fab>
    </Container>
  )
}

export default FavoritesPage 