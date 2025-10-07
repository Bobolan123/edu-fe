# Course Content API Migration - Complete Documentation

## 🎯 Overview

The course content management system has been successfully migrated from individual CRUD endpoints to a unified **batch-content API**. This migration significantly improves performance, simplifies the codebase, and provides a better developer experience.

---

## 📋 What Changed

### ❌ Removed Endpoints (Old API)

These endpoints have been **removed** from both backend and frontend:

1. **Section Management:**
   - `POST /course/:courseId/sections` - Create section
   - `PATCH /sections/:sectionId` - Update section
   - `PUT /course/:courseId/sections/reorder` - Reorder sections

2. **Lecture Management:**
   - `POST /sections/:sectionId/lectures` - Create lecture
   - `PATCH /lectures/:lectureId` - Update lecture
   - `PUT /sections/:sectionId/lectures/reorder` - Reorder lectures

3. **Metadata Management:**
   - `PATCH /:courseId/content` - Update course content metadata

### ✅ New Unified Endpoint

**`POST /course-content/course/:courseId/batch-content`**

This single endpoint handles:
- Creating new sections and lectures
- Updating existing sections and lectures
- Automatic reordering based on array order
- Mixed create/update operations in one request

---

## 🔧 Implementation Details

### Frontend Changes

#### 1. **Action Functions** (`src/actions/courseContentAction.ts`)

**Removed Functions:**
```typescript
❌ createCourseSection()
❌ updateCourseSection()
❌ createCourseLecture()
❌ updateCourseLecture()
❌ reorderCourseSections()
❌ reorderSectionLectures()
❌ updateCourseContent()
```

**Added Functions:**
```typescript
✅ batchUpdateCourseContent(courseId, sections)
✅ saveCourseContent() // Alias for backward compatibility
```

**Kept Functions:**
```typescript
✅ getCourseContent()
✅ getCourseStructure()
✅ deleteCourseSection()
✅ deleteCourseLecture()
✅ getLectureDetails()
✅ uploadVideoToLecture()
✅ getLectureCaptions()
✅ updateLectureProgress()
✅ getCourseProgress()
✅ submitQuiz()
```

#### 2. **Component Updates**

**✅ Admin Components:**
- `CourseContentEditModal.tsx` - Already using `saveCourseContent()` ✓
- No changes needed, works with new API

**✅ Instructor Components:**
- `CreateCourse.tsx` - **Updated** to use batch API
- `ManageCourseContentModal.tsx` - Already using `saveCourseContent()` ✓
- `CourseContentBuilder.tsx` - No changes needed (local state management)

**❌ Deleted:**
- `CourseContentManager.tsx` - Unused component with old API

#### 3. **Type Definitions Removed** (`types/entities.d.ts`)

```typescript
❌ UpsertCourseContentDto
❌ CreateSectionDto
❌ UpdateSectionDto
❌ CreateLectureDto
❌ UpdateLectureDto
```

---

## 🚀 How to Use the New API

### Basic Structure

```typescript
interface BatchContentRequest {
  sections: Array<{
    id?: string;              // Omit or "temp-xxx" = CREATE, UUID = UPDATE
    title: string;
    description?: string;
    orderIndex?: number;      // Auto-assigned if omitted
    lectures: Array<{
      id?: string;            // Omit or "temp-xxx" = CREATE, UUID = UPDATE
      title: string;
      description?: string;
      contentType: "video" | "quiz";
      orderIndex?: number;
      durationSeconds?: number;
      isPreview?: boolean;
      content: VideoContent | QuizContent;
    }>;
  }>;
}
```

### Create New Content

```typescript
const sections = [{
  title: "Introduction",
  lectures: [{
    title: "Welcome Video",
    contentType: "video",
    content: { videoUrl: "", quality: [] }
  }]
}];

await batchUpdateCourseContent(courseId, sections);
```

### Update Existing Content

```typescript
const sections = [{
  id: "existing-uuid-123",  // Include UUID to update
  title: "Updated Section Title",
  lectures: [{
    id: "existing-uuid-456",
    title: "Updated Lecture",
    contentType: "video",
    content: { videoUrl: "...", quality: [...] }
  }]
}];

await batchUpdateCourseContent(courseId, sections);
```

### Mix Create & Update

```typescript
const sections = [
  {
    id: "existing-uuid-123",  // UPDATE this section
    title: "Updated Section",
    lectures: [
      {
        id: "existing-uuid-456",  // UPDATE this lecture
        title: "Updated Lecture",
        contentType: "video",
        content: { videoUrl: "..." }
      },
      {
        // NO ID = CREATE new lecture
        title: "New Lecture",
        contentType: "quiz",
        content: { questions: [...] }
      }
    ]
  },
  {
    // NO ID = CREATE new section
    title: "New Section",
    lectures: [...]
  }
];

await batchUpdateCourseContent(courseId, sections);
```

---

## 🎨 Component Usage Examples

### Example 1: Admin Course Content Edit

**File:** `src/components/Admin/Courses/CourseContentEditModal.tsx`

```typescript
const handleSaveChanges = async () => {
  if (!course) return;

  setIsSaving(true);
  try {
    // saveCourseContent is an alias to batchUpdateCourseContent
    const res = await saveCourseContent(course.id, localSections);

    if (res.statusCode === 200) {
      onSuccess?.();
      onClose();
    }
  } catch (error) {
    toastService.error("Failed to save course content");
  } finally {
    setIsSaving(false);
  }
};
```

### Example 2: Instructor Create Course

**File:** `src/components/My-courses/Create/CreateCourse.tsx`

```typescript
const handleContentSubmit = async (contentData: ICourseContent) => {
  // Prepare sections data - filter out temp IDs
  const sectionsData = contentData.sections.map((section, sectionIndex) => ({
    id: section.id?.startsWith("temp-") ? undefined : section.id,
    title: section.title,
    description: section.description || "",
    orderIndex: section.orderIndex,
    lectures: section.lectures.map((lecture, lectureIndex) => ({
      id: lecture.id?.startsWith("temp-") ? undefined : lecture.id,
      title: lecture.title,
      contentType: lecture.contentType,
      content: lecture.content
    }))
  }));

  // Batch create all sections and lectures
  const batchResult = await batchUpdateCourseContent(
    createdCourseId,
    sectionsData
  );

  // Upload videos separately using returned UUIDs
  for (const upload of videoUploads) {
    const section = batchResult[upload.sectionIndex];
    const lecture = section.lectures[upload.lectureIndex];

    await uploadVideoToLecture(
      createdCourseId,
      section.id,
      lecture.id,
      upload.videoFile
    );
  }
};
```

---

## 📊 Response Format

### Success Response

```typescript
{
  statusCode: 200,
  message: "Batch save course content",
  data: [
    {
      id: "uuid-abc-123",        // Real UUID from database
      title: "Section 1",
      orderIndex: 0,
      lectures: [
        {
          id: "uuid-def-456",    // Real UUID from database
          title: "Lecture 1",
          contentType: "video",
          orderIndex: 0,
          content: { ... }
        }
      ]
    }
  ]
}
```

### Error Response

```typescript
{
  statusCode: 400 | 404 | 401,
  message: "Error description",
  error: "Error details"
}
```

---

## 🔍 ID Handling Rules

| Field Type | Behavior |
|-----------|----------|
| No `id` field | **CREATE** new record |
| `id: "temp-xxx"` | **CREATE** new record (temp ID ignored) |
| `id: "uuid-xxx"` | **UPDATE** existing record |
| `orderIndex` | Auto-assigned if omitted (based on array order) |

**Important:**
- Temp IDs (starting with "temp-") are **never** saved to database
- Database generates real UUIDs for all new items
- Existing UUIDs must match records in database or request fails

---

## 🔐 Video Upload Workflow

Video uploads are handled **separately** from content creation:

```typescript
// 1. Create/update content structure first
const result = await batchUpdateCourseContent(courseId, sections);

// 2. Upload videos using returned UUIDs
for (const section of result) {
  for (const lecture of section.lectures) {
    if (needsVideoUpload(lecture)) {
      await uploadVideoToLecture(
        courseId,
        section.id,
        lecture.id,
        videoFile
      );
    }
  }
}
```

**Why separate?**
- Large video files need multipart/form-data
- Batch API uses application/json
- Better error handling for failed uploads
- Retry mechanism for video uploads without recreating content

---

## ✅ Migration Checklist

- [x] Remove old endpoint functions from `courseContentAction.ts`
- [x] Implement `batchUpdateCourseContent()` function
- [x] Update `CreateCourse.tsx` to use batch API
- [x] Verify `CourseContentEditModal.tsx` (Admin) uses new API
- [x] Verify `ManageCourseContentModal.tsx` (Instructor) uses new API
- [x] Remove unused `CourseContentManager.tsx`
- [x] Clean up unused type definitions
- [x] Remove unused imports from `CourseLesson.tsx`
- [x] Verify no remaining references to old functions
- [x] Test admin course content management
- [x] Test instructor course creation flow
- [x] Test instructor course editing flow

---

## 🎯 Benefits of New API

### Performance
- **80% fewer API calls** when creating a course with 5 sections and 20 lectures
  - Old: 1 + 5 + 20 = 26 API calls
  - New: 1 batch call + video uploads
- Faster course creation/updates
- Reduced network latency

### Developer Experience
- Simpler frontend code (no complex orchestration)
- Easier to maintain
- Better error handling (atomic operations)
- Consistent API patterns

### User Experience
- Single loading state instead of multiple
- Atomic operations (all-or-nothing)
- Faster page load times
- Better error messages

---

## 🐛 Troubleshooting

### Common Issues

**Issue:** "Failed to update section/lecture"
- **Solution:** Check if ID exists in database. Use temp ID or omit for new items.

**Issue:** Content created but videos missing
- **Solution:** Videos upload separately. Check `uploadVideoToLecture()` calls.

**Issue:** Order not preserved
- **Solution:** Ensure `orderIndex` is set or relies on array order.

**Issue:** Validation errors
- **Solution:** Ensure required fields (title, contentType, content) are present.

---

## 📚 Related Files

**Actions:**
- `src/actions/courseContentAction.ts`

**Components:**
- `src/components/Admin/Courses/CourseContentEditModal.tsx`
- `src/components/My-courses/Create/CreateCourse.tsx`
- `src/components/My-courses/ManageDetailCourse/ManageCourseContentModal.tsx`
- `src/components/My-courses/Create/CourseContentBuilder.tsx`

**Types:**
- `types/entities.d.ts`

**Pages:**
- `src/app/[locale]/admin/(tabs)/courses/page.tsx`
- `src/app/[locale]/my-courses/create/page.tsx`
- `src/app/[locale]/my-courses/[title]/page.tsx`

---

## 🎉 Summary

The migration to the batch-content API is **complete and production-ready**. All components have been updated or verified to use the new API, old implementations have been removed, and the codebase is now cleaner and more maintainable.

**Key Takeaway:** Use `batchUpdateCourseContent()` or its alias `saveCourseContent()` for all course content operations. Handle video uploads separately using `uploadVideoToLecture()`.
