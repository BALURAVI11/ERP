import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Typography, Grid, Paper, Button } from '@mui/material';
import { logout, reset } from '../slices/authSlice';

function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate('/');
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          Dashboard
        </Typography>
        <Button variant="outlined" color="secondary" onClick={onLogout}>
          Logout
        </Button>
      </Box>
      <Typography variant="subtitle1" gutterBottom color="textSecondary">
        Welcome back, {user && user.name}! Role: {user && user.role}
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, textAlign: 'center', backgroundColor: '#e3f2fd' }}>
            <Typography variant="h6">Total Products</Typography>
            <Typography variant="h3" color="primary">0</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, textAlign: 'center', backgroundColor: '#e8f5e9' }}>
            <Typography variant="h6">Total Customers</Typography>
            <Typography variant="h3" color="success.main">0</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, textAlign: 'center', backgroundColor: '#fff3e0' }}>
            <Typography variant="h6">Sales Orders</Typography>
            <Typography variant="h3" color="warning.main">0</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, textAlign: 'center', backgroundColor: '#fce4ec' }}>
            <Typography variant="h6">Pending POs</Typography>
            <Typography variant="h3" color="secondary">0</Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;
