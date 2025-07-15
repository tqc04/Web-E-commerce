import React, { useState, useEffect } from 'react'
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  CircularProgress,
  Chip,
  Rating,
  Paper,
  InputAdornment,
  ToggleButton,
  ToggleButtonGroup,
  Drawer,
  IconButton,
  Divider,
  Slider,
  FormControlLabel,
  Checkbox,
  Breadcrumbs,
  Link,
  Fab,
  Badge,
  Tooltip,
} from '@mui/material'
import {
  Search,
  ShoppingCart,
  Visibility,
  FilterList,
  GridView,
  ViewList,
  Sort,
  FavoriteBorder,
  Favorite,
  Compare,
  Share,
  Close,
  Home,
  NavigateNext,
  ShoppingCartOutlined,
} from '@mui/icons-material'
import { useQuery } from '@tanstack/react-query'
import { apiService, Product } from '../services/api'
import notificationService from '../services/notificationService'
import { useCart } from '../contexts/CartContext'

const ProductsPage: React.FC = () => {
  const { addToCart, cartLoading } = useCart()
  const [page, setPage] = useState(0)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [searchInput, setSearchInput] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [priceRange, setPriceRange] = useState<number[]>([0, 2000])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [minRating, setMinRating] = useState<number>(0)
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false)
  const [favorites, setFavorites] = useState<number[]>([])
  const [compareList, setCompareList] = useState<number[]>([])
  const [cartItems, setCartItems] = useState<Product[]>([])

  // Fetch products with React Query
  const {
    data: productsResponse,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['products', page, search, category, sortBy],
    queryFn: () => apiService.getProducts(page, 12, search, category),
    retry: 2,
  })

  const products = productsResponse?.data.content || []
  const totalElements = productsResponse?.data.totalElements || 0
  const totalPages = Math.ceil(totalElements / 12)

  const categories = ['Electronics', 'Gaming', 'Audio', 'Mobile', 'Computers']
  const brands = ['TechBrand', 'GameMaster', 'SoundWave', 'MobileTech', 'ComputeMax']

  // Handle search
  const handleSearch = () => {
    setSearch(searchInput)
    setPage(0)
  }

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearch()
    }
  }

  // Handle page change
  const handlePageChange = (_event: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage - 1) // Convert to 0-based index
  }

  // Handle category filter
  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory)
    setPage(0)
  }

  // Handle view mode change
  const handleViewModeChange = (_event: React.MouseEvent<HTMLElement>, newViewMode: 'grid' | 'list') => {
    if (newViewMode !== null) {
      setViewMode(newViewMode)
    }
  }

  // Handle favorites
  const toggleFavorite = (productId: number) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
    notificationService.success(
      favorites.includes(productId) 
        ? 'Removed from favorites' 
        : 'Added to favorites'
    )
  }

  // Handle compare
  const toggleCompare = (productId: number) => {
    if (compareList.includes(productId)) {
      setCompareList(prev => prev.filter(id => id !== productId))
      notificationService.info('Removed from compare list')
    } else if (compareList.length < 3) {
      setCompareList(prev => [...prev, productId])
      notificationService.success('Added to compare list')
    } else {
      notificationService.warning('You can compare up to 3 products only')
    }
  }

  // Handle add to cart
  const handleAddToCart = async (product: Product) => {
    try {
      const success = await addToCart(product.id, 1)
      if (success) {
        notificationService.success(`${product.name} added to cart!`)
      } else {
        notificationService.error('Failed to add product to cart')
      }
    } catch (error) {
      notificationService.error('Failed to add product to cart')
    }
  }

  // Handle share
  const handleShare = (product: Product) => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href + '#' + product.id,
      })
    } else {
      navigator.clipboard.writeText(window.location.href + '#' + product.id)
      notificationService.success('Product link copied to clipboard!')
    }
  }

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  // Filter products by price and brand
  const filteredProducts = products.filter(product => {
    const priceInRange = product.price >= priceRange[0] && product.price <= priceRange[1]
    const brandMatch = selectedBrands.length === 0 || selectedBrands.includes(product.brand)
    return priceInRange && brandMatch
  })

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price
      case 'price-high':
        return b.price - a.price
      case 'rating':
        return (b.rating || 0) - (a.rating || 0)
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      default:
        return a.name.localeCompare(b.name)
    }
  })

  // Filter Drawer Component
  const FilterDrawer = (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" fontWeight="bold">Filters</Typography>
        <IconButton onClick={() => setFilterDrawerOpen(false)}>
          <Close />
        </IconButton>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Price Range */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle1" gutterBottom fontWeight="bold">
          Price Range
        </Typography>
        <Slider
          value={priceRange}
          onChange={(_event, newValue) => setPriceRange(newValue as number[])}
          valueLabelDisplay="auto"
          min={0}
          max={2000}
          valueLabelFormat={(value) => `$${value}`}
          sx={{ mt: 2 }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
          <Typography variant="caption">${priceRange[0]}</Typography>
          <Typography variant="caption">${priceRange[1]}</Typography>
        </Box>
      </Box>

      {/* Category Filter */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle1" gutterBottom fontWeight="bold">
          Categories
        </Typography>
        {categories.map((cat) => (
          <FormControlLabel
            key={cat}
            control={
              <Checkbox
                checked={selectedBrands.includes(cat)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedBrands([...selectedBrands, cat])
                  } else {
                    setSelectedBrands(selectedBrands.filter(b => b !== cat))
                  }
                }}
              />
            }
            label={cat}
            sx={{ display: 'block' }}
          />
        ))}
      </Box>

      {/* Brand Filter */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle1" gutterBottom fontWeight="bold">
          Brands
        </Typography>
        {brands.map((brand) => (
          <FormControlLabel
            key={brand}
            control={
              <Checkbox
                checked={selectedBrands.includes(brand)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedBrands([...selectedBrands, brand])
                  } else {
                    setSelectedBrands(selectedBrands.filter(b => b !== brand))
                  }
                }}
              />
            }
            label={brand}
            sx={{ display: 'block' }}
          />
        ))}
      </Box>

      {/* Rating Filter */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle1" gutterBottom fontWeight="bold">
          Rating
        </Typography>
        {[4, 3, 2, 1].map((rating) => (
          <FormControlLabel
            key={rating}
            control={
              <Checkbox
                checked={minRating <= rating}
                onChange={() => setMinRating(rating)}
              />
            }
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Rating value={rating} readOnly size="small" />
                <Typography variant="caption" sx={{ ml: 1 }}>
                  & up
                </Typography>
              </Box>
            }
            sx={{ display: 'block' }}
          />
        ))}
      </Box>

      {/* Clear Filters */}
      <Button
        variant="outlined"
        fullWidth
        onClick={() => {
          setPriceRange([0, 2000])
          setSelectedBrands([])
          setMinRating(0)
        }}
        sx={{ mt: 2 }}
      >
        Clear All Filters
      </Button>
    </Box>
  )

  // Show error state
  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="error" gutterBottom>
            Failed to load products
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {error.message || 'Something went wrong'}
          </Typography>
          <Button variant="contained" onClick={() => refetch()} sx={{ mt: 2 }}>
            Try Again
          </Button>
        </Paper>
      </Container>
    )
  }

  return (
    <Box>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Breadcrumbs */}
        <Breadcrumbs 
          separator={<NavigateNext fontSize="small" />} 
          sx={{ mb: 3 }}
          aria-label="breadcrumb"
        >
          <Link 
            color="inherit" 
            href="/" 
            sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}
          >
            <Home sx={{ mr: 0.5 }} fontSize="inherit" />
            Home
          </Link>
          <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
            Products
          </Typography>
        </Breadcrumbs>

        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
            Product Catalog
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Discover our amazing collection of products with AI-powered recommendations
          </Typography>
        </Box>

        {/* Search and Controls */}
        <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search products, brands, categories..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyPress={handleKeyPress}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <Button 
                        onClick={handleSearch} 
                        variant="contained" 
                        size="small"
                        sx={{ borderRadius: 2 }}
                      >
                        Search
                      </Button>
                    </InputAdornment>
                  )
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3
                  }
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Button
                  variant="outlined"
                  startIcon={<FilterList />}
                  onClick={() => setFilterDrawerOpen(true)}
                  sx={{ minWidth: 120, borderRadius: 2 }}
                >
                  Filters
                </Button>

                <FormControl sx={{ minWidth: 140 }}>
                  <InputLabel>Sort By</InputLabel>
                  <Select
                    value={sortBy}
                    label="Sort By"
                    onChange={(e) => setSortBy(e.target.value)}
                    size="small"
                    sx={{ borderRadius: 2 }}
                  >
                    <MenuItem value="name">Name A-Z</MenuItem>
                    <MenuItem value="price-low">Price: Low to High</MenuItem>
                    <MenuItem value="price-high">Price: High to Low</MenuItem>
                    <MenuItem value="rating">Highest Rated</MenuItem>
                    <MenuItem value="newest">Newest First</MenuItem>
                  </Select>
                </FormControl>

                <ToggleButtonGroup
                  value={viewMode}
                  exclusive
                  onChange={handleViewModeChange}
                  size="small"
                  sx={{ ml: 'auto' }}
                >
                  <ToggleButton value="grid" aria-label="grid view">
                    <GridView />
                  </ToggleButton>
                  <ToggleButton value="list" aria-label="list view">
                    <ViewList />
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Results Info */}
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="body1" color="text.secondary">
            {isLoading ? 'Loading...' : `Showing ${sortedProducts.length} of ${totalElements} products`}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {search && (
              <Chip 
                label={`Search: "${search}"`} 
                onDelete={() => {
                  setSearch('')
                  setSearchInput('')
                }}
                color="primary" 
                variant="outlined" 
              />
            )}
            {category && (
              <Chip 
                label={`Category: ${category}`} 
                onDelete={() => setCategory('')}
                color="secondary" 
                variant="outlined" 
              />
            )}
            {selectedBrands.map(brand => (
              <Chip 
                key={brand}
                label={`Brand: ${brand}`} 
                onDelete={() => setSelectedBrands(prev => prev.filter(b => b !== brand))}
                color="info" 
                variant="outlined" 
              />
            ))}
          </Box>
        </Box>

        {/* Products Grid/List */}
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress size={60} />
          </Box>
        ) : sortedProducts.length === 0 ? (
          <Paper sx={{ p: 8, textAlign: 'center', borderRadius: 3 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No products found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Try adjusting your search criteria or filters
            </Typography>
            <Button 
              variant="contained" 
              onClick={() => {
                setSearch('')
                setSearchInput('')
                setCategory('')
                setPriceRange([0, 2000])
                setSelectedBrands([])
              }}
            >
              Clear All Filters
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {sortedProducts.map((product) => (
              <Grid 
                item 
                xs={12} 
                sm={viewMode === 'grid' ? 6 : 12} 
                md={viewMode === 'grid' ? 4 : 12} 
                lg={viewMode === 'grid' ? 3 : 12} 
                key={product.id}
              >
                <Card 
                  sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: viewMode === 'list' ? 'row' : 'column',
                    transition: 'all 0.3s ease',
                    borderRadius: 3,
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 6,
                    }
                  }}
                >
                  <Box sx={{ position: 'relative', width: viewMode === 'list' ? 200 : '100%' }}>
                    <CardMedia
                      component="img"
                      height={viewMode === 'list' ? "150" : "200"}
                      image={product.imageUrl || 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=300&h=200&fit=crop'}
                      alt={product.name}
                      sx={{ objectFit: 'cover' }}
                    />
                    
                    {/* Quick Actions */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1,
                        opacity: 0,
                        transition: 'opacity 0.3s ease',
                        '.MuiCard-root:hover &': {
                          opacity: 1,
                        },
                      }}
                    >
                      <Tooltip title={favorites.includes(product.id) ? "Remove from favorites" : "Add to favorites"}>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleFavorite(product.id)
                          }}
                          sx={{
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            '&:hover': { backgroundColor: 'white' }
                          }}
                        >
                          {favorites.includes(product.id) ? (
                            <Favorite color="error" fontSize="small" />
                          ) : (
                            <FavoriteBorder fontSize="small" />
                          )}
                        </IconButton>
                      </Tooltip>
                      
                      <Tooltip title="Add to compare">
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleCompare(product.id)
                          }}
                          sx={{
                            backgroundColor: compareList.includes(product.id) 
                              ? 'primary.main' 
                              : 'rgba(255, 255, 255, 0.9)',
                            color: compareList.includes(product.id) ? 'white' : 'inherit',
                            '&:hover': { backgroundColor: compareList.includes(product.id) ? 'primary.dark' : 'white' }
                          }}
                        >
                          <Compare fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      
                      <Tooltip title="Share product">
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleShare(product)
                          }}
                          sx={{
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            '&:hover': { backgroundColor: 'white' }
                          }}
                        >
                          <Share fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>

                    {/* Stock Status */}
                    {product.stockQuantity < 10 && product.stockQuantity > 0 && (
                      <Chip
                        label={`Only ${product.stockQuantity} left!`}
                        size="small"
                        color="warning"
                        sx={{
                          position: 'absolute',
                          bottom: 8,
                          left: 8,
                          fontWeight: 'bold',
                        }}
                      />
                    )}
                    
                    {product.stockQuantity === 0 && (
                      <Chip
                        label="Out of Stock"
                        size="small"
                        color="error"
                        sx={{
                          position: 'absolute',
                          bottom: 8,
                          left: 8,
                          fontWeight: 'bold',
                        }}
                      />
                    )}
                  </Box>
                  
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Typography variant="h6" component="h3" gutterBottom noWrap>
                      {product.name}
                    </Typography>
                    
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      sx={{ 
                        mb: 2,
                        display: '-webkit-box',
                        WebkitLineClamp: viewMode === 'list' ? 3 : 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {product.description}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Rating value={product.rating || 4.5} precision={0.5} size="small" readOnly />
                      <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                        ({product.rating || 4.5})
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Chip 
                        label={product.category} 
                        size="small" 
                        color="primary" 
                        variant="outlined"
                      />
                      <Chip 
                        label={product.brand} 
                        size="small" 
                        color="secondary" 
                        variant="outlined"
                      />
                    </Box>

                    <Typography variant="h5" color="primary" fontWeight="bold" gutterBottom>
                      {formatPrice(product.price)}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      In Stock: {product.stockQuantity}
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        fullWidth
                        variant="contained"
                        startIcon={<ShoppingCart />}
                        onClick={() => handleAddToCart(product)}
                        disabled={product.stockQuantity === 0}
                        sx={{ borderRadius: 2 }}
                      >
                        {product.stockQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<Visibility />}
                        sx={{ borderRadius: 2, minWidth: 'auto', px: 2 }}
                      >
                        View
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
            <Pagination
              count={totalPages}
              page={page + 1}
              onChange={handlePageChange}
              color="primary"
              size="large"
              showFirstButton
              showLastButton
              sx={{
                '& .MuiPaginationItem-root': {
                  borderRadius: 2,
                },
              }}
            />
          </Box>
        )}
      </Container>

      {/* Filter Drawer */}
      {FilterDrawer}

      {/* Compare FAB */}
      {compareList.length > 0 && (
        <Fab
          color="secondary"
          sx={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            zIndex: 1000,
          }}
          onClick={() => notificationService.info(`Comparing ${compareList.length} products`)}
        >
          <Badge badgeContent={compareList.length} color="error">
            <Compare />
          </Badge>
        </Fab>
      )}
    </Box>
  )
}

export default ProductsPage 