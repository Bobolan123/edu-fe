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
import { getMySupportTickets } from '@/actions/supportTicketActions';
import TicketStatusBadge from './TicketStatusBadge';
import { formatDistanceToNow } from 'date-fns';
import { ISupportTicket } from '../../../types/entities';

interface TicketListProps {
  onTicketSelect: (ticket: ISupportTicket) => void;
  selectedTicketId?: string;
  userRole: 'student' | 'teacher';
}

export default function TicketList({ onTicketSelect, selectedTicketId, userRole }: TicketListProps) {
  const t = useTranslations('support');
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
      } else {
        console.warn('[TicketList] No data in response:', response);
        setTickets([]);
      }
    } catch (error) {
      console.error('[TicketList] Failed to load tickets:', error);
      setTickets([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTickets(filter);
  }, [filter]);

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
