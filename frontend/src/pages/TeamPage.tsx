import { useCallback, useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Stack,
} from '@mui/material';
import AddTeamDialogue from '@/components/AddTeamDialogue';
import TeamTable from '@/components/TeamTable';
import FadeIn from '@/components/FadeIn';

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
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, maxWidth: 1100, mx: 'auto' }}>
      <FadeIn>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-end" sx={{ mb: 3, pt: { xs: 2, md: 3 } }}>
          <Box>
            <Typography variant="overline" sx={{ color: 'primary.main', mb: 0.5, display: 'block' }}>
              Club
            </Typography>
            <Typography variant="h3">Teams</Typography>
          </Box>
          <Button variant="contained" onClick={handleOpen}>
            Add Team
          </Button>
        </Stack>
      </FadeIn>
      <FadeIn delay={0.1}>
        <TeamTable
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          refreshKey={refreshKey}
        />
      </FadeIn>
      <AddTeamDialogue open={open} onClose={handleClose} onSuccess={handleSuccess} />
    </Box>
  );
}
