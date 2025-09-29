// Course Interface
export interface    ICourse {
    id: number;
    title: string;
    description: string;
    instructor: IUser;
    date_created: Date;
    last_updated: Date;
    deleted_at?: Date | null;
    price: number;
    average_rating: number;
    total_students: number;
    language:string;
    sections: ICourseSection[];
    enrollments: IEnrollment[];
    quizzes: IQuiz[];
    reviews: IReview[];
    certifications: ICertification[];
    categories: ICategory[];
    thumbnail_url: string | null;
    total_reviews: number;
    preview_url?: string,
    isActive?:boolean,
    //Display all courses
    isPurchased?:boolean
}

// User Interface
export interface IUser {
    id: number;
    googleId: string | null;
    name: string;
    email: string;
    password: string | null;
    date_joined: Date;
    deleted_at?: Date | null;
    bio: string | null;
    has_active_subscription: boolean;
    otp: number | null;
    otpExpired: string | null;
    isActive: boolean | null;
    avatar_url: string | null;
    role: IRole | null;
    courses: ICourse[];
    enrollments: IEnrollment[];
    subscriptions: ISubscription[];
    certifications: ICertification[];
    reviews: IReview[];
    quiz_submissions: IQuizSubmission[];
}

// Category Interface
export interface ICategory {
    id: number;
    name: string;
    description: string | null;
    courses: ICourse[];
    created_at: Date;
    updated_at: Date;
}


export enum ReviewStatus {
    PUBLISHED = 'published',
    HIDDEN = 'hidden',
  }
// Review Interface
export interface IReview {
    id: number;
    user: IUser;
    course: ICourse;
    rating: number;
    comment: string;
    date_reviewed: Date;
    status: ReviewStatus;
    upVotes: number;
    downVotes: number;
}

// Role Interface
export interface IRole {
    id: number;
    name: string;
    description: string | null;
    isActive: boolean;
    permissions: IPermission[];
    users: IUser[];
}

// Permission Interface
export interface IPermission {
    id: number;
    api: string;
    description: string;
    method: string;
    module: string;
    created: Date;
    updated: Date;
    roles: IRole[];
}

// Enrollment Interface
export interface IEnrollment {
    id: number;
    student: IUser;
    course: ICourse;
    date_enrolled: Date;
    completion_status: string;

    progressData?: {
        progressPercentage: number;
        completedLecturesCount: number;
        totalLecturesCount: number;
        totalWatchTime: number;
        lastActivity: string | null;
    };
}

// Certification Interface
export interface ICertification {
    id: number;
    user: IUser;
    course: ICourse;
    issue_date: Date;
    certificate_url: string;
}

// Subscription Interface
export interface ISubscription {
    id: number;
    user: IUser;
    plan_type: string;
    start_date: Date;
    end_date: Date;
    status: string;
}

// Course Section Interface - matches new API structure
export interface ICourseSection {
    id: string;
    title: string;
    description?: string;
    orderIndex: number;
    lectures: ICourseLecture[];
}

// Course Lecture Interface - matches new API structure
export interface ICourseLecture {
    id: string;
    title: string;
    description?: string;
    contentType: 'video' | 'quiz';
    durationSeconds?: number;
    orderIndex: number;
    isPreview?: boolean;
    content: VideoContent | QuizContent;
    videoFile?: File | null; // For video uploads during creation
}

// Video Quality Interface
export interface IVideoQuality {
    resolution: string;
    url: string;
}

// Course Content Interface - new structure
export interface ICourseContent {
    sections: ICourseSection[];
    metadata: {
        language?: string;
        level?: string;
        whatYoullLearn?: string[];
    };
}


// Caption Response Interface
export interface ICaptionResponse {
    url: string;
    format: string;
}

// Progress Update Interface
export interface IProgressUpdate {
    lectureId: string;
    watchTimeSeconds: number;
    isCompleted: boolean;
    submissionData?: any;
}

// Progress Response Interface
export interface IProgressResponse {
    id: string;
    watchTimeSeconds: number;
    isCompleted: boolean;
    completedAt?: Date;
}

// Student Progress Interface
export interface IStudentProgress {
    enrollmentId: string;
    student: {
        id: number;
        name: string;
        email: string;
        avatar_url?: string;
    };
    enrolledAt: Date;
    completedLectures: number;
    totalLectures: number;
    progressPercentage: number;
}


export interface ICart {
    id: string;
    user: IUser;
    cartItems: ICartItem[];
    isCheckedOut: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface ICartItem {
    id: string;
    cart: ICart;
    course: ICourse;
    price: number;
    addedAt: Date;
}

export enum OrderStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export enum PaymentMethod {
  VNPAY = 'VNPAY',
}

// NEW interface required
export interface IOrderCourse {
  id: number;
  price: number;
  createdAt: string;
  course: {
    id: number;
    title: string;
    description: string;
    thumbnail_url?: string;
    instructor: {
      id: number;
      name: string;
    };
  };
}

// NEW interface required
export interface IStatusHistoryItem {
  status: OrderStatus;
  timestamp: string;
  reason?: string;
}

export interface IOrder {
  id: string;
  totalPrice: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  transactionId?: string; // nullable
  paymentGatewayResponse?: string; // nullable
  user: IUser;
  createdAt: Date;
  updatedAt: Date;
  // New required fields
  orderCourses: IOrderCourse[];           // CRITICAL: Replaces courses[]
  idempotencyKey?: string;                // NEW: For duplicate prevention
  paymentInitiatedAt?: string;            // NEW: Payment start timestamp
  paymentCompletedAt?: string;            // NEW: Payment completion timestamp
  statusHistory?: IStatusHistoryItem[];   // NEW: Audit trail array
}

// ============ COURSE CONTENT DTOs ============

// Video Content Interface
export interface VideoContent {
    videoUrl: string;
    thumbnailUrl?: string;
    cloudinaryPublicId: string;
    quality: IVideoQuality[];
}

// Quiz Content Interface
export interface QuizContent {
    questions: QuizQuestion[];
    passingScore: number;
    timeLimit?: number;
    allowMultipleAttempts: boolean;
}

// Quiz Question Interface
export interface QuizQuestion {
    id: string;
    type: 'multiple_choice' | 'true_false' | 'fill_blank';
    question: string;
    options?: string[];
    correctAnswer: string | number;
    explanation?: string;
    points: number;
}

// Course Content Update DTO
export interface UpsertCourseContentDto {
    language?: string;
    level?: string;
    whatYoullLearn?: string[];
}

// Section DTOs
export interface CreateSectionDto {
    title: string;
    description?: string;
    orderIndex?: number;
}

export interface UpdateSectionDto {
    title?: string;
    description?: string;
    orderIndex?: number;
}

// Lecture DTOs
export interface CreateLectureDto {
    title: string;
    description?: string;
    contentType: 'video' | 'quiz';
    orderIndex?: number;
    durationSeconds?: number;
    isPreview?: boolean;
    content: VideoContent | QuizContent;
}

export interface UpdateLectureDto {
    title?: string;
    description?: string;
    contentType?: 'video' | 'quiz';
    orderIndex?: number;
    durationSeconds?: number;
    isPreview?: boolean;
    content?: VideoContent | QuizContent;
}

// ============ CAPTION MANAGEMENT INTERFACES ============

// Caption Status Enum
export enum CaptionStatus {
    PENDING = 'PENDING',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED'
}

// Caption Format Enum
export enum CaptionFormat {
    SRT = 'SRT'
}

// Caption Source Enum
export enum CaptionSource {
    AUTO_GENERATED = 'AUTO_GENERATED',
    INSTRUCTOR_UPLOADED = 'INSTRUCTOR_UPLOADED'
}

// Caption DTOs
export interface CreateCaptionDto {
    lectureId: string;
    courseId: number;
    videoPublicId: string;
    language?: string;
}

export interface CaptionCueDto {
    start: number;
    end: number;
    text: string;
}

export interface UpdateCaptionDto {
    status?: CaptionStatus;
    cues?: CaptionCueDto[];
    processingError?: string;
}


// Lecture Caption Schema
export interface ILectureCaption {
    lectureId: string;
    courseId: number;
    videoPublicId: string;
    language: string;
    status: CaptionStatus;
    source: CaptionSource;
    cues: CaptionCueDto[];
    files: Record<string, string>;
    processingError?: string;
    transcriptionJobId?: string;
    accuracy?: number;
    reviewedBy?: string;
    reviewedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
