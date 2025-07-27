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
  Rating,
  TextField,
  Avatar,
  Chip,
  Alert,
  Skeleton,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  IconButton,
  Tabs,
  Tab,
  Paper,
  Badge,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  Star,
  ShoppingCart,
  Favorite,
  FavoriteBorder,
  Share,
  Compare,
  Add,
  Remove,
  LocalOffer,
  TrendingUp,
  TrendingDown,
  Send,
  Close,
  ExpandMore,
  ThumbUp,
  ThumbDown,
  Verified,
  Helpful,
  Edit,
  Delete,
  Check,
  Visibility,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
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

interface Review {
  id: number;
  userId: number;
  userName: string;
  userAvatar: string;
  rating: number;
  title: string;
  content: string;
  date: string;
  helpful: number;
  notHelpful: number;
  verified: boolean;
  images?: string[];
  pros?: string[];
  cons?: string[];
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`product-tabpanel-${index}`}
      aria-labelledby={`product-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const ProductDetailPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [tabValue, setTabValue] = useState(0);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [compareItems, setCompareItems] = useState<number[]>([]);
  const [openReviewDialog, setOpenReviewDialog] = useState(false);
  const [openCompareDialog, setOpenCompareDialog] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 0,
    title: '',
    content: '',
    pros: '',
    cons: '',
  });

  // Mock data - sẽ được thay thế bằng API calls
  const mockProduct: Product = {
    id: 1,
    name: 'Gaming Laptop Pro',
    description: 'High-performance gaming laptop with RTX 4080, 32GB RAM, 1TB SSD. Perfect for gaming, content creation, and professional work.',
    price: 1299.99,
    originalPrice: 1499.99,
    images: [
      'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800',
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800',
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800',
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800',
    ],
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
      'OS': 'Windows 11 Pro',
      'Connectivity': 'Wi-Fi 6E, Bluetooth 5.2',
      'Ports': 'USB-C, USB-A, HDMI, Ethernet',
    },
    features: [
      'RGB Gaming Keyboard',
      'Advanced Cooling System',
      'Thunderbolt 4 Support',
      'Gaming Mode Optimization',
      'Customizable RGB Lighting',
      'High Refresh Rate Display',
      'VR Ready',
      'Ray Tracing Support',
    ],
    discount: 13,
    isNew: true,
  };

  const mockReviews: Review[] = [
    {
      id: 1,
      userId: 1,
      userName: 'John Doe',
      userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      rating: 5,
      title: 'Excellent gaming performance!',
      content: 'This laptop exceeded my expectations. The RTX 4080 handles all modern games at ultra settings with ease. The build quality is solid and the cooling system works great even under heavy load.',
      date: '2024-01-15',
      helpful: 24,
      notHelpful: 2,
      verified: true,
      images: ['https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400'],
      pros: ['Excellent performance', 'Great build quality', 'Good cooling'],
      cons: ['Expensive', 'Heavy'],
    },
    {
      id: 2,
      userId: 2,
      userName: 'Sarah Wilson',
      userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
      rating: 4,
      title: 'Great for both gaming and work',
      content: 'Perfect balance between gaming performance and professional work. The 4K display is stunning and the keyboard is comfortable for long typing sessions.',
      date: '2024-01-12',
      helpful: 18,
      notHelpful: 1,
      verified: true,
      pros: ['Great performance', 'Beautiful display', 'Comfortable keyboard'],
      cons: ['Battery life could be better'],
    },
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setProduct(mockProduct);
      setReviews(mockReviews);
      setLoading(false);
    }, 1000);
  }, [productId]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        quantity: quantity,
      });
    }
  };

  const handleToggleFavorite = () => {
    if (product) {
      setFavorites(prev => 
        prev.includes(product.id) 
          ? prev.filter(id => id !== product.id)
          : [...prev, product.id]
      );
    }
  };

  const handleAddToCompare = () => {
    if (product) {
      setCompareItems(prev => 
        prev.includes(product.id) 
          ? prev.filter(id => id !== product.id)
          : [...prev, product.id]
      );
    }
  };

  const handleQuantityChange = (increment: boolean) => {
    if (increment) {
      setQuantity(prev => Math.min(prev + 1, product?.stock || 1));
    } else {
      setQuantity(prev => Math.max(prev - 1, 1));
    }
  };

  const handleReviewSubmit = () => {
    // Simulate API call
    const newReview: Review = {
      id: reviews.length + 1,
      userId: user?.id || 1,
      userName: user?.firstName + ' ' + user?.lastName || 'Anonymous',
      userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      rating: reviewForm.rating,
      title: reviewForm.title,
      content: reviewForm.content,
      date: new Date().toISOString().split('T')[0],
      helpful: 0,
      notHelpful: 0,
      verified: true,
      pros: reviewForm.pros ? reviewForm.pros.split(',').map(p => p.trim()) : [],
      cons: reviewForm.cons ? reviewForm.cons.split(',').map(c => c.trim()) : [],
    };
    
    setReviews(prev => [newReview, ...prev]);
    setReviewForm({
      rating: 0,
      title: '',
      content: '',
      pros: '',
      cons: '',
    });
    setOpenReviewDialog(false);
  };

  const handleHelpful = (reviewId: number) => {
    setReviews(prev => 
      prev.map(review => 
        review.id === reviewId 
          ? { ...review, helpful: review.helpful + 1 }
          : review
      )
    );
  };

  const handleNotHelpful = (reviewId: number) => {
    setReviews(prev => 
      prev.map(review => 
        review.id === reviewId 
          ? { ...review, notHelpful: review.notHelpful + 1 }
          : review
      )
    );
  };

  const getPriceChange = () => {
    if (!product?.originalPrice) return null;
    const change = ((product.price - product.originalPrice) / product.originalPrice) * 100;
    return change;
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Skeleton variant="rectangular" height={400} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Skeleton variant="text" height={40} />
            <Skeleton variant="text" height={30} />
            <Skeleton variant="text" height={30} />
            <Skeleton variant="text" height={100} />
          </Grid>
        </Grid>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ borderRadius: 3 }}>
          Product not found.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Product Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
          {product.name}
        </Typography>
        <Typography variant="h6" color="text.secondary">
          {product.brand} • {product.category}
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Product Images */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3, mb: 2 }}>
            <CardMedia
              component="img"
              height="400"
              image={product.images[selectedImage]}
              alt={product.name}
              sx={{ objectFit: 'cover' }}
            />
          </Card>
          
          {/* Thumbnail Images */}
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {product.images.map((image, index) => (
              <Card
                key={index}
                sx={{
                  width: 80,
                  height: 80,
                  cursor: 'pointer',
                  border: selectedImage === index ? '2px solid' : '1px solid',
                  borderColor: selectedImage === index ? 'primary.main' : 'divider',
                  borderRadius: 2,
                }}
                onClick={() => setSelectedImage(index)}
              >
                <CardMedia
                  component="img"
                  height="100%"
                  image={image}
                  alt={`${product.name} ${index + 1}`}
                  sx={{ objectFit: 'cover' }}
                />
              </Card>
            ))}
          </Box>
        </Grid>

        {/* Product Info */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3, mb: 3 }}>
            <CardContent>
              {/* Rating and Reviews */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Rating value={product.rating} precision={0.1} readOnly />
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  {product.rating}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  ({product.reviews} reviews)
                </Typography>
                <Button
                  variant="text"
                  onClick={() => setTabValue(1)}
                  sx={{ textTransform: 'none' }}
                >
                  View all reviews
                </Button>
              </Box>

              {/* Price */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                  ${product.price}
                </Typography>
                {product.originalPrice && (
                  <Typography
                    variant="h5"
                    sx={{
                      textDecoration: 'line-through',
                      color: 'text.secondary',
                    }}
                  >
                    ${product.originalPrice}
                  </Typography>
                )}
                {product.discount && (
                  <Chip
                    label={`-${product.discount}%`}
                    color="error"
                    size="large"
                  />
                )}
              </Box>

              {/* Price Change Indicator */}
              {getPriceChange() && (
                <Box sx={{ mb: 3 }}>
                  <Chip
                    icon={getPriceChange()! < 0 ? <TrendingDown /> : <TrendingUp />}
                    label={`${getPriceChange()! > 0 ? '+' : ''}${getPriceChange()!.toFixed(1)}% from original price`}
                    color={getPriceChange()! < 0 ? 'success' : 'error'}
                    variant="outlined"
                  />
                </Box>
              )}

              {/* Stock Status */}
              <Box sx={{ mb: 3 }}>
                <Chip
                  label={product.stock > 10 ? 'In Stock' : product.stock > 0 ? 'Low Stock' : 'Out of Stock'}
                  color={product.stock > 10 ? 'success' : product.stock > 0 ? 'warning' : 'error'}
                  size="large"
                />
              </Box>

              {/* Quantity Selector */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  Quantity:
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                  <IconButton
                    onClick={() => handleQuantityChange(false)}
                    disabled={quantity <= 1}
                  >
                    <Remove />
                  </IconButton>
                  <Typography sx={{ px: 2, minWidth: 40, textAlign: 'center' }}>
                    {quantity}
                  </Typography>
                  <IconButton
                    onClick={() => handleQuantityChange(true)}
                    disabled={quantity >= product.stock}
                  >
                    <Add />
                  </IconButton>
                </Box>
              </Box>

              {/* Action Buttons */}
              <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<ShoppingCart />}
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  fullWidth
                  sx={{ borderRadius: 2, py: 1.5 }}
                >
                  Add to Cart
                </Button>
                <IconButton
                  onClick={handleToggleFavorite}
                  color={favorites.includes(product.id) ? 'error' : 'default'}
                  sx={{ border: '1px solid', borderColor: 'divider' }}
                >
                  {favorites.includes(product.id) ? <Favorite /> : <FavoriteBorder />}
                </IconButton>
                <IconButton
                  onClick={handleAddToCompare}
                  color={compareItems.includes(product.id) ? 'primary' : 'default'}
                  sx={{ border: '1px solid', borderColor: 'divider' }}
                >
                  <Compare />
                </IconButton>
                <IconButton
                  sx={{ border: '1px solid', borderColor: 'divider' }}
                >
                  <Share />
                </IconButton>
              </Box>

              {/* Badges */}
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {product.isNew && (
                  <Chip label="NEW" color="success" />
                )}
                {product.isOnSale && (
                  <Chip label="SALE" color="warning" />
                )}
                <Chip label="Free Shipping" color="info" variant="outlined" />
                <Chip label="30-Day Returns" color="info" variant="outlined" />
              </Box>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                Quick Actions
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => setOpenReviewDialog(true)}
                  startIcon={<Star />}
                  fullWidth
                >
                  Write a Review
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => setOpenCompareDialog(true)}
                  startIcon={<Compare />}
                  fullWidth
                >
                  Compare with Similar Products
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Product Details Tabs */}
      <Paper sx={{ borderRadius: 3, mt: 4 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 'bold',
              minWidth: 120,
            },
          }}
        >
          <Tab label="Description" />
          <Tab label="Reviews" />
          <Tab label="Specifications" />
          <Tab label="Features" />
        </Tabs>

        {/* Description Tab */}
        <TabPanel value={tabValue} index={0}>
          <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
            {product.description}
          </Typography>
        </TabPanel>

        {/* Reviews Tab */}
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Customer Reviews ({reviews.length})
            </Typography>
            <Button
              variant="contained"
              startIcon={<Star />}
              onClick={() => setOpenReviewDialog(true)}
            >
              Write Review
            </Button>
          </Box>

          {reviews.length === 0 ? (
            <Alert severity="info" sx={{ borderRadius: 3 }}>
              No reviews yet. Be the first to review this product!
            </Alert>
          ) : (
            <List>
              {reviews.map((review) => (
                <ListItem key={review.id} sx={{ display: 'block', mb: 2 }}>
                  <Card sx={{ borderRadius: 3 }}>
                    <CardContent>
                      {/* Review Header */}
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                        <Avatar src={review.userAvatar} sx={{ width: 50, height: 50 }} />
                        <Box sx={{ flexGrow: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                              {review.userName}
                            </Typography>
                            {review.verified && (
                              <Tooltip title="Verified Purchase">
                                <Verified color="primary" fontSize="small" />
                              </Tooltip>
                            )}
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <Rating value={review.rating} readOnly size="small" />
                            <Typography variant="body2" color="text.secondary">
                              {review.date}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>

                      {/* Review Content */}
                      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                        {review.title}
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.6 }}>
                        {review.content}
                      </Typography>

                      {/* Pros and Cons */}
                      {(review.pros || review.cons) && (
                        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                          {review.pros && review.pros.length > 0 && (
                            <Box>
                              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'success.main', mb: 1 }}>
                                Pros:
                              </Typography>
                              <List dense>
                                {review.pros.map((pro, index) => (
                                  <ListItem key={index} sx={{ py: 0 }}>
                                    <ListItemText primary={pro} />
                                  </ListItem>
                                ))}
                              </List>
                            </Box>
                          )}
                          {review.cons && review.cons.length > 0 && (
                            <Box>
                              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'error.main', mb: 1 }}>
                                Cons:
                              </Typography>
                              <List dense>
                                {review.cons.map((con, index) => (
                                  <ListItem key={index} sx={{ py: 0 }}>
                                    <ListItemText primary={con} />
                                  </ListItem>
                                ))}
                              </List>
                            </Box>
                          )}
                        </Box>
                      )}

                      {/* Review Actions */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Button
                          size="small"
                          startIcon={<ThumbUp />}
                          onClick={() => handleHelpful(review.id)}
                        >
                          Helpful ({review.helpful})
                        </Button>
                        <Button
                          size="small"
                          startIcon={<ThumbDown />}
                          onClick={() => handleNotHelpful(review.id)}
                        >
                          Not Helpful ({review.notHelpful})
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </ListItem>
              ))}
            </List>
          )}
        </TabPanel>

        {/* Specifications Tab */}
        <TabPanel value={tabValue} index={2}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Specification</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Value</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.entries(product.specs).map(([key, value]) => (
                  <TableRow key={key}>
                    <TableCell sx={{ fontWeight: 'bold' }}>{key}</TableCell>
                    <TableCell>{value}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Features Tab */}
        <TabPanel value={tabValue} index={3}>
          <Grid container spacing={2}>
            {product.features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card sx={{ borderRadius: 2, p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Check color="success" />
                    <Typography variant="body1">{feature}</Typography>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>
      </Paper>

      {/* Write Review Dialog */}
      <Dialog
        open={openReviewDialog}
        onClose={() => setOpenReviewDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Write a Review for {product.name}
            </Typography>
            <IconButton onClick={() => setOpenReviewDialog(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <Typography component="legend">Rating</Typography>
              <Rating
                size="large"
                value={reviewForm.rating}
                onChange={(event, newValue) => {
                  setReviewForm(prev => ({ ...prev, rating: newValue || 0 }));
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Review Title"
                placeholder="Summarize your experience"
                value={reviewForm.title}
                onChange={(e) => setReviewForm(prev => ({ ...prev, title: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Review Content"
                multiline
                rows={4}
                placeholder="Share your detailed experience with this product..."
                value={reviewForm.content}
                onChange={(e) => setReviewForm(prev => ({ ...prev, content: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Pros (optional)"
                placeholder="What you liked about this product"
                value={reviewForm.pros}
                onChange={(e) => setReviewForm(prev => ({ ...prev, pros: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Cons (optional)"
                placeholder="What could be improved"
                value={reviewForm.cons}
                onChange={(e) => setReviewForm(prev => ({ ...prev, cons: e.target.value }))}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenReviewDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            startIcon={<Send />}
            onClick={handleReviewSubmit}
            disabled={!reviewForm.rating || !reviewForm.title || !reviewForm.content}
          >
            Submit Review
          </Button>
        </DialogActions>
      </Dialog>

      {/* Compare Dialog */}
      <Dialog
        open={openCompareDialog}
        onClose={() => setOpenCompareDialog(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Compare Products
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Select products to compare with {product.name}
          </Typography>
          
          <Grid container spacing={2}>
            {[
              { id: 2, name: 'Wireless Headphones', price: 199.99, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400' },
              { id: 3, name: 'Smartphone X Pro', price: 899.99, image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400' },
              { id: 4, name: '4K Monitor', price: 399.99, image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400' },
            ].map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item.id}>
                <Card
                  sx={{
                    borderRadius: 3,
                    cursor: 'pointer',
                    border: compareItems.includes(item.id) ? '2px solid' : '1px solid',
                    borderColor: compareItems.includes(item.id) ? 'primary.main' : 'divider',
                  }}
                  onClick={() => handleAddToCompare()}
                >
                  <CardMedia
                    component="img"
                    height="150"
                    image={item.image}
                    alt={item.name}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                      {item.name}
                    </Typography>
                    <Typography variant="h6" color="primary.main">
                      ${item.price}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCompareDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => {
              setOpenCompareDialog(false);
              navigate('/compare');
            }}
          >
            Compare Selected
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ProductDetailPage; 