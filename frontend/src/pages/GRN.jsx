import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGRNs, createGRN, reset } from '../slices/grnSlice';
import { fetchPurchaseOrders } from '../slices/purchaseOrderSlice';
import {
  Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Typography, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, CircularProgress, MenuItem, Select, FormControl, InputLabel, Grid
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { toast } from 'react-toastify';

function GRN() {
  const dispatch = useDispatch();
  const { grns, isLoading, isError, message } = useSelector((state) => state.grns);
  const { purchaseOrders } = useSelector((state) => state.purchaseOrders);

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPO, setSelectedPO] = useState('');
  const [receivedItems, setReceivedItems] = useState([]);

  useEffect(() => {
    dispatch(fetchGRNs());
    dispatch(fetchPurchaseOrders());

    return () => {
      dispatch(reset());
    };
  }, [dispatch]);

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
  }, [isError, message]);

  // When PO is selected, populate the receivedItems array
  const handlePOChange = (e) => {
    const poId = e.target.value;
    setSelectedPO(poId);
    
    const po = purchaseOrders.find(p => p._id === poId);
    if (po) {
      const initialItems = po.products.map(item => ({
        product: item.product._id,
        title: item.product.title,
        expectedQuantity: item.quantity,
        quantityReceived: item.quantity // default to receiving all
      }));
      setReceivedItems(initialItems);
    }
  };

  const handleItemChange = (index, value) => {
    const newItems = [...receivedItems];
    newItems[index].quantityReceived = value;
    setReceivedItems(newItems);
  };

  const handleOpen = () => {
    setSelectedPO('');
    setReceivedItems([]);
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedPO) {
      return toast.error('Please select a Purchase Order');
    }

    const payloadItems = receivedItems.map(item => ({
      product: item.product,
      quantityReceived: item.quantityReceived
    }));

    dispatch(createGRN({ purchaseOrder: selectedPO, receivedItems: payloadItems, status: 'Complete' }))
      .unwrap()
      .then(() => {
        toast.success('Goods Receipt Note (GRN) created. Stock updated!');
        handleClose();
      })
      .catch((error) => toast.error(error));
  };

  // Filter for pending or partially received POs (For simplicity we just show all)
  const pendingPOs = purchaseOrders.filter(po => po.status !== 'Cancelled');

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">Goods Receipt Notes (GRN)</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={handleOpen}>
          Receive Goods (New GRN)
        </Button>
      </Box>

      {isLoading && grns.length === 0 ? (
        <Box display="flex" justifyContent="center"><CircularProgress /></Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell><b>GRN ID</b></TableCell>
                <TableCell><b>Purchase Order ID</b></TableCell>
                <TableCell><b>Date Received</b></TableCell>
                <TableCell><b>Status</b></TableCell>
                <TableCell><b>Items Received</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {grns.map((grn) => (
                <TableRow key={grn._id} hover>
                  <TableCell>{grn._id.substring(18, 24).toUpperCase()}</TableCell>
                  <TableCell>{grn.purchaseOrder?._id?.substring(18, 24).toUpperCase()}</TableCell>
                  <TableCell>{new Date(grn.dateReceived).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Box sx={{ px: 1, py: 0.5, borderRadius: 1, display: 'inline-block', backgroundColor: '#e8f5e9', color: '#2e7d32' }}>
                      {grn.status}
                    </Box>
                  </TableCell>
                  <TableCell>{grn.receivedItems.length} Products</TableCell>
                </TableRow>
              ))}
              {grns.length === 0 && !isLoading && (
                <TableRow>
                  <TableCell colSpan={5} align="center">No Goods Receipt Notes found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Create GRN Dialog */}
      <Dialog open={openDialog} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Receive Goods (Create GRN)</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <FormControl fullWidth margin="dense">
              <InputLabel id="po-label">Select Purchase Order</InputLabel>
              <Select
                labelId="po-label"
                value={selectedPO}
                label="Select Purchase Order"
                onChange={handlePOChange}
              >
                {pendingPOs.map((po) => (
                  <MenuItem key={po._id} value={po._id}>
                    PO-{po._id.substring(18, 24).toUpperCase()} ({po.supplier?.name})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {receivedItems.length > 0 && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>Received Items</Typography>
                <Grid container spacing={2} sx={{ mb: 1 }}>
                  <Grid item xs={6}><Typography variant="subtitle2">Product</Typography></Grid>
                  <Grid item xs={3}><Typography variant="subtitle2">Expected</Typography></Grid>
                  <Grid item xs={3}><Typography variant="subtitle2">Received Qty</Typography></Grid>
                </Grid>
                {receivedItems.map((item, index) => (
                  <Grid container spacing={2} key={index} sx={{ mb: 2, alignItems: 'center' }}>
                    <Grid item xs={6}>
                      <Typography>{item.title}</Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <Typography>{item.expectedQuantity}</Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <TextField
                        fullWidth
                        size="small"
                        type="number"
                        value={item.quantityReceived}
                        onChange={(e) => handleItemChange(index, parseInt(e.target.value))}
                        InputProps={{ inputProps: { min: 0 } }}
                      />
                    </Grid>
                  </Grid>
                ))}
                <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                  Submitting this GRN will automatically add the Received Qty to your global product stock.
                </Typography>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={isLoading || !selectedPO}>Confirm Receipt</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}

export default GRN;
