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

export default function AddGoalscorerDialogue({ open, onClose, fixtureId, onSuccess }: {
  open: boolean;
  onClose: () => void;
  fixtureId: string;
  onSuccess?: () => void;
}) {
  const [players, setPlayers] = useState<TPlayer[]>([]);
  const [selectedPlayerId, setSelectedPlayerId] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      fetch(buildApiUrl('/api/player'))
        .then(res => res.json())
        .then(data => setPlayers(data.players || []))
        .catch(error => console.error('Error fetching players:', error));
    }
  }, [open]);

  const handleSubmit = (playerId: string) => {
    setSubmitting(true);
    
    fetch(buildApiUrl(`/api/fixture/addgoalscorer?fixtureId=${fixtureId}&playerId=${playerId}`), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        alert(`Error: ${data.error}`);
      } else {
        setSelectedPlayerId('');
        onClose();
        if (onSuccess) onSuccess();
      }
    })
    .catch(error => {
      console.error('Error adding goalscorer:', error);
      alert('Failed to add goalscorer');
    })
    .finally(() => {
      setSubmitting(false);
    });
  };

  const handleClose = () => {
    if (!submitting) {
      setSelectedPlayerId('');
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add Goal Scorer</DialogTitle>
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
          {submitting ? 'Adding...' : 'Add Goal'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
