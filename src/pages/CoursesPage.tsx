import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '@/contexts/DataContext';
import { Clock, Star, Users, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CoursesPage = () => {
  const { courses, categories } = useData();
  const [activeCategory, setActiveCategory] = useState('All');
  const filtered = activeCategory === 'All' ? courses : courses.filter((c) => c.category === activeCategory);

  return (
    <div>
      <section className="bg-gradient-hero py-16">
        <div className="container mx-auto px-4 text-center">
          <p className="mb-2 text-xs font-medium tracking-[0.3em] text-gold uppercase">Our Programs</p>
          <h1 className="mb-4 font-heading text-4xl font-bold text-secondary md:text-5xl">Courses</h1>
          <p className="mx-auto max-w-xl text-secondary/80">Comprehensive training programs designed for professionals at every stage of their career.</p>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          {/* Category Filters */}
          <div className="mb-8 flex flex-wrap gap-2">
            {categories.map((cat) => (
              <Button
                key={cat}
                size="sm"
                variant={activeCategory === cat ? 'default' : 'outline'}
                className={activeCategory === cat ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </Button>
            ))}
          </div>

          {/* Course Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((course) => (
              <Link key={course.id} to={`/courses/${course.id}`} className="group">
                <div className="h-full rounded-lg border border-border bg-card p-6 transition-all hover:border-gold/50 hover:shadow-lg">
                  <div className="mb-4 h-40 overflow-hidden rounded-lg bg-slate-100">
                    <img
                      src={course.image || '/placeholder.svg'}
                      alt={course.title}
                      className="h-full w-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.svg'; }}
                    />
                  </div>
                  <div className="mb-3 flex items-center justify-between">
                    <span className="rounded-sm bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">{course.category}</span>
                    <span className="rounded-sm bg-muted px-2 py-0.5 text-xs text-muted-foreground">{course.level}</span>
                  </div>
                  <h3 className="mb-2 font-heading text-lg font-semibold text-card-foreground group-hover:text-primary transition-colors">{course.title}</h3>
                  <p className="mb-4 text-sm text-muted-foreground line-clamp-2">{course.description}</p>
                  <div className="mb-4 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {course.duration}</span>
                    <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" /> {course.modules} modules</span>
                    <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {course.enrolled} enrolled</span>
                    <span className="flex items-center gap-1"><Star className="h-3 w-3 text-gold" /> {course.rating}</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-border pt-3">
                    <span className="font-heading text-xl font-bold text-primary">₹{course.price.toLocaleString()}</span>
                    <span className="text-xs text-muted-foreground">{course.instructor.split(',')[0]}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default CoursesPage;
