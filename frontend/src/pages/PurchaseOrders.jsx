import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPurchaseOrders, createPurchaseOrder, updatePurchaseOrderStatus, reset } from '../slices/purchaseOrderSlice';
import { getSuppliers } from '../slices/supplierSlice';
import { getProducts } from '../slices/productSlice';
import {
  Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Typography, IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, CircularProgress, MenuItem, Select, FormControl, InputLabel, Grid
} from '@mui/material';
import { Add, CheckCircle, Delete } from '@mui/icons-material';
import { toast } from 'react-toastify';

function PurchaseOrders() {
  const dispatch = useDispatch();
  const { purchaseOrders, isLoading, isError, message } = useSelector((state) => state.purchaseOrders);
  const { suppliers } = useSelector((state) => state.supplier);
  const { products } = useSelector((state) => state.product);

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [orderItems, setOrderItems] = useState([{ product: '', quantity: 1 }]);

  useEffect(() => {
    dispatch(fetchPurchaseOrders());
    dispatch(getSuppliers());
    dispatch(getProducts());

    return () => {
      dispatch(reset());
    };
  }, [dispatch]);

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
  }, [isError, message]);

  const handleOpen = () => {
    setSelectedSupplier('');
    setOrderItems([{ product: '', quantity: 1 }]);
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...orderItems];
    newItems[index][field] = value;
    setOrderItems(newItems);
  };

  const addItemRow = () => {
    setOrderItems([...orderItems, { product: '', quantity: 1 }]);
  };

  const removeItemRow = (index) => {
    const newItems = [...orderItems];
    newItems.splice(index, 1);
    setOrderItems(newItems);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedSupplier) {
      return toast.error('Please select a supplier');
    }
    
    // Filter out empty items
    const validItems = orderItems.filter(item => item.product && item.quantity > 0);
    if (validItems.length === 0) {
      return toast.error('Please add at least one product with quantity > 0');
    }

    dispatch(createPurchaseOrder({ supplier: selectedSupplier, products: validItems }))
      .unwrap()
      .then(() => {
        toast.success('Purchase Order created successfully');
        handleClose();
      })
      .catch((error) => toast.error(error));
  };

  // For POs, marking them Received is usually done via GRN, but for simplicity we allow manual override here
  const handleMarkReceived = (id) => {
    if (window.confirm('Mark this purchase order as Received? (Note: To update stock, create a GRN instead)')) {
      dispatch(updatePurchaseOrderStatus({ id, status: 'Received' }))
        .unwrap()
        .then(() => toast.success('Order marked as received'))
        .catch((error) => toast.error(error));
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">Purchase Orders</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={handleOpen}>
          Create Purchase Order
        </Button>
      </Box>

      {isLoading && purchaseOrders.length === 0 ? (
        <Box display="flex" justifyContent="center"><CircularProgress /></Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell><b>Order ID</b></TableCell>
                <TableCell><b>Supplier</b></TableCell>
                <TableCell><b>Total Price</b></TableCell>
                <TableCell><b>Status</b></TableCell>
                <TableCell><b>Date</b></TableCell>
                <TableCell align="center"><b>Actions</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {purchaseOrders.map((order) => (
                <TableRow key={order._id} hover>
                  <TableCell>{order._id.substring(18, 24).toUpperCase()}</TableCell>
                  <TableCell>{order.supplier?.name}</TableCell>
                  <TableCell>₹{order.totalPrice}</TableCell>
                  <TableCell>
                    <Box sx={{ 
                      px: 1, py: 0.5, borderRadius: 1, display: 'inline-block',
                      backgroundColor: order.status === 'Received' ? '#e8f5e9' : '#fff3e0',
                      color: order.status === 'Received' ? '#2e7d32' : '#ed6c02'
                    }}>
                      {order.status}
                    </Box>
                  </TableCell>
                  <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell align="center">
                    {order.status !== 'Received' && (
                      <IconButton color="success" title="Mark as Received" onClick={() => handleMarkReceived(order._id)}>
                        <CheckCircle />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {purchaseOrders.length === 0 && !isLoading && (
                <TableRow>
                  <TableCell colSpan={6} align="center">No purchase orders found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Create Order Dialog */}
      <Dialog open={openDialog} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Create New Purchase Order</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <FormControl fullWidth margin="dense">
              <InputLabel id="supplier-label">Supplier</InputLabel>
              <Select
                labelId="supplier-label"
                value={selectedSupplier}
                label="Supplier"
                onChange={(e) => setSelectedSupplier(e.target.value)}
              >
                {suppliers.map((s) => (
                  <MenuItem key={s._id} value={s._id}>{s.name} ({s.email})</MenuItem>
                ))}
              </Select>
            </FormControl>

            <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>Products</Typography>
            {orderItems.map((item, index) => (
              <Grid container spacing={2} key={index} sx={{ mb: 1, alignItems: 'center' }}>
                <Grid item xs={7}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Product</InputLabel>
                    <Select
                      value={item.product}
                      label="Product"
                      onChange={(e) => handleItemChange(index, 'product', e.target.value)}
                    >
                      {products.map((p) => (
                        <MenuItem key={p._id} value={p._id}>{p.title} - ₹{p.price}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    fullWidth
                    size="small"
                    type="number"
                    label="Qty"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value))}
                    InputProps={{ inputProps: { min: 1 } }}
                  />
                </Grid>
                <Grid item xs={2}>
                  <IconButton color="error" onClick={() => removeItemRow(index)} disabled={orderItems.length === 1}>
                    <Delete />
                  </IconButton>
                </Grid>
              </Grid>
            ))}
            <Button startIcon={<Add />} onClick={addItemRow} sx={{ mt: 1 }}>Add Another Product</Button>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={isLoading}>Create Order</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}

export default PurchaseOrders;
