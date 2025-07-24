import React from 'react';
import {
  Box, Typography
} from '@mui/material';
import DashboardFixtureTable from "@/components/DashboardFixtureTable"
import Leaderboard from '@/components/Leaderboard';


export default function Home() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 }, maxWidth: 1000, mx: 'auto' }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>Dashboard</Typography>
        <Leaderboard />
        <Box sx={{ mx: 'auto', mt: 2 }}>
        <DashboardFixtureTable
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={(_, newPage) => setPage(newPage)} 
          onRowsPerPageChange={e => setRowsPerPage(parseInt(e.target.value, 10))}
        />
      </Box>
    </Box>
  );
}
