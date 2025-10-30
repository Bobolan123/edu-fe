"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Avatar,
  Box,
  Typography,
  Tooltip,
  Card,
  Chip,
} from '@mui/material';
import {
  Chat,
  Person,
  School,
  Visibility,
} from '@mui/icons-material';
import { ISupportTicket } from '../../../../types/entities';
import { formatDistanceToNow } from 'date-fns';

interface ChatTableProps {
  tickets: ISupportTicket[];
  totalTickets: number;
  currentPage: number;
  onPageChange: (newPage: number) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'open':
      return 'info';
    case 'waiting_teacher':
      return 'warning';
    case 'waiting_student':
      return 'default';
    case 'resolved':
      return 'success';
    default:
      return 'default';
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'open':
      return 'Open';
    case 'waiting_teacher':
      return 'Waiting Teacher';
    case 'waiting_student':
      return 'Waiting Student';
    case 'resolved':
      return 'Resolved';
    default:
      return status;
  }
};

export const ChatTable = ({
  tickets,
  totalTickets,
  currentPage,
  onPageChange,
}: ChatTableProps) => {
  return (
    <>
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Ticket</TableCell>
                <TableCell>Student</TableCell>
                <TableCell>Teacher</TableCell>
                <TableCell>Course</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Updated</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tickets.map((ticket) => (
                <TableRow key={ticket.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar
                        sx={{
                          width: 48,
                          height: 48,
                          backgroundColor: 'primary.main',
                          color: 'white',
                        }}
                      >
                        <Chat />
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" fontWeight={600}>
                          {ticket.subject}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          ID: {ticket.id}
                        </Typography>
                        {ticket.unreadCount && ticket.unreadCount > 0 && (
                          <Chip
                            label={`${ticket.unreadCount} unread`}
                            size="small"
                            color="error"
                            sx={{ ml: 1 }}
                          />
                        )}
                      </Box>
                    </Box>
                  </TableCell>

                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar
                        src={ticket.student?.avatar_url || undefined}
                        sx={{ width: 32, height: 32 }}
                      >
                        <Person fontSize="small" />
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight={500}>
                          {ticket.student?.name || 'Unknown'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {ticket.student?.email || 'No email'}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>

                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar
                        src={ticket.teacher?.avatar_url || undefined}
                        sx={{ width: 32, height: 32 }}
                      >
                        <Person fontSize="small" />
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight={500}>
                          {ticket.teacher?.name || 'Unknown'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {ticket.teacher?.email || 'No email'}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>

                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <School fontSize="small" color="action" />
                      <Box>
                        <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                          {ticket.course?.title || 'Unknown Course'}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={getStatusLabel(ticket.status)}
                      size="small"
                      color={getStatusColor(ticket.status) as any}
                    />
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2">
                      {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2">
                      {formatDistanceToNow(new Date(ticket.updatedAt), { addSuffix: true })}
                    </Typography>
                  </TableCell>

                  <TableCell align="center">
                    <Tooltip title="View Conversation">
                      <IconButton
                        size="small"
                        color="primary"
                      >
                        <Visibility />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[10]}
          component="div"
          count={totalTickets}
          rowsPerPage={10}
          page={currentPage - 1}
          onPageChange={(event, newPage) => {
            event?.preventDefault();
            onPageChange(newPage + 1);
          }}
          onRowsPerPageChange={() => {}}
        />
      </Card>
    </>
  );
};
