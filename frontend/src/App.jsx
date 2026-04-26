import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Customers from './pages/Customers';
import Suppliers from './pages/Suppliers';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f4f6f8',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  shape: {
    borderRadius: 8,
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </PrivateRoute>
            } 
          />
          <Route 
            path="/products" 
            element={
              <PrivateRoute>
                <Layout>
                  <Products />
                </Layout>
              </PrivateRoute>
            } 
          />
          <Route 
            path="/customers" 
            element={
              <PrivateRoute>
                <Layout>
                  <Customers />
                </Layout>
              </PrivateRoute>
            } 
          />
          <Route 
            path="/suppliers" 
            element={
              <PrivateRoute>
                <Layout>
                  <Suppliers />
                </Layout>
              </PrivateRoute>
            } 
          />
          
          {/* Catch-all for undefined routes inside layout */}
          <Route 
            path="*" 
            element={
              <PrivateRoute>
                <Layout>
                  <NotFound />
                </Layout>
              </PrivateRoute>
            } 
          />
        </Routes>
      </Router>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </ThemeProvider>
  );
}

export default App;
