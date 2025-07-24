import {
  Box,
} from '@mui/material';
import FixtureTable from '@/components/FixtureTable';

export default function FixturePage() {

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 }, maxWidth: 1000, mx: 'auto' }}>
        <FixtureTable />
    </Box>
  );
} 