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
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Rating,
  IconButton,
  Pagination,
  Slider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Alert,
  Skeleton,
  Fab,
  Badge,
} from '@mui/material';
import {
  Search,
  FilterList,
  ShoppingCart,
  Favorite,
  FavoriteBorder,
  Star,
  LocalOffer,
  Category,
  PriceCheck,
  Sort,
  ViewList,
  ViewModule,
  Clear,
  Add,
  Remove,
  ExpandMore,
  FilterAlt,
  Close,
  Visibility,
} from '@mui/icons-material';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { apiService, Product } from '../services/api';

// Extended Product interface for UI
interface ProductWithUI extends Product {
  originalPrice?: number;
  reviews: number;
  images: string[];
  tags: string[];
  discount?: number;
  isNew?: boolean;
  isFeatured?: boolean;
}

const ProductsPage: React.FC = () => {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [priceRange, setPriceRange] = useState<number[]>([0, 1000000000]);
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [itemsPerPage] = useState(12);

  // Mock data - sẽ được thay thế bằng API calls
  const mockProducts: Product[] = [
    {
      id: 1,
      name: 'Gaming Laptop Pro',
      description: 'High-performance gaming laptop with RTX 4080, 32GB RAM, 1TB SSD',
      price: 1299.99,
      imageUrl: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400',
      category: 'Electronics',
      brand: 'GamingTech',
      stockQuantity: 25,
      rating: 4.8,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
    {
      id: 2,
      name: 'Wireless Noise-Canceling Headphones',
      description: 'Premium wireless headphones with active noise cancellation',
      price: 199.99,
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
      category: 'Audio',
      brand: 'SoundMaster',
      stockQuantity: 50,
      rating: 4.6,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
    {
      id: 3,
      name: 'Smartphone X Pro',
      description: 'Latest smartphone with 5G, 256GB storage, and advanced camera system',
      price: 899.99,
      imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',
      category: 'Mobile',
      brand: 'TechPhone',
      stockQuantity: 15,
      rating: 4.9,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
    {
      id: 4,
      name: '4K Ultra HD Monitor',
      description: '27-inch 4K monitor with HDR support and 144Hz refresh rate',
      price: 399.99,
      imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400',
      category: 'Computers',
      brand: 'DisplayPro',
      stockQuantity: 8,
      rating: 4.7,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
    {
      id: 5,
      name: 'Mechanical Gaming Keyboard',
      description: 'RGB mechanical keyboard with Cherry MX switches',
      price: 149.99,
      imageUrl: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400',
      category: 'Gaming',
      brand: 'GameGear',
      stockQuantity: 35,
      rating: 4.5,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
    {
      id: 6,
      name: 'Wireless Gaming Mouse',
      description: 'High-precision wireless gaming mouse with 25K DPI sensor',
      price: 79.99,
      imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400',
      category: 'Gaming',
      brand: 'GameGear',
      stockQuantity: 42,
      rating: 4.4,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
  ];

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'Electronics', label: 'Electronics' },
    { value: 'Gaming', label: 'Gaming' },
    { value: 'Computers', label: 'Computers' },
    { value: 'Mobile', label: 'Mobile' },
    { value: 'Audio', label: 'Audio' },
    { value: 'Accessories', label: 'Accessories' },
  ];

  const brands = [
    { value: 'all', label: 'All Brands' },
    { value: 'GamingTech', label: 'GamingTech' },
    { value: 'SoundMaster', label: 'SoundMaster' },
    { value: 'TechPhone', label: 'TechPhone' },
    { value: 'DisplayPro', label: 'DisplayPro' },
    { value: 'GameGear', label: 'GameGear' },
  ];

  // Thêm hàm format VND
  const formatVND = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(price);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await apiService.getProducts();
        setProducts(response.data.content);
        setFilteredProducts(response.data.content);
      } catch (error) {
        console.error('Error fetching products:', error);
        // Fallback to mock data if API fails
        setProducts(mockProducts);
        setFilteredProducts(mockProducts);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [searchTerm, selectedCategory, selectedBrand, priceRange, sortBy, products]);

  const filterProducts = () => {
    let filtered = [...products];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Brand filter
    if (selectedBrand !== 'all') {
      filtered = filtered.filter(product => product.brand === selectedBrand);
    }

    // Price range filter
    filtered = filtered.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Sort
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'featured':
      default:
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
    }

    setFilteredProducts(filtered);
    setCurrentPage(1);
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product.id);
  };

  const handleViewProduct = (productId: number) => {
    navigate(`/products/${productId}`);
  };

  const handleToggleFavorite = (productId: number) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedBrand('all');
    setPriceRange([0, 1000000000]);
    setSortBy('featured');
  };

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
          Products
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Discover our amazing collection of products
        </Typography>
      </Box>

      {/* Search and Filter Bar */}
      <Card sx={{ borderRadius: 3, mb: 4 }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            {/* Search */}
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                  endAdornment: searchTerm && (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => setSearchTerm('')}>
                        <Clear />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Category Filter */}
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={selectedCategory}
                  label="Category"
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map((category) => (
                    <MenuItem key={category.value} value={category.value}>
                      {category.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Brand Filter */}
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>Brand</InputLabel>
                <Select
                  value={selectedBrand}
                  label="Brand"
                  onChange={(e) => setSelectedBrand(e.target.value)}
                >
                  {brands.map((brand) => (
                    <MenuItem key={brand.value} value={brand.value}>
                      {brand.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Sort */}
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={sortBy}
                  label="Sort By"
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <MenuItem value="featured">Featured</MenuItem>
                  <MenuItem value="price-low">Price: Low to High</MenuItem>
                  <MenuItem value="price-high">Price: High to Low</MenuItem>
                  <MenuItem value="rating">Highest Rated</MenuItem>
                  <MenuItem value="newest">Newest</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* View Mode and Filter Button */}
            <Grid item xs={12} sm={6} md={2}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton
                  onClick={() => setViewMode('grid')}
                  color={viewMode === 'grid' ? 'primary' : 'default'}
                >
                  <ViewModule />
                </IconButton>
                <IconButton
                  onClick={() => setViewMode('list')}
                  color={viewMode === 'list' ? 'primary' : 'default'}
                >
                  <ViewList />
                </IconButton>
                <Button
                  variant="outlined"
                  startIcon={<FilterList />}
                  onClick={() => setFilterDrawerOpen(true)}
                  sx={{ ml: 1 }}
                >
                  Filters
                </Button>
              </Box>
            </Grid>
          </Grid>

          {/* Active Filters */}
          {(searchTerm || selectedCategory !== 'all' || selectedBrand !== 'all' || priceRange[0] > 0 || priceRange[1] < 1000000000) && (
            <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              <Typography variant="body2" color="text.secondary">
                Active filters:
              </Typography>
              {searchTerm && (
                <Chip
                  label={`Search: "${searchTerm}"`}
                  onDelete={() => setSearchTerm('')}
                  size="small"
                />
              )}
              {selectedCategory !== 'all' && (
                <Chip
                  label={`Category: ${selectedCategory}`}
                  onDelete={() => setSelectedCategory('all')}
                  size="small"
                />
              )}
              {selectedBrand !== 'all' && (
                <Chip
                  label={`Brand: ${selectedBrand}`}
                  onDelete={() => setSelectedBrand('all')}
                  size="small"
                />
              )}
              {(priceRange[0] > 0 || priceRange[1] < 1000000000) && (
                <Chip
                  label={`Giá: ${formatVND(priceRange[0])} - ${formatVND(priceRange[1])}`}
                  onDelete={() => setPriceRange([0, 1000000000])}
                  size="small"
                />
              )}
              <Button
                size="small"
                onClick={handleClearFilters}
                startIcon={<Clear />}
              >
                Clear All
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Results Info */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="body1" color="text.secondary">
          Showing {filteredProducts.length} of {products.length} products
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Page {currentPage} of {totalPages}
        </Typography>
      </Box>

      {/* Products Grid/List */}
      {loading ? (
        <Grid container spacing={3}>
          {[...Array(8)].map((_, index) => (
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
      ) : filteredProducts.length === 0 ? (
        <Alert severity="info" sx={{ borderRadius: 3 }}>
          No products found matching your criteria. Try adjusting your filters.
        </Alert>
      ) : (
        <>
          <Grid container spacing={3}>
            {paginatedProducts.map((product) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
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
                      image={product.imageUrl || 'https://via.placeholder.com/400x200?text=No+Image'}
                      alt={product.name}
                      sx={{ objectFit: 'cover' }}
                    />
                    
                    {/* Badges */}
                    <Box sx={{ position: 'absolute', top: 12, left: 12, display: 'flex', flexDirection: 'column', gap: 1 }}>
                      {new Date(product.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) && (
                        <Chip label="NEW" color="success" size="small" />
                      )}
                    </Box>

                    {/* Favorite Button */}
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
                      onClick={() => handleToggleFavorite(product.id)}
                    >
                      {favorites.includes(product.id) ? (
                        <Favorite color="error" />
                      ) : (
                        <FavoriteBorder />
                      )}
                    </IconButton>
                  </Box>

                  {/* Product Info */}
                  <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="caption" color="primary.main" sx={{ fontWeight: 'bold', mb: 1 }}>
                      {product.brand}
                    </Typography>
                    
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, lineHeight: 1.3 }}>
                      {product.name}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
                      {product.description.length > 80 
                        ? `${product.description.substring(0, 80)}...` 
                        : product.description
                      }
                    </Typography>

                    {/* Rating */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Rating value={product.rating || 0} precision={0.1} size="small" readOnly />
                      <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                        ({product.rating ? Math.floor(product.rating * 20) : 0} reviews)
                      </Typography>
                    </Box>

                    {/* Price */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                        {formatVND(product.price)}
                      </Typography>
                    </Box>

                    {/* Stock Status */}
                    <Box sx={{ mb: 2 }}>
                      <Chip
                        label={product.stockQuantity > 10 ? 'In Stock' : product.stockQuantity > 0 ? 'Low Stock' : 'Out of Stock'}
                        color={product.stockQuantity > 10 ? 'success' : product.stockQuantity > 0 ? 'warning' : 'error'}
                        size="small"
                      />
                    </Box>

                    {/* Action Buttons */}
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        variant="contained"
                        startIcon={<ShoppingCart />}
                        onClick={() => handleAddToCart(product)}
                        disabled={product.stockQuantity === 0}
                        sx={{ borderRadius: 2, flex: 1 }}
                      >
                        Add to Cart
                      </Button>
                      <IconButton
                        color="primary"
                        onClick={() => handleViewProduct(product.id)}
                        sx={{ border: '1px solid', borderColor: 'divider' }}
                      >
                        <Visibility />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={(e, page) => setCurrentPage(page)}
                color="primary"
                size="large"
                showFirstButton
                showLastButton
              />
            </Box>
          )}
        </>
      )}

      {/* Filter Drawer */}
      <Drawer
        anchor="right"
        open={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        PaperProps={{
          sx: { width: 320, p: 3 },
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Filters
          </Typography>
          <IconButton onClick={() => setFilterDrawerOpen(false)}>
            <Close />
          </IconButton>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Price Range */}
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography sx={{ fontWeight: 'bold' }}>Price Range</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ px: 2 }}>
              <Slider
                value={priceRange}
                onChange={(e, newValue) => setPriceRange(newValue as number[])}
                valueLabelDisplay="auto"
                min={0}
                max={1000000000}
                step={100000}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                <Typography variant="body2">{formatVND(priceRange[0])}</Typography>
                <Typography variant="body2">{formatVND(priceRange[1])}</Typography>
              </Box>
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* Categories */}
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography sx={{ fontWeight: 'bold' }}>Categories</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List dense>
              {categories.slice(1).map((category) => (
                <ListItem key={category.value} button>
                  <ListItemIcon>
                    <Category />
                  </ListItemIcon>
                  <ListItemText 
                    primary={category.label}
                    onClick={() => setSelectedCategory(category.value)}
                  />
                </ListItem>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>

        {/* Brands */}
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography sx={{ fontWeight: 'bold' }}>Brands</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List dense>
              {brands.slice(1).map((brand) => (
                <ListItem key={brand.value} button>
                  <ListItemIcon>
                    <LocalOffer />
                  </ListItemIcon>
                  <ListItemText 
                    primary={brand.label}
                    onClick={() => setSelectedBrand(brand.value)}
                  />
                </ListItem>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>

        {/* Clear Filters */}
        <Box sx={{ mt: 3 }}>
          <Button
            variant="outlined"
            fullWidth
            onClick={handleClearFilters}
            startIcon={<Clear />}
          >
            Clear All Filters
          </Button>
        </Box>
      </Drawer>
    </Container>
  );
};

export default ProductsPage; 