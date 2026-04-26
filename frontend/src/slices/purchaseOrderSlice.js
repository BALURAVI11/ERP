import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/axiosConfig';

export const fetchPurchaseOrders = createAsyncThunk('purchaseOrders/fetchAll', async (_, thunkAPI) => {
  try {
    const response = await api.get('/purchase-orders');
    return response.data.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

export const createPurchaseOrder = createAsyncThunk('purchaseOrders/create', async (orderData, thunkAPI) => {
  try {
    const response = await api.post('/purchase-orders', orderData);
    return response.data.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

export const updatePurchaseOrderStatus = createAsyncThunk('purchaseOrders/updateStatus', async ({ id, status }, thunkAPI) => {
  try {
    const response = await api.put(`/purchase-orders/${id}/status`, { status });
    return response.data.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

const initialState = {
  purchaseOrders: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

const purchaseOrderSlice = createSlice({
  name: 'purchaseOrders',
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
      .addCase(fetchPurchaseOrders.pending, (state) => { state.isLoading = true; })
      .addCase(fetchPurchaseOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.purchaseOrders = action.payload;
      })
      .addCase(fetchPurchaseOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(createPurchaseOrder.pending, (state) => { state.isLoading = true; })
      .addCase(createPurchaseOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.purchaseOrders.push(action.payload);
      })
      .addCase(createPurchaseOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updatePurchaseOrderStatus.pending, (state) => { state.isLoading = true; })
      .addCase(updatePurchaseOrderStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const index = state.purchaseOrders.findIndex((po) => po._id === action.payload._id);
        if (index !== -1) {
          state.purchaseOrders[index] = action.payload;
        }
      })
      .addCase(updatePurchaseOrderStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = purchaseOrderSlice.actions;
export default purchaseOrderSlice.reducer;
