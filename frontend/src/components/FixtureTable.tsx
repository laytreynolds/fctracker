import React, { useEffect } from 'react';
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
} from '@mui/material';
import type{ TFixture } from '@/types/types';
import AddFixtureDialog from '@/components/AddFixtureDialog';
import { useNavigate } from 'react-router-dom';
import { buildApiUrl } from '@/config/api';


export default function FixtureTable() {

  const [fixtures, setFixtures] = React.useState<TFixture[]>([]);  
  const [open, setOpen] = React.useState(false);
  const [refresh, setRefresh] = React.useState(0);
  const navigate = useNavigate();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

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
    setRefresh((prev) => prev + 1);
  };

   // Fetch Fixtures
   useEffect(() => {
    fetch(buildApiUrl('/api/fixture/getall')).then(res => res.json()).then(data => setFixtures(data.fixtures || []));
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
                    onClick={() => navigate(`/fixtures/${fixture.ID}`)}
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
