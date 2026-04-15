import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Course, LiveClass, Article, Payment, Note, Testimonial,
  Enquiry, ArticleRequest, SupportTicket, CourseReview
} from '@/data/types';
import {
  courses as initialCourses, liveClasses as initialClasses, articles as initialArticles,
  payments as initialPayments, notes as initialNotes, testimonials as initialTestimonials,
  enquiries as initialEnquiries, articleRequests as initialArticleRequests,
  supportTickets as initialSupportTickets, courseCategories as initialCategories
} from '@/data/mockData';

interface DataContextType {
  courses: Course[];
  liveClasses: LiveClass[];
  articles: Article[];
  payments: Payment[];
  notes: Note[];
  testimonials: Testimonial[];
  enquiries: Enquiry[];
  articleRequests: ArticleRequest[];
  supportTickets: SupportTicket[];
  categories: string[];
  addCourse: (course: Course) => Promise<void>;
  updateCourse: (id: string, course: Partial<Course>) => Promise<void>;
  deleteCourse: (id: string) => Promise<void>;
  addCourseReview: (courseId: string, review: CourseReview) => Promise<void>;
  addLiveClass: (cls: LiveClass) => void;
  updateLiveClass: (id: string, cls: Partial<LiveClass>) => void;
  deleteLiveClass: (id: string) => void;
  addArticle: (article: Article) => void;
  updateArticle: (id: string, article: Partial<Article>) => void;
  deleteArticle: (id: string) => void;
  addPayment: (payment: Payment) => void;
  deleteComment: (articleId: string, commentId: string) => void;
  replyToComment: (articleId: string, commentId: string, reply: string) => void;
  addComment: (articleId: string, comment: { id: string; user: string; text: string; date: string }) => void;
  addNote: (note: Note) => void;
  deleteNote: (id: string) => void;
  addTestimonial: (t: Testimonial) => void;
  approveTestimonial: (id: string) => void;
  deleteTestimonial: (id: string) => void;
  addEnquiry: (e: Enquiry) => void;
  updateEnquiryStatus: (id: string, status: Enquiry['status']) => void;
  addArticleRequest: (r: ArticleRequest) => void;
  updateArticleRequestStatus: (id: string, status: ArticleRequest['status']) => void;
  addSupportTicket: (t: SupportTicket) => void;
  addSupportMessage: (ticketId: string, message: { sender: 'user' | 'admin'; text: string; date: string }) => void;
  closeSupportTicket: (id: string) => void;
  addCategory: (category: string) => void;
  updateCategory: (oldCategory: string, newCategory: string) => void;
  deleteCategory: (category: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [liveClasses, setLiveClasses] = useState<LiveClass[]>(initialClasses);
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [payments, setPayments] = useState<Payment[]>(initialPayments);
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials);
  const [enquiries, setEnquiries] = useState<Enquiry[]>(initialEnquiries);
  const [articleRequests, setArticleRequests] = useState<ArticleRequest[]>(initialArticleRequests);
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>(initialSupportTickets);
  const [categories, setCategories] = useState<string[]>(initialCategories);

  // Fetch courses from API on mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('/api/courses');
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            setCourses(data.map((item: any) => ({
              ...item,
              id: item._id ? item._id.toString() : item.id,
              modulesList: item.modulesList || [],
              highlights: item.highlights || [],
              advantages: item.advantages || [],
              requirements: item.requirements || [],
              targetAudience: item.targetAudience || [],
              recordedLectures: item.recordedLectures || [],
              reviews: item.reviews || [],
              tags: item.tags || [],
            })));
          }
        }
      } catch (error) {
        console.error('Failed to fetch courses:', error);
      }
    };
    fetchCourses();
  }, []);

  // Fetch enquiries from API on mount
  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        const response = await fetch('/api/enquiries');
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            setEnquiries(data.map((item: any) => ({ ...item, id: item._id ? item._id.toString() : item.id })));
          }
        }
      } catch (error) {
        console.error('Failed to fetch enquiries:', error);
      }
    };
    fetchEnquiries();
  }, []);

  // Fetch categories from API on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) setCategories(data);
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const addCourse = async (c: Course) => {
    try {
      const response = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(c),
      });
      if (!response.ok) throw new Error('Failed to add course');
      const saved = await response.json();
      const newCourse: Course = {
        ...c,
        ...saved,
        id: saved._id?.toString ? saved._id.toString() : c.id,
        modulesList: saved.modulesList || c.modulesList || [],
        highlights: saved.highlights || c.highlights || [],
        advantages: saved.advantages || c.advantages || [],
        requirements: saved.requirements || c.requirements || [],
        targetAudience: saved.targetAudience || c.targetAudience || [],
        recordedLectures: saved.recordedLectures || c.recordedLectures || [],
        reviews: saved.reviews || c.reviews || [],
        tags: saved.tags || c.tags || [],
      };
      setCourses(p => [...p, newCourse]);
    } catch (error) {
      console.error('Failed to add course:', error);
      throw error;
    }
  };

  const updateCourse = async (id: string, d: Partial<Course>) => {
    try {
      const response = await fetch('/api/courses', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, data: d }),
      });
      if (!response.ok) throw new Error('Failed to update course');
      setCourses(p => p.map(c => c.id === id ? { ...c, ...d } : c));
    } catch (error) {
      console.error('Failed to update course:', error);
      throw error;
    }
  };

  const deleteCourse = async (id: string) => {
    try {
      const response = await fetch('/api/courses', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) throw new Error('Failed to delete course');
      setCourses(p => p.filter(c => c.id !== id));
    } catch (error) {
      console.error('Failed to delete course:', error);
      throw error;
    }
  };

  const addCourseReview = async (courseId: string, review: CourseReview) => {
    try {
      // Update locally immediately
      setCourses(p => p.map(c =>
        c.id === courseId
          ? { ...c, reviews: [...(c.reviews || []), review] }
          : c
      ));
      // Persist to API
      await fetch('/api/courses', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: courseId, review }),
      });
    } catch (error) {
      console.error('Failed to add review:', error);
    }
  };

  const addCategory = async (category: string) => {
    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: category }),
      });
      if (response.ok) {
        setCategories(prev => [...prev, category]);
      } else {
        const error = await response.json();
        throw new Error(error.error);
      }
    } catch (error) {
      console.error('Failed to add category:', error);
      throw error;
    }
  };

  const updateCategory = async (oldCategory: string, newCategory: string) => {
    try {
      const response = await fetch('/api/categories', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldName: oldCategory, newName: newCategory }),
      });
      if (response.ok) {
        setCategories(prev => prev.map(c => c === oldCategory ? newCategory : c));
        setCourses(prev => prev.map(course => course.category === oldCategory ? { ...course, category: newCategory } : course));
        setArticles(prev => prev.map(article => article.category === oldCategory ? { ...article, category: newCategory } : article));
        setNotes(prev => prev.map(note => note.category === oldCategory ? { ...note, category: newCategory } : note));
      } else {
        const error = await response.json();
        throw new Error(error.error);
      }
    } catch (error) {
      console.error('Failed to update category:', error);
      throw error;
    }
  };

  const deleteCategory = async (category: string) => {
    try {
      const response = await fetch('/api/categories', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categoryName: category }),
      });
      if (response.ok) {
        setCategories(prev => prev.filter(c => c !== category));
        setCourses(prev => prev.map(course => course.category === category ? { ...course, category: 'All' } : course));
        setArticles(prev => prev.map(article => article.category === category ? { ...article, category: 'All' } : article));
        setNotes(prev => prev.map(note => note.category === category ? { ...note, category: 'All' } : note));
      } else {
        const error = await response.json();
        throw new Error(error.error);
      }
    } catch (error) {
      console.error('Failed to delete category:', error);
      throw error;
    }
  };

  return (
    <DataContext.Provider value={{
      courses, liveClasses, articles, payments, notes, testimonials,
      enquiries, articleRequests, supportTickets, categories,
      addCourse, updateCourse, deleteCourse, addCourseReview,
      addLiveClass: (c) => setLiveClasses(p => [...p, c]),
      updateLiveClass: (id, d) => setLiveClasses(p => p.map(c => c.id === id ? { ...c, ...d } : c)),
      deleteLiveClass: (id) => setLiveClasses(p => p.filter(c => c.id !== id)),
      addArticle: (a) => setArticles(p => [...p, a]),
      updateArticle: (id, d) => setArticles(p => p.map(a => a.id === id ? { ...a, ...d } : a)),
      deleteArticle: (id) => setArticles(p => p.filter(a => a.id !== id)),
      addPayment: (p) => setPayments(prev => [...prev, p]),
      deleteComment: (aId, cId) => setArticles(p => p.map(a => a.id === aId ? { ...a, comments: a.comments.filter(c => c.id !== cId) } : a)),
      replyToComment: (aId, cId, r) => setArticles(p => p.map(a => a.id === aId ? { ...a, comments: a.comments.map(c => c.id === cId ? { ...c, reply: r } : c) } : a)),
      addComment: (aId, c) => setArticles(p => p.map(a => a.id === aId ? { ...a, comments: [...a.comments, c] } : a)),
      addNote: (n) => setNotes(p => [...p, n]),
      deleteNote: (id) => setNotes(p => p.filter(n => n.id !== id)),
      addTestimonial: (t) => setTestimonials(p => [...p, t]),
      approveTestimonial: (id) => setTestimonials(p => p.map(t => t.id === id ? { ...t, approved: true } : t)),
      deleteTestimonial: (id) => setTestimonials(p => p.filter(t => t.id !== id)),
      addEnquiry: async (e) => {
        try {
          const response = await fetch('/api/enquiries', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(e),
          });
          if (response.ok) {
            const saved = await response.json();
            setEnquiries(p => [...p, { ...e, id: saved._id?.toString ? saved._id.toString() : e.id }]);
          } else {
            setEnquiries(p => [...p, e]);
          }
        } catch {
          setEnquiries(p => [...p, e]);
        }
      },
      updateEnquiryStatus: async (id, s) => {
        try {
          await fetch('/api/enquiries', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, data: { status: s } }),
          });
        } catch {}
        setEnquiries(p => p.map(e => e.id === id ? { ...e, status: s } : e));
      },
      addArticleRequest: (r) => setArticleRequests(p => [...p, r]),
      updateArticleRequestStatus: (id, s) => setArticleRequests(p => p.map(r => r.id === id ? { ...r, status: s } : r)),
      addSupportTicket: (t) => setSupportTickets(p => [...p, t]),
      addSupportMessage: (tId, m) => setSupportTickets(p => p.map(t => t.id === tId ? { ...t, messages: [...t.messages, m] } : t)),
      closeSupportTicket: (id) => setSupportTickets(p => p.map(t => t.id === id ? { ...t, status: 'closed' } : t)),
      addCategory, updateCategory, deleteCategory,
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within DataProvider');
  return context;
};