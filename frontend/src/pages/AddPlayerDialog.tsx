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

interface Team {
  id: string;
  name: string;
}

interface AddPlayerDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddPlayerDialog({ open, onClose, onSuccess }: AddPlayerDialogProps) {
  const [form, setForm] = React.useState({
    name: '',
    age: '',
    position: '',
    team: '',
    funFact: '',
  });
  const [teams, setTeams] = React.useState<Team[]>([]);

  const fetchTeams = React.useCallback(async () => {
    try {
      const response = await fetch('http://localhost:8080/api/team/getall');
      if (!response.ok) throw new Error('error fetching teams');
      const data = await response.json();
      if (data.error) {
        alert(`Error from server: ${data.error}`);
        return;
      }
      if (Array.isArray(data.teams)) {
        const fetchedTeams: Team[] = data.teams
          .map((team: { Name: string }) => ({
            name: team.Name,
          }))
          .filter((team: Team) => team.name);

        setTeams(fetchedTeams);
      }
    } catch (error) {
      alert(`Failed to fetch teams error: ${error}`);
    }
  }, []);

  // Fetch teams when the dialog opens
  React.useEffect(() => {
    if (open) {
      fetchTeams();
    }
  }, [open, fetchTeams]);

  // Set a default team when teams are loaded
  React.useEffect(() => {
    if (open && teams.length > 0 && !form.team) {
      setForm((prev) => ({ ...prev, team: teams[0].name }));
    }
  }, [open, teams, form.team]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name!]: value }));
  };

  const handleTeamChange = (event: SelectChangeEvent) => {
    setForm((prev) => ({ ...prev, team: event.target.value }));
  };
  
  const handleCloseDialog = () => {
    setForm({ name: '', age: '', position: '', funFact: '', team: '' });
    onClose();
  };

  const handleAddPlayer = async () => {
    const params = new URLSearchParams({
      name: form.name,
      age: form.age,
      position: form.position,
      funFact: form.funFact,
      team: form.team,
    });

    try {
      const response = await fetch(`http://localhost:8080/api/player/add?${params.toString()}`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('Failed to add player');
      }
      onSuccess();
    } catch (error) {
      alert(`Error adding player: ${(error as Error).message}`);
    }
  };

  return (
    <Dialog open={open} onClose={handleCloseDialog}>
      <DialogTitle>Add Player</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1, minWidth: '400px' }}>
          <TextField label="Name" name="name" value={form.name} onChange={handleFormChange} fullWidth required />
          <TextField label="Age" name="age" value={form.age} onChange={handleFormChange} type="number" fullWidth />
          <TextField label="Position" name="position" value={form.position} onChange={handleFormChange} fullWidth required />
          <TextField label="Fun Fact" name="funFact" value={form.funFact} onChange={handleFormChange} fullWidth />
          <FormControl fullWidth required>
            <InputLabel id="team-select-label">Team</InputLabel>
            <Select labelId="team-select-label" label="Team" name="team" value={form.team} onChange={handleTeamChange}>
              {teams.map((team) => (
                <MenuItem key={team.name} value={team.name}>
                  {team.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDialog}>Cancel</Button>
        <Button onClick={handleAddPlayer} variant="contained" disabled={!form.name || !form.position || !form.team}>
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
} 