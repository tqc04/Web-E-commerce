import React, { useState } from 'react'
import {
  Container,
  Typography,
  Box,
  Paper,
  Chip,
  Button,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Pagination,
} from '@mui/material'
import {
  ShoppingCart,
  LocalShipping,
  CheckCircle,
  Cancel,
  Schedule,
  Receipt,
  Visibility,
} from '@mui/icons-material'
import { useQuery } from '@tanstack/react-query'
import { apiService, Order } from '../services/api'
import notificationService from '../services/notificationService'

const OrdersPage: React.FC = () => {
  const [page, setPage] = useState(0)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  // Fetch orders
  const {
    data: ordersResponse,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['orders', page],
    queryFn: () => apiService.getOrders(page, 10),
    retry: 2,
  })

  const orders = ordersResponse?.data.content || []
  const totalElements = ordersResponse?.data.totalElements || 0
  const totalPages = Math.ceil(totalElements / 10)

  // Handle page change
  const handlePageChange = (_event: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage - 1) // Convert to 0-based index
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  // Get status color and icon
  const getStatusInfo = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return { color: 'warning' as const, icon: <Schedule />, label: 'Pending' }
      case 'processing':
        return { color: 'info' as const, icon: <LocalShipping />, label: 'Processing' }
      case 'shipped':
        return { color: 'primary' as const, icon: <LocalShipping />, label: 'Shipped' }
      case 'delivered':
        return { color: 'success' as const, icon: <CheckCircle />, label: 'Delivered' }
      case 'cancelled':
        return { color: 'error' as const, icon: <Cancel />, label: 'Cancelled' }
      default:
        return { color: 'default' as const, icon: <Schedule />, label: status }
    }
  }

  // Handle view order details
  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order)
    notificationService.info(`Viewing order #${order.id}`)
  }

  const displayOrders = orders

  // Show error state
  if (error && !displayOrders.length) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="error" gutterBottom>
            Failed to load orders
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Showing demo data instead
          </Typography>
          <Button variant="contained" onClick={() => refetch()} sx={{ mt: 2 }}>
            Try Again
          </Button>
        </Paper>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Typography variant="h3" component="h1" gutterBottom>
        Your Orders
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom sx={{ mb: 4 }}>
        Track and manage your order history
      </Typography>

      <Grid container spacing={3}>
        {/* Orders List */}
        <Grid item xs={12} md={selectedOrder ? 8 : 12}>
          {/* Loading State */}
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress size={60} />
            </Box>
          ) : displayOrders.length === 0 ? (
            <Paper sx={{ p: 8, textAlign: 'center' }}>
              <ShoppingCart sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No orders found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Start shopping to see your orders here
              </Typography>
            </Paper>
          ) : (
            <>
              {displayOrders.map((order) => {
                const statusInfo = getStatusInfo(order.status)
                
                return (
                  <Card 
                    key={order.id}
                    sx={{ 
                      mb: 2,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      '&:hover': {
                        boxShadow: 4,
                        transform: 'translateY(-2px)',
                      },
                      border: selectedOrder?.id === order.id ? 2 : 0,
                      borderColor: 'primary.main',
                    }}
                    onClick={() => handleViewOrder(order)}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box>
                          <Typography variant="h6" gutterBottom>
                            Order #{order.id}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Placed on {formatDate(order.createdAt)}
                          </Typography>
                        </Box>
                        <Chip
                          icon={statusInfo.icon}
                          label={statusInfo.label}
                          color={statusInfo.color}
                          variant="outlined"
                        />
                      </Box>

                      <Divider sx={{ my: 2 }} />

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {order.items?.length || 0} item(s)
                          </Typography>
                          <Typography variant="h6" color="primary" fontWeight="bold">
                            {formatPrice(order.totalAmount)}
                          </Typography>
                        </Box>
                        
                        <Button
                          variant="outlined"
                          startIcon={<Visibility />}
                          size="small"
                        >
                          View Details
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                )
              })}

              {/* Pagination */}
              {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <Pagination
                    count={totalPages}
                    page={page + 1}
                    onChange={handlePageChange}
                    color="primary"
                    size="large"
                  />
                </Box>
              )}
            </>
          )}
        </Grid>

        {/* Order Details Sidebar */}
        {selectedOrder && (
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, position: 'sticky', top: 20 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Receipt sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">
                  Order Details
                </Typography>
              </Box>

              <Divider sx={{ mb: 2 }} />

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Order ID
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  #{selectedOrder.id}
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Status
                </Typography>
                <Chip
                  icon={getStatusInfo(selectedOrder.status).icon}
                  label={getStatusInfo(selectedOrder.status).label}
                  color={getStatusInfo(selectedOrder.status).color}
                  size="small"
                  sx={{ mt: 1 }}
                />
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Total Amount
                </Typography>
                <Typography variant="h6" color="primary" fontWeight="bold">
                  {formatPrice(selectedOrder.totalAmount)}
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Items ({selectedOrder.items?.length || 0})
                </Typography>
                <List dense>
                  {selectedOrder.items?.map((item, index) => (
                    <ListItem key={index} sx={{ px: 0 }}>
                      <Avatar sx={{ mr: 2, bgcolor: 'primary.light' }}>
                        {item.quantity}
                      </Avatar>
                      <ListItemText
                        primary={item.product?.name || `Product #${item.productId}`}
                        secondary={`${formatPrice(item.price)} each`}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>

              <Divider sx={{ mb: 2 }} />

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Ordered:</strong> {formatDate(selectedOrder.createdAt)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Updated:</strong> {formatDate(selectedOrder.updatedAt)}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Container>
  )
}

export default OrdersPage 