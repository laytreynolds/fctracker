import React, { useEffect } from 'react';
import {
    Grid, Card, CardContent, Typography, List, ListItem, Stack
  } from '@mui/material';

import SportsSoccerIcon from '@mui/icons-material/SportsSoccer'; // Goal
import TrackChangesIcon from '@mui/icons-material/TrackChanges'; // Target (Assists)
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';   // Trophy (MOTM)
import type { TPlayer } from '@/types/types';
import { buildApiUrl } from '@/config/api';

export default function Leaderboard(){
    
    const [goals, setGoals] = React.useState<TPlayer[]>([]);
  const [assists, setAssists] = React.useState<TPlayer[]>([]);
  const [motm, setMotm] = React.useState<TPlayer[]>([]);

   // Fetch leaderboards
   useEffect(() => {
    fetch(buildApiUrl('/api/leaderboard/goals')).then(res => res.json()).then(data => setGoals(data.players || []));
    fetch(buildApiUrl('/api/leaderboard/assists')).then(res => res.json()).then(data => setAssists(data.players || []));
    fetch(buildApiUrl('/api/leaderboard/motm')).then(res => res.json()).then(data => setMotm(data.players || []));
  }, []);
    
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