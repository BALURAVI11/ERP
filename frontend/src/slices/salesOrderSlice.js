import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/axiosConfig';

export const fetchSalesOrders = createAsyncThunk('salesOrders/fetchAll', async (_, thunkAPI) => {
  try {
    const response = await api.get('/sales-orders');
    return response.data.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

export const createSalesOrder = createAsyncThunk('salesOrders/create', async (orderData, thunkAPI) => {
  try {
    const response = await api.post('/sales-orders', orderData);
    return response.data.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

export const updateSalesOrderStatus = createAsyncThunk('salesOrders/updateStatus', async ({ id, status }, thunkAPI) => {
  try {
    const response = await api.put(`/sales-orders/${id}/status`, { status });
    return response.data.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

const initialState = {
  salesOrders: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

const salesOrderSlice = createSlice({
  name: 'salesOrders',
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
      .addCase(fetchSalesOrders.pending, (state) => { state.isLoading = true; })
      .addCase(fetchSalesOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.salesOrders = action.payload;
      })
      .addCase(fetchSalesOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(createSalesOrder.pending, (state) => { state.isLoading = true; })
      .addCase(createSalesOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.salesOrders.push(action.payload);
      })
      .addCase(createSalesOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateSalesOrderStatus.pending, (state) => { state.isLoading = true; })
      .addCase(updateSalesOrderStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const index = state.salesOrders.findIndex((so) => so._id === action.payload._id);
        if (index !== -1) {
          state.salesOrders[index] = action.payload;
        }
      })
      .addCase(updateSalesOrderStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = salesOrderSlice.actions;
export default salesOrderSlice.reducer;
