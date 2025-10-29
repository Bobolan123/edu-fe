# Teacher Support Inbox - Real-time Student Chat

## Overview
Teachers/Instructors can now chat in real-time with students who have questions about their courses through a dedicated Support Inbox page.

## How to Access (For Teachers/Instructors)

### Method 1: Via Navbar Profile Menu
1. Click on your **Profile Avatar** in the top-right corner
2. In the dropdown menu, click **"Student Questions"** (or "Câu Hỏi Học Viên" in Vietnamese)
3. You'll be redirected to `/support-inbox`

### Method 2: Direct URL
Navigate directly to: **`/support-inbox`**

## Features for Teachers

### Support Inbox Page (`/support-inbox`)
A dedicated full-page interface with:

- **FIFO Queue**: Tickets are sorted by oldest first (First-In-First-Out)
- **Ticket List** (left panel):
  - Shows all support tickets from students
  - Filter by: All / Active / Resolved
  - Displays unread badges
  - Shows student name, subject, course, and status

- **Chat Interface** (right panel):
  - Real-time messaging with WebSocket
  - Typing indicators
  - Online/offline status
  - Message timestamps
  - Auto-scroll to latest message

### Teacher Actions
- ✅ **View all student questions** across all courses
- ✅ **Reply in real-time** via WebSocket
- ✅ **Mark tickets as resolved** when question is answered
- ✅ **See unread count** for each ticket
- ✅ **Filter tickets** by status

## How Students Access (For Reference)

Students can ask questions from:
1. Go to any enrolled course
2. Navigate to the course learning page
3. Click the **"Ask Instructor"** tab
4. Click **"Ask Instructor"** button to create a new ticket
5. Send messages in real-time

## Technical Details

### Access Control
- **Route**: `/support-inbox`
- **Access**: Restricted to `instructor` and `admin` roles only
- **Redirect**: Students are redirected to `/my-learning` if they try to access

### Components
- **Page**: `src/app/[locale]/support-inbox/page.tsx`
- **Component**: `src/components/SupportChat/SupportInboxPage.tsx`
- **Navbar Link**: Added to profile dropdown menu for instructors

### Navbar Menu Structure

**For Instructors/Admins:**
```
Profile Menu:
├── My Courses
├── Student Questions ← NEW!
├── My Activity
└── Logout
```

**For Students:**
```
Profile Menu:
├── My Learning
├── My Activity
└── Logout
```

## Ticket Status Flow

```
OPEN
  ↓ (Student sends first message)
WAITING_TEACHER ← Teacher should respond
  ↓ (Teacher replies)
WAITING_STUDENT ← Student should respond
  ↓ (Student replies)
WAITING_TEACHER
  ↓ (Teacher marks as resolved)
RESOLVED
```

## Real-time Features

1. **WebSocket Connection**
   - Auto-connects when opening a ticket
   - Shows online/offline status
   - Real-time message delivery

2. **Typing Indicators**
   - Shows when student is typing
   - Auto-clears after 3 seconds

3. **Read Receipts**
   - Messages marked as read when viewed
   - Unread count updates in real-time

4. **Fallback to REST API**
   - If WebSocket disconnects
   - Ensures messages are never lost

## Translations

### English
- Menu: "Student Questions"
- Page Title: "Student Questions"
- Subtitle: "Respond to student questions in FIFO order"

### Vietnamese
- Menu: "Câu Hỏi Học Viên"
- Page Title: "Câu Hỏi Của Học Viên"
- Subtitle: "Respond to student questions in FIFO order"

## Testing Checklist

- [ ] Teacher can access `/support-inbox`
- [ ] Students are redirected away from `/support-inbox`
- [ ] Navbar shows "Student Questions" for teachers
- [ ] Navbar hides "Student Questions" for students
- [ ] Ticket list shows all student questions
- [ ] FIFO ordering works (oldest first)
- [ ] Real-time chat works via WebSocket
- [ ] Teacher can mark tickets as resolved
- [ ] Filters work (All/Active/Resolved)
- [ ] Translations display correctly (EN/VI)

## Future Enhancements

Consider adding:
1. **Unread Badge** in navbar next to "Student Questions"
2. **Email Notifications** when new tickets arrive
3. **Desktop Notifications** for new messages
4. **Search/Filter** by course or student name
5. **Bulk Actions** (mark multiple as resolved)
6. **Analytics** (response time, resolution rate)

---

**Note**: The support inbox is now fully functional and accessible to all instructors and admins!
