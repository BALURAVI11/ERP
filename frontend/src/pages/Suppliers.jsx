import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSuppliers, createSupplier, updateSupplier, deleteSupplier, reset } from '../slices/supplierSlice';
import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, CircularProgress } from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import * as Yup from 'yup';

function Suppliers() {
  const dispatch = useDispatch();
  const { suppliers, isLoading, isError, message } = useSelector((state) => state.supplier);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  useEffect(() => {
    dispatch(getSuppliers());
    return () => dispatch(reset());
  }, [dispatch]);

  useEffect(() => {
    if (isError) toast.error(message);
  }, [isError, message]);

  const formik = useFormik({
    initialValues: { name: '', email: '', phone: '', address: '' },
    validationSchema: Yup.object({
      name: Yup.string().required('Required'), email: Yup.string().email('Invalid').required('Required'),
      phone: Yup.string().required('Required'), address: Yup.string().required('Required'),
    }),
    onSubmit: (values) => {
      const action = editMode ? updateSupplier({ id: currentId, data: values }) : createSupplier(values);
      dispatch(action).unwrap().then(() => { toast.success('Success'); setOpen(false); }).catch(toast.error);
    },
  });

  const handleOpen = (supplier = null) => {
    if (supplier) { setEditMode(true); setCurrentId(supplier._id); formik.setValues(supplier); } 
    else { setEditMode(false); setCurrentId(null); formik.resetForm(); }
    setOpen(true);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">Suppliers</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen()}>Add Supplier</Button>
      </Box>

      {isLoading ? <Box display="flex" justifyContent="center"><CircularProgress /></Box> : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead><TableRow sx={{ backgroundColor: '#f5f5f5' }}><TableCell><b>Name</b></TableCell><TableCell><b>Email</b></TableCell><TableCell><b>Phone</b></TableCell><TableCell><b>Address</b></TableCell><TableCell align="center"><b>Actions</b></TableCell></TableRow></TableHead>
            <TableBody>
              {suppliers.map((s) => (
                <TableRow key={s._id} hover><TableCell>{s.name}</TableCell><TableCell>{s.email}</TableCell><TableCell>{s.phone}</TableCell><TableCell>{s.address}</TableCell>
                  <TableCell align="center">
                    <IconButton color="primary" onClick={() => handleOpen(s)}><Edit /></IconButton>
                    <IconButton color="error" onClick={() => dispatch(deleteSupplier(s._id)).unwrap().then(()=>toast.success('Deleted'))}><Delete /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editMode ? 'Edit' : 'Add'} Supplier</DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent>
            {['name', 'email', 'phone', 'address'].map(f => (
              <TextField key={f} fullWidth margin="dense" name={f} label={f} value={formik.values[f]} onChange={formik.handleChange} error={Boolean(formik.errors[f])} helperText={formik.errors[f]} />
            ))}
          </DialogContent>
          <DialogActions><Button onClick={() => setOpen(false)}>Cancel</Button><Button type="submit" variant="contained">Save</Button></DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}
export default Suppliers;
