import React from 'react';
import {
Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Typography, Box, Stack, Button
} from '@mui/material';
import type{ TFixture } from '@/types/types';
import AddFixtureDialog from '@/components/AddFixtureDialog';

interface FixtureTableProps {
  page: number;
  rowsPerPage: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;

}

export default function FixtureTable({
page,
rowsPerPage,
onPageChange, 
onRowsPerPageChange,
}: FixtureTableProps) {

  const [fixtures, setFixtures] = React.useState<TFixture[]>([]);  
  const [open, setOpen] = React.useState(false);
  const [refresh, setRefresh] = React.useState(0);


  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSuccess = () => {
    handleClose();
  // To refresh the fixtures table when the dialog closes, you need to trigger a re-fetch of the fixture data in the FixtureTable component.
  // One common way is to use a "key" prop or a "refresh" state that you increment to force a re-render/re-fetch.
  // Here, we'll add a "refresh" state and pass it to FixtureTable as a prop.

    setRefresh((prev) => prev + 1);
  };

   // Fetch Fixtures
   React.useEffect(() => {
    fetch('http://localhost:8080/api/fixture/getall').then(res => res.json()).then(data => setFixtures(data.fixtures || []));
  }, [refresh]);

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
            </TableRow>
          </TableHead>
          <TableBody>
            {fixtures.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((fixture) => (
              <TableRow key={fixture.ID}>
                <TableCell>{fixture.Date}</TableCell>
                <TableCell>{fixture.HomeTeam} v {fixture.AwayTeam}</TableCell>
                <TableCell>{fixture.HomeScore} - {fixture.AwayScore}</TableCell>
                <TableCell>{fixture.ManOfTheMatchName ?? '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={fixtures.length}
        page={page}
        onPageChange={onPageChange}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={onRowsPerPageChange}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Paper>
    <AddFixtureDialog open={open} onClose={handleClose} onSuccess={handleSuccess} />
    </Box>
  );
}
