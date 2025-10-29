import { io, Socket } from 'socket.io-client';

export interface TicketMessage {
  _id: string;
  ticketId: string;
  senderId: number;
  senderRole: 'student' | 'teacher';
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface TypingEvent {
  ticketId: string;
  userId: number;
  isTyping: boolean;
}

export interface TicketUpdateEvent {
  ticketId: string;
  update: {
    status?: string;
    [key: string]: any;
  };
}

class SupportSocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  /**
   * Connect to the support WebSocket server
   * @param userId - Current user's ID
   * @param token - JWT access token
   */
  connect(userId: number, token: string): Socket {
    if (this.socket?.connected) {
      return this.socket;
    }

    const serverUrl = process.env.NEXT_PUBLIC_SERVER || 'http://localhost:3000';

    this.socket = io(`${serverUrl}/support`, {
      auth: { token },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: this.maxReconnectAttempts,
    });

    // Authenticate on connection
    this.socket.on('connect', () => {
      console.log('[SupportSocket] Connected to support server');
      this.socket?.emit('authenticate', { userId });
      this.reconnectAttempts = 0;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('[SupportSocket] Disconnected:', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('[SupportSocket] Connection error:', error);
      this.reconnectAttempts++;

      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error('[SupportSocket] Max reconnection attempts reached');
      }
    });

    return this.socket;
  }

  /**
   * Disconnect from the support WebSocket server
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.reconnectAttempts = 0;
      console.log('[SupportSocket] Disconnected');
    }
  }

  /**
   * Get the current socket instance
   */
  getSocket(): Socket | null {
    return this.socket;
  }

  /**
   * Check if socket is connected
   */
  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  /**
   * Join a ticket room for real-time updates
   * @param ticketId - The ticket ID to join
   */
  joinTicket(ticketId: string): void {
    if (!this.socket?.connected) {
      console.warn('[SupportSocket] Cannot join ticket: Not connected');
      return;
    }
    console.log('[SupportSocket] Joining ticket room:', ticketId);
    this.socket.emit('joinTicket', { ticketId });
  }

  /**
   * Leave a ticket room
   * @param ticketId - The ticket ID to leave
   */
  leaveTicket(ticketId: string): void {
    if (!this.socket?.connected) {
      return;
    }
    this.socket.emit('leaveTicket', { ticketId });
  }

  /**
   * Send a message via WebSocket
   * @param ticketId - The ticket ID
   * @param message - The message text
   * @param senderRole - Role of the sender (student/teacher)
   */
  sendMessage(ticketId: string, message: string, senderRole: 'student' | 'teacher'): void {
    if (!this.socket?.connected) {
      console.warn('[SupportSocket] Cannot send message: Not connected');
      throw new Error('Socket not connected. Use REST API fallback.');
    }

    this.socket.emit('sendMessage', {
      ticketId,
      message,
      senderRole,
    });
  }

  /**
   * Send typing indicator
   * @param ticketId - The ticket ID
   * @param isTyping - Whether user is typing
   */
  sendTypingIndicator(ticketId: string, isTyping: boolean): void {
    if (!this.socket?.connected) {
      return;
    }

    this.socket.emit('typing', {
      ticketId,
      isTyping,
    });
  }

  /**
   * Request online status of a user
   * @param userId - The user ID to check
   */
  requestOnlineStatus(userId: number): void {
    if (!this.socket?.connected) {
      return;
    }

    this.socket.emit('requestOnlineStatus', { userId });
  }

}

// Export singleton instance
export const supportSocket = new SupportSocketService();
