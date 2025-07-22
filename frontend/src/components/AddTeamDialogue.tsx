import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  Button,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';

// Component Props
interface AddFixtureDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddFixtureDialog({ open, onClose, onSuccess }: AddFixtureDialogProps) {
  // State for form inputs
  const [form, setForm] = React.useState({
    name: '',
    coach: '',
    founded: '',
  });

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
      name: '',
      coach: '',
      founded: '',
    });
  };

  const handleCloseDialog = () => {
    resetForm();
    onClose();
  };

  const handleAddFixture = async () => {
    const params = new URLSearchParams({
      name: form.name,
      coach: form.coach,
      founded: form.founded,
    });

    try {
      // Note: You will need to create this backend endpoint
      const response = await fetch(`http://localhost:8080/api/team/add?${params.toString()}`, {
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
  
  const isFormInvalid = !form.name || !form.coach || !form.founded;

  return (
    <Dialog open={open} onClose={handleCloseDialog}>
      <DialogTitle>Add New Team</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1, minWidth: '400px' }}>
          <TextField
            label="Team Name"
            name="name"
            type="string"
            value={form.name}
            onChange={handleFormChange}
            fullWidth
            required
            InputLabelProps={{
              shrink: true,
            }}
          />
        <TextField label="Coach" name="coach" value={form.coach} onChange={handleFormChange} type="string" fullWidth required />
        <TextField label="Founded" name="founded" value={form.founded} onChange={handleFormChange} type="string" fullWidth required />
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