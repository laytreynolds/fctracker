import React from 'react';
import {
  Box, Typography
} from '@mui/material';
import FixtureTable from '@/components/FixtureTable';
import Leaderboard from '@/components/Leaderboard';


export default function Home() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 }, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>Dashboard</Typography>
        <Leaderboard />
        <FixtureTable
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={(e, newPage) => setPage(newPage)}
          onRowsPerPageChange={e => setRowsPerPage(parseInt(e.target.value, 10))}
          refresh={0}
        />
      </Box>
  );
}
