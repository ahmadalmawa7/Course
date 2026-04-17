import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { BookOpen } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface ArticleSubmissionDialogProps {
  onSubmitSuccess?: () => void;
}

export const ArticleSubmissionDialog = ({ onSubmitSuccess }: ArticleSubmissionDialogProps) => {
  const { user } = useAuth();
  const { refetchArticles } = useData();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: 'Leadership',
    readTime: '5 min read',
    image: '',
  });

  if (!user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          author: user.name,
          date: new Date().toISOString().split('T')[0],
          status: 'pending',
          submittedBy: user.email,
        }),
      });

      if (response.ok) {
        toast.success('Article submitted for approval!');
        setFormData({
          title: '',
          excerpt: '',
          content: '',
          category: 'Leadership',
          readTime: '5 min read',
          image: '',
        });
        setOpen(false);

        // Refetch articles to update the admin panel if needed
        if (refetchArticles) await refetchArticles();
        if (onSubmitSuccess) onSubmitSuccess();
      } else {
        toast.error('Failed to submit article');
      }
    } catch (error) {
      toast.error('Error submitting article');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-primary text-primary-foreground">
          <BookOpen className="h-4 w-4" />
          Submit Article
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Submit an Article</DialogTitle>
          <DialogDescription>
            Share your insights with our community. Your article will be reviewed by our admin team before publication.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground">Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Article title"
              className="w-full rounded-lg border border-border bg-card p-2 text-sm text-card-foreground focus:outline-none focus:ring-1 focus:ring-primary mt-1"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">Excerpt *</label>
            <textarea
              required
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              placeholder="Brief summary (one or two sentences)"
              rows={2}
              className="w-full rounded-lg border border-border bg-card p-2 text-sm text-card-foreground focus:outline-none focus:ring-1 focus:ring-primary mt-1"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">Content *</label>
            <textarea
              required
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Full article content"
              rows={6}
              className="w-full rounded-lg border border-border bg-card p-2 text-sm text-card-foreground focus:outline-none focus:ring-1 focus:ring-primary mt-1"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full rounded-lg border border-border bg-card p-2 text-sm text-card-foreground focus:outline-none focus:ring-1 focus:ring-primary mt-1"
              >
                <option>Leadership</option>
                <option>Communication Skills</option>
                <option>Career Development</option>
                <option>Personal Growth</option>
                <option>Corporate Behaviour</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">Read Time</label>
              <input
                type="text"
                value={formData.readTime}
                onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                placeholder="e.g., 5 min read"
                className="w-full rounded-lg border border-border bg-card p-2 text-sm text-card-foreground focus:outline-none focus:ring-1 focus:ring-primary mt-1"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">Image URL</label>
            <input
              type="url"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              placeholder="https://..."
              className="w-full rounded-lg border border-border bg-card p-2 text-sm text-card-foreground focus:outline-none focus:ring-1 focus:ring-primary mt-1"
            />
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-primary text-primary-foreground"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit Article'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
