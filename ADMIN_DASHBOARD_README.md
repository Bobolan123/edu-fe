\# Admin Dashboard - Educational Platform

## Overview

A comprehensive admin dashboard for managing your educational platform built with Next.js 15, TypeScript, Material-UI v6, and NextAuth v5.

## Features

### 🏠 Dashboard Home
- **Key Metrics**: Total courses, users, orders, enrollments, revenue, and reviews
- **Recent Activity**: Real-time activity feed showing latest actions
- **Quick Actions**: Fast access to common admin tasks

### 📚 Course Management
- **Course Table**: Paginated list with search and filtering
- **Course Details**: View course information, ratings, and student count
- **CRUD Operations**: Create, edit, and delete courses
- **Category Assignment**: Assign multiple categories to courses
- **Thumbnail Upload**: Upload and manage course thumbnails
- **Content Management**: Manage course sections and lectures

### 👥 User Management
- **User Table**: Comprehensive user listing with search and role filtering
- **User Details**: View detailed user information and statistics
- **Role Management**: Edit user roles (Student, Instructor, Admin)
- **User Actions**: Suspend/activate users, view enrollment history
- **Account Management**: Delete user accounts with confirmation

### 🏷️ Category Management
- **Category CRUD**: Create, edit, and delete course categories
- **Category Usage**: Track how many courses use each category
- **Bulk Operations**: Manage categories efficiently
- **Search & Filter**: Find categories quickly

### ⭐ Review Management
- **Review Moderation**: View and moderate all course reviews
- **Rating Filters**: Filter reviews by star rating
- **Review Details**: View full review content and user information
- **Review Actions**: Delete inappropriate reviews
- **Course Context**: See which course each review belongs to

### 📊 Enrollment Management
- **Progress Tracking**: Monitor student progress across all courses
- **Enrollment Status**: Track completion status (Not Started, In Progress, Completed)
- **Student Details**: View detailed enrollment information
- **Progress Analytics**: Visual progress indicators with percentages

### 🛒 Order Management
- **Order Tracking**: Monitor all platform orders and transactions
- **Payment Methods**: Support for VNPay, PayPal, and Credit Card
- **Status Management**: Update order status (Pending, Completed, Failed)
- **Order Details**: View comprehensive order information
- **Customer Information**: Access customer details for each order

## Technical Implementation

### Authentication & Authorization
- **Role-Based Access**: Only users with 'admin' role can access the dashboard
- **Middleware Protection**: Admin routes protected at the middleware level
- **Session Management**: Integrated with NextAuth v5 for secure authentication

### Data Management
- **Server Actions**: Utilizes Next.js server actions for data operations
- **Real-time Updates**: Automatic data revalidation after mutations
- **Pagination**: Efficient data loading with server-side pagination
- **Search & Filtering**: Advanced filtering capabilities across all entities

### UI/UX Design
- **Material-UI v6**: Modern, responsive design components
- **Consistent Theme**: Unified design language across all pages
- **Mobile Responsive**: Optimized for all device sizes
- **Loading States**: Proper loading indicators and error handling
- **Form Validation**: Comprehensive form validation using React Hook Form + Zod

## File Structure

```
src/
├── app/[locale]/admin/
│   ├── layout.tsx              # Admin layout with sidebar
│   ├── page.tsx                # Dashboard home page
│   ├── courses/page.tsx        # Course management
│   ├── users/page.tsx          # User management
│   ├── categories/page.tsx     # Category management
│   ├── reviews/page.tsx        # Review management
│   ├── enrollments/page.tsx    # Enrollment management
│   └── orders/page.tsx         # Order management
├── components/Admin/
│   ├── AdminSidebar.tsx        # Navigation sidebar
│   ├── AdminDashboardStats.tsx # Dashboard statistics
│   ├── AdminRecentActivity.tsx # Recent activity feed
│   ├── AdminCoursesTable.tsx   # Course management table
│   ├── AdminCourseForm.tsx     # Course creation/editing form
│   ├── AdminUsersTable.tsx     # User management table
│   ├── AdminUserDetailsDialog.tsx # User details modal
│   ├── AdminCategoriesTable.tsx # Category management table
│   ├── AdminCategoryForm.tsx   # Category creation/editing form
│   ├── AdminReviewsTable.tsx   # Review management table
│   ├── AdminEnrollmentsTable.tsx # Enrollment management table
│   └── AdminOrdersTable.tsx    # Order management table
└── actions/
    ├── userActions.ts          # User management server actions
    ├── orderActions.ts         # Order management server actions
    └── categoriesAction.ts     # Enhanced category actions
```

## Usage Instructions

### Accessing the Admin Dashboard
1. Ensure you have an account with 'admin' role
2. Navigate to `/admin` (will redirect to `/[locale]/admin`)
3. The middleware will verify your admin privileges

### Managing Courses
1. Go to **Courses** section
2. Use the search bar to find specific courses
3. Click **Add Course** to create new courses
4. Use action buttons to view, edit, or delete courses
5. Edit course content through the course management interface

### Managing Users
1. Navigate to **Users** section
2. Filter users by role using the dropdown
3. Click on a user to view detailed information
4. Use the edit button to change user roles
5. Suspend/activate users as needed

### Managing Categories
1. Access **Categories** section
2. Create new categories with descriptions
3. Edit existing categories
4. Note: Categories with assigned courses cannot be deleted

### Moderating Reviews
1. Visit **Reviews** section
2. Filter reviews by rating if needed
3. View full review content in detail modal
4. Delete inappropriate reviews with confirmation

### Tracking Enrollments
1. Go to **Enrollments** section
2. Monitor student progress across all courses
3. View detailed enrollment information
4. Track completion rates and progress percentages

### Managing Orders
1. Access **Orders** section
2. Filter orders by status (Pending, Completed, Failed)
3. View detailed order information including payment methods
4. Update order status as needed

## Security Features

- **Role-based access control** at middleware level
- **Input validation** using Zod schemas
- **CSRF protection** through NextAuth
- **Secure API endpoints** with authentication checks
- **Data sanitization** for all user inputs

## Performance Optimizations

- **Server-side pagination** for large datasets
- **Optimistic updates** for better UX
- **Proper caching** with Next.js revalidation
- **Lazy loading** of components and data
- **Efficient search** with debounced inputs

## Customization

The admin dashboard is highly customizable:

1. **Themes**: Modify the Material-UI theme in `src/app/[locale]/theme.ts`
2. **Permissions**: Extend role-based permissions in middleware
3. **Statistics**: Add custom metrics to the dashboard home
4. **Actions**: Extend server actions for additional functionality
5. **UI Components**: Customize table layouts and form designs

## Future Enhancements

Potential improvements to consider:

- **Advanced Analytics**: Charts and graphs for better data visualization
- **Bulk Operations**: Mass actions for users and courses
- **Export Functionality**: CSV/PDF exports for reports
- **Email Notifications**: Automated admin notifications
- **Audit Logs**: Track admin actions and changes
- **Advanced Permissions**: Granular permission system
- **Real-time Updates**: WebSocket integration for live data

## Support

For questions or issues with the admin dashboard, refer to the main application documentation or contact the development team.
