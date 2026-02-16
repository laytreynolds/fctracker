import { useCallback, useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Stack,
} from '@mui/material';
import AddTeamDialogue from '@/components/AddTeamDialogue';
import TeamTable from '@/components/TeamTable';


export default function TeamPage() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [open, setOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleChangePage = useCallback((_: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const handleChangeRowsPerPage = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }, []);

  const handleOpen = useCallback(() => setOpen(true), []);
  const handleClose = useCallback(() => setOpen(false), []);

  const handleSuccess = useCallback(() => {
    setOpen(false);
    setRefreshKey((k) => k + 1);
  }, []);

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 }, maxWidth: 1000, mx: 'auto' }}>
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
        refreshKey={refreshKey}
      />
      <AddTeamDialogue open={open} onClose={handleClose} onSuccess={handleSuccess} />
    </Box>
  );
}