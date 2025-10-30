'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  Badge,
  CircularProgress,
  Paper,
  Avatar,
  Stack,
  Tabs,
  Tab,
} from '@mui/material';
import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';
import { getMySupportTickets } from '@/actions/supportTicketActions';
import TicketStatusBadge from './TicketStatusBadge';
import { formatDistanceToNow } from 'date-fns';
import { ISupportTicket } from '../../../types/entities';
import { supportSocket } from '@/services/supportSocket';

interface TicketListProps {
  onTicketSelect: (ticket: ISupportTicket) => void;
  selectedTicketId?: string;
  userRole: 'student' | 'teacher';
  onTicketsLoaded?: (tickets: ISupportTicket[]) => void;
  onStatusUpdate?: (ticketId: string, status: ISupportTicket['status']) => void;
}

export default function TicketList({ onTicketSelect, selectedTicketId, userRole, onTicketsLoaded, onStatusUpdate }: TicketListProps) {
  const t = useTranslations('support');
  const { data: session } = useSession();
  const [tickets, setTickets] = useState<ISupportTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  const loadTickets = async (status?: string) => {
    setIsLoading(true);
    try {
      // For teachers viewing "active" tickets, we need to fetch all and filter client-side
      // because "active" should include both "open" and "waiting_teacher" statuses
      const shouldFetchAll = userRole === 'teacher' && (status === 'waiting_teacher');
      const fetchStatus = shouldFetchAll ? undefined : (status === 'all' ? undefined : status);

      const response = await getMySupportTickets(fetchStatus);
      console.log('[TicketList] API Response:', response);

      if ('data' in response && response.data) {
        console.log('[TicketList] Loaded tickets:', response.data);

        // Client-side filter for teacher's active tickets
        let filteredTickets = response.data;
        if (shouldFetchAll) {
          filteredTickets = response.data.filter(
            ticket => ticket.status === 'open' || ticket.status === 'waiting_teacher'
          );
          console.log('[TicketList] Filtered active tickets for teacher:', filteredTickets);
        }

        // Filter out resolved tickets from "all" tab
        if (status === 'all') {
          filteredTickets = filteredTickets.filter(ticket => ticket.status !== 'resolved');
          console.log('[TicketList] Filtered out resolved tickets from all tab:', filteredTickets);
        }

        setTickets(filteredTickets);
        // Notify parent of loaded tickets
        onTicketsLoaded?.(filteredTickets);
      } else {
        console.warn('[TicketList] No data in response:', response);
        setTickets([]);
        onTicketsLoaded?.([]);
      }
    } catch (error) {
      console.error('[TicketList] Failed to load tickets:', error);
      setTickets([]);
      onTicketsLoaded?.([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTickets(filter);
  }, [filter]);

  // Setup WebSocket connection for real-time status updates
  useEffect(() => {
    if (!session?.user?.id || !session?.user?.access_token) {
      return;
    }

    console.log('[TicketList] Setting up WebSocket for real-time updates');

    // Connect to socket
    const socket = supportSocket.connect(parseInt(session.user.id), session.user.access_token);

    const handleConnect = () => {
      console.log('[TicketList] Socket connected');
    };

    const handleDisconnect = () => {
      console.log('[TicketList] Socket disconnected');
    };

    // Listen for ticket status updates
    const handleTicketUpdated = (data: { ticketId: string; update: any }) => {
      console.log('[TicketList] Ticket updated event received:', data);

      if (data.update?.status) {
        // Update the ticket status in the local list
        setTickets((prevTickets) => {
          return prevTickets.map((ticket) => {
            if (ticket.id === data.ticketId) {
              console.log('[TicketList] Updating ticket status:', {
                ticketId: ticket.id,
                oldStatus: ticket.status,
                newStatus: data.update.status,
              });
              return {
                ...ticket,
                status: data.update.status,
                updatedAt: new Date(),
              };
            }
            return ticket;
          });
        });

        // Notify parent component about the status change
        if (onStatusUpdate) {
          onStatusUpdate(data.ticketId, data.update.status);
        }
      }
    };

    // Listen for new messages (which may imply status changes)
    const handleNewMessage = (data: { message: any }) => {
      console.log('[TicketList] New message received for ticket:', data.message.ticketId);

      // Infer status change from message sender
      const inferredStatus = data.message.senderRole === 'student' ? 'waiting_teacher' : 'waiting_student';

      // Update ticket status in the list
      setTickets((prevTickets) => {
        return prevTickets.map((ticket) => {
          if (ticket.id === data.message.ticketId) {
            console.log('[TicketList] Updating ticket status from message:', {
              ticketId: ticket.id,
              oldStatus: ticket.status,
              newStatus: inferredStatus,
            });
            return {
              ...ticket,
              status: inferredStatus,
              updatedAt: new Date(),
            };
          }
          return ticket;
        });
      });

      // Notify parent component about the status change
      if (onStatusUpdate) {
        onStatusUpdate(data.message.ticketId, inferredStatus);
      }
    };

    // Register event listeners
    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('ticketUpdated', handleTicketUpdated);
    socket.on('newMessage', handleNewMessage);

    // If already connected, log it
    if (socket.connected) {
      handleConnect();
    }

    // Cleanup
    return () => {
      console.log('[TicketList] Cleaning up WebSocket listeners');
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('ticketUpdated', handleTicketUpdated);
      socket.off('newMessage', handleNewMessage);
    };
  }, [session, onStatusUpdate]);

  const handleFilterChange = (_event: React.SyntheticEvent, newValue: string) => {
    setFilter(newValue);
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100%">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper elevation={2} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6" fontWeight="bold">
          {userRole === 'teacher' ? t('teacherInbox') : t('myTickets')}
        </Typography>
      </Box>

      {/* Filter Tabs */}
      <Tabs
        value={filter}
        onChange={handleFilterChange}
        variant="fullWidth"
        sx={{ borderBottom: 1, borderColor: 'divider' }}
      >
        <Tab label={t('filters.all')} value="all" />
        {userRole === 'teacher' && (
          <Tab
            label={t('filters.active')}
            value="waiting_teacher"
          />
        )}
        <Tab label={t('filters.resolved')} value="resolved" />
      </Tabs>

      {/* Ticket List */}
      <List sx={{ flex: 1, overflow: 'auto' }}>
        {tickets.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {t('noTickets')}
            </Typography>
            {userRole === 'teacher' && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Students haven't created any tickets yet. They can create tickets from their course learning page.
              </Typography>
            )}
          </Box>
        ) : (
          tickets.map((ticket) => {
            const otherUser = userRole === 'teacher' ? ticket.student : ticket.teacher;
            const hasUnread = (ticket.unreadCount || 0) > 0;

            return (
              <ListItem
                key={ticket.id}
                disablePadding
                sx={{
                  borderBottom: 1,
                  borderColor: 'divider',
                  bgcolor: selectedTicketId === ticket.id ? 'action.selected' : 'transparent',
                }}
              >
                <ListItemButton onClick={() => onTicketSelect(ticket)}>
                  <Stack direction="row" spacing={2} sx={{ width: '100%' }} alignItems="flex-start">
                    {/* Avatar */}
                    <Badge
                      color="error"
                      variant="dot"
                      invisible={!hasUnread}
                      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                    >
                      <Avatar
                        src={otherUser?.avatar_url || undefined}
                        alt={otherUser?.name}
                        sx={{ width: 40, height: 40 }}
                      >
                        {otherUser?.name?.charAt(0).toUpperCase()}
                      </Avatar>
                    </Badge>

                    {/* Content */}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                        <Typography
                          variant="subtitle2"
                          fontWeight={hasUnread ? 'bold' : 'medium'}
                          noWrap
                          sx={{ flex: 1 }}
                        >
                          {otherUser?.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                          {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}
                        </Typography>
                      </Stack>

                      <Typography
                        variant="body2"
                        color="text.primary"
                        fontWeight={hasUnread ? 600 : 400}
                        noWrap
                        sx={{ mb: 0.5 }}
                      >
                        {ticket.subject}
                      </Typography>

                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="caption" color="text.secondary" noWrap sx={{ flex: 1 }}>
                          {ticket.course.title}
                        </Typography>
                        <TicketStatusBadge status={ticket.status} />
                      </Stack>

                      {hasUnread && (
                        <Badge
                          badgeContent={ticket.unreadCount}
                          color="error"
                          sx={{ position: 'absolute', right: 16, bottom: 16 }}
                        />
                      )}
                    </Box>
                  </Stack>
                </ListItemButton>
              </ListItem>
            );
          })
        )}
      </List>
    </Paper>
  );
}
