import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import type { TPlayer } from '@/types/types';
import { buildApiUrl } from '@/config/api';

export default function AddAssistDialogue({ open, onClose, fixtureId, onSuccess }: {
  open: boolean;
  onClose: () => void;
  fixtureId: string;
  onSuccess?: () => void;
}) {
  const [players, setPlayers] = useState<TPlayer[]>([]);
  const [selectedPlayerId, setSelectedPlayerId] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    const controller = new AbortController();
    fetch(buildApiUrl('/api/player'), { signal: controller.signal })
      .then(res => res.json())
      .then(data => setPlayers(data.players || []))
      .catch((error) => {
        if (error.name !== 'AbortError') console.error('Error fetching players:', error);
      });
    return () => controller.abort();
  }, [open]);

  const handleSubmit = async (playerId: string) => {
    setSubmitting(true);
    try {
      const res = await fetch(
        buildApiUrl(`/api/fixture/addassist?fixtureId=${fixtureId}&playerId=${playerId}`),
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        }
      );
      const data = await res.json();
      if (data.error) {
        alert(`Error: ${data.error}`);
      } else {
        setSelectedPlayerId('');
        onClose();
        onSuccess?.();
      }
    } catch (error) {
      console.error('Error adding assist:', error);
      alert('Failed to add assist');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!submitting) {
      setSelectedPlayerId('');
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add Assist</DialogTitle>
      <DialogContent>
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel>Select Player</InputLabel>
          <Select
            value={selectedPlayerId}
            label="Select Player"
            onChange={(e) => setSelectedPlayerId(e.target.value)}
          >
            {players.map((player) => (
              <MenuItem key={player.ID} value={player.ID}>
                {player.Name} ({player.Position})
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={submitting}>
          Cancel
        </Button>
        <Button
          onClick={() => handleSubmit(selectedPlayerId)}
          variant="contained"
          disabled={!selectedPlayerId || submitting}
        >
          {submitting ? 'Adding...' : 'Add Assist'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
