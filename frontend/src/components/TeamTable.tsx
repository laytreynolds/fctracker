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
import type { TTeam } from '@/types/types';
import { buildApiUrl } from '@/config/api';

export default function TeamTable({ page, rowsPerPage, onPageChange, onRowsPerPageChange }: {
  page: number;
  rowsPerPage: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const [teams, setTeams] = React.useState<TTeam[]>([]);

  useEffect(() => {
    fetch(buildApiUrl('/api/team/getall')).then(res => res.json()).then(data => setTeams(data.teams || []));
  }, []);

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 4 }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Coach</TableCell>
              <TableCell>Founded</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {teams.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((team) => (
              <TableRow key={team.ID}>
                <TableCell>{team.Name}</TableCell>
                <TableCell>{team.Coach}</TableCell>
                <TableCell>{team.Founded}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={teams.length}
        page={page}
        onPageChange={onPageChange}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={onRowsPerPageChange}
      />
    </Paper>
  );
}