import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
} from '@mui/material';
import { buildApiUrl } from '@/config/api';

interface AddTeamDialogueProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AddTeamDialogue({ open, onClose, onSuccess }: AddTeamDialogueProps) {
  const [name, setName] = useState('');
  const [coach, setCoach] = useState('');
  const [founded, setFounded] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!name || !coach || !founded) {
      alert('Please fill in all fields');
      return;
    }

    setSubmitting(true);

    try {
      const params = new URLSearchParams({
        name,
        coach,
        founded,
      });

      const response = await fetch(buildApiUrl(`/api/team/add?${params.toString()}`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setName('');
        setCoach('');
        setFounded('');
        onClose();
        if (onSuccess) onSuccess();
      } else {
        alert('Failed to add team');
      }
    } catch (error) {
      console.error('Error adding team:', error);
      alert('Failed to add team');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!submitting) {
      setName('');
      setCoach('');
      setFounded('');
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add New Team</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Team Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Coach"
            value={coach}
            onChange={(e) => setCoach(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Founded Year"
            value={founded}
            onChange={(e) => setFounded(e.target.value)}
            fullWidth
            required
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={submitting}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={submitting}>
          {submitting ? 'Adding...' : 'Add Team'}
        </Button>
      </DialogActions>
    </Dialog>
  );
} 