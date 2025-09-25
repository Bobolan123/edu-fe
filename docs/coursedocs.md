# Course Content API Documentation

## Overview

This documentation covers all API endpoints for managing course content including sections, lectures, and progress tracking. The system supports both video lectures and quiz content with comprehensive structure management.

## Base URLs
- **Course Content**: `/course-content`
- **Courses**: `/courses`

## Authentication

Most endpoints require JWT authentication via the `JwtAuthGuard`. Public endpoints are explicitly marked.

## Data Models

### Course Section Entity
```typescript
{
  id: string (UUID)
  title: string
  description?: string
  orderIndex: number
  course: Course
  lectures: CourseLecture[]
  createdAt: Date
  updatedAt: Date
}
```

### Course Lecture Entity
```typescript
{
  id: string (UUID)
  title: string
  description?: string
  contentType: 'video' | 'quiz'
  orderIndex: number
  durationSeconds: number
  isPreview: boolean
  section: CourseSection
  content: VideoContent | QuizContent
  createdAt: Date
  updatedAt: Date
}
```

### Content Types

#### Video Content
```typescript
{
  videoUrl: string
  thumbnailUrl?: string
  cloudinaryPublicId: string
  quality: { resolution: string; url: string }[]
}
```

#### Quiz Content
```typescript
{
  questions: QuizQuestion[]
  passingScore: number
  timeLimit?: number
  allowMultipleAttempts: boolean
}
```

#### Quiz Question
```typescript
{
  id: string
  type: 'multiple_choice' | 'true_false' | 'fill_blank'
  question: string
  options?: string[]
  correctAnswer: string | number
  explanation?: string
  points: number
}
```

## API Endpoints

### Course Structure Management

#### GET `/course-content/course/:courseId/structure`
**Description**: Get complete course structure with sections and lectures
**Authentication**: Public
**Parameters**:
- `courseId` (path): Course ID

**Response**:
```json
{
  "statusCode": 200,
  "message": "Get course structure",
  "data": {
    "sections": [
      {
        "id": "uuid",
        "title": "Section Title",
        "description": "Section Description",
        "orderIndex": 0,
        "lectures": [
          {
            "id": "uuid",
            "title": "Lecture Title",
            "contentType": "video",
            "durationSeconds": 300,
            "isPreview": false
          }
        ]
      }
    ]
  }
}
```

### Section Management

#### POST `/course-content/course/:courseId/sections`
**Description**: Create a new course section
**Authentication**: Required (JWT)
**Parameters**:
- `courseId` (path): Course ID

**Request Body**:
```json
{
  "title": "Section Title",
  "description": "Optional description",
  "orderIndex": 0
}
```

**Response**:
```json
{
  "statusCode": 201,
  "message": "Create course section",
  "data": {
    "id": "uuid",
    "title": "Section Title",
    "description": "Optional description",
    "orderIndex": 0
  }
}
```

#### PATCH `/course-content/sections/:sectionId`
**Description**: Update course section
**Authentication**: Required (JWT)
**Parameters**:
- `sectionId` (path): Section ID

**Request Body**:
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "orderIndex": 1
}
```

#### DELETE `/course-content/sections/:sectionId`
**Description**: Delete course section
**Authentication**: Required (JWT)
**Parameters**:
- `sectionId` (path): Section ID

**Response**:
```json
{
  "statusCode": 200,
  "message": "Delete course section",
  "data": {
    "message": "Section deleted successfully"
  }
}
```

#### PUT `/course-content/course/:courseId/sections/reorder`
**Description**: Reorder course sections
**Authentication**: Required (JWT)
**Parameters**:
- `courseId` (path): Course ID

**Request Body**:
```json
{
  "sectionIds": ["uuid1", "uuid2", "uuid3"]
}
```

### Lecture Management

#### POST `/course-content/sections/:sectionId/lectures`
**Description**: Create a new lecture in a section
**Authentication**: Required (JWT)
**Parameters**:
- `sectionId` (path): Section ID

**Request Body**:
```json
{
  "title": "Lecture Title",
  "description": "Optional description",
  "contentType": "video",
  "orderIndex": 0,
  "durationSeconds": 300,
  "isPreview": false,
  "content": {
    "videoUrl": "https://example.com/video.mp4",
    "thumbnailUrl": "https://example.com/thumb.jpg",
    "cloudinaryPublicId": "video_id",
    "quality": [
      {
        "resolution": "1080p",
        "url": "https://example.com/video_1080p.mp4"
      }
    ]
  }
}
```

**For Quiz Content**:
```json
{
  "title": "Quiz Title",
  "contentType": "quiz",
  "content": {
    "questions": [
      {
        "id": "q1",
        "type": "multiple_choice",
        "question": "What is 2+2?",
        "options": ["3", "4", "5"],
        "correctAnswer": 1,
        "explanation": "Basic math",
        "points": 10
      }
    ],
    "passingScore": 70,
    "timeLimit": 300,
    "allowMultipleAttempts": true
  }
}
```

#### GET `/course-content/lectures/:lectureId`
**Description**: Get lecture details
**Authentication**: Public
**Parameters**:
- `lectureId` (path): Lecture ID

**Response**:
```json
{
  "statusCode": 200,
  "message": "Get lecture details",
  "data": {
    "id": "uuid",
    "title": "Lecture Title",
    "description": "Description",
    "contentType": "video",
    "orderIndex": 0,
    "durationSeconds": 300,
    "isPreview": false,
    "content": {
      "videoUrl": "https://example.com/video.mp4",
      "quality": []
    }
  }
}
```

#### PATCH `/course-content/lectures/:lectureId`
**Description**: Update lecture
**Authentication**: Required (JWT)
**Parameters**:
- `lectureId` (path): Lecture ID

**Request Body**: Same as create lecture (all fields optional)

#### DELETE `/course-content/lectures/:lectureId`
**Description**: Delete lecture
**Authentication**: Required (JWT)
**Parameters**:
- `lectureId` (path): Lecture ID

#### PUT `/course-content/sections/:sectionId/lectures/reorder`
**Description**: Reorder lectures within a section
**Authentication**: Required (JWT)
**Parameters**:
- `sectionId` (path): Section ID

**Request Body**:
```json
{
  "lectureIds": ["uuid1", "uuid2", "uuid3"]
}
```

### Progress Tracking

#### POST `/course-content/progress/:enrollmentId/lectures/:lectureId`
**Description**: Update lecture progress for a student
**Authentication**: Required (JWT)
**Parameters**:
- `enrollmentId` (path): Enrollment ID
- `lectureId` (path): Lecture ID

**Request Body**:
```json
{
  "watchTimeSeconds": 180,
  "lastPositionSeconds": 120,
  "isCompleted": false,
  "submissionData": {}
}
```

#### GET `/course-content/progress/:enrollmentId/course/:courseId`
**Description**: Get course progress for a student
**Authentication**: Required (JWT)
**Parameters**:
- `enrollmentId` (path): Enrollment ID
- `courseId` (path): Course ID

**Response**:
```json
{
  "statusCode": 200,
  "message": "Get course progress",
  "data": {
    "courseId": 1,
    "enrollmentId": 1,
    "overallProgress": 65.5,
    "sectionsProgress": [
      {
        "sectionId": "uuid",
        "progress": 80,
        "lecturesProgress": [
          {
            "lectureId": "uuid",
            "isCompleted": true,
            "watchTimeSeconds": 300
          }
        ]
      }
    ]
  }
}
```

### File Upload Endpoints (Courses Controller)

#### POST `/courses/:id/thumbnail`
**Description**: Upload course thumbnail
**Authentication**: Required (JWT)
**Parameters**:
- `id` (path): Course ID
**Body**: `multipart/form-data` with `thumbnail` file

#### POST `/courses/:id/lecture`
**Description**: Upload lecture video file
**Authentication**: Required (JWT)
**Parameters**:
- `id` (path): Course ID
**Body**:
- `multipart/form-data` with `lecture` file
- `sectionId`: Section ID
- `lectureId`: Lecture ID

#### GET `/courses/lecture/:lectureId/captions`
**Description**: Get lecture captions/subtitles
**Authentication**: Public
**Parameters**:
- `lectureId` (path): Lecture ID

## Error Responses

All endpoints return standardized error responses:

```json
{
  "statusCode": 400|401|403|404|500,
  "message": "Error description",
  "error": "Error type"
}
```

## Common HTTP Status Codes
- `200`: Success
- `201`: Created
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (missing or invalid token)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found
- `500`: Internal Server Error

## Notes

1. **UUIDs**: All sections and lectures use UUID primary keys
2. **Order Management**: Both sections and lectures maintain `orderIndex` for proper ordering
3. **Content Types**: Support for both video and quiz content with different validation rules
4. **File Uploads**: Handled through Cloudinary integration
5. **Progress Tracking**: Comprehensive tracking of student progress through courses
6. **Cascading Deletes**: Deleting sections will delete associated lectures
7. **Public Access**: Course structure and lecture details are publicly accessible for preview purposes