import { Box, Typography, Button, Container, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <Container component="main" maxWidth="md">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ padding: 6, width: '100%', borderRadius: 3, textAlign: 'center' }}>
          <Typography component="h1" variant="h3" gutterBottom fontWeight="bold" color="primary">
            Welcome to ERP System
          </Typography>
          <Typography variant="h6" color="textSecondary" paragraph>
            A comprehensive, role-based business operations management platform.
          </Typography>
          <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/login')}
              sx={{ px: 4, py: 1.5, fontWeight: 'bold' }}
            >
              Sign In
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/register')}
              sx={{ px: 4, py: 1.5, fontWeight: 'bold' }}
            >
              Register
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}

export default Home;
