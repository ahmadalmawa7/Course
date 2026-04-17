import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import {
  Play, Lock, CheckCircle, ChevronDown, ChevronUp, BookOpen,
  FileText, Clock, Star, ArrowLeft, TrendingUp, X
} from 'lucide-react';
import { toast } from 'sonner';

const TABS = ['Lectures', 'Notes', 'Assignments'] as const;
type Tab = typeof TABS[number];

const CourseLearningPage = () => {
  const { id } = useParams();
  const { user, enrollInCourse } = useAuth();
  const { courses, updateProgress, getCourseProgress, isEnrolled, lectureProgress } = useData();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<Tab>('Lectures');
  const [expandedModules, setExpandedModules] = useState<number[]>([0]);
  const [currentLecture, setCurrentLecture] = useState<string | null>(null);
  const [watchTime, setWatchTime] = useState(0);

  const course = courses.find((c) => c.id === id);
  const isUserEnrolled = user && isEnrolled(user.id, id || '');
  const progress = user ? getCourseProgress(user.id, id || '') : 0;

  useEffect(() => {
    if (!user || !id) return;
    if (!isUserEnrolled) {
      navigate(`/courses/${id}`);
      toast.error('Please enroll to access this course');
    }
  }, [user, id, isUserEnrolled, navigate]);

  const toggleModule = (idx: number) => {
    setExpandedModules((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const handleLectureClick = (lectureId: string) => {
    setCurrentLecture(lectureId);
  };

  const handleMarkComplete = async () => {
    if (!user || !currentLecture || !id) return;
    try {
      await updateProgress(user.id, id, currentLecture, true, watchTime);
      toast.success('Lecture marked as completed! 🎉');
    } catch (error) {
      toast.error('Failed to update progress');
    }
  };

  const handleEnroll = async () => {
    if (!user || !id) return;
    try {
      await enrollInCourse(id);
      toast.success('Enrolled Successfully 🎉');
    } catch (error) {
      toast.error('Failed to enroll');
    }
  };

  if (!course) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-muted-foreground mb-4">Course not found.</p>
        <Link to="/courses" className="text-primary underline">Back to Courses</Link>
      </div>
    );
  }

  if (!isUserEnrolled) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <Lock className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
        <h2 className="text-2xl font-bold mb-4">Enroll to Access This Course</h2>
        <p className="text-muted-foreground mb-6">You need to enroll in this course to access the learning materials.</p>
        <Button onClick={handleEnroll} className="bg-primary text-primary-foreground hover:bg-primary-hover">
          Enroll Now
        </Button>
      </div>
    );
  }

  const currentLectureData = currentLecture
    ? course.recordedLectures?.find(l => l.id === currentLecture)
    : null;

  const isLectureCompleted = currentLecture
    ? lectureProgress.some(lp => lp.userId === user?.id && lp.lectureId === currentLecture && lp.completed)
    : false;

  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to={`/courses/${id}`} className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="font-heading text-lg font-semibold text-foreground">{course.title}</h1>
              <p className="text-xs text-muted-foreground">{course.instructor}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-gold" />
              <span className="text-sm font-medium text-foreground">{progress}%</span>
            </div>
            <div className="h-2 w-24 rounded-full bg-muted overflow-hidden">
              <div className="h-full bg-gold transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Side - Video Player and Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Player */}
            <div className="rounded-lg overflow-hidden bg-black aspect-video">
              {currentLectureData ? (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center text-white">
                    <Play className="mx-auto mb-2 h-12 w-12" />
                    <p className="text-lg font-medium">{currentLectureData.title}</p>
                    <p className="text-sm text-white/70">{currentLectureData.duration}</p>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center text-white/70">
                    <Play className="mx-auto mb-2 h-12 w-12" />
                    <p>Select a lecture to start learning</p>
                  </div>
                </div>
              )}
            </div>

            {/* Lecture Info */}
            {currentLectureData && (
              <div className="rounded-lg border border-border bg-card p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h2 className="font-heading text-xl font-bold text-foreground mb-2">
                      {currentLectureData.title}
                    </h2>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {currentLectureData.duration}</span>
                      {isLectureCompleted && (
                        <span className="flex items-center gap-1 text-green-600">
                          <CheckCircle className="h-4 w-4" /> Completed
                        </span>
                      )}
                    </div>
                  </div>
                  <Button
                    onClick={handleMarkComplete}
                    disabled={isLectureCompleted}
                    className={isLectureCompleted ? 'bg-green-600 hover:bg-green-700' : 'bg-primary text-primary-foreground hover:bg-primary-hover'}
                  >
                    {isLectureCompleted ? 'Completed' : 'Mark as Complete'}
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  This lecture covers key concepts and practical examples. Watch the video carefully and take notes for better understanding.
                </p>
              </div>
            )}

            {/* Tabs */}
            <div className="rounded-lg border border-border bg-card overflow-hidden">
              <div className="flex border-b border-border">
                {TABS.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === tab
                        ? 'border-primary text-primary'
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="p-6">
                {activeTab === 'Lectures' && (
                  <div className="text-center text-muted-foreground">
                    <BookOpen className="mx-auto mb-2 h-8 w-8" />
                    <p>Select lectures from the sidebar to view details</p>
                  </div>
                )}
                {activeTab === 'Notes' && (
                  <div className="text-center text-muted-foreground">
                    <FileText className="mx-auto mb-2 h-8 w-8" />
                    <p>Course notes will be available here</p>
                  </div>
                )}
                {activeTab === 'Assignments' && (
                  <div className="text-center text-muted-foreground">
                    <FileText className="mx-auto mb-2 h-8 w-8" />
                    <p>Assignments will be available here</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar - Lecture List */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 rounded-lg border border-border bg-card overflow-hidden">
              <div className="p-4 border-b border-border bg-muted/30">
                <h3 className="font-heading text-base font-semibold text-foreground">Course Content</h3>
                <p className="text-xs text-muted-foreground">{course.modules} modules · {course.duration}</p>
              </div>

              <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
                {course.modulesList.map((mod, idx) => {
                  const moduleLectures = (course.recordedLectures || []).filter((l) => l.moduleIndex === idx);
                  return (
                    <div key={idx} className="border-b border-border last:border-b-0">
                      <button
                        onClick={() => toggleModule(idx)}
                        className="w-full flex items-center justify-between p-4 hover:bg-muted/40 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary shrink-0">
                            {idx + 1}
                          </span>
                          <span className="font-medium text-card-foreground text-sm text-left">{mod.title}</span>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="text-xs text-muted-foreground">
                            {mod.lessons} lessons · {mod.duration}
                          </span>
                          {expandedModules.includes(idx) ? (
                            <ChevronUp className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                      </button>

                      {expandedModules.includes(idx) && (
                        <div className="divide-y divide-border bg-muted/20">
                          {moduleLectures.map((lec) => {
                            const isCompleted = lectureProgress.some(
                              lp => lp.userId === user?.id && lp.lectureId === lec.id && lp.completed
                            );
                            const isActive = currentLecture === lec.id;
                            return (
                              <div
                                key={lec.id}
                                onClick={() => handleLectureClick(lec.id)}
                                className={`flex items-center justify-between p-4 cursor-pointer transition-colors ${
                                  isActive ? 'bg-primary/10 border-l-4 border-primary' : 'hover:bg-muted/40'
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  {isCompleted ? (
                                    <CheckCircle className="h-4 w-4 text-green-600 shrink-0" />
                                  ) : lec.isPreview || isUserEnrolled ? (
                                    <Play className="h-4 w-4 text-primary shrink-0" />
                                  ) : (
                                    <Lock className="h-4 w-4 text-muted-foreground shrink-0" />
                                  )}
                                  <span className={`text-sm ${isActive ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                                    {lec.title}
                                  </span>
                                </div>
                                <span className="text-xs text-muted-foreground shrink-0">{lec.duration}</span>
                              </div>
                            );
                          })}

                          {moduleLectures.length === 0 && (
                            <div className="p-4 text-sm text-muted-foreground">
                              Content coming soon...
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseLearningPage;
