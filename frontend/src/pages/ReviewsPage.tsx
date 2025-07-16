import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Paper,
  Badge,
  Tooltip,
} from '@mui/material';
import {
  Star,
  ThumbUp,
  ThumbDown,
  Edit,
  Delete,
  Add,
  FilterList,
  Sort,
  Search,
  Helpful,
  Verified,
  LocalOffer,
  TrendingUp,
  TrendingDown,
  Send,
  Close,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

interface Review {
  id: number;
  productId: number;
  productName: string;
  productImage: string;
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
  category: string;
}

const ReviewsPage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [openReviewDialog, setOpenReviewDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - sẽ được thay thế bằng API calls
  const mockReviews: Review[] = [
    {
      id: 1,
      productId: 1,
      productName: 'Gaming Laptop Pro',
      productImage: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400',
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
      category: 'Electronics',
    },
    {
      id: 2,
      productId: 2,
      productName: 'Wireless Noise-Canceling Headphones',
      productImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
      userId: 2,
      userName: 'Sarah Wilson',
      userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
      rating: 4,
      title: 'Great sound quality, comfortable fit',
      content: 'The noise cancellation is impressive and the sound quality is excellent. Very comfortable for long listening sessions. Battery life is as advertised.',
      date: '2024-01-12',
      helpful: 18,
      notHelpful: 1,
      verified: true,
      pros: ['Great sound', 'Comfortable', 'Good battery life'],
      cons: ['Expensive', 'Large case'],
      category: 'Audio',
    },
    {
      id: 3,
      productId: 3,
      productName: 'Smartphone X Pro',
      productImage: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',
      userId: 3,
      userName: 'Mike Johnson',
      userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      rating: 5,
      title: 'Best smartphone I\'ve ever owned',
      content: 'The camera quality is outstanding, battery life is excellent, and the performance is smooth. The 5G connectivity is fast and reliable.',
      date: '2024-01-10',
      helpful: 31,
      notHelpful: 0,
      verified: true,
      images: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400'],
      pros: ['Excellent camera', 'Great battery life', 'Fast performance'],
      cons: ['Premium price'],
      category: 'Mobile',
    },
    {
      id: 4,
      productId: 4,
      productName: '4K Ultra HD Monitor',
      productImage: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400',
      userId: 4,
      userName: 'Emily Chen',
      userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
      rating: 4,
      title: 'Beautiful display, minor issues',
      content: 'The 4K resolution is stunning and colors are vibrant. HDR support works well. However, there are some backlight bleeding issues in dark scenes.',
      date: '2024-01-08',
      helpful: 12,
      notHelpful: 3,
      verified: false,
      pros: ['Beautiful display', 'Good colors', 'HDR support'],
      cons: ['Backlight bleeding', 'Expensive'],
      category: 'Computers',
    },
  ];

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'Electronics', label: 'Electronics' },
    { value: 'Audio', label: 'Audio' },
    { value: 'Mobile', label: 'Mobile' },
    { value: 'Computers', label: 'Computers' },
    { value: 'Gaming', label: 'Gaming' },
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setReviews(mockReviews);
      setLoading(false);
    }, 1000);
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleOpenReviewDialog = (product?: any) => {
    setSelectedProduct(product);
    setOpenReviewDialog(true);
  };

  const handleCloseReviewDialog = () => {
    setOpenReviewDialog(false);
    setSelectedProduct(null);
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

  const filteredReviews = reviews.filter(review => {
    const matchesCategory = filterCategory === 'all' || review.category === filterCategory;
    const matchesSearch = review.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const sortedReviews = [...filteredReviews].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case 'rating':
        return b.rating - a.rating;
      case 'helpful':
        return b.helpful - a.helpful;
      default:
        return 0;
    }
  });

  const myReviews = sortedReviews.filter(review => review.userId === user?.id);
  const allReviews = sortedReviews;

  if (!isAuthenticated) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="info" sx={{ borderRadius: 3 }}>
          Please log in to view and write reviews.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
          Product Reviews
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Read and write reviews to help other customers make informed decisions
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                {reviews.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Reviews
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                {(reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Average Rating
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'warning.main' }}>
                {myReviews.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                My Reviews
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'info.main' }}>
                {reviews.filter(review => review.verified).length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Verified Reviews
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Paper sx={{ borderRadius: 3, mb: 4 }}>
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
          <Tab label="All Reviews" />
          <Tab label="My Reviews" />
          <Tab label="Write Review" />
        </Tabs>

        {/* All Reviews Tab */}
        {tabValue === 0 && (
          <Box sx={{ p: 3 }}>
            {/* Filters */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
              <TextField
                placeholder="Search reviews..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                size="small"
                sx={{ minWidth: 200 }}
                InputProps={{
                  startAdornment: <Search sx={{ mr: 1, color: 'action.active' }} />,
                }}
              />
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Category</InputLabel>
                <Select
                  value={filterCategory}
                  label="Category"
                  onChange={(e) => setFilterCategory(e.target.value)}
                >
                  {categories.map((category) => (
                    <MenuItem key={category.value} value={category.value}>
                      {category.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={sortBy}
                  label="Sort By"
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <MenuItem value="recent">Most Recent</MenuItem>
                  <MenuItem value="rating">Highest Rated</MenuItem>
                  <MenuItem value="helpful">Most Helpful</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* Reviews List */}
            {loading ? (
              <Grid container spacing={3}>
                {[...Array(4)].map((_, index) => (
                  <Grid item xs={12} key={index}>
                    <Card sx={{ borderRadius: 3 }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                          <Skeleton variant="circular" width={50} height={50} />
                          <Box sx={{ flexGrow: 1 }}>
                            <Skeleton variant="text" width="60%" />
                            <Skeleton variant="text" width="40%" />
                          </Box>
                        </Box>
                        <Skeleton variant="text" />
                        <Skeleton variant="text" />
                        <Skeleton variant="text" width="80%" />
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <List>
                {allReviews.map((review) => (
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
                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                              {review.productName}
                            </Typography>
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

                        {/* Review Images */}
                        {review.images && review.images.length > 0 && (
                          <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                            {review.images.map((image, index) => (
                              <img
                                key={index}
                                src={image}
                                alt={`Review ${index + 1}`}
                                style={{
                                  width: 80,
                                  height: 80,
                                  objectFit: 'cover',
                                  borderRadius: 8,
                                }}
                              />
                            ))}
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
                          {review.userId === user?.id && (
                            <>
                              <IconButton size="small" color="primary">
                                <Edit />
                              </IconButton>
                              <IconButton size="small" color="error">
                                <Delete />
                              </IconButton>
                            </>
                          )}
                        </Box>
                      </CardContent>
                    </Card>
                  </ListItem>
                ))}
              </List>
            )}
          </Box>
        )}

        {/* My Reviews Tab */}
        {tabValue === 1 && (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
              My Reviews ({myReviews.length})
            </Typography>
            
            {myReviews.length === 0 ? (
              <Alert severity="info" sx={{ borderRadius: 3 }}>
                You haven't written any reviews yet. Start by reviewing products you've purchased!
              </Alert>
            ) : (
              <List>
                {myReviews.map((review) => (
                  <ListItem key={review.id} sx={{ display: 'block', mb: 2 }}>
                    <Card sx={{ borderRadius: 3 }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                          <img
                            src={review.productImage}
                            alt={review.productName}
                            style={{
                              width: 60,
                              height: 60,
                              objectFit: 'cover',
                              borderRadius: 8,
                            }}
                          />
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                              {review.productName}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Rating value={review.rating} readOnly size="small" />
                              <Typography variant="body2" color="text.secondary">
                                {review.date}
                              </Typography>
                            </Box>
                          </Box>
                          <Box>
                            <IconButton size="small" color="primary">
                              <Edit />
                            </IconButton>
                            <IconButton size="small" color="error">
                              <Delete />
                            </IconButton>
                          </Box>
                        </Box>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                          {review.title}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                          {review.content}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Chip
                            icon={<ThumbUp />}
                            label={`${review.helpful} helpful`}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                          <Chip
                            icon={<ThumbDown />}
                            label={`${review.notHelpful} not helpful`}
                            size="small"
                            color="error"
                            variant="outlined"
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  </ListItem>
                ))}
              </List>
            )}
          </Box>
        )}

        {/* Write Review Tab */}
        {tabValue === 2 && (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
              Write a Review
            </Typography>
            
            <Alert severity="info" sx={{ borderRadius: 3, mb: 3 }}>
              You can only review products you have purchased. Browse your order history to find products to review.
            </Alert>
            
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => handleOpenReviewDialog()}
              sx={{ borderRadius: 2 }}
            >
              Write New Review
            </Button>
          </Box>
        )}
      </Paper>

      {/* Write Review Dialog */}
      <Dialog
        open={openReviewDialog}
        onClose={handleCloseReviewDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Write a Review
            </Typography>
            <IconButton onClick={handleCloseReviewDialog}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Select Product</InputLabel>
                <Select label="Select Product">
                  <MenuItem value="1">Gaming Laptop Pro</MenuItem>
                  <MenuItem value="2">Wireless Headphones</MenuItem>
                  <MenuItem value="3">Smartphone X Pro</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Typography component="legend">Rating</Typography>
              <Rating size="large" />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Review Title"
                placeholder="Summarize your experience"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Review Content"
                multiline
                rows={4}
                placeholder="Share your detailed experience with this product..."
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Pros (optional)"
                placeholder="What you liked about this product"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Cons (optional)"
                placeholder="What could be improved"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseReviewDialog}>Cancel</Button>
          <Button variant="contained" startIcon={<Send />}>
            Submit Review
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ReviewsPage; 