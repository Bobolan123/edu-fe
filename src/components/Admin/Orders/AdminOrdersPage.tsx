"use client";

import { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Chip,
  Avatar,
  Menu,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  InputAdornment,
  Tooltip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
} from '@mui/material';
import {
  Search,
  FilterList,
  MoreVert,
  Visibility,
  GetApp,
  ShoppingCart,
  Payment,
  CheckCircle,
  Cancel,
  Pending,
  School,
  Close,
  Receipt,
  AttachMoney,
} from '@mui/icons-material';

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  items: Array<{
    courseId: string;
    courseTitle: string;
    price: number;
  }>;
  totalAmount: number;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: 'paypal' | 'stripe' | 'bank_transfer';
  createdAt: string;
  completedAt?: string;
  refundedAt?: string;
}

const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-2024-001',
    customerName: 'John Doe',
    customerEmail: 'john.doe@email.com',
    items: [
      { courseId: '1', courseTitle: 'React Fundamentals', price: 99.99 },
      { courseId: '2', courseTitle: 'Advanced JavaScript', price: 149.99 },
    ],
    totalAmount: 249.98,
    status: 'completed',
    paymentMethod: 'paypal',
    createdAt: '2024-02-20T10:30:00Z',
    completedAt: '2024-02-20T10:31:00Z',
  },
  {
    id: '2',
    orderNumber: 'ORD-2024-002',
    customerName: 'Sarah Wilson',
    customerEmail: 'sarah.wilson@email.com',
    items: [
      { courseId: '3', courseTitle: 'Python for Data Science', price: 199.99 },
    ],
    totalAmount: 199.99,
    status: 'pending',
    paymentMethod: 'stripe',
    createdAt: '2024-02-19T15:45:00Z',
  },
  {
    id: '3',
    orderNumber: 'ORD-2024-003',
    customerName: 'Mike Johnson',
    customerEmail: 'mike.johnson@email.com',
    items: [
      { courseId: '4', courseTitle: 'UI/UX Design Principles', price: 79.99 },
      { courseId: '5', courseTitle: 'Figma Masterclass', price: 59.99 },
    ],
    totalAmount: 139.98,
    status: 'failed',
    paymentMethod: 'stripe',
    createdAt: '2024-02-18T09:15:00Z',
  },
  {
    id: '4',
    orderNumber: 'ORD-2024-004',
    customerName: 'Emma Brown',
    customerEmail: 'emma.brown@email.com',
    items: [
      { courseId: '6', courseTitle: 'Machine Learning Basics', price: 249.99 },
    ],
    totalAmount: 249.99,
    status: 'refunded',
    paymentMethod: 'paypal',
    createdAt: '2024-02-17T14:20:00Z',
    completedAt: '2024-02-17T14:21:00Z',
    refundedAt: '2024-02-18T10:00:00Z',
  },
  {
    id: '5',
    orderNumber: 'ORD-2024-005',
    customerName: 'David Lee',
    customerEmail: 'david.lee@email.com',
    items: [
      { courseId: '7', courseTitle: 'Node.js Development', price: 129.99 },
    ],
    totalAmount: 129.99,
    status: 'completed',
    paymentMethod: 'bank_transfer',
    createdAt: '2024-02-16T11:30:00Z',
    completedAt: '2024-02-16T11:35:00Z',
  },
];

const statusColors = {
  pending: 'warning',
  completed: 'success',
  failed: 'error',
  refunded: 'info',
} as const;

const statusIcons = {
  pending: Pending,
  completed: CheckCircle,
  failed: Cancel,
  refunded: GetApp,
};

const paymentMethodLabels = {
  paypal: 'PayPal',
  stripe: 'Stripe',
  bank_transfer: 'Bank Transfer',
};

export default function AdminOrdersPage() {
  const [orders] = useState<Order[]>(mockOrders);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(mockOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [selectedPayment, setSelectedPayment] = useState('All Methods');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    filterOrders(value, selectedStatus, selectedPayment);
  };

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
    filterOrders(searchTerm, status, selectedPayment);
  };

  const handlePaymentChange = (payment: string) => {
    setSelectedPayment(payment);
    filterOrders(searchTerm, selectedStatus, payment);
  };

  const filterOrders = (search: string, status: string, payment: string) => {
    let filtered = orders;

    if (search) {
      filtered = filtered.filter(order =>
        order.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
        order.customerName.toLowerCase().includes(search.toLowerCase()) ||
        order.customerEmail.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (status !== 'All Status') {
      filtered = filtered.filter(order => order.status === status);
    }

    if (payment !== 'All Methods') {
      filtered = filtered.filter(order => order.paymentMethod === payment);
    }

    setFilteredOrders(filtered);
    setPage(0);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, order: Order) => {
    setMenuAnchor(event.currentTarget);
    setSelectedOrder(order);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedOrder(null);
  };

  const handleViewDetails = () => {
    setDetailsDialogOpen(true);
    handleMenuClose();
  };

  const handleExportOrder = () => {
    console.log('Export order:', selectedOrder);
    handleMenuClose();
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const OrderDetailsDialog = () => (
    <Dialog 
      open={detailsDialogOpen} 
      onClose={() => setDetailsDialogOpen(false)}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" fontWeight={600}>
            Order Details - {selectedOrder?.orderNumber}
          </Typography>
          <IconButton onClick={() => setDetailsDialogOpen(false)}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      
      {selectedOrder && (
        <DialogContent sx={{ pt: 2 }}>
          <Grid container spacing={3}>
            {/* Customer Info */}
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Customer Information
                  </Typography>
                  <Stack spacing={1}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Name:</Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {selectedOrder.customerName}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Email:</Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {selectedOrder.customerEmail}
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            {/* Order Info */}
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Order Information
                  </Typography>
                  <Stack spacing={1}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Status:</Typography>
                      <Chip
                        label={selectedOrder.status}
                        size="small"
                        color={statusColors[selectedOrder.status]}
                        variant="filled"
                      />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Payment:</Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {paymentMethodLabels[selectedOrder.paymentMethod]}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Total:</Typography>
                      <Typography variant="body2" fontWeight={600} color="success.main">
                        ${selectedOrder.totalAmount.toFixed(2)}
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            {/* Order Items */}
            <Grid item xs={12}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Order Items
                  </Typography>
                  <List disablePadding>
                    {selectedOrder.items.map((item, index) => (
                      <Box key={item.courseId}>
                        <ListItem disablePadding sx={{ py: 1 }}>
                          <ListItemAvatar>
                            <Avatar sx={{ backgroundColor: 'primary.main' }}>
                              <School />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={item.courseTitle}
                            secondary={`Course ID: ${item.courseId}`}
                          />
                          <Typography variant="body1" fontWeight={600} color="success.main">
                            ${item.price.toFixed(2)}
                          </Typography>
                        </ListItem>
                        {index < selectedOrder.items.length - 1 && <Divider />}
                      </Box>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>

            {/* Timeline */}
            <Grid item xs={12}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Order Timeline
                  </Typography>
                  <Stack spacing={2}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Receipt color="primary" />
                      <Box>
                        <Typography variant="body2" fontWeight={500}>
                          Order Created
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(selectedOrder.createdAt).toLocaleString()}
                        </Typography>
                      </Box>
                    </Box>
                    
                    {selectedOrder.completedAt && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <CheckCircle color="success" />
                        <Box>
                          <Typography variant="body2" fontWeight={500}>
                            Payment Completed
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(selectedOrder.completedAt).toLocaleString()}
                          </Typography>
                        </Box>
                      </Box>
                    )}
                    
                    {selectedOrder.refundedAt && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <GetApp color="info" />
                        <Box>
                          <Typography variant="body2" fontWeight={500}>
                            Order Refunded
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(selectedOrder.refundedAt).toLocaleString()}
                          </Typography>
                        </Box>
                      </Box>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </DialogContent>
      )}
      
      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button onClick={() => setDetailsDialogOpen(false)}>
          Close
        </Button>
        <Button variant="outlined" startIcon={<GetApp />}>
          Export Order
        </Button>
      </DialogActions>
    </Dialog>
  );

  const totalOrders = orders.length;
  const completedOrders = orders.filter(o => o.status === 'completed').length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const totalRevenue = orders
    .filter(o => o.status === 'completed')
    .reduce((sum, order) => sum + order.totalAmount, 0);

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" fontWeight={700} gutterBottom>
          Orders Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Track and manage all customer orders and payments
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center', p: 2 }}>
              <ShoppingCart sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h6" fontWeight={600}>
                {totalOrders}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Orders
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center', p: 2 }}>
              <CheckCircle sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
              <Typography variant="h6" fontWeight={600}>
                {completedOrders}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Completed Orders
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center', p: 2 }}>
              <Pending sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
              <Typography variant="h6" fontWeight={600}>
                {pendingOrders}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Pending Orders
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center', p: 2 }}>
              <AttachMoney sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
              <Typography variant="h6" fontWeight={600}>
                ${totalRevenue.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Revenue
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters and Search */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search orders..."
                value={searchTerm}
                onChange={handleSearch}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={selectedStatus}
                  label="Status"
                  onChange={(e) => handleStatusChange(e.target.value as string)}
                >
                  <MenuItem value="All Status">All Status</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="failed">Failed</MenuItem>
                  <MenuItem value="refunded">Refunded</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Payment Method</InputLabel>
                <Select
                  value={selectedPayment}
                  label="Payment Method"
                  onChange={(e) => handlePaymentChange(e.target.value as string)}
                >
                  <MenuItem value="All Methods">All Methods</MenuItem>
                  <MenuItem value="paypal">PayPal</MenuItem>
                  <MenuItem value="stripe">Stripe</MenuItem>
                  <MenuItem value="bank_transfer">Bank Transfer</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={2}>
              <Button
                variant="outlined"
                startIcon={<FilterList />}
                fullWidth
                sx={{ height: 56 }}
              >
                Export
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell align="center">Items</TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell align="center">Payment</TableCell>
                <TableCell align="center">Date</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrders
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((order) => {
                  const StatusIcon = statusIcons[order.status];
                  return (
                    <TableRow key={order.id} hover>
                      <TableCell>
                        <Box>
                          <Typography variant="subtitle2" fontWeight={600}>
                            {order.orderNumber}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            ID: {order.id}
                          </Typography>
                        </Box>
                      </TableCell>
                      
                      <TableCell>
                        <Box>
                          <Typography variant="body2" fontWeight={500}>
                            {order.customerName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {order.customerEmail}
                          </Typography>
                        </Box>
                      </TableCell>
                      
                      <TableCell align="right">
                        <Typography variant="body2" fontWeight={600} color="success.main">
                          ${order.totalAmount.toFixed(2)}
                        </Typography>
                      </TableCell>
                      
                      <TableCell align="center">
                        <Typography variant="body2">
                          {order.items.length} course{order.items.length > 1 ? 's' : ''}
                        </Typography>
                      </TableCell>
                      
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                          <StatusIcon sx={{ fontSize: 16, color: `${statusColors[order.status]}.main` }} />
                          <Chip
                            label={order.status}
                            size="small"
                            color={statusColors[order.status]}
                            variant="filled"
                          />
                        </Box>
                      </TableCell>
                      
                      <TableCell align="center">
                        <Typography variant="body2">
                          {paymentMethodLabels[order.paymentMethod]}
                        </Typography>
                      </TableCell>
                      
                      <TableCell align="center">
                        <Typography variant="body2" color="text.secondary">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </Typography>
                      </TableCell>
                      
                      <TableCell align="center">
                        <Tooltip title="More actions">
                          <IconButton
                            onClick={(e) => handleMenuOpen(e, order)}
                            size="small"
                          >
                            <MoreVert />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredOrders.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>

      {/* Action Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: { borderRadius: '12px', minWidth: 160 },
        }}
      >
        <MenuItem onClick={handleViewDetails}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Visibility fontSize="small" />
            View Details
          </Box>
        </MenuItem>
        
        <MenuItem onClick={handleExportOrder}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <GetApp fontSize="small" />
            Export Order
          </Box>
        </MenuItem>
      </Menu>

      {/* Dialogs */}
      <OrderDetailsDialog />
    </Box>
  );
}