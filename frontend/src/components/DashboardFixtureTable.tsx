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
} from '@mui/material';
import type { TFixture } from '@/types/types';
import { buildApiUrl } from '@/config/api';
import { useNavigate } from 'react-router-dom';

export default function DashboardFixtureTable({ page, rowsPerPage, onPageChange, onRowsPerPageChange }: {
  page: number;
  rowsPerPage: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const [fixtures, setFixtures] = React.useState<TFixture[]>([]);
  const navigate = useNavigate();
  useEffect(() => {
    fetch(buildApiUrl('/api/leaderboard/fixtures')).then(res => res.json()).then(data => setFixtures(data.fixtures || []));
  }, []);

  return (
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
        onPageChange={onPageChange}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={onRowsPerPageChange}
      />
    </Paper>
  );
}
