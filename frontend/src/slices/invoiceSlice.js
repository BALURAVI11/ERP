import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/axiosConfig';

export const fetchInvoices = createAsyncThunk('invoices/fetchAll', async (_, thunkAPI) => {
  try {
    const response = await api.get('/invoices');
    return response.data.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

export const createInvoice = createAsyncThunk('invoices/create', async (invoiceData, thunkAPI) => {
  try {
    const response = await api.post('/invoices', invoiceData);
    return response.data.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

export const updateInvoiceStatus = createAsyncThunk('invoices/updateStatus', async ({ id, status }, thunkAPI) => {
  try {
    const response = await api.put(`/invoices/${id}/status`, { status });
    return response.data.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

const initialState = {
  invoices: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

const invoiceSlice = createSlice({
  name: 'invoices',
  initialState,
  reducers: {
    reset: (state) => {
      state.isError = false;
      state.isLoading = false;
      state.isSuccess = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInvoices.pending, (state) => { state.isLoading = true; })
      .addCase(fetchInvoices.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.invoices = action.payload;
      })
      .addCase(fetchInvoices.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(createInvoice.pending, (state) => { state.isLoading = true; })
      .addCase(createInvoice.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.invoices.push(action.payload);
      })
      .addCase(createInvoice.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateInvoiceStatus.pending, (state) => { state.isLoading = true; })
      .addCase(updateInvoiceStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const index = state.invoices.findIndex((inv) => inv._id === action.payload._id);
        if (index !== -1) {
          state.invoices[index] = action.payload;
        }
      })
      .addCase(updateInvoiceStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = invoiceSlice.actions;
export default invoiceSlice.reducer;
