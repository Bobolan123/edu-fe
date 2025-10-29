'use server';

import { auth } from '@/auth';
import { sendRequest } from '@/utils/api';
import { revalidateTag } from 'next/cache';
import { ISupportTicket, ITicketMessage } from '../../types/entities';

export interface CreateTicketData {
  subject: string;
  courseId: number;
}

export interface SendMessageData {
  ticketId: string;
  message: string;
}

export interface UpdateTicketStatusData {
  ticketId: string;
  status: 'open' | 'waiting_teacher' | 'waiting_student' | 'resolved';
}

/**
 * Create a new support ticket
 */
export async function createSupportTicket(data: CreateTicketData) {
  const session = await auth();

  if (!session?.user?.access_token) {
    return { success: false, message: 'Not authenticated' };
  }

  try {
    const response = await sendRequest<IBackendRes<ISupportTicket>>({
      method: 'POST',
      url: `${process.env.NEXT_PUBLIC_SERVER}/support-tickets`,
      body: data,
      headers: {
        Authorization: `Bearer ${session.user.access_token}`,
      },
    });

    if (response?.data) {
      revalidateTag('support-tickets');
    }

    return response;
  } catch (error) {
    console.error('[createSupportTicket] Error:', error);
    return { success: false, message: 'Failed to create ticket' };
  }
}

/**
 * Get all tickets for current user
 */
export async function getMySupportTickets(status?: string) {
  const session = await auth();

  if (!session?.user?.access_token) {
    return { success: false, message: 'Not authenticated' };
  }

  try {
    const response = await sendRequest<IBackendRes<ISupportTicket[]>>({
      method: 'GET',
      url: `${process.env.NEXT_PUBLIC_SERVER}/support-tickets`,
      queryParams: status ? { status } : {},
      headers: {
        Authorization: `Bearer ${session.user.access_token}`,
      },
    });

    return response;
  } catch (error) {
    console.error('[getMySupportTickets] Error:', error);
    return { success: false, message: 'Failed to fetch tickets' };
  }
}

/**
 * Get details of a specific ticket
 */
export async function getSupportTicketById(ticketId: string) {
  const session = await auth();

  if (!session?.user?.access_token) {
    return { success: false, message: 'Not authenticated' };
  }

  try {
    const response = await sendRequest<IBackendRes<ISupportTicket>>({
      method: 'GET',
      url: `${process.env.NEXT_PUBLIC_SERVER}/support-tickets/${ticketId}`,
      headers: {
        Authorization: `Bearer ${session.user.access_token}`,
      },
    });

    return response;
  } catch (error) {
    console.error('[getSupportTicketById] Error:', error);
    return { success: false, message: 'Failed to fetch ticket details' };
  }
}

/**
 * Get messages for a ticket
 */
export async function getTicketMessages(ticketId: string) {
  const session = await auth();

  if (!session?.user?.access_token) {
    return { success: false, message: 'Not authenticated' };
  }

  try {
    const response = await sendRequest<IBackendRes<ITicketMessage[]>>({
      method: 'GET',  
      url: `${process.env.NEXT_PUBLIC_SERVER}/support-tickets/${ticketId}/messages`,
      headers: {
        Authorization: `Bearer ${session.user.access_token}`,
      },
    });

    return response;
  } catch (error) {
    console.error('[getTicketMessages] Error:', error);
    return { success: false, message: 'Failed to fetch messages' };
  }
}

/**
 * Send a message (REST fallback)
 */
export async function sendTicketMessage(data: SendMessageData) {
  const session = await auth();

  if (!session?.user?.access_token) {
    return { success: false, message: 'Not authenticated' };
  }

  try {
    const response = await sendRequest<IBackendRes<ITicketMessage>>({
      method: 'POST',
      url: `${process.env.NEXT_PUBLIC_SERVER}/support-tickets/${data.ticketId}/messages`,
      body: { message: data.message },
      headers: {
        Authorization: `Bearer ${session.user.access_token}`,
      },
    });

    if (response?.data) {
      revalidateTag(`ticket-messages-${data.ticketId}`);
    }

    return response;
  } catch (error) {
    console.error('[sendTicketMessage] Error:', error);
    return { success: false, message: 'Failed to send message' };
  }
}

/**
 * Mark messages in a ticket as read
 */
export async function markTicketAsRead(ticketId: string) {
  const session = await auth();

  if (!session?.user?.access_token) {
    return { success: false, message: 'Not authenticated' };
  }

  try {
    const response = await sendRequest<IBackendRes<any>>({
      method: 'PATCH',
      url: `${process.env.NEXT_PUBLIC_SERVER}/support-tickets/${ticketId}/read`,
      headers: {
        Authorization: `Bearer ${session.user.access_token}`,
      },
    });

    if (response?.data) {
      revalidateTag('support-tickets');
      revalidateTag('unread-count');
    }

    return response;
  } catch (error) {
    console.error('[markTicketAsRead] Error:', error);
    return { success: false, message: 'Failed to mark as read' };
  }
}

/**
 * Update ticket status (Teacher only)
 */
export async function updateTicketStatus(data: UpdateTicketStatusData) {
  const session = await auth();

  if (!session?.user?.access_token) {
    return { success: false, message: 'Not authenticated' };
  }

  try {
    const response = await sendRequest<IBackendRes<ISupportTicket>>({
      method: 'PATCH',
      url: `${process.env.NEXT_PUBLIC_SERVER}/support-tickets/${data.ticketId}/status`,
      body: { status: data.status },
      headers: {
        Authorization: `Bearer ${session.user.access_token}`,
      },
    });

    if (response?.data) {
      revalidateTag('support-tickets');
      revalidateTag(`ticket-${data.ticketId}`);
    }

    return response;
  } catch (error) {
    console.error('[updateTicketStatus] Error:', error);
    return { success: false, message: 'Failed to update ticket status' };
  }
}

/**
 * Get unread ticket count
 */
export async function getUnreadTicketCount() {
  const session = await auth();

  if (!session?.user?.access_token) {
    return { success: false, message: 'Not authenticated', data: 0 };
  }

  try {
    const response = await sendRequest<IBackendRes<number>>({
      method: 'GET',
      url: `${process.env.NEXT_PUBLIC_SERVER}/support-tickets/unread-count`,
      headers: {
        Authorization: `Bearer ${session.user.access_token}`,
      },
    });

    return response;
  } catch (error) {
    console.error('[getUnreadTicketCount] Error:', error);
    return { success: false, message: 'Failed to fetch unread count', data: 0 };
  }
}
