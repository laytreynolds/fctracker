import React from 'react';
import { Box, Typography, Button } from '@mui/material';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // In production, you might want to send this to an error reporting service
    // like Sentry, LogRocket, etc.
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            p: 3,
            textAlign: 'center',
          }}
        >
          <Typography variant="h4" gutterBottom>
            Something went wrong
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            We're sorry, but something unexpected happened. Please try refreshing the page.
          </Typography>
          <Button
            variant="contained"
            onClick={() => window.location.reload()}
            sx={{ mr: 2 }}
          >
            Refresh Page
          </Button>
          <Button
            variant="outlined"
            onClick={() => this.setState({ hasError: false })}
          >
            Try Again
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
