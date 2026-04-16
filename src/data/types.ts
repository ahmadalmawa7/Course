export interface CourseModule {
  title: string;
  lessons: number;
  duration: string;
  topics?: string[];
}

export interface CourseReview {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface RecordedLecture {
  id: string;
  moduleIndex: number;
  title: string;
  duration: string;
  videoUrl: string;
  isPreview: boolean;
}

export interface Course {
  id: string;
  title: string;
  category: string;
  description: string;
  instructor: string;
  instructorBio?: string;
  duration: string;
  modules: number;
  price: number;
  originalPrice?: number;
  image: string;
  level: string;
  enrolled: number;
  rating: number;
  totalRatings?: number;
  modulesList: CourseModule[];
  // Rich fields
  highlights?: string[];          // "What you'll learn" bullet points
  whyTake?: string;               // Why this course paragraph
  advantages?: string[];          // Advantages / who this is for
  requirements?: string[];        // Prerequisites
  targetAudience?: string[];      // Who should take this
  language?: string;
  certificate?: boolean;
  liveSessionsIncluded?: boolean;
  notesIncluded?: boolean;
  recordedLectures?: RecordedLecture[];
  reviews?: CourseReview[];
  syllabus?: string;              // Long-form syllabus text
  tags?: string[];
  lastUpdated?: string;
}

export interface LiveClass {
  id: string;
  title: string;
  instructor: string;
  date: string;
  time: string;
  meetLink: string;
  courseId: string;
  description: string;
}

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  readTime: string;
  image: string;
  comments: { id: string; user: string; text: string; date: string; reply?: string }[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  profileImage: string;
  enrolledCourses: string[];
  completedCourses: string[];
  progress: Record<string, number>;
  certificates: Certificate[];
}

export interface Certificate {
  id: string;
  courseId: string;
  courseName: string;
  studentName: string;
  instructor: string;
  completionDate: string;
}

export interface Payment {
  id: string;
  userId: string;
  courseId: string;
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  courseName: string;
  userName: string;
}

export interface Note {
  id: string;
  title: string;
  courseId: string;
  category: string;
  description: string;
  fileUrl: string;
  uploadDate: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  text: string;
  rating: number;
  approved: boolean;
  date: string;
}

export interface Enquiry {
  id: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  date: string;
  status: 'new' | 'contacted' | 'resolved';
}

export interface ArticleRequest {
  id: string;
  userId: string;
  userName: string;
  email: string;
  topic: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  subject: string;
  messages: { sender: 'user' | 'admin'; text: string; date: string }[];
  status: 'open' | 'closed';
  date: string;
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  paymentStatus: 'success' | 'pending' | 'failed';
  progress: number;
  enrolledAt: string;
  lastAccessedAt?: string;
}

export interface LectureProgress {
  id: string;
  userId: string;
  lectureId: string;
  courseId: string;
  completed: boolean;
  watchTime: number;
  completedAt?: string;
}