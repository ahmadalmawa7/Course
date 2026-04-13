import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Course, LiveClass, Article } from '@/data/types';
import { BookOpen, Users, CreditCard, Calendar, FileText, Award, BarChart3, Settings, Plus, Pencil, Trash2, Eye, MessageCircle, Reply, X, Save, HelpCircle, Star, Mail, CheckCircle, XCircle, Send, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

type Tab = 'overview' | 'courses' | 'classes' | 'students' | 'payments' | 'articles' | 'comments' | 'certificates' | 'notes' | 'testimonials' | 'enquiries' | 'article-requests' | 'support' | 'settings' | 'categories';

const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'overview', label: 'Overview', icon: BarChart3 },
  { id: 'categories', label: 'Categories', icon: BookOpen },
  { id: 'courses', label: 'Courses', icon: BookOpen },
  { id: 'classes', label: 'Live Classes', icon: Calendar },
  { id: 'students', label: 'Students', icon: Users },
  { id: 'payments', label: 'Payments', icon: CreditCard },
  { id: 'articles', label: 'Articles', icon: FileText },
  { id: 'comments', label: 'Comments', icon: MessageCircle },
  { id: 'notes', label: 'Notes', icon: Upload },
  { id: 'testimonials', label: 'Testimonials', icon: Star },
  { id: 'enquiries', label: 'Enquiries', icon: Mail },
  { id: 'article-requests', label: 'Article Requests', icon: FileText },
  { id: 'support', label: 'Support', icon: HelpCircle },
  { id: 'certificates', label: 'Certificates', icon: Award },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const CHART_COLORS = ['hsl(0, 100%, 27%)', 'hsl(43, 55%, 53%)', 'hsl(210, 60%, 50%)', 'hsl(150, 60%, 40%)', 'hsl(280, 60%, 50%)'];

const DialogOverlay = ({ children, onClose }: { children: React.ReactNode; onClose: () => void }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
    <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg bg-card p-6 shadow-xl" onClick={e => e.stopPropagation()}>{children}</div>
  </div>
);

const AdminPage = () => {
  const { user, isAdmin } = useAuth();
  const {
    courses, liveClasses, articles, payments, notes, testimonials, enquiries, articleRequests, supportTickets, categories,
    addCourse, updateCourse, deleteCourse, addLiveClass, updateLiveClass, deleteLiveClass,
    addArticle, updateArticle, deleteArticle, deleteComment, replyToComment,
    addNote, deleteNote, approveTestimonial, deleteTestimonial, updateEnquiryStatus,
    updateArticleRequestStatus, addSupportMessage, closeSupportTicket,
    addCategory, updateCategory, deleteCategory,
  } = useData();
  const [activeTab, setActiveTab] = useState<Tab>(() => {
    const storedTab = typeof window !== 'undefined' ? localStorage.getItem('adminActiveTab') : null;
    return (storedTab as Tab) || 'overview';
  });
  const [courseDialog, setCourseDialog] = useState<{ open: boolean; editing: Course | null }>({ open: false, editing: null });
  const [classDialog, setClassDialog] = useState<{ open: boolean; editing: LiveClass | null }>({ open: false, editing: null });
  const [articleDialog, setArticleDialog] = useState<{ open: boolean; editing: Article | null }>({ open: false, editing: null });
  const [viewCourse, setViewCourse] = useState<Course | null>(null);
  const [categoryDialog, setCategoryDialog] = useState<{ open: boolean; editing: string | null }>({ open: false, editing: null });
  const [categoryForm, setCategoryForm] = useState({ name: '' });
  const [replyDialog, setReplyDialog] = useState<{ articleId: string; commentId: string; text: string } | null>(null);
  const [noteDialog, setNoteDialog] = useState(false);
  const [noteForm, setNoteForm] = useState({ title: '', courseId: '', category: '', description: '' });
  const [supportReply, setSupportReply] = useState<{ ticketId: string; text: string } | null>(null);
  const [settings, setSettings] = useState({ razorpayKeyId: '', razorpayKeySecret: '', smtpHost: '', smtpPort: '587', smtpUser: '', smtpPass: '', smtpFrom: 'noreply@eruditioninfinite.com' });

  if (!user || !isAdmin) return <Navigate to="/login" />;

  const totalRevenue = payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0);
  const revenueByMonth = [{ month: 'Jan', revenue: 21998 }, { month: 'Feb', revenue: 23998 }, { month: 'Mar', revenue: 16498 }];
  const userGrowth = [{ month: 'Oct', users: 45 }, { month: 'Nov', users: 78 }, { month: 'Dec', users: 120 }, { month: 'Jan', users: 189 }, { month: 'Feb', users: 267 }, { month: 'Mar', users: 312 }];
  const enrollmentsByCategory = courses.map(c => ({ name: c.category, value: c.enrolled })).reduce((acc, item) => {
    const existing = acc.find(a => a.name === item.name);
    if (existing) existing.value += item.value; else acc.push({ ...item });
    return acc;
  }, [] as { name: string; value: number }[]).slice(0, 5);
  const allComments = articles.flatMap(a => a.comments.map(c => ({ ...c, articleId: a.id, articleTitle: a.title })));
  // categories is now from useData()

  const handleSaveCourse = async (formData: Record<string, string>) => {
    const priceValue = Math.max(0, parseInt(formData.price) || 0);
    const courseData: Omit<Course, 'id'> = {
      title: formData.title, category: formData.category, description: formData.description,
      instructor: formData.instructor || 'Lt Col Shreesh Kumar (Retd)', duration: formData.duration || '4 weeks',
      modules: Math.max(0, parseInt(formData.modules) || 6), price: priceValue,
      image: formData.image || '', level: formData.level || 'Beginner', enrolled: 0, rating: 4.5, modulesList: [],
    };
    try {
      if (courseDialog.editing) {
        await updateCourse(courseDialog.editing.id, courseData);
        toast.success('Course updated!');
      } else {
        const newCourse: Course = { ...courseData, id: `c-${Date.now()}` } as Course;
        await addCourse(newCourse);
        toast.success('Course added!');
      }
      setCourseDialog({ open: false, editing: null });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save course');
    }
  };

  const handleSaveClass = (formData: Record<string, string>) => {
    const classData: Omit<LiveClass, 'id'> = {
      title: formData.title, instructor: formData.instructor || 'Lt Col Shreesh Kumar (Retd)',
      date: formData.date, time: formData.time, meetLink: formData.meetLink || 'https://meet.google.com/xxx-yyyy-zzz',
      courseId: formData.courseId || courses[0]?.id || '', description: formData.description || '',
    };
    if (classDialog.editing) { updateLiveClass(classDialog.editing.id, classData); toast.success('Class updated!'); }
    else { addLiveClass({ ...classData, id: `lc-${Date.now()}` }); toast.success('Class scheduled!'); }
    setClassDialog({ open: false, editing: null });
  };

  const handleSaveArticle = (formData: Record<string, string>) => {
    const articleData: Omit<Article, 'id' | 'comments'> = {
      title: formData.title, excerpt: formData.excerpt || formData.content?.substring(0, 150) + '...',
      content: formData.content, author: formData.author || 'Lt Col Shreesh Kumar (Retd)',
      date: new Date().toISOString().split('T')[0], category: formData.category || 'Leadership',
      readTime: `${Math.max(1, Math.ceil((formData.content?.length || 0) / 1000))} min read`, image: '',
    };
    if (articleDialog.editing) { updateArticle(articleDialog.editing.id, articleData); toast.success('Article updated!'); }
    else { addArticle({ ...articleData, id: `a-${Date.now()}`, comments: [] }); toast.success('Article published!'); }
    setArticleDialog({ open: false, editing: null });
  };

  const handleAddNote = () => {
    if (!noteForm.title) { toast.error('Title is required.'); return; }
    addNote({ id: `n-${Date.now()}`, ...noteForm, fileUrl: '#', uploadDate: new Date().toISOString().split('T')[0] });
    toast.success('Note uploaded!');
    setNoteForm({ title: '', courseId: '', category: '', description: '' });
    setNoteDialog(false);
  };

  const handleSupportReply = () => {
    if (!supportReply?.text) return;
    addSupportMessage(supportReply.ticketId, { sender: 'admin', text: supportReply.text, date: new Date().toISOString().split('T')[0] });
    toast.success('Reply sent!');
    setSupportReply(null);
  };

const handleSaveCategory = async (formData: Record<string, string>) => {
    if (!formData.name?.trim()) { toast.error('Category name is required.'); return; }
    try {
      if (categoryDialog.editing) {
        await updateCategory(categoryDialog.editing, formData.name.trim());
        toast.success('Category updated!');
      } else {
        if (categories.includes(formData.name.trim())) {
          toast.error('Category already exists.');
          return;
        }
        await addCategory(formData.name.trim());
        toast.success('Category added!');
      }
      setCategoryForm({ name: '' });
      setCategoryDialog({ open: false, editing: null });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save category');
    }
  };

  const handleDeleteCategory = async (category: string) => {
    if (category === 'All') {
      toast.error('The All category cannot be deleted.');
      return;
    }

    try {
      // If category is used, reassign the dependent content to All, then delete category.
      const usedInCourses = courses.some(c => c.category === category);
      const usedInArticles = articles.some(a => a.category === category);
      const usedInNotes = notes.some(n => n.category === category);

      if (usedInCourses || usedInArticles || usedInNotes) {
        // We now allow deleting in-use categories by reassigning items to All
        toast('Category in use; its courses/articles/notes will be reassigned to All.', { icon: '⚠️' });
      }

      await deleteCategory(category);
      toast.success('Category deleted!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete category');
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('adminActiveTab', activeTab);
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="flex">
        <aside className="hidden w-56 border-r border-border bg-card md:block min-h-screen">
          <div className="p-4 border-b border-border">
            <p className="font-heading text-sm font-bold text-card-foreground">Admin Panel</p>
            <p className="text-xs text-muted-foreground">Erudition Infinite</p>
          </div>
          <nav className="p-2 space-y-0.5">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setActiveTab(id)}
                className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-xs transition-colors ${activeTab === id ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-muted'}`}>
                <Icon className="h-3.5 w-3.5" /> {label}
              </button>
            ))}
          </nav>
        </aside>

        <div className="flex w-full flex-col md:flex-1">
          <div className="flex gap-1 overflow-x-auto border-b border-border bg-card p-2 md:hidden">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setActiveTab(id)}
                className={`flex shrink-0 items-center gap-1 rounded-md px-2 py-1.5 text-xs ${activeTab === id ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground'}`}>
                <Icon className="h-3 w-3" /> {label}
              </button>
            ))}
          </div>

          <main className="flex-1 p-6">
            {/* OVERVIEW */}
            {activeTab === 'overview' && (
              <div>
                <h2 className="mb-6 font-heading text-2xl font-bold text-foreground">Dashboard Overview</h2>
                <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
                  {[
                    { label: 'Total Students', value: '312', icon: Users },
                    { label: 'Total Courses', value: courses.length.toString(), icon: BookOpen },
                    { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString()}`, icon: CreditCard },
                    { label: 'Live Classes', value: liveClasses.length.toString(), icon: Calendar },
                  ].map(({ label, value, icon: Icon }) => (
                    <div key={label} className="rounded-lg border border-border bg-card p-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs text-muted-foreground">{label}</p>
                        <Icon className="h-4 w-4 text-gold" />
                      </div>
                      <p className="font-heading text-xl font-bold text-card-foreground">{value}</p>
                    </div>
                  ))}
                </div>
                <div className="mb-8 grid gap-6 lg:grid-cols-2">
                  <div className="rounded-lg border border-border bg-card p-4">
                    <h3 className="mb-4 font-heading text-sm font-semibold text-card-foreground">Revenue (Monthly)</h3>
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={revenueByMonth}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                        <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                        <Tooltip formatter={(v: number) => [`₹${v.toLocaleString()}`, 'Revenue']} />
                        <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="rounded-lg border border-border bg-card p-4">
                    <h3 className="mb-4 font-heading text-sm font-semibold text-card-foreground">User Growth</h3>
                    <ResponsiveContainer width="100%" height={220}>
                      <LineChart data={userGrowth}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                        <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                        <Tooltip />
                        <Line type="monotone" dataKey="users" stroke="hsl(var(--gold))" strokeWidth={2} dot={{ fill: 'hsl(var(--gold))' }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="grid gap-6 lg:grid-cols-2">
                  <div className="rounded-lg border border-border bg-card p-4">
                    <h3 className="mb-4 font-heading text-sm font-semibold text-card-foreground">Enrollments by Category</h3>
                    <ResponsiveContainer width="100%" height={220}>
                      <PieChart>
                        <Pie data={enrollmentsByCategory} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) => `${name.split(' ')[0]} ${(percent * 100).toFixed(0)}%`}>
                          {enrollmentsByCategory.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="rounded-lg border border-border bg-card p-4">
                    <h3 className="mb-3 font-heading text-sm font-semibold text-card-foreground">Recent Payments</h3>
                    <div className="space-y-2">
                      {payments.slice(0, 5).map(p => (
                        <div key={p.id} className="flex items-center justify-between text-sm">
                          <div>
                            <p className="text-card-foreground font-medium">{p.userName}</p>
                            <p className="text-xs text-muted-foreground">{p.courseName}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-card-foreground">₹{p.amount.toLocaleString()}</p>
                            <span className={`text-xs ${p.status === 'completed' ? 'text-green-600' : 'text-yellow-600'}`}>{p.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* CATEGORIES */}
            {activeTab === 'categories' && (
              <div>
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="font-heading text-2xl font-bold text-foreground">Category Management</h2>
                  <Button size="sm" onClick={() => { setCategoryForm({ name: '' }); setCategoryDialog({ open: true, editing: null }); }}><Plus className="h-4 w-4 mr-1" /> Add Category</Button>
                </div>
                <div className="rounded-lg border border-border bg-card overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-muted"><tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Category Name</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Courses</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Articles</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Notes</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Actions</th>
                    </tr></thead>
                    <tbody>{categories.filter(cat => cat !== 'All').map(category => {
                      const courseCount = courses.filter(c => c.category === category).length;
                      const articleCount = articles.filter(a => a.category === category).length;
                      const noteCount = notes.filter(n => n.category === category).length;
                      return (
                        <tr key={category} className="border-t border-border">
                          <td className="px-4 py-2 font-medium text-card-foreground">{category}</td>
                          <td className="px-4 py-2 text-muted-foreground">{courseCount}</td>
                          <td className="px-4 py-2 text-muted-foreground">{articleCount}</td>
                          <td className="px-4 py-2 text-muted-foreground">{noteCount}</td>
                          <td className="px-4 py-2">
                            <div className="flex gap-1">
                              <Button size="sm" variant="outline" onClick={() => { setCategoryForm({ name: category }); setCategoryDialog({ open: true, editing: category }); }}>
                                <Pencil className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => handleDeleteCategory(category)}>
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}</tbody>
                  </table>
                </div>
              </div>
            )}

            {/* COURSES */}
            {activeTab === 'courses' && (
              <div>
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="font-heading text-2xl font-bold text-foreground">Course Management</h2>
                  <Button size="sm" onClick={() => setCourseDialog({ open: true, editing: null })}><Plus className="h-4 w-4 mr-1" /> Add Course</Button>
                </div>
                <div className="rounded-lg border border-border bg-card overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-muted"><tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Course</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Category</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Price</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Enrolled</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Actions</th>
                    </tr></thead>
                    <tbody>{courses.map(c => (
                      <tr key={c.id} className="border-t border-border">
                        <td className="px-4 py-2 font-medium text-card-foreground">{c.title}</td>
                        <td className="px-4 py-2 text-muted-foreground">{c.category}</td>
                        <td className="px-4 py-2 text-card-foreground">₹{c.price.toLocaleString()}</td>
                        <td className="px-4 py-2 text-card-foreground">{c.enrolled}</td>
                        <td className="px-4 py-2"><div className="flex gap-1">
                          <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => setViewCourse(c)}><Eye className="h-3 w-3 mr-1" /> View</Button>
                          <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => setCourseDialog({ open: true, editing: c })}><Pencil className="h-3 w-3 mr-1" /> Edit</Button>
                          <Button variant="ghost" size="sm" className="h-7 text-xs text-destructive" onClick={() => { deleteCourse(c.id); toast.success('Course deleted.'); }}><Trash2 className="h-3 w-3 mr-1" /> Delete</Button>
                        </div></td>
                      </tr>
                    ))}</tbody>
                  </table>
                </div>
              </div>
            )}

            {/* LIVE CLASSES */}
            {activeTab === 'classes' && (
              <div>
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="font-heading text-2xl font-bold text-foreground">Live Class Management</h2>
                  <Button size="sm" onClick={() => setClassDialog({ open: true, editing: null })}><Plus className="h-4 w-4 mr-1" /> Schedule Class</Button>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {liveClasses.map(cls => (
                    <div key={cls.id} className="rounded-lg border border-border bg-card p-4">
                      <h3 className="font-medium text-card-foreground">{cls.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{cls.date} • {cls.time}</p>
                      <p className="text-xs text-muted-foreground">{cls.instructor}</p>
                      <div className="mt-3 flex gap-1">
                        <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => setClassDialog({ open: true, editing: cls })}><Pencil className="h-3 w-3 mr-1" /> Edit</Button>
                        <Button variant="ghost" size="sm" className="h-7 text-xs text-destructive" onClick={() => { deleteLiveClass(cls.id); toast.success('Class deleted.'); }}><Trash2 className="h-3 w-3 mr-1" /> Delete</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STUDENTS */}
            {activeTab === 'students' && (
              <div>
                <h2 className="mb-6 font-heading text-2xl font-bold text-foreground">Student Management</h2>
                <div className="rounded-lg border border-border bg-card overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-muted"><tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Name</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Email</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Courses</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Status</th>
                    </tr></thead>
                    <tbody>{[
                      { name: 'Arjun Mehta', email: 'arjun@email.com', courses: 3, status: 'Active' },
                      { name: 'Priya Sharma', email: 'priya@email.com', courses: 1, status: 'Active' },
                      { name: 'Rahul Verma', email: 'rahul@email.com', courses: 1, status: 'Active' },
                      { name: 'Neha Gupta', email: 'neha@email.com', courses: 1, status: 'Pending' },
                      { name: 'Vikram Singh', email: 'vikram@email.com', courses: 2, status: 'Active' },
                    ].map((s, i) => (
                      <tr key={i} className="border-t border-border">
                        <td className="px-4 py-2 font-medium text-card-foreground">{s.name}</td>
                        <td className="px-4 py-2 text-muted-foreground">{s.email}</td>
                        <td className="px-4 py-2 text-card-foreground">{s.courses}</td>
                        <td className="px-4 py-2"><span className={`rounded-sm px-2 py-0.5 text-xs font-medium ${s.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{s.status}</span></td>
                      </tr>
                    ))}</tbody>
                  </table>
                </div>
              </div>
            )}

            {/* PAYMENTS */}
            {activeTab === 'payments' && (
              <div>
                <h2 className="mb-6 font-heading text-2xl font-bold text-foreground">Payment Management</h2>
                <div className="mb-4 rounded-lg border border-border bg-card p-4">
                  <p className="text-sm text-muted-foreground">Total Revenue: <span className="font-heading text-xl font-bold text-card-foreground ml-2">₹{totalRevenue.toLocaleString()}</span></p>
                </div>
                <div className="rounded-lg border border-border bg-card overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-muted"><tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Student</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Course</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Amount</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Date</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Status</th>
                    </tr></thead>
                    <tbody>{payments.map(p => (
                      <tr key={p.id} className="border-t border-border">
                        <td className="px-4 py-2 text-card-foreground">{p.userName}</td>
                        <td className="px-4 py-2 text-muted-foreground">{p.courseName}</td>
                        <td className="px-4 py-2 font-medium text-card-foreground">₹{p.amount.toLocaleString()}</td>
                        <td className="px-4 py-2 text-muted-foreground">{p.date}</td>
                        <td className="px-4 py-2"><span className={`rounded-sm px-2 py-0.5 text-xs font-medium ${p.status === 'completed' ? 'bg-green-100 text-green-700' : p.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{p.status}</span></td>
                      </tr>
                    ))}</tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ARTICLES */}
            {activeTab === 'articles' && (
              <div>
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="font-heading text-2xl font-bold text-foreground">Article Management</h2>
                  <Button size="sm" onClick={() => setArticleDialog({ open: true, editing: null })}><Plus className="h-4 w-4 mr-1" /> New Article</Button>
                </div>
                <div className="space-y-3">
                  {articles.map(a => (
                    <div key={a.id} className="flex items-center justify-between rounded-lg border border-border bg-card p-4">
                      <div>
                        <p className="font-medium text-card-foreground">{a.title}</p>
                        <p className="text-xs text-muted-foreground">{a.category} • {a.date} • {a.comments.length} comments</p>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => setArticleDialog({ open: true, editing: a })}><Pencil className="h-3 w-3 mr-1" /> Edit</Button>
                        <Button variant="ghost" size="sm" className="h-7 text-xs text-destructive" onClick={() => { deleteArticle(a.id); toast.success('Article deleted.'); }}><Trash2 className="h-3 w-3 mr-1" /> Delete</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* COMMENTS */}
            {activeTab === 'comments' && (
              <div>
                <h2 className="mb-6 font-heading text-2xl font-bold text-foreground">Comment Management</h2>
                {allComments.length === 0 ? (
                  <div className="rounded-lg border border-border bg-card p-8 text-center"><p className="text-muted-foreground">No comments yet.</p></div>
                ) : (
                  <div className="space-y-3">
                    {allComments.map(c => (
                      <div key={c.id} className="rounded-lg border border-border bg-card p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-xs text-muted-foreground mb-1">On: <span className="font-medium text-card-foreground">{c.articleTitle}</span></p>
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-sm font-medium text-card-foreground">{c.user}</span>
                              <span className="text-xs text-muted-foreground">{c.date}</span>
                            </div>
                            <p className="text-sm text-muted-foreground">{c.text}</p>
                            {c.reply && (
                              <div className="mt-2 ml-4 rounded-md border-l-2 border-primary bg-muted/50 p-2">
                                <p className="text-xs font-medium text-primary mb-0.5">Your Reply</p>
                                <p className="text-sm text-muted-foreground">{c.reply}</p>
                              </div>
                            )}
                          </div>
                          <div className="flex gap-1 ml-2">
                            {!c.reply && (
                              <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => setReplyDialog({ articleId: c.articleId, commentId: c.id, text: '' })}><Reply className="h-3 w-3 mr-1" /> Reply</Button>
                            )}
                            <Button variant="ghost" size="sm" className="h-7 text-xs text-destructive" onClick={() => { deleteComment(c.articleId, c.id); toast.success('Comment deleted.'); }}><Trash2 className="h-3 w-3" /></Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* NOTES */}
            {activeTab === 'notes' && (
              <div>
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="font-heading text-2xl font-bold text-foreground">Notes Management</h2>
                  <Button size="sm" onClick={() => setNoteDialog(true)}><Plus className="h-4 w-4 mr-1" /> Upload Note</Button>
                </div>
                <div className="space-y-3">
                  {notes.map(n => (
                    <div key={n.id} className="flex items-center justify-between rounded-lg border border-border bg-card p-4">
                      <div>
                        <p className="font-medium text-card-foreground">{n.title}</p>
                        <p className="text-xs text-muted-foreground">{n.category} • {n.uploadDate}</p>
                      </div>
                      <Button variant="ghost" size="sm" className="h-7 text-xs text-destructive" onClick={() => { deleteNote(n.id); toast.success('Note deleted.'); }}><Trash2 className="h-3 w-3 mr-1" /> Delete</Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TESTIMONIALS */}
            {activeTab === 'testimonials' && (
              <div>
                <h2 className="mb-6 font-heading text-2xl font-bold text-foreground">Testimonial Management</h2>
                <div className="space-y-3">
                  {testimonials.map(t => (
                    <div key={t.id} className="rounded-lg border border-border bg-card p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium text-card-foreground">{t.name}</p>
                            <span className={`rounded-sm px-2 py-0.5 text-xs font-medium ${t.approved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{t.approved ? 'Approved' : 'Pending'}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">{t.role} • {t.date}</p>
                          <div className="flex gap-0.5 my-1">{Array.from({ length: t.rating }).map((_, j) => <Star key={j} className="h-3 w-3 fill-gold text-gold" />)}</div>
                          <p className="text-sm text-muted-foreground italic">"{t.text}"</p>
                        </div>
                        <div className="flex gap-1 ml-2">
                          {!t.approved && (
                            <Button variant="ghost" size="sm" className="h-7 text-xs text-green-600" onClick={() => { approveTestimonial(t.id); toast.success('Testimonial approved!'); }}><CheckCircle className="h-3 w-3 mr-1" /> Approve</Button>
                          )}
                          <Button variant="ghost" size="sm" className="h-7 text-xs text-destructive" onClick={() => { deleteTestimonial(t.id); toast.success('Testimonial deleted.'); }}><Trash2 className="h-3 w-3" /></Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ENQUIRIES */}
            {activeTab === 'enquiries' && (
              <div>
                <h2 className="mb-6 font-heading text-2xl font-bold text-foreground">Enquiry Management</h2>
                <div className="space-y-3">
                  {enquiries.map(e => (
                    <div key={e.id} className="rounded-lg border border-border bg-card p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <p className="font-medium text-card-foreground">{e.name}</p>
                            <span className={`rounded-sm px-2 py-0.5 text-xs font-medium ${e.status === 'new' ? 'bg-blue-100 text-blue-700' : e.status === 'contacted' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>{e.status}</span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs text-muted-foreground mb-2">
                            <div>
                              <span className="font-medium text-foreground">Email:</span> {e.email}
                            </div>
                            <div>
                              <span className="font-medium text-foreground">Phone:</span> {e.phone}
                            </div>
                            <div>
                              <span className="font-medium text-foreground">Date:</span> {e.date}
                            </div>
                          </div>
                          <div className="bg-muted/50 rounded-md p-3">
                            <p className="text-xs font-medium text-foreground mb-1">Message:</p>
                            <p className="text-sm text-muted-foreground">{e.message}</p>
                          </div>
                        </div>
                        <div className="flex flex-col gap-1 ml-4">
                          {e.status === 'new' && (
                            <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => { updateEnquiryStatus(e.id, 'contacted'); toast.success('Marked as contacted.'); }}>Mark Contacted</Button>
                          )}
                          {e.status === 'contacted' && (
                            <Button variant="ghost" size="sm" className="h-7 text-xs text-green-600" onClick={() => { updateEnquiryStatus(e.id, 'resolved'); toast.success('Marked as resolved.'); }}>Resolve</Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ARTICLE REQUESTS */}
            {activeTab === 'article-requests' && (
              <div>
                <h2 className="mb-6 font-heading text-2xl font-bold text-foreground">Article Requests</h2>
                <div className="space-y-3">
                  {articleRequests.map(r => (
                    <div key={r.id} className="rounded-lg border border-border bg-card p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-card-foreground">{r.topic}</p>
                          <p className="text-xs text-muted-foreground">By {r.userName} ({r.email}) • {r.date}</p>
                          <p className="text-sm text-muted-foreground mt-1">{r.description}</p>
                        </div>
                        <div className="flex gap-1 ml-2">
                          {r.status === 'pending' && (
                            <>
                              <Button variant="ghost" size="sm" className="h-7 text-xs text-green-600" onClick={() => { updateArticleRequestStatus(r.id, 'approved'); toast.success('Request approved!'); }}><CheckCircle className="h-3 w-3 mr-1" /> Approve</Button>
                              <Button variant="ghost" size="sm" className="h-7 text-xs text-destructive" onClick={() => { updateArticleRequestStatus(r.id, 'rejected'); toast.success('Request rejected.'); }}><XCircle className="h-3 w-3 mr-1" /> Reject</Button>
                            </>
                          )}
                          <span className={`rounded-sm px-2 py-0.5 text-xs font-medium ${r.status === 'approved' ? 'bg-green-100 text-green-700' : r.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{r.status}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SUPPORT */}
            {activeTab === 'support' && (
              <div>
                <h2 className="mb-6 font-heading text-2xl font-bold text-foreground">Support Tickets</h2>
                <div className="space-y-3">
                  {supportTickets.map(t => (
                    <div key={t.id} className="rounded-lg border border-border bg-card p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-medium text-card-foreground">{t.subject}</p>
                          <p className="text-xs text-muted-foreground">{t.userName} • {t.date}</p>
                        </div>
                        <div className="flex gap-1">
                          <span className={`rounded-sm px-2 py-0.5 text-xs font-medium ${t.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-muted text-muted-foreground'}`}>{t.status}</span>
                          {t.status === 'open' && (
                            <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => { closeSupportTicket(t.id); toast.success('Ticket closed.'); }}>Close</Button>
                          )}
                        </div>
                      </div>
                      <div className="space-y-2 mb-3 max-h-40 overflow-y-auto">
                        {t.messages.map((m, i) => (
                          <div key={i} className={`rounded-md p-2 text-sm ${m.sender === 'admin' ? 'bg-primary/10 ml-4' : 'bg-muted mr-4'}`}>
                            <p className="text-xs font-medium text-card-foreground mb-0.5">{m.sender === 'admin' ? 'You (Admin)' : t.userName}</p>
                            <p className="text-muted-foreground">{m.text}</p>
                          </div>
                        ))}
                      </div>
                      {t.status === 'open' && (
                        supportReply?.ticketId === t.id ? (
                          <div className="flex gap-2">
                            <Input value={supportReply.text} onChange={e => setSupportReply({ ...supportReply, text: e.target.value })} placeholder="Type reply..." onKeyDown={e => e.key === 'Enter' && handleSupportReply()} />
                            <Button size="sm" onClick={handleSupportReply}><Send className="h-4 w-4" /></Button>
                            <Button variant="outline" size="sm" onClick={() => setSupportReply(null)}>Cancel</Button>
                          </div>
                        ) : (
                          <Button variant="outline" size="sm" className="text-xs" onClick={() => setSupportReply({ ticketId: t.id, text: '' })}><Reply className="h-3 w-3 mr-1" /> Reply</Button>
                        )
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CERTIFICATES */}
            {activeTab === 'certificates' && (
              <div>
                <h2 className="mb-6 font-heading text-2xl font-bold text-foreground">Certificate Management</h2>
                <div className="rounded-lg border border-border bg-card p-6 text-center">
                  <Award className="mx-auto mb-3 h-10 w-10 text-gold" />
                  <p className="font-medium text-card-foreground">Certificate System</p>
                  <p className="text-sm text-muted-foreground mt-1">Certificates are automatically generated upon course completion.</p>
                  <p className="text-sm text-muted-foreground mt-1">Total certificates issued: <strong>1</strong></p>
                </div>
              </div>
            )}

            {/* SETTINGS */}
            {activeTab === 'settings' && (
              <div>
                <h2 className="mb-6 font-heading text-2xl font-bold text-foreground">Platform Settings</h2>
                <div className="space-y-6">
                  <div className="rounded-lg border border-border bg-card p-6">
                    <h3 className="font-heading text-lg font-semibold text-card-foreground mb-4 flex items-center gap-2"><CreditCard className="h-5 w-5 text-gold" /> Payment Gateway (Razorpay)</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Razorpay Key ID</label><Input value={settings.razorpayKeyId} onChange={e => setSettings({ ...settings, razorpayKeyId: e.target.value })} placeholder="rzp_test_xxxxxxxxxx" /></div>
                      <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Razorpay Key Secret</label><Input type="password" value={settings.razorpayKeySecret} onChange={e => setSettings({ ...settings, razorpayKeySecret: e.target.value })} placeholder="Enter key secret" /></div>
                    </div>
                    <Button size="sm" className="mt-4" onClick={() => toast.success('Razorpay settings saved (mock).')}><Save className="h-3 w-3 mr-1" /> Save Payment Settings</Button>
                  </div>
                  <div className="rounded-lg border border-border bg-card p-6">
                    <h3 className="font-heading text-lg font-semibold text-card-foreground mb-4 flex items-center gap-2"><Mail className="h-5 w-5 text-gold" /> SMTP / Email Settings</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div><label className="text-xs font-medium text-muted-foreground mb-1 block">SMTP Host</label><Input value={settings.smtpHost} onChange={e => setSettings({ ...settings, smtpHost: e.target.value })} placeholder="smtp.gmail.com" /></div>
                      <div><label className="text-xs font-medium text-muted-foreground mb-1 block">SMTP Port</label><Input value={settings.smtpPort} onChange={e => setSettings({ ...settings, smtpPort: e.target.value })} placeholder="587" /></div>
                      <div><label className="text-xs font-medium text-muted-foreground mb-1 block">SMTP Username</label><Input value={settings.smtpUser} onChange={e => setSettings({ ...settings, smtpUser: e.target.value })} placeholder="your@email.com" /></div>
                      <div><label className="text-xs font-medium text-muted-foreground mb-1 block">SMTP Password</label><Input type="password" value={settings.smtpPass} onChange={e => setSettings({ ...settings, smtpPass: e.target.value })} placeholder="Enter password" /></div>
                      <div className="md:col-span-2"><label className="text-xs font-medium text-muted-foreground mb-1 block">From Email</label><Input value={settings.smtpFrom} onChange={e => setSettings({ ...settings, smtpFrom: e.target.value })} /></div>
                    </div>
                    <Button size="sm" className="mt-4" onClick={() => toast.success('SMTP settings saved (mock).')}><Save className="h-3 w-3 mr-1" /> Save Email Settings</Button>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* DIALOGS */}
      {courseDialog.open && <CourseFormDialog initial={courseDialog.editing} categories={categories} onSave={handleSaveCourse} onClose={() => setCourseDialog({ open: false, editing: null })} />}
      {viewCourse && (
        <DialogOverlay onClose={() => setViewCourse(null)}>
          <h3 className="font-heading text-lg font-semibold text-card-foreground mb-4">Course Details</h3>
          <div className="space-y-2 text-sm">
            <p><strong>Title:</strong> {viewCourse.title}</p>
            <p><strong>Category:</strong> {viewCourse.category}</p>
            <p><strong>Instructor:</strong> {viewCourse.instructor}</p>
            <p><strong>Duration:</strong> {viewCourse.duration}</p>
            <p><strong>Modules:</strong> {viewCourse.modules}</p>
            <p><strong>Price:</strong> ₹{viewCourse.price.toLocaleString()}</p>
            <p><strong>Level:</strong> {viewCourse.level}</p>
            <p><strong>Enrolled:</strong> {viewCourse.enrolled}</p>
            <p><strong>Rating:</strong> {viewCourse.rating}</p>
            <p><strong>Description:</strong> {viewCourse.description}</p>
            {viewCourse.image && <img src={viewCourse.image} alt="Course" className="mt-2 h-32 w-full object-cover rounded" />}
          </div>
          <div className="mt-4 flex justify-end">
            <Button size="sm" onClick={() => setViewCourse(null)}>Close</Button>
          </div>
        </DialogOverlay>
      )}
      {classDialog.open && <ClassFormDialog initial={classDialog.editing} courses={courses} onSave={handleSaveClass} onClose={() => setClassDialog({ open: false, editing: null })} />}
      {articleDialog.open && <ArticleFormDialog initial={articleDialog.editing} onSave={handleSaveArticle} onClose={() => setArticleDialog({ open: false, editing: null })} />}
      {categoryDialog.open && (
        <DialogOverlay onClose={() => { setCategoryDialog({ open: false, editing: null }); setCategoryForm({ name: '' }); }}>
          <h3 className="font-heading text-lg font-semibold text-card-foreground mb-4">{categoryDialog.editing ? 'Edit Category' : 'Add Category'}</h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Category Name</label>
              <Input value={categoryForm.name} onChange={e => setCategoryForm({ name: e.target.value })} placeholder="Enter category name" />
            </div>
          </div>
          <div className="mt-4 flex gap-2 justify-end">
            <Button variant="outline" size="sm" onClick={() => { setCategoryDialog({ open: false, editing: null }); setCategoryForm({ name: '' }); }}>Cancel</Button>
            <Button size="sm" onClick={() => handleSaveCategory({ name: categoryForm.name })}><Save className="h-3 w-3 mr-1" /> {categoryDialog.editing ? 'Update' : 'Add'} Category</Button>
          </div>
        </DialogOverlay>
      )}
      {replyDialog && (
        <DialogOverlay onClose={() => setReplyDialog(null)}>
          <h3 className="font-heading text-lg font-semibold text-card-foreground mb-4">Reply to Comment</h3>
          <Textarea value={replyDialog.text} onChange={e => setReplyDialog({ ...replyDialog, text: e.target.value })} placeholder="Type your reply..." rows={3} />
          <div className="mt-4 flex gap-2 justify-end">
            <Button variant="outline" size="sm" onClick={() => setReplyDialog(null)}>Cancel</Button>
            <Button size="sm" onClick={() => { replyToComment(replyDialog.articleId, replyDialog.commentId, replyDialog.text); toast.success('Reply posted!'); setReplyDialog(null); }}><Reply className="h-3 w-3 mr-1" /> Post Reply</Button>
          </div>
        </DialogOverlay>
      )}
      {noteDialog && (
        <DialogOverlay onClose={() => setNoteDialog(false)}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading text-lg font-semibold text-card-foreground">Upload Note</h3>
            <button onClick={() => setNoteDialog(false)}><X className="h-4 w-4 text-muted-foreground" /></button>
          </div>
          <div className="space-y-3">
            <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Title *</label><Input value={noteForm.title} onChange={e => setNoteForm({ ...noteForm, title: e.target.value })} /></div>
            <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Category</label><Input value={noteForm.category} onChange={e => setNoteForm({ ...noteForm, category: e.target.value })} placeholder="e.g. Leadership Development" /></div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Course</label>
              <select value={noteForm.courseId} onChange={e => setNoteForm({ ...noteForm, courseId: e.target.value })} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option value="">Select a course</option>
                {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
              </select>
            </div>
            <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Description</label><Textarea value={noteForm.description} onChange={e => setNoteForm({ ...noteForm, description: e.target.value })} rows={3} /></div>
            <p className="text-xs text-muted-foreground">Note: File upload is simulated in demo mode.</p>
          </div>
          <div className="mt-4 flex gap-2 justify-end">
            <Button variant="outline" size="sm" onClick={() => setNoteDialog(false)}>Cancel</Button>
            <Button size="sm" onClick={handleAddNote}><Upload className="h-3 w-3 mr-1" /> Upload</Button>
          </div>
        </DialogOverlay>
      )}
    </div>
  );
};

// Form Dialogs
function CourseFormDialog({ initial, categories, onSave, onClose }: { initial: Course | null; categories: string[]; onSave: (data: Record<string, string>) => void; onClose: () => void }) {
  const [form, setForm] = useState({
    title: initial?.title || '', category: initial?.category || categories[0] || '', description: initial?.description || '',
    instructor: initial?.instructor || 'Lt Col Shreesh Kumar (Retd)', duration: initial?.duration || '',
    modules: initial?.modules?.toString() || '', price: initial?.price?.toString() || '', level: initial?.level || 'Beginner',
    image: initial?.image || '',
  });

  useEffect(() => {
    if (!initial && categories.length > 0) {
      setForm((prev) => ({ ...prev, category: categories[0] }));
    }
  }, [categories, initial]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageName, setImageName] = useState('No file chosen');
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setForm({ ...form, image: data.url });
        toast.success('Image uploaded successfully!');
      } else {
        toast.error('Failed to upload image');
      }
    } catch (error) {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImageName(file.name);
      handleImageUpload(file);
    }
  };
  return (
    <DialogOverlay onClose={onClose}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading text-lg font-semibold text-card-foreground">{initial ? 'Edit Course' : 'Add New Course'}</h3>
        <button onClick={onClose}><X className="h-4 w-4 text-muted-foreground" /></button>
      </div>
      <div className="space-y-3">
        <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Title *</label><Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Category *</label>
          <select
            value={form.category}
            onChange={e => setForm({ ...form, category: e.target.value })}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Description</label><Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Price (₹)</label><Input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} /></div>
          <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Duration</label><Input value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} placeholder="e.g. 4 weeks" /></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Modules</label><Input type="number" value={form.modules} onChange={e => setForm({ ...form, modules: e.target.value })} /></div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Level</label>
            <select value={form.level} onChange={e => setForm({ ...form, level: e.target.value })} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
              <option>Beginner</option><option>Intermediate</option><option>Advanced</option>
            </select>
          </div>
        </div>
        <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Instructor</label><Input value={form.instructor} onChange={e => setForm({ ...form, instructor: e.target.value })} /></div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Course Image</label>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <label className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground cursor-pointer hover:bg-primary/90">
                Choose File
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={uploading}
                  className="sr-only"
                />
              </label>
              <span className="text-xs text-muted-foreground truncate max-w-[220px]">{imageName}</span>
            </div>
            {uploading && <p className="text-xs text-muted-foreground">Uploading...</p>}
            {form.image && (
              <div className="flex items-center gap-2">
                <img src={form.image} alt="Course preview" className="h-16 w-16 object-cover rounded" />
                <span className="text-xs text-muted-foreground">Image uploaded</span>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="mt-4 flex gap-2 justify-end">
        <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
        <Button size="sm" onClick={() => onSave(form)} disabled={!form.title || !form.category}><Save className="h-3 w-3 mr-1" /> {initial ? 'Update' : 'Create'}</Button>
      </div>
    </DialogOverlay>
  );
}

function ClassFormDialog({ initial, courses, onSave, onClose }: { initial: LiveClass | null; courses: Course[]; onSave: (data: Record<string, string>) => void; onClose: () => void }) {
  const [form, setForm] = useState({
    title: initial?.title || '', instructor: initial?.instructor || 'Lt Col Shreesh Kumar (Retd)',
    date: initial?.date || '', time: initial?.time || '', meetLink: initial?.meetLink || '',
    courseId: initial?.courseId || courses[0]?.id || '', description: initial?.description || '',
  });
  return (
    <DialogOverlay onClose={onClose}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading text-lg font-semibold text-card-foreground">{initial ? 'Edit Class' : 'Schedule New Class'}</h3>
        <button onClick={onClose}><X className="h-4 w-4 text-muted-foreground" /></button>
      </div>
      <div className="space-y-3">
        <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Title *</label><Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Course</label>
          <select value={form.courseId} onChange={e => setForm({ ...form, courseId: e.target.value })} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
            {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Date</label><Input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} /></div>
          <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Time</label><Input value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} placeholder="e.g. 10:00 AM IST" /></div>
        </div>
        <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Google Meet Link</label><Input value={form.meetLink} onChange={e => setForm({ ...form, meetLink: e.target.value })} placeholder="https://meet.google.com/..." /></div>
        <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Description</label><Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} /></div>
        <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Instructor</label><Input value={form.instructor} onChange={e => setForm({ ...form, instructor: e.target.value })} /></div>
      </div>
      <div className="mt-4 flex gap-2 justify-end">
        <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
        <Button size="sm" onClick={() => onSave(form)} disabled={!form.title}><Save className="h-3 w-3 mr-1" /> {initial ? 'Update' : 'Schedule'}</Button>
      </div>
    </DialogOverlay>
  );
}

function ArticleFormDialog({ initial, onSave, onClose }: { initial: Article | null; onSave: (data: Record<string, string>) => void; onClose: () => void }) {
  const [form, setForm] = useState({
    title: initial?.title || '', category: initial?.category || '', excerpt: initial?.excerpt || '',
    content: initial?.content || '', author: initial?.author || 'Lt Col Shreesh Kumar (Retd)',
  });
  return (
    <DialogOverlay onClose={onClose}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading text-lg font-semibold text-card-foreground">{initial ? 'Edit Article' : 'New Article'}</h3>
        <button onClick={onClose}><X className="h-4 w-4 text-muted-foreground" /></button>
      </div>
      <div className="space-y-3">
        <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Title *</label><Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
        <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Category</label><Input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} placeholder="e.g. Leadership" /></div>
        <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Excerpt</label><Textarea value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })} rows={2} /></div>
        <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Content *</label><Textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} rows={6} /></div>
        <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Author</label><Input value={form.author} onChange={e => setForm({ ...form, author: e.target.value })} /></div>
      </div>
      <div className="mt-4 flex gap-2 justify-end">
        <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
        <Button size="sm" onClick={() => onSave(form)} disabled={!form.title || !form.content}><Save className="h-3 w-3 mr-1" /> {initial ? 'Update' : 'Publish'}</Button>
      </div>
    </DialogOverlay>
  );
}

export default AdminPage;
