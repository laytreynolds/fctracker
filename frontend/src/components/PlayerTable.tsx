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
import type { TPlayer } from '@/types/types';
import { buildApiUrl } from '@/config/api';

export default function PlayerTable({ page, rowsPerPage, onPageChange, onRowsPerPageChange, refreshKey }: {
  page: number;
  rowsPerPage: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  refreshKey: number;
  }) {
  const [players, setPlayers] = useState<TPlayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(buildApiUrl('/api/player'))
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load players');
        return res.json();
      })
      .then((data) => setPlayers(data.players || []))
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load players'))
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
              <TableCell>Age</TableCell>
              <TableCell>Position</TableCell>
              <TableCell>Goals</TableCell>
              <TableCell>Assists</TableCell>
              <TableCell>Games</TableCell>
              <TableCell>MOTM</TableCell>
              <TableCell>Team</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {players.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((player) => (
              <TableRow key={player.ID}>
                <TableCell>{player.Name}</TableCell>
                <TableCell>{player.Age}</TableCell>
                <TableCell>{player.Position}</TableCell>
                <TableCell>{player.Goals}</TableCell>
                <TableCell>{player.Assists}</TableCell>
                <TableCell>{player.GamesPlayed}</TableCell>
                <TableCell>{player.ManOfTheMatch}</TableCell>
                <TableCell>{player.TeamName}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={players.length}
        page={page}
        onPageChange={onPageChange}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={onRowsPerPageChange}
      />
    </Paper>
  );
}