'use client';

import { useState } from 'react';
import { Box } from '@mui/material';
import TicketList from './TicketList';
import TicketChat from './TicketChat';
import { ISupportTicket } from '../../../types/entities';
import { useTranslations } from 'next-intl';

/**
 * Teacher-side support inbox component
 * Used in the dedicated /support-inbox page
 * Teachers can view and reply to ALL student tickets across ALL their courses
 */
export default function TeacherSupportInbox() {
  const t = useTranslations('support');
  const [selectedTicket, setSelectedTicket] = useState<ISupportTicket | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleTicketSelect = (ticket: ISupportTicket) => {
    setSelectedTicket(ticket);
  };

  const handleTicketUpdated = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const handleTicketsLoaded = (tickets: ISupportTicket[]) => {
    // Update selected ticket with fresh data from the list
    if (selectedTicket) {
      const updatedTicket = tickets.find(t => t.id === selectedTicket.id);
      if (updatedTicket) {
        // Only update if status actually changed to avoid unnecessary re-renders
        if (updatedTicket.status !== selectedTicket.status ||
            updatedTicket.updatedAt !== selectedTicket.updatedAt) {
          setSelectedTicket(updatedTicket);
        }
      }
    }
  };

  const handleStatusUpdate = (ticketId: string, status: ISupportTicket['status']) => {
    console.log('[TeacherSupportInbox] Status update from TicketList:', { ticketId, status });

    // Update selected ticket status if it matches
    if (selectedTicket && selectedTicket.id === ticketId) {
      setSelectedTicket({
        ...selectedTicket,
        status: status,
        updatedAt: new Date(),
      });
    }
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', gap: 2 }}>
      {/* Ticket List - All tickets for this teacher */}
      <Box sx={{ width: '35%' }}>
        <TicketList
          key={refreshKey}
          onTicketSelect={handleTicketSelect}
          selectedTicketId={selectedTicket?.id}
          userRole="teacher"
          onTicketsLoaded={handleTicketsLoaded}
          onStatusUpdate={handleStatusUpdate}
        />
      </Box>

      {/* Chat Area */}
      <Box sx={{ flex: 1 }}>
        {selectedTicket ? (
          <TicketChat
            key={selectedTicket.id}
            ticket={selectedTicket}
            userRole="teacher"
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
  );
}
