import React from 'react';
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
  } from '@mui/material';
  import type{ TPlayer } from '@/types/types';

interface PlayerTableProps {
    page: number;
    rowsPerPage: number;
    onPageChange: (event: unknown, newPage: number) => void;
    onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    refresh: number;
  }

  export default function PlayerTable({
    page,
    rowsPerPage,
    onPageChange,
    onRowsPerPageChange,
    refresh
  }: PlayerTableProps) {

const [players, setPlayers] = React.useState<TPlayer[]>([]);

  // Fetch Players
  React.useEffect(() => {
    fetch('http://localhost:8080/api/player').then(res => res.json()).then(data => setPlayers(data.players || []));
  }, [refresh]);

return (
<Paper sx={{ width: '100%', overflow: 'hidden' }}>
<TableContainer>
  <Table>
    <TableHead>
      <TableRow>
        <TableCell>Team</TableCell>
        <TableCell>Name</TableCell>
        <TableCell>Position</TableCell>
        <TableCell>Age</TableCell>
        <TableCell>Goals</TableCell>
        <TableCell>Assists</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {players.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((player) => (
        <TableRow key={player.ID}>
          <TableCell>{player.TeamName}</TableCell>
          <TableCell>{player.Name}</TableCell>
          <TableCell>{player.Position}</TableCell>
          <TableCell>{player.Age ?? '-'}</TableCell>
          <TableCell>{player.Goals ?? '-'}</TableCell>
          <TableCell>{player.Assists ?? '-'}</TableCell>
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
  rowsPerPageOptions={[5, 10, 25]}
    />
  </Paper>
);
}