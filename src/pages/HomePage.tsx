import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowRight, BookOpen, Users, Award, Video, Star, Calendar, Clock } from 'lucide-react';
import { toast } from 'sonner';
import EnquiryPopup from '@/components/EnquiryPopup';

const HomePage = () => {
  const { courses, liveClasses, articles, testimonials, addTestimonial } = useData();
  const { user } = useAuth();
  const featuredCourses = courses.slice(0, 4);
  const upcomingClasses = liveClasses.slice(0, 3);
  const latestArticles = articles.slice(0, 3);
  const approvedTestimonials = testimonials.filter(t => t.approved);

  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackForm, setFeedbackForm] = useState({ text: '', rating: 5 });

  const handleFeedback = () => {
    if (!feedbackForm.text) { toast.error('Please write your feedback.'); return; }
    addTestimonial({
      id: `t-${Date.now()}`, name: user?.name || 'Anonymous', role: 'Student',
      text: feedbackForm.text, rating: feedbackForm.rating, approved: false,
      date: new Date().toISOString().split('T')[0],
    });
    toast.success('Thank you! Your feedback will appear after admin approval.');
    setFeedbackForm({ text: '', rating: 5 });
    setShowFeedback(false);
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero py-24 md:py-32">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.15\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
        <div className="container relative mx-auto px-4 text-center">
          <p className="mb-4 text-sm font-medium tracking-[0.3em] text-gold uppercase animate-fade-in-up">We will help you achieve transformation…</p>
          <h1 className="mb-6 font-heading text-4xl font-bold leading-tight text-secondary md:text-6xl lg:text-7xl animate-fade-in-up" style={{ animationDelay: '0.1s' }}>Erudition Infinite</h1>
          <p className="mx-auto mb-6 max-w-2xl text-lg text-secondary/80 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            To deliver training and management solutions to the total satisfaction and delight of the customer and exceed expectations.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <Link to="/courses"><Button size="lg" className="bg-gold text-charcoal hover:bg-gold-dark font-semibold px-8">Explore Courses <ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
            <Link to="/about"><Button size="lg" variant="outline" className="border-amber-700 text-amber-700 hover:bg-amber-700 hover:text-white">About Us</Button></Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-border bg-background py-12">
        <div className="container mx-auto grid grid-cols-2 gap-6 px-4 md:grid-cols-4">
          {[
            { icon: BookOpen, label: 'Courses', value: '10+' },
            { icon: Users, label: 'Students Trained', value: '4,000+' },
            { icon: Award, label: 'Certifications', value: '2,500+' },
            { icon: Video, label: 'Live Sessions', value: '500+' },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="text-center">
              <Icon className="mx-auto mb-2 h-6 w-6 text-gold" />
              <p className="font-heading text-2xl font-bold text-foreground">{value}</p>
              <p className="text-sm text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About the Institute */}
      <section className="bg-cream py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <p className="mb-2 text-xs font-medium tracking-[0.3em] text-gold uppercase text-center">About the Institute</p>
            <h2 className="mb-8 font-heading text-3xl font-bold text-foreground md:text-4xl text-center">About the Institute</h2>
            <div className="space-y-6 text-muted-foreground leading-relaxed text-lg">
              <p>
                At Erudition Infinite we strive to nurture and shape aspirants' talents and personalities. We are committed to offer solutions to our esteemed clients after studying their area of business and analysing their needs. We deliver customized <strong className="text-primary">training</strong> and <strong className="text-primary">management</strong> development programs for corporates, government and private organisations, as well as for students of management, engineering and other professional institutes/establishments.
              </p>
              <p>
                Erudition Infinite offers <strong className="text-primary">consultancy</strong> in training, <strong className="text-primary">management</strong> development, project management, <strong className="text-primary">ISO 9001:2008</strong>, subject research and report, and guidance to <strong className="text-primary">MBA</strong> and <strong className="text-primary">engineering students</strong> for final year projects. With our panel of qualified professionals, who are also highly experienced domain experts, we shall endeavour to deliver solutions to completely satisfy and delight the client.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="mb-10 text-center">
            <p className="mb-2 text-xs font-medium tracking-[0.3em] text-gold uppercase">Our Programs</p>
            <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">Featured Courses</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {featuredCourses.map((course) => (
              <Link key={course.id} to={`/courses/${course.id}`} className="group">
                <div className="h-full rounded-lg border border-border bg-card p-6 transition-all hover:border-gold/50 hover:shadow-lg">
                  <span className="mb-3 inline-block rounded-sm bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">{course.category}</span>
                  <h3 className="mb-2 font-heading text-lg font-semibold text-card-foreground group-hover:text-primary transition-colors">{course.title}</h3>
                  <p className="mb-4 text-sm text-muted-foreground line-clamp-2">{course.description}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {course.duration}</span>
                    <span className="flex items-center gap-1"><Star className="h-3 w-3 text-gold" /> {course.rating}</span>
                  </div>
                  <div className="mt-3 pt-3 border-t border-border">
                    <span className="font-heading text-lg font-bold text-primary">₹{course.price.toLocaleString()}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link to="/courses"><Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">View All Courses <ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
          </div>
        </div>
      </section>

      {/* Live Classes */}
      <section className="bg-cream py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="mb-10 text-center">
            <p className="mb-2 text-xs font-medium tracking-[0.3em] text-gold uppercase">Interactive Learning</p>
            <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">Upcoming Live Classes</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {upcomingClasses.map((cls) => (
              <div key={cls.id} className="rounded-lg border border-border bg-card p-5">
                <h3 className="mb-2 font-heading text-base font-semibold text-card-foreground">{cls.title}</h3>
                <p className="mb-3 text-sm text-muted-foreground">{cls.description}</p>
                <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5"><Calendar className="h-3 w-3 text-gold" /> {cls.date}</span>
                  <span className="flex items-center gap-1.5"><Clock className="h-3 w-3 text-gold" /> {cls.time}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link to="/live-classes"><Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">View All Live Classes <ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
          </div>
        </div>
      </section>

      {/* Articles */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="mb-10 text-center">
            <p className="mb-2 text-xs font-medium tracking-[0.3em] text-gold uppercase">Knowledge Hub</p>
            <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">Latest Articles</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {latestArticles.map((article) => (
              <Link key={article.id} to={`/articles/${article.id}`} className="group">
                <div className="rounded-lg border border-border bg-card p-6 transition-all hover:border-gold/50 hover:shadow-md">
                  <span className="mb-2 inline-block text-xs font-medium text-gold">{article.category}</span>
                  <h3 className="mb-2 font-heading text-lg font-semibold text-card-foreground group-hover:text-primary transition-colors">{article.title}</h3>
                  <p className="mb-4 text-sm text-muted-foreground line-clamp-2">{article.excerpt}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{article.author}</span>
                    <span>{article.readTime}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link to="/articles"><Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">Read More Articles <ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gradient-hero py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="mb-10 text-center">
            <p className="mb-2 text-xs font-medium tracking-[0.3em] text-gold uppercase">Testimonials</p>
            <h2 className="font-heading text-3xl font-bold text-secondary md:text-4xl">What Our Students Say</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {approvedTestimonials.map((t) => (
              <div key={t.id} className="rounded-lg border border-secondary/10 bg-secondary/5 p-6 backdrop-blur-sm">
                <div className="mb-3 flex gap-0.5">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-gold text-gold" />
                  ))}
                </div>
                <p className="mb-4 text-sm text-secondary/80 italic leading-relaxed">"{t.text}"</p>
                <p className="font-semibold text-secondary text-sm">{t.name}</p>
                <p className="text-xs text-secondary/60">{t.role}</p>
              </div>
            ))}
          </div>
          {user && (
            <div className="mt-8 text-center">
              {!showFeedback ? (
                <Button variant="outline" className="border-secondary/30 text-secondary hover:bg-secondary/10" onClick={() => setShowFeedback(true)}>Share Your Feedback</Button>
              ) : (
                <div className="mx-auto max-w-md rounded-lg bg-secondary/10 p-5 backdrop-blur-sm">
                  <h3 className="font-heading text-base font-semibold text-secondary mb-3">Your Feedback</h3>
                  <div className="flex gap-1 mb-3 justify-center">
                    {[1, 2, 3, 4, 5].map(r => (
                      <button key={r} onClick={() => setFeedbackForm({ ...feedbackForm, rating: r })}>
                        <Star className={`h-6 w-6 ${r <= feedbackForm.rating ? 'fill-gold text-gold' : 'text-secondary/30'}`} />
                      </button>
                    ))}
                  </div>
                  <Textarea value={feedbackForm.text} onChange={e => setFeedbackForm({ ...feedbackForm, text: e.target.value })} placeholder="Share your experience..." rows={3} className="mb-3 bg-secondary/10 border-secondary/20 text-secondary placeholder:text-secondary/40" />
                  <div className="flex gap-2 justify-center">
                    <Button variant="outline" size="sm" className="border-secondary/30 text-secondary" onClick={() => setShowFeedback(false)}>Cancel</Button>
                    <Button size="sm" className="bg-gold text-charcoal hover:bg-gold-dark" onClick={handleFeedback}>Submit</Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 font-heading text-3xl font-bold text-foreground md:text-4xl">Begin Your Professional Transformation</h2>
          <p className="mx-auto mb-8 max-w-xl text-muted-foreground">Join thousands of professionals who have elevated their careers through Erudition Infinite's programs.</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/register"><Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 px-8">Register Now <ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
            <Link to="/courses"><Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">Browse Courses</Button></Link>
          </div>
        </div>
      </section>
      {!user && <EnquiryPopup />}
    </div>
  );
};

export default HomePage;
