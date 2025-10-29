'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { supportSocket, TicketMessage } from '@/services/supportSocket';
import { getTicketMessages, sendTicketMessage, markTicketAsRead } from '@/actions/supportTicketActions';
import { toast } from 'react-toastify';
import { ITicketMessage } from '../../types/entities';

interface UseSupportChatProps {
  ticketId: string;
  userRole: 'student' | 'teacher';
  onMessageReceived?: (message: TicketMessage) => void;
}

const isDev = process.env.NODE_ENV === 'development';

export function useSupportChat({ ticketId, userRole, onMessageReceived }: UseSupportChatProps) {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<ITicketMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setSending] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Use refs to store latest callback without causing re-renders
  const onMessageReceivedRef = useRef(onMessageReceived);

  // Update refs when callbacks change (doesn't cause re-render)
  useEffect(() => {
    onMessageReceivedRef.current = onMessageReceived;
  }, [onMessageReceived]);

  // Fetch initial messages
  const loadMessages = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getTicketMessages(ticketId);
      if ('data' in response && response.data) {
        setMessages(response.data);
      }
    } catch (error) {
      if (isDev) console.error('[useSupportChat] Failed to load messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setIsLoading(false);
    }
  }, [ticketId]);

  // Mark messages as read
  const markAsRead = useCallback(async () => {
    try {
      await markTicketAsRead(ticketId);
    } catch (error) {
      if (isDev) console.error('[useSupportChat] Failed to mark as read:', error);
    }
  }, [ticketId]);


  // Send message
  const sendMessage = useCallback(
    async (message: string) => {
      if (!message.trim()) return;

      setSending(true);
      try {
        const socket = supportSocket.getSocket();

        if (socket && isConnected) {
          if (isDev) console.log('[useSupportChat] Sending via WebSocket:', message.substring(0, 20));

          // Create optimistic message for immediate display
          const optimisticMessage: ITicketMessage = {
            _id: `temp-${Date.now()}`, // Temporary ID
            ticketId,
            senderId: parseInt(session?.user?.id || '0'),
            senderRole: userRole,
            message,
            isRead: true,
            createdAt: new Date(),
          };

          // Add message to local state immediately (optimistic update)
          setMessages((prev) => [...prev, optimisticMessage]);

          // Send via WebSocket
          supportSocket.sendMessage(ticketId, message, userRole);
        } else {
          if (isDev) console.log('[useSupportChat] Sending via REST API (socket not connected)');

          // Fallback to REST API
          const response = await sendTicketMessage({
            ticketId,
            message,
          });

          if ('data' in response && response.data) {
            // Add message to local state
            const newMessage = response.data;
            setMessages((prev) => [...prev, newMessage]);
          } else {
            toast.error('Failed to send message');
          }
        }
      } catch (error) {
        if (isDev) console.error('[useSupportChat] Failed to send message:', error);
        toast.error('Failed to send message. Please try again.');
      } finally {
        setSending(false);
      }
    },
    [ticketId, userRole, isConnected, session?.user?.id]
  );

  // Handle typing indicator
  const handleTyping = useCallback(
    (typing: boolean) => {
      if (!isConnected) return;

      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Send typing event
      supportSocket.sendTypingIndicator(ticketId, typing);

      // Auto-stop typing after 3 seconds
      if (typing) {
        typingTimeoutRef.current = setTimeout(() => {
          supportSocket.sendTypingIndicator(ticketId, false);
        }, 3000);
      }
    },
    [ticketId, isConnected]
  );

  // Setup WebSocket connection
  useEffect(() => {
    if (!session?.user?.id || !session?.user?.access_token) {
      return;
    }

    console.log('[useSupportChat] Setting up WebSocket for ticket:', ticketId);

    // Connect to socket (convert string ID to number)
    const socket = supportSocket.connect(parseInt(session.user.id), session.user.access_token);

    const handleConnect = () => {
      console.log('[useSupportChat] Socket connected, joining ticket:', ticketId);
      setIsConnected(true);
      supportSocket.joinTicket(ticketId);
    };

    const handleDisconnect = () => {
      console.log('[useSupportChat] Socket disconnected');
      setIsConnected(false);
    };

    // Listen for new messages
    const handleNewMessage = (data: { message: TicketMessage }) => {
      console.log('[useSupportChat] Received newMessage event:', data.message);

      const newMessage: ITicketMessage = {
        _id: data.message._id || String(Date.now()),
        ticketId: data.message.ticketId,
        senderId: data.message.senderId,
        senderRole: data.message.senderRole,
        message: data.message.message,
        isRead: data.message.isRead,
        createdAt: new Date(data.message.createdAt),
      };

      setMessages((prev) => {
        // Check if this is our own message (from optimistic update)
        const currentUserId = parseInt(session?.user?.id || '0');
        const isSelfMessage = newMessage.senderId === currentUserId;

        console.log('[useSupportChat] Processing message:', {
          isSelfMessage,
          currentUserId,
          senderId: newMessage.senderId,
          messageId: newMessage._id,
          messageContent: newMessage.message.substring(0, 20)
        });

        if (isSelfMessage) {
          // Find and replace any temporary message with matching content
          const tempMessageIndex = prev.findIndex(
            (msg) => msg._id.startsWith('temp-') &&
                     msg.message === newMessage.message &&
                     msg.senderId === newMessage.senderId
          );

          if (tempMessageIndex !== -1) {
            // Replace temporary message with real one from server
            console.log('[useSupportChat] Replacing temp message at index:', tempMessageIndex);
            const updated = [...prev];
            updated[tempMessageIndex] = newMessage;
            return updated;
          }

          console.log('[useSupportChat] No temp message found to replace, adding as new');
        }

        // Check for duplicates before adding
        const isDuplicate = prev.some((msg) => msg._id === newMessage._id);
        if (isDuplicate) {
          console.log('[useSupportChat] Duplicate message detected, skipping');
          return prev;
        }

        // Add new message (either from other user or own message without temp)
        console.log('[useSupportChat] Adding new message to state');
        return [...prev, newMessage];
      });

      // Call callback if provided
      if (onMessageReceived) {
        onMessageReceived(data.message);
      }

      // Mark as read if it's from the other party
      if (newMessage.senderRole !== userRole) {
        markAsRead();
      }
    };

    // Listen for typing indicators
    const handleTypingIndicator = (data: { userId: number; isTyping: boolean }) => {
      // Only show typing if it's from the other party
      if (data.userId !== parseInt(session.user.id)) {
        setIsTyping(data.isTyping);
      }
    };

    // Register event listeners
    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('newMessage', handleNewMessage);
    socket.on('userTyping', handleTypingIndicator);

    // If already connected, join ticket immediately
    if (socket.connected) {
      handleConnect();
    }

    // Cleanup - Remove the SPECIFIC callback functions
    return () => {
      console.log('[useSupportChat] Cleaning up WebSocket listeners for ticket:', ticketId);

      supportSocket.leaveTicket(ticketId);

      // Remove specific listeners
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('newMessage', handleNewMessage);
      socket.off('userTyping', handleTypingIndicator);

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [session, ticketId, userRole, onMessageReceived, markAsRead]);

  // Load messages on mount
  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  // Mark as read on mount
  useEffect(() => {
    markAsRead();
  }, [markAsRead]);

  return {
    messages,
    isLoading,
    isSending,
    isConnected,
    isTyping,
    sendMessage,
    handleTyping,
    refreshMessages: loadMessages,
  };
}
