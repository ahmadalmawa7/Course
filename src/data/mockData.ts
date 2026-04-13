import { Course, LiveClass, Article, User, Payment, Note, Testimonial, Enquiry, ArticleRequest, SupportTicket } from './types';

export const courses: Course[] = [
  {
    id: 'c1', title: 'Leadership Excellence Program', category: 'Leadership Development',
    description: 'Master the art of leadership with strategies from military and corporate leaders. This comprehensive program covers strategic thinking, decision-making under pressure, and building high-performance teams.',
    instructor: 'Lt Col Shreesh Kumar (Retd)', duration: '8 weeks', modules: 12, price: 15999, image: '', level: 'Advanced', enrolled: 234, rating: 4.9,
    modulesList: [
      { title: 'Foundations of Leadership', lessons: 4, duration: '2 hrs' },
      { title: 'Strategic Thinking', lessons: 3, duration: '1.5 hrs' },
      { title: 'Decision Making Under Pressure', lessons: 4, duration: '2 hrs' },
      { title: 'Building High-Performance Teams', lessons: 3, duration: '1.5 hrs' },
      { title: 'Communication for Leaders', lessons: 4, duration: '2 hrs' },
      { title: 'Conflict Resolution', lessons: 3, duration: '1.5 hrs' },
      { title: 'Change Management', lessons: 4, duration: '2 hrs' },
      { title: 'Ethical Leadership', lessons: 3, duration: '1.5 hrs' },
      { title: 'Coaching & Mentoring', lessons: 4, duration: '2 hrs' },
      { title: 'Crisis Leadership', lessons: 3, duration: '1.5 hrs' },
      { title: 'Leading Innovation', lessons: 4, duration: '2 hrs' },
      { title: 'Leadership Capstone Project', lessons: 2, duration: '3 hrs' },
    ],
  },
  {
    id: 'c2', title: 'Corporate Communication Mastery', category: 'Communication Skills',
    description: 'Develop impactful communication skills for the corporate world. Learn to present ideas persuasively, write effective business communication, and master cross-cultural interactions.',
    instructor: 'Lt Col Shreesh Kumar (Retd)', duration: '6 weeks', modules: 8, price: 9999, image: '', level: 'Intermediate', enrolled: 412, rating: 4.8,
    modulesList: [
      { title: 'Business Communication Fundamentals', lessons: 4, duration: '2 hrs' },
      { title: 'Written Communication Excellence', lessons: 3, duration: '1.5 hrs' },
      { title: 'Verbal Communication & Public Speaking', lessons: 4, duration: '2 hrs' },
      { title: 'Non-Verbal Communication', lessons: 3, duration: '1 hr' },
      { title: 'Cross-Cultural Communication', lessons: 3, duration: '1.5 hrs' },
      { title: 'Negotiation Skills', lessons: 4, duration: '2 hrs' },
      { title: 'Email & Digital Communication', lessons: 3, duration: '1 hr' },
      { title: 'Communication Capstone', lessons: 2, duration: '2 hrs' },
    ],
  },
  {
    id: 'c3', title: 'Personality Development Masterclass', category: 'Personality Development',
    description: 'Transform your personal and professional persona. Build confidence, develop emotional intelligence, and create a lasting impression in every interaction.',
    instructor: 'Lt Col Shreesh Kumar (Retd)', duration: '4 weeks', modules: 6, price: 7999, image: '', level: 'Beginner', enrolled: 567, rating: 4.7,
    modulesList: [
      { title: 'Self-Awareness & Assessment', lessons: 4, duration: '2 hrs' },
      { title: 'Building Confidence', lessons: 3, duration: '1.5 hrs' },
      { title: 'Emotional Intelligence', lessons: 4, duration: '2 hrs' },
      { title: 'Professional Image & Grooming', lessons: 3, duration: '1 hr' },
      { title: 'Interpersonal Skills', lessons: 4, duration: '2 hrs' },
      { title: 'Personal Branding', lessons: 3, duration: '1.5 hrs' },
    ],
  },
  {
    id: 'c4', title: 'Campus to Corporate Transition', category: 'Campus to Corporate',
    description: 'Bridge the gap between academic life and corporate career. Learn workplace etiquette, professional skills, and career development strategies.',
    instructor: 'Lt Col Shreesh Kumar (Retd)', duration: '3 weeks', modules: 5, price: 5999, image: '', level: 'Beginner', enrolled: 891, rating: 4.8,
    modulesList: [
      { title: 'Understanding Corporate Culture', lessons: 4, duration: '2 hrs' },
      { title: 'Workplace Etiquette', lessons: 3, duration: '1.5 hrs' },
      { title: 'Resume & Interview Preparation', lessons: 4, duration: '2 hrs' },
      { title: 'First 90 Days Strategy', lessons: 3, duration: '1.5 hrs' },
      { title: 'Career Growth Planning', lessons: 3, duration: '1.5 hrs' },
    ],
  },
  {
    id: 'c5', title: 'Business Etiquette & Protocol', category: 'Business Etiquette',
    description: 'Master the unwritten rules of business. From boardroom behavior to networking events, learn the protocols that set professionals apart.',
    instructor: 'Lt Col Shreesh Kumar (Retd)', duration: '3 weeks', modules: 5, price: 6999, image: '', level: 'Intermediate', enrolled: 345, rating: 4.6,
    modulesList: [
      { title: 'Professional Etiquette Fundamentals', lessons: 3, duration: '1.5 hrs' },
      { title: 'Dining & Social Etiquette', lessons: 3, duration: '1.5 hrs' },
      { title: 'Meeting & Conference Protocol', lessons: 4, duration: '2 hrs' },
      { title: 'Digital & Email Etiquette', lessons: 3, duration: '1 hr' },
      { title: 'International Business Protocol', lessons: 3, duration: '1.5 hrs' },
    ],
  },
  {
    id: 'c6', title: 'Presentation Skills Workshop', category: 'Presentation Skills',
    description: 'Create and deliver compelling presentations that influence and inspire.',
    instructor: 'Lt Col Shreesh Kumar (Retd)', duration: '4 weeks', modules: 6, price: 8499, image: '', level: 'Intermediate', enrolled: 278, rating: 4.7,
    modulesList: [
      { title: 'Structuring Your Presentation', lessons: 3, duration: '1.5 hrs' },
      { title: 'Storytelling for Business', lessons: 4, duration: '2 hrs' },
      { title: 'Visual Design Principles', lessons: 3, duration: '1.5 hrs' },
      { title: 'Delivery & Stage Presence', lessons: 4, duration: '2 hrs' },
      { title: 'Handling Q&A Sessions', lessons: 3, duration: '1 hr' },
      { title: 'Virtual Presentations', lessons: 3, duration: '1.5 hrs' },
    ],
  },
  {
    id: 'c7', title: 'Time Management & Productivity', category: 'Time Management',
    description: 'Maximize your productivity with proven time management frameworks.',
    instructor: 'Lt Col Shreesh Kumar (Retd)', duration: '3 weeks', modules: 5, price: 5499, image: '', level: 'Beginner', enrolled: 623, rating: 4.5,
    modulesList: [
      { title: 'Time Audit & Assessment', lessons: 3, duration: '1 hr' },
      { title: 'Prioritization Frameworks', lessons: 4, duration: '2 hrs' },
      { title: 'Focus & Deep Work', lessons: 3, duration: '1.5 hrs' },
      { title: 'Delegation & Efficiency', lessons: 3, duration: '1.5 hrs' },
      { title: 'Building Sustainable Habits', lessons: 3, duration: '1 hr' },
    ],
  },
  {
    id: 'c8', title: 'Project Management Essentials', category: 'Project Management',
    description: 'Learn project management methodologies from an experienced military and corporate leader.',
    instructor: 'Lt Col Shreesh Kumar (Retd)', duration: '6 weeks', modules: 8, price: 12999, image: '', level: 'Intermediate', enrolled: 189, rating: 4.8,
    modulesList: [
      { title: 'Project Management Fundamentals', lessons: 4, duration: '2 hrs' },
      { title: 'Project Planning & Scoping', lessons: 3, duration: '1.5 hrs' },
      { title: 'Resource Management', lessons: 4, duration: '2 hrs' },
      { title: 'Risk Management', lessons: 3, duration: '1.5 hrs' },
      { title: 'Agile Methodologies', lessons: 4, duration: '2 hrs' },
      { title: 'Stakeholder Management', lessons: 3, duration: '1.5 hrs' },
      { title: 'Quality Assurance', lessons: 3, duration: '1 hr' },
      { title: 'Project Delivery & Closure', lessons: 2, duration: '2 hrs' },
    ],
  },
  {
    id: 'c9', title: 'Life Skills for Professionals', category: 'Life Skills',
    description: 'Develop essential life skills that complement your professional growth.',
    instructor: 'Lt Col Shreesh Kumar (Retd)', duration: '4 weeks', modules: 6, price: 6499, image: '', level: 'Beginner', enrolled: 445, rating: 4.6,
    modulesList: [
      { title: 'Stress Management', lessons: 3, duration: '1.5 hrs' },
      { title: 'Emotional Resilience', lessons: 4, duration: '2 hrs' },
      { title: 'Work-Life Balance', lessons: 3, duration: '1 hr' },
      { title: 'Financial Literacy', lessons: 3, duration: '1.5 hrs' },
      { title: 'Health & Wellness', lessons: 3, duration: '1 hr' },
      { title: 'Mindfulness & Focus', lessons: 3, duration: '1.5 hrs' },
    ],
  },
  {
    id: 'c10', title: 'Train the Trainer', category: 'Corporate Readiness',
    description: 'Learn how to design, develop and deliver impactful training programs.',
    instructor: 'Lt Col Shreesh Kumar (Retd)', duration: '5 weeks', modules: 7, price: 11999, image: '', level: 'Advanced', enrolled: 156, rating: 4.9,
    modulesList: [
      { title: 'Training Needs Analysis', lessons: 3, duration: '1.5 hrs' },
      { title: 'Instructional Design', lessons: 4, duration: '2 hrs' },
      { title: 'Content Development', lessons: 3, duration: '1.5 hrs' },
      { title: 'Facilitation Techniques', lessons: 4, duration: '2 hrs' },
      { title: 'Learner Engagement', lessons: 3, duration: '1.5 hrs' },
      { title: 'Assessment & Evaluation', lessons: 3, duration: '1 hr' },
      { title: 'Training Technology', lessons: 3, duration: '1.5 hrs' },
    ],
  },
];

export const liveClasses: LiveClass[] = [
  { id: 'lc1', title: 'Leadership in Uncertain Times', instructor: 'Lt Col Shreesh Kumar (Retd)', date: '2026-04-15', time: '10:00 AM IST', meetLink: 'https://meet.google.com/abc-defg-hij', courseId: 'c1', description: 'Interactive session on leading teams through uncertainty and change.' },
  { id: 'lc2', title: 'Effective Business Writing', instructor: 'Lt Col Shreesh Kumar (Retd)', date: '2026-04-16', time: '2:00 PM IST', meetLink: 'https://meet.google.com/klm-nopq-rst', courseId: 'c2', description: 'Learn to write impactful business emails and reports.' },
  { id: 'lc3', title: 'Building Confidence Workshop', instructor: 'Lt Col Shreesh Kumar (Retd)', date: '2026-04-17', time: '11:00 AM IST', meetLink: 'https://meet.google.com/uvw-xyz-123', courseId: 'c3', description: 'Practical exercises to build unshakable confidence.' },
  { id: 'lc4', title: 'Corporate Readiness Bootcamp', instructor: 'Lt Col Shreesh Kumar (Retd)', date: '2026-04-18', time: '3:00 PM IST', meetLink: 'https://meet.google.com/456-789-abc', courseId: 'c4', description: 'Intensive preparation for the corporate world.' },
  { id: 'lc5', title: 'Presentation Masterclass', instructor: 'Lt Col Shreesh Kumar (Retd)', date: '2026-04-19', time: '10:00 AM IST', meetLink: 'https://meet.google.com/def-ghi-jkl', courseId: 'c6', description: 'Live demonstration of advanced presentation techniques.' },
  { id: 'lc6', title: 'Time Management Strategies', instructor: 'Lt Col Shreesh Kumar (Retd)', date: '2026-04-20', time: '4:00 PM IST', meetLink: 'https://meet.google.com/mno-pqr-stu', courseId: 'c7', description: 'Practical frameworks for maximizing productivity.' },
];

export const articles: Article[] = [
  {
    id: 'a1', title: 'The Art of Strategic Leadership in Modern Organizations',
    excerpt: 'Explore how strategic leadership principles from military doctrine can transform corporate decision-making.',
    content: 'Strategic leadership is not merely about making decisions—it is about creating the conditions under which good decisions naturally emerge.\n\nThe first principle is clarity of purpose. Every great military operation begins with a clear mission statement.\n\nThe second principle is adaptability. Leaders who rigidly adhere to plans in the face of changing circumstances inevitably fail.\n\nThe third principle is empowerment. Mission command produces superior results compared to micromanagement.',
    author: 'Lt Col Shreesh Kumar (Retd)', date: '2026-03-10', category: 'Leadership', readTime: '8 min read', image: '',
    comments: [
      { id: 'cm1', user: 'Rahul Sharma', text: 'Excellent insights on applying military leadership principles.', date: '2026-03-11', reply: 'Thank you, Rahul. The parallels are indeed profound.' },
      { id: 'cm2', user: 'Priya Patel', text: 'Very insightful article. Would love more on adaptability.', date: '2026-03-12' },
    ],
  },
  {
    id: 'a2', title: 'Communication: The Cornerstone of Professional Success',
    excerpt: 'Why communication skills remain the most sought-after competency in the corporate world.',
    content: 'In every survey of employers worldwide, communication skills consistently rank as the most desired competency.\n\nEffective communication is not about eloquence—it is about clarity, empathy, and impact.',
    author: 'Lt Col Shreesh Kumar (Retd)', date: '2026-03-05', category: 'Communication Skills', readTime: '6 min read', image: '',
    comments: [{ id: 'cm3', user: 'Amit Kumar', text: 'Exactly what I needed before my upcoming presentation.', date: '2026-03-06' }],
  },
  {
    id: 'a3', title: 'From Campus to Boardroom: Navigating Your First Corporate Role',
    excerpt: 'Essential guide for fresh graduates transitioning from academic life to the corporate world.',
    content: 'The transition from campus to corporate life is one of the most significant shifts a young professional will experience.',
    author: 'Lt Col Shreesh Kumar (Retd)', date: '2026-02-28', category: 'Career Development', readTime: '10 min read', image: '', comments: [],
  },
  {
    id: 'a4', title: 'The Power of Personal Branding in Career Growth',
    excerpt: 'How to build and maintain a professional brand that opens doors.',
    content: 'Your personal brand is your professional reputation—it precedes you into rooms, meetings, and opportunities.',
    author: 'Lt Col Shreesh Kumar (Retd)', date: '2026-02-20', category: 'Personal Growth', readTime: '7 min read', image: '',
    comments: [{ id: 'cm4', user: 'Sneha Gupta', text: 'Very practical advice. Thank you!', date: '2026-02-21', reply: 'Glad you found it useful, Sneha.' }],
  },
  {
    id: 'a5', title: 'Business Etiquette in the Digital Age',
    excerpt: 'How traditional business etiquette principles apply to virtual meetings and digital communication.',
    content: 'The digital revolution has transformed how we conduct business, but the fundamental principles of professional etiquette remain unchanged.',
    author: 'Lt Col Shreesh Kumar (Retd)', date: '2026-02-15', category: 'Corporate Behaviour', readTime: '5 min read', image: '', comments: [],
  },
];

export const mockUser: User = {
  id: 'u1', name: 'Arjun Mehta', email: 'arjun.mehta@email.com', phone: '+91 98765 43210', profileImage: '',
  enrolledCourses: ['c1', 'c2', 'c4'], completedCourses: ['c4'],
  progress: { c1: 65, c2: 40, c4: 100 },
  certificates: [{
    id: 'cert1', courseId: 'c4', courseName: 'Campus to Corporate Transition',
    studentName: 'Arjun Mehta', instructor: 'Lt Col Shreesh Kumar (Retd)', completionDate: '2026-02-28',
  }],
};

export const payments: Payment[] = [
  { id: 'p1', userId: 'u1', courseId: 'c1', amount: 15999, date: '2026-01-15', status: 'completed', courseName: 'Leadership Excellence Program', userName: 'Arjun Mehta' },
  { id: 'p2', userId: 'u1', courseId: 'c2', amount: 9999, date: '2026-02-01', status: 'completed', courseName: 'Corporate Communication Mastery', userName: 'Arjun Mehta' },
  { id: 'p3', userId: 'u1', courseId: 'c4', amount: 5999, date: '2026-01-05', status: 'completed', courseName: 'Campus to Corporate Transition', userName: 'Arjun Mehta' },
  { id: 'p4', userId: 'u2', courseId: 'c1', amount: 15999, date: '2026-02-20', status: 'completed', courseName: 'Leadership Excellence Program', userName: 'Priya Sharma' },
  { id: 'p5', userId: 'u3', courseId: 'c3', amount: 7999, date: '2026-03-01', status: 'completed', courseName: 'Personality Development Masterclass', userName: 'Rahul Verma' },
  { id: 'p6', userId: 'u4', courseId: 'c6', amount: 8499, date: '2026-03-10', status: 'pending', courseName: 'Presentation Skills Workshop', userName: 'Neha Gupta' },
];

export const notes: Note[] = [
  { id: 'n1', title: 'Leadership Principles Handbook', courseId: 'c1', category: 'Leadership Development', description: 'Comprehensive notes on leadership frameworks and strategies.', fileUrl: '#', uploadDate: '2026-03-01' },
  { id: 'n2', title: 'Business Writing Templates', courseId: 'c2', category: 'Communication Skills', description: 'Email templates and writing guides for corporate communication.', fileUrl: '#', uploadDate: '2026-03-05' },
  { id: 'n3', title: 'Personality Assessment Workbook', courseId: 'c3', category: 'Personality Development', description: 'Self-assessment worksheets and personality development exercises.', fileUrl: '#', uploadDate: '2026-02-28' },
  { id: 'n4', title: 'Corporate Culture Guide', courseId: 'c4', category: 'Campus to Corporate', description: 'Understanding corporate hierarchies, dress codes, and workplace norms.', fileUrl: '#', uploadDate: '2026-02-15' },
  { id: 'n5', title: 'Time Management Toolkit', courseId: 'c7', category: 'Time Management', description: 'Prioritization matrices and productivity frameworks.', fileUrl: '#', uploadDate: '2026-03-10' },
];

export const testimonials: Testimonial[] = [
  { id: 't1', name: 'Vikram Singh', role: 'Senior Manager, TCS', text: 'The Leadership Excellence Program transformed my approach to team management. Lt Col Kumar\'s military-inspired leadership frameworks are incredibly practical.', rating: 5, approved: true, date: '2026-02-10' },
  { id: 't2', name: 'Ananya Reddy', role: 'MBA Student, IIM Bangalore', text: 'Campus to Corporate was exactly what I needed before starting my first job. The practical insights gave me a significant advantage.', rating: 5, approved: true, date: '2026-02-15' },
  { id: 't3', name: 'Karthik Menon', role: 'Project Lead, Infosys', text: 'The communication skills course helped me become a more confident presenter. Highly recommended for all professionals.', rating: 5, approved: true, date: '2026-03-01' },
  { id: 't4', name: 'Deepika Joshi', role: 'HR Director, Wipro', text: 'We enrolled our entire L&D team in the Train the Trainer program. The results were outstanding.', rating: 5, approved: true, date: '2026-03-05' },
  { id: 't5', name: 'Amit Patel', role: 'Software Engineer, Google', text: 'Great course on presentation skills. Helped me during my project demos.', rating: 4, approved: false, date: '2026-03-12' },
];

export const enquiries: Enquiry[] = [
  { id: 'e1', name: 'Raj Kumar', phone: '+91 87654 32109', email: 'raj@email.com', message: 'Interested in corporate training for my team of 20 people.', date: '2026-03-10', status: 'new' },
  { id: 'e2', name: 'Meera Shah', phone: '+91 76543 21098', email: 'meera@email.com', message: 'Want to know more about the Leadership program fees.', date: '2026-03-09', status: 'contacted' },
];

export const articleRequests: ArticleRequest[] = [
  { id: 'ar1', userId: 'u1', userName: 'Arjun Mehta', email: 'arjun@email.com', topic: 'Agile Leadership in Startups', description: 'I want to share my experience leading agile teams in early-stage startups.', status: 'pending', date: '2026-03-11' },
  { id: 'ar2', userId: 'u2', userName: 'Priya Sharma', email: 'priya@email.com', topic: 'Women in Corporate Leadership', description: 'An article on challenges and strategies for women leaders.', status: 'approved', date: '2026-03-08' },
];

export const supportTickets: SupportTicket[] = [
  { id: 'st1', userId: 'u1', userName: 'Arjun Mehta', subject: 'Cannot access recorded lectures', status: 'open', date: '2026-03-12',
    messages: [
      { sender: 'user', text: 'I am unable to access the recorded lectures for Module 3 of Leadership course.', date: '2026-03-12' },
      { sender: 'admin', text: 'We are looking into this issue. Could you try clearing your browser cache?', date: '2026-03-12' },
    ],
  },
  { id: 'st2', userId: 'u3', userName: 'Rahul Verma', subject: 'Payment not reflected', status: 'open', date: '2026-03-11',
    messages: [
      { sender: 'user', text: 'I made a payment for Personality Development course but it is not reflected in my dashboard.', date: '2026-03-11' },
    ],
  },
];

export const courseCategories = [
  'All', 'Leadership Development', 'Communication Skills', 'Personality Development',
  'Campus to Corporate', 'Business Etiquette', 'Presentation Skills',
  'Time Management', 'Life Skills', 'Project Management', 'Corporate Readiness',
];
