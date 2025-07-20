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
  fact?: string;
}

const initialPlayers: Player[] = [
  { id: 1, name: 'Lionel Messi', position: 'Forward', team: 'PSG' },
  { id: 2, name: 'Cristiano Ronaldo', position: 'Forward', team: 'Al Nassr' },
  { id: 3, name: 'Kevin De Bruyne', position: 'Midfielder', team: 'Man City' },
  { id: 4, name: 'Virgil van Dijk', position: 'Defender', team: 'Liverpool' },
  { id: 5, name: 'Kylian Mbappé', position: 'Forward', team: 'PSG' },
  { id: 6, name: 'Erling Haaland', position: 'Forward', team: 'Man City' },
  { id: 7, name: 'Luka Modrić', position: 'Midfielder', team: 'Real Madrid' },
  { id: 8, name: 'Neymar Jr.', position: 'Forward', team: 'Al Hilal' },
  { id: 9, name: 'Joshua Kimmich', position: 'Midfielder', team: 'Bayern Munich' },
  { id: 10, name: 'Jan Oblak', position: 'Goalkeeper', team: 'Atletico Madrid' },
];

export default function PlayersPage() {
  const [players, setPlayers] = React.useState<Player[]>(initialPlayers);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [open, setOpen] = React.useState(false);
  const [form, setForm] = React.useState({
    name: '',
    age: '',
    position: '',
    fact: '',
  });

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
    setForm({ name: '', age: '', position: '', fact: '' });
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddPlayer = async () => {
    const params = new URLSearchParams({
      name: form.name,
      age: form.age,
      position: form.position,
      fact: form.fact,
    });

    try {
      const response = await fetch(`http://localhost:8080/api/player/add?${params.toString()}`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('Failed to add player');
      }
      // Optionally, you can get the new player from the response and add it to state
      // const newPlayer = await response.json();
      // setPlayers([...players, newPlayer]);
      // For now, just add locally as before:
      const newId = players.length + 1;
      setPlayers([
        ...players,
        {
          id: newId,
          name: form.name,
          age: form.age ? parseInt(form.age, 10) : undefined,
          position: form.position,
          fact: form.fact,
        },
      ]);
      handleClose();
    } catch (error) {
      alert('Error adding player: ' + error);
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
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Position</TableCell>
                <TableCell>Age</TableCell>
                <TableCell>Fun Fact</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {players.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((player) => (
                <TableRow key={player.id}>
                  <TableCell>{player.id}</TableCell>
                  <TableCell>{player.name}</TableCell>
                  <TableCell>{player.position}</TableCell>
                  <TableCell>{player.age ?? '-'}</TableCell>
                  <TableCell>{player.fact ?? '-'}</TableCell>
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
              name="fact"
              value={form.fact}
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
