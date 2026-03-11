import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
import AddAssistDialogue from '@/components/AddAssistDialogue';
import FixtureDetailMap from '@/components/FixtureDetailMap';
import FadeIn from '@/components/FadeIn';
import { authFetch } from '@/config/api';

import type { TFixture } from '@/types/types';

export default function FixtureDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [fixture, setFixture] = React.useState<TFixture | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [addGoalOpen, setAddGoalOpen] = React.useState(false);
  const [addAssistOpen, setAddAssistOpen] = React.useState(false);

  useEffect(() => {
    if (id) {
      authFetch(`/api/fixture/${id}`)
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
  const refreshFixture = () => {
    if (id) {
      authFetch(`/api/fixture/${id}`)
        .then(res => res.json())
        .then(data => {
          if (data.fixture) {
            setFixture(data.fixture);
          }
        })
        .catch(() => setError('Failed to refresh fixture'));
    }
  };
  const handleAddGoalClose = () => {
    setAddGoalOpen(false);
    refreshFixture();
  };
  const handleAddAssist = () => setAddAssistOpen(true);
  const handleAddAssistClose = () => {
    setAddAssistOpen(false);
    refreshFixture();
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress size={32} /></Box>;
  if (error) return <Typography color="error" sx={{ mt: 8, textAlign: 'center' }}>{error}</Typography>;
  if (!fixture) return null;

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, maxWidth: 1100, mx: 'auto' }}>
      <FadeIn>
        <Box sx={{ pt: { xs: 2, md: 3 }, pb: 2 }}>
          <Typography variant="overline" sx={{ color: 'primary.main', mb: 1, display: 'block' }}>
            Fixture Details
          </Typography>
        </Box>
      </FadeIn>

      <FadeIn delay={0.05}>
        <Card sx={{ mb: 3 }}>
          <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              justifyContent="space-between"
              alignItems={{ xs: 'flex-start', sm: 'center' }}
              spacing={2}
            >
              <Box>
                <Typography variant="h4" gutterBottom>
                  {fixture.HomeTeam} vs {fixture.AwayTeam}
                </Typography>
                <Typography variant="body2">
                  {fixture.Date}
                </Typography>
              </Box>
              <Box
                sx={{
                  px: 3,
                  py: 1.5,
                  borderRadius: '12px',
                  bgcolor: 'rgba(108, 99, 255, 0.08)',
                  border: '1px solid rgba(108, 99, 255, 0.2)',
                }}
              >
                <Typography variant="h3" sx={{ color: 'primary.main', textAlign: 'center' }}>
                  {fixture.HomeScore} - {fixture.AwayScore}
                </Typography>
              </Box>
            </Stack>

            <Divider sx={{ my: 2.5 }} />

            <Stack direction="row" spacing={2} alignItems="center" mb={2.5}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                Man of the Match
              </Typography>
              <Chip
                label={fixture.ManOfTheMatchName || 'N/A'}
                color="warning"
                size="small"
                clickable={!!fixture.ManOfTheMatch}
                onClick={() => fixture.ManOfTheMatch && navigate(`/player/${fixture.ManOfTheMatch}`)}
              />
            </Stack>

            <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
              <Button variant="outlined" size="small" startIcon={<AddCircleOutlineIcon />} onClick={handleAddGoal}>
                Add Goalscorer
              </Button>
              <AddGoalscorerDialogue
                open={addGoalOpen}
                onClose={handleAddGoalClose}
                fixtureId={id || ''}
                onSuccess={handleAddGoalClose}
              />
              <Button variant="outlined" size="small" startIcon={<AddCircleOutlineIcon />} onClick={handleAddAssist}>
                Add Assist
              </Button>
              <AddAssistDialogue
                open={addAssistOpen}
                onClose={handleAddAssistClose}
                fixtureId={id || ''}
                onSuccess={handleAddAssistClose}
              />
              <Button variant="contained" size="small" startIcon={<EditIcon />} onClick={handleEdit}>
                Edit Fixture
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </FadeIn>

      <FadeIn delay={0.1}>
        <Card sx={{ mb: 3 }}>
          <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
            <Typography variant="overline" sx={{ color: 'primary.main', mb: 2, display: 'block' }}>
              Location
            </Typography>
            <FixtureDetailMap fixture={fixture} />
          </CardContent>
        </Card>
      </FadeIn>

      <FadeIn delay={0.15}>
        <Grid container spacing={2.5}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                <Typography variant="overline" sx={{ color: 'text.secondary', mb: 1.5, display: 'block' }}>
                  Lineup
                </Typography>
                <Typography variant="body2">Lineup data not available.</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                <Typography variant="overline" sx={{ color: '#4ade80', mb: 1.5, display: 'block' }}>
                  Goal Scorers
                </Typography>
                {fixture.GoalScorersNames && fixture.GoalScorersNames.length > 0 ? (
                  <Stack spacing={1} direction="row" flexWrap="wrap" useFlexGap>
                    {fixture.GoalScorersNames.map((name: string, idx: number) => (
                      <Chip
                        key={idx}
                        label={name}
                        color="success"
                        size="small"
                        clickable={!!(fixture.GoalScorers && fixture.GoalScorers[idx])}
                        onClick={() => fixture.GoalScorers?.[idx] && navigate(`/player/${fixture.GoalScorers[idx]}`)}
                      />
                    ))}
                  </Stack>
                ) : (
                  <Typography variant="body2">No goals</Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                <Typography variant="overline" sx={{ color: '#60a5fa', mb: 1.5, display: 'block' }}>
                  Assist Providers
                </Typography>
                {fixture.AssistScorersNames && fixture.AssistScorersNames.length > 0 ? (
                  <Stack spacing={1} direction="row" flexWrap="wrap" useFlexGap>
                    {fixture.AssistScorersNames.map((name: string, idx: number) => (
                      <Chip
                        key={idx}
                        label={name}
                        color="info"
                        size="small"
                        clickable={!!(fixture.AssistScorers && fixture.AssistScorers[idx])}
                        onClick={() => fixture.AssistScorers?.[idx] && navigate(`/player/${fixture.AssistScorers[idx]}`)}
                      />
                    ))}
                  </Stack>
                ) : (
                  <Typography variant="body2">No assists</Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </FadeIn>
    </Box>
  );
}
