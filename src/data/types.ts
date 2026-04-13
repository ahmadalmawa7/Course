export interface Course {
  id: string;
  title: string;
  category: string;
  description: string;
  instructor: string;
  duration: string;
  modules: number;
  price: number;
  image: string;
  level: string;
  enrolled: number;
  rating: number;
  modulesList: { title: string; lessons: number; duration: string }[];
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
