import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Divider,
} from '@mui/material';
import {
  Dashboard,
  Inventory,
  People,
  LocalShipping,
  ShoppingCart,
  Receipt,
  Assignment,
  AdminPanelSettings,
  Logout
} from '@mui/icons-material';
import { logout, reset } from '../slices/authSlice';

function Sidebar({ drawerWidth }) {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate('/');
  };

  const navItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
    { text: 'Products', icon: <Inventory />, path: '/products' },
    { text: 'Customers', icon: <People />, path: '/customers' },
    { text: 'Suppliers', icon: <LocalShipping />, path: '/suppliers' },
    { text: 'Sales Orders', icon: <ShoppingCart />, path: '/sales-orders' },
    { text: 'Purchase Orders', icon: <Assignment />, path: '/purchase-orders' },
    { text: 'GRN', icon: <Receipt />, path: '/grn' },
    { text: 'Invoices', icon: <Receipt />, path: '/invoices' },
  ];

  // Admin only route
  if (user && user.role === 'Admin') {
    navItems.push({ text: 'User Management', icon: <AdminPanelSettings />, path: '/admin/users' });
  }

  const drawer = (
    <div>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h6" fontWeight="bold" color="primary">
          ERP System
        </Typography>
      </Box>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem
            button
            component={Link}
            to={item.path}
            key={item.text}
            selected={location.pathname === item.path}
            sx={{
              '&.Mui-selected': {
                backgroundColor: 'rgba(25, 118, 210, 0.08)',
                borderRight: '4px solid #1976d2',
              },
            }}
          >
            <ListItemIcon sx={{ color: location.pathname === item.path ? 'primary.main' : 'inherit' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.text} 
              primaryTypographyProps={{ 
                fontWeight: location.pathname === item.path ? 'bold' : 'normal' 
              }} 
            />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        <ListItem button onClick={handleLogout}>
          <ListItemIcon><Logout color="error" /></ListItemIcon>
          <ListItemText primary="Logout" sx={{ color: 'error.main' }} />
        </ListItem>
      </List>
    </div>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
    >
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
}

export default Sidebar;
