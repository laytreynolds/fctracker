import { useCallback, useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Button,
  Box,
  Stack,
  Typography,
  CircularProgress,
} from '@mui/material';
import type { TFixture } from '@/types/types';
import AddFixtureDialog from '@/components/AddFixtureDialog';
import { useNavigate } from 'react-router-dom';
import { buildApiUrl } from '@/config/api';

export default function FixtureTable() {
  const [fixtures, setFixtures] = useState<TFixture[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const navigate = useNavigate();

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
    setRefreshKey((prev) => prev + 1);
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(buildApiUrl('/api/fixture/getall'))
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load fixtures');
        return res.json();
      })
      .then((data) => setFixtures(data.fixtures || []))
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load fixtures'))
      .finally(() => setLoading(false));
  }, [refreshKey]);

  if (loading && fixtures.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  if (error && fixtures.length === 0) {
    return (
      <Typography color="error" sx={{ py: 2, textAlign: 'center' }}>
        {error}
      </Typography>
    );
  }

  return (       
     <Box sx={{ mx: 'auto' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h5">Fixtures</Typography>
        <Button variant="contained" color="primary" onClick={handleOpen}>
          Add Fixture
        </Button>
      </Stack>
    <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 4 }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Teams</TableCell>
              <TableCell>Score</TableCell>
              <TableCell>Man of the Match</TableCell>
              <TableCell /> {/* Details button header */}
            </TableRow>
          </TableHead>
          <TableBody>
            {fixtures.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((fixture) => (
              <TableRow key={fixture.ID}>
                <TableCell>{fixture.Date}</TableCell>
                <TableCell>{fixture.HomeTeam} v {fixture.AwayTeam}</TableCell>
                <TableCell>{fixture.HomeScore} - {fixture.AwayScore}</TableCell>
                <TableCell>{fixture.ManOfTheMatchName ?? '-'}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => navigate(`/fixture/${fixture.ID}`)}
                  >
                    Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={fixtures.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Paper>
    <AddFixtureDialog open={open} onClose={handleClose} onSuccess={handleSuccess} />
    </Box>
  );
}
