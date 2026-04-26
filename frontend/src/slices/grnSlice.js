import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/axiosConfig';

export const fetchGRNs = createAsyncThunk('grns/fetchAll', async (_, thunkAPI) => {
  try {
    const response = await api.get('/grns');
    return response.data.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

export const createGRN = createAsyncThunk('grns/create', async (grnData, thunkAPI) => {
  try {
    const response = await api.post('/grns', grnData);
    return response.data.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

const initialState = {
  grns: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

const grnSlice = createSlice({
  name: 'grns',
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
      .addCase(fetchGRNs.pending, (state) => { state.isLoading = true; })
      .addCase(fetchGRNs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.grns = action.payload;
      })
      .addCase(fetchGRNs.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(createGRN.pending, (state) => { state.isLoading = true; })
      .addCase(createGRN.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.grns.push(action.payload);
      })
      .addCase(createGRN.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = grnSlice.actions;
export default grnSlice.reducer;
