# Support Chat System Implementation Guide

## Overview

A complete student-lecturer support ticket chat system with real-time WebSocket communication and REST API fallback. Students can ask questions to course instructors through private 1-to-1 conversations managed via a FIFO (First-In-First-Out) queue.

## Architecture

### Technology Stack
- **Frontend**: React, Material-UI, Socket.IO Client
- **Backend**: PostgreSQL (tickets), MongoDB (messages), WebSocket
- **Real-time**: Socket.IO for live messaging
- **Fallback**: REST API when WebSocket unavailable

### Key Components

```
src/
├── app/[locale]/
│   └── support-inbox/
│       └── page.tsx                    # Teacher inbox page (route)
├── services/
│   └── supportSocket.ts                # WebSocket singleton service
├── actions/
│   └── supportTicketActions.ts         # Server actions for REST API
├── hooks/
│   └── useSupportChat.ts               # Custom hook for chat logic
├── components/
│   └── SupportChat/
│       ├── StudentSupportChat.tsx      # Student chat (in course page)
│       ├── TeacherSupportInbox.tsx     # Teacher inbox (all tickets)
│       ├── SupportInboxPage.tsx        # Teacher inbox page wrapper
│       ├── TicketList.tsx              # Ticket inbox/list view
│       ├── TicketChat.tsx              # Chat interface
│       ├── CreateTicketModal.tsx       # Ticket creation dialog
│       ├── TicketStatusBadge.tsx       # Status indicator
│       └── index.ts                    # Export all components
└── types/
    └── entities.d.ts                   # TypeScript interfaces
```

## Features Implemented

### 1. WebSocket Service (`supportSocket.ts`)
- Singleton pattern for global socket instance
- Automatic reconnection with exponential backoff
- Event listeners for messages, typing, and ticket updates
- Connection state management
- Room-based messaging (join/leave ticket rooms)

**Key Methods:**
```typescript
supportSocket.connect(userId, token)      // Connect to server
supportSocket.sendMessage(ticketId, msg)   // Send message via WS
supportSocket.onNewMessage(callback)       // Listen for messages
supportSocket.sendTypingIndicator(...)     // Send typing status
```

### 2. Server Actions (`supportTicketActions.ts`)
All server actions for REST API communication:
- `createSupportTicket()` - Create new ticket
- `getMySupportTickets()` - Fetch user's tickets
- `getTicketMessages()` - Load message history
- `sendTicketMessage()` - REST fallback for sending
- `markTicketAsRead()` - Mark messages as read
- `updateTicketStatus()` - Change ticket status (teacher only)
- `getUnreadTicketCount()` - Get unread count for badge

### 3. Custom Hook (`useSupportChat.ts`)
Manages chat state and logic:
- Loads message history on mount
- Handles WebSocket connection lifecycle
- Auto-switches to REST API when offline
- Manages typing indicators with debouncing
- Auto-marks messages as read
- Syncs new messages in real-time

**Usage:**
```tsx
const {
  messages,
  isLoading,
  isSending,
  isConnected,
  isTyping,
  sendMessage,
  handleTyping,
  refreshMessages,
} = useSupportChat({ ticketId, userRole });
```

### 4. UI Components

#### **SupportPage.tsx**
Main container with ticket list and chat area in split view.
- Grid layout (4 columns list, 8 columns chat)
- Create ticket button for students
- Auto-refresh on ticket updates

#### **TicketList.tsx**
Displays all tickets with filtering:
- Filter tabs: All, Active, Resolved
- Shows unread badges
- FIFO ordering (oldest first for teachers)
- Real-time updates

#### **TicketChat.tsx**
Full-featured chat interface:
- Message bubbles with timestamps
- Typing indicators
- Online/offline status
- "Mark as Resolved" button (teachers only)
- Auto-scroll to latest message
- Read receipts

#### **CreateTicketModal.tsx**
Student ticket creation:
- Subject input with validation
- Character counter (max 200)
- Shows course context
- Success feedback

## Integration

### Added to Course Learning Page
The support chat is integrated as a new tab in `CourseLesson.tsx`:

```tsx
import { SupportPage } from "@/components/SupportChat";

// In tabs:
<Tab label="Ask Instructor" />

// In tab content:
{activeTab === 2 && course?.id && (
  <div style={{ height: '600px' }}>
    <SupportPage
      courseId={course.id}
      courseTitle={course.title}
      userRole="student"
    />
  </div>
)}
```

## TypeScript Types

Added to `types/entities.d.ts`:

```typescript
interface ISupportTicket {
  id: string;
  subject: string;
  status: 'open' | 'waiting_teacher' | 'waiting_student' | 'resolved';
  studentId: number;
  teacherId: number;
  courseId: number;
  student: IUser;
  teacher: IUser;
  course: ICourse;
  unreadCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

interface ITicketMessage {
  _id: string;
  ticketId: string;
  senderId: number;
  senderRole: 'student' | 'teacher';
  message: string;
  isRead: boolean;
  createdAt: Date;
}
```

## Internationalization

### English (`messages/en.json`)
```json
{
  "support": {
    "createTicket": "Ask Instructor",
    "ticketSubject": "Subject",
    "myTickets": "My Support Tickets",
    "teacherInbox": "Student Questions",
    "online": "Online",
    "offline": "Offline",
    "typing": "Typing...",
    "markAsResolved": "Mark as Resolved",
    "status": {
      "open": "Open",
      "waiting_teacher": "Waiting for instructor",
      "waiting_student": "Waiting for response",
      "resolved": "Resolved"
    }
  }
}
```

### Vietnamese (`messages/vi.json`)
Full Vietnamese translations provided for all support chat strings.

## Status Flow

```
OPEN → Student creates ticket
  ↓
WAITING_TEACHER → Student sends message
  ↓
WAITING_STUDENT → Teacher replies
  ↓
WAITING_TEACHER → Student replies back
  ↓
RESOLVED → Teacher marks as solved
```

## Security Features

- JWT authentication required for all operations
- Students can only access their own tickets
- Teachers can only access tickets assigned to them
- Only teachers can update ticket status
- 1-to-1 private rooms (no cross-ticket access)

## Connection Handling

### WebSocket Priority
1. Attempts WebSocket connection first
2. Falls back to REST API if disconnected
3. Auto-reconnection with exponential backoff
4. Max 5 reconnection attempts
5. Visual indicator shows connection status

### Offline Support
- Messages queued locally when offline
- REST API used as fallback
- Connection status displayed to user
- Graceful degradation of features

## Performance Optimizations

1. **Lazy Loading**: Chat UI loaded only when tab active
2. **Message Batching**: Messages grouped by sender/time
3. **Auto-scroll**: Smooth scroll to new messages
4. **Debounced Typing**: Typing events throttled to 2s
5. **Optimistic Updates**: Messages shown immediately

## Usage Examples

### For Students
1. Navigate to enrolled course
2. Click "Ask Instructor" tab
3. Click "Ask Instructor" button
4. Enter question subject
5. Send messages in real-time chat
6. Receive instructor responses

### For Teachers
1. Access support inbox (to be added to teacher dashboard)
2. View tickets in FIFO order
3. Click ticket to open chat
4. Respond to student questions
5. Mark ticket as resolved when complete

## Next Steps / Enhancements

### Recommended Future Features
1. **Teacher Dashboard**: Add dedicated support inbox page
2. **Navbar Badge**: Show unread count in navigation
3. **Email Notifications**: Alert users of new messages
4. **File Attachments**: Allow image/document sharing
5. **Desktop Notifications**: Browser notifications for new messages
6. **Search**: Search tickets by subject/content
7. **Canned Responses**: Quick replies for common questions
8. **Analytics**: Track response times and resolution rates

### Integration Points
- Add to teacher's "My Courses" page
- Include in main navigation with unread badge
- Add to course management dashboard
- Create standalone support page for teachers

## Testing Checklist

- [ ] Student can create ticket
- [ ] Messages send via WebSocket
- [ ] Messages fallback to REST when offline
- [ ] Typing indicators work
- [ ] Read receipts update
- [ ] Teacher can mark as resolved
- [ ] Filters work correctly
- [ ] Real-time updates sync
- [ ] Connection status displays
- [ ] Translations load correctly
- [ ] Mobile responsive layout
- [ ] Auto-scroll functions
- [ ] Unread badges show

## Environment Variables

Ensure `NEXT_PUBLIC_SERVER` is set in `.env`:
```
NEXT_PUBLIC_SERVER=http://localhost:3000
```

For production, update to your backend URL.

## Dependencies

All required dependencies are already installed:
- `socket.io-client: ^4.8.1` - WebSocket client
- `date-fns: ^4.1.0` - Date formatting
- `@mui/material` - UI components
- `react-toastify` - Notifications

## Troubleshooting

### WebSocket Not Connecting
- Check `NEXT_PUBLIC_SERVER` environment variable
- Verify backend WebSocket server is running
- Check browser console for connection errors
- Ensure JWT token is valid

### Messages Not Sending
- Check network tab for failed requests
- Verify user is authenticated
- Check if REST fallback is working
- Review server logs for errors

### Typing Indicators Not Working
- Ensure WebSocket is connected
- Check if events are being emitted
- Verify both users are in same ticket room
- Review socket event listeners

## API Endpoints Reference

See `docs/chatdocs.md` for complete API documentation.

### Key Endpoints
- `POST /support-tickets` - Create ticket
- `GET /support-tickets` - List tickets
- `GET /support-tickets/:id/messages` - Get messages
- `POST /support-tickets/:id/messages` - Send message (REST)
- `PATCH /support-tickets/:id/read` - Mark as read
- `PATCH /support-tickets/:id/status` - Update status
- `GET /support-tickets/unread-count` - Get unread count

### WebSocket Events
- `authenticate` - Auth with user ID
- `joinTicket` - Join ticket room
- `sendMessage` - Send message
- `typing` - Typing indicator
- `newMessage` - Receive message
- `userTyping` - Other user typing
- `ticketUpdated` - Ticket status changed

---

**Implementation Complete!** ✅

The support chat system is now fully integrated and ready for use. Students can ask questions to their instructors through real-time chat, and teachers can respond in a FIFO queue system.
