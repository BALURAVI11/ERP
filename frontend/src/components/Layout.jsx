import { Box } from '@mui/material';
import Sidebar from './Sidebar';
import SmartAssistant from './SmartAssistant';

const drawerWidth = 240;

function Layout({ children }) {
  return (
    <Box sx={{ display: 'flex' }}>
      {/* Sidebar Navigation */}
      <Sidebar drawerWidth={drawerWidth} />

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          backgroundColor: '#f4f6f8',
          minHeight: '100vh',
        }}
      >
        {children}
      </Box>

      {/* Global AI Chat Assistant */}
      <SmartAssistant />
    </Box>
  );
}

export default Layout;
