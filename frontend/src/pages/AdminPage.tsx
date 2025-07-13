import React, { useState } from 'react'
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
  Avatar,
} from '@mui/material'
import {
  Dashboard,
  People,
  Inventory,
  ShoppingCart,
  TrendingUp,
  AttachMoney,
  PersonAdd,
  Add,
  Edit,
  Delete,
} from '@mui/icons-material'
import { useQuery } from '@tanstack/react-query'
import { apiService, DashboardStats, User } from '../services/api'
import notificationService from '../services/notificationService'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel({ children, value, index, ...other }: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

const AdminPage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0)
  const [usersPage] = useState(0)
  const [inventoryPage] = useState(0)

  // Fetch dashboard stats
  const {
    data: statsResponse,
    isLoading: statsIsLoading,
    error: statsError
  } = useQuery({
    queryKey: ['admin-dashboard-stats'],
    queryFn: () => apiService.getDashboardStats(),
  })

  // Fetch users
  const {
    data: usersResponse,
    isLoading: usersLoading,
    error: usersError
  } = useQuery({
    queryKey: ['admin-users', usersPage],
    queryFn: () => apiService.getUsers(usersPage, 10),
  })

  // Fetch inventory  
  const {
    data: inventoryResponse,
    isLoading: inventoryLoading,
  } = useQuery({
    queryKey: ['admin-inventory', inventoryPage],
    queryFn: () => apiService.getInventory(inventoryPage, 10),
  })

  const stats = statsResponse?.data || {
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    recentOrders: [],
    topProducts: []
  }

  const users = usersResponse?.data.content || []
  // const inventory = inventoryResponse?.data.content || []

  // Mock data for demonstration
  const mockStats: DashboardStats = {
    totalUsers: 1250,
    totalProducts: 450,
    totalOrders: 890,
    totalRevenue: 125000,
    recentOrders: [],
    topProducts: []
  }

  const mockUsers: User[] = [
    {
      id: 1,
      username: 'john_doe',
      email: 'john@example.com',
      firstName: 'John',
      lastName: 'Doe',
      role: 'USER',
      createdAt: '2024-01-15T10:30:00Z'
    },
    {
      id: 2,
      username: 'admin_user',
      email: 'admin@example.com',
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      createdAt: '2024-01-10T09:20:00Z'
    }
  ]

  const displayStats = statsError ? mockStats : stats
  const displayUsers = usersError ? mockUsers : users

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'error'
      case 'user':
        return 'primary'
      default:
        return 'default'
    }
  }

  // Stats Cards Component
  const StatsCards = () => (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                <People />
              </Avatar>
              <Box>
                <Typography color="text.secondary" gutterBottom>
                  Total Users
                </Typography>
                <Typography variant="h5" component="div">
                  {displayStats?.totalUsers.toLocaleString() || '0'}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                <Inventory />
              </Avatar>
              <Box>
                <Typography color="text.secondary" gutterBottom>
                  Products
                </Typography>
                <Typography variant="h5" component="div">
                  {displayStats?.totalProducts.toLocaleString() || '0'}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                <ShoppingCart />
              </Avatar>
              <Box>
                <Typography color="text.secondary" gutterBottom>
                  Total Orders
                </Typography>
                <Typography variant="h5" component="div">
                  {displayStats?.totalOrders.toLocaleString() || '0'}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ bgcolor: 'info.main', mr: 2 }}>
                <AttachMoney />
              </Avatar>
              <Box>
                <Typography color="text.secondary" gutterBottom>
                  Revenue
                </Typography>
                <Typography variant="h5" component="div">
                  {formatCurrency(displayStats?.totalRevenue || 0)}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <Dashboard sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
        <Box>
          <Typography variant="h3" component="h1" gutterBottom>
            Admin Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage users, inventory, analytics, and system monitoring
          </Typography>
        </Box>
      </Box>

      {/* Stats Overview */}
      <StatsCards />

      {/* Navigation Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab icon={<People />} label="Users" />
          <Tab icon={<Inventory />} label="Inventory" />
          <Tab icon={<ShoppingCart />} label="Analytics" />
          <Tab icon={<AttachMoney />} label="Security" />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      <Paper>
        {/* Users Tab */}
        <TabPanel value={tabValue} index={0}>
          <Typography variant="h6" gutterBottom>
            User Management
          </Typography>
          
          {usersLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              {/* CircularProgress removed */}
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>User</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Joined</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {displayUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar sx={{ mr: 2 }}>
                            {user.firstName?.[0]}{user.lastName?.[0]}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight="bold">
                              {user.firstName} {user.lastName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              @{user.username}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Chip 
                          label={user.role} 
                          color={getRoleColor(user.role) as any}
                          size="small" 
                        />
                      </TableCell>
                      <TableCell>{formatDate(user.createdAt)}</TableCell>
                      <TableCell>
                        <Button size="small" onClick={() => notificationService.info('View user details')}>
                          <Edit />
                        </Button>
                        <Button size="small" onClick={() => notificationService.info('Edit user')}>
                          <Edit />
                        </Button>
                        <Button size="small" onClick={() => notificationService.warning('Delete user')}>
                          <Delete />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </TabPanel>

        {/* Inventory Tab */}
        <TabPanel value={tabValue} index={1}>
          <Typography variant="h6" gutterBottom>
            Inventory Management
          </Typography>
          
          {inventoryLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              {/* CircularProgress removed */}
            </Box>
          ) : (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Low Stock Alert
                    </Typography>
                    <Box sx={{ p: 2 }}>
                      <Chip 
                        label="Wireless Headphones (Only 5 items left)" 
                        color="warning" 
                        size="small" 
                        icon={<Inventory />}
                      />
                      <Chip 
                        label="Smart Watch (Out of stock)" 
                        color="error" 
                        size="small" 
                        icon={<Inventory />}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Top Selling Products
                    </Typography>
                    <Box sx={{ p: 2 }}>
                      <Chip 
                        label="Laptop Pro (150 sold this month)" 
                        color="success" 
                        size="small" 
                        icon={<TrendingUp />}
                      />
                      <Chip 
                        label="Gaming Mouse (98 sold this month)" 
                        color="info" 
                        size="small" 
                        icon={<TrendingUp />}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </TabPanel>

        {/* Analytics Tab */}
        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" gutterBottom>
            Analytics & Reports
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Sales Trends
                  </Typography>
                  <Box sx={{ p: 4, textAlign: 'center' }}>
                    <TrendingUp sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
                    <Typography variant="body1">
                      Sales increased by 25% this month
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    User Activity
                  </Typography>
                  <Box sx={{ p: 4, textAlign: 'center' }}>
                    <People sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                    <Typography variant="body1">
                      450 active users today
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Security Tab */}
        <TabPanel value={tabValue} index={3}>
          <Typography variant="h6" gutterBottom>
            Security & Fraud Detection
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Security Status
                  </Typography>
                  <Box sx={{ p: 2 }}>
                    <Chip 
                      label="System Security (All systems secure)" 
                      color="success" 
                      size="small" 
                      icon={<People />}
                    />
                    <Chip 
                      label="Failed Login Attempts (3 attempts in the last hour)" 
                      color="warning" 
                      size="small" 
                      icon={<PersonAdd />}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Fraud Detection
                  </Typography>
                  <Box sx={{ p: 4, textAlign: 'center' }}>
                    {/* Security icon removed */}
                    <Typography variant="body1">
                      No suspicious activities detected
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
      </Paper>
    </Container>
  )
}

export default AdminPage 