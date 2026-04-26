import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInvoices, createInvoice, updateInvoiceStatus, reset } from '../slices/invoiceSlice';
import { fetchSalesOrders } from '../slices/salesOrderSlice';
import {
  Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Typography, IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, CircularProgress, MenuItem, Select, FormControl, InputLabel
} from '@mui/material';
import { Add, Payment } from '@mui/icons-material';
import { toast } from 'react-toastify';

function Invoices() {
  const dispatch = useDispatch();
  const { invoices, isLoading, isError, message } = useSelector((state) => state.invoices);
  const { salesOrders } = useSelector((state) => state.salesOrders);

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedSO, setSelectedSO] = useState('');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    dispatch(fetchInvoices());
    dispatch(fetchSalesOrders());

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
    setSelectedSO('');
    setDueDate('');
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedSO || !dueDate) {
      return toast.error('Please fill in all fields');
    }

    dispatch(createInvoice({ salesOrder: selectedSO, dueDate }))
      .unwrap()
      .then(() => {
        toast.success('Invoice generated successfully');
        handleClose();
      })
      .catch((error) => toast.error(error));
  };

  const handleMarkPaid = (id) => {
    if (window.confirm('Mark this invoice as Paid?')) {
      dispatch(updateInvoiceStatus({ id, status: 'Paid' }))
        .unwrap()
        .then(() => toast.success('Invoice marked as paid'))
        .catch((error) => toast.error(error));
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">Invoices</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={handleOpen}>
          Generate Invoice
        </Button>
      </Box>

      {isLoading && invoices.length === 0 ? (
        <Box display="flex" justifyContent="center"><CircularProgress /></Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell><b>Invoice ID</b></TableCell>
                <TableCell><b>Sales Order</b></TableCell>
                <TableCell><b>Customer</b></TableCell>
                <TableCell><b>Amount</b></TableCell>
                <TableCell><b>Due Date</b></TableCell>
                <TableCell><b>Status</b></TableCell>
                <TableCell align="center"><b>Actions</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice._id} hover>
                  <TableCell>INV-{invoice._id.substring(18, 24).toUpperCase()}</TableCell>
                  <TableCell>SO-{invoice.salesOrder?._id?.substring(18, 24).toUpperCase()}</TableCell>
                  <TableCell>{invoice.salesOrder?.customer?.name}</TableCell>
                  <TableCell>₹{invoice.amount}</TableCell>
                  <TableCell>{new Date(invoice.dueDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Box sx={{ 
                      px: 1, py: 0.5, borderRadius: 1, display: 'inline-block',
                      backgroundColor: invoice.status === 'Paid' ? '#e8f5e9' : '#ffebee',
                      color: invoice.status === 'Paid' ? '#2e7d32' : '#c62828'
                    }}>
                      {invoice.status}
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    {invoice.status !== 'Paid' && (
                      <IconButton color="primary" title="Mark as Paid" onClick={() => handleMarkPaid(invoice._id)}>
                        <Payment />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {invoices.length === 0 && !isLoading && (
                <TableRow>
                  <TableCell colSpan={7} align="center">No invoices found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Create Invoice Dialog */}
      <Dialog open={openDialog} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Generate Invoice</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <FormControl fullWidth margin="dense" sx={{ mb: 2 }}>
              <InputLabel id="so-label">Select Sales Order</InputLabel>
              <Select
                labelId="so-label"
                value={selectedSO}
                label="Select Sales Order"
                onChange={(e) => setSelectedSO(e.target.value)}
              >
                {salesOrders.map((so) => (
                  <MenuItem key={so._id} value={so._id}>
                    SO-{so._id.substring(18, 24).toUpperCase()} (Total: ₹{so.totalPrice})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              margin="dense"
              type="date"
              label="Due Date"
              InputLabelProps={{ shrink: true }}
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={isLoading}>Generate</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}

export default Invoices;
