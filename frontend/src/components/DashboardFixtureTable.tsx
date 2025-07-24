import React from 'react';
import {
Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Typography, Box, Stack, Button
} from '@mui/material';
import type{ TFixture } from '@/types/types';
import { useNavigate } from 'react-router-dom';

interface DashboardFixtureTableProps {
  page: number;
  rowsPerPage: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;

}

export default function DashboardFixtureTable({
page,
rowsPerPage,
onPageChange, 
onRowsPerPageChange,
}: DashboardFixtureTableProps) {

  const [fixtures, setFixtures] = React.useState<TFixture[]>([]);  
  const navigate = useNavigate();

 



    // Fetch Fixtures
    React.useEffect(() => {
    fetch('http://localhost:8080/api/leaderboard/fixtures').then(res => res.json()).then(data => setFixtures(data.fixtures || []));
  }, []);

  return (       
     <Box sx={{ mx: 'auto' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h5">Last 5 Fixtures</Typography>
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
        onPageChange={onPageChange}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={onRowsPerPageChange}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Paper>
    </Box>
  );
}
