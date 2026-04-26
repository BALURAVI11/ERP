import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function NotFound() {
  const navigate = useNavigate();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <Typography variant="h3" color="error" fontWeight="bold" gutterBottom>
        404
      </Typography>
      <Typography variant="h5" color="textSecondary" gutterBottom>
        Page Not Found or Under Construction
      </Typography>
      <Typography variant="body1" color="textSecondary" paragraph>
        The page you are looking for does not exist or is currently being built.
      </Typography>
      <Button variant="contained" onClick={() => navigate('/dashboard')} sx={{ mt: 2 }}>
        Go Back to Dashboard
      </Button>
    </Box>
  );
}

export default NotFound;
