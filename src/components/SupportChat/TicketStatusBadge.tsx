'use client';

import { Chip } from '@mui/material';
import { useTranslations } from 'next-intl';

interface TicketStatusBadgeProps {
  status: 'open' | 'waiting_teacher' | 'waiting_student' | 'resolved';
}

export default function TicketStatusBadge({ status }: TicketStatusBadgeProps) {
  const t = useTranslations('support');

  const getStatusConfig = () => {
    switch (status) {
      case 'open':
        return { label: t('status.open'), color: 'info' as const };
      case 'waiting_teacher':
        return { label: t('status.waiting_teacher'), color: 'warning' as const };
      case 'waiting_student':
        return { label: t('status.waiting_student'), color: 'secondary' as const };
      case 'resolved':
        return { label: t('status.resolved'), color: 'success' as const };
      default:
        return { label: status, color: 'default' as const };
    }
  };

  const config = getStatusConfig();

  return <Chip label={config.label} color={config.color} size="small" />;
}
