import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from '@mui/material';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import FadeIn from '@/components/FadeIn';
import { buildApiUrl } from '@/config/api';
import type { TPlayer, TFixture } from '@/types/types';

function StatCard({ label, value, icon, color }: { label: string; value: string | number; icon: React.ReactNode; color: string }) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1.5 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: `${color}15`,
            }}
          >
            {icon}
          </Box>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
            {label}
          </Typography>
        </Stack>
        <Typography variant="h3" sx={{ color }}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
}

function getContributions(fixture: TFixture, playerName: string): string[] {
  const contributions: string[] = [];
  if (fixture.GoalScorersNames?.includes(playerName)) {
    const count = fixture.GoalScorersNames.filter((n) => n === playerName).length;
    contributions.push(count > 1 ? `${count} Goals` : 'Goal');
  }
  if (fixture.AssistScorersNames?.includes(playerName)) {
    const count = fixture.AssistScorersNames.filter((n) => n === playerName).length;
    contributions.push(count > 1 ? `${count} Assists` : 'Assist');
  }
  if (fixture.ManOfTheMatchName === playerName) {
    contributions.push('MOTM');
  }
  return contributions;
}

export default function PlayerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [player, setPlayer] = useState<TPlayer | null>(null);
  const [fixtures, setFixtures] = useState<TFixture[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);

    Promise.all([
      fetch(buildApiUrl(`/api/player/${id}`)).then((res) => {
        if (!res.ok) throw new Error('Player not found');
        return res.json();
      }),
      fetch(buildApiUrl(`/api/player/${id}/fixtures`)).then((res) => {
        if (!res.ok) throw new Error('Failed to load fixtures');
        return res.json();
      }),
    ])
      .then(([playerData, fixturesData]) => {
        setPlayer(playerData.player);
        setFixtures(fixturesData.fixtures || []);
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load player'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress size={32} />
      </Box>
    );
  }
  if (error || !player) {
    return (
      <Typography color="error" sx={{ mt: 8, textAlign: 'center' }}>
        {error || 'Player not found'}
      </Typography>
    );
  }

  const goalsPerGame = player.GamesPlayed > 0 ? (player.Goals / player.GamesPlayed).toFixed(2) : '0.00';
  const assistsPerGame = player.GamesPlayed > 0 ? (player.Assists / player.GamesPlayed).toFixed(2) : '0.00';

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, maxWidth: 1100, mx: 'auto' }}>
      <FadeIn>
        <Box sx={{ pt: { xs: 2, md: 3 }, pb: 2 }}>
          <Typography variant="overline" sx={{ color: 'primary.main', mb: 1, display: 'block' }}>
            Player Profile
          </Typography>
        </Box>
      </FadeIn>

      {/* Header Card */}
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
                <Typography variant="h3" gutterBottom>
                  {player.Name}
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  <Chip label={player.Position} color="primary" size="small" />
                  {player.TeamName && <Chip label={player.TeamName} variant="outlined" size="small" />}
                  <Chip label={`Age ${player.Age}`} variant="outlined" size="small" />
                </Stack>
              </Box>
              <Box
                sx={{
                  px: 3,
                  py: 1.5,
                  borderRadius: '12px',
                  bgcolor: 'rgba(108, 99, 255, 0.08)',
                  border: '1px solid rgba(108, 99, 255, 0.2)',
                  textAlign: 'center',
                }}
              >
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                  Games Played
                </Typography>
                <Typography variant="h3" sx={{ color: 'primary.main' }}>
                  {player.GamesPlayed}
                </Typography>
              </Box>
            </Stack>

            {player.FunFact && (
              <>
                <Divider sx={{ my: 2.5 }} />
                <Box
                  sx={{
                    px: 2.5,
                    py: 1.5,
                    borderRadius: '10px',
                    bgcolor: 'rgba(108, 99, 255, 0.04)',
                    border: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
                    "{player.FunFact}"
                  </Typography>
                </Box>
              </>
            )}
          </CardContent>
        </Card>
      </FadeIn>

      {/* Stats Grid */}
      <FadeIn delay={0.1}>
        <Grid container spacing={2.5} sx={{ mb: 3 }}>
          <Grid size={{ xs: 6, md: 3 }}>
            <StatCard
              label="Goals"
              value={player.Goals}
              icon={<SportsSoccerIcon sx={{ color: '#4ade80' }} />}
              color="#4ade80"
            />
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <StatCard
              label="Assists"
              value={player.Assists}
              icon={<TrackChangesIcon sx={{ color: '#60a5fa' }} />}
              color="#60a5fa"
            />
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <StatCard
              label="MOTM"
              value={player.ManOfTheMatch}
              icon={<EmojiEventsIcon sx={{ color: '#fb923c' }} />}
              color="#fb923c"
            />
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <StatCard
              label="Goals / Game"
              value={goalsPerGame}
              icon={<CalendarTodayIcon sx={{ color: '#a78bfa' }} />}
              color="#a78bfa"
            />
          </Grid>
        </Grid>
      </FadeIn>

      {/* Per-game averages */}
      <FadeIn delay={0.15}>
        <Card sx={{ mb: 3 }}>
          <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
            <Typography variant="overline" sx={{ color: 'primary.main', mb: 2, display: 'block' }}>
              Per Game Averages
            </Typography>
            <Stack direction="row" spacing={4}>
              <Box>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>Goals / Game</Typography>
                <Typography variant="h5" sx={{ color: '#4ade80' }}>{goalsPerGame}</Typography>
              </Box>
              <Box>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>Assists / Game</Typography>
                <Typography variant="h5" sx={{ color: '#60a5fa' }}>{assistsPerGame}</Typography>
              </Box>
              <Box>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>MOTM Rate</Typography>
                <Typography variant="h5" sx={{ color: '#fb923c' }}>
                  {player.GamesPlayed > 0 ? `${Math.round((player.ManOfTheMatch / player.GamesPlayed) * 100)}%` : '0%'}
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </FadeIn>

      {/* Match History */}
      <FadeIn delay={0.2}>
        <Box>
          <Typography variant="overline" sx={{ color: 'primary.main', mb: 1, display: 'block' }}>
            History
          </Typography>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Match History
          </Typography>
          {fixtures.length === 0 ? (
            <Card>
              <CardContent>
                <Typography variant="body2" sx={{ textAlign: 'center', color: 'text.secondary' }}>
                  No match history found.
                </Typography>
              </CardContent>
            </Card>
          ) : (
            <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 4 }}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Match</TableCell>
                      <TableCell>Score</TableCell>
                      <TableCell>Contributions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {fixtures.map((fixture) => {
                      const contributions = getContributions(fixture, player.Name);
                      return (
                        <TableRow
                          key={fixture.ID}
                          hover
                          sx={{ cursor: 'pointer' }}
                          onClick={() => navigate(`/fixture/${fixture.ID}`)}
                        >
                          <TableCell>{fixture.Date}</TableCell>
                          <TableCell>
                            {fixture.HomeTeam} vs {fixture.AwayTeam}
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {fixture.HomeScore} - {fixture.AwayScore}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                              {contributions.length > 0 ? (
                                contributions.map((c, i) => (
                                  <Chip
                                    key={i}
                                    label={c}
                                    size="small"
                                    color={
                                      c.includes('Goal') ? 'success' : c.includes('Assist') ? 'info' : 'warning'
                                    }
                                  />
                                ))
                              ) : (
                                <Chip label="Appeared" size="small" variant="outlined" />
                              )}
                            </Stack>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          )}
        </Box>
      </FadeIn>
    </Box>
  );
}
