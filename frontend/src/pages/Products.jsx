import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts, createProduct, updateProduct, deleteProduct, reset } from '../slices/productSlice';
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import * as Yup from 'yup';

function Products() {
  const dispatch = useDispatch();
  const { products, isLoading, isError, message } = useSelector((state) => state.product);

  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  useEffect(() => {
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

  const validationSchema = Yup.object({
    title: Yup.string().required('Title is required'),
    sku: Yup.string().required('SKU is required'),
    price: Yup.number().positive('Price must be positive').required('Price is required'),
    stock: Yup.number().integer('Stock must be an integer').min(0, 'Stock cannot be negative').required('Stock is required'),
    reorderLevel: Yup.number().integer('Must be an integer').min(0, 'Cannot be negative').required('Reorder Level is required'),
  });

  const formik = useFormik({
    initialValues: {
      title: '',
      sku: '',
      price: '',
      stock: '',
      reorderLevel: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      if (editMode) {
        dispatch(updateProduct({ id: currentId, productData: values }))
          .unwrap()
          .then(() => {
            toast.success('Product updated successfully');
            handleClose();
          })
          .catch((error) => {
            toast.error(error);
          });
      } else {
        dispatch(createProduct(values))
          .unwrap()
          .then(() => {
            toast.success('Product created successfully');
            handleClose();
          })
          .catch((error) => {
            toast.error(error);
          });
      }
    },
  });

  const handleOpen = () => {
    setEditMode(false);
    setCurrentId(null);
    formik.resetForm();
    setOpenDialog(true);
  };

  const handleEdit = (product) => {
    setEditMode(true);
    setCurrentId(product._id);
    formik.setValues({
      title: product.title,
      sku: product.sku,
      price: product.price,
      stock: product.stock,
      reorderLevel: product.reorderLevel,
    });
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
    formik.resetForm();
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      dispatch(deleteProduct(id))
        .unwrap()
        .then(() => toast.success('Product deleted successfully'))
        .catch((error) => toast.error(error));
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          Products
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleOpen}
        >
          Add Product
        </Button>
      </Box>

      {isLoading && products.length === 0 ? (
        <Box display="flex" justifyContent="center"><CircularProgress /></Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell><b>Title</b></TableCell>
                <TableCell><b>SKU</b></TableCell>
                <TableCell><b>Price</b></TableCell>
                <TableCell><b>Stock</b></TableCell>
                <TableCell><b>Reorder Level</b></TableCell>
                <TableCell align="center"><b>Actions</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product._id} hover>
                  <TableCell>{product.title}</TableCell>
                  <TableCell>{product.sku}</TableCell>
                  <TableCell>${product.price}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>{product.reorderLevel}</TableCell>
                  <TableCell align="center">
                    <IconButton color="primary" onClick={() => handleEdit(product)}>
                      <Edit />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(product._id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {products.length === 0 && !isLoading && (
                <TableRow>
                  <TableCell colSpan={6} align="center">No products found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Add/Edit Product Dialog */}
      <Dialog open={openDialog} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editMode ? 'Edit Product' : 'Add New Product'}</DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent>
            <TextField
              fullWidth
              margin="dense"
              id="title"
              name="title"
              label="Product Title"
              value={formik.values.title}
              onChange={formik.handleChange}
              error={formik.touched.title && Boolean(formik.errors.title)}
              helperText={formik.touched.title && formik.errors.title}
            />
            <TextField
              fullWidth
              margin="dense"
              id="sku"
              name="sku"
              label="SKU"
              value={formik.values.sku}
              onChange={formik.handleChange}
              error={formik.touched.sku && Boolean(formik.errors.sku)}
              helperText={formik.touched.sku && formik.errors.sku}
            />
            <TextField
              fullWidth
              margin="dense"
              id="price"
              name="price"
              label="Price"
              type="number"
              value={formik.values.price}
              onChange={formik.handleChange}
              error={formik.touched.price && Boolean(formik.errors.price)}
              helperText={formik.touched.price && formik.errors.price}
            />
            <TextField
              fullWidth
              margin="dense"
              id="stock"
              name="stock"
              label="Stock"
              type="number"
              value={formik.values.stock}
              onChange={formik.handleChange}
              error={formik.touched.stock && Boolean(formik.errors.stock)}
              helperText={formik.touched.stock && formik.errors.stock}
            />
            <TextField
              fullWidth
              margin="dense"
              id="reorderLevel"
              name="reorderLevel"
              label="Reorder Level"
              type="number"
              value={formik.values.reorderLevel}
              onChange={formik.handleChange}
              error={formik.touched.reorderLevel && Boolean(formik.errors.reorderLevel)}
              helperText={formik.touched.reorderLevel && formik.errors.reorderLevel}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editMode ? 'Update' : 'Save'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}

export default Products;
