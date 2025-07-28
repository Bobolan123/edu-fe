// Course Interface
export interface ICourse {
    id: number;
    title: string;
    description: string;
    instructor: IUser;
    duration: number;
    date_created: Date;
    last_updated: Date;
    price: number;
    average_rating: number;
    total_students: number;
    language:string;
    sections: ISection[];
    enrollments: IEnrollment[];
    quizzes: IQuiz[];
    reviews: IReview[];
    certifications: ICertification[];
    categories: ICategory[];
    thumbnail_url: string | null;
    total_reviews: number;
    preview_url?: string,
    active?:boolean,
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


// Review Interface
export interface IReview {
    id: number;
    user: IUser;
    course: ICourse;
    rating: number;
    comment: string;
    date_posted: Date;
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

export interface ILecture {
    _id:string;
    title: string;
    videoUrl: string;
}

export interface ISection {
    _id:string;
    title: string;
    totalLectures: number;
    lectures: ILecture[];
}

export interface ICourseContent {
    courseId: number;
    sections: ISection[];
    totalLength: number;
    totalLectures: number;
    whatYoullLearn: string[];
    createdAt?: Date;
    updatedAt?: Date;
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
  PAYPAL = 'PAYPAL',
  CREDIT_CARD = 'CREDIT_CARD',
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
}
