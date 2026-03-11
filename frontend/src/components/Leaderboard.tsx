import { useEffect, useState } from 'react';
import {
  Grid, Card, CardContent, Typography, List, ListItem, Stack, CircularProgress, Box,
} from '@mui/material';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import type { TPlayer } from '@/types/types';
import { buildApiUrl } from '@/config/api';

const iconColors = {
  goals: '#4ade80',
  assists: '#60a5fa',
  motm: '#fb923c',
};

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
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
        <CircularProgress size={32} />
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

  const leaderboards = [
    {
      title: 'Goals',
      icon: <SportsSoccerIcon sx={{ color: iconColors.goals }} />,
      data: goals,
      statKey: 'Goals' as const,
      statColor: iconColors.goals,
    },
    {
      title: 'Assists',
      icon: <TrackChangesIcon sx={{ color: iconColors.assists }} />,
      data: assists,
      statKey: 'Assists' as const,
      statColor: iconColors.assists,
    },
    {
      title: 'Man of the Match',
      icon: <EmojiEventsIcon sx={{ color: iconColors.motm }} />,
      data: motm,
      statKey: 'ManOfTheMatch' as const,
      statColor: iconColors.motm,
    },
  ];

  return (
    <Grid container spacing={2.5}>
      {leaderboards.map(({ title, icon, data, statKey, statColor }) => (
        <Grid key={title} size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
              <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: `${statColor}15`,
                  }}
                >
                  {icon}
                </Box>
                <Typography variant="h6">{title}</Typography>
              </Stack>
              <List dense disablePadding>
                {data.map((player, idx) => (
                  <ListItem
                    key={player.ID}
                    disableGutters
                    sx={{
                      py: 0.75,
                      borderBottom: idx < data.length - 1 ? '1px solid' : 'none',
                      borderColor: 'divider',
                    }}
                  >
                    <Stack direction="row" alignItems="center" width="100%">
                      <Typography
                        sx={{
                          minWidth: 24,
                          fontWeight: 700,
                          fontSize: '0.8rem',
                          color: 'text.secondary',
                        }}
                      >
                        {idx + 1}
                      </Typography>
                      <Typography sx={{ flexGrow: 1, ml: 1.5, fontWeight: 500, fontSize: '0.925rem' }}>
                        {player.Name}
                      </Typography>
                      <Typography sx={{ fontWeight: 700, color: statColor, fontSize: '0.925rem' }}>
                        {player[statKey] ?? 0}
                      </Typography>
                    </Stack>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
