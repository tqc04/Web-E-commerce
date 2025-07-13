import React, { useState } from 'react'
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Chip,
  IconButton,
  Badge,
  TextField,
  InputAdornment,
  Paper,
  MenuList,
  ClickAwayListener,
  Popper,
  Grow,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
} from '@mui/material'
import {
  Search,
  ShoppingCart,
  Favorite,
  Notifications,
  AccountCircle,
  Logout,
  AdminPanelSettings,
  Menu as MenuIcon,
  Home,
  Store,
  Chat,
  Receipt,
  Category,
  LocalOffer,
  Support,
  TrendingUp,
  Close,
} from '@mui/icons-material'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const Navbar: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const { isAuthenticated, isAdmin, user, logout } = useAuth()
  
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [categoriesOpen, setCategoriesOpen] = useState(false)
  const [categoriesAnchorEl, setCategoriesAnchorEl] = useState<null | HTMLElement>(null)
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [cartCount] = useState(3) // Mock cart count
  const [favoriteCount] = useState(2) // Mock favorite count
  const [notificationCount] = useState(1) // Mock notification count

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleUserMenuClose = () => {
    setAnchorEl(null)
  }

  const handleCategoriesClick = (event: React.MouseEvent<HTMLElement>) => {
    setCategoriesAnchorEl(event.currentTarget)
    setCategoriesOpen(!categoriesOpen)
  }

  const handleCategoriesClose = () => {
    setCategoriesOpen(false)
  }

  const handleLogout = () => {
    logout()
    handleUserMenuClose()
    navigate('/')
  }

  const handleSearch = () => {
    if (searchValue.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchValue)}`)
    }
  }

  const handleSearchKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearch()
    }
  }

  const isActive = (path: string) => location.pathname === path

  const categories = [
    { name: 'Electronics', icon: '💻', path: '/products?category=electronics' },
    { name: 'Gaming', icon: '🎮', path: '/products?category=gaming' },
    { name: 'Computers', icon: '🖥️', path: '/products?category=computers' },
    { name: 'Mobile', icon: '📱', path: '/products?category=mobile' },
    { name: 'Audio', icon: '🎧', path: '/products?category=audio' },
    { name: 'Accessories', icon: '🔌', path: '/products?category=accessories' },
  ]

  const mobileNavItems = [
    { label: 'Home', path: '/', icon: <Home />, public: true },
    { label: 'Products', path: '/products', icon: <Store />, public: true },
    { label: 'Chat Assistant', path: '/chatbot', icon: <Chat />, public: false },
    { label: 'My Orders', path: '/orders', icon: <Receipt />, public: false },
    { label: 'Admin Panel', path: '/admin', icon: <AdminPanelSettings />, public: false, adminOnly: true },
  ]

  const filteredMobileNavItems = mobileNavItems.filter(item => 
    item.public || 
    (isAuthenticated && !item.adminOnly) ||
    (isAuthenticated && item.adminOnly && isAdmin)
  )

  // Mobile Drawer
  const mobileDrawer = (
    <Drawer
      anchor="left"
      open={mobileDrawerOpen}
      onClose={() => setMobileDrawerOpen(false)}
      sx={{
        '& .MuiDrawer-paper': {
          width: 280,
          bgcolor: 'background.paper',
        },
      }}
    >
      <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" fontWeight="bold">
            ShopPro
          </Typography>
          <IconButton onClick={() => setMobileDrawerOpen(false)} sx={{ color: 'white' }}>
            <Close />
          </IconButton>
        </Box>
        {isAuthenticated && user && (
          <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'secondary.main' }}>
              {user.firstName?.[0] || user.username?.[0] || 'U'}
            </Avatar>
            <Box>
              <Typography variant="body2" fontWeight="bold">
                {user.firstName} {user.lastName}
              </Typography>
              <Chip label={user.role} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} />
            </Box>
          </Box>
        )}
      </Box>

      <Divider />

      <List>
        {filteredMobileNavItems.map((item) => (
          <ListItemButton
            key={item.path}
            component={Link}
            to={item.path}
            onClick={() => setMobileDrawerOpen(false)}
            selected={isActive(item.path)}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>

      <Divider />

      <List>
        <ListItem>
          <ListItemText primary="Categories" secondary="Browse by category" />
        </ListItem>
        {categories.map((category) => (
          <ListItemButton
            key={category.name}
            component={Link}
            to={category.path}
            onClick={() => setMobileDrawerOpen(false)}
            sx={{ pl: 4 }}
          >
            <ListItemText 
              primary={`${category.icon} ${category.name}`}
            />
          </ListItemButton>
        ))}
      </List>

      {isAuthenticated && (
        <>
          <Divider />
          <List>
            <ListItemButton onClick={handleLogout}>
              <ListItemIcon><Logout /></ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </List>
        </>
      )}
    </Drawer>
  )

  return (
    <>
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        }}
      >
        <Toolbar sx={{ py: 1 }}>
          {/* Mobile Menu Button */}
          {isMobile && (
            <IconButton
              color="inherit"
              onClick={() => setMobileDrawerOpen(true)}
              sx={{ mr: 1 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          {/* Logo */}
          <Box 
            component={Link}
            to="/"
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              textDecoration: 'none',
              color: 'inherit',
              mr: { xs: 1, md: 4 }
            }}
          >
            <Typography 
              variant={isMobile ? "h6" : "h5"} 
              component="div" 
              sx={{ 
                fontWeight: 'bold',
                background: 'linear-gradient(45deg, #fff, #f0f0f0)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
              }}
            >
              ShopPro
            </Typography>
          </Box>

          {/* Desktop Navigation */}
          {!isMobile && (
            <>
              {/* Categories Button */}
              <Button
                color="inherit"
                startIcon={<Category />}
                onClick={handleCategoriesClick}
                sx={{
                  textTransform: 'none',
                  mr: 2,
                  borderRadius: 2,
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  }
                }}
              >
                Categories
              </Button>

              {/* Navigation Links */}
              <Box sx={{ display: 'flex', gap: 1, mr: 'auto' }}>
                <Button
                  component={Link}
                  to="/"
                  color="inherit"
                  sx={{
                    textTransform: 'none',
                    borderRadius: 2,
                    backgroundColor: isActive('/') ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    },
                  }}
                >
                  Home
                </Button>
                <Button
                  component={Link}
                  to="/products"
                  color="inherit"
                  sx={{
                    textTransform: 'none',
                    borderRadius: 2,
                    backgroundColor: isActive('/products') ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    },
                  }}
                >
                  Products
                </Button>
                {isAuthenticated && (
                  <>
                    <Button
                      component={Link}
                      to="/chatbot"
                      color="inherit"
                      sx={{
                        textTransform: 'none',
                        borderRadius: 2,
                        backgroundColor: isActive('/chatbot') ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        },
                      }}
                    >
                      AI Assistant
                    </Button>
                    <Button
                      component={Link}
                      to="/orders"
                      color="inherit"
                      sx={{
                        textTransform: 'none',
                        borderRadius: 2,
                        backgroundColor: isActive('/orders') ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        },
                      }}
                    >
                      Orders
                    </Button>
                  </>
                )}
              </Box>
            </>
          )}

          {/* Search Bar */}
          {!isMobile && (
            <Box sx={{ flexGrow: 1, maxWidth: 500, mx: 2 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search products, brands, categories..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyPress={handleSearchKeyPress}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: 'action.active' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <Button
                        size="small"
                        onClick={handleSearch}
                        sx={{ 
                          minWidth: 'auto',
                          borderRadius: 1,
                          bgcolor: 'primary.main',
                          color: 'white',
                          '&:hover': {
                            bgcolor: 'primary.dark',
                          }
                        }}
                      >
                        Search
                      </Button>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: 3,
                    '& fieldset': {
                      border: 'none',
                    },
                    '&:hover': {
                      backgroundColor: 'white',
                    },
                    '&.Mui-focused': {
                      backgroundColor: 'white',
                    },
                  },
                }}
              />
            </Box>
          )}

          {/* Right Side Actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Favorites Icon */}
            {isAuthenticated && (
              <IconButton
                color="inherit"
                component={Link}
                to="/favorites"
                sx={{
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  }
                }}
              >
                <Badge badgeContent={favoriteCount} color="error">
                  <Favorite />
                </Badge>
              </IconButton>
            )}

            {/* Shopping Cart */}
            <IconButton
              color="inherit"
              component={Link}
              to="/cart"
              sx={{
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                }
              }}
            >
              <Badge badgeContent={cartCount} color="error">
                <ShoppingCart />
              </Badge>
            </IconButton>

            {/* Notifications */}
            {isAuthenticated && (
              <IconButton
                color="inherit"
                sx={{
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  }
                }}
              >
                <Badge badgeContent={notificationCount} color="error">
                  <Notifications />
                </Badge>
              </IconButton>
            )}

            {/* User Authentication */}
            {isAuthenticated ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 1 }}>
                {!isMobile && isAdmin && (
                  <Button
                    component={Link}
                    to="/admin"
                    color="inherit"
                    startIcon={<AdminPanelSettings />}
                    sx={{
                      textTransform: 'none',
                      borderRadius: 2,
                      backgroundColor: isActive('/admin') ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      },
                    }}
                  >
                    Admin
                  </Button>
                )}
                
                {!isMobile && (
                  <Chip
                    label={user?.role || 'USER'}
                    size="small"
                    color={isAdmin ? 'warning' : 'secondary'}
                    sx={{ 
                      color: 'white', 
                      bgcolor: isAdmin ? 'orange' : 'rgba(255, 255, 255, 0.2)',
                      fontWeight: 'bold'
                    }}
                  />
                )}

                <IconButton
                  onClick={handleUserMenuOpen}
                  sx={{ 
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    }
                  }}
                >
                  <Avatar 
                    sx={{ 
                      width: 32, 
                      height: 32, 
                      bgcolor: 'secondary.main',
                      border: '2px solid rgba(255,255,255,0.3)'
                    }}
                  >
                    {user?.firstName?.[0] || user?.username?.[0] || 'U'}
                  </Avatar>
                </IconButton>
              </Box>
            ) : (
              <Button
                component={Link}
                to="/login"
                color="inherit"
                variant="outlined"
                sx={{
                  textTransform: 'none',
                  borderRadius: 3,
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                  fontWeight: 'bold',
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Categories Menu */}
      <Popper
        open={categoriesOpen}
        anchorEl={categoriesAnchorEl}
        role={undefined}
        placement="bottom-start"
        transition
        disablePortal
        sx={{ zIndex: 1300 }}
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin: placement === 'bottom-start' ? 'left top' : 'left bottom',
            }}
          >
            <Paper
              elevation={8}
              sx={{
                mt: 1,
                minWidth: 250,
                borderRadius: 2,
                overflow: 'hidden',
              }}
            >
              <ClickAwayListener onClickAway={handleCategoriesClose}>
                <MenuList autoFocusItem={categoriesOpen} dense>
                  <MenuItem sx={{ py: 1.5, borderBottom: '1px solid #eee' }}>
                    <ListItemIcon>
                      <TrendingUp />
                    </ListItemIcon>
                    <ListItemText primary="All Categories" />
                  </MenuItem>
                  {categories.map((category) => (
                    <MenuItem
                      key={category.name}
                      component={Link}
                      to={category.path}
                      onClick={handleCategoriesClose}
                      sx={{ py: 1 }}
                    >
                      <ListItemText 
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <span>{category.icon}</span>
                            <span>{category.name}</span>
                          </Box>
                        }
                      />
                    </MenuItem>
                  ))}
                  <Divider />
                  <MenuItem
                    component={Link}
                    to="/products"
                    onClick={handleCategoriesClose}
                    sx={{ py: 1.5, color: 'primary.main', fontWeight: 'bold' }}
                  >
                    <ListItemIcon>
                      <LocalOffer sx={{ color: 'primary.main' }} />
                    </ListItemIcon>
                    <ListItemText primary="View All Products" />
                  </MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>

      {/* User Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleUserMenuClose}
        onClick={handleUserMenuClose}
        PaperProps={{
          elevation: 8,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            minWidth: 220,
            borderRadius: 2,
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem disabled sx={{ py: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'primary.main' }}>
              {user?.firstName?.[0] || user?.username?.[0] || 'U'}
            </Avatar>
            <Box>
              <Typography variant="body2" fontWeight="bold">
                {user?.firstName} {user?.lastName}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                @{user?.username}
              </Typography>
            </Box>
          </Box>
        </MenuItem>
        <Divider />
        <MenuItem component={Link} to="/profile">
          <AccountCircle sx={{ mr: 2 }} />
          My Profile
        </MenuItem>
        <MenuItem component={Link} to="/orders">
          <Receipt sx={{ mr: 2 }} />
          My Orders
        </MenuItem>
        <MenuItem component={Link} to="/favorites">
          <Favorite sx={{ mr: 2 }} />
          Favorites
        </MenuItem>
        <Divider />
        <MenuItem component={Link} to="/support">
          <Support sx={{ mr: 2 }} />
          Help & Support
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
          <Logout sx={{ mr: 2 }} />
          Logout
        </MenuItem>
      </Menu>

      {/* Mobile Drawer */}
      {mobileDrawer}
    </>
  )
}

export default Navbar 