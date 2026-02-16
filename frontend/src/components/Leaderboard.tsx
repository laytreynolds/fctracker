import { useEffect, useState } from 'react';
import {
  Grid, Card, CardContent, Typography, List, ListItem, Stack, CircularProgress, Box,
} from '@mui/material';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import type { TPlayer } from '@/types/types';
import { buildApiUrl } from '@/config/api';

export default function Leaderboard() {
  const [goals, setGoals] = useState<TPlayer[]>([]);
  const [assists, setAssists] = useState<TPlayer[]>([]);
  const [motm, setMotm] = useState<TPlayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    Promise.all([
      fetch(buildApiUrl('/api/leaderboard/goals')).then((res) => {
        if (!res.ok) throw new Error('Failed to load leaderboard');
        return res.json();
      }),
      fetch(buildApiUrl('/api/leaderboard/assists')).then((res) => {
        if (!res.ok) throw new Error('Failed to load leaderboard');
        return res.json();
      }),
      fetch(buildApiUrl('/api/leaderboard/motm')).then((res) => {
        if (!res.ok) throw new Error('Failed to load leaderboard');
        return res.json();
      }),
    ])
      .then(([goalsData, assistsData, motmData]) => {
        setGoals(goalsData.players || []);
        setAssists(assistsData.players || []);
        setMotm(motmData.players || []);
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load leaderboard'))
      .finally(() => setLoading(false));
  }, []);
    
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  if (error) {
    return (
      <Typography color="error" sx={{ py: 2, textAlign: 'center' }}>
        {error}
      </Typography>
    );
  }

  return (
    <Grid
      container
      spacing={2}
      justifyContent="center"
          >
<Grid size={4}>
          <Card sx={{ width: '100%', borderRadius: 4 }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                <SportsSoccerIcon color="primary" />
                <Typography variant="h6" gutterBottom>Goals</Typography>
              </Stack>
              <List dense>
                {goals.map((player, idx) => (
                  <ListItem key={player.ID} disableGutters>
                    <Stack direction="row" alignItems="center" width="100%">
                      <Typography sx={{ minWidth: 24, fontWeight: 500 }}>{idx + 1}</Typography>
                      <Typography sx={{ flexGrow: 1, ml: 2 }}>{player.Name}</Typography>
                      <Typography sx={{ fontWeight: 500, color: 'primary.main' }}>
                        {player.Goals ?? 0}
                      </Typography>
                    </Stack>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={4}>
          <Card sx={{ width: '100%',  borderRadius: 4 }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                <TrackChangesIcon color="primary" />
                <Typography variant="h6" gutterBottom>Assists</Typography>
              </Stack>
              <List dense>
                {assists.map((player, idx) => (
                  <ListItem key={player.ID} disableGutters>
                    <Stack direction="row" alignItems="center" width="100%">
                      <Typography sx={{ minWidth: 24, fontWeight: 500 }}>{idx + 1}</Typography>
                      <Typography sx={{ flexGrow: 1, ml: 2 }}>{player.Name}</Typography>
                      <Typography sx={{ fontWeight: 500, color: 'primary.main' }}>
                        {player.Assists ?? 0}
                      </Typography>
                    </Stack>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={4}>
          <Card sx={{ width: '100%', borderRadius: 4 }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                <EmojiEventsIcon color="primary" />
                <Typography variant="h6" gutterBottom>Man of the Match</Typography>
              </Stack>
              <List dense>
                {motm.map((player, idx) => (
                  <ListItem key={player.ID} disableGutters>
                    <Stack direction="row" alignItems="center" width="100%">
                      <Typography sx={{ minWidth: 24, fontWeight: 500 }}>{idx + 1}</Typography>
                      <Typography sx={{ flexGrow: 1, ml: 2 }}>{player.Name}</Typography>
                      <Typography sx={{ fontWeight: 500, color: 'primary.main' }}>
                        {player.ManOfTheMatch ?? 0}
                      </Typography>
                    </Stack>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
  );
}