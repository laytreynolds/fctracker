import React from 'react';
import {
  Box,
  Button,
  Typography,
  Stack,
} from '@mui/material';
import AddTeamDialogue from '@/components/AddTeamDialogue';
import TeamTable from '@/components/TeamTable';

export default function PlayersPage() {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [open, setOpen] = React.useState(false);
    const [refresh, setRefresh] = React.useState(0);
  
  
    const handleChangePage = (event: unknown, newPage: number) => {
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
      setRefresh((prev) => prev + 1);
    };
  
    return (
      <Box sx={{ p: { xs: 1, sm: 2, md: 3 }, maxWidth: 1200, mx: 'auto' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="h5">Teams</Typography>
          <Button variant="contained" color="primary" onClick={handleOpen}>
            Add Team
          </Button>
        </Stack>
        <TeamTable
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          refresh={refresh}
          />
        <AddTeamDialogue open={open} onClose={handleClose} onSuccess={handleSuccess} />
      </Box>
    );
  }