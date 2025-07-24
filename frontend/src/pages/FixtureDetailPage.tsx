import React from 'react';
import { useParams } from 'react-router-dom';
import {
  Box, Card, CardContent, Typography, Stack, Button, Chip, Divider, CircularProgress, Grid
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AddGoalscorerDialogue from '@/components/AddGoalScorerDialogue';

// Define a minimal Fixture type for now
interface Fixture {
  HomeTeam: string;
  AwayTeam: string;
  Date: string;
  HomeScore: number | string;
  AwayScore: number | string;
  ManOfTheMatchName?: string;
  Lineup?: string[];
  LineupNames?: string[];
  GoalScorersNames?: string[];
  AssistScorersNames?: string[];
}

export default function FixtureDetailPage() {
  const { id } = useParams();
  const [fixture, setFixture] = React.useState<Fixture | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [addGoalOpen, setAddGoalOpen] = React.useState(false);
  const [refreshCount, setRefreshCount] = React.useState(0);

  React.useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:8080/api/fixture/${id}`)
      .then(res => res.json())
      .then(data => {
        setFixture(data.fixture || data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load fixture');
        setLoading(false);
      });
  }, [id, refreshCount]);

  const handleEdit = () => {
    alert('Edit Fixture (not implemented)');
  };
  const handleAddGoal = () => setAddGoalOpen(true);
  const handleAddGoalClose = () => {
    setAddGoalOpen(false);
    setRefreshCount((c) => c + 1);
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
                {fixture.Date}
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
      <Grid container spacing={2}>
      <Grid item size={4}>
      <Card sx={{ borderRadius: 4 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>Lineup</Typography>
              {fixture.Lineup && fixture.Lineup.length > 0 ? (
                <Stack spacing={1}>
                  {fixture.LineupNames?.map((name: string, idx: number) => (
                    <Chip key={idx} label={name} variant="outlined" />
                  ))}
                </Stack>
              ) : (
                <Typography color="text.secondary">No lineup data</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item size={4}>
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
        <Grid item size={4}>
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