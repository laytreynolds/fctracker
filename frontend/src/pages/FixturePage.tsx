import React from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  Typography,
  Stack,
} from '@mui/material';
import AddFixtureDialog from '@/components/AddFixtureDialog';

interface Fixture {
  id: string;
  date: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  manOfTheMatchName: string;
}

export default function FixturePage() {
  const [fixtures, setFixtures] = React.useState<Fixture[]>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [open, setOpen] = React.useState(false);

  const fetchFixtures = React.useCallback(async () => {
    // This is a placeholder. You'll need to create this endpoint.
    try {
      const response = await fetch('http://localhost:8080/api/fixture/getall');
      if (!response.ok) { 
        throw new Error('Failed to fetch fixtures');
      }

       const data = await response.json()

       if (data.error) {
        alert(`Error from server: ${data.error}`);
        return;
      }

      if (Array.isArray(data.fixtures)) {
        const fetchedFixtures: Fixture[] = data.fixtures.map(
          (fixture: {
            Date: string;
            HomeTeam: string;
            AwayTeam: string;
            HomeScore: string;
            AwayScore: number;
            ManOfTheMatchName: string;
          }) => ({
            date: fixture.Date,
            homeTeam: fixture.HomeTeam,
            awayTeam: fixture.AwayTeam,
            homeScore: fixture.HomeScore,
            awayScore: fixture.AwayScore,
            manOfTheMatchName: fixture.ManOfTheMatchName,
          })
        );
        setFixtures(fetchedFixtures);
      }
    } catch (error) {
      console.error('Fetch fixtures error:', error);
      alert('Failed to load fixtures.');
    }
  }, []);

  React.useEffect(() => {
    fetchFixtures();
  }, [fetchFixtures]);

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
    fetchFixtures();
  };

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 }, maxWidth: 900, mx: 'auto' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h5">Fixtures</Typography>
        <Button variant="contained" color="primary" onClick={handleOpen}>
          Add Fixture
        </Button>
      </Stack>
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Teams</TableCell>
                <TableCell>Score</TableCell>
                <TableCell>Man of the Match</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {fixtures.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((fixture) => (
                <TableRow key={fixture.id}>
                  <TableCell>{fixture.date}</TableCell>
                  <TableCell>{fixture.homeTeam} v {fixture.awayTeam}</TableCell>
                  <TableCell>{fixture.homeScore} - {fixture.awayScore}</TableCell>
                  <TableCell>{fixture.manOfTheMatchName ?? '-'}</TableCell>
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