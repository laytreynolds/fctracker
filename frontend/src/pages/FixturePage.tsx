import { Box } from '@mui/material';
import FixtureTable from '@/components/FixtureTable';
import FadeIn from '@/components/FadeIn';

export default function FixturePage() {
  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, maxWidth: 1100, mx: 'auto' }}>
      <FadeIn>
        <FixtureTable />
      </FadeIn>
    </Box>
  );
}
