import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import type { TTeam } from '@/types/types';
import { buildApiUrl } from '@/config/api';

interface AddPlayerDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AddPlayerDialog({ open, onClose, onSuccess }: AddPlayerDialogProps) {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [position, setPosition] = useState('');
  const [funFact, setFunFact] = useState('');
  const [teamId, setTeamId] = useState('');
  const [teams, setTeams] = useState<TTeam[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      fetch(buildApiUrl('/api/team/getall'))
        .then(res => res.json())
        .then(data => setTeams(data.teams || []))
        .catch(error => console.error('Error fetching teams:', error));
    }
  }, [open]);

  const handleSubmit = async () => {
    if (!name || !age || !position || !teamId) {
      alert('Please fill in all required fields');
      return;
    }

    setSubmitting(true);

    try {
      const params = new URLSearchParams({
        name,
        age,
        position,
        funFact,
        teamId,
      });

      const response = await fetch(buildApiUrl(`/api/player/add?${params.toString()}`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setName('');
        setAge('');
        setPosition('');
        setFunFact('');
        setTeamId('');
        onClose();
        if (onSuccess) onSuccess();
      } else {
        alert('Failed to add player');
      }
    } catch (error) {
      console.error('Error adding player:', error);
      alert('Failed to add player');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!submitting) {
      setName('');
      setAge('');
      setPosition('');
      setFunFact('');
      setTeamId('');
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add New Player</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Player Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Age"
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            fullWidth
            required
          />
          <FormControl fullWidth required>
            <InputLabel>Position</InputLabel>
            <Select
              value={position}
              label="Position"
              onChange={(e) => setPosition(e.target.value)}
            >
              <MenuItem value="GK">Goalkeeper (GK)</MenuItem>
              <MenuItem value="CB">Center Back (CB)</MenuItem>
              <MenuItem value="LB">Left Back (LB)</MenuItem>
              <MenuItem value="RB">Right Back (RB)</MenuItem>
              <MenuItem value="CDM">Defensive Midfielder (CDM)</MenuItem>
              <MenuItem value="CM">Center Midfielder (CM)</MenuItem>
              <MenuItem value="CAM">Attacking Midfielder (CAM)</MenuItem>
              <MenuItem value="LW">Left Winger (LW)</MenuItem>
              <MenuItem value="RW">Right Winger (RW)</MenuItem>
              <MenuItem value="ST">Striker (ST)</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Fun Fact"
            value={funFact}
            onChange={(e) => setFunFact(e.target.value)}
            fullWidth
            multiline
            rows={2}
          />
          <FormControl fullWidth required>
            <InputLabel>Team</InputLabel>
            <Select
              value={teamId}
              label="Team"
              onChange={(e) => setTeamId(e.target.value)}
            >
              {teams.map((team) => (
                <MenuItem key={team.ID} value={team.ID}>
                  {team.Name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={submitting}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={submitting}>
          {submitting ? 'Adding...' : 'Add Player'}
        </Button>
      </DialogActions>
    </Dialog>
  );
} 