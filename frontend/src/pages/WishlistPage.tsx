import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  IconButton,
  Chip,
  Rating,
  Alert,
  Skeleton,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Badge,
  Tooltip,
} from '@mui/material';
import {
  Favorite,
  ShoppingCart,
  Delete,
  Share,
  Visibility,
  Add,
  Remove,
  LocalOffer,
  TrendingUp,
  TrendingDown,
  Star,
  Compare,
} from '@mui/icons-material';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

interface WishlistItem {
  id: number;
  productId: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  brand: string;
  rating: number;
  reviews: number;
  stock: number;
  addedDate: string;
  discount?: number;
  isNew?: boolean;
  isOnSale?: boolean;
}

const WishlistPage: React.FC = () => {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  // Mock data - sẽ được thay thế bằng API calls
  const mockWishlistItems: WishlistItem[] = [
    {
      id: 1,
      productId: 1,
      name: 'Gaming Laptop Pro',
      description: 'High-performance gaming laptop with RTX 4080, 32GB RAM, 1TB SSD',
      price: 1299.99,
      originalPrice: 1499.99,
      image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400',
      category: 'Electronics',
      brand: 'GamingTech',
      rating: 4.8,
      reviews: 124,
      stock: 25,
      addedDate: '2024-01-10',
      discount: 13,
      isNew: true,
    },
    {
      id: 2,
      productId: 2,
      name: 'Wireless Noise-Canceling Headphones',
      description: 'Premium wireless headphones with active noise cancellation',
      price: 199.99,
      originalPrice: 249.99,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
      category: 'Audio',
      brand: 'SoundMaster',
      rating: 4.6,
      reviews: 89,
      stock: 50,
      addedDate: '2024-01-08',
      discount: 20,
      isOnSale: true,
    },
    {
      id: 3,
      productId: 3,
      name: 'Smartphone X Pro',
      description: 'Latest smartphone with 5G, 256GB storage, and advanced camera system',
      price: 899.99,
      originalPrice: 999.99,
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',
      category: 'Mobile',
      brand: 'TechPhone',
      rating: 4.9,
      reviews: 256,
      stock: 15,
      addedDate: '2024-01-05',
      discount: 10,
      isNew: true,
    },
    {
      id: 4,
      productId: 4,
      name: '4K Ultra HD Monitor',
      description: '27-inch 4K monitor with HDR support and 144Hz refresh rate',
      price: 399.99,
      originalPrice: 499.99,
      image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400',
      category: 'Computers',
      brand: 'DisplayPro',
      rating: 4.7,
      reviews: 67,
      stock: 8,
      addedDate: '2024-01-03',
      discount: 20,
    },
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setWishlistItems(mockWishlistItems);
      setLoading(false);
    }, 1000);
  }, []);

  const handleRemoveFromWishlist = (itemId: number) => {
    setWishlistItems(prev => prev.filter(item => item.id !== itemId));
  };

  const handleAddToCart = (item: WishlistItem) => {
    addToCart({
      id: item.productId,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: 1,
    });
  };

  const handleSelectItem = (itemId: number) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === wishlistItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(wishlistItems.map(item => item.id));
    }
  };

  const handleRemoveSelected = () => {
    setWishlistItems(prev => prev.filter(item => !selectedItems.includes(item.id)));
    setSelectedItems([]);
  };

  const handleAddSelectedToCart = () => {
    selectedItems.forEach(itemId => {
      const item = wishlistItems.find(wishlistItem => wishlistItem.id === itemId);
      if (item) {
        addToCart({
          id: item.productId,
          name: item.name,
          price: item.price,
          image: item.image,
          quantity: 1,
        });
      }
    });
  };

  const getPriceChange = (item: WishlistItem) => {
    if (!item.originalPrice) return null;
    const change = ((item.price - item.originalPrice) / item.originalPrice) * 100;
    return change;
  };

  if (!isAuthenticated) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="info" sx={{ borderRadius: 3 }}>
          Please log in to view your wishlist.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
          My Wishlist
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Save your favorite products for later
        </Typography>
      </Box>

      {/* Actions Bar */}
      {wishlistItems.length > 0 && (
        <Card sx={{ borderRadius: 3, mb: 4 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Button
                  variant="outlined"
                  onClick={handleSelectAll}
                  size="small"
                >
                  {selectedItems.length === wishlistItems.length ? 'Deselect All' : 'Select All'}
                </Button>
                <Typography variant="body2" color="text.secondary">
                  {selectedItems.length} of {wishlistItems.length} selected
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 1 }}>
                {selectedItems.length > 0 && (
                  <>
                    <Button
                      variant="contained"
                      startIcon={<ShoppingCart />}
                      onClick={handleAddSelectedToCart}
                      size="small"
                    >
                      Add Selected to Cart
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<Delete />}
                      onClick={handleRemoveSelected}
                      size="small"
                    >
                      Remove Selected
                    </Button>
                  </>
                )}
              </Box>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Wishlist Items */}
      {loading ? (
        <Grid container spacing={3}>
          {[...Array(4)].map((_, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <Card sx={{ borderRadius: 3 }}>
                <Skeleton variant="rectangular" height={200} />
                <CardContent>
                  <Skeleton variant="text" height={24} />
                  <Skeleton variant="text" height={20} />
                  <Skeleton variant="text" height={20} />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : wishlistItems.length === 0 ? (
        <Card sx={{ borderRadius: 3, textAlign: 'center', py: 8 }}>
          <CardContent>
            <Favorite sx={{ fontSize: 80, color: 'text.secondary', mb: 3 }} />
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
              Your wishlist is empty
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Start adding products to your wishlist to save them for later
            </Typography>
            <Button
              variant="contained"
              size="large"
              href="/products"
              sx={{ borderRadius: 2, textTransform: 'none' }}
            >
              Browse Products
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {wishlistItems.map((item) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
              <Card 
                sx={{ 
                  borderRadius: 3,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                  },
                }}
              >
                {/* Product Image */}
                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={item.image}
                    alt={item.name}
                    sx={{ objectFit: 'cover' }}
                  />
                  
                  {/* Badges */}
                  <Box sx={{ position: 'absolute', top: 12, left: 12, display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {item.isNew && (
                      <Chip label="NEW" color="success" size="small" />
                    )}
                    {item.discount && (
                      <Chip label={`-${item.discount}%`} color="error" size="small" />
                    )}
                    {item.isOnSale && (
                      <Chip label="SALE" color="warning" size="small" />
                    )}
                  </Box>

                  {/* Price Change Indicator */}
                  {getPriceChange(item) && (
                    <Box sx={{ position: 'absolute', top: 12, right: 12 }}>
                      <Chip
                        icon={getPriceChange(item)! < 0 ? <TrendingDown /> : <TrendingUp />}
                        label={`${getPriceChange(item)! > 0 ? '+' : ''}${getPriceChange(item)!.toFixed(1)}%`}
                        color={getPriceChange(item)! < 0 ? 'success' : 'error'}
                        size="small"
                      />
                    </Box>
                  )}

                  {/* Action Buttons */}
                  <Box sx={{ position: 'absolute', bottom: 12, right: 12, display: 'flex', gap: 1 }}>
                    <Tooltip title="View Product">
                      <IconButton
                        sx={{
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          '&:hover': { backgroundColor: 'white' },
                        }}
                        size="small"
                      >
                        <Visibility />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Remove from Wishlist">
                      <IconButton
                        sx={{
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          '&:hover': { backgroundColor: 'white' },
                        }}
                        size="small"
                        color="error"
                        onClick={() => handleRemoveFromWishlist(item.id)}
                      >
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>

                {/* Product Info */}
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="caption" color="primary.main" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {item.brand}
                  </Typography>
                  
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, lineHeight: 1.3 }}>
                    {item.name}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
                    {item.description.length > 80 
                      ? `${item.description.substring(0, 80)}...` 
                      : item.description
                    }
                  </Typography>

                  {/* Rating */}
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Rating value={item.rating} precision={0.1} size="small" readOnly />
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                      ({item.reviews})
                    </Typography>
                  </Box>

                  {/* Price */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                      ${item.price}
                    </Typography>
                    {item.originalPrice && (
                      <Typography
                        variant="body2"
                        sx={{
                          textDecoration: 'line-through',
                          color: 'text.secondary',
                        }}
                      >
                        ${item.originalPrice}
                      </Typography>
                    )}
                  </Box>

                  {/* Stock Status */}
                  <Box sx={{ mb: 2 }}>
                    <Chip
                      label={item.stock > 10 ? 'In Stock' : item.stock > 0 ? 'Low Stock' : 'Out of Stock'}
                      color={item.stock > 10 ? 'success' : item.stock > 0 ? 'warning' : 'error'}
                      size="small"
                    />
                  </Box>

                  {/* Added Date */}
                  <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                    Added on {new Date(item.addedDate).toLocaleDateString()}
                  </Typography>

                  {/* Action Buttons */}
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="contained"
                      startIcon={<ShoppingCart />}
                      onClick={() => handleAddToCart(item)}
                      disabled={item.stock === 0}
                      fullWidth
                      sx={{ borderRadius: 2 }}
                    >
                      Add to Cart
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Wishlist Summary */}
      {wishlistItems.length > 0 && (
        <Card sx={{ borderRadius: 3, mt: 4 }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              Wishlist Summary
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    {wishlistItems.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Items
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                    ${wishlistItems.reduce((sum, item) => sum + item.price, 0).toFixed(2)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Value
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'warning.main' }}>
                    {wishlistItems.filter(item => item.discount).length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    On Sale
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'info.main' }}>
                    {wishlistItems.filter(item => item.isNew).length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    New Items
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}
    </Container>
  );
};

export default WishlistPage; 