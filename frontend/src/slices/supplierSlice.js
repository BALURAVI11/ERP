import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/axiosConfig';

const initialState = { suppliers: [], isLoading: false, isError: false, isSuccess: false, message: '' };

export const createSupplier = createAsyncThunk('suppliers/create', async (data, thunkAPI) => {
  try { return (await api.post('/suppliers', data)).data; }
  catch (error) { return thunkAPI.rejectWithValue(error.response?.data?.message || error.message); }
});

export const getSuppliers = createAsyncThunk('suppliers/getAll', async (_, thunkAPI) => {
  try { return (await api.get('/suppliers')).data; }
  catch (error) { return thunkAPI.rejectWithValue(error.response?.data?.message || error.message); }
});

export const updateSupplier = createAsyncThunk('suppliers/update', async ({ id, data }, thunkAPI) => {
  try { return (await api.put(`/suppliers/${id}`, data)).data; }
  catch (error) { return thunkAPI.rejectWithValue(error.response?.data?.message || error.message); }
});

export const deleteSupplier = createAsyncThunk('suppliers/delete', async (id, thunkAPI) => {
  try { await api.delete(`/suppliers/${id}`); return id; }
  catch (error) { return thunkAPI.rejectWithValue(error.response?.data?.message || error.message); }
});

export const supplierSlice = createSlice({
  name: 'supplier', initialState,
  reducers: { reset: (state) => { state.isError = false; state.isSuccess = false; state.isLoading = false; state.message = ''; } },
  extraReducers: (builder) => {
    builder
      .addCase(getSuppliers.pending, (state) => { state.isLoading = true; })
      .addCase(getSuppliers.fulfilled, (state, action) => { state.isLoading = false; state.isSuccess = true; state.suppliers = action.payload.data; })
      .addCase(getSuppliers.rejected, (state, action) => { state.isLoading = false; state.isError = true; state.message = action.payload; })
      .addCase(createSupplier.fulfilled, (state, action) => { state.suppliers.push(action.payload.data); })
      .addCase(updateSupplier.fulfilled, (state, action) => {
        const index = state.suppliers.findIndex(s => s._id === action.payload.data._id);
        if (index !== -1) state.suppliers[index] = action.payload.data;
      })
      .addCase(deleteSupplier.fulfilled, (state, action) => { state.suppliers = state.suppliers.filter(s => s._id !== action.payload); });
  },
});

export const { reset } = supplierSlice.actions;
export default supplierSlice.reducer;
