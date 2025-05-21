// Course Interface
export interface ICourse {
    id: number;
    title: string;
    description: string;
    instructor: IUser;
    duration: number;
    date_created: Date;
    last_updated: Date;
    thumbnail: string | null;
    price: number;
    average_rating: number;
    total_students: number;
    sections: ISection[];
    enrollments: IEnrollment[];
    quizzes: IQuiz[];
    reviews: IReview[];
    certifications: ICertification[];
    payments: IPayment[];
    categories: ICategory[];
    thumbnail_url: string | null;
    total_reviews: number;
}

// User Interface
export interface IUser {
    id: number;
    googleId: string | null;
    name: string;
    email: string;
    password: string | null;
    date_joined: Date;
    profile_picture: string | null;
    bio: string | null;
    has_active_subscription: boolean;
    otp: number | null;
    otpExpired: string | null;
    isActive: boolean | null;
    avatar_url: string | null;
    role: IRole | null;
    courses: ICourse[];
    enrollments: IEnrollment[];
    payments: IPayment[];
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
}

// Payment Interface
export interface IPayment {
    id: number;
    user: IUser;
    course: ICourse;
    amount: number;
    payment_date: Date;
    payment_status: string;
    payment_method: string;
    transaction_id: string;
}

// Review Interface
export interface IReview {
    id: number;
    user: IUser;
    course: ICourse;
    rating: number;
    comment: string;
    date_posted: Date;
}

// Quiz Interface
export interface IQuiz {
    id: number;
    title: string;
    description: string;
    course: ICourse;
    questions: IQuestion[];
    submissions: IQuizSubmission[];
}

// Question Interface
export interface IQuestion {
    id: number;
    quiz: IQuiz;
    question_text: string;
    options: string[];
    correct_answer: string;
}

// Quiz Submission Interface
export interface IQuizSubmission {
    id: number;
    user: IUser;
    quiz: IQuiz;
    score: number;
    submission_date: Date;
}

// Section Interface
export interface ISection {
    id: number;
    title: string;
    course: ICourse;
    lessons: ILesson[];
    order: number;
}

// Lesson Interface
export interface ILesson {
    id: number;
    title: string;
    content: string;
    section: ISection;
    order: number;
}

// Role Interface
export interface IRole {
    id: number;
    name: string;
    description: string | null;
    permissions: IPermission[];
    users: IUser[];
}

// Permission Interface
export interface IPermission {
    id: number;
    name: string;
    description: string | null;
    roles: IRole[];
}

// Enrollment Interface
export interface IEnrollment {
    id: number;
    user: IUser;
    course: ICourse;
    enrollment_date: Date;
    completion_status: string;
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
