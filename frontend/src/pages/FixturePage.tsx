import React from 'react';
import {
  Box,
} from '@mui/material';
import FixtureTable from '@/components/FixtureTable';

export default function FixturePage() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 }, maxWidth: 1200, mx: 'auto' }}>
        <FixtureTable
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
    </Box>
  );
} 