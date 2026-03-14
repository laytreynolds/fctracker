import { useCallback, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Stack,
  CircularProgress,
  Snackbar,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useAuth } from '@/context/AuthContext';
import { buildApiUrl } from '@/config/api';


export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [healthStatus, setHealthStatus] = useState<'idle' | 'checking' | 'up' | 'down'>('idle');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  const checkBackendHealth = useCallback(async () => {
    setHealthStatus('checking');
    try {
      const response = await fetch(buildApiUrl('/health'));
      const ok = response.ok;
      setHealthStatus(ok ? 'up' : 'down');
      setSnackbarMessage(ok ? 'Backend is up' : 'Backend is down');
      setSnackbarSeverity(ok ? 'success' : 'error');
      setSnackbarOpen(true);
      setTimeout(() => setHealthStatus('idle'), 4000);
    } catch {
      setHealthStatus('down');
      setSnackbarMessage('Backend is down');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      setTimeout(() => setHealthStatus('idle'), 4000);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const err = await login(email, password);
    if (err) setError(err);

    setSubmitting(false);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
        position: 'relative',
      }}
    >
      <Button
        variant="outlined"
        size="small"
        onClick={checkBackendHealth}
        disabled={healthStatus === 'checking'}
        aria-label="Check backend health"
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          textTransform: 'none',
          borderRadius: 2,
          ...(healthStatus === 'up' && {
            borderColor: 'success.main',
            color: 'success.main',
          }),
          ...(healthStatus === 'down' && {
            borderColor: 'error.main',
            color: 'error.main',
          }),
        }}
      >
        {healthStatus === 'checking' && (
          <CircularProgress size={16} color="inherit" sx={{ mr: 1 }} />
        )}
        {healthStatus === 'idle' && 'Check backend health'}
        {healthStatus === 'checking' && 'Checking...'}
        {healthStatus === 'up' && 'Backend up'}
        {healthStatus === 'down' && 'Backend down'}
      </Button>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <Card sx={{ width: '100%', maxWidth: 420, mx: 'auto' }}>
        <CardContent sx={{ p: { xs: 3, sm: 4 }, '&:last-child': { pb: 4 } }}>
          <Stack alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'rgba(108, 99, 255, 0.12)',
              }}
            >
              <LockOutlinedIcon sx={{ color: 'primary.main', fontSize: 26 }} />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, textAlign: 'center' }}>
              Welcome back
            </Typography>
            <Typography variant="body2" sx={{ textAlign: 'center' }}>
              Sign in to FC Tracker
            </Typography>
          </Stack>

          {error && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: '10px' }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                required
                autoComplete="email"
                autoFocus
              />
              <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                required
                autoComplete="current-password"
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={submitting}
                sx={{ mt: 1, py: 1.2 }}
              >
                {submitting ? <CircularProgress size={22} color="inherit" /> : 'Sign In'}
              </Button>
            </Stack>
          </Box>

          <Typography variant="body2" sx={{ textAlign: 'center', mt: 3 }}>
            Don't have an account?{' '}
            <Typography
              component={RouterLink}
              to="/register"
              variant="body2"
              sx={{ color: 'primary.main', fontWeight: 600, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
            >
              Sign up
            </Typography>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
