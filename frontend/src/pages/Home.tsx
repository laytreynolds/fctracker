import { useCallback, useState } from 'react';
import { Box, Typography } from '@mui/material';
import DashboardFixtureTable from "@/components/DashboardFixtureTable";
import Leaderboard from '@/components/Leaderboard';
import FadeIn from '@/components/FadeIn';

export default function Home() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handlePageChange = useCallback((_: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const handleRowsPerPageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(e.target.value, 10));
  }, []);

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, maxWidth: 1100, mx: 'auto' }}>
      <FadeIn>
        <Box sx={{ pt: { xs: 2, md: 4 }, pb: { xs: 4, md: 6 } }}>
          <Typography variant="overline" sx={{ color: 'primary.main', mb: 1, display: 'block' }}>
            Overview
          </Typography>
          <Typography variant="h2" sx={{ mb: 1 }}>
            Dashboard
          </Typography>
          <Typography variant="body2" sx={{ maxWidth: 500 }}>
            Track your fixtures, players, and team performance at a glance.
          </Typography>
        </Box>
      </FadeIn>

      <FadeIn delay={0.1}>
        <Leaderboard />
      </FadeIn>

      <FadeIn delay={0.2}>
        <Box sx={{ mt: { xs: 4, md: 6 } }}>
          <Typography variant="overline" sx={{ color: 'primary.main', mb: 1, display: 'block' }}>
            Recent
          </Typography>
          <Typography variant="h5" sx={{ mb: 3 }}>
            Last 5 Fixtures
          </Typography>
          <DashboardFixtureTable
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
          />
        </Box>
      </FadeIn>
    </Box>
  );
}
