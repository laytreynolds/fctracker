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
import type { TPlayer, TTeam } from '@/types/types';
import { buildApiUrl } from '@/config/api';

interface AddFixtureDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AddFixtureDialog({ open, onClose, onSuccess }: AddFixtureDialogProps) {
  const [date, setDate] = useState('');
  const [homeTeam, setHomeTeam] = useState('');
  const [awayTeam, setAwayTeam] = useState('');
  const [homeScore, setHomeScore] = useState('');
  const [awayScore, setAwayScore] = useState('');
  const [manOfTheMatch, setManOfTheMatch] = useState('');
  const [players, setPlayers] = useState<TPlayer[]>([]);
  const [teams, setTeams] = useState<TTeam[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      // Fetch players for Man of the Match selection
      fetch(buildApiUrl('/api/player'))
        .then(res => res.json())
        .then(data => setPlayers(data.players || []))
        .catch(error => console.error('Error fetching players:', error));

      // Fetch teams
      fetch(buildApiUrl('/api/team/getall'))
        .then(res => res.json())
        .then(data => setTeams(data.teams || []))
        .catch(error => console.error('Error fetching teams:', error));
    }
  }, [open]);

  const handleSubmit = async () => {
    if (!date || !homeTeam || !awayTeam || !homeScore || !awayScore) {
      alert('Please fill in all required fields');
      return;
    }

    setSubmitting(true);

    try {
      const params = new URLSearchParams({
        date,
        homeTeam,
        awayTeam,
        homeScore,
        awayScore,
        manOfTheMatch,
      });

      const response = await fetch(buildApiUrl(`/api/fixture/add?${params.toString()}`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setDate('');
        setHomeTeam('');
        setAwayTeam('');
        setHomeScore('');
        setAwayScore('');
        setManOfTheMatch('');
        onClose();
        if (onSuccess) onSuccess();
      } else {
        alert('Failed to add fixture');
      }
    } catch (error) {
      console.error('Error adding fixture:', error);
      alert('Failed to add fixture');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!submitting) {
      setDate('');
      setHomeTeam('');
      setAwayTeam('');
      setHomeScore('');
      setAwayScore('');
      setManOfTheMatch('');
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add New Fixture</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            fullWidth
            required
            InputLabelProps={{ shrink: true }}
          />
          <FormControl fullWidth required>
            <InputLabel>Home Team</InputLabel>
            <Select
              value={homeTeam}
              label="Home Team"
              onChange={(e) => setHomeTeam(e.target.value)}
            >
              {teams.map((team) => (
                <MenuItem key={team.ID} value={team.Name}>
                  {team.Name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth required>
            <InputLabel>Away Team</InputLabel>
            <Select
              value={awayTeam}
              label="Away Team"
              onChange={(e) => setAwayTeam(e.target.value)}
            >
              {teams.map((team) => (
                <MenuItem key={team.ID} value={team.Name}>
                  {team.Name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Stack direction="row" spacing={2}>
            <TextField
              label="Home Score"
              type="number"
              value={homeScore}
              onChange={(e) => setHomeScore(e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Away Score"
              type="number"
              value={awayScore}
              onChange={(e) => setAwayScore(e.target.value)}
              fullWidth
              required
            />
          </Stack>
          <FormControl fullWidth>
            <InputLabel>Man of the Match</InputLabel>
            <Select
              value={manOfTheMatch}
              label="Man of the Match"
              onChange={(e) => setManOfTheMatch(e.target.value)}
            >
              {players.map((player) => (
                <MenuItem key={player.ID} value={player.Name}>
                  {player.Name} ({player.Position})
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
          {submitting ? 'Adding...' : 'Add Fixture'}
        </Button>
      </DialogActions>
    </Dialog>
  );
} 