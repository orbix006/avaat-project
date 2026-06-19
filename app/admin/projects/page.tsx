'use client';
/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */

import React, { useState, useEffect, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  FolderGit2,
  Plus,
  Search,
  Edit3,
  Trash2,
  ExternalLink,
  Filter,
  X,
  UploadCloud,
  Loader2,
  Save,
  Sparkles,
  Image as ImageIcon,
  ArrowUp,
  ArrowDown,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import {
  fetchProjects,
  createProject,
  updateProject,
  deleteProject,
  fetchProjectById,
  addProjectMedia,
  removeProjectMedia,
  reorderProjectMedia,
  addProjectBeforeAfter,
  deleteProjectBeforeAfter,
  ProjectRow,
  ProjectMediaRow,
  ProjectBeforeAfterRow
} from '@/lib/actions/projects';

// Zod Validation Schema matching database columns
const projectFormSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100, 'Title is too long'),
  slug: z.string().min(3, 'Slug must be at least 3 characters')
    .regex(/^[a-z0-9-_]+$/, 'Slug can only contain lowercase letters, numbers, hyphens, and underscores'),
  category: z.enum(['residential', 'commercial', 'architecture', 'hospitality', 'renovation'] as const),
  location: z.string().min(2, 'Location is required'),
  short_description: z.string().min(1, 'Short Description is required').max(500, 'Short Description cannot exceed 500 characters'),
  featured_image: z.string().optional().nullable(),
  featured: z.boolean(),
  display_order: z.preprocess((val) => val === '' ? 0 : Number(val), z.number().int().nonnegative('Display order must be 0 or greater')),
  completion_date: z.string().optional().nullable().or(z.literal('')),
  status: z.enum(['draft', 'published', 'archived'] as const),
  project_url: z.string().optional().nullable(),
  client_name: z.string().optional().nullable(),
  gallery_images: z.array(z.string()).optional().nullable(),
  full_description: z.string().optional().nullable(),
  github_url: z.string().optional().nullable(),
  technologies: z.string().optional().nullable(),
});

type ProjectFormInput = z.infer<typeof projectFormSchema>;

export default function ProjectsAdminPage() {
  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isPending, startTransition] = useTransition();

  // Search & Filter state
  const [search, setSearch] = useState<string>('');
  const [filter, setFilter] = useState<'all' | ProjectRow['category']>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'published' | 'archived'>('all');

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);
  const [isEditOpen, setIsEditOpen] = useState<boolean>(false);
  const [activeEditProject, setActiveEditProject] = useState<ProjectRow | null>(null);

  // Tab states for edit modal
  const [activeTab, setActiveTab] = useState<'details' | 'gallery' | 'beforeafter'>('details');

  // Gallery & Before/After state for active edit
  const [gallery, setGallery] = useState<ProjectMediaRow[]>([]);
  const [beforeAfters, setBeforeAfters] = useState<ProjectBeforeAfterRow[]>([]);
  const [mediaUploadLoading, setMediaUploadLoading] = useState<boolean>(false);
  const [baUploadLoading, setBaUploadLoading] = useState<boolean>(false);

  // Custom Notifications / Alert state
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Forms
  const createForm = useForm<ProjectFormInput>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      title: '',
      slug: '',
      category: 'residential',
      location: '',
      short_description: '',
      featured_image: null,
      featured: false,
      display_order: 0,
      completion_date: new Date().getFullYear().toString(),
      status: 'draft',
      project_url: '',
      client_name: '',
      gallery_images: [],
      full_description: '',
      github_url: '',
      technologies: '',
    }
  });

  const editForm = useForm<ProjectFormInput>({
    resolver: zodResolver(projectFormSchema),
  });

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  // Fetch all projects on mount
  const loadProjects = async () => {
    setLoading(true);
    const res = await fetchProjects();
    if (res.data) {
      setProjects(res.data);
    } else if (res.error) {
      showNotification('error', res.error);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadProjects();
  }, []);

  // Helper auto-generating URL slug from project title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  // Watch create title changes to auto-generate slug
  const createTitle = createForm.watch('title');
  useEffect(() => {
    if (createTitle) {
      createForm.setValue('slug', generateSlug(createTitle), { shouldValidate: true });
    }
  }, [createTitle, createForm]);

  // Watch edit title changes to auto-generate slug
  const editTitle = editForm.watch('title');
  useEffect(() => {
    if (editTitle) {
      editForm.setValue('slug', generateSlug(editTitle), { shouldValidate: true });
    }
  }, [editTitle, editForm]);

  // Handle create submission
  const onCreateSubmit = async (data: ProjectFormInput) => {
    startTransition(async () => {
      console.log('FORM VALUES (create)', JSON.stringify(data, null, 2));
      const payload = {
        title: data.title,
        slug: data.slug,
        category: data.category,
        location: data.location,
        short_description: data.short_description,
        featured_image: data.featured_image ?? null,
        featured: data.featured,
        display_order: data.display_order,
        completion_date: data.completion_date ?? null,
        status: data.status,
        project_url: data.project_url ?? null,
        client_name: data.client_name ?? null,
        gallery_images: data.gallery_images ?? [],
        full_description: data.full_description ?? null,
        github_url: data.github_url ?? null,
        technologies: data.technologies ? data.technologies.split(',').map((t: string) => t.trim()).filter(Boolean) : [],
      };
      console.log('INSERT PAYLOAD (admin)', JSON.stringify(payload, null, 2));

      const res = await createProject(payload);
      if (res.success) {
        showNotification('success', 'Project created successfully!');
        setIsCreateOpen(false);
        createForm.reset();
        loadProjects();
      } else if (res.error) {
        showNotification('error', res.error);
      }
    });
  };

  // Handle edit details submission
  const onEditSubmit = async (data: ProjectFormInput) => {
    if (!activeEditProject) return;
    startTransition(async () => {
      console.log('FORM VALUES (edit)', JSON.stringify(data, null, 2));
      const payload = {
        title: data.title,
        slug: data.slug,
        category: data.category,
        location: data.location,
        short_description: data.short_description,
        featured_image: data.featured_image ?? null,
        featured: data.featured,
        display_order: data.display_order,
        completion_date: data.completion_date ?? null,
        status: data.status,
        project_url: data.project_url ?? null,
        client_name: data.client_name ?? null,
        gallery_images: data.gallery_images ?? [],
        full_description: data.full_description ?? null,
        github_url: data.github_url ?? null,
        technologies: data.technologies ? data.technologies.split(',').map((t: string) => t.trim()).filter(Boolean) : [],
      };
      console.log('UPDATE PAYLOAD (admin)', JSON.stringify(payload, null, 2));

      const res = await updateProject(activeEditProject.id, payload);
      if (res.success) {
        showNotification('success', 'Project details updated successfully!');
        loadProjects();
      } else if (res.error) {
        showNotification('error', res.error);
      }
    });
  };

  // Open edit modal and load active data
  const handleEditClick = async (project: ProjectRow) => {
    setActiveEditProject(project);
    setActiveTab('details');

    // Set edit details form default values
    editForm.reset({
      title: project.title,
      slug: project.slug,
      category: project.category,
      location: project.location,
      short_description: project.short_description,
      featured_image: project.featured_image || '',
      featured: project.featured,
      display_order: project.display_order,
      completion_date: project.completion_date || '',
      status: project.status,
      project_url: project.project_url || '',
      client_name: project.client_name || '',
      gallery_images: project.gallery_images || [],
      full_description: project.full_description || '',
      github_url: project.github_url || '',
      technologies: project.technologies ? project.technologies.join(', ') : '',
    });

    setIsEditOpen(true);

    // Load project media and before/after sets
    const res = await fetchProjectById(project.id);
    if (res.data) {
      setGallery(res.data.media || []);
      setBeforeAfters(res.data.beforeAfter || []);
    }
  };

  // Quick visibility toggle on card
  const handleToggleStatus = async (project: ProjectRow) => {
    const newStatus = project.status === 'published' ? 'draft' : 'published';
    startTransition(async () => {
      const res = await updateProject(project.id, {
        title: project.title,
        slug: project.slug,
        category: project.category,
        location: project.location,
        short_description: project.short_description,
        featured_image: project.featured_image ?? null,
        featured: project.featured,
        display_order: project.display_order,
        completion_date: project.completion_date ?? null,
        status: newStatus,
        project_url: project.project_url ?? null,
        client_name: project.client_name ?? null,
        gallery_images: project.gallery_images ?? [],
        full_description: project.full_description ?? null,
        github_url: project.github_url ?? null,
        technologies: project.technologies ?? null,
      });
      if (res.success) {
        showNotification('success', `Project status updated to ${newStatus}.`);
        loadProjects();
      } else {
        showNotification('error', res.error || 'Failed to update status.');
      }
    });
  };

  // Handle delete project
  const handleDeleteClick = async (id: string) => {
    if (confirm('Are you sure you want to permanently delete this project? All associated media assets and comparison sets will be deleted.')) {
      startTransition(async () => {
        const res = await deleteProject(id);
        if (res.success) {
          showNotification('success', 'Project deleted successfully.');
          loadProjects();
        } else if (res.error) {
          showNotification('error', res.error);
        }
      });
    }
  };

  // Supabase Storage file upload helper
  const uploadImage = async (file: File, projectId: string): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const uniqueId = Math.random().toString(36).substring(2, 9);
      const fileName = `${Date.now()}-${uniqueId}.${fileExt}`;
      const filePath = `${projectId}/${fileName}`;

      const { error } = await supabase.storage
        .from('projects')
        .upload(filePath, file, { cacheControl: '3600', upsert: true });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('projects')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (err) {
      console.error('Storage bucket upload failed:', err);
      return null;
    }
  };

  // Cover image upload for main form
  const handleMainCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>, formType: 'create' | 'edit') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const targetForm = formType === 'create' ? createForm : editForm;

    // For main cover upload we use a temporary random namespace if create, or real id if edit
    const targetId = formType === 'create' ? 'temp' : activeEditProject?.id || 'temp';

    setMediaUploadLoading(true);
    const url = await uploadImage(file, targetId);
    if (url) {
      targetForm.setValue('featured_image', url, { shouldValidate: true });
      showNotification('success', 'Cover image uploaded and set.');
    } else {
      showNotification('error', 'Upload failed.');
    }
    setMediaUploadLoading(false);
  };

  // Handle new image upload or URL entry for gallery
  const handleAddMedia = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!activeEditProject) return;

    const formData = new FormData(e.currentTarget);
    const file = formData.get('mediaFile') as File | null;
    const url = formData.get('mediaUrl') as string | null;
    const makeCover = formData.get('makeCover') === 'on';

    setMediaUploadLoading(true);
    let imageUrl = '';

    try {
      if (file && file.size > 0) {
        const uploadedUrl = await uploadImage(file, activeEditProject.id);
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        } else {
          showNotification('error', 'Storage bucket upload failed. Try manually entering a direct image URL.');
          setMediaUploadLoading(false);
          return;
        }
      } else if (url && url.trim().length > 0) {
        imageUrl = url.trim();
      }

      if (!imageUrl) {
        showNotification('error', 'Please select an image file to upload or enter a direct image URL.');
        setMediaUploadLoading(false);
        return;
      }

      const res = await addProjectMedia(activeEditProject.id, imageUrl, makeCover);
      if (res.success && res.data) {
        showNotification('success', 'Gallery image added successfully.');
        setGallery([...gallery, res.data]);
        e.currentTarget.reset();
      } else if (res.error) {
        showNotification('error', res.error);
      }
    } catch (err) {
      showNotification('error', 'An unexpected error occurred adding gallery media.');
    } finally {
      setMediaUploadLoading(false);
    }
  };

  // Remove gallery media
  const handleRemoveMedia = async (mediaId: string) => {
    if (confirm('Delete this image from the gallery?')) {
      const res = await removeProjectMedia(mediaId);
      if (res.success) {
        showNotification('success', 'Image removed from gallery.');
        setGallery(gallery.filter(g => g.id !== mediaId));
      } else if (res.error) {
        showNotification('error', res.error);
      }
    }
  };

  // Set gallery image as cover
  const handleSetCover = async (mediaItem: ProjectMediaRow) => {
    if (!activeEditProject) return;
    setMediaUploadLoading(true);
    const res = await addProjectMedia(activeEditProject.id, mediaItem.url, true);
    if (res.success) {
      showNotification('success', 'Set as project cover image.');
      // Update local card
      editForm.setValue('featured_image', mediaItem.url);
      // Refresh items list
      const details = await fetchProjectById(activeEditProject.id);
      if (details.data) {
        setGallery(details.data.media || []);
      }
    } else if (res.error) {
      showNotification('error', res.error);
    }
    setMediaUploadLoading(false);
  };

  // Reorder gallery items
  const handleMoveMedia = async (index: number, direction: 'up' | 'down') => {
    if (index === 0 && direction === 'up') return;
    if (index === gallery.length - 1 && direction === 'down') return;

    const items = [...gallery];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    // Swap
    const temp = items[index];
    items[index] = items[targetIndex];
    items[targetIndex] = temp;

    // Map new sort_orders
    const orders = items.map((item, idx) => ({ id: item.id, sort_order: idx }));

    // Update locally
    setGallery(items.map((item, idx) => ({ ...item, sort_order: idx })));

    // Save to DB
    const res = await reorderProjectMedia(orders);
    if (res.error) {
      showNotification('error', 'Reordering failed to save: ' + res.error);
    }
  };

  // Handle Before/After submission
  const handleAddBeforeAfter = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!activeEditProject) return;

    const formData = new FormData(e.currentTarget);
    const beforeFile = formData.get('beforeFile') as File | null;
    const beforeUrl = formData.get('beforeUrl') as string | null;
    const afterFile = formData.get('afterFile') as File | null;
    const afterUrl = formData.get('afterUrl') as string | null;
    const label = formData.get('baLabel') as string | null;

    setBaUploadLoading(true);
    let finalBeforeUrl = '';
    let finalAfterUrl = '';

    try {
      // Handle Before Image
      if (beforeFile && beforeFile.size > 0) {
        const url = await uploadImage(beforeFile, activeEditProject.id);
        if (url) finalBeforeUrl = url;
      } else if (beforeUrl && beforeUrl.trim().length > 0) {
        finalBeforeUrl = beforeUrl.trim();
      }

      // Handle After Image
      if (afterFile && afterFile.size > 0) {
        const url = await uploadImage(afterFile, activeEditProject.id);
        if (url) finalAfterUrl = url;
      } else if (afterUrl && afterUrl.trim().length > 0) {
        finalAfterUrl = afterUrl.trim();
      }

      if (!finalBeforeUrl || !finalAfterUrl) {
        showNotification('error', 'Both "Before" and "After" images are required.');
        setBaUploadLoading(false);
        return;
      }

      const res = await addProjectBeforeAfter({
        projectId: activeEditProject.id,
        beforeUrl: finalBeforeUrl,
        afterUrl: finalAfterUrl,
        label: label || undefined
      });

      if (res.success && res.data) {
        showNotification('success', 'Before/After comparison set added.');
        setBeforeAfters([...beforeAfters, res.data]);
        e.currentTarget.reset();
      } else if (res.error) {
        showNotification('error', res.error);
      }
    } catch (err) {
      showNotification('error', 'Failed to save before/after set.');
    } finally {
      setBaUploadLoading(false);
    }
  };

  // Delete Before/After comparison set
  const handleDeleteBeforeAfter = async (id: string) => {
    if (confirm('Delete this before/after comparison set?')) {
      const res = await deleteProjectBeforeAfter(id);
      if (res.success) {
        showNotification('success', 'Comparison set deleted.');
        setBeforeAfters(beforeAfters.filter(b => b.id !== id));
      } else if (res.error) {
        showNotification('error', res.error);
      }
    }
  };

  // Filter projects client-side
  const filteredProjects = projects.filter(project => {
    const matchesFilter = filter === 'all' || project.category === filter;
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    const matchesSearch = project.title.toLowerCase().includes(search.toLowerCase()) ||
      project.location.toLowerCase().includes(search.toLowerCase()) ||
      (project.short_description && project.short_description.toLowerCase().includes(search.toLowerCase()));
    return matchesFilter && matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">

      {/* Toast Notification HUD */}
      {notification && (
        <div className={`fixed top-6 right-6 z-50 p-4 rounded-xl border flex items-center gap-3 shadow-2xl animate-in slide-in-from-top-4 duration-300 ${notification.type === 'success'
            ? 'bg-green-950/90 text-green-400 border-green-500/30'
            : 'bg-red-950/90 text-red-400 border-red-500/30'
          }`}>
          {notification.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span className="text-xs font-semibold">{notification.message}</span>
        </div>
      )}

      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="font-cormorant text-2xl md:text-3xl font-bold text-ivory">Projects Directory</h2>
          <p className="text-xs text-muted mt-1 font-jost">Manage the architectural and interior design portfolios showcased in the public gallery.</p>
        </div>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="gold-btn-primary text-xs px-6 py-2.5 rounded shadow-lg shadow-gold/25 flex items-center gap-2 transition-all hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Project</span>
        </button>
      </div>

      {/* Control Bar */}
      <div className="bg-warm-black border border-gold/10 rounded-xl p-4 flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4">
          {/* Search */}
          <div className="relative w-full lg:w-80 group">
            <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-gold transition-colors" />
            <input
              type="text"
              placeholder="Search projects by title, description, location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-onyx border border-gold/15 text-xs text-ivory rounded pl-9 pr-4 py-2.5 w-full focus:outline-none focus:border-gold transition-all placeholder:text-muted/50"
            />
          </div>

          {/* Filter Badges */}
          <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto scrollbar-none py-1">
            <div className="flex items-center text-xs text-muted mr-1 shrink-0">
              <Filter className="w-3.5 h-3.5 mr-1 text-gold" />
              <span>Category:</span>
            </div>
            {(['all', 'residential', 'commercial', 'architecture', 'hospitality', 'renovation'] as const).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setFilter(cat)}
                className={`text-xs px-4 py-1.5 rounded uppercase tracking-wider transition-all shrink-0 font-medium border ${filter === cat
                    ? 'bg-gold text-onyx border-gold font-bold shadow-md shadow-gold/10'
                    : 'bg-onyx text-ivory/60 hover:text-gold border-gold/5 hover:border-gold/20'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="h-[1px] bg-gold/10 w-full" />

        {/* Status Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center text-xs text-muted mr-1 shrink-0">
            <Filter className="w-3.5 h-3.5 mr-1 text-gold" />
            <span>Status:</span>
          </div>
          {(['all', 'draft', 'published', 'archived'] as const).map((statusVal) => (
            <button
              key={statusVal}
              type="button"
              onClick={() => setStatusFilter(statusVal)}
              className={`text-xs px-4 py-1.5 rounded uppercase tracking-wider transition-all shrink-0 font-medium border ${statusFilter === statusVal
                  ? 'bg-gold text-onyx border-gold font-bold shadow-md shadow-gold/10'
                  : 'bg-onyx text-ivory/60 hover:text-gold border-gold/5 hover:border-gold/20'
                }`}
            >
              {statusVal}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Cards Grid Display */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-muted">
          <Loader2 className="w-8 h-8 animate-spin text-gold" />
          <p className="text-xs">Fetching portfolio items from database...</p>
        </div>
      ) : filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-warm-black border border-gold/10 hover:border-gold/25 rounded-xl p-5 flex flex-col justify-between transition-all duration-300 relative group overflow-hidden"
            >
              {/* Cover Image / Thumbnail */}
              <div className="relative aspect-video rounded-lg overflow-hidden border border-white/5 bg-onyx shrink-0">
                {project.featured_image ? (
                  <img
                    src={project.featured_image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gold/30 bg-gold/5 gap-2">
                    <FolderGit2 className="w-8 h-8" />
                    <span className="text-[10px] tracking-widest uppercase">No cover image</span>
                  </div>
                )}

                {/* Visibility Badge */}
                <span className={`absolute top-3 left-3 px-2 py-0.5 rounded text-[8px] font-bold tracking-wider uppercase border ${project.status === 'published'
                    ? 'bg-green-950/80 text-green-400 border-green-500/20'
                    : project.status === 'draft'
                      ? 'bg-yellow-950/80 text-yellow-400 border-yellow-500/20'
                      : 'bg-red-950/80 text-red-400 border-red-500/20'
                  }`}>
                  {project.status}
                </span>

                {/* Featured Badge */}
                {project.featured && (
                  <span className="absolute top-3 right-3 bg-gold text-onyx px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-md">
                    <Sparkles className="w-2.5 h-2.5 fill-onyx" />
                    Featured
                  </span>
                )}
              </div>

              {/* Body */}
              <div className="mt-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-semibold text-ivory text-base group-hover:text-gold transition-colors line-clamp-1">{project.title}</h3>
                    <span className="text-[9px] uppercase tracking-wider bg-gold/10 text-gold px-1.5 py-0.5 rounded border border-gold/15 whitespace-nowrap shrink-0 mt-0.5">
                      {project.category}
                    </span>
                  </div>

                  <p className="text-xs text-muted mt-2 line-clamp-2 min-h-[2rem] leading-relaxed">{project.short_description}</p>

                  <div className="text-[10px] text-muted/80 mt-2 font-mono flex flex-wrap items-center gap-1.5">
                    <span>Slug: /{project.slug}</span>
                    <span className="text-gold/30">•</span>
                    <span>Loc: {project.location}</span>
                    <span className="text-gold/30">•</span>
                    <span>Created: {new Date(project.created_at).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-5 pt-4 border-t border-gold/10 flex items-center justify-between gap-3 shrink-0">
                  {/* Publish / Draft Toggle Switch */}
                  <button
                    type="button"
                    onClick={() => handleToggleStatus(project)}
                    className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                    title={project.status === 'published' ? 'Switch to Draft' : 'Switch to Published'}
                  >
                    {project.status === 'published' ? (
                      <>
                        <Eye className="w-4 h-4 text-green-400" />
                        <span className="text-[10px] text-green-400 font-semibold uppercase tracking-wider">Live</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-4 h-4 text-muted" />
                        <span className="text-[10px] text-muted font-semibold uppercase tracking-wider">Draft</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEditClick(project)}
                      className="p-1.5 text-muted hover:text-gold hover:bg-gold/5 rounded transition-all"
                      title="Edit Project Configuration"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(project.id)}
                      className="p-1.5 text-muted hover:text-red-400 hover:bg-red-500/5 rounded transition-all"
                      title="Delete Project Portfolio"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <a
                      href={`/portfolio/${project.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 text-gold hover:bg-gold/5 rounded transition-all inline-block"
                      title="Preview Live Page"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-warm-black border border-gold/10 rounded-xl p-12 text-center text-muted text-xs flex flex-col items-center justify-center gap-2">
          <FolderGit2 className="w-10 h-10 text-gold/30 animate-pulse" />
          <span>No project records matched your search query.</span>
        </div>
      )}

      {/* ==================== CREATE MODAL ==================== */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-warm-black border border-gold/15 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-gold/10 flex justify-between items-center bg-onyx/10 shrink-0">
              <div className="flex items-center gap-2">
                <FolderGit2 className="w-5 h-5 text-gold" />
                <h3 className="font-cormorant text-lg font-bold text-ivory">Create Portfolio Project</h3>
              </div>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="p-1.5 text-muted hover:text-gold hover:bg-gold/5 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={createForm.handleSubmit(onCreateSubmit)} className="flex-1 overflow-y-auto p-6 space-y-6">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Title */}
                <div className="space-y-2">
                  <label className="text-[10px] text-muted uppercase tracking-wider font-semibold">Project Title *</label>
                  <input
                    type="text"
                    {...createForm.register('title')}
                    className="bg-onyx border border-gold/15 text-xs text-ivory rounded px-4 py-2.5 w-full focus:outline-none focus:border-gold transition-all"
                    placeholder="e.g. Minimalist Villa"
                  />
                  {createForm.formState.errors.title && (
                    <p className="text-[10px] text-red-400 font-semibold">{createForm.formState.errors.title.message}</p>
                  )}
                </div>

                {/* Slug */}
                <div className="space-y-2">
                  <label className="text-[10px] text-muted uppercase tracking-wider font-semibold">URL Slug (Auto-generated) *</label>
                  <input
                    type="text"
                    {...createForm.register('slug')}
                    className="bg-onyx border border-gold/15 text-xs text-ivory rounded px-4 py-2.5 w-full focus:outline-none focus:border-gold transition-all font-mono"
                    placeholder="e.g. minimalist-villa"
                  />
                  {createForm.formState.errors.slug && (
                    <p className="text-[10px] text-red-400 font-semibold">{createForm.formState.errors.slug.message}</p>
                  )}
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <label className="text-[10px] text-muted uppercase tracking-wider font-semibold">Category *</label>
                  <select
                    {...createForm.register('category')}
                    className="bg-onyx border border-gold/15 text-xs text-ivory rounded px-4 py-2.5 w-full focus:outline-none focus:border-gold transition-all"
                  >
                    <option value="residential">Residential</option>
                    <option value="commercial">Commercial</option>
                    <option value="architecture">Architecture</option>
                    <option value="hospitality">Hospitality</option>
                    <option value="renovation">Renovation</option>
                  </select>
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <label className="text-[10px] text-muted uppercase tracking-wider font-semibold">Location *</label>
                  <input
                    type="text"
                    {...createForm.register('location')}
                    className="bg-onyx border border-gold/15 text-xs text-ivory rounded px-4 py-2.5 w-full focus:outline-none focus:border-gold transition-all"
                    placeholder="e.g. Mumbai, MH"
                  />
                  {createForm.formState.errors.location && (
                    <p className="text-[10px] text-red-400 font-semibold">{createForm.formState.errors.location.message}</p>
                  )}
                </div>

                {/* Completion Date/Year */}
                <div className="space-y-2">
                  <label className="text-[10px] text-muted uppercase tracking-wider font-semibold">Completion Date/Year</label>
                  <input
                    type="text"
                    {...createForm.register('completion_date')}
                    className="bg-onyx border border-gold/15 text-xs text-ivory rounded px-4 py-2.5 w-full focus:outline-none focus:border-gold transition-all"
                    placeholder="e.g. 2026 or June 2026"
                  />
                  {createForm.formState.errors.completion_date && (
                    <p className="text-[10px] text-red-400 font-semibold">{createForm.formState.errors.completion_date.message}</p>
                  )}
                </div>

                {/* Display Order */}
                <div className="space-y-2">
                  <label className="text-[10px] text-muted uppercase tracking-wider font-semibold">Display Sort Order</label>
                  <input
                    type="number"
                    {...createForm.register('display_order')}
                    className="bg-onyx border border-gold/15 text-xs text-ivory rounded px-4 py-2.5 w-full focus:outline-none focus:border-gold transition-all"
                    placeholder="e.g. 0"
                  />
                  {createForm.formState.errors.display_order && (
                    <p className="text-[10px] text-red-400 font-semibold">{createForm.formState.errors.display_order.message}</p>
                  )}
                </div>
              </div>

              {/* Image Upload / Cover Image Link */}
              <div className="space-y-2 p-4 bg-onyx/40 border border-gold/10 rounded-xl">
                <label className="text-[10px] text-gold uppercase tracking-wider font-bold block mb-1">Featured Cover Image</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <span className="text-[9px] text-muted block uppercase">Option 1: Upload Image File</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleMainCoverUpload(e, 'create')}
                      className="text-xs w-full text-ivory/80 file:bg-gold/15 file:text-gold file:border-none file:px-3 file:py-1 file:rounded file:text-[10px] file:uppercase file:cursor-pointer"
                    />
                  </div>
                  <div className="space-y-2">
                    <span className="text-[9px] text-muted block uppercase">Option 2: Direct Cover Image URL</span>
                    <input
                      type="text"
                      {...createForm.register('featured_image')}
                      className="bg-onyx border border-gold/15 text-xs text-ivory rounded px-3 py-1.5 w-full focus:outline-none focus:border-gold font-mono"
                      placeholder="https://example.com/cover.jpg"
                    />
                  </div>
                </div>
              </div>

              {/* Project URL, GitHub URL, Client Name */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="space-y-2">
                  <label className="text-[10px] text-muted uppercase tracking-wider font-semibold">Live Project URL</label>
                  <input
                    type="text"
                    {...createForm.register('project_url')}
                    className="bg-onyx border border-gold/15 text-xs text-ivory rounded px-3 py-1.5 w-full focus:outline-none focus:border-gold font-mono"
                    placeholder="https://example.com"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-muted uppercase tracking-wider font-semibold">GitHub Repo URL</label>
                  <input
                    type="text"
                    {...createForm.register('github_url')}
                    className="bg-onyx border border-gold/15 text-xs text-ivory rounded px-3 py-1.5 w-full focus:outline-none focus:border-gold font-mono"
                    placeholder="https://github.com/..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-muted uppercase tracking-wider font-semibold">Client Name</label>
                  <input
                    type="text"
                    {...createForm.register('client_name')}
                    className="bg-onyx border border-gold/15 text-xs text-ivory rounded px-3 py-1.5 w-full focus:outline-none focus:border-gold"
                    placeholder="Client Co."
                  />
                </div>
              </div>

              {/* Technologies */}
              <div className="space-y-2">
                <label className="text-[10px] text-muted uppercase tracking-wider font-semibold">Technologies (Comma-separated)</label>
                <input
                  type="text"
                  {...createForm.register('technologies')}
                  className="bg-onyx border border-gold/15 text-xs text-ivory rounded px-4 py-2.5 w-full focus:outline-none focus:border-gold transition-all"
                  placeholder="e.g. Next.js, React, Supabase, Tailwind CSS"
                />
              </div>

              {/* Short Description */}
              <div className="space-y-2">
                <label className="text-[10px] text-muted uppercase tracking-wider font-semibold">Short Description (Intro) *</label>
                <textarea
                  rows={2}
                  {...createForm.register('short_description')}
                  className="bg-onyx border border-gold/15 text-xs text-ivory rounded px-4 py-2.5 w-full focus:outline-none focus:border-gold transition-all resize-none"
                  placeholder="Summarize project specifications, styles, layouts..."
                />
                {createForm.formState.errors.short_description && (
                  <p className="text-[10px] text-red-400 font-semibold">{createForm.formState.errors.short_description.message}</p>
                )}
              </div>

              {/* Full Description / Overview */}
              <div className="space-y-2">
                <label className="text-[10px] text-muted uppercase tracking-wider font-semibold">Full Description / Overview</label>
                <textarea
                  rows={4}
                  {...createForm.register('full_description')}
                  className="bg-onyx border border-gold/15 text-xs text-ivory rounded px-4 py-2.5 w-full focus:outline-none focus:border-gold transition-all resize-y"
                  placeholder="Provide a detailed story, design strategy, challenges, and solutions..."
                />
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap items-center gap-8 bg-onyx/40 border border-gold/5 p-4 rounded-xl shrink-0">
                {/* Featured Toggle */}
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    {...createForm.register('featured')}
                    className="sr-only peer"
                  />
                  <div className="relative w-11 h-6 bg-onyx border border-gold/15 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-muted after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-gold peer-checked:after:bg-onyx" />
                  <span className="text-xs font-semibold text-ivory group-hover:text-gold transition-colors">Featured Portfolio</span>
                </label>

                {/* Published / Status Dropdown */}
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-ivory">Visibility Status:</span>
                  <select
                    {...createForm.register('status')}
                    className="bg-onyx border border-gold/15 text-xs text-ivory rounded px-3 py-1.5 focus:outline-none focus:border-gold transition-all font-semibold"
                  >
                    <option value="draft">Draft (Hidden)</option>
                    <option value="published">Published (Visible)</option>
                    <option value="archived">Archived (Archived)</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-gold/10 flex justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-5 py-2.5 border border-gold/20 text-gold hover:bg-gold/5 rounded text-xs font-semibold uppercase tracking-wider"
                  disabled={isPending}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="gold-btn-primary px-6 py-2.5 rounded shadow-lg shadow-gold/15 flex items-center gap-2"
                  disabled={isPending || mediaUploadLoading}
                >
                  {isPending || mediaUploadLoading ? <Loader2 className="w-4 h-4 animate-spin text-onyx" /> : <Save className="w-4 h-4" />}
                  <span>Save Project</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== EDIT & DETAIL MODAL ==================== */}
      {isEditOpen && activeEditProject && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-3xl bg-warm-black border border-gold/15 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">

            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-gold/10 flex justify-between items-center bg-onyx/10 shrink-0">
              <div className="flex items-center gap-2">
                <FolderGit2 className="w-5 h-5 text-gold" />
                <h3 className="font-cormorant text-lg font-bold text-ivory">
                  Edit Project: <span className="text-gold">{activeEditProject.title}</span>
                </h3>
              </div>
              <button
                onClick={() => setIsEditOpen(false)}
                className="p-1.5 text-muted hover:text-gold hover:bg-gold/5 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Tab Headers */}
            <div className="px-6 border-b border-gold/10 flex gap-4 bg-onyx/20 shrink-0">
              <button
                onClick={() => setActiveTab('details')}
                className={`py-3 text-xs font-semibold uppercase tracking-wider relative transition-all ${activeTab === 'details' ? 'text-gold' : 'text-muted hover:text-ivory'
                  }`}
              >
                Project Details
                {activeTab === 'details' && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gold" />}
              </button>
              <button
                onClick={() => setActiveTab('gallery')}
                className={`py-3 text-xs font-semibold uppercase tracking-wider relative transition-all ${activeTab === 'gallery' ? 'text-gold' : 'text-muted hover:text-ivory'
                  }`}
              >
                Image Gallery ({gallery.length})
                {activeTab === 'gallery' && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gold" />}
              </button>
              <button
                onClick={() => setActiveTab('beforeafter')}
                className={`py-3 text-xs font-semibold uppercase tracking-wider relative transition-all ${activeTab === 'beforeafter' ? 'text-gold' : 'text-muted hover:text-ivory'
                  }`}
              >
                Before/After Slides ({beforeAfters.length})
                {activeTab === 'beforeafter' && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gold" />}
              </button>
            </div>

            {/* Scrollable Modal Content */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6">

              {/* TAB 1: DETAILS */}
              {activeTab === 'details' && (
                <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Title */}
                    <div className="space-y-2">
                      <label className="text-[10px] text-muted uppercase tracking-wider font-semibold">Project Title *</label>
                      <input
                        type="text"
                        {...editForm.register('title')}
                        className="bg-onyx border border-gold/15 text-xs text-ivory rounded px-4 py-2.5 w-full focus:outline-none focus:border-gold transition-all"
                      />
                      {editForm.formState.errors.title && (
                        <p className="text-[10px] text-red-400 font-semibold">{editForm.formState.errors.title.message}</p>
                      )}
                    </div>

                    {/* Slug */}
                    <div className="space-y-2">
                      <label className="text-[10px] text-muted uppercase tracking-wider font-semibold">URL Slug *</label>
                      <input
                        type="text"
                        {...editForm.register('slug')}
                        className="bg-onyx border border-gold/15 text-xs text-ivory rounded px-4 py-2.5 w-full focus:outline-none focus:border-gold transition-all font-mono"
                      />
                      {editForm.formState.errors.slug && (
                        <p className="text-[10px] text-red-400 font-semibold">{editForm.formState.errors.slug.message}</p>
                      )}
                    </div>

                    {/* Category */}
                    <div className="space-y-2">
                      <label className="text-[10px] text-muted uppercase tracking-wider font-semibold">Category *</label>
                      <select
                        {...editForm.register('category')}
                        className="bg-onyx border border-gold/15 text-xs text-ivory rounded px-4 py-2.5 w-full focus:outline-none focus:border-gold transition-all"
                      >
                        <option value="residential">Residential</option>
                        <option value="commercial">Commercial</option>
                        <option value="architecture">Architecture</option>
                        <option value="hospitality">Hospitality</option>
                        <option value="renovation">Renovation</option>
                      </select>
                    </div>

                    {/* Location */}
                    <div className="space-y-2">
                      <label className="text-[10px] text-muted uppercase tracking-wider font-semibold">Location *</label>
                      <input
                        type="text"
                        {...editForm.register('location')}
                        className="bg-onyx border border-gold/15 text-xs text-ivory rounded px-4 py-2.5 w-full focus:outline-none focus:border-gold transition-all"
                      />
                      {editForm.formState.errors.location && (
                        <p className="text-[10px] text-red-400 font-semibold">{editForm.formState.errors.location.message}</p>
                      )}
                    </div>

                    {/* Completion Date/Year */}
                    <div className="space-y-2">
                      <label className="text-[10px] text-muted uppercase tracking-wider font-semibold">Completion Date/Year</label>
                      <input
                        type="text"
                        {...editForm.register('completion_date')}
                        className="bg-onyx border border-gold/15 text-xs text-ivory rounded px-4 py-2.5 w-full focus:outline-none focus:border-gold transition-all"
                        placeholder="e.g. 2026 or June 2026"
                      />
                      {editForm.formState.errors.completion_date && (
                        <p className="text-[10px] text-red-400 font-semibold">{editForm.formState.errors.completion_date.message}</p>
                      )}
                    </div>

                    {/* Display Order */}
                    <div className="space-y-2">
                      <label className="text-[10px] text-muted uppercase tracking-wider font-semibold">Display Sort Order</label>
                      <input
                        type="number"
                        {...editForm.register('display_order')}
                        className="bg-onyx border border-gold/15 text-xs text-ivory rounded px-4 py-2.5 w-full focus:outline-none focus:border-gold transition-all"
                      />
                      {editForm.formState.errors.display_order && (
                        <p className="text-[10px] text-red-400 font-semibold">{editForm.formState.errors.display_order.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Cover Image Upload / URL */}
                  <div className="space-y-2 p-4 bg-onyx/40 border border-gold/10 rounded-xl">
                    <label className="text-[10px] text-gold uppercase tracking-wider font-bold block mb-1">Featured Cover Image</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <span className="text-[9px] text-muted block uppercase">Option 1: Upload New File</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleMainCoverUpload(e, 'edit')}
                          className="text-xs w-full text-ivory/80 file:bg-gold/15 file:text-gold file:border-none file:px-3 file:py-1 file:rounded file:text-[10px] file:uppercase file:cursor-pointer"
                        />
                      </div>
                      <div className="space-y-2">
                        <span className="text-[9px] text-muted block uppercase">Option 2: Direct Cover Image URL</span>
                        <input
                          type="text"
                          {...editForm.register('featured_image')}
                          className="bg-onyx border border-gold/15 text-xs text-ivory rounded px-3 py-1.5 w-full focus:outline-none focus:border-gold font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Project URL, GitHub URL, Client Name */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="space-y-2">
                      <label className="text-[10px] text-muted uppercase tracking-wider font-semibold">Live Project URL</label>
                      <input
                        type="text"
                        {...editForm.register('project_url')}
                        className="bg-onyx border border-gold/15 text-xs text-ivory rounded px-3 py-1.5 w-full focus:outline-none focus:border-gold font-mono"
                        placeholder="https://example.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] text-muted uppercase tracking-wider font-semibold">GitHub Repo URL</label>
                      <input
                        type="text"
                        {...editForm.register('github_url')}
                        className="bg-onyx border border-gold/15 text-xs text-ivory rounded px-3 py-1.5 w-full focus:outline-none focus:border-gold font-mono"
                        placeholder="https://github.com/..."
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] text-muted uppercase tracking-wider font-semibold">Client Name</label>
                      <input
                        type="text"
                        {...editForm.register('client_name')}
                        className="bg-onyx border border-gold/15 text-xs text-ivory rounded px-3 py-1.5 w-full focus:outline-none focus:border-gold"
                        placeholder="Client Co."
                      />
                    </div>
                  </div>

                  {/* Technologies */}
                  <div className="space-y-2">
                    <label className="text-[10px] text-muted uppercase tracking-wider font-semibold">Technologies (Comma-separated)</label>
                    <input
                      type="text"
                      {...editForm.register('technologies')}
                      className="bg-onyx border border-gold/15 text-xs text-ivory rounded px-4 py-2.5 w-full focus:outline-none focus:border-gold transition-all"
                      placeholder="e.g. Next.js, React, Supabase, Tailwind CSS"
                    />
                  </div>

                  {/* Short Description */}
                  <div className="space-y-2">
                    <label className="text-[10px] text-muted uppercase tracking-wider font-semibold">Short Description (Intro) *</label>
                    <textarea
                      rows={2}
                      {...editForm.register('short_description')}
                      className="bg-onyx border border-gold/15 text-xs text-ivory rounded px-4 py-2.5 w-full focus:outline-none focus:border-gold transition-all resize-none"
                      placeholder="Summarize project specifications, styles, layouts..."
                    />
                    {editForm.formState.errors.short_description && (
                      <p className="text-[10px] text-red-400 font-semibold">{editForm.formState.errors.short_description.message}</p>
                    )}
                  </div>

                  {/* Full Description */}
                  <div className="space-y-2">
                    <label className="text-[10px] text-muted uppercase tracking-wider font-semibold">Full Description / Overview</label>
                    <textarea
                      rows={4}
                      {...editForm.register('full_description')}
                      className="bg-onyx border border-gold/15 text-xs text-ivory rounded px-4 py-2.5 w-full focus:outline-none focus:border-gold transition-all resize-y"
                      placeholder="Provide detailed description..."
                    />
                  </div>

                  {/* Toggles */}
                  <div className="flex flex-wrap items-center gap-8 bg-onyx/40 border border-gold/5 p-4 rounded-xl">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        {...editForm.register('featured')}
                        className="sr-only peer"
                      />
                      <div className="relative w-11 h-6 bg-onyx border border-gold/15 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-muted after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-gold peer-checked:after:bg-onyx" />
                      <span className="text-xs font-semibold text-ivory group-hover:text-gold transition-colors">Featured Portfolio</span>
                    </label>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold text-ivory">Visibility Status:</span>
                      <select
                        {...editForm.register('status')}
                        className="bg-onyx border border-gold/15 text-xs text-ivory rounded px-3 py-1.5 focus:outline-none focus:border-gold transition-all font-semibold"
                      >
                        <option value="draft">Draft (Hidden)</option>
                        <option value="published">Published (Visible)</option>
                        <option value="archived">Archived (Archived)</option>
                      </select>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="pt-4 border-t border-gold/10 flex justify-end">
                    <button
                      type="submit"
                      className="gold-btn-primary px-6 py-2.5 rounded shadow-lg shadow-gold/15 flex items-center gap-2"
                      disabled={isPending || mediaUploadLoading}
                    >
                      {isPending || mediaUploadLoading ? <Loader2 className="w-4 h-4 animate-spin text-onyx" /> : <Save className="w-4 h-4" />}
                      <span>Save Project Details</span>
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 2: GALLERY */}
              {activeTab === 'gallery' && (
                <div className="space-y-6">

                  {/* Upload Form */}
                  <form onSubmit={handleAddMedia} className="bg-onyx/40 border border-gold/10 p-5 rounded-xl space-y-4">
                    <h4 className="text-xs text-gold uppercase tracking-wider font-semibold flex items-center gap-2">
                      <UploadCloud className="w-4 h-4" />
                      Add Image to Gallery
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* File upload */}
                      <div className="space-y-2">
                        <label className="text-[10px] text-muted uppercase tracking-wider font-semibold">Upload Image File</label>
                        <input
                          type="file"
                          name="mediaFile"
                          accept="image/*"
                          className="bg-onyx border border-gold/15 text-xs text-ivory rounded px-3 py-2 w-full focus:outline-none focus:border-gold file:bg-gold/15 file:text-gold file:border-none file:px-3 file:py-1 file:rounded file:text-[10px] file:uppercase file:font-semibold file:cursor-pointer"
                        />
                      </div>

                      {/* Direct URL input */}
                      <div className="space-y-2">
                        <label className="text-[10px] text-muted uppercase tracking-wider font-semibold">Or enter image URL (Fallback)</label>
                        <input
                          type="url"
                          name="mediaUrl"
                          placeholder="https://example.com/image.jpg"
                          className="bg-onyx border border-gold/15 text-xs text-ivory rounded px-4 py-2.5 w-full focus:outline-none focus:border-gold"
                        />
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" name="makeCover" className="rounded border-gold/20 bg-onyx text-gold focus:ring-0" />
                        <span className="text-xs text-muted">Designate as project cover photo</span>
                      </label>
                      <button
                        type="submit"
                        disabled={mediaUploadLoading}
                        className="gold-btn-primary px-5 py-2 text-xs rounded shadow flex items-center gap-2 disabled:opacity-50"
                      >
                        {mediaUploadLoading ? (
                          <>
                            <Loader2 className="w-4.5 h-4.5 animate-spin" />
                            <span>Processing...</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-4 h-4" />
                            <span>Add Image</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>

                  {/* Gallery Items Grid */}
                  <div className="space-y-3">
                    <h4 className="text-xs text-muted uppercase tracking-wider font-semibold">Gallery Catalog</h4>
                    {gallery.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {gallery.map((item, index) => (
                          <div
                            key={item.id}
                            className={`bg-onyx/30 border rounded-xl overflow-hidden p-3 space-y-3 flex flex-col justify-between group transition-all ${item.is_cover ? 'border-gold shadow-md shadow-gold/5' : 'border-gold/10 hover:border-gold/25'
                              }`}
                          >
                            <div className="relative aspect-video rounded overflow-hidden border border-white/5 bg-black/40">
                              <img src={item.url} alt="Gallery item" className="w-full h-full object-cover" />
                              {item.is_cover && (
                                <span className="absolute top-2 left-2 text-[9px] bg-gold text-onyx font-bold px-2 py-0.5 tracking-wider rounded uppercase">
                                  Cover Image
                                </span>
                              )}
                            </div>

                            <div className="flex justify-between items-center text-[10px] text-muted">
                              <span>Order: #{index + 1}</span>
                              <div className="flex items-center gap-1">
                                {/* Sort buttons */}
                                <button
                                  type="button"
                                  onClick={() => handleMoveMedia(index, 'up')}
                                  disabled={index === 0}
                                  className="p-1 hover:text-gold hover:bg-white/5 rounded disabled:opacity-30"
                                  title="Move Left"
                                >
                                  <ArrowUp className="w-3.5 h-3.5 rotate-[270deg]" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleMoveMedia(index, 'down')}
                                  disabled={index === gallery.length - 1}
                                  className="p-1 hover:text-gold hover:bg-white/5 rounded disabled:opacity-30"
                                  title="Move Right"
                                >
                                  <ArrowDown className="w-3.5 h-3.5 rotate-[270deg]" />
                                </button>

                                {/* Make Cover */}
                                {!item.is_cover && (
                                  <button
                                    type="button"
                                    onClick={() => handleSetCover(item)}
                                    className="p-1 hover:text-gold hover:bg-white/5 rounded"
                                    title="Set Cover Photo"
                                  >
                                    <Sparkles className="w-3.5 h-3.5" />
                                  </button>
                                )}

                                {/* Trash */}
                                <button
                                  type="button"
                                  onClick={() => handleRemoveMedia(item.id)}
                                  className="p-1 hover:text-red-400 hover:bg-red-500/5 rounded"
                                  title="Remove Image"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-8 text-center text-muted border border-dashed border-gold/15 rounded-xl text-xs flex flex-col items-center justify-center gap-1.5">
                        <ImageIcon className="w-8 h-8 text-gold/20" />
                        <span>No images uploaded to this project portfolio.</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: BEFORE / AFTER */}
              {activeTab === 'beforeafter' && (
                <div className="space-y-6">

                  {/* Upload BA Form */}
                  <form onSubmit={handleAddBeforeAfter} className="bg-onyx/40 border border-gold/10 p-5 rounded-xl space-y-4">
                    <h4 className="text-xs text-gold uppercase tracking-wider font-semibold flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Add Before/After Comparison Set
                    </h4>

                    {/* Label */}
                    <div className="space-y-2">
                      <label className="text-[10px] text-muted uppercase tracking-wider font-semibold">Slide Room/Perspective Label (Optional)</label>
                      <input
                        type="text"
                        name="baLabel"
                        placeholder="e.g. Master Bedroom, Dining Hall"
                        className="bg-onyx border border-gold/15 text-xs text-ivory rounded px-4 py-2.5 w-full focus:outline-none focus:border-gold transition-all"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                      {/* Before details */}
                      <div className="bg-black/20 border border-gold/5 p-4 rounded-lg space-y-3">
                        <span className="text-[10px] text-gold uppercase tracking-wider font-bold block">1. Before Image</span>
                        <input
                          type="file"
                          name="beforeFile"
                          accept="image/*"
                          className="bg-onyx border border-gold/15 text-[10px] text-ivory rounded px-2.5 py-1.5 w-full file:bg-gold/15 file:text-gold file:border-none file:px-2 file:py-0.5 file:rounded"
                        />
                        <input
                          type="url"
                          name="beforeUrl"
                          placeholder="Or before image URL"
                          className="bg-onyx border border-gold/15 text-[10px] text-ivory rounded px-3 py-1.5 w-full focus:outline-none focus:border-gold"
                        />
                      </div>

                      {/* After details */}
                      <div className="bg-black/20 border border-gold/5 p-4 rounded-lg space-y-3">
                        <span className="text-[10px] text-gold uppercase tracking-wider font-bold block">2. After Image</span>
                        <input
                          type="file"
                          name="afterFile"
                          accept="image/*"
                          className="bg-onyx border border-gold/15 text-[10px] text-ivory rounded px-2.5 py-1.5 w-full file:bg-gold/15 file:text-gold file:border-none file:px-2 file:py-0.5 file:rounded"
                        />
                        <input
                          type="url"
                          name="afterUrl"
                          placeholder="Or after image URL"
                          className="bg-onyx border border-gold/15 text-[10px] text-ivory rounded px-3 py-1.5 w-full focus:outline-none focus:border-gold"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        type="submit"
                        disabled={baUploadLoading}
                        className="gold-btn-primary px-5 py-2 text-xs rounded shadow flex items-center gap-2 disabled:opacity-50"
                      >
                        {baUploadLoading ? (
                          <>
                            <Loader2 className="w-4.5 h-4.5 animate-spin" />
                            <span>Processing...</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-4 h-4" />
                            <span>Save Comparison Set</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>

                  {/* Comparisons Catalog */}
                  <div className="space-y-3">
                    <h4 className="text-xs text-muted uppercase tracking-wider font-semibold">Active Slide Comparisons</h4>
                    {beforeAfters.length > 0 ? (
                      <div className="space-y-4">
                        {beforeAfters.map((ba) => (
                          <div
                            key={ba.id}
                            className="bg-onyx/30 border border-gold/10 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-6 hover:border-gold/25 transition-all"
                          >
                            <div className="flex items-center gap-4 w-full">
                              <div className="grid grid-cols-2 gap-2 w-48 shrink-0">
                                <div className="aspect-[4/3] rounded border border-white/5 overflow-hidden relative">
                                  <img src={ba.before_url} alt="Before" className="w-full h-full object-cover" />
                                  <span className="absolute bottom-1 left-1 text-[8px] bg-red-950/80 text-red-400 border border-red-500/20 font-bold px-1 py-0.2 uppercase rounded">
                                    Before
                                  </span>
                                </div>
                                <div className="aspect-[4/3] rounded border border-white/5 overflow-hidden relative">
                                  <img src={ba.after_url} alt="After" className="w-full h-full object-cover" />
                                  <span className="absolute bottom-1 left-1 text-[8px] bg-green-950/80 text-green-400 border border-green-500/20 font-bold px-1 py-0.2 uppercase rounded">
                                    After
                                  </span>
                                </div>
                              </div>
                              <div>
                                <h5 className="font-semibold text-ivory text-sm">{ba.label || 'Unnamed Comparison Set'}</h5>
                                <p className="text-[10px] text-muted font-mono mt-1 shrink-0">ID: {ba.id}</p>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleDeleteBeforeAfter(ba.id)}
                              className="p-2 text-muted hover:text-red-400 hover:bg-red-500/5 rounded-lg border border-transparent hover:border-red-500/10 transition-all shrink-0"
                              title="Delete Comparison Set"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-8 text-center text-muted border border-dashed border-gold/15 rounded-xl text-xs flex flex-col items-center justify-center gap-1.5">
                        <ImageIcon className="w-8 h-8 text-gold/20" />
                        <span>No before/after slider sets configured for this project.</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gold/10 bg-onyx/30 flex justify-end shrink-0">
              <button
                type="button"
                onClick={() => setIsEditOpen(false)}
                className="px-6 py-2 border border-gold/25 text-gold hover:bg-gold/5 rounded text-xs font-semibold uppercase tracking-wider"
              >
                Close Project Editor
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
