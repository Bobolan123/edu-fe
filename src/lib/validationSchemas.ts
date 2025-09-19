import { z } from 'zod';

// Common validation patterns
const email = z.string().email('Invalid email format');
const password = z.string().min(8, 'Password must be at least 8 characters');
const phone = z.string().regex(/^[\+]?[1-9][\d]{0,15}$/, 'Invalid phone number');
const url = z.string().url('Invalid URL format');

// Authentication schemas
export const loginSchema = z.object({
  email: email.min(1, 'Email is required'),
  password: z.string().min(1, 'Password is required'),
});

export const signupSchema = z.object({
  fullname: z.string().min(2, 'Full name must be at least 2 characters').max(50, 'Full name is too long'),
  email: email.min(1, 'Email is required'),
  password: password.regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    'Password must contain at least one lowercase letter, one uppercase letter, and one number'
  ),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const forgotPasswordSchema = z.object({
  email: email.min(1, 'Email is required'),
});

export const resetPasswordSchema = z.object({
  otp: z.string().length(6, 'OTP must be exactly 6 digits').regex(/^\d+$/, 'OTP must contain only numbers'),
  newPassword: password.regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    'Password must contain at least one lowercase letter, one uppercase letter, and one number'
  ),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const otpSchema = z.object({
  otp: z.string().length(6, 'OTP must be exactly 6 digits').regex(/^\d+$/, 'OTP must contain only numbers'),
});

// Course creation schemas
export const courseSectionSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Section title is required').max(100, 'Section title is too long'),
  lectures: z.array(z.object({
    id: z.string().optional(),
    title: z.string().min(1, 'Lecture title is required').max(100, 'Lecture title is too long'),
    duration: z.number().min(1, 'Duration must be at least 1 second'),
    videoFile: z.any().optional(),
    videoUrl: z.string().optional(),
  })).min(1, 'Each section must have at least one lecture'),
});

export const createCourseSchema = z.object({
  title: z.string().min(1, 'Course title is required').max(200, 'Course title is too long'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(2000, 'Description is too long'),
  price: z.number().min(1000, 'Price must be at least 1000 VND').max(10000000, 'Price is too high'),
  duration: z.number().min(1, 'Duration must be at least 1 minute'),
  language: z.string().min(1, 'Language is required'),
  categories: z.array(z.number()).min(1, 'At least one category is required'),
  thumbnail: z.any().optional(),
  learningOutcomes: z.array(z.string().min(1, 'Learning outcome cannot be empty')).min(1, 'At least one learning outcome is required'),
  sections: z.array(courseSectionSchema).min(1, 'At least one section is required'),
});

// Profile schemas
export const profileSchema = z.object({
  fullname: z.string().min(2, 'Full name must be at least 2 characters').max(50, 'Full name is too long'),
  email: email,
  phone: phone.optional().or(z.literal('')),
  bio: z.string().max(500, 'Bio is too long').optional(),
  website: url.optional().or(z.literal('')),
  avatar: z.any().optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: password.regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    'Password must contain at least one lowercase letter, one uppercase letter, and one number'
  ),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
}).refine((data) => data.currentPassword !== data.newPassword, {
  message: "New password must be different from current password",
  path: ["newPassword"],
});

// Contact/Support schemas
export const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name is too long'),
  email: email.min(1, 'Email is required'),
  subject: z.string().min(1, 'Subject is required').max(100, 'Subject is too long'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(1000, 'Message is too long'),
});

// Search/Filter schemas
export const courseFilterSchema = z.object({
  search: z.string().optional(),
  categories: z.array(z.number()).optional(),
  priceRange: z.object({
    min: z.number().min(0),
    max: z.number().min(0),
  }).optional(),
  rating: z.number().min(0).max(5).optional(),
  duration: z.object({
    min: z.number().min(0),
    max: z.number().min(0),
  }).optional(),
  sortBy: z.enum(['newest', 'oldest', 'price_low', 'price_high', 'rating', 'popular']).optional(),
});

// Payment schemas
export const checkoutSchema = z.object({
  paymentMethod: z.enum(['VNPAY'], {
    required_error: 'Payment method is required',
  }),
  termsAccepted: z.boolean().refine(val => val === true, {
    message: 'You must accept the terms and conditions',
  }),
});

// Review schemas
export const reviewSchema = z.object({
  rating: z.number().min(1, 'Rating is required').max(5, 'Rating cannot exceed 5 stars'),
  comment: z.string().min(10, 'Review must be at least 10 characters').max(500, 'Review is too long'),
});

// File upload schemas
export const fileUploadSchema = z.object({
  file: z.any()
    .refine((file) => file instanceof File, 'File is required')
    .refine((file) => file?.size <= 50 * 1024 * 1024, 'File size must be less than 50MB'), // 50MB
});

export const imageUploadSchema = z.object({
  file: z.any()
    .refine((file) => file instanceof File, 'Image is required')
    .refine((file) => file?.size <= 5 * 1024 * 1024, 'Image size must be less than 5MB') // 5MB
    .refine(
      (file) => ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file?.type),
      'Only JPEG, PNG and WebP images are allowed'
    ),
});

export const videoUploadSchema = z.object({
  file: z.any()
    .refine((file) => file instanceof File, 'Video is required')
    .refine((file) => file?.size <= 500 * 1024 * 1024, 'Video size must be less than 500MB') // 500MB
    .refine(
      (file) => ['video/mp4', 'video/webm', 'video/ogg'].includes(file?.type),
      'Only MP4, WebM and OGG videos are allowed'
    ),
});

// Type exports for TypeScript
export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type OtpFormData = z.infer<typeof otpSchema>;
export type CreateCourseFormData = z.infer<typeof createCourseSchema>;
export type ProfileFormData = z.infer<typeof profileSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
export type ContactFormData = z.infer<typeof contactSchema>;
export type CourseFilterFormData = z.infer<typeof courseFilterSchema>;
export type CheckoutFormData = z.infer<typeof checkoutSchema>;
export type ReviewFormData = z.infer<typeof reviewSchema>;
export type FileUploadFormData = z.infer<typeof fileUploadSchema>;
export type ImageUploadFormData = z.infer<typeof imageUploadSchema>;
export type VideoUploadFormData = z.infer<typeof videoUploadSchema>;