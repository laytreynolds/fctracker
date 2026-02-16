import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  CircularProgress,
  Typography,
  Box,
} from '@mui/material';
import type { TTeam } from '@/types/types';
import { buildApiUrl } from '@/config/api';

export default function TeamTable({ page, rowsPerPage, onPageChange, onRowsPerPageChange, refreshKey = 0 }: {
  page: number;
  rowsPerPage: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  refreshKey?: number;
}) {
  const [teams, setTeams] = useState<TTeam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(buildApiUrl('/api/team/getall'))
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load teams');
        return res.json();
      })
      .then((data) => setTeams(data.teams || []))
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load teams'))
      .finally(() => setLoading(false));
  }, [refreshKey]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  if (error) {
    return (
      <Typography color="error" sx={{ py: 2, textAlign: 'center' }}>
        {error}
      </Typography>
    );
  }

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