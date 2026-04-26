import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import productReducer from './slices/productSlice';
import customerReducer from './slices/customerSlice';
import supplierReducer from './slices/supplierSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    product: productReducer,
    customer: customerReducer,
    supplier: supplierReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
