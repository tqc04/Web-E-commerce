import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Rating,
  Alert,
  Skeleton,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Badge,
  Tooltip,
} from '@mui/material';
import {
  Compare,
  Add,
  Remove,
  ShoppingCart,
  Favorite,
  FavoriteBorder,
  Delete,
  Check,
  Close,
  Star,
  LocalOffer,
  TrendingUp,
  TrendingDown,
} from '@mui/icons-material';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

interface Product {
  id: number;
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
  specs: {
    [key: string]: string | number;
  };
  features: string[];
  discount?: number;
  isNew?: boolean;
  isOnSale?: boolean;
}

const ComparePage: React.FC = () => {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [compareItems, setCompareItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<number[]>([]);

  // Mock data - sẽ được thay thế bằng API calls
  const mockProducts: Product[] = [
    {
      id: 1,
      name: 'Gaming Laptop Pro',
      description: 'High-performance gaming laptop with RTX 4080',
      price: 1299.99,
      originalPrice: 1499.99,
      image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400',
      category: 'Electronics',
      brand: 'GamingTech',
      rating: 4.8,
      reviews: 124,
      stock: 25,
      specs: {
        'Processor': 'Intel Core i9-13900K',
        'Graphics': 'RTX 4080 16GB',
        'RAM': '32GB DDR5',
        'Storage': '1TB NVMe SSD',
        'Display': '15.6" 4K 144Hz',
        'Weight': '2.5kg',
        'Battery': '6 hours',
      },
      features: ['RGB Keyboard', 'Wi-Fi 6E', 'Thunderbolt 4', 'Gaming Mode'],
      discount: 13,
      isNew: true,
    },
    {
      id: 2,
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
      specs: {
        'Driver Size': '40mm',
        'Frequency Response': '20Hz-20kHz',
        'Battery Life': '30 hours',
        'Connectivity': 'Bluetooth 5.0',
        'Weight': '250g',
        'Noise Cancellation': 'Active',
      },
      features: ['Active Noise Cancellation', 'Touch Controls', 'Quick Charge', 'Multi-device'],
      discount: 20,
      isOnSale: true,
    },
    {
      id: 3,
      name: 'Smartphone X Pro',
      description: 'Latest smartphone with 5G and advanced camera system',
      price: 899.99,
      originalPrice: 999.99,
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',
      category: 'Mobile',
      brand: 'TechPhone',
      rating: 4.9,
      reviews: 256,
      stock: 15,
      specs: {
        'Processor': 'Snapdragon 8 Gen 2',
        'RAM': '12GB LPDDR5',
        'Storage': '256GB UFS 4.0',
        'Display': '6.7" AMOLED 120Hz',
        'Camera': '108MP + 12MP + 12MP',
        'Battery': '5000mAh',
        'Charging': '100W Fast Charging',
      },
      features: ['5G', 'Wireless Charging', 'IP68 Waterproof', 'Face Recognition'],
      discount: 10,
      isNew: true,
    },
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setCompareItems(mockProducts);
      setLoading(false);
    }, 1000);
  }, []);

  const handleRemoveFromCompare = (productId: number) => {
    setCompareItems(prev => prev.filter(item => item.id !== productId));
  };

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    });
  };

  const handleToggleFavorite = (productId: number) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const getPriceChange = (product: Product) => {
    if (!product.originalPrice) return null;
    const change = ((product.price - product.originalPrice) / product.originalPrice) * 100;
    return change;
  };

  const allSpecs = compareItems.length > 0 
    ? Object.keys(compareItems[0].specs)
    : [];

  if (!isAuthenticated) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="info" sx={{ borderRadius: 3 }}>
          Please log in to compare products.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
          Compare Products
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Compare specifications and features to make the best choice
        </Typography>
      </Box>

      {/* Compare Summary */}
      {compareItems.length > 0 && (
        <Card sx={{ borderRadius: 3, mb: 4 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Comparing {compareItems.length} products
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<Add />}
                  href="/products"
                >
                  Add More Products
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<Delete />}
                  onClick={() => setCompareItems([])}
                >
                  Clear All
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Compare Table */}
      {loading ? (
        <Grid container spacing={3}>
          {[...Array(3)].map((_, index) => (
            <Grid item xs={12} md={4} key={index}>
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
      ) : compareItems.length === 0 ? (
        <Card sx={{ borderRadius: 3, textAlign: 'center', py: 8 }}>
          <CardContent>
            <Compare sx={{ fontSize: 80, color: 'text.secondary', mb: 3 }} />
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
              No products to compare
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Add products to your comparison to see their differences
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
        <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', minWidth: 200 }}>Features</TableCell>
                {compareItems.map((product) => (
                  <TableCell key={product.id} align="center" sx={{ minWidth: 250 }}>
                    <Box sx={{ position: 'relative' }}>
                      <IconButton
                        size="small"
                        sx={{ position: 'absolute', top: -8, right: -8, zIndex: 1 }}
                        onClick={() => handleRemoveFromCompare(product.id)}
                      >
                        <Close />
                      </IconButton>
                      
                      <Card sx={{ borderRadius: 2, mb: 2 }}>
                        <CardMedia
                          component="img"
                          height="120"
                          image={product.image}
                          alt={product.name}
                          sx={{ objectFit: 'cover' }}
                        />
                      </Card>
                      
                      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                        {product.name}
                      </Typography>
                      
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {product.brand}
                      </Typography>
                      
                      {/* Rating */}
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                        <Rating value={product.rating} precision={0.1} size="small" readOnly />
                        <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                          ({product.reviews})
                        </Typography>
                      </Box>
                      
                      {/* Price */}
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                          ${product.price}
                        </Typography>
                        {product.originalPrice && (
                          <Typography
                            variant="body2"
                            sx={{
                              textDecoration: 'line-through',
                              color: 'text.secondary',
                            }}
                          >
                            ${product.originalPrice}
                          </Typography>
                        )}
                      </Box>
                      
                      {/* Badges */}
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 2 }}>
                        {product.isNew && (
                          <Chip label="NEW" color="success" size="small" />
                        )}
                        {product.discount && (
                          <Chip label={`-${product.discount}%`} color="error" size="small" />
                        )}
                        {product.isOnSale && (
                          <Chip label="SALE" color="warning" size="small" />
                        )}
                      </Box>
                      
                      {/* Action Buttons */}
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                        <Tooltip title="Add to Cart">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleAddToCart(product)}
                            disabled={product.stock === 0}
                          >
                            <ShoppingCart />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={favorites.includes(product.id) ? 'Remove from Favorites' : 'Add to Favorites'}>
                          <IconButton
                            size="small"
                            color={favorites.includes(product.id) ? 'error' : 'default'}
                            onClick={() => handleToggleFavorite(product.id)}
                          >
                            {favorites.includes(product.id) ? <Favorite /> : <FavoriteBorder />}
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            
            <TableBody>
              {/* Specifications */}
              {allSpecs.map((spec) => (
                <TableRow key={spec}>
                  <TableCell sx={{ fontWeight: 'bold', bgcolor: 'background.default' }}>
                    {spec}
                  </TableCell>
                  {compareItems.map((product) => (
                    <TableCell key={`${product.id}-${spec}`} align="center">
                      <Typography variant="body2">
                        {product.specs[spec]}
                      </Typography>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
              
              {/* Features */}
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', bgcolor: 'background.default' }}>
                  Features
                </TableCell>
                {compareItems.map((product) => (
                  <TableCell key={`${product.id}-features`} align="center">
                    <List dense>
                      {product.features.map((feature, index) => (
                        <ListItem key={index} sx={{ py: 0 }}>
                          <ListItemIcon sx={{ minWidth: 30 }}>
                            <Check color="success" fontSize="small" />
                          </ListItemIcon>
                          <ListItemText
                            primary={feature}
                            primaryTypographyProps={{ variant: 'body2' }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </TableCell>
                ))}
              </TableRow>
              
              {/* Stock Status */}
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', bgcolor: 'background.default' }}>
                  Stock Status
                </TableCell>
                {compareItems.map((product) => (
                  <TableCell key={`${product.id}-stock`} align="center">
                    <Chip
                      label={product.stock > 10 ? 'In Stock' : product.stock > 0 ? 'Low Stock' : 'Out of Stock'}
                      color={product.stock > 10 ? 'success' : product.stock > 0 ? 'warning' : 'error'}
                      size="small"
                    />
                  </TableCell>
                ))}
              </TableRow>
              
              {/* Price Change */}
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', bgcolor: 'background.default' }}>
                  Price Change
                </TableCell>
                {compareItems.map((product) => (
                  <TableCell key={`${product.id}-price-change`} align="center">
                    {getPriceChange(product) ? (
                      <Chip
                        icon={getPriceChange(product)! < 0 ? <TrendingDown /> : <TrendingUp />}
                        label={`${getPriceChange(product)! > 0 ? '+' : ''}${getPriceChange(product)!.toFixed(1)}%`}
                        color={getPriceChange(product)! < 0 ? 'success' : 'error'}
                        size="small"
                      />
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No change
                      </Typography>
                    )}
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Comparison Summary */}
      {compareItems.length > 1 && (
        <Card sx={{ borderRadius: 3, mt: 4 }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
              Comparison Summary
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                    Best Value
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                    ${Math.min(...compareItems.map(item => item.price)).toFixed(2)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Lowest price among compared items
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                    Highest Rated
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'warning.main' }}>
                    {Math.max(...compareItems.map(item => item.rating)).toFixed(1)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Best customer rating
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                    Most Reviews
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'info.main' }}>
                    {Math.max(...compareItems.map(item => item.reviews))}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Most customer feedback
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

export default ComparePage; 