import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Alert,
} from '@mui/material';
import type { TPlayer, TTeam } from '@/types/types';
import { buildApiUrl } from '@/config/api';
import { postcodeToCoordinates } from '@/utils/geocoding';

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
  const [postcode, setPostcode] = useState('');
  const [players, setPlayers] = useState<TPlayer[]>([]);
  const [teams, setTeams] = useState<TTeam[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [geocodingError, setGeocodingError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    const controller = new AbortController();
    const opts = { signal: controller.signal };
    Promise.all([
      fetch(buildApiUrl('/api/player'), opts).then(res => res.json()),
      fetch(buildApiUrl('/api/team/getall'), opts).then(res => res.json()),
    ])
      .then(([playerData, teamData]) => {
        setPlayers(playerData.players || []);
        setTeams(teamData.teams || []);
      })
      .catch((error) => {
        if (error.name !== 'AbortError') console.error('Error fetching dialog data:', error);
      });
    return () => controller.abort();
  }, [open]);

  const handleSubmit = async () => {
    if (!date || !homeTeam || !awayTeam || !homeScore || !awayScore) {
      alert('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    setGeocodingError(null);

    try {
      // Convert postcode to coordinates if provided
      let coordinates = null;
      if (postcode.trim()) {
        coordinates = await postcodeToCoordinates(postcode.trim());
        if (!coordinates) {
          setGeocodingError('Could not find coordinates for the provided postcode');
          setSubmitting(false);
          return;
        }
      }

      const params = new URLSearchParams({
        date,
        homeTeam,
        awayTeam,
        homeScore,
        awayScore,
        manOfTheMatch,
      });

      // Add coordinates to params if available
      if (coordinates) {
        params.append('latitude', coordinates.latitude.toString());
        params.append('longitude', coordinates.longitude.toString());
      }

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
        setPostcode('');
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
      setPostcode('');
      setGeocodingError(null);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add New Fixture</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            label="Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            required
          />
          
          <FormControl fullWidth required>
            <InputLabel>Home Team</InputLabel>
            <Select value={homeTeam} onChange={(e) => setHomeTeam(e.target.value)}>
              {teams.map((team) => (
                <MenuItem key={team.ID} value={team.Name}>
                  {team.Name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth required>
            <InputLabel>Away Team</InputLabel>
            <Select value={awayTeam} onChange={(e) => setAwayTeam(e.target.value)}>
              {teams.map((team) => (
                <MenuItem key={team.ID} value={team.Name}>
                  {team.Name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="Home Score"
              type="number"
              value={homeScore}
              onChange={(e) => setHomeScore(e.target.value)}
              required
              fullWidth
            />
            <TextField
              label="Away Score"
              type="number"
              value={awayScore}
              onChange={(e) => setAwayScore(e.target.value)}
              required
              fullWidth
            />
          </Box>

          <FormControl fullWidth>
            <InputLabel>Man of the Match</InputLabel>
            <Select value={manOfTheMatch} onChange={(e) => setManOfTheMatch(e.target.value)}>
              {players.map((player) => (
                <MenuItem key={player.ID} value={player.ID}>
                  {player.Name} ({player.Position})
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Postcode (optional)"
            value={postcode}
            onChange={(e) => setPostcode(e.target.value)}
            placeholder="e.g., SW1A 1AA"
            helperText="Enter a UK postcode to automatically set the fixture location"
          />

          {geocodingError && (
            <Alert severity="error" sx={{ mt: 1 }}>
              {geocodingError}
            </Alert>
          )}
        </Box>
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