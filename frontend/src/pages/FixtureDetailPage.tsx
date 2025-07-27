import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Card,
  CardContent,
  Typography,
  Stack,
  Button,
  Chip,
  Divider,
  CircularProgress,
  Grid,
  Box,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AddGoalscorerDialogue from '@/components/AddGoalScorerDialogue';
import FixtureDetailMap from '@/components/FixtureDetailMap';
import { buildApiUrl } from '@/config/api';

// Use the TFixture type from types.tsx
import type { TFixture } from '@/types/types';

export default function FixtureDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [fixture, setFixture] = React.useState<TFixture | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [addGoalOpen, setAddGoalOpen] = React.useState(false);

  useEffect(() => {
    if (id) {
      fetch(buildApiUrl(`/api/fixture/${id}`))
        .then(res => res.json())
        .then(data => {
          if (data.fixture) {
            setFixture(data.fixture);
          } else {
            setError('Fixture not found');
          }
        })
        .catch(() => setError('Failed to load fixture'))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleEdit = () => {
    alert('Edit Fixture (not implemented)');
  };
  const handleAddGoal = () => setAddGoalOpen(true);
  const handleAddGoalClose = () => {
    setAddGoalOpen(false);
    // Refresh the fixture data after adding a goal
    if (id) {
      fetch(buildApiUrl(`/api/fixture/${id}`))
        .then(res => res.json())
        .then(data => {
          if (data.fixture) {
            setFixture(data.fixture);
          }
        })
        .catch(() => setError('Failed to refresh fixture'));
    }
  };
  const handleAddAssist = () => {
    alert('Add Assist (not implemented)');
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress /></Box>;
  if (error) return <Typography color="error" sx={{ mt: 8, textAlign: 'center' }}>{error}</Typography>;
  if (!fixture) return null;

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 }, maxWidth: 1000, mx: 'auto', mt: 4 }}>
      <Card sx={{ borderRadius: 4, mb: 3 }}>
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
            <Box>
              <Typography variant="h5" fontWeight={700} gutterBottom>
                {fixture.HomeTeam} vs {fixture.AwayTeam}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Date: {fixture.Date}
              </Typography>
            </Box>
            <Box>
              <Typography variant="h4" fontWeight={700}>
                {fixture.HomeScore} - {fixture.AwayScore}
              </Typography>
            </Box>
          </Stack>
          <Divider sx={{ my: 2 }} />
          <Stack direction="row" spacing={2} alignItems="center" mb={2}>
            <Typography variant="body1" fontWeight={500}>Man of the Match:</Typography>
            <Chip label={fixture.ManOfTheMatchName || 'N/A'} color="success" />
          </Stack>    
          <Stack direction="row" spacing={2}>
            <Button variant="outlined" startIcon={<AddCircleOutlineIcon />} onClick={handleAddGoal}>
              Add Goalscorer
            </Button>
            <AddGoalscorerDialogue
              open={addGoalOpen}
              onClose={handleAddGoalClose}
              fixtureId={id || ''}
              onSuccess={handleAddGoalClose}
            />
            <Button variant="outlined" startIcon={<AddCircleOutlineIcon />} onClick={handleAddAssist}>
              Add Assist
            </Button>
            <Button variant="contained" startIcon={<EditIcon />} onClick={handleEdit}>
              Edit Fixture
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {/* Map Section */}
      <Card sx={{ borderRadius: 4, mb: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Fixture Location
          </Typography>
          <FixtureDetailMap fixture={fixture} />
        </CardContent>
      </Card>

      <Grid container spacing={2}>
        <Grid size={4}>
          <Card sx={{ borderRadius: 4 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>Lineup</Typography>
              <Typography color="text.secondary">Lineup data not available.</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={4}>
          <Card sx={{ borderRadius: 4, mb: 2 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>Goal Scorers</Typography>
              {fixture.GoalScorersNames && fixture.GoalScorersNames.length > 0 ? (
                <Stack spacing={1}>
                  {fixture.GoalScorersNames.map((name: string, idx: number) => (
                    <Chip key={idx} label={name} color="success" />
                  ))}
                </Stack>
              ) : (
                <Typography color="text.secondary">No goals</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid size={4}>
          <Card sx={{ borderRadius: 4 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>Assist Providers</Typography>
              {fixture.AssistScorersNames && fixture.AssistScorersNames.length > 0 ? (
                <Stack spacing={1}>
                  {fixture.AssistScorersNames.map((name: string, idx: number) => (
                    <Chip key={idx} label={name} color="info" />
                  ))}
                </Stack>
              ) : (
                <Typography color="text.secondary">No assists</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      {/* Related info: Teams/Players links if available */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="subtitle2" color="text.secondary">
          {/* Example: Add links to teams or players if you have their IDs */}
          {/* <Link to={`/teams/${fixture.HomeTeamId}`}>{fixture.HomeTeam}</Link> */}
        </Typography>
      </Box>
    </Box>
  );
} 