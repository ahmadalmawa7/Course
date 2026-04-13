import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { Calendar, Clock, User, Video, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const LiveClassesPage = () => {
  const { user } = useAuth();
  const { liveClasses, courses } = useData();

  return (
    <div>
      <section className="bg-gradient-hero py-16">
        <div className="container mx-auto px-4 text-center">
          <p className="mb-2 text-xs font-medium tracking-[0.3em] text-gold uppercase">Interactive Sessions</p>
          <h1 className="mb-4 font-heading text-4xl font-bold text-secondary md:text-5xl">Live Classes</h1>
          <p className="mx-auto max-w-xl text-secondary/80">Daily interactive sessions conducted via Google Meet by our expert instructors.</p>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-6 md:grid-cols-2">
            {liveClasses.map((cls) => {
              const course = courses.find((c) => c.id === cls.courseId);
              const isEnrolled = user?.enrolledCourses.includes(cls.courseId);
              return (
                <div key={cls.id} className="rounded-lg border border-border bg-card p-6">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="rounded-sm bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                      {course?.category}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gold">
                      <Video className="h-3 w-3" /> Live Session
                    </span>
                  </div>
                  <h3 className="mb-2 font-heading text-lg font-semibold text-card-foreground">{cls.title}</h3>
                  <p className="mb-4 text-sm text-muted-foreground">{cls.description}</p>
                  <div className="mb-4 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5"><Calendar className="h-3 w-3 text-gold" /> {cls.date}</span>
                    <span className="flex items-center gap-1.5"><Clock className="h-3 w-3 text-gold" /> {cls.time}</span>
                    <span className="flex items-center gap-1.5"><User className="h-3 w-3 text-gold" /> {cls.instructor.split(',')[0]}</span>
                  </div>
                  {user ? (
                    isEnrolled ? (
                      <a href={cls.meetLink} target="_blank" rel="noopener noreferrer">
                        <Button className="w-full bg-gold text-charcoal hover:bg-gold-dark font-semibold gap-1.5">
                          <ExternalLink className="h-4 w-4" /> Join Google Meet
                        </Button>
                      </a>
                    ) : (
                      <div className="text-center">
                        <p className="mb-2 text-xs text-muted-foreground">Enroll in the course to join this class</p>
                        <Link to={`/courses/${cls.courseId}`}>
                          <Button variant="outline" size="sm" className="border-primary text-primary">View Course</Button>
                        </Link>
                      </div>
                    )
                  ) : (
                    <Link to="/login">
                      <Button variant="outline" className="w-full border-primary text-primary">Sign in to Join</Button>
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LiveClassesPage;
