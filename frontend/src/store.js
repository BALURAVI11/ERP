import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import productReducer from './slices/productSlice';
import customerReducer from './slices/customerSlice';
import supplierReducer from './slices/supplierSlice';
import salesOrderReducer from './slices/salesOrderSlice';
import purchaseOrderReducer from './slices/purchaseOrderSlice';
import grnReducer from './slices/grnSlice';
import invoiceReducer from './slices/invoiceSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    product: productReducer,
    customer: customerReducer,
    supplier: supplierReducer,
    salesOrders: salesOrderReducer,
    purchaseOrders: purchaseOrderReducer,
    grns: grnReducer,
    invoices: invoiceReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
