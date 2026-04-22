import { Box, Container, Paper } from '@mui/material';
import { THEME_COLORS } from '@/constants/styles/theme';
import TeamInfoStepSkeleton from '@/components/lol/teamRegistration/UI/TeamInfoStepSkeleton';

export default function TeamRegistrationLoadingScreen() {
    return (
        <Box
        sx={{
          width: '100%',
          minHeight: '100vh',
          backgroundColor: THEME_COLORS.bg,
          py: { xs: 3, md: 4 },
          pt: { xs: '0vh', md: '13vh' },
        }}
      >
        <Container maxWidth="md">
          <Paper
            elevation={0}
            sx={{
              backgroundColor: THEME_COLORS.surface,
              borderRadius: 3,
              border: `1px solid ${THEME_COLORS.border}`,
              p: { xs: 0, md: 1 },
              overflow: 'hidden',
            }}
          >
            <Box sx={{ p: { xs: 2, md: 4 } }}>
              {/*<StepIndicator steps={STEPS} activeStep={0} />*/}
              <Box sx={{ mb: 4, minHeight: 400 }}>
                <TeamInfoStepSkeleton />
              </Box>
            </Box>
          </Paper>
        </Container>
      </Box>
    );
}