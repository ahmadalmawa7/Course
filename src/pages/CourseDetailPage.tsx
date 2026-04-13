import { useParams, Link } from 'react-router-dom';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Clock, BookOpen, Users, Star, Award, ArrowLeft, CheckCircle } from 'lucide-react';

const CourseDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { courses } = useData();
  const course = courses.find((c) => c.id === id);

  if (!course) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p>Course not found.</p>
        <Link to="/live-classes" className="text-primary underline">Back to Courses</Link>
      </div>
    );
  }

  const isEnrolled = Boolean(user?.enrolledCourses.includes(course.id));

  return (
    <div>
      <section className="bg-gradient-hero py-16">
        <div className="container mx-auto px-4">
          <Link to="/live-classes" className="mb-4 inline-flex items-center gap-1 text-sm text-secondary/70 hover:text-gold transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Courses
          </Link>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="md:col-span-2">
              <span className="mb-3 inline-block rounded-sm bg-gold/20 px-2 py-0.5 text-xs font-medium text-gold">{course.category}</span>
              <h1 className="mb-4 font-heading text-3xl font-bold text-secondary md:text-4xl">{course.title}</h1>
              <p className="mb-6 text-secondary/80 leading-relaxed">{course.description}</p>
              <div className="flex flex-wrap gap-4 text-sm text-secondary/70">
                <span className="flex items-center gap-1"><Clock className="h-4 w-4 text-gold" /> {course.duration}</span>
                <span className="flex items-center gap-1"><BookOpen className="h-4 w-4 text-gold" /> {course.modules} modules</span>
                <span className="flex items-center gap-1"><Users className="h-4 w-4 text-gold" /> {course.enrolled} enrolled</span>
                <span className="flex items-center gap-1"><Star className="h-4 w-4 text-gold" /> {course.rating}</span>
                <span className="flex items-center gap-1"><Award className="h-4 w-4 text-gold" /> {course.level}</span>
              </div>
            </div>

            <div className="rounded-lg border border-secondary/10 bg-secondary/5 p-6 backdrop-blur-sm">
              <p className="mb-1 text-sm text-secondary/60">Course Price</p>
              <p className="mb-4 font-heading text-3xl font-bold text-gold">?{Math.max(0, course.price).toLocaleString()}</p>
              <p className="mb-1 text-sm text-secondary/60">Instructor</p>
              <p className="mb-4 font-semibold text-secondary">{course.instructor}</p>
              {isEnrolled ? (
                <Button className="w-full bg-gold/20 text-gold cursor-default" disabled> Enrolled</Button>
              ) : (
                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/80 font-semibold" disabled>
                  Enrollment unavailable
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="mb-6 font-heading text-2xl font-bold text-foreground">Course Modules</h2>
          <div className="space-y-3">
            {course.modulesList.map((mod, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg border border-border bg-card px-5 py-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">{i + 1}</span>
                  <div>
                    <p className="font-medium text-card-foreground">{mod.title}</p>
                    <p className="text-xs text-muted-foreground">{mod.lessons} lessons  {mod.duration}</p>
                  </div>
                </div>
                {isEnrolled && <CheckCircle className="h-5 w-5 text-muted-foreground" />}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default CourseDetailPage;
