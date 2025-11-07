# Mindful Maze Mobile App - Documentation

## Project Overview

A mobile learning application for students built with **Expo React Native** and **React Native Paper**. This app allows students to manage their enrolled courses and study on mobile devices.

### App Name: **Mindful Maze**

### Core Features
- **Onboarding**: Welcome screen with app introduction
- **Authentication**: Login with email/password or Google
- **My Learning**: Manage enrolled courses
- **Video Learning**: Watch lectures with progress tracking
- **Profile**: User settings and account management
- **Multi-language**: English/Vietnamese support

### What's Included
✅ Onboarding (Mindful Maze intro)
✅ Authentication (Email/Google)
✅ My Learning page
✅ Video player with progress
✅ Profile management
✅ Multi-language (EN/VI)
---

## Application Flow

### First Time User Flow
```
┌─────────────────────────┐
│  Onboarding Screen      │
│  "Mindful Maze"         │
│  - App introduction     │
│  - Benefits             │
│  - Swipe to continue    │
└───────────┬─────────────┘
            │
            │ (Swipe left)
            ▼
┌─────────────────────────┐
│  Login Screen           │
│  - Email/Password       │
│  - Google Sign In       │
│  - Remember me          │
└───────────┬─────────────┘
            │
            │ (Login success)
            ▼
┌─────────────────────────┐
│  My Learning (Home)     │
│  - Enrolled courses     │
│  - Progress indicators  │
│  - Continue learning    │
└───────────┬─────────────┘
            │
            ├──────────────┬─────────────┐
            │              │
            ▼              ▼
┌────────────────┐  ┌──────────┐
│ Course Player  │  │ Profile  │
│ - Video        │  │ - Info   │
│ - Lectures     │  │ - Edit   │
│ - Progress     │  │ - Lang   │
└────────────────┘  │ - Logout │
                    └──────────┘
```

### Returning User Flow
```
App Launch → Check Auth → My Learning (directly)
```

---

## Screen Specifications

### 1. Onboarding Screen (First Time Only)

**Purpose**: Introduce the app and its purpose

**UI Elements**:
- App logo (Mindful Maze)
- Title: "Mindful Maze"
- Subtitle: "Your Learning Companion"
- Description slides (3 screens):
  1. "Learn Anywhere, Anytime" - Study your enrolled courses on the go
  2. "Track Your Progress" - Monitor your learning journey
  3. "Learn at Your Pace" - Watch lectures at your convenience
- Swipe gesture indicator
- "Get Started" button on last slide

**Design**:
- Gradient background matching theme colors
- Smooth slide transitions
- Skip button (top right)
- Pagination dots at bottom

**User Flow**:
```
Slide 1 → Swipe → Slide 2 → Swipe → Slide 3 → "Get Started" → Login Screen
```

**State Management**:
- Show only on first app launch
- Store completion in AsyncStorage (`@onboarding_completed`)

---

### 2. Login Screen

**Purpose**: User authentication

**UI Elements**:
- App logo
- Title: "Welcome Back"
- Email input field
- Password input field (with show/hide toggle)
- "Remember Me" checkbox
- "Login" button (gradient)
- "Forgot Password?" link
- Divider with "OR"
- "Continue with Google" button
- Link: "Don't have an account? Contact admin"

**Validation Rules**:
- Email: Required, valid format
- Password: Required, min 6 characters

**API Call**:
```typescript
POST /auth/login
Body: { email, password }
Response: { access_token, refresh_token, user }
```

**Error Handling**:
- Invalid credentials
- Account not active
- Network errors

**Success Flow**:
```
Login → Save tokens → Navigate to My Learning
```

---

### 3. My Learning Screen (Home)

**Purpose**: Display all enrolled courses

**UI Elements**:
- Header:
  - Title: "My Learning"
  - Profile avatar (navigate to profile)
  - Language switcher icon
- Search bar (search enrolled courses)
- Filter chips: All, In Progress, Completed
- Course cards with:
  - Course thumbnail
  - Course title
  - Instructor name
  - Progress bar with percentage
  - Last watched lecture info
  - "Continue Learning" button
- Pull to refresh
- Empty state (if no courses)

**API Call**:
```typescript
GET /enrollments/user/:userId/courses
Params: { search?, page, take }
Response: { data: { result: Enrollment[] } }
```

**Course Card Data**:
```typescript
interface EnrolledCourse {
  enrollment_id: number;
  course: {
    id: number;
    title: string;
    thumbnail_url: string;
    instructor: { name: string };
  };
  progressData: {
    progressPercentage: number;
    completedLecturesCount: number;
    totalLecturesCount: number;
    lastActivity: string;
  };
}
```

**User Actions**:
- Tap course card → Navigate to Course Player
- Pull down → Refresh courses
- Tap profile avatar → Navigate to Profile
- Search → Filter courses by title

---

### 4. Course Player Screen

**Purpose**: Watch lectures and track progress

**Layout**:
- **Top**: Video player (16:9 aspect ratio)
- **Bottom**: Lecture list (collapsible)

**Video Player Components**:
- Video playback controls (play, pause, seek)
- Fullscreen toggle
- Speed control (0.5x, 1x, 1.5x, 2x)
- Quality selector (if available)
- Current time / Total duration
- Progress bar
- "Mark as Complete" button (user can manually mark)

**Lecture List Section**:
- Collapsible sections (course sections)
- Lecture items showing:
  - Lecture title
  - Duration
  - Completion checkmark
  - Lock icon (if not accessible)
- Current lecture highlighted
- Tap to play lecture

**Header**:
- Back button
- Course title
- Overall progress (%)

**API Calls**:
```typescript
// Get course structure
GET /course-content/:courseId/content
Response: { data: { sections: Section[] } }

// Get lecture video
GET /course-content/lectures/:lectureId
Response: { data: { videoUrl, title, ... } }

// Mark complete
POST /enrollments/:enrollmentId/lectures/:lectureId/complete
Body: { courseId }
```

**Progress Tracking**:
- Users manually mark lectures as complete using the "Mark as Complete" button
- Overall course progress bar updates based on completed lectures
- Completion status syncs across devices

**User Flow**:
```
Select Lecture → Load Video → Watch → Tap "Mark as Complete" → Progress updates 
```

---

### 5. Profile Screen

**Purpose**: User settings and account management

**UI Elements**:
- Profile header:
  - Avatar (tap to change)
  - Name
  - Email
- Menu items:
  - Edit Profile
  - Change Password
  - Language (EN/VI toggle)
  - About App
  - Privacy Policy
  - Terms of Service
  - Logout

**Menu Item Actions**:
- **Edit Profile** → Edit Profile Screen
- **Change Password** → Change Password Screen
- **Language** → Toggle EN/VI inline
- **Logout** → Confirm dialog → Clear auth → Login Screen

**API Call**:
```typescript
GET /users/me
Response: { data: User }
```

---

### 6. Edit Profile Screen

**UI Elements**:
- Avatar picker (camera/gallery)
- Name input
- Email (read-only)
- Bio textarea
- Save button
- Cancel button

**API Calls**:
```typescript
PATCH /users/:id
Body: { name, bio }

POST /users/:id/avatar
Body: FormData with avatar file
```

---

### 7. Change Password Screen

**UI Elements**:
- Current password input
- New password input
- Confirm password input
- Save button
- Validation messages

**Validation**:
- Current password required
- New password min 8 chars
- Confirm must match new password

**API Call**:
```typescript
PATCH /users/password/:id
Body: { id, password: currentPassword, newPassword }
```

---

## Technology Stack

### Installation

```bash
# Create Expo project
npx create-expo-app mindful-maze-mobile --template blank-typescript

# Install dependencies
npx expo install @react-navigation/native @react-navigation/native-stack
npx expo install react-native-screens react-native-safe-area-context react-native-gesture-handler
npm install react-native-paper axios react-hook-form zod
npx expo install expo-av @react-native-async-storage/async-storage
npm install i18next react-i18next
npx expo install expo-localization expo-image-picker
```

### Core Libraries
- **Framework**: Expo SDK 52+
- **UI**: React Native Paper 5.x
- **Navigation**: React Navigation 6.x (Stack)
- **Video**: expo-av
- **Storage**: AsyncStorage
- **Forms**: React Hook Form + Zod
- **i18n**: i18next + react-i18next
- **API**: Axios

---

## Project Structure

```
mindful-maze-mobile/
├── app/
│   ├── index.tsx                 # App entry (check onboarding)
│   ├── onboarding.tsx            # Onboarding screens
│   ├── login.tsx                 # Login screen
│   ├── my-learning/
│   │   ├── index.tsx             # My Learning list
│   │   └── [courseId].tsx        # Course player
│   ├── profile/
│   │   ├── index.tsx             # Profile main
│   │   ├── edit.tsx              # Edit profile
│   │   └── password.tsx          # Change password
│   └── _layout.tsx               # Root layout
├── api/
│   ├── client.ts                 # Axios instance
│   └── endpoints/
│       ├── auth.ts
│       ├── enrollments.ts
│       ├── courseContent.ts
│       └── users.ts
├── assets/
│   ├── images/
│   ├── fonts/
│   └── icons/
├── components/
│   ├── common/
│   │   ├── Button.tsx
│   │   ├── LoadingSpinner.tsx
│   │   └── EmptyState.tsx
│   ├── onboarding/
│   │   └── OnboardingSlide.tsx
│   ├── learning/
│   │   ├── CourseCard.tsx
│   │   ├── VideoPlayer.tsx
│   │   ├── LectureList.tsx
│   │   ├── SectionAccordion.tsx
│   │   └── ProgressBar.tsx
│   └── profile/
│       ├── ProfileHeader.tsx
│       ├── MenuItem.tsx
│       └── AvatarPicker.tsx
├── contexts/
│   ├── AuthContext.tsx
│   └── LanguageContext.tsx
├── hooks/
│   ├── useAuth.ts
│   └── useEnrollments.ts
├── locales/
│   ├── i18n.ts
│   ├── en.json
│   └── vi.json
├── theme/
│   ├── colors.ts
│   ├── typography.ts
│   └── spacing.ts
├── types/
│   ├── entities.ts
│   ├── api.ts
│   └── navigation.ts
├── utils/
│   ├── validation.ts
│   ├── storage.ts
│   └── formatters.ts
├── constants.ts
├── app.json
├── app.config.js
├── eas.json
├── package.json
└── .env
```

---

## Design System

### Colors (Match Web App)

```typescript
// theme/colors.ts
export const colors = {
  primary: {
    main: '#0ea5e9',
    dark: '#0284c7',
    light: '#38bdf8',
  },
  secondary: {
    main: '#8b5cf6',
    dark: '#7c3aed',
    light: '#a78bfa',
  },
  success: {
    main: '#10b981',
    dark: '#059669',
    light: '#34d399',
  },
  background: {
    default: '#f8fafc',
    paper: '#ffffff',
  },
  text: {
    primary: '#1e293b',
    secondary: '#64748b',
  },
};
```

### Typography

```typescript
// theme/typography.ts
export const typography = {
  h1: { fontSize: 32, fontWeight: '700' },
  h2: { fontSize: 28, fontWeight: '600' },
  h3: { fontSize: 24, fontWeight: '600' },
  body1: { fontSize: 16, lineHeight: 24 },
  body2: { fontSize: 14, lineHeight: 20 },
};
```

---

## API Integration

### Base Configuration

```typescript
// api/client.ts
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://your-backend.com';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

// Add auth token to requests
apiClient.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const refreshToken = await AsyncStorage.getItem('refresh_token');
      const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
        refresh_token: refreshToken,
      });

      const { access_token, refresh_token } = response.data.data;
      await AsyncStorage.multiSet([
        ['access_token', access_token],
        ['refresh_token', refresh_token],
      ]);

      error.config.headers.Authorization = `Bearer ${access_token}`;
      return apiClient(error.config);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

### API Endpoints

#### Authentication
```typescript
// api/endpoints/auth.ts
POST /auth/login
Body: { email, password }
Response: { access_token, refresh_token, user }

POST /auth/google-login
Body: { email, name, googleId }
Response: { access_token, refresh_token, user }

POST /auth/refresh
Body: { refresh_token }
Response: { access_token, refresh_token }
```

#### Enrollments
```typescript
// api/endpoints/enrollments.ts
GET /enrollments/user/:userId/courses
Params: { search?, page, take }
Response: { data: { result: Enrollment[] } }

GET /enrollments/user/:userId/course/:courseId/progress
Response: { data: ProgressData }

POST /enrollments/:enrollmentId/lectures/:lectureId/complete
Body: { courseId }
```

#### Course Content
```typescript
// api/endpoints/courseContent.ts
GET /course-content/:courseId/content
Response: { data: { sections: Section[] } }

GET /course-content/lectures/:lectureId
Response: { data: Lecture }

GET /course-content/lecture/:lectureId/captions
Response: { data: { srt, vtt, transcript } }
```

#### User Profile
```typescript
// api/endpoints/users.ts
GET /users/me
Response: { data: User }

PATCH /users/:id
Body: { name, bio }

POST /users/:id/avatar
Body: FormData with avatar

PATCH /users/password/:id
Body: { id, password: currentPassword, newPassword }
```

---

## Key Components

### AuthContext

```typescript
// contexts/AuthContext.tsx
import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as authApi from '../api/endpoints/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const userData = await AsyncStorage.getItem('user');
    if (userData) setUser(JSON.parse(userData));
    setIsLoading(false);
  };

  const login = async (email, password) => {
    const response = await authApi.login({ email, password });
    if (response.statusCode === 201) {
      await AsyncStorage.multiSet([
        ['user', JSON.stringify(response.data)],
        ['access_token', response.data.access_token],
        ['refresh_token', response.data.refresh_token],
      ]);
      setUser(response.data);
    }
  };

  const logout = async () => {
    await AsyncStorage.multiRemove(['user', 'access_token', 'refresh_token']);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
```

### Navigation Setup

```typescript
// app/_layout.tsx
import { Stack } from 'expo-router';
import { AuthProvider } from '../contexts/AuthContext';
import { LanguageProvider } from '../contexts/LanguageProvider';

export default function RootLayout() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="login" />
          <Stack.Screen name="my-learning" />
          <Stack.Screen name="profile" />
        </Stack>
      </AuthProvider>
    </LanguageProvider>
  );
}
```

### App Entry Point

```typescript
// app/index.tsx
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../contexts/AuthContext';

export default function Index() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    async function checkOnboarding() {
      const completed = await AsyncStorage.getItem('@onboarding_completed');

      if (!completed) {
        router.replace('/onboarding');
      } else if (user) {
        router.replace('/my-learning');
      } else {
        router.replace('/login');
      }
    }

    if (!isLoading) {
      checkOnboarding();
    }
  }, [user, isLoading]);

  return <LoadingSpinner />;
}
```

---

## Multi-Language Support

### Translation Files

```typescript
// locales/en.json
{
  "onboarding": {
    "title": "Mindful Maze",
    "subtitle": "Your Learning Companion",
    "slide1Title": "Learn Anywhere",
    "slide1Desc": "Study your enrolled courses on the go",
    "slide2Title": "Track Progress",
    "slide2Desc": "Monitor your learning journey",
    "slide3Title": "Learn at Your Pace",
    "slide3Desc": "Watch lectures at your convenience",
    "getStarted": "Get Started",
    "skip": "Skip"
  },
  "auth": {
    "welcomeBack": "Welcome Back",
    "email": "Email",
    "password": "Password",
    "rememberMe": "Remember Me",
    "login": "Login",
    "forgotPassword": "Forgot Password?",
    "continueWithGoogle": "Continue with Google",
    "noAccount": "Don't have an account? Contact admin"
  },
  "myLearning": {
    "title": "My Learning",
    "search": "Search courses...",
    "all": "All",
    "inProgress": "In Progress",
    "completed": "Completed",
    "continue": "Continue Learning",
    "noCourses": "No enrolled courses yet"
  },
  "profile": {
    "title": "Profile",
    "editProfile": "Edit Profile",
    "changePassword": "Change Password",
    "language": "Language",
    "about": "About",
    "privacy": "Privacy Policy",
    "terms": "Terms of Service",
    "logout": "Logout"
  }
}
```

```typescript
// locales/vi.json
{
  "onboarding": {
    "title": "Mindful Maze",
    "subtitle": "Người đồng hành học tập",
    "slide1Title": "Học mọi lúc mọi nơi",
    "slide1Desc": "Học các khóa đã đăng ký trên di động",
    "slide2Title": "Theo dõi tiến độ",
    "slide2Desc": "Giám sát hành trình học tập",
    "slide3Title": "Học theo tốc độ của bạn",
    "slide3Desc": "Xem bài giảng theo sự thuận tiện của bạn",
    "getStarted": "Bắt đầu",
    "skip": "Bỏ qua"
  },
  "auth": {
    "welcomeBack": "Chào mừng trở lại",
    "email": "Email",
    "password": "Mật khẩu",
    "rememberMe": "Ghi nhớ đăng nhập",
    "login": "Đăng nhập",
    "forgotPassword": "Quên mật khẩu?",
    "continueWithGoogle": "Tiếp tục với Google",
    "noAccount": "Chưa có tài khoản? Liên hệ quản trị viên"
  },
  "myLearning": {
    "title": "Khóa học của tôi",
    "search": "Tìm khóa học...",
    "all": "Tất cả",
    "inProgress": "Đang học",
    "completed": "Đã hoàn thành",
    "continue": "Tiếp tục học",
    "noCourses": "Chưa có khóa học nào"
  },
  "profile": {
    "title": "Hồ sơ",
    "editProfile": "Chỉnh sửa hồ sơ",
    "changePassword": "Đổi mật khẩu",
    "language": "Ngôn ngữ",
    "about": "Về ứng dụng",
    "privacy": "Chính sách bảo mật",
    "terms": "Điều khoản sử dụng",
    "logout": "Đăng xuất"
  }
}
```

### i18n Setup

```typescript
// locales/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';
import en from './en.json';
import vi from './vi.json';

i18n
  .use(initReactI18next)
  .init({
    resources: { en: { translation: en }, vi: { translation: vi } },
    fallbackLng: 'en',
    lng: Localization.locale.split('-')[0],
    interpolation: { escapeValue: false },
  });

export default i18n;
```

---

## Data Types

```typescript
// types/entities.ts
interface IUser {
  id: number;
  name: string;
  email: string;
  avatar_url: string;
}

interface IEnrollment {
  id: number;
  student: IUser;
  course: ICourse;
  date_enrolled: Date;
  progressData: {
    progressPercentage: number;
    completedLecturesCount: number;
    totalLecturesCount: number;
    lastActivity: string;
  };
}

interface ICourse {
  id: number;
  title: string;
  description: string;
  instructor: IUser;
  thumbnail_url: string;
}

interface ICourseSection {
  id: string;
  title: string;
  orderIndex: number;
  lectures: ICourseLecture[];
}

interface ICourseLecture {
  id: string;
  title: string;
  contentType: 'video' | 'quiz';
  durationSeconds: number;
  content: VideoContent;
}

interface VideoContent {
  videoUrl: string;
  thumbnailUrl?: string;
}
```

---

## Running the App

```bash
# Development
npx expo start

# iOS
npx expo start --ios

# Android
npx expo start --android

# Build
eas build --platform all
```

---

## Environment Setup

```javascript
// app.config.js
export default {
  expo: {
    name: "Mindful Maze",
    slug: "mindful-maze-mobile",
    version: "1.0.0",
    extra: {
      apiUrl: process.env.EXPO_PUBLIC_API_URL,
    },
  },
};
```

```env
# .env
EXPO_PUBLIC_API_URL=https://your-backend.com
```

---

## Summary

**Mindful Maze** is a focused mobile learning app that allows students to:

✅ Experience smooth onboarding
✅ Login securely
✅ View enrolled courses
✅ Watch video lectures
✅ Track learning progress
✅ Switch between English/Vietnamese

The app is designed for **learning and studying only** - students enroll in courses via the web application.
