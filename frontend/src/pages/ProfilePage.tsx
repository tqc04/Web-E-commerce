import React, { useState } from 'react'
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  Avatar,
  Tabs,
  Tab,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Switch,
  FormControl,
  FormControlLabel,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material'
import {
  Person,
  Settings,
  ShoppingBag,
  Favorite,
  Security,
  Notifications,
  LocationOn,
  CreditCard,
  Edit,
  PhotoCamera,
  Save,
  Cancel,
  Language,
  Palette,
  Email,
  Phone,
  Visibility,
  VisibilityOff,
  Delete
} from '@mui/icons-material'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0)
  const [editMode, setEditMode] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  
  const [userInfo, setUserInfo] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    dateJoined: '2023-06-15',
    totalOrders: 24,
    totalSpent: 2845.67,
    membershipLevel: 'Gold'
  })
  
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    marketingEmails: true,
    orderUpdates: true,
    language: 'en',
    currency: 'USD',
    theme: 'light',
    twoFactorAuth: false
  })

  const [addresses, setAddresses] = useState([
    {
      id: 1,
      type: 'Home',
      name: 'John Doe',
      street: '123 Main Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'United States',
      isDefault: true
    },
    {
      id: 2,
      type: 'Work',
      name: 'John Doe',
      street: '456 Business Ave',
      city: 'New York',
      state: 'NY',
      zipCode: '10002',
      country: 'United States',
      isDefault: false
    }
  ])

  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: 1,
      type: 'Visa',
      last4: '4242',
      expiryMonth: 12,
      expiryYear: 2025,
      isDefault: true
    },
    {
      id: 2,
      type: 'Mastercard',
      last4: '8888',
      expiryMonth: 8,
      expiryYear: 2026,
      isDefault: false
    }
  ])

  const recentOrders = [
    {
      id: 'ORD-2024-001',
      date: '2024-01-10',
      status: 'Delivered',
      total: 299.99,
      items: 3
    },
    {
      id: 'ORD-2024-002',
      date: '2024-01-08',
      status: 'Shipped',
      total: 159.99,
      items: 1
    },
    {
      id: 'ORD-2024-003',
      date: '2024-01-05',
      status: 'Processing',
      total: 89.99,
      items: 2
    }
  ]

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
  }

  const handleSaveProfile = () => {
    setEditMode(false)
    // Save profile logic here
  }

  const handleSettingChange = (setting: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({
      ...settings,
      [setting]: event.target.checked
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'success'
      case 'Shipped':
        return 'info'
      case 'Processing':
        return 'warning'
      default:
        return 'default'
    }
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item>
            <Box sx={{ position: 'relative' }}>
              <Avatar
                src={userInfo.avatar}
                sx={{ width: 120, height: 120 }}
              />
              <IconButton
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  bgcolor: 'primary.main',
                  color: 'white',
                  '&:hover': { bgcolor: 'primary.dark' }
                }}
                size="small"
              >
                <PhotoCamera />
              </IconButton>
            </Box>
          </Grid>
          
          <Grid item xs>
            <Typography variant="h4" gutterBottom>
              {userInfo.firstName} {userInfo.lastName}
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              {userInfo.email}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip 
                label={`${userInfo.membershipLevel} Member`} 
                color="primary" 
                variant="filled"
              />
              <Chip 
                label={`${userInfo.totalOrders} Orders`} 
                variant="outlined"
              />
              <Chip 
                label={`$${userInfo.totalSpent.toFixed(2)} Spent`} 
                variant="outlined"
              />
            </Box>
          </Grid>
          
          <Grid item>
            <Button
              variant={editMode ? "outlined" : "contained"}
              startIcon={editMode ? <Cancel /> : <Edit />}
              onClick={() => setEditMode(!editMode)}
            >
              {editMode ? 'Cancel' : 'Edit Profile'}
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Main Content */}
      <Paper>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Profile" icon={<Person />} iconPosition="start" />
          <Tab label="Orders" icon={<ShoppingBag />} iconPosition="start" />
          <Tab label="Addresses" icon={<LocationOn />} iconPosition="start" />
          <Tab label="Payment" icon={<CreditCard />} iconPosition="start" />
          <Tab label="Settings" icon={<Settings />} iconPosition="start" />
          <Tab label="Security" icon={<Security />} iconPosition="start" />
        </Tabs>

        {/* Profile Tab */}
        <TabPanel value={activeTab} index={0}>
          <Typography variant="h5" gutterBottom>
            Personal Information
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                value={userInfo.firstName}
                onChange={(e) => setUserInfo({...userInfo, firstName: e.target.value})}
                disabled={!editMode}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                value={userInfo.lastName}
                onChange={(e) => setUserInfo({...userInfo, lastName: e.target.value})}
                disabled={!editMode}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={userInfo.email}
                onChange={(e) => setUserInfo({...userInfo, email: e.target.value})}
                disabled={!editMode}
                InputProps={{
                  startAdornment: <Email sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone"
                value={userInfo.phone}
                onChange={(e) => setUserInfo({...userInfo, phone: e.target.value})}
                disabled={!editMode}
                InputProps={{
                  startAdornment: <Phone sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
            </Grid>
            
            {editMode && (
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button 
                    variant="contained" 
                    startIcon={<Save />}
                    onClick={handleSaveProfile}
                  >
                    Save Changes
                  </Button>
                  <Button 
                    variant="outlined" 
                    startIcon={<Cancel />}
                    onClick={() => setEditMode(false)}
                  >
                    Cancel
                  </Button>
                </Box>
              </Grid>
            )}
          </Grid>
        </TabPanel>

        {/* Orders Tab */}
        <TabPanel value={activeTab} index={1}>
          <Typography variant="h5" gutterBottom>
            Order History
          </Typography>
          
          <Grid container spacing={2}>
            {recentOrders.map((order) => (
              <Grid item xs={12} key={order.id}>
                <Card variant="outlined">
                  <CardContent>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} sm={3}>
                        <Typography variant="h6">
                          {order.id}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {new Date(order.date).toLocaleDateString()}
                        </Typography>
                      </Grid>
                      
                      <Grid item xs={12} sm={2}>
                        <Chip 
                          label={order.status}
                          color={getStatusColor(order.status) as any}
                          size="small"
                        />
                      </Grid>
                      
                      <Grid item xs={12} sm={2}>
                        <Typography variant="body2" color="text.secondary">
                          Items: {order.items}
                        </Typography>
                      </Grid>
                      
                      <Grid item xs={12} sm={3}>
                        <Typography variant="h6" color="primary">
                          ${order.total.toFixed(2)}
                        </Typography>
                      </Grid>
                      
                      <Grid item xs={12} sm={2}>
                        <Button variant="outlined" size="small">
                          View Details
                        </Button>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        {/* Addresses Tab */}
        <TabPanel value={activeTab} index={2}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5">
              Saved Addresses
            </Typography>
            <Button variant="contained" startIcon={<LocationOn />}>
              Add New Address
            </Button>
          </Box>
          
          <Grid container spacing={3}>
            {addresses.map((address) => (
              <Grid item xs={12} md={6} key={address.id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="h6">
                        {address.type}
                      </Typography>
                      {address.isDefault && (
                        <Chip label="Default" color="primary" size="small" />
                      )}
                    </Box>
                    
                    <Typography variant="body2" gutterBottom>
                      {address.name}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      {address.street}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      {address.city}, {address.state} {address.zipCode}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {address.country}
                    </Typography>
                    
                    <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                      <Button size="small" startIcon={<Edit />}>
                        Edit
                      </Button>
                      <Button size="small" color="error" startIcon={<Delete />}>
                        Delete
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        {/* Payment Tab */}
        <TabPanel value={activeTab} index={3}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5">
              Payment Methods
            </Typography>
            <Button variant="contained" startIcon={<CreditCard />}>
              Add New Card
            </Button>
          </Box>
          
          <Grid container spacing={3}>
            {paymentMethods.map((payment) => (
              <Grid item xs={12} md={6} key={payment.id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="h6">
                        {payment.type} •••• {payment.last4}
                      </Typography>
                      {payment.isDefault && (
                        <Chip label="Default" color="primary" size="small" />
                      )}
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Expires {payment.expiryMonth}/{payment.expiryYear}
                    </Typography>
                    
                    <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                      <Button size="small" startIcon={<Edit />}>
                        Edit
                      </Button>
                      <Button size="small" color="error" startIcon={<Delete />}>
                        Remove
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        {/* Settings Tab */}
        <TabPanel value={activeTab} index={4}>
          <Typography variant="h5" gutterBottom>
            Preferences
          </Typography>
          
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Notifications
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <Email />
                  </ListItemIcon>
                  <ListItemText primary="Email Notifications" />
                  <Switch
                    checked={settings.emailNotifications}
                    onChange={handleSettingChange('emailNotifications')}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Phone />
                  </ListItemIcon>
                  <ListItemText primary="SMS Notifications" />
                  <Switch
                    checked={settings.smsNotifications}
                    onChange={handleSettingChange('smsNotifications')}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Notifications />
                  </ListItemIcon>
                  <ListItemText primary="Marketing Emails" />
                  <Switch
                    checked={settings.marketingEmails}
                    onChange={handleSettingChange('marketingEmails')}
                  />
                </ListItem>
              </List>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Preferences
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <FormControl fullWidth>
                  <InputLabel>Language</InputLabel>
                  <Select
                    value={settings.language}
                    label="Language"
                    startAdornment={<Language sx={{ mr: 1 }} />}
                  >
                    <MenuItem value="en">English</MenuItem>
                    <MenuItem value="es">Español</MenuItem>
                    <MenuItem value="fr">Français</MenuItem>
                    <MenuItem value="de">Deutsch</MenuItem>
                  </Select>
                </FormControl>
                
                <FormControl fullWidth>
                  <InputLabel>Currency</InputLabel>
                  <Select
                    value={settings.currency}
                    label="Currency"
                  >
                    <MenuItem value="USD">USD ($)</MenuItem>
                    <MenuItem value="EUR">EUR (€)</MenuItem>
                    <MenuItem value="GBP">GBP (£)</MenuItem>
                    <MenuItem value="JPY">JPY (¥)</MenuItem>
                  </Select>
                </FormControl>
                
                <FormControl fullWidth>
                  <InputLabel>Theme</InputLabel>
                  <Select
                    value={settings.theme}
                    label="Theme"
                    startAdornment={<Palette sx={{ mr: 1 }} />}
                  >
                    <MenuItem value="light">Light</MenuItem>
                    <MenuItem value="dark">Dark</MenuItem>
                    <MenuItem value="auto">Auto</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Security Tab */}
        <TabPanel value={activeTab} index={5}>
          <Typography variant="h5" gutterBottom>
            Security Settings
          </Typography>
          
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Change Password
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  fullWidth
                  label="Current Password"
                  type={showPassword ? 'text' : 'password'}
                  InputProps={{
                    endAdornment: (
                      <IconButton onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    )
                  }}
                />
                <TextField
                  fullWidth
                  label="New Password"
                  type="password"
                />
                <TextField
                  fullWidth
                  label="Confirm New Password"
                  type="password"
                />
                <Button variant="contained" sx={{ alignSelf: 'flex-start' }}>
                  Update Password
                </Button>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Security Options
              </Typography>
              
              <List>
                <ListItem>
                  <ListItemIcon>
                    <Security />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Two-Factor Authentication" 
                    secondary="Add an extra layer of security"
                  />
                  <Switch
                    checked={settings.twoFactorAuth}
                    onChange={handleSettingChange('twoFactorAuth')}
                  />
                </ListItem>
              </List>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="h6" gutterBottom color="error">
                Danger Zone
              </Typography>
              <Button 
                variant="outlined" 
                color="error"
                startIcon={<Delete />}
                onClick={() => setDeleteDialogOpen(true)}
              >
                Delete Account
              </Button>
            </Grid>
          </Grid>
        </TabPanel>
      </Paper>

      {/* Delete Account Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Account</DialogTitle>
        <DialogContent>
          <Alert severity="error" sx={{ mb: 2 }}>
            This action cannot be undone. Your account and all data will be permanently deleted.
          </Alert>
          <Typography>
            Are you sure you want to delete your account? All your orders, favorites, and personal data will be lost.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button color="error" variant="contained">Delete Account</Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default ProfilePage 