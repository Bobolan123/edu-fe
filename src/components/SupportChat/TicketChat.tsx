'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  Avatar,
  Stack,
  Chip,
  CircularProgress,
  Button,
} from '@mui/material';
import { Send, CheckCircle, WifiOff, Wifi } from '@mui/icons-material';
import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';
import { useSupportChat } from '@/hooks/useSupportChat';
import TicketStatusBadge from './TicketStatusBadge';
import { updateTicketStatus } from '@/actions/supportTicketActions';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { ISupportTicket } from '../../../types/entities';

interface TicketChatProps {
  ticket: ISupportTicket;
  userRole: 'student' | 'teacher';
  onTicketUpdated?: () => void;
}

export default function TicketChat({ ticket, userRole, onTicketUpdated }: TicketChatProps) {
  const t = useTranslations('support');
  const { data: session } = useSession();
  const [input, setInput] = useState('');
  const [isResolving, setIsResolving] = useState(false);
  const [currentTicketStatus, setCurrentTicketStatus] = useState(ticket.status);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Update local status when ticket prop changes
  useEffect(() => {
    setCurrentTicketStatus(ticket.status);
  }, [ticket.status]);

  // Handle ticket updates (including status changes)
  const handleTicketStatusUpdate = useCallback((update: any) => {
    console.log('[TicketChat] Ticket status update received:', update);

    if (update?.status) {
      setCurrentTicketStatus(update.status);
    }

    // Also call parent callback to refresh ticket list
    onTicketUpdated?.();
  }, [onTicketUpdated]);

  const {
    messages,
    isLoading,
    isSending,
    isConnected,
    isTyping,
    sendMessage,
    handleTyping,
  } = useSupportChat({
    ticketId: ticket.id,
    userRole,
    onTicketUpdated: handleTicketStatusUpdate,
  });

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isSending) return;

    await sendMessage(input);
    setInput('');
    handleTyping(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    handleTyping(e.target.value.length > 0);
  };

  const handleResolveTicket = async () => {
    setIsResolving(true);
    try {
      const response = await updateTicketStatus({
        ticketId: ticket.id,
        status: 'resolved',
      });

      if ('data' in response && response.data) {
        toast.success(t('ticketResolved'));
        onTicketUpdated?.();
      } else {
        toast.error(t('failedToResolve'));
      }
    } catch (error) {
      console.error('[TicketChat] Failed to resolve ticket:', error);
      const errorMsg = error instanceof Error ? error.message : t('failedToResolve');
      toast.error(errorMsg);
    } finally {
      setIsResolving(false);
    }
  };

  const otherUser = userRole === 'teacher' ? ticket.student : ticket.teacher;

  return (
    <Paper elevation={2} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box
        sx={{
          p: 2,
          borderBottom: 1,
          borderColor: 'divider',
          bgcolor: 'background.default',
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar src={otherUser?.avatar_url || undefined} alt={otherUser?.name}>
            {otherUser?.name?.charAt(0).toUpperCase()}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" fontWeight="bold">
              {otherUser?.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" noWrap>
              {ticket.subject} • {ticket.course.title}
            </Typography>
          </Box>
          <Stack direction="row" spacing={1} alignItems="center">
            <TicketStatusBadge status={currentTicketStatus} />
            {isConnected ? (
              <Chip icon={<Wifi />} label={t('online')} size="small" color="success" variant="outlined" />
            ) : (
              <Chip icon={<WifiOff />} label={t('offline')} size="small" color="default" variant="outlined" />
            )}
          </Stack>
        </Stack>

        {/* Resolve Button (Teacher only) */}
        {userRole === 'teacher' && currentTicketStatus !== 'resolved' && (
          <Box sx={{ mt: 2 }}>
            <Button
              variant="outlined"
              color="success"
              size="small"
              startIcon={<CheckCircle />}
              onClick={handleResolveTicket}
              disabled={isResolving}
            >
              {isResolving ? t('resolving') : t('markAsResolved')}
            </Button>
          </Box>
        )}
      </Box>

      {/* Messages Area */}
      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          p: 2,
          bgcolor: 'grey.50',
        }}
      >
        {isLoading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="100%">
            <CircularProgress />
          </Box>
        ) : messages.length === 0 ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="100%">
            <Typography color="text.secondary">{t('noMessages')}</Typography>
          </Box>
        ) : (
          <Stack spacing={2}>
            {messages.map((message) => {
              const isOwnMessage = message.senderId === parseInt(session?.user?.id || '0');
              const isTeacher = message.senderRole === 'teacher';

              return (
                <Box
                  key={message._id}
                  sx={{
                    display: 'flex',
                    justifyContent: isOwnMessage ? 'flex-end' : 'flex-start',
                  }}
                >
                  <Stack
                    direction={isOwnMessage ? 'row-reverse' : 'row'}
                    spacing={1}
                    sx={{ maxWidth: '70%' }}
                  >
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        bgcolor: isTeacher ? 'primary.main' : 'secondary.main',
                      }}
                    >
                      {isTeacher ? 'T' : 'S'}
                    </Avatar>
                    <Box>
                      <Paper
                        elevation={1}
                        sx={{
                          p: 1.5,
                          bgcolor: isOwnMessage ? 'primary.main' : 'white',
                          color: isOwnMessage ? 'white' : 'text.primary',
                          borderRadius: 2,
                        }}
                      >
                        <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                          {message.message}
                        </Typography>
                      </Paper>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                          display: 'block',
                          mt: 0.5,
                          textAlign: isOwnMessage ? 'right' : 'left',
                        }}
                      >
                        {format(new Date(message.createdAt), 'MMM d, h:mm a')}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>
              );
            })}

            {/* Typing Indicator */}
            {isTyping && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar sx={{ width: 32, height: 32 }}>
                  {otherUser?.name?.charAt(0).toUpperCase()}
                </Avatar>
                <Typography variant="body2" color="text.secondary" fontStyle="italic">
                  {t('typing')}
                </Typography>
              </Box>
            )}

            <div ref={messagesEndRef} />
          </Stack>
        )}
      </Box>

      {/* Input Area */}
      {currentTicketStatus !== 'resolved' && (
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            p: 2,
            borderTop: 1,
            borderColor: 'divider',
            bgcolor: 'background.paper',
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <TextField
              fullWidth
              size="small"
              placeholder={t('typeMessage')}
              value={input}
              onChange={handleInputChange}
              disabled={isSending || isLoading}
              inputRef={inputRef}
              multiline
              maxRows={4}
            />
            <IconButton
              type="submit"
              color="primary"
              disabled={!input.trim() || isSending}
              sx={{
                bgcolor: 'primary.main',
                color: 'white',
                '&:hover': { bgcolor: 'primary.dark' },
                '&:disabled': { bgcolor: 'action.disabledBackground' },
              }}
            >
              {isSending ? <CircularProgress size={24} /> : <Send />}
            </IconButton>
          </Stack>
        </Box>
      )}

      {currentTicketStatus === 'resolved' && (
        <Box
          sx={{
            p: 2,
            borderTop: 1,
            borderColor: 'divider',
            bgcolor: 'success.50',
            textAlign: 'center',
          }}
        >
          <Typography variant="body2" color="success.main" fontWeight="medium">
            {t('ticketResolvedMessage')}
          </Typography>
        </Box>
      )}
    </Paper>
  );
}
