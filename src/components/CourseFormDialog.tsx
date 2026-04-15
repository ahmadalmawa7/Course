import { useState, useEffect } from 'react';
import { Course, RecordedLecture } from '@/data/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { X, Save, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface DialogOverlayProps {
  children: React.ReactNode;
  onClose: () => void;
}

export const DialogOverlay = ({ children, onClose }: DialogOverlayProps) => (
  <div
    className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4 overflow-y-auto"
    onClick={onClose}
  >
    <div
      className="my-6 w-full max-w-2xl rounded-lg bg-card shadow-xl"
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </div>
  </div>
);

interface CourseFormDialogProps {
  initial: Course | null;
  categories: string[];
  onSave: (data: Partial<Course>) => void;
  onClose: () => void;
}

type TabKey = 'basic' | 'details' | 'curriculum' | 'media';

export function CourseFormDialog({ initial, categories, onSave, onClose }: CourseFormDialogProps) {
  const [tab, setTab] = useState<TabKey>('basic');
  const [uploading, setUploading] = useState(false);
  const [imageName, setImageName] = useState('No file chosen');

  const [form, setForm] = useState({
    title: initial?.title || '',
    category: initial?.category || categories.filter(c => c !== 'All')[0] || '',
    description: initial?.description || '',
    instructor: initial?.instructor || 'Lt Col Shreesh Kumar (Retd)',
    instructorBio: initial?.instructorBio || '',
    duration: initial?.duration || '',
    modules: initial?.modules?.toString() || '6',
    price: initial?.price?.toString() || '',
    originalPrice: initial?.originalPrice?.toString() || '',
    level: initial?.level || 'Beginner',
    image: initial?.image || '',
    language: initial?.language || 'English',
    certificate: initial?.certificate ?? true,
    liveSessionsIncluded: initial?.liveSessionsIncluded ?? true,
    notesIncluded: initial?.notesIncluded ?? true,
    syllabus: initial?.syllabus || '',
    whyTake: initial?.whyTake || '',
  });

  const [highlights, setHighlights] = useState<string[]>(initial?.highlights || ['']);
  const [advantages, setAdvantages] = useState<string[]>(initial?.advantages || ['']);
  const [requirements, setRequirements] = useState<string[]>(initial?.requirements || ['']);
  const [targetAudience, setTargetAudience] = useState<string[]>(initial?.targetAudience || ['']);
  const [tags, setTags] = useState<string>(initial?.tags?.join(', ') || '');

  const [modulesList, setModulesList] = useState(
    initial?.modulesList?.length
      ? initial.modulesList
      : [{ title: '', lessons: 1, duration: '1 hr', topics: [] as string[] }]
  );

  const [lectures, setLectures] = useState<RecordedLecture[]>(
    initial?.recordedLectures || []
  );

  useEffect(() => {
    if (!initial && categories.filter(c => c !== 'All').length > 0) {
      setForm(prev => ({ ...prev, category: categories.filter(c => c !== 'All')[0] }));
    }
  }, [categories, initial]);

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch('/api/upload', { method: 'POST', body: formData });
      if (response.ok) {
        const data = await response.json();
        setForm(prev => ({ ...prev, image: data.url }));
        toast.success('Image uploaded!');
      } else {
        toast.error('Upload failed');
      }
    } catch {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const updateList = (
    list: string[],
    setList: (v: string[]) => void,
    idx: number,
    val: string
  ) => {
    const next = [...list];
    next[idx] = val;
    setList(next);
  };

  const addListItem = (list: string[], setList: (v: string[]) => void) =>
    setList([...list, '']);

  const removeListItem = (list: string[], setList: (v: string[]) => void, idx: number) =>
    setList(list.filter((_, i) => i !== idx));

  const handleSave = () => {
    if (!form.title || !form.category) {
      toast.error('Title and category are required.');
      return;
    }
    onSave({
      ...form,
      modules: Math.max(1, parseInt(form.modules) || modulesList.length),
      price: Math.max(0, parseFloat(form.price) || 0),
      originalPrice: form.originalPrice ? Math.max(0, parseFloat(form.originalPrice)) : undefined,
      highlights: highlights.filter(Boolean),
      advantages: advantages.filter(Boolean),
      requirements: requirements.filter(Boolean),
      targetAudience: targetAudience.filter(Boolean),
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      modulesList: modulesList.filter(m => m.title),
      recordedLectures: lectures,
    });
  };

  const TABS: { key: TabKey; label: string }[] = [
    { key: 'basic', label: 'Basic Info' },
    { key: 'details', label: 'Details & Content' },
    { key: 'curriculum', label: 'Curriculum' },
    { key: 'media', label: 'Media & Settings' },
  ];

  return (
    <DialogOverlay onClose={onClose}>
      <div className="flex items-center justify-between p-5 border-b border-border">
        <h3 className="font-heading text-lg font-semibold text-card-foreground">
          {initial ? 'Edit Course' : 'Add New Course'}
        </h3>
        <button onClick={onClose}><X className="h-4 w-4 text-muted-foreground" /></button>
      </div>

      {/* Tab nav */}
      <div className="flex border-b border-border px-5 gap-0 overflow-x-auto">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`shrink-0 px-3 py-2.5 text-xs font-medium border-b-2 transition-colors ${
              tab === key ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto">

        {/* ── BASIC INFO ── */}
        {tab === 'basic' && (
          <>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Title *</label>
              <Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Course title" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Category *</label>
                <select
                  value={form.category}
                  onChange={e => setForm({ ...form, category: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  {categories.filter(c => c !== 'All').map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Level</label>
                <select
                  value={form.level}
                  onChange={e => setForm({ ...form, level: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option>Beginner</option><option>Intermediate</option><option>Advanced</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Description</label>
              <Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} placeholder="Short course description" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Price (₹)</label>
                <Input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="e.g. 9999" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Original Price (₹)</label>
                <Input type="number" value={form.originalPrice} onChange={e => setForm({ ...form, originalPrice: e.target.value })} placeholder="e.g. 14999" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Duration</label>
                <Input value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} placeholder="e.g. 6 weeks" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Language</label>
                <Input value={form.language} onChange={e => setForm({ ...form, language: e.target.value })} placeholder="English" />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Instructor</label>
              <Input value={form.instructor} onChange={e => setForm({ ...form, instructor: e.target.value })} />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Instructor Bio</label>
              <Textarea value={form.instructorBio} onChange={e => setForm({ ...form, instructorBio: e.target.value })} rows={2} placeholder="Brief instructor biography" />
            </div>
          </>
        )}

        {/* ── DETAILS & CONTENT ── */}
        {tab === 'details' && (
          <>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Why Take This Course</label>
              <Textarea value={form.whyTake} onChange={e => setForm({ ...form, whyTake: e.target.value })} rows={4} placeholder="Explain the value of this course..." />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-2 block">What You'll Learn (Highlights)</label>
              <div className="space-y-2">
                {highlights.map((h, i) => (
                  <div key={i} className="flex gap-2">
                    <Input value={h} onChange={e => updateList(highlights, setHighlights, i, e.target.value)} placeholder={`Highlight ${i + 1}`} />
                    <button onClick={() => removeListItem(highlights, setHighlights, i)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={() => addListItem(highlights, setHighlights)} className="text-xs gap-1">
                  <Plus className="h-3 w-3" /> Add Highlight
                </Button>
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-2 block">Key Advantages</label>
              <div className="space-y-2">
                {advantages.map((a, i) => (
                  <div key={i} className="flex gap-2">
                    <Input value={a} onChange={e => updateList(advantages, setAdvantages, i, e.target.value)} placeholder={`Advantage ${i + 1}`} />
                    <button onClick={() => removeListItem(advantages, setAdvantages, i)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={() => addListItem(advantages, setAdvantages)} className="text-xs gap-1">
                  <Plus className="h-3 w-3" /> Add Advantage
                </Button>
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-2 block">Requirements / Prerequisites</label>
              <div className="space-y-2">
                {requirements.map((r, i) => (
                  <div key={i} className="flex gap-2">
                    <Input value={r} onChange={e => updateList(requirements, setRequirements, i, e.target.value)} placeholder={`Requirement ${i + 1}`} />
                    <button onClick={() => removeListItem(requirements, setRequirements, i)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={() => addListItem(requirements, setRequirements)} className="text-xs gap-1">
                  <Plus className="h-3 w-3" /> Add Requirement
                </Button>
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-2 block">Who Is This For (Target Audience)</label>
              <div className="space-y-2">
                {targetAudience.map((t, i) => (
                  <div key={i} className="flex gap-2">
                    <Input value={t} onChange={e => updateList(targetAudience, setTargetAudience, i, e.target.value)} placeholder={`Audience ${i + 1}`} />
                    <button onClick={() => removeListItem(targetAudience, setTargetAudience, i)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={() => addListItem(targetAudience, setTargetAudience)} className="text-xs gap-1">
                  <Plus className="h-3 w-3" /> Add Audience
                </Button>
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Tags (comma-separated)</label>
              <Input value={tags} onChange={e => setTags(e.target.value)} placeholder="leadership, management, strategy" />
            </div>
          </>
        )}

        {/* ── CURRICULUM ── */}
        {tab === 'curriculum' && (
          <>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Syllabus Overview</label>
              <Textarea value={form.syllabus} onChange={e => setForm({ ...form, syllabus: e.target.value })} rows={3} placeholder="Brief overview of the course structure..." />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-medium text-muted-foreground">Modules</label>
                <Button variant="outline" size="sm" className="text-xs gap-1" onClick={() => setModulesList([...modulesList, { title: '', lessons: 1, duration: '1 hr', topics: [] }])}>
                  <Plus className="h-3 w-3" /> Add Module
                </Button>
              </div>
              <div className="space-y-3">
                {modulesList.map((mod, mi) => (
                  <div key={mi} className="rounded-md border border-border p-3 space-y-2">
                    <div className="flex gap-2 items-start">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary mt-2">{mi + 1}</span>
                      <div className="flex-1 space-y-2">
                        <Input
                          value={mod.title}
                          onChange={e => {
                            const next = [...modulesList];
                            next[mi] = { ...next[mi], title: e.target.value };
                            setModulesList(next);
                          }}
                          placeholder="Module title"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <Input
                            type="number"
                            value={mod.lessons}
                            onChange={e => {
                              const next = [...modulesList];
                              next[mi] = { ...next[mi], lessons: parseInt(e.target.value) || 1 };
                              setModulesList(next);
                            }}
                            placeholder="Lessons"
                          />
                          <Input
                            value={mod.duration}
                            onChange={e => {
                              const next = [...modulesList];
                              next[mi] = { ...next[mi], duration: e.target.value };
                              setModulesList(next);
                            }}
                            placeholder="Duration e.g. 2 hrs"
                          />
                        </div>
                        {/* Topics */}
                        <div className="space-y-1">
                          {(mod.topics || []).map((topic, ti) => (
                            <div key={ti} className="flex gap-2">
                              <Input
                                value={topic}
                                onChange={e => {
                                  const next = [...modulesList];
                                  const topics = [...(next[mi].topics || [])];
                                  topics[ti] = e.target.value;
                                  next[mi] = { ...next[mi], topics };
                                  setModulesList(next);
                                }}
                                placeholder={`Topic ${ti + 1}`}
                                className="h-7 text-xs"
                              />
                              <button
                                onClick={() => {
                                  const next = [...modulesList];
                                  next[mi] = { ...next[mi], topics: (next[mi].topics || []).filter((_, i) => i !== ti) };
                                  setModulesList(next);
                                }}
                                className="text-muted-foreground hover:text-destructive"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                          <button
                            onClick={() => {
                              const next = [...modulesList];
                              next[mi] = { ...next[mi], topics: [...(next[mi].topics || []), ''] };
                              setModulesList(next);
                            }}
                            className="text-xs text-primary hover:underline"
                          >
                            + Add topic
                          </button>
                        </div>
                      </div>
                      <button onClick={() => setModulesList(modulesList.filter((_, i) => i !== mi))} className="text-muted-foreground hover:text-destructive mt-2">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recorded Lectures */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-medium text-muted-foreground">Recorded Lectures</label>
                <Button
                  variant="outline" size="sm" className="text-xs gap-1"
                  onClick={() => setLectures([...lectures, { id: `rl-${Date.now()}`, moduleIndex: 0, title: '', duration: '', videoUrl: '', isPreview: false }])}
                >
                  <Plus className="h-3 w-3" /> Add Lecture
                </Button>
              </div>
              <div className="space-y-2">
                {lectures.map((lec, li) => (
                  <div key={lec.id} className="rounded-md border border-border p-3 space-y-2">
                    <div className="flex gap-2">
                      <Input
                        value={lec.title}
                        onChange={e => { const n = [...lectures]; n[li] = { ...n[li], title: e.target.value }; setLectures(n); }}
                        placeholder="Lecture title"
                        className="flex-1"
                      />
                      <button onClick={() => setLectures(lectures.filter((_, i) => i !== li))} className="text-muted-foreground hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <select
                        value={lec.moduleIndex}
                        onChange={e => { const n = [...lectures]; n[li] = { ...n[li], moduleIndex: parseInt(e.target.value) }; setLectures(n); }}
                        className="h-8 text-xs rounded-md border border-input bg-background px-2"
                      >
                        {modulesList.map((m, mi) => (
                          <option key={mi} value={mi}>Module {mi + 1}{m.title ? `: ${m.title.substring(0, 20)}` : ''}</option>
                        ))}
                      </select>
                      <Input
                        value={lec.duration}
                        onChange={e => { const n = [...lectures]; n[li] = { ...n[li], duration: e.target.value }; setLectures(n); }}
                        placeholder="Duration e.g. 12:30"
                        className="h-8 text-xs"
                      />
                      <label className="flex items-center gap-1.5 text-xs text-muted-foreground cursor-pointer">
                        <input
                          type="checkbox"
                          checked={lec.isPreview}
                          onChange={e => { const n = [...lectures]; n[li] = { ...n[li], isPreview: e.target.checked }; setLectures(n); }}
                          className="rounded"
                        />
                        Preview
                      </label>
                    </div>
                    <Input
                      value={lec.videoUrl}
                      onChange={e => { const n = [...lectures]; n[li] = { ...n[li], videoUrl: e.target.value }; setLectures(n); }}
                      placeholder="Video URL (optional)"
                      className="text-xs"
                    />
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ── MEDIA & SETTINGS ── */}
        {tab === 'media' && (
          <>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Course Thumbnail</label>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <label className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground cursor-pointer hover:bg-primary/90">
                    Choose Image
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setImageName(file.name);
                          handleImageUpload(file);
                        }
                      }}
                      disabled={uploading}
                      className="sr-only"
                    />
                  </label>
                  <span className="text-xs text-muted-foreground truncate max-w-[200px]">{imageName}</span>
                </div>
                {uploading && <p className="text-xs text-muted-foreground">Uploading...</p>}
                {form.image && (
                  <img src={form.image} alt="Preview" className="h-24 w-40 object-cover rounded-md border border-border" />
                )}
              </div>
            </div>

            <div className="space-y-3 rounded-lg border border-border p-4">
              <p className="text-xs font-semibold text-card-foreground">Course Features</p>
              {[
                { key: 'certificate', label: 'Certificate of Completion' },
                { key: 'liveSessionsIncluded', label: 'Live Sessions Included' },
                { key: 'notesIncluded', label: 'Notes / Study Material Included' },
              ].map(({ key, label }) => (
                <label key={key} className="flex items-center gap-2 text-sm text-card-foreground cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!(form as any)[key]}
                    onChange={e => setForm({ ...form, [key]: e.target.checked })}
                    className="rounded"
                  />
                  {label}
                </label>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="flex gap-2 justify-between p-5 border-t border-border">
        <div className="flex gap-2">
          {TABS.map(({ key, label }, idx) => (
            tab === key && idx > 0 ? (
              <Button key="prev" variant="outline" size="sm" onClick={() => setTab(TABS[idx - 1].key)}>
                ← Back
              </Button>
            ) : null
          ))}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
          {tab !== 'media' ? (
            <Button size="sm" onClick={() => {
              const idx = TABS.findIndex(t => t.key === tab);
              if (idx < TABS.length - 1) setTab(TABS[idx + 1].key);
            }}>
              Next →
            </Button>
          ) : (
            <Button size="sm" onClick={handleSave} disabled={!form.title || !form.category}>
              <Save className="h-3 w-3 mr-1" /> {initial ? 'Update Course' : 'Create Course'}
            </Button>
          )}
        </div>
      </div>
    </DialogOverlay>
  );
}