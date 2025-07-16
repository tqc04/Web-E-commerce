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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
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
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
  const [orderToCancel, setOrderToCancel] = useState<Order | null>(null)
  const [cancelReason, setCancelReason] = useState('')
  const [cancelling, setCancelling] = useState(false)

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

  // Handle cancel order
  const handleCancelOrder = (order: Order) => {
    setOrderToCancel(order)
    setCancelDialogOpen(true)
  }

  const handleCancelConfirm = async () => {
    if (!orderToCancel || !cancelReason.trim()) {
      notificationService.error('Please provide a cancellation reason')
      return
    }

    try {
      setCancelling(true)
      await apiService.cancelOrder(orderToCancel.id, cancelReason.trim())
      
      // Refresh orders list
      refetch()
      
      // Close dialog and reset state
      setCancelDialogOpen(false)
      setOrderToCancel(null)
      setCancelReason('')
      
      notificationService.success('Order cancelled successfully')
    } catch (error) {
      notificationService.error('Failed to cancel order')
    } finally {
      setCancelling(false)
    }
  }

  const handleCancelDialogClose = () => {
    if (!cancelling) {
      setCancelDialogOpen(false)
      setOrderToCancel(null)
      setCancelReason('')
    }
  }

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'PENDING':
        return {
          label: 'Pending',
          color: 'warning' as const,
          icon: <Schedule />,
          description: 'Order created, waiting for processing'
        }
      case 'PENDING_APPROVAL':
        return {
          label: 'Pending Approval',
          color: 'info' as const,
          icon: <Schedule />,
          description: 'Waiting for admin approval'
        }
      case 'APPROVED':
        return {
          label: 'Approved',
          color: 'success' as const,
          icon: <CheckCircle />,
          description: 'Order approved by admin'
        }
      case 'CONFIRMED':
        return {
          label: 'Confirmed',
          color: 'primary' as const,
          icon: <CheckCircle />,
          description: 'Payment confirmed'
        }
      case 'PROCESSING':
        return {
          label: 'Processing',
          color: 'secondary' as const,
          icon: <LocalShipping />,
          description: 'Order being processed and packed'
        }
      case 'SHIPPED':
        return {
          label: 'Shipped',
          color: 'info' as const,
          icon: <LocalShipping />,
          description: 'Order shipped to customer'
        }
      case 'DELIVERED':
        return {
          label: 'Delivered',
          color: 'success' as const,
          icon: <CheckCircle />,
          description: 'Order delivered successfully'
        }
      case 'COMPLETED':
        return {
          label: 'Completed',
          color: 'success' as const,
          icon: <CheckCircle />,
          description: 'Order completed by customer'
        }
      case 'CANCELLED':
        return {
          label: 'Cancelled',
          color: 'error' as const,
          icon: <Cancel />,
          description: 'Order has been cancelled'
        }
      case 'REFUNDED':
        return {
          label: 'Refunded',
          color: 'default' as const,
          icon: <Receipt />,
          description: 'Order refunded to customer'
        }
      default:
        return {
          label: status,
          color: 'default' as const,
          icon: <Schedule />,
          description: 'Unknown status'
        }
    }
  }

  const canCancelOrder = (order: Order) => {
    const cancellableStatuses = ['PENDING', 'PENDING_APPROVAL', 'APPROVED', 'CONFIRMED', 'PROCESSING']
    return cancellableStatuses.includes(order.status)
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
    <>
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
                          
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button
                              variant="outlined"
                              startIcon={<Visibility />}
                              size="small"
                            >
                              View Details
                            </Button>
                            
                            {canCancelOrder(order) && (
                              <Button
                                variant="outlined"
                                color="error"
                                startIcon={<Cancel />}
                                size="small"
                                onClick={() => handleCancelOrder(order)}
                              >
                                Cancel
                              </Button>
                            )}
                          </Box>
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

      {/* Cancel Order Dialog */}
      <Dialog
        open={cancelDialogOpen}
        onClose={handleCancelDialogClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          Cancel Order
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Are you sure you want to cancel order{' '}
            <strong>{orderToCancel?.orderNumber}</strong>?
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Cancellation Reason"
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            placeholder="Please provide a reason for cancellation..."
            required
          />
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleCancelDialogClose}
            disabled={cancelling}
          >
            Keep Order
          </Button>
          <Button
            onClick={handleCancelConfirm}
            color="error"
            variant="contained"
            disabled={!cancelReason.trim() || cancelling}
          >
            {cancelling ? <CircularProgress size={20} sx={{ mr: 1 }} /> : null}
            Cancel Order
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default OrdersPage 