"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Avatar,
  Box,
  Typography,
  Menu,
  MenuItem,
  Tooltip,
  Card,
  Chip,
} from '@mui/material';
import {
  Receipt,
  MoreVert,
  Visibility,
  Delete,
  Person,
  AttachMoney,
  GetApp,
} from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { IOrder, OrderStatus, PaymentMethod } from '../../../../types/entities';
import { useCurrency } from '@/context/CurrencyContext';
import { currencyService } from '@/service/currency';

interface OrderTableProps {
  orders: IOrder[];
  totalOrders: number;
  currentPage: number;
  onPageChange: (newPage: number) => void;
  onView: (order: IOrder) => void;
  onDelete: (order: IOrder) => void;
  onExport: (order: IOrder) => void;
}

const getStatusColor = (status: OrderStatus) => {
  switch (status) {
    case 'PENDING':
      return 'warning';
    case 'COMPLETED':
      return 'success';
    case 'FAILED':
      return 'error';
    default:
      return 'default';
  }
};

const getPaymentMethodColor = (method: PaymentMethod) => {
  switch (method) {
    case 'VNPAY':
      return 'primary';
    case 'PAYPAL':
      return 'secondary';
    default:
      return 'default';
  }
};

// Component to handle currency formatting with proper conversion
const PriceDisplay = ({ amount, currency }: { amount: number; currency: string }) => {
  const [formattedPrice, setFormattedPrice] = useState<string>(currencyService.formatPrice(amount, 'VND'));

  useEffect(() => {
    const formatPrice = async () => {
      try {
        if (currency === 'USD') {
          const convertedAmount = await currencyService.convertPrice(amount, 'VND', 'USD');
          setFormattedPrice(currencyService.formatPrice(convertedAmount, currency));
        } else {
          setFormattedPrice(currencyService.formatPrice(amount, 'VND'));
        }
      } catch (error) {
        // Fallback to original amount if conversion fails
        setFormattedPrice(currencyService.formatPrice(amount, 'VND'));
      }
    };

    formatPrice();
  }, [amount, currency]);

  return <>{formattedPrice}</>;
};

export const OrderTable = ({
  orders,
  totalOrders,
  currentPage,
  onPageChange,
  onView,
  onDelete,
  onExport,
}: OrderTableProps) => {
  const { currency } = useCurrency();
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, order: IOrder) => {
    setMenuAnchor(event.currentTarget);
    setSelectedOrder(order);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedOrder(null);
  };

  const handleView = () => {
    if (selectedOrder) {
      onView(selectedOrder);
    }
    handleMenuClose();
  };

  const handleDelete = () => {
    if (selectedOrder) {
      onDelete(selectedOrder);
    }
    handleMenuClose();
  };

  const handleExport = () => {
    if (selectedOrder) {
      onExport(selectedOrder);
    }
    handleMenuClose();
  };

  return (
    <>
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Payment</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Date</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar
                        sx={{
                          width: 48,
                          height: 48,
                          backgroundColor: 'primary.main',
                          color: 'white',
                        }}
                      >
                        <Receipt />
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" fontWeight={600}>
                          #{order.id}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {order.transactionId || 'No transaction ID'}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Person fontSize="small" color="action" />
                      <Box>
                        <Typography variant="body2" fontWeight={500}>
                          {order.user?.name || 'Unknown'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {order.user?.email || 'No email'}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AttachMoney fontSize="small" color="success" />
                      <Typography variant="body2" fontWeight={600} color="success.main">
                        <PriceDisplay amount={order.totalPrice} currency={currency} />
                      </Typography>
                    </Box>
                  </TableCell>
                  
                  <TableCell>
                    <Chip 
                      label={order.paymentMethod} 
                      size="small"
                      color={getPaymentMethodColor(order.paymentMethod) as any}
                      variant="outlined"
                    />
                  </TableCell>
                  
                  <TableCell>
                    <Chip 
                      label={order.status} 
                      size="small"
                      color={getStatusColor(order.status) as any}
                    />
                  </TableCell>
                  
                  <TableCell>
                    <Typography variant="body2">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(order.createdAt).toLocaleTimeString()}
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
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          rowsPerPageOptions={[10]}
          component="div"
          count={totalOrders}
          rowsPerPage={10}
          page={currentPage - 1}
          onPageChange={(_, newPage) => onPageChange(newPage + 1)}
          onRowsPerPageChange={() => {}}
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
        <MenuItem onClick={handleView}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Visibility fontSize="small" />
            View Order
          </Box>
        </MenuItem>
        
        <MenuItem onClick={handleExport}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <GetApp fontSize="small" />
            Export Order
          </Box>
        </MenuItem>
        
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Delete fontSize="small" />
            Delete Order
          </Box>
        </MenuItem>
      </Menu>
    </>
  );
};