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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';

interface Player {
  id: number;
  name: string;
  age?: number;
  position: string;
  team?: string;
  funFact?: string;
  goals: number;
  assists: number;
}

export default function PlayersPage() {
  const [players, setPlayers] = React.useState<Player[]>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [open, setOpen] = React.useState(false);
  const [form, setForm] = React.useState({
    name: '',
    age: '',
    position: '',
    funFact: '',
    team: ''
  });

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
        const fetchedPlayers: Player[] = data.players.map((player: { ID: string; Name: string; Age: string; Position: string; FunFact: string; Goals: number; Assists: number; }) => ({
          id: player.ID ? parseInt(player.ID, 16) : Math.random(), // using a random number as a fallback
          name: player.Name,
          age: player.Age ? parseInt(player.Age, 10) : undefined,
          position: player.Position,
          funFact: player.FunFact,
          goals: player.Goals,
          assists: player.Assists
        }));
        setPlayers(fetchedPlayers);
      }
    } catch (error) {
      console.error("Failed to fetch players:", error);
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
  const handleClose = () => {
    setOpen(false);
    setForm({ name: '', age: '', position: '', funFact: '', team: '' });
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddPlayer = async () => {
    const params = new URLSearchParams({
      name: form.name,
      age: form.age,
      position: form.position,
      funFact: form.funFact,
      team: form.team
    });

    try {
      const response = await fetch(`http://localhost:8080/api/player/add?${params.toString()}`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('Failed to add player');
      }
      handleClose();
      fetchPlayers(); // Refetch players to show the new one
    } catch (error) {
      alert('Error adding player: ' + (error as Error).message);
    }
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
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Player</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Name"
              name="name"
              value={form.name}
              onChange={handleFormChange}
              fullWidth
              required
            />
            <TextField
              label="Age"
              name="age"
              value={form.age}
              onChange={handleFormChange}
              type="number"
              fullWidth
            />
            <TextField
              label="Position"
              name="position"
              value={form.position}
              onChange={handleFormChange}
              fullWidth
              required
            />
            <TextField
              label="Fun Fact"
              name="funFact"
              value={form.funFact}
              onChange={handleFormChange}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleAddPlayer} variant="contained" disabled={!form.name || !form.position}>
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
