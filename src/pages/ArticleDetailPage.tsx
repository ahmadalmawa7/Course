import { useParams, Link } from 'react-router-dom';
import { useData } from '@/contexts/DataContext';
import { ArrowLeft, Clock, User, Calendar, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const ArticleDetailPage = () => {
  const { id } = useParams();
  const { articles, addComment } = useData();
  const article = articles.find((a) => a.id === id);
  const { user } = useAuth();
  const [comment, setComment] = useState('');

  if (!article) return <div className="container mx-auto px-4 py-20 text-center"><p>Article not found.</p><Link to="/articles" className="text-primary underline">Back to Articles</Link></div>;

  const handleComment = () => {
    if (!comment.trim() || !user) return;
    addComment(article.id, {
      id: `cm-${Date.now()}`,
      user: user.name,
      text: comment,
      date: new Date().toISOString().split('T')[0],
    });
    toast.success('Comment posted!');
    setComment('');
  };

  return (
    <div>
      <section className="bg-gradient-hero py-16">
        <div className="container mx-auto px-4">
          <Link to="/articles" className="mb-4 inline-flex items-center gap-1 text-sm text-secondary/70 hover:text-gold transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Articles
          </Link>
          <span className="mb-3 block text-xs font-medium text-gold">{article.category}</span>
          <h1 className="mb-4 font-heading text-3xl font-bold text-secondary md:text-4xl">{article.title}</h1>
          <div className="flex flex-wrap gap-4 text-sm text-secondary/70">
            <span className="flex items-center gap-1"><User className="h-4 w-4 text-gold" /> {article.author}</span>
            <span className="flex items-center gap-1"><Calendar className="h-4 w-4 text-gold" /> {article.date}</span>
            <span className="flex items-center gap-1"><Clock className="h-4 w-4 text-gold" /> {article.readTime}</span>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <div className="prose prose-lg max-w-none">
              {article.content.split('\n\n').map((p, i) => (
                <p key={i} className="mb-4 text-foreground leading-relaxed">{p}</p>
              ))}
            </div>

            {/* Comments */}
            <div className="mt-12 border-t border-border pt-8">
              <h3 className="mb-6 font-heading text-xl font-bold text-foreground flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-gold" /> Comments ({article.comments.length})
              </h3>
              <div className="space-y-4">
                {article.comments.map((c) => (
                  <div key={c.id} className="rounded-lg border border-border bg-card p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-medium text-card-foreground">{c.user}</span>
                      <span className="text-xs text-muted-foreground">{c.date}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{c.text}</p>
                    {c.reply && (
                      <div className="mt-3 ml-4 rounded-md border-l-2 border-gold bg-muted/50 p-3">
                        <p className="text-xs font-medium text-gold mb-1">Admin Reply</p>
                        <p className="text-sm text-muted-foreground">{c.reply}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {user ? (
                <div className="mt-6">
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Write a comment..."
                    className="w-full rounded-lg border border-border bg-card p-3 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    rows={3}
                  />
                  <Button onClick={handleComment} size="sm" className="mt-2 bg-primary text-primary-foreground">
                    Post Comment
                  </Button>
                </div>
              ) : (
                <p className="mt-4 text-sm text-muted-foreground">
                  <Link to="/login" className="text-primary underline">Sign in</Link> to leave a comment.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ArticleDetailPage;
