'use client';

import { useState } from 'react';
import { Box } from '@mui/material';
import TicketList from './TicketList';
import TicketChat from './TicketChat';
import CreateTicketModal from './CreateTicketModal';
import { ISupportTicket } from '../../../types/entities';
import { Button } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useTranslations } from 'next-intl';

interface StudentSupportChatProps {
  courseId: number;
  courseTitle: string;
}

/**
 * Student-side support chat component
 * Used within the course learning page
 * Students can create tickets and chat with their instructor for this specific course
 */
export default function StudentSupportChat({
  courseId,
  courseTitle,
}: StudentSupportChatProps) {
  const t = useTranslations('support');
  const [selectedTicket, setSelectedTicket] = useState<ISupportTicket | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleTicketSelect = (ticket: ISupportTicket) => {
    setSelectedTicket(ticket);
  };

  const handleTicketCreated = () => {
    setRefreshKey((prev) => prev + 1);
    setIsCreateModalOpen(false);
  };

  const handleTicketUpdated = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Create Ticket Button */}
      <Box sx={{ mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setIsCreateModalOpen(true)}
          fullWidth
        >
          {t('createTicket')}
        </Button>
      </Box>

      {/* Chat Interface */}
      <Box sx={{ flex: 1, display: 'flex', gap: 2, minHeight: 0 }}>
        {/* Ticket List - Student's tickets for this course */}
        <Box sx={{ width: '35%', minHeight: 0 }}>
          <TicketList
            key={refreshKey}
            onTicketSelect={handleTicketSelect}
            selectedTicketId={selectedTicket?.id}
            userRole="student"
          />
        </Box>

        {/* Chat Area */}
        <Box sx={{ flex: 1, minHeight: 0 }}>
          {selectedTicket ? (
            <TicketChat
              ticket={selectedTicket}
              userRole="student"
              onTicketUpdated={handleTicketUpdated}
            />
          ) : (
            <Box
              sx={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'background.paper',
                borderRadius: 1,
                border: 1,
                borderColor: 'divider',
              }}
            >
              <Box sx={{ textAlign: 'center', color: 'text.secondary' }}>
                {t('noTickets')}
              </Box>
            </Box>
          )}
        </Box>
      </Box>

      {/* Create Ticket Modal */}
      <CreateTicketModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        courseId={courseId}
        courseTitle={courseTitle}
        onTicketCreated={handleTicketCreated}
      />
    </Box>
  );
}
