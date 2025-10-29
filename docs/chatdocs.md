# Support Ticket System (Student-Teacher Chat)

Simple FIFO (First-In-First-Out) support chat system for students to ask questions to their course instructors.

## Frontend Structure

### Student Access
- **Location**: Within the course learning page (`/my-learning/[title]`)
- **Component**: `StudentSupportChat`
- **Access**: "Ask Instructor" tab while learning
- **Features**:
  - Create support tickets for the current course
  - View their own tickets for this course
  - Chat with instructor in real-time

### Teacher Access
- **Location**: Dedicated inbox page (`/support-inbox`)
- **Component**: `TeacherSupportInbox`
- **Access**: Only instructors and admins
- **Features**:
  - View ALL student tickets across ALL courses they teach
  - FIFO ordering (oldest questions first)
  - Reply to students in real-time
  - Mark tickets as resolved

## How It Works

1. **Student creates a ticket** in a course they're enrolled in
2. **System auto-assigns** the ticket to the course instructor
3. **Private 1-to-1 chat** between student and teacher
4. **Real-time messaging** via WebSocket (if online) + stored in database
5. **FIFO queue** - Teachers see oldest questions first

## Architecture

- **PostgreSQL**: Stores ticket metadata (subject, status, relationships)
- **MongoDB**: Stores chat messages
- **WebSocket**: Real-time delivery when users are online

## REST API Endpoints

### Create Ticket
```http
POST /support-tickets
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "subject": "Need help with Chapter 3",
  "courseId": 123
}
```

### Get My Tickets
```http
GET /support-tickets
GET /support-tickets?status=waiting_teacher
Authorization: Bearer <jwt_token>
```

### Get Ticket Details
```http
GET /support-tickets/:ticketId
Authorization: Bearer <jwt_token>
```

### Get Messages
```http
GET /support-tickets/:ticketId/messages
Authorization: Bearer <jwt_token>
```

### Send Message (REST - fallback)
```http
POST /support-tickets/:ticketId/messages
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "ticketId": "uuid-here",
  "message": "I don't understand recursion"
}
```

### Mark Messages as Read
```http
PATCH /support-tickets/:ticketId/read
Authorization: Bearer <jwt_token>
```

### Update Ticket Status (Teacher only)
```http
PATCH /support-tickets/:ticketId/status
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "status": "resolved"
}
```

### Get Unread Count
```http
GET /support-tickets/unread-count
Authorization: Bearer <jwt_token>
```

## WebSocket Events

Connect to: `ws://localhost:3000/support`

### Client Events (Send)

#### 1. Authenticate
```javascript
socket.emit('authenticate', { userId: 123 });
```

#### 2. Join Ticket Room
```javascript
socket.emit('joinTicket', { ticketId: 'uuid-here' });
```

#### 3. Send Message
```javascript
socket.emit('sendMessage', {
  ticketId: 'uuid-here',
  message: 'I need help with loops',
  senderRole: 'student' // or 'teacher'
});
```

#### 4. Typing Indicator
```javascript
socket.emit('typing', {
  ticketId: 'uuid-here',
  isTyping: true
});
```

#### 5. Check Online Status
```javascript
socket.emit('requestOnlineStatus', { userId: 456 });
```

### Server Events (Listen)

#### 1. New Message
```javascript
socket.on('newMessage', (data) => {
  console.log(data.message);
});
```

#### 2. User Typing
```javascript
socket.on('userTyping', (data) => {
  console.log(`User ${data.userId} is typing: ${data.isTyping}`);
});
```

#### 3. Ticket Updated
```javascript
socket.on('ticketUpdated', (data) => {
  console.log(`Ticket ${data.ticketId} updated:`, data.update);
});
```

## Ticket Status Flow

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

## Example Frontend Usage

### React Example (with socket.io-client)

```javascript
import io from 'socket.io-client';

const socket = io('http://localhost:3000/support');

// 1. Authenticate when user logs in
socket.emit('authenticate', { userId: currentUser.id });

// 2. Join ticket room when opening chat
socket.emit('joinTicket', { ticketId: ticket.id });

// 3. Listen for new messages
socket.on('newMessage', (data) => {
  setMessages(prev => [...prev, data.message]);
});

// 4. Send message
const sendMessage = (text) => {
  socket.emit('sendMessage', {
    ticketId: ticket.id,
    message: text,
    senderRole: 'student'
  });
};

// 5. Show typing indicator
const handleTyping = (isTyping) => {
  socket.emit('typing', {
    ticketId: ticket.id,
    isTyping
  });
};
```

## Teacher Dashboard Example

```javascript
// Get tickets waiting for response (FIFO)
const tickets = await fetch('/support-tickets?status=waiting_teacher', {
  headers: { 'Authorization': `Bearer ${token}` }
}).then(r => r.json());

// Tickets are sorted by createdAt ASC (oldest first)
tickets.data.forEach(ticket => {
  console.log(`${ticket.student.name}: ${ticket.subject}`);
});
```

## Security

- ✅ JWT authentication required
- ✅ Students can only access their own tickets
- ✅ Teachers can only access tickets assigned to them
- ✅ Only teachers can update ticket status
- ✅ 1-to-1 private rooms (no cross-ticket access)

## Database Models

### SupportTicket (PostgreSQL)
- `id`: UUID
- `subject`: string
- `student`: User relation
- `teacher`: User relation (auto-assigned to course instructor)
- `course`: Course relation
- `status`: enum (open, waiting_teacher, waiting_student, resolved)
- `createdAt`: timestamp (used for FIFO sorting)

### TicketMessage (MongoDB)
- `ticketId`: string (references SupportTicket.id)
- `senderId`: number (User.id)
- `senderRole`: string (student/teacher)
- `message`: string
- `isRead`: boolean
- `createdAt`: timestamp (auto-generated)
