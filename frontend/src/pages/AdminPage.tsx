import React, { Suspense } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Tabs,
  Tab,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Avatar,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Alert,
  Snackbar,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Badge,
} from '@mui/material';
import {
  Dashboard,
  People,
  Inventory,
  AttachMoney,
  LocalOffer,
  ShoppingCart,
  TrendingUp,
  Add,
  Edit,
  Delete,
  Visibility,
  Block,
  CheckCircle,
  Warning,
  Refresh,
  Download,
  Upload,
  Settings,
  Analytics,
  Notifications,
  Security,
  Store,
  Category,
  Assessment,
  MonetizationOn,
  Discount,
  Receipt,
  Support,
  PersonAdd,
  Group,
  AdminPanelSettings,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

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
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const AdminPage: React.FC = () => {
  const { isAuthenticated, isAdmin, user } = useAuth();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as any });

  // Mock data - sẽ được thay thế bằng API calls
  const [stats] = useState({
    totalUsers: 1247,
    totalProducts: 856,
    totalOrders: 2341,
    totalRevenue: 125430.50,
    monthlyGrowth: 12.5,
    activeUsers: 892,
    pendingOrders: 23,
    lowStockProducts: 15,
  });

  const [recentOrders] = useState([
    { id: 1, customer: 'John Doe', amount: 299.99, status: 'Delivered', date: '2024-01-15' },
    { id: 2, customer: 'Jane Smith', amount: 149.99, status: 'Processing', date: '2024-01-14' },
    { id: 3, customer: 'Mike Johnson', amount: 599.99, status: 'Shipped', date: '2024-01-13' },
    { id: 4, customer: 'Sarah Wilson', amount: 199.99, status: 'Pending', date: '2024-01-12' },
  ]);

  const [products] = useState([
    { id: 1, name: 'Gaming Laptop Pro', category: 'Electronics', price: 1299.99, stock: 25, status: 'Active' },
    { id: 2, name: 'Wireless Headphones', category: 'Audio', price: 199.99, stock: 50, status: 'Active' },
    { id: 3, name: 'Smartphone X', category: 'Mobile', price: 899.99, stock: 15, status: 'Active' },
    { id: 4, name: '4K Monitor', category: 'Computers', price: 399.99, stock: 8, status: 'Low Stock' },
  ]);

  const [users] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'User', status: 'Active', joinDate: '2023-12-01' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Admin', status: 'Active', joinDate: '2023-11-15' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'User', status: 'Inactive', joinDate: '2023-10-20' },
    { id: 4, name: 'Sarah Wilson', email: 'sarah@example.com', role: 'User', status: 'Active', joinDate: '2023-09-10' },
  ]);

  const [vouchers] = useState([
    { id: 1, code: 'SAVE20', discount: '20%', validUntil: '2024-02-15', usage: 45, maxUsage: 100, status: 'Active' },
    { id: 2, code: 'FREESHIP', discount: 'Free Shipping', validUntil: '2024-01-31', usage: 78, maxUsage: 200, status: 'Active' },
    { id: 3, code: 'NEWYEAR', discount: '50%', validUntil: '2024-01-01', usage: 100, maxUsage: 100, status: 'Expired' },
  ]);

  const [productImages, setProductImages] = useState<{ file: File; preview: string }[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (!isAdmin) {
      navigate('/');
    }
  }, [isAuthenticated, isAdmin, navigate]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleOpenDialog = (type: string) => {
    setDialogType(type);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setDialogType('');
    setProductImages([]); // Clear images on dialog close
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleProductImagesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setProductImages(files.map(file => ({ file, preview: URL.createObjectURL(file) })));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
      case 'Delivered':
        return 'success';
      case 'Processing':
      case 'Shipped':
        return 'warning';
      case 'Pending':
      case 'Inactive':
        return 'error';
      case 'Low Stock':
        return 'warning';
      case 'Expired':
        return 'error';
      default:
        return 'default';
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  if (!isAdmin) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ borderRadius: 3 }}>
          Access denied. You don't have permission to view this page.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 5 }}>
        <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
          Admin Dashboard
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Welcome back, {user?.firstName}! Manage your e-commerce platform
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={5} sx={{ mb: 7, maxWidth: 1300, mx: 'auto' }}>
        <Grid item xs={12} sm={6} md={3} display="flex">
          <Card sx={{ borderRadius: 3, width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Total Users
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {stats.totalUsers.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="success.main">
                    +{stats.monthlyGrowth}% this month
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
                  <People />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3} display="flex">
          <Card sx={{ borderRadius: 3, width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Total Products
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {stats.totalProducts.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="warning.main">
                    {stats.lowStockProducts} low stock
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'secondary.main', width: 56, height: 56 }}>
                  <Inventory />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3} display="flex">
          <Card sx={{ borderRadius: 3, width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Total Orders
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {stats.totalOrders.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="info.main">
                    {stats.pendingOrders} pending
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'success.main', width: 56, height: 56 }}>
                  <ShoppingCart />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3} display="flex">
          <Card sx={{ borderRadius: 3, width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Total Revenue
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    ${stats.totalRevenue.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="success.main">
                    +8.2% this month
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'warning.main', width: 56, height: 56 }}>
                  <AttachMoney />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Content Tabs */}
      <Paper sx={{ borderRadius: 3, p: 2, mb: 4, mt: 2, width: '100%', maxWidth: 1300, mx: 'auto' }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
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
          <Tab icon={<Dashboard />} label="Overview" />
          <Tab icon={<People />} label="Users" />
          <Tab icon={<Inventory />} label="Products" />
          <Tab icon={<ShoppingCart />} label="Orders" />
          <Tab icon={<LocalOffer />} label="Vouchers" />
          <Tab icon={<Analytics />} label="Analytics" />
          <Tab icon={<Settings />} label="Settings" />
          <Tab icon={<Inventory />} label="Inventory" />
        </Tabs>

        <Divider sx={{ my: 2 }} />

        {/* Overview Tab */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={4}>
            {/* Recent Orders */}
            <Grid item xs={12} md={8}>
              <Card sx={{ borderRadius: 3, p: 2, mb: 3 }}>
                <CardContent sx={{ p: 0 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      Recent Orders
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => setTabValue(3)}
                      sx={{ borderRadius: 2, fontWeight: 'bold' }}
                    >
                      View All
                    </Button>
                  </Box>
                  <TableContainer sx={{ maxHeight: 340 }}>
                    <Table stickyHeader>
                      <TableHead>
                        <TableRow>
                          <TableCell>Order ID</TableCell>
                          <TableCell>Customer</TableCell>
                          <TableCell>Amount</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Date</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {recentOrders.map((order) => (
                          <TableRow key={order.id} hover>
                            <TableCell>#{order.id}</TableCell>
                            <TableCell>{order.customer}</TableCell>
                            <TableCell>${order.amount}</TableCell>
                            <TableCell>
                              <Chip
                                label={order.status}
                                color={getStatusColor(order.status) as any}
                                size="small"
                              />
                            </TableCell>
                            <TableCell>{order.date}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>

            {/* Quick Actions */}
            <Grid item xs={12} md={4}>
              <Card sx={{ borderRadius: 3, p: 2, mb: 3 }}>
                <CardContent sx={{ p: 0 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                    Quick Actions
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Button
                      variant="contained"
                      startIcon={<Add />}
                      onClick={() => handleOpenDialog('product')}
                      fullWidth
                    >
                      Add Product
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<PersonAdd />}
                      onClick={() => handleOpenDialog('user')}
                      fullWidth
                    >
                      Add User
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<LocalOffer />}
                      onClick={() => handleOpenDialog('voucher')}
                      fullWidth
                    >
                      Create Voucher
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<Download />}
                      fullWidth
                    >
                      Export Data
                    </Button>
                  </Box>
                </CardContent>
              </Card>

              {/* System Status */}
              <Card sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                    System Status
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Server Load</Typography>
                        <Typography variant="body2">65%</Typography>
                      </Box>
                      <LinearProgress variant="determinate" value={65} />
                    </Box>
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Database</Typography>
                        <Typography variant="body2" color="success.main">Healthy</Typography>
                      </Box>
                    </Box>
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">API Status</Typography>
                        <Typography variant="body2" color="success.main">Online</Typography>
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Users Tab */}
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              User Management
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => handleOpenDialog('user')}
            >
              Add User
            </Button>
          </Box>
          <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Join Date</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Chip
                        label={user.role}
                        color={user.role === 'Admin' ? 'warning' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={user.status}
                        color={getStatusColor(user.status) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{user.joinDate}</TableCell>
                    <TableCell>
                      <IconButton size="small" color="primary">
                        <Edit />
                      </IconButton>
                      <IconButton size="small" color="secondary">
                        <Visibility />
                      </IconButton>
                      <IconButton size="small" color="error">
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Products Tab */}
        <TabPanel value={tabValue} index={2}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              Product Management
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => handleOpenDialog('product')}
            >
              Add Product
            </Button>
          </Box>
          <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Stock</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.id}</TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>${product.price}</TableCell>
                    <TableCell>
                      <Chip
                        label={product.stock}
                        color={product.stock < 10 ? 'error' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={product.status}
                        color={getStatusColor(product.status) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton size="small" color="primary">
                        <Edit />
                      </IconButton>
                      <IconButton size="small" color="secondary">
                        <Visibility />
                      </IconButton>
                      <IconButton size="small" color="error">
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Orders Tab */}
        <TabPanel value={tabValue} index={3}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
            Order Management
          </Typography>
          <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Order ID</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>#{order.id}</TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell>${order.amount}</TableCell>
                    <TableCell>
                      <Chip
                        label={order.status}
                        color={getStatusColor(order.status) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell>
                      <IconButton size="small" color="primary">
                        <Edit />
                      </IconButton>
                      <IconButton size="small" color="secondary">
                        <Visibility />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Vouchers Tab */}
        <TabPanel value={tabValue} index={4}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              Voucher Management
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => handleOpenDialog('voucher')}
            >
              Create Voucher
            </Button>
          </Box>
          <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Code</TableCell>
                  <TableCell>Discount</TableCell>
                  <TableCell>Valid Until</TableCell>
                  <TableCell>Usage</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {vouchers.map((voucher) => (
                  <TableRow key={voucher.id}>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
                        {voucher.code}
                      </Typography>
                    </TableCell>
                    <TableCell>{voucher.discount}</TableCell>
                    <TableCell>{voucher.validUntil}</TableCell>
                    <TableCell>
                      {voucher.usage}/{voucher.maxUsage}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={voucher.status}
                        color={getStatusColor(voucher.status) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton size="small" color="primary">
                        <Edit />
                      </IconButton>
                      <IconButton size="small" color="error">
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Analytics Tab */}
        <TabPanel value={tabValue} index={5}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
            Analytics & Reports
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                    Sales Overview
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography>This Month</Typography>
                    <Typography variant="h6" color="success.main">
                      $45,230
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography>Last Month</Typography>
                    <Typography variant="h6">$38,450</Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={75} sx={{ mb: 1 }} />
                  <Typography variant="body2" color="success.main">
                    +17.6% increase
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                    Top Products
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar>1</Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary="Gaming Laptop Pro"
                        secondary="234 sales"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar>2</Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary="Wireless Headphones"
                        secondary="189 sales"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar>3</Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary="Smartphone X"
                        secondary="156 sales"
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Inventory Tab */}
        <TabPanel value={tabValue} index={7}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              Inventory Management
            </Typography>
          </Box>
          <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Stock</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.id}</TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>
                      <Chip
                        label={product.stock}
                        color={product.stock < 10 ? 'error' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<Add />}
                        onClick={() => handleOpenDialog(`restock-${product.id}`)}
                      >
                        Restock
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Settings Tab */}
        <TabPanel value={tabValue} index={6}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
            System Settings
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                    General Settings
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <FormControlLabel
                      control={<Switch defaultChecked />}
                      label="Enable Email Notifications"
                    />
                    <FormControlLabel
                      control={<Switch defaultChecked />}
                      label="Auto-approve Orders"
                    />
                    <FormControlLabel
                      control={<Switch />}
                      label="Maintenance Mode"
                    />
                    <FormControlLabel
                      control={<Switch defaultChecked />}
                      label="Enable Analytics"
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                    Security Settings
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <FormControlLabel
                      control={<Switch defaultChecked />}
                      label="Two-Factor Authentication"
                    />
                    <FormControlLabel
                      control={<Switch defaultChecked />}
                      label="Session Timeout"
                    />
                    <FormControlLabel
                      control={<Switch />}
                      label="IP Whitelist"
                    />
                    <FormControlLabel
                      control={<Switch defaultChecked />}
                      label="Login Notifications"
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
      </Paper>

      {/* Add/Edit Dialogs */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {dialogType === 'product' && 'Add New Product'}
          {dialogType === 'user' && 'Add New User'}
          {dialogType === 'voucher' && 'Create Voucher'}
          {dialogType.startsWith('restock-') && 'Restock Product'}
        </DialogTitle>
        <DialogContent>
          {dialogType === 'product' && (
            <Box sx={{ pt: 2 }}>
              <TextField fullWidth label="Product Name" margin="normal" />
              <FormControl fullWidth margin="normal">
                <InputLabel>Category</InputLabel>
                <Select label="Category">
                  <MenuItem value="electronics">Electronics</MenuItem>
                  <MenuItem value="gaming">Gaming</MenuItem>
                  <MenuItem value="computers">Computers</MenuItem>
                  <MenuItem value="mobile">Mobile</MenuItem>
                  <MenuItem value="audio">Audio</MenuItem>
                </Select>
              </FormControl>
              <TextField fullWidth label="Price" type="number" margin="normal" />
              <TextField fullWidth label="Stock" type="number" margin="normal" />
              <TextField fullWidth label="Description" multiline rows={3} margin="normal" />
              {/* Upload multiple images */}
              <Button
                variant="outlined"
                component="label"
                sx={{ mt: 2, mb: 1 }}
              >
                Upload Images
                <input
                  type="file"
                  hidden
                  multiple
                  accept="image/*"
                  onChange={handleProductImagesChange}
                />
              </Button>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                {productImages.map((img, idx) => (
                  <Box key={idx} sx={{ width: 64, height: 64, border: '1px solid #eee', borderRadius: 2, overflow: 'hidden', position: 'relative' }}>
                    <img src={img.preview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </Box>
                ))}
              </Box>
            </Box>
          )}
          {dialogType === 'user' && (
            <Box sx={{ pt: 2 }}>
              <TextField fullWidth label="Full Name" margin="normal" />
              <TextField fullWidth label="Email" type="email" margin="normal" />
              <FormControl fullWidth margin="normal">
                <InputLabel>Role</InputLabel>
                <Select label="Role">
                  <MenuItem value="user">User</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                </Select>
              </FormControl>
              <TextField fullWidth label="Password" type="password" margin="normal" />
            </Box>
          )}
          {dialogType === 'voucher' && (
            <Box sx={{ pt: 2 }}>
              <TextField fullWidth label="Voucher Code" margin="normal" />
              <TextField fullWidth label="Discount (%)" type="number" margin="normal" />
              <TextField fullWidth label="Valid Until" type="date" margin="normal" InputLabelProps={{ shrink: true }} />
              <TextField fullWidth label="Max Usage" type="number" margin="normal" />
            </Box>
          )}
          {dialogType.startsWith('restock-') && (
            <Box sx={{ pt: 2 }}>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                Enter quantity to restock for product #{dialogType.replace('restock-', '')}
              </Typography>
              <TextField fullWidth label="Quantity" type="number" margin="normal" />
              {/* Hiển thị lịch sử nhập kho (mock) */}
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Restock History
                </Typography>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Quantity</TableCell>
                      <TableCell>Admin</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>2024-07-15</TableCell>
                      <TableCell>20</TableCell>
                      <TableCell>admin</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>2024-06-10</TableCell>
                      <TableCell>15</TableCell>
                      <TableCell>admin</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleCloseDialog}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AdminPage; 