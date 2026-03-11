import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import Layout from "@/pages/Laytout";
import PlayersPage from "@/pages/PlayersPage";
import FixturePage from "@/pages/FixturePage";
import Home from '@/pages/Home';
import TeamPage from '@/pages/TeamPage';
import FixtureDetailPage from '@/pages/FixtureDetailPage';
import PlayerDetailPage from '@/pages/PlayerDetailPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import { useAuth } from '@/context/AuthContext';

interface AppProps {
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress size={32} />
      </Box>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function GuestRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress size={32} />
      </Box>
    );
  }

  if (user) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function App({ darkMode, setDarkMode }: AppProps) {
  return (
    <Routes>
      <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
      <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout darkMode={darkMode} setDarkMode={setDarkMode} />
          </ProtectedRoute>
        }
      >
        <Route index element={<Home />} />
        <Route path="/players" element={<PlayersPage />} />
        <Route path="/fixtures" element={<FixturePage />} />
        <Route path="/teams" element={<TeamPage />} />
        <Route path="/fixture/:id" element={<FixtureDetailPage />} />
        <Route path="/player/:id" element={<PlayerDetailPage />} />
      </Route>
    </Routes>
  );
}
export default App;
