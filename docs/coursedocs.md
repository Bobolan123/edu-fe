# Course API Documentation

## Overview

This documentation covers all API endpoints for course management, which has been separated into two main controllers for better organization:

1. **Course Controller** (`/courses`) - General course management (CRUD, search, thumbnails)
2. **Course Content Controller** (`/course-content`) - Content management (sections, lectures, progress, media)

## Architecture Changes (v2.0)

### **Separation of Concerns**
- **General Course Operations** moved to `/courses` controller
- **Content Management** moved to `/course-content` controller
- **Thumbnail uploads** kept with general course operations
- **Video uploads and captions** moved to content controller

### **API Structure Reorganization**
The course-content controller endpoints are now organized in logical groups:
1. Course Content Management
2. Section Management
3. Lecture Management
4. Media & File Management
5. Progress Tracking

## Base URLs
- **General Courses**: `/courses`
- **Course Content**: `/course-content`

## Authentication

Most endpoints require JWT authentication via the `JwtAuthGuard`. Public endpoints are explicitly marked.

## Data Models

### Course Entity
```typescript
{
  id: number
  title: string
  language: string
  preview_url?: string
  isActive: boolean
  description: string
  date_created: Date
  last_updated: Date
  deleted_at?: Date
  price: number
  average_rating: number
  total_reviews: number
  thumbnail_url?: string
  metadata?: CourseMetadata
  instructor: User
  categories: Category[]
  reviews: Review[]
}
```

### Course Metadata
```typescript
{
  language: string
  level: string
  whatYoullLearn: string[]
}
```

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

---

# GENERAL COURSE API (`/courses`)

## Course CRUD Operations

### POST `/courses`
**Description**: Create a new course
**Authentication**: Required (JWT)

**Request Body**:
```json
{
  "title": "Course Title",
  "instructorId": 1,
  "categoryIds": [1, 2],
  "description": "Course description",
  "language": "English",
  "preview_url": "https://youtube.com/watch?v=xxx",
  "price": 99.99
}
```

### GET `/courses`
**Description**: Get all courses with search and filtering
**Authentication**: Public

**Query Parameters**:
- `search` - Search in title/description
- `title` - Filter by title
- `description` - Filter by description
- `categoryIds` - Filter by category IDs (comma-separated)
- `instructorId` - Filter by instructor
- `minPrice` / `maxPrice` - Price range
- `minRating` / `maxRating` - Rating range
- `userId` - For enrollment status
- `excludeEnrolled` - Exclude enrolled courses
- `status` - Filter by isActive status
- `includeDeleted` - Include deleted courses
- `order` / `orderBy` - Sorting options
- `page` / `take` - Pagination

### GET `/courses/:id`
**Description**: Get single course details
**Authentication**: Public

**Query Parameters**:
- `includeDeleted` - Include if course is deleted

### PATCH `/courses/:id`
**Description**: Update course
**Authentication**: Required (JWT)

### DELETE `/courses/:id`
**Description**: Soft delete course
**Authentication**: Required (JWT)

### PATCH `/courses/:id/restore`
**Description**: Restore deleted course
**Authentication**: Required (JWT)

### DELETE `/courses/:id/force`
**Description**: Permanently delete course
**Authentication**: Required (JWT)

### GET `/courses/by-category`
**Description**: Get courses by category IDs
**Authentication**: Public

**Query Parameters**:
- `ids` - Category IDs (comma-separated)
- `includeDeleted` - Include deleted courses

## Course Media Management

### POST `/courses/:id/thumbnail`
**Description**: Upload course thumbnail
**Authentication**: Required (JWT)
**Parameters**:
- `id` (path): Course ID
**Body**: `multipart/form-data` with `thumbnail` file

### GET `/courses/:id/students`
**Description**: Get course students with progress
**Authentication**: Required (JWT)
**Parameters**:
- `id` (path): Course ID
**Query Parameters**:
- `page` / `take` - Pagination

---

# COURSE CONTENT API (`/course-content`)

## 1. COURSE CONTENT MANAGEMENT

### GET `/course-content/:courseId/content`
**Description**: Get course content (sections and lectures)
**Authentication**: Public
**Parameters**:
- `courseId` (path): Course ID

**Response**:
```json
{
  "statusCode": 200,
  "message": "Get course content",
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
            "isPreview": false,
            "content": {
              "videoUrl": "https://cloudinary.com/video.mp4",
              "quality": [...]
            }
          }
        ]
      }
    ],
    "metadata": {
      "language": "English",
      "level": "beginner",
      "whatYoullLearn": ["Item 1", "Item 2"]
    }
  }
}
```

### PATCH `/course-content/:courseId/content`
**Description**: Update course content metadata
**Authentication**: Required (JWT)
**Parameters**:
- `courseId` (path): Course ID

**Request Body**:
```json
{
  "language": "English",
  "level": "intermediate",
  "whatYoullLearn": ["Learn React", "Learn Node.js"]
}
```

### GET `/course-content/course/:courseId/structure`
**Description**: Get complete course structure with all details
**Authentication**: Public
**Parameters**:
- `courseId` (path): Course ID

## 2. SECTION MANAGEMENT

### POST `/course-content/course/:courseId/sections`
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

### PATCH `/course-content/sections/:sectionId`
**Description**: Update course section
**Authentication**: Required (JWT)
**Parameters**:
- `sectionId` (path): Section ID

### DELETE `/course-content/sections/:sectionId`
**Description**: Delete course section
**Authentication**: Required (JWT)
**Parameters**:
- `sectionId` (path): Section ID

### PUT `/course-content/course/:courseId/sections/reorder`
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

## 3. LECTURE MANAGEMENT

### POST `/course-content/sections/:sectionId/lectures`
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
    "videoUrl": "",
    "thumbnailUrl": "",
    "cloudinaryPublicId": "",
    "quality": []
  }
}
```

### GET `/course-content/lectures/:lectureId`
**Description**: Get lecture details
**Authentication**: Public
**Parameters**:
- `lectureId` (path): Lecture ID

### PATCH `/course-content/lectures/:lectureId`
**Description**: Update lecture
**Authentication**: Required (JWT)
**Parameters**:
- `lectureId` (path): Lecture ID

### DELETE `/course-content/lectures/:lectureId`
**Description**: Delete lecture
**Authentication**: Required (JWT)
**Parameters**:
- `lectureId` (path): Lecture ID

### PUT `/course-content/sections/:sectionId/lectures/reorder`
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

## 4. MEDIA & FILE MANAGEMENT

### POST `/course-content/:courseId/lecture`
**Description**: Upload lecture video file
**Authentication**: Required (JWT)
**Parameters**:
- `courseId` (path): Course ID
**Body**:
- `multipart/form-data` with `lecture` file
- `sectionId`: Section ID (string)
- `lectureId`: Lecture ID (string)

**Response**:
```json
{
  "statusCode": 200,
  "message": "Upload course lecture",
  "data": "https://cloudinary.com/video.mp4"
}
```

### GET `/course-content/lecture/:lectureId/captions`
**Description**: Get lecture captions/subtitles
**Authentication**: Public
**Parameters**:
- `lectureId` (path): Lecture ID

**Response**:
```json
{
  "statusCode": 200,
  "message": "Get lecture captions",
  "data": {
    "cues": [...],
    "files": {
      "srt": "https://cloudinary.com/captions.srt"
    }
  }
}
```

## 5. PROGRESS TRACKING

### POST `/course-content/progress/:enrollmentId/lectures/:lectureId`
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

### GET `/course-content/progress/:enrollmentId/course/:courseId`
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
    "totalLectures": 10,
    "completedLectures": 6,
    "progressPercentage": 60,
    "totalDuration": 3600,
    "watchedDuration": 2160
  }
}
```

---

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

## Migration Notes (v2.0)

### **What Changed**:
1. **API Separation**: Split into `/courses` (general) and `/course-content` (content management)
2. **Route Organization**: Content endpoints now organized in logical groups
3. **Thumbnail Uploads**: Moved from course-content back to courses controller
4. **Video Uploads**: Moved from courses to course-content controller
5. **Content Endpoints**: `/courses/:id/content` → `/course-content/:courseId/content`

### **Breaking Changes**:
- Course content endpoints now use `/course-content` base path
- Video lecture upload moved from `/courses/:id/lecture` to `/course-content/:courseId/lecture`
- Caption endpoints moved from `/courses/lecture/:lectureId/captions` to `/course-content/lecture/:lectureId/captions`

### **Backward Compatibility**:
- General course CRUD operations remain at `/courses`
- Thumbnail upload still at `/courses/:id/thumbnail`

## Notes

1. **UUIDs**: All sections and lectures use UUID primary keys
2. **Order Management**: Both sections and lectures maintain `orderIndex` for proper ordering
3. **Content Types**: Support for both video and quiz content with different validation rules
4. **File Uploads**: Handled through Cloudinary integration with automatic caption generation
5. **Progress Tracking**: Comprehensive tracking of student progress through courses
6. **Cascading Deletes**: Deleting sections will delete associated lectures
7. **Public Access**: Course structure and lecture details are publicly accessible for preview purposes
8. **Clean Architecture**: Clear separation between course management and content management
9. **ServeStaticModule**: Fixed route conflicts by properly configuring static file serving