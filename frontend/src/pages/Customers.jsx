import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCustomers, createCustomer, updateCustomer, deleteCustomer, reset } from '../slices/customerSlice';
import {
  Box, Button, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Typography, IconButton, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, CircularProgress
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import * as Yup from 'yup';

function Customers() {
  const dispatch = useDispatch();
  const { customers, isLoading, isError, message } = useSelector((state) => state.customer);

  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  useEffect(() => {
    dispatch(getCustomers());
    return () => { dispatch(reset()); };
  }, [dispatch]);

  useEffect(() => {
    if (isError) toast.error(message);
  }, [isError, message]);

  const formik = useFormik({
    initialValues: { name: '', email: '', phone: '', address: '' },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      email: Yup.string().email('Invalid email').required('Email is required'),
      phone: Yup.string().required('Phone is required'),
      address: Yup.string().required('Address is required'),
    }),
    onSubmit: (values) => {
      if (editMode) {
        dispatch(updateCustomer({ id: currentId, customerData: values }))
          .unwrap().then(() => { toast.success('Customer updated'); handleClose(); })
          .catch(toast.error);
      } else {
        dispatch(createCustomer(values))
          .unwrap().then(() => { toast.success('Customer created'); handleClose(); })
          .catch(toast.error);
      }
    },
  });

  const handleOpen = () => { setEditMode(false); setCurrentId(null); formik.resetForm(); setOpenDialog(true); };
  const handleEdit = (customer) => {
    setEditMode(true); setCurrentId(customer._id);
    formik.setValues({ name: customer.name, email: customer.email, phone: customer.phone, address: customer.address });
    setOpenDialog(true);
  };
  const handleClose = () => { setOpenDialog(false); formik.resetForm(); };
  const handleDelete = (id) => {
    if (window.confirm('Delete this customer?')) {
      dispatch(deleteCustomer(id)).unwrap().then(() => toast.success('Deleted')).catch(toast.error);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">Customers</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={handleOpen}>Add Customer</Button>
      </Box>

      {isLoading && customers.length === 0 ? <Box display="flex" justifyContent="center"><CircularProgress /></Box> : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell><b>Name</b></TableCell>
                <TableCell><b>Email</b></TableCell>
                <TableCell><b>Phone</b></TableCell>
                <TableCell><b>Address</b></TableCell>
                <TableCell align="center"><b>Actions</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {customers.map((c) => (
                <TableRow key={c._id} hover>
                  <TableCell>{c.name}</TableCell>
                  <TableCell>{c.email}</TableCell>
                  <TableCell>{c.phone}</TableCell>
                  <TableCell>{c.address}</TableCell>
                  <TableCell align="center">
                    <IconButton color="primary" onClick={() => handleEdit(c)}><Edit /></IconButton>
                    <IconButton color="error" onClick={() => handleDelete(c._id)}><Delete /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {customers.length === 0 && <TableRow><TableCell colSpan={5} align="center">No customers found.</TableCell></TableRow>}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={openDialog} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editMode ? 'Edit Customer' : 'Add Customer'}</DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent>
            {['name', 'email', 'phone', 'address'].map(field => (
              <TextField key={field} fullWidth margin="dense" id={field} name={field} label={field.charAt(0).toUpperCase() + field.slice(1)}
                value={formik.values[field]} onChange={formik.handleChange}
                error={formik.touched[field] && Boolean(formik.errors[field])} helperText={formik.touched[field] && formik.errors[field]}
              />
            ))}
          </DialogContent>
          <DialogActions><Button onClick={handleClose}>Cancel</Button><Button type="submit" variant="contained">{editMode ? 'Update' : 'Save'}</Button></DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}

export default Customers;
