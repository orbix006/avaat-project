'use client';
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */

import React, { useState, useEffect, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import * as LucideIcons from 'lucide-react';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Eye, 
  EyeOff, 
  Loader2, 
  Save, 
  X, 
  ArrowUp, 
  ArrowDown, 
  CheckCircle2, 
  AlertCircle,
  Briefcase,
  
} from 'lucide-react';

import { 
  fetchServices, 
  createService, 
  updateService, 
  deleteService, 
  reorderServices, 
  ServiceRow 
} from '@/lib/actions/services';

// Bucket name for service images


// Dynamic Icon Renderer
const renderIcon = (name: string | null, className?: string) => {
  const IconComponent = (LucideIcons as any)[name || 'Briefcase'] || LucideIcons.Briefcase;
  return <IconComponent className={className} />;
};

// Available premium Lucide icons for services
const AVAILABLE_ICONS = [
  { name: 'Briefcase', label: 'Briefcase' },
  { name: 'Layout', label: 'Grid Layout' },
  { name: 'Home', label: 'House' },
  { name: 'Compass', label: 'Compass' },
  { name: 'Palette', label: 'Palette (Colors)' },
  { name: 'Ruler', label: 'Ruler (Drafting)' },
  { name: 'Layers', label: 'Layers (3D)' },
  { name: 'Hammer', label: 'Hammer (Civil)' },
  { name: 'PenTool', label: 'Pen Tool (Concept)' },
];

// Zod validation matching database
const serviceFormSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100, 'Title is too long'),
  slug: z.string().min(3, 'Slug must be at least 3 characters')
    .regex(/^[a-z0-9-_]+$/, 'Slug can only contain lowercase letters, numbers, hyphens, and underscores'),
  service_type: z.enum([
    'interior_design',
    'architectural_design',
    'renovation_remodeling',
    'space_planning',
    '3d_visualization',
    'furniture_material_selection'
  ] as const),
  short_desc: z.string().min(10, 'Short description must be at least 10 characters').max(500, 'Short description cannot exceed 500 characters'),
  long_desc: z.string().optional().nullable(),

  icon_name: z.string().min(1, 'Icon selection is required'),
  sort_order: z.preprocess((val) => val === '' ? 0 : Number(val), z.number().int().nonnegative('Sort order must be 0 or greater')),
  is_active: z.boolean(),
});

type ServiceFormInput = z.infer<typeof serviceFormSchema>;

export default function ServicesAdminPage() {
  const [services, setServices] = useState<ServiceRow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isPending, startTransition] = useTransition();

  // Search filter
  const [search, setSearch] = useState<string>('');

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);
  const [isEditOpen, setIsEditOpen] = useState<boolean>(false);
  const [activeEditService, setActiveEditService] = useState<ServiceRow | null>(null);

  // Success/Error notifications
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  

  // Forms
  const createForm = useForm<ServiceFormInput>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      title: '',
      slug: '',
      service_type: 'interior_design',
      short_desc: '',
      long_desc: '',

      icon_name: 'Briefcase',
      sort_order: 0,
      is_active: true,
    }
  });

  const editForm = useForm<ServiceFormInput>({
    resolver: zodResolver(serviceFormSchema),
  });

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };


  // Fetch all services
  const loadServices = async () => {
    setLoading(true);
    const res = await fetchServices();
    if (res.data) {
      setServices(res.data);
    } else if (res.error) {
      showNotification('error', res.error);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadServices();
  }, []);

  // Slug generator
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  // Watch Title changes to generate slugs
  const createTitle = createForm.watch('title');
  useEffect(() => {
    if (createTitle) {
      createForm.setValue('slug', generateSlug(createTitle), { shouldValidate: true });
    }
  }, [createTitle, createForm]);

  const editTitle = editForm.watch('title');
  useEffect(() => {
    if (editTitle) {
      editForm.setValue('slug', generateSlug(editTitle), { shouldValidate: true });
    }
  }, [editTitle, editForm]);

  // Handle create submission
  const onCreateSubmit = async (data: ServiceFormInput) => {
    startTransition(async () => {
      const payload = {
        title: data.title,
        slug: data.slug,
        service_type: data.service_type,
        short_desc: data.short_desc,
        long_desc: data.long_desc ?? null,
  
        icon_name: data.icon_name,
        sort_order: data.sort_order,
        is_active: data.is_active,
      };
      const res = await createService(payload);
      if (res.success) {
        showNotification('success', 'Service created successfully!');
        setIsCreateOpen(false);
        createForm.reset();
        loadServices();
      } else if (res.error) {
        showNotification('error', res.error);
      }
    });
  };

  // Open edit modal
  const handleEditClick = (service: ServiceRow) => {
    setActiveEditService(service);
    editForm.reset({
      title: service.title,
      slug: service.slug,
      service_type: service.service_type,
      short_desc: service.short_desc,
      long_desc: service.long_desc || '',

      icon_name: service.icon_name || 'Briefcase',
      sort_order: service.sort_order,
      is_active: service.is_active,
    });
    setIsEditOpen(true);
  };

  // Handle edit submission
  const onEditSubmit = async (data: ServiceFormInput) => {
    if (!activeEditService) return;
    startTransition(async () => {
      const payload = {
        title: data.title,
        slug: data.slug,
        service_type: data.service_type,
        short_desc: data.short_desc,
        long_desc: data.long_desc ?? null,

        icon_name: data.icon_name,
        sort_order: data.sort_order,
        is_active: data.is_active,
      };
      const res = await updateService(activeEditService.id, payload);
      if (res.success) {
        showNotification('success', 'Service updated successfully!');
        setIsEditOpen(false);
        loadServices();
      } else if (res.error) {
        showNotification('error', res.error);
      }
    });
  };

  // Toggle active status directly
  const handleToggleStatus = async (service: ServiceRow) => {
    startTransition(async () => {
      const updatedStatus = !service.is_active;
      const res = await updateService(service.id, {
        title: service.title,
        slug: service.slug,
        service_type: service.service_type,
        short_desc: service.short_desc,
        long_desc: service.long_desc ?? null,

        icon_name: service.icon_name ?? 'Briefcase',
        sort_order: service.sort_order,
        is_active: updatedStatus
      });

      if (res.success) {
        showNotification('success', `Service set to ${updatedStatus ? 'Active' : 'Inactive'}.`);
        setServices(services.map(s => s.id === service.id ? { ...s, is_active: updatedStatus } : s));
      } else if (res.error) {
        showNotification('error', res.error);
      }
    });
  };

  // Handle service deletion
  const handleDeleteClick = async (id: string) => {
    if (confirm('Are you sure you want to permanently delete this service offering?')) {
      startTransition(async () => {
        const res = await deleteService(id);
        if (res.success) {
          showNotification('success', 'Service deleted successfully.');
          loadServices();
        } else if (res.error) {
          showNotification('error', res.error);
        }
      });
    }
  };

  // Reordering grid items
  const handleMoveService = async (index: number, direction: 'up' | 'down') => {
    if (index === 0 && direction === 'up') return;
    if (index === services.length - 1 && direction === 'down') return;

    const items = [...services];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    // Swap
    const temp = items[index];
    items[index] = items[targetIndex];
    items[targetIndex] = temp;

    const orders = items.map((item, idx) => ({ id: item.id, sort_order: idx }));
    setServices(items.map((item, idx) => ({ ...item, sort_order: idx })));

    const res = await reorderServices(orders);
    if (res.error) {
      showNotification('error', 'Reorder failed to save: ' + res.error);
    } else {
      showNotification('success', 'Service order updated.');
    }
  };

  // Filter services client-side
  const filteredServices = services.filter(service => 
    service.title.toLowerCase().includes(search.toLowerCase()) ||
    service.short_desc.toLowerCase().includes(search.toLowerCase()) ||
    service.service_type.toLowerCase().replace(/_/g, ' ').includes(search.toLowerCase())
  );

  // Helper prettifying enum values
  const getServiceTypeLabel = (type: string) => {
    return type
      .replace(/_/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase());
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Toast Notification HUD */}
      {notification && (
        <div className={`fixed top-6 right-6 z-50 p-4 rounded-xl border flex items-center gap-3 shadow-2xl animate-in slide-in-from-top-4 duration-300 ${
          notification.type === 'success' 
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
          <h2 className="font-cormorant text-2xl md:text-3xl font-bold text-ivory">Studio Services</h2>
          <p className="text-xs text-muted mt-1 font-jost">Configure service listings, rates, and visibility on key pages.</p>
        </div>
        <button 
          onClick={() => setIsCreateOpen(true)}
          className="gold-btn-primary text-xs px-6 py-2.5 rounded shadow-lg shadow-gold/25 flex items-center gap-2 transition-all hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Service</span>
        </button>
      </div>

      {/* Control Bar */}
      <div className="bg-warm-black border border-gold/10 rounded-xl p-4 flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80 group">
          <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-gold transition-colors" />
          <input
            type="text"
            placeholder="Search services by title, details, type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-onyx border border-gold/15 text-xs text-ivory rounded pl-9 pr-4 py-2.5 w-full focus:outline-none focus:border-gold transition-all placeholder:text-muted/50"
          />
        </div>
        <span className="text-[11px] text-muted tracking-wider uppercase font-semibold">
          Services Catalog Count: {services.length}
        </span>
      </div>

      {/* Services Grid list */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-muted">
          <Loader2 className="w-8 h-8 animate-spin text-gold" />
          <p className="text-xs">Fetching services registry...</p>
        </div>
      ) : filteredServices.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredServices.map((service, index) => (
            <div 
              key={service.id} 
              className={`bg-warm-black border rounded-xl p-5 transition-all duration-300 flex flex-col justify-between relative group ${
                service.is_active 
                  ? 'border-gold/15 hover:border-gold/30 shadow-sm' 
                  : 'border-white/5 opacity-55 hover:opacity-75'
              }`}
            >
              <div>
                {/* Icon Section */}
                <div className="mb-4 flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center border bg-onyx text-gold border-gold/25">
                    {renderIcon(service.icon_name, "w-6 h-6")}
                  </div>
                  
                  {/* Status Badge */}
                  <span className={`px-2 py-0.5 rounded text-[8px] font-bold tracking-wider uppercase border ${
                    service.is_active
                      ? 'bg-green-950/80 text-green-400 border-green-500/20'
                      : 'bg-yellow-950/80 text-yellow-400 border-yellow-500/20'
                  }`}>
                    {service.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>

                {/* Card Title & Info */}
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h3 className="font-semibold text-base text-ivory group-hover:text-gold transition-colors line-clamp-1">{service.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[9px] uppercase tracking-wider text-gold font-bold bg-gold/10 border border-gold/15 px-1.5 py-0.5 rounded">
                        {getServiceTypeLabel(service.service_type)}
                      </span>
                      <span className="text-[9px] text-muted/80 font-mono">
                        /{service.slug}
                      </span>
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button 
                      onClick={() => handleMoveService(index, 'up')}
                      disabled={index === 0}
                      className="p-1 text-muted hover:text-gold hover:bg-gold/5 rounded disabled:opacity-30 transition-all"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={() => handleMoveService(index, 'down')}
                      disabled={index === services.length - 1}
                      className="p-1 text-muted hover:text-gold hover:bg-gold/5 rounded disabled:opacity-30 transition-all"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={() => handleToggleStatus(service)}
                      className="p-1 text-muted hover:text-gold hover:bg-gold/5 rounded transition-all"
                      title={service.is_active ? 'Deactivate Service' : 'Activate Service'}
                    >
                      {service.is_active ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                    <button 
                      onClick={() => handleEditClick(service)}
                      className="p-1 text-muted hover:text-gold hover:bg-gold/5 rounded transition-all"
                      title="Edit Service"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={() => handleDeleteClick(service.id)}
                      className="p-1 text-muted hover:text-red-400 hover:bg-red-500/5 rounded transition-all"
                      title="Delete Service"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Short Description */}
                <p className="text-xs text-muted leading-relaxed mt-3 line-clamp-2">
                  {service.short_desc}
                </p>
              </div>

              {/* Card Footer info */}
              <div className="mt-5 pt-3 border-t border-gold/5 flex items-center justify-between text-[10px] text-muted shrink-0">
                <span>Display Sort Order: {service.sort_order}</span>
                <span className={`font-semibold uppercase tracking-wider ${service.is_active ? 'text-gold' : 'text-muted'}`}>
                  {service.is_active ? 'Visible on Main Site' : 'Hidden'}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-warm-black border border-gold/10 rounded-xl p-12 text-center text-muted text-xs flex flex-col items-center justify-center gap-2">
          <Briefcase className="w-10 h-10 text-gold/30 animate-pulse" />
          <span>No service listings matched your search inquiry.</span>
        </div>
      )}

      {/* ==================== CREATE MODAL ==================== */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-warm-black border border-gold/15 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-gold/10 flex justify-between items-center bg-onyx/10 shrink-0">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-gold" />
                <h3 className="font-cormorant text-lg font-bold text-ivory">Add Service Offering</h3>
              </div>
              <button 
                onClick={() => setIsCreateOpen(false)}
                className="p-1.5 text-muted hover:text-gold hover:bg-gold/5 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={createForm.handleSubmit(onCreateSubmit)} className="flex-1 overflow-y-auto p-6 space-y-5">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Title */}
                <div className="space-y-1">
                  <label className="text-[10px] text-muted uppercase tracking-wider font-semibold">Service Title *</label>
                  <input
                    type="text"
                    {...createForm.register('title')}
                    className="bg-onyx border border-gold/15 text-xs text-ivory rounded px-4 py-2.5 w-full focus:outline-none focus:border-gold transition-all"
                    placeholder="e.g. Space Layout Planning"
                  />
                  {createForm.formState.errors.title && (
                    <p className="text-[10px] text-red-400 font-semibold">{createForm.formState.errors.title.message}</p>
                  )}
                </div>

                {/* Slug */}
                <div className="space-y-1">
                  <label className="text-[10px] text-muted uppercase tracking-wider font-semibold">URL Slug (Auto-generated) *</label>
                  <input
                    type="text"
                    {...createForm.register('slug')}
                    className="bg-onyx border border-gold/15 text-xs text-ivory rounded px-4 py-2.5 w-full focus:outline-none focus:border-gold transition-all font-mono"
                    placeholder="e.g. space-layout-planning"
                  />
                  {createForm.formState.errors.slug && (
                    <p className="text-[10px] text-red-400 font-semibold">{createForm.formState.errors.slug.message}</p>
                  )}
                </div>

                {/* Service Type */}
                <div className="space-y-1">
                  <label className="text-[10px] text-muted uppercase tracking-wider font-semibold">Service Type *</label>
                  <select
                    {...createForm.register('service_type')}
                    className="bg-onyx border border-gold/15 text-xs text-ivory rounded px-4 py-2.5 w-full focus:outline-none focus:border-gold transition-all"
                  >
                    <option value="interior_design">Interior Design</option>
                    <option value="architectural_design">Architectural Design</option>
                    <option value="renovation_remodeling">Renovation & Remodeling</option>
                    <option value="space_planning">Space Planning</option>
                    <option value="3d_visualization">3D Visualization</option>
                    <option value="furniture_material_selection">Furniture & Material Selection</option>
                  </select>
                </div>

                {/* Icon Selector */}
                <div className="space-y-1">
                  <label className="text-[10px] text-muted uppercase tracking-wider font-semibold">Service Icon *</label>
                  <select
                    {...createForm.register('icon_name')}
                    className="bg-onyx border border-gold/15 text-xs text-ivory rounded px-4 py-2.5 w-full focus:outline-none focus:border-gold transition-all"
                  >
                    {AVAILABLE_ICONS.map((icon) => (
                      <option key={icon.name} value={icon.name}>
                        {icon.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort Order */}
                <div className="space-y-1">
                  <label className="text-[10px] text-muted uppercase tracking-wider font-semibold">Sort Display Order</label>
                  <input
                    type="number"
                    {...createForm.register('sort_order')}
                    className="bg-onyx border border-gold/15 text-xs text-ivory rounded px-4 py-2.5 w-full focus:outline-none focus:border-gold transition-all"
                  />
                  {createForm.formState.errors.sort_order && (
                    <p className="text-[10px] text-red-400 font-semibold">{createForm.formState.errors.sort_order.message}</p>
                  )}
                </div>
              </div>

              {/* Short Description */}
              <div className="space-y-1">
                <label className="text-[10px] text-muted uppercase tracking-wider font-semibold">Short Description (In Card) *</label>
                <textarea
                  rows={2}
                  {...createForm.register('short_desc')}
                  className="bg-onyx border border-gold/15 text-xs text-ivory rounded px-4 py-2.5 w-full focus:outline-none focus:border-gold transition-all resize-none"
                  placeholder="e.g. Bespoke planning structures mapped to interior templates..."
                />
                {createForm.formState.errors.short_desc && (
                  <p className="text-[10px] text-red-400 font-semibold">{createForm.formState.errors.short_desc.message}</p>
                )}
              </div>

              {/* Long Description */}
              <div className="space-y-1">
                <label className="text-[10px] text-muted uppercase tracking-wider font-semibold">Full Description (Long Details)</label>
                <textarea
                  rows={3}
                  {...createForm.register('long_desc')}
                  className="bg-onyx border border-gold/15 text-xs text-ivory rounded px-4 py-2.5 w-full focus:outline-none focus:border-gold transition-all resize-none"
                  placeholder="e.g. Expanded blueprints, layout drawings, material select routines..."
                />
              </div>

              {/* Active Switch Toggle */}
              <div className="flex items-center gap-8 bg-onyx/40 border border-gold/5 p-4 rounded-xl">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    {...createForm.register('is_active')}
                    className="sr-only peer"
                  />
                  <div className="relative w-11 h-6 bg-onyx border border-gold/15 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-muted after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-gold peer-checked:after:bg-onyx" />
                  <span className="text-xs font-semibold text-ivory group-hover:text-gold transition-colors">Activate Offering (Visible on main site)</span>
                </label>
              </div>

              {/* Save Operations Row */}
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
                  disabled={isPending}
                >
                  {isPending ? <Loader2 className="w-4 h-4 animate-spin text-onyx" /> : <Save className="w-4 h-4" />}
                  <span>Save Service</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== EDIT MODAL ==================== */}
      {isEditOpen && activeEditService && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-warm-black border border-gold/15 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-gold/10 flex justify-between items-center bg-onyx/10 shrink-0">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-gold" />
                <h3 className="font-cormorant text-lg font-bold text-ivory">
                  Edit Service: <span className="text-gold">{activeEditService.title}</span>
                </h3>
              </div>
              <button 
                onClick={() => setIsEditOpen(false)}
                className="p-1.5 text-muted hover:text-gold hover:bg-gold/5 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="flex-1 overflow-y-auto p-6 space-y-5">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Title */}
                <div className="space-y-1">
                  <label className="text-[10px] text-muted uppercase tracking-wider font-semibold">Service Title *</label>
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
                <div className="space-y-1">
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

                {/* Service Type */}
                <div className="space-y-1">
                  <label className="text-[10px] text-muted uppercase tracking-wider font-semibold">Service Type *</label>
                  <select
                    {...editForm.register('service_type')}
                    className="bg-onyx border border-gold/15 text-xs text-ivory rounded px-4 py-2.5 w-full focus:outline-none focus:border-gold transition-all"
                  >
                    <option value="interior_design">Interior Design</option>
                    <option value="architectural_design">Architectural Design</option>
                    <option value="renovation_remodeling">Renovation & Remodeling</option>
                    <option value="space_planning">Space Planning</option>
                    <option value="3d_visualization">3D Visualization</option>
                    <option value="furniture_material_selection">Furniture & Material Selection</option>
                  </select>
                </div>

                {/* Icon Selector */}
                <div className="space-y-1">
                  <label className="text-[10px] text-muted uppercase tracking-wider font-semibold">Service Icon *</label>
                  <select
                    {...editForm.register('icon_name')}
                    className="bg-onyx border border-gold/15 text-xs text-ivory rounded px-4 py-2.5 w-full focus:outline-none focus:border-gold transition-all"
                  >
                    {AVAILABLE_ICONS.map((icon) => (
                      <option key={icon.name} value={icon.name}>
                        {icon.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort Order */}
                <div className="space-y-1">
                  <label className="text-[10px] text-muted uppercase tracking-wider font-semibold">Sort Display Order</label>
                  <input
                    type="number"
                    {...editForm.register('sort_order')}
                    className="bg-onyx border border-gold/15 text-xs text-ivory rounded px-4 py-2.5 w-full focus:outline-none focus:border-gold transition-all"
                  />
                  {editForm.formState.errors.sort_order && (
                    <p className="text-[10px] text-red-400 font-semibold">{editForm.formState.errors.sort_order.message}</p>
                  )}
                </div>
              </div>

              {/* Short Description */}
              <div className="space-y-1">
                <label className="text-[10px] text-muted uppercase tracking-wider font-semibold">Short Description *</label>
                <textarea
                  rows={2}
                  {...editForm.register('short_desc')}
                  className="bg-onyx border border-gold/15 text-xs text-ivory rounded px-4 py-2.5 w-full focus:outline-none focus:border-gold transition-all resize-none"
                />
                {editForm.formState.errors.short_desc && (
                  <p className="text-[10px] text-red-400 font-semibold">{editForm.formState.errors.short_desc.message}</p>
                )}
              </div>

              {/* Long Description */}
              <div className="space-y-1">
                <label className="text-[10px] text-muted uppercase tracking-wider font-semibold">Full Description (Long Details)</label>
                <textarea
                  rows={3}
                  {...editForm.register('long_desc')}
                  className="bg-onyx border border-gold/15 text-xs text-ivory rounded px-4 py-2.5 w-full focus:outline-none focus:border-gold transition-all resize-none"
                />
              </div>

              {/* Active Switch Toggle */}
              <div className="flex items-center gap-8 bg-onyx/40 border border-gold/5 p-4 rounded-xl">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    {...editForm.register('is_active')}
                    className="sr-only peer"
                  />
                  <div className="relative w-11 h-6 bg-onyx border border-gold/15 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-muted after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-gold peer-checked:after:bg-onyx" />
                  <span className="text-xs font-semibold text-ivory group-hover:text-gold transition-colors">Activate Offering (Visible on main site)</span>
                </label>
              </div>

              {/* Action Buttons Row */}
              <div className="pt-4 border-t border-gold/10 flex justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="px-5 py-2.5 border border-gold/20 text-gold hover:bg-gold/5 rounded text-xs font-semibold uppercase tracking-wider"
                  disabled={isPending}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="gold-btn-primary px-6 py-2.5 rounded shadow-lg shadow-gold/15 flex items-center gap-2"
                  disabled={isPending}
                >
                  {isPending ? <Loader2 className="w-4 h-4 animate-spin text-onyx" /> : <Save className="w-4 h-4" />}
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
