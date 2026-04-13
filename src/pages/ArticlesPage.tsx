import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '@/contexts/DataContext';
import { Clock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ArticlesPage = () => {
  const { articles, categories } = useData();
  const [active, setActive] = useState('All');

  const filtered = active === 'All' ? articles : articles.filter((a) => a.category === active);

  return (
    <div>
      <section className="bg-gradient-hero py-16">
        <div className="container mx-auto px-4 text-center">
          <p className="mb-2 text-xs font-medium tracking-[0.3em] text-gold uppercase">Knowledge Hub</p>
          <h1 className="mb-4 font-heading text-4xl font-bold text-secondary md:text-5xl">Articles</h1>
          <p className="mx-auto max-w-xl text-secondary/80">Insights on leadership, communication, career development, and professional growth.</p>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex flex-wrap gap-2">
            {categories.map((cat) => (
              <Button key={cat} size="sm" variant={active === cat ? 'default' : 'outline'} className={active === cat ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'} onClick={() => setActive(cat)}>
                {cat}
              </Button>
            ))}
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((article) => (
              <Link key={article.id} to={`/articles/${article.id}`} className="group">
                <div className="h-full rounded-lg border border-border bg-card p-6 transition-all hover:border-gold/50 hover:shadow-md">
                  <span className="mb-2 inline-block text-xs font-medium text-gold">{article.category}</span>
                  <h3 className="mb-2 font-heading text-lg font-semibold text-card-foreground group-hover:text-primary transition-colors">{article.title}</h3>
                  <p className="mb-4 text-sm text-muted-foreground line-clamp-3">{article.excerpt}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><User className="h-3 w-3" /> {article.author.split(',')[0]}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {article.readTime}</span>
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

export default ArticlesPage;
