import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Stack,
  Button,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';

// Interfaces for fetched data
interface Player {
  id: string;
  name: string;
}

interface Team {
  id: string;
  name: string;
}

// Component Props
interface AddFixtureDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddFixtureDialog({ open, onClose, onSuccess }: AddFixtureDialogProps) {
  // State for form inputs
  const [form, setForm] = React.useState({
    date: '',
    homeTeam: '',
    awayTeam: '',
    homeScore: '',
    awayScore: '',
    manOfTheMatch: '', // This will be the player's ID
  });

  // State for dropdown data
  const [players, setPlayers] = React.useState<Player[]>([]);
  const [teams, setTeams] = React.useState<Team[]>([]);

  // Fetch players for Man of the Match dropdown
  const fetchPlayers = React.useCallback(async () => {
    try {
      const response = await fetch('http://localhost:8080/api/player');
      if (!response.ok) throw new Error('Failed to fetch players');
      const data = await response.json();
      if (data.players) {
        const fetchedPlayers: Player[] = data.players
          .map((p: { ID: string; Name: string }) => ({
            id: p.ID,
            name: p.Name,
          }));
        setPlayers(fetchedPlayers);
      }
    } catch (error) {
      console.error('Fetch players error:', error);
      alert('Failed to load players for dropdown.');
    }
  }, []);

  // Fetch teams for Home/Away team dropdowns
  const fetchTeams = React.useCallback(async () => {
    try {
      const response = await fetch('http://localhost:8080/api/team/getall');
      if (!response.ok) throw new Error('Failed to fetch teams');
      const data = await response.json();
      if (data.teams) {
        const fetchedTeams: Team[] = data.teams
          .map((t: { _id: string; Name: string }) => ({
            id: t._id,
            name: t.Name,
          }));
        setTeams(fetchedTeams);
      }
    } catch (error) {
      console.error('Fetch teams error:', error);
      alert('Failed to load teams for dropdowns.');
    }
  }, []);

  // Fetch data when dialog opens
  React.useEffect(() => {
    if (open) {
      fetchPlayers();
      fetchTeams();
    }
  }, [open, fetchPlayers, fetchTeams]);

  // Handlers
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  
  const handleSelectChange = (event: SelectChangeEvent) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setForm({
      date: '',
      homeTeam: '',
      awayTeam: '',
      homeScore: '',
      awayScore: '',
      manOfTheMatch: '',
    });
  };

  const handleCloseDialog = () => {
    resetForm();
    onClose();
  };

  const handleAddFixture = async () => {
    const params = new URLSearchParams({
      date: form.date,
      homeTeam: form.homeTeam,
      awayTeam: form.awayTeam,
      homeScore: form.homeScore,
      awayScore: form.awayScore,
      manOfTheMatch: form.manOfTheMatch,
    });

    try {
      // Note: You will need to create this backend endpoint
      const response = await fetch(`http://localhost:8080/api/fixture/add?${params.toString()}`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('Failed to add fixture');
      }
      resetForm();
      onSuccess();
    } catch (error) {
      alert(`Error adding fixture: ${(error as Error).message}`);
    }
  };
  
  const isFormInvalid = !form.date || !form.homeTeam || !form.awayTeam || form.homeScore === '' || form.awayScore === '';

  return (
    <Dialog open={open} onClose={handleCloseDialog}>
      <DialogTitle>Add New Fixture</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1, minWidth: '400px' }}>
          <TextField
            label="Fixture Date"
            name="date"
            type="date"
            value={form.date}
            onChange={handleFormChange}
            fullWidth
            required
            InputLabelProps={{
              shrink: true,
            }}
          />
          <FormControl fullWidth required>
            <InputLabel id="home-team-label">Home Team</InputLabel>
            <Select labelId="home-team-label" name="homeTeam" value={form.homeTeam} onChange={handleSelectChange} label="Home Team">
                {teams.map((team) => (
                  <MenuItem key={team.id} value={team.name}>
                    {team.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth required>
              <InputLabel id="away-team-label">Away Team</InputLabel>
              <Select labelId="away-team-label" name="awayTeam" value={form.awayTeam} onChange={handleSelectChange} label="Away Team">
                {teams.map((team) => (
                  <MenuItem key={team.id} value={team.name}>
                    {team.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField label="Home Score" name="homeScore" value={form.homeScore} onChange={handleFormChange} type="number" fullWidth required />
            <TextField label="Away Score" name="awayScore" value={form.awayScore} onChange={handleFormChange} type="number" fullWidth required />
            <FormControl fullWidth>
              <InputLabel id="motm-label">Man of the Match</InputLabel>
              <Select labelId="motm-label" name="manOfTheMatch" value={form.manOfTheMatch} onChange={handleSelectChange} label="Man of the Match">
                <MenuItem value=""><em>None</em></MenuItem>
                {players.map((player) => (
                  <MenuItem key={player.id} value={player.id}>
                    {player.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleAddFixture} variant="contained" disabled={isFormInvalid}>
            Add Fixture
          </Button>
        </DialogActions>
      </Dialog>
    );
} 