import { useState } from 'react';
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
} from '@mui/material';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import { useAuth } from '@/context/AuthContext';

export default function RegisterPage() {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setSubmitting(true);
    const err = await register(email, password, name);
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
      }}
    >
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
              <PersonAddOutlinedIcon sx={{ color: 'primary.main', fontSize: 26 }} />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, textAlign: 'center' }}>
              Create account
            </Typography>
            <Typography variant="body2" sx={{ textAlign: 'center' }}>
              Sign up for FC Tracker
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
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                required
                autoFocus
              />
              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                required
                autoComplete="email"
              />
              <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                required
                autoComplete="new-password"
                helperText="At least 6 characters"
              />
              <TextField
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                fullWidth
                required
                autoComplete="new-password"
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={submitting}
                sx={{ mt: 1, py: 1.2 }}
              >
                {submitting ? <CircularProgress size={22} color="inherit" /> : 'Create Account'}
              </Button>
            </Stack>
          </Box>

          <Typography variant="body2" sx={{ textAlign: 'center', mt: 3 }}>
            Already have an account?{' '}
            <Typography
              component={RouterLink}
              to="/login"
              variant="body2"
              sx={{ color: 'primary.main', fontWeight: 600, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
            >
              Sign in
            </Typography>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
