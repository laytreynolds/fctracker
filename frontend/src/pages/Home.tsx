import { useCallback, useState } from 'react';
import {
  Box, Typography
} from '@mui/material';
import DashboardFixtureTable from "@/components/DashboardFixtureTable"
import Leaderboard from '@/components/Leaderboard';


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
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 }, maxWidth: 1000, mx: 'auto' }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>Dashboard</Typography>
        <Leaderboard />
        <Box sx={{ mx: 'auto', mt: 2 }}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>Last 5 Fixtures</Typography>
        <DashboardFixtureTable
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      </Box>
    </Box>
  );
}
