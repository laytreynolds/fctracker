import React from 'react';
import {
  Box,
  Button,
  Typography,
  Stack,
} from '@mui/material';
import AddPlayerDialog from '@/components/AddPlayerDialog';
import PlayerTable from '@/components/PlayerTable';

export default function PlayersPage() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [open, setOpen] = React.useState(false);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSuccess = () => {
    handleClose();
    // PlayerTable now manages its own data fetching, so no need to trigger refresh
  };

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 }, maxWidth: 1000, mx: 'auto' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h5">Players</Typography>
        <Button variant="contained" color="primary" onClick={handleOpen}>
          Add Player
        </Button>
      </Stack>
      <PlayerTable
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        />
      <AddPlayerDialog open={open} onClose={handleClose} onSuccess={handleSuccess} />
    </Box>
  );
}
