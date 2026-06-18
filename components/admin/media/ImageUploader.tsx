'use client';

import React, { useState, useRef, useCallback } from 'react';
import { 
  Upload, 
  X, 
  RefreshCw, 
  AlertTriangle, 
  Loader2, 
  FileImage, 
  Film 
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { useToast } from '@/components/ui/Toast';

interface ImageUploaderProps {
  bucket: 'projects' | 'blog' | 'hero' | 'testimonials';
  value: string[]; // Array of current image public URLs
  onChange: (_urls: string[]) => void; // Callback when the URLs update
  maxFiles?: number; // Maximum number of files allowed (1 for single upload mode)
  maxSizeMB?: number; // Max file size in MB
}

export default function ImageUploader({
  bucket,
  value = [],
  onChange,
  maxFiles = 5,
  maxSizeMB = 5
}: ImageUploaderProps) {
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [uploadingCount, setUploadingCount] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [replaceIndex, setReplaceIndex] = useState<number | null>(null);
  
  const { toast } = useToast();
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);

  // Parse path relative to bucket from public URL
  const getPathFromUrl = (url: string, bucketName: string): string => {
    const markers = [
      `/storage/v1/object/public/${bucketName}/`,
      `/object/public/${bucketName}/`
    ];

    for (const marker of markers) {
      const idx = url.indexOf(marker);
      if (idx !== -1) {
        return decodeURIComponent(url.substring(idx + marker.length));
      }
    }

    // Fallback: extract the last path segments
    try {
      const urlObj = new URL(url);
      const segments = urlObj.pathname.split('/');
      const bucketIdx = segments.indexOf(bucketName);
      if (bucketIdx !== -1 && bucketIdx < segments.length - 1) {
        return decodeURIComponent(segments.slice(bucketIdx + 1).join('/'));
      }
      return decodeURIComponent(segments[segments.length - 1]);
    } catch {
      const parts = url.split('/');
      return decodeURIComponent(parts[parts.length - 1]);
    }
  };

  // Check file type and size constraints
  const validateFile = (file: File): { valid: boolean; reason?: string } => {
    // Hero slide supports video overlays, others only images
    const isHero = bucket === 'hero';
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/') && isHero;

    if (!isImage && !isVideo) {
      return { 
        valid: false, 
        reason: isHero 
          ? 'Invalid file format. Only images and videos are supported.' 
          : 'Invalid file format. Only images are supported.' 
      };
    }

    // Default size gate: 5MB for images, 25MB for videos
    const fileLimitMB = isVideo ? 25 : maxSizeMB;
    const maxByteLimit = fileLimitMB * 1024 * 1024;

    if (file.size > maxByteLimit) {
      return { 
        valid: false, 
        reason: `File size exceeds the limit of ${fileLimitMB}MB.` 
      };
    }

    return { valid: true };
  };

  // Direct Supabase storage file upload
  const uploadToStorage = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const uniqueId = Math.random().toString(36).substring(2, 12);
      const fileName = `${uniqueId}_${Date.now()}.${fileExt}`;
      
      // Structure inside folder prefix for cleaner organization
      const filePath = `uploads/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw uploadError;
      }

      // Generate public URL
      const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (err: any) {
      console.error('Supabase upload error:', err);
      const errMsg = `Upload failed: ${err.message || 'Unknown network error.'}`;
      setErrorMsg(errMsg);
      toast(errMsg, 'error');
      return null;
    }
  };

  // Dropzone drag-drop events handlers
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleFiles = async (files: FileList) => {
    setErrorMsg(null);
    const filesToUpload = Array.from(files);

    // Limit overall uploads to the maximum capacity bounds
    const spaceLeft = maxFiles - value.length;
    if (spaceLeft <= 0) {
      const msg = `Maximum files limit (${maxFiles}) reached.`;
      setErrorMsg(msg);
      toast(msg, 'warning');
      return;
    }

    const validFiles: File[] = [];
    for (const file of filesToUpload.slice(0, spaceLeft)) {
      const check = validateFile(file);
      if (!check.valid) {
        const msg = check.reason || 'Invalid file detected.';
        setErrorMsg(msg);
        toast(msg, 'error');
        return;
      }
      validFiles.push(file);
    }

    if (validFiles.length === 0) return;

    setUploadingCount(validFiles.length);
    const uploadToastId = toast(`Uploading ${validFiles.length} asset(s)...`, 'loading');

    const uploadedUrls: string[] = [];
    for (const file of validFiles) {
      const url = await uploadToStorage(file);
      if (url) {
        uploadedUrls.push(url);
      }
      setUploadingCount(prev => Math.max(0, prev - 1));
    }

    if (uploadedUrls.length > 0) {
      onChange([...value, ...uploadedUrls]);
      toast('Assets uploaded successfully.', 'success');
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  // Replace a specific image in the grid list
  const handleReplaceClick = (index: number) => {
    setReplaceIndex(index);
    // Trigger hidden replace input click
    setTimeout(() => {
      replaceInputRef.current?.click();
    }, 50);
  };

  const handleReplaceFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (replaceIndex === null || !e.target.files || e.target.files.length === 0) return;
    setErrorMsg(null);

    const file = e.target.files[0];
    const check = validateFile(file);
    if (!check.valid) {
      const msg = check.reason || 'Invalid file type.';
      setErrorMsg(msg);
      toast(msg, 'error');
      setReplaceIndex(null);
      return;
    }

    setUploadingCount(1);
    const replaceToastId = toast('Replacing media asset...', 'loading');
    const newUrl = await uploadToStorage(file);
    
    if (newUrl) {
      const oldUrl = value[replaceIndex];
      const newUrls = [...value];
      newUrls[replaceIndex] = newUrl;
      onChange(newUrls);
      toast('Asset replaced successfully.', 'success');

      // Clean up the old replaced asset from storage bucket
      const oldPath = getPathFromUrl(oldUrl, bucket);
      if (oldPath) {
        await supabase.storage.from(bucket).remove([oldPath]);
      }
    }

    setUploadingCount(0);
    setReplaceIndex(null);
  };

  // Delete/Remove specific file index
  const handleDelete = async (index: number) => {
    setErrorMsg(null);
    const targetUrl = value[index];
    const newUrls = value.filter((_, idx) => idx !== index);
    onChange(newUrls);
    const deleteToastId = toast('Removing media asset...', 'loading');

    // Call Supabase bucket removal to keep storage clean
    const filePath = getPathFromUrl(targetUrl, bucket);
    if (filePath) {
      const { error } = await supabase.storage.from(bucket).remove([filePath]);
      if (error) {
        console.error('Supabase storage cleanup error:', error);
        toast('Failed to delete asset file from storage.', 'error');
      } else {
        toast('Asset deleted successfully.', 'success');
      }
    } else {
      toast('Asset removed from list.', 'success');
    }
  };

  const isVideoUrl = (url: string) => {
    const ext = url.split('.').pop()?.toLowerCase();
    return ext === 'mp4' || ext === 'webm' || ext === 'ogg' || ext === 'mov';
  };

  return (
    <div className="space-y-4 w-full font-jost">
      
      {/* Error alertHUD banner */}
      {errorMsg && (
        <div className="p-3 bg-red-950/60 border border-red-500/20 rounded-lg flex items-start gap-2.5 text-xs text-red-400 animate-in fade-in duration-200">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Hidden file selectors */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        multiple={maxFiles > 1}
        accept={bucket === 'hero' ? 'image/*,video/*' : 'image/*'}
        className="hidden"
      />
      <input
        type="file"
        ref={replaceInputRef}
        onChange={handleReplaceFile}
        accept={bucket === 'hero' ? 'image/*,video/*' : 'image/*'}
        className="hidden"
      />

      {/* Previews Layout Grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {value.map((url, idx) => (
            <div 
              key={url + idx} 
              className="relative aspect-square rounded-xl overflow-hidden border border-gold/15 bg-onyx group transition-all duration-300 hover:border-gold shadow"
            >
              {/* Image vs Video rendering */}
              {isVideoUrl(url) ? (
                <video 
                  src={url} 
                  className="w-full h-full object-cover" 
                  muted
                  playsInline
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img 
                  src={url} 
                  alt={`Upload preview ${idx}`} 
                  className="w-full h-full object-cover"
                />
              )}

              {/* Hover actions panel */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 z-20">
                <button
                  type="button"
                  onClick={() => handleReplaceClick(idx)}
                  className="p-2 bg-onyx/90 border border-gold/20 text-gold rounded-full hover:bg-gold hover:text-onyx transition-all duration-300 transform scale-90 group-hover:scale-100"
                  title="Replace Asset"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(idx)}
                  className="p-2 bg-red-950/90 border border-red-500/30 text-red-400 rounded-full hover:bg-red-500 hover:text-white transition-all duration-300 transform scale-90 group-hover:scale-100"
                  title="Delete Asset"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Indicator icons overlay */}
              <div className="absolute bottom-2 left-2 z-10 bg-black/40 px-1.5 py-0.5 rounded text-[8px] text-ivory/80 flex items-center gap-1">
                {isVideoUrl(url) ? <Film className="w-2.5 h-2.5" /> : <FileImage className="w-2.5 h-2.5" />}
                <span>{isVideoUrl(url) ? 'Video' : 'Image'}</span>
              </div>
            </div>
          ))}

          {/* Loader indicators during active upload */}
          {uploadingCount > 0 && (
            <div className="aspect-square rounded-xl border border-gold/15 border-dashed bg-onyx/20 flex flex-col items-center justify-center gap-2 text-muted">
              <Loader2 className="w-6 h-6 animate-spin text-gold" />
              <span className="text-[10px]">Uploading asset...</span>
            </div>
          )}
        </div>
      )}

      {/* Drag & Drop zone Container (Hidden when max capacity reached) */}
      {value.length < maxFiles && (
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${
            dragActive 
              ? 'border-gold bg-gold/5 text-gold scale-[0.99]' 
              : 'border-gold/15 hover:border-gold/30 hover:bg-gold/5 text-muted'
          }`}
        >
          <div className="flex flex-col items-center justify-center gap-3">
            <div className={`p-3 rounded-full bg-onyx border ${dragActive ? 'border-gold text-gold' : 'border-gold/10 text-muted'}`}>
              <Upload className="w-5 h-5 animate-pulse" />
            </div>
            
            <div className="space-y-1">
              <p className="text-xs text-ivory font-semibold">
                Drag and drop your asset files here, or <span className="text-gold underline">browse files</span>
              </p>
              <p className="text-[10px] text-muted">
                {bucket === 'hero' 
                  ? 'Accepts JPG, PNG, WEBP, GIF, or MP4 formats.' 
                  : 'Accepts PNG, JPG, JPEG, or WEBP images.'}
              </p>
              <p className="text-[10px] text-muted/65">
                Maximum size limit: {bucket === 'hero' ? '5MB (images) / 25MB (video)' : `${maxSizeMB}MB per image`}. Limit: {maxFiles - value.length} left.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
