'use client';

import { Box, Container, Typography, Paper } from '@mui/material';
import { useTranslations } from 'next-intl';
import TeacherSupportInbox from './TeacherSupportInbox';


export default function SupportInboxPage() {
  const t = useTranslations('support');

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pt: 12, pb: 4 }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Paper elevation={0} sx={{ mb: 3, p: 3, borderRadius: 2 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            {t('teacherInbox')}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Respond to student questions
          </Typography>
        </Paper>

        {/* Teacher Support Inbox */}
        <Box sx={{ height: 'calc(100vh - 280px)', minHeight: '600px' }}>
          <TeacherSupportInbox />
        </Box>
      </Container>
    </Box>
  );
}
