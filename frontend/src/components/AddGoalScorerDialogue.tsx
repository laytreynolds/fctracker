import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, List, ListItem, ListItemButton, ListItemText, CircularProgress
} from '@mui/material';
import type { TPlayer } from '@/types/types';

export default function AddGoalscorerDialogue({ open, onClose, fixtureId }: {
  open: boolean;
  onClose: () => void;
  fixtureId: string;
}) {
  const [players, setPlayers] = React.useState<TPlayer[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (open) {
      setLoading(true);
      fetch('http://localhost:8080/api/player')
        .then(res => res.json())
        .then(data => {
          setPlayers(data.players || []);
          setLoading(false);
        });
    }
  }, [open]);

  const handleAddGoalSubmit = (playerId: string) => {
    // Call your backend to update the fixture
    fetch(`http://localhost:8080/api/fixture/addgoalscorer?fixtureId=${fixtureId}&playerId=${playerId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fixtureId: fixtureId, playerId }),
    })
      .then(res => res.json())
  };
  
  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Select Goalscorer</DialogTitle>
      <DialogContent>
        {loading ? (
          <CircularProgress />
        ) : (
          <List>
            {players.map(player => (
              <ListItem key={player.ID} disablePadding>
                <ListItemButton onClick={() => handleAddGoalSubmit(player.ID)}>
                  <ListItemText primary={player.Name} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}
