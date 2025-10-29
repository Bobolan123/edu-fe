'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  CircularProgress,
} from '@mui/material';
import { useTranslations } from 'next-intl';
import { createSupportTicket } from '@/actions/supportTicketActions';
import { toast } from 'react-toastify';

interface CreateTicketModalProps {
  open: boolean;
  onClose: () => void;
  courseId: number;
  courseTitle: string;
  onTicketCreated?: (ticketId: string) => void;
}

export default function CreateTicketModal({
  open,
  onClose,
  courseId,
  courseTitle,
  onTicketCreated,
}: CreateTicketModalProps) {
  const t = useTranslations('support');
  const [subject, setSubject] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!subject.trim()) {
      setError(t('subjectRequired'));
      return;
    }

    if (subject.trim().length < 5) {
      setError(t('subjectTooShort'));
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await createSupportTicket({
        subject: subject.trim(),
        courseId,
      });

      if ('data' in response && response.data) {
        toast.success(t('ticketCreated'));
        setSubject('');
        onClose();

        // Call callback with new ticket ID
        if (onTicketCreated && response.data.id) {
          onTicketCreated(response.data.id);
        }
      } else {
        const errorMsg = 'message' in response ? response.message : t('failedToCreateTicket');
        setError(errorMsg);
        toast.error(errorMsg);
      }
    } catch (err) {
      console.error('[CreateTicketModal] Error:', err);
      const errorMsg = err instanceof Error ? err.message : t('failedToCreateTicket');
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setSubject('');
      setError('');
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t('createTicket')}</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {t('askInstructorAbout')}: <strong>{courseTitle}</strong>
          </Typography>

          <TextField
            autoFocus
            fullWidth
            label={t('ticketSubject')}
            placeholder={t('subjectPlaceholder')}
            value={subject}
            onChange={(e) => {
              setSubject(e.target.value);
              setError('');
            }}
            error={!!error}
            helperText={error || t('subjectHelperText')}
            disabled={isSubmitting}
            multiline
            rows={3}
            inputProps={{ maxLength: 200 }}
          />

          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            {subject.length}/200 {t('characters')}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={isSubmitting}>
          {t('cancel')}
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isSubmitting || !subject.trim()}
          startIcon={isSubmitting ? <CircularProgress size={16} /> : null}
        >
          {isSubmitting ? t('creating') : t('create')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
