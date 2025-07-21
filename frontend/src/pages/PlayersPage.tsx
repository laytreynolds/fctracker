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
import AddPlayerDialog from './AddPlayerDialog';

interface Player {
  id: string;
  name: string;
  age?: number;
  position: string;
  funFact?: string;
  goals: number;
  assists: number;
  teamName: string;
}

export default function PlayersPage() {
  const [players, setPlayers] = React.useState<Player[]>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [open, setOpen] = React.useState(false);

  const fetchPlayers = React.useCallback(async () => {
    try {
      const response = await fetch('http://localhost:8080/api/player');
      if (!response.ok) {
        throw new Error('error fetching players');
      }
      const data = await response.json();

      if (data.error) {
        alert(`Error from server: ${data.error}`);
        return;
      }

      if (Array.isArray(data.players)) {
        const fetchedPlayers: Player[] = data.players.map(
          (player: {
            ID: string;
            TeamName: string;
            Name: string;
            Age: string;
            Position: string;
            FunFact: string;
            Goals: number;
            Assists: number;
          }) => ({
            id: player.ID,
            teamName: player.TeamName,
            name: player.Name,
            age: player.Age ? parseInt(player.Age, 10) : undefined,
            position: player.Position,
            funFact: player.FunFact,
            goals: player.Goals,
            assists: player.Assists,
          })
        );
        setPlayers(fetchedPlayers);
      }
    } catch (error) {
      console.error('Failed to fetch players:', error);
      alert('Failed to fetch players. Check the console for more details.');
    }
  }, []);

  React.useEffect(() => {
    fetchPlayers();
  }, [fetchPlayers]);

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
    fetchPlayers();
  };

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 }, maxWidth: 900, mx: 'auto' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h5">Players</Typography>
        <Button variant="contained" color="primary" onClick={handleOpen}>
          Add Player
        </Button>
      </Stack>
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
                <TableRow key={player.id}>
                  <TableCell>{player.teamName}</TableCell>
                  <TableCell>{player.name}</TableCell>
                  <TableCell>{player.position}</TableCell>
                  <TableCell>{player.age ?? '-'}</TableCell>
                  <TableCell>{player.goals ?? '-'}</TableCell>
                  <TableCell>{player.assists ?? '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={players.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Paper>
      <AddPlayerDialog open={open} onClose={handleClose} onSuccess={handleSuccess} />
    </Box>
  );
}
