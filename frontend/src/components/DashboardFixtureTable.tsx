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
} from '@mui/material';
import type { TFixture } from '@/types/types';
import { buildApiUrl } from '@/config/api';

export default function DashboardFixtureTable({ page, rowsPerPage, onPageChange, onRowsPerPageChange }: {
  page: number;
  rowsPerPage: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const [fixtures, setFixtures] = React.useState<TFixture[]>([]);

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
      />
    </Paper>
  );
}
