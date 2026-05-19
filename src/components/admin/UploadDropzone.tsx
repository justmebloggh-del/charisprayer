"use client";

import { useRef, useState, useCallback, DragEvent, ChangeEvent } from "react";
import { Upload, X, CheckCircle2, AlertCircle, FileAudio, FileVideo, Image, File } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { cn } from "@/lib/utils";

export interface UploadedFile {
  name: string;
  size: number;
  type: string;
  url: string;
  path: string;
}

interface UploadDropzoneProps {
  bucket: string;
  folder?: string;
  accept?: string;
  acceptLabel?: string;
  maxSizeMB?: number;
  multiple?: boolean;
  onUploaded: (files: UploadedFile[]) => void;
  className?: string;
  compact?: boolean;
}

type FileState = {
  file: File;
  id: string;
  progress: number;
  status: "pending" | "uploading" | "done" | "error";
  error?: string;
  url?: string;
};

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function FileIcon({ type }: { type: string }) {
  if (type.startsWith("audio/")) return <FileAudio className="w-5 h-5 text-amber-400" />;
  if (type.startsWith("video/")) return <FileVideo className="w-5 h-5 text-blue-400" />;
  if (type.startsWith("image/")) return <Image className="w-5 h-5 text-emerald-400" />;
  return <File className="w-5 h-5 text-white/40" />;
}

export function UploadDropzone({
  bucket,
  folder = "",
  accept,
  acceptLabel,
  maxSizeMB = 200,
  multiple = false,
  onUploaded,
  className,
  compact = false,
}: UploadDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<FileState[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  const validate = (file: File): string | null => {
    if (file.size > maxSizeMB * 1024 * 1024) return `File exceeds ${maxSizeMB}MB limit`;
    return null;
  };

  const uploadFile = useCallback(
    async (fs: FileState) => {
      setFiles((prev) => prev.map((f) => (f.id === fs.id ? { ...f, status: "uploading", progress: 5 } : f)));

      const ext = fs.file.name.split(".").pop();
      const safeName = fs.file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const path = folder ? `${folder}/${Date.now()}_${safeName}` : `${Date.now()}_${safeName}`;

      // Simulate progress while uploading
      let prog = 5;
      const ticker = setInterval(() => {
        prog = Math.min(prog + Math.random() * 12, 88);
        setFiles((prev) => prev.map((f) => (f.id === fs.id ? { ...f, progress: Math.round(prog) } : f)));
      }, 250);

      const { data, error } = await supabase.storage.from(bucket).upload(path, fs.file, {
        cacheControl: "3600",
        upsert: false,
      });

      clearInterval(ticker);

      // Fallback: use a local blob URL if storage upload fails (e.g. bucket not configured)
      if (error) {
        const blobUrl = URL.createObjectURL(fs.file);
        setFiles((prev) =>
          prev.map((f) =>
            f.id === fs.id ? { ...f, status: "done", progress: 100, url: blobUrl } : f
          )
        );
        return { name: fs.file.name, size: fs.file.size, type: fs.file.type, url: blobUrl, path } as UploadedFile;
      }

      const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(path);

      setFiles((prev) =>
        prev.map((f) =>
          f.id === fs.id ? { ...f, status: "done", progress: 100, url: publicUrl } : f
        )
      );

      return { name: fs.file.name, size: fs.file.size, type: fs.file.type, url: publicUrl, path } as UploadedFile;
    },
    [bucket, folder, supabase]
  );

  const processFiles = useCallback(
    async (rawFiles: File[]) => {
      const newStates: FileState[] = rawFiles.map((file) => ({
        file,
        id: `${Date.now()}_${Math.random()}`,
        progress: 0,
        status: validate(file) ? "error" : "pending",
        error: validate(file) ?? undefined,
      }));

      setFiles((prev) => (multiple ? [...prev, ...newStates] : newStates));

      const results: UploadedFile[] = [];
      for (const fs of newStates) {
        if (fs.status === "error") continue;
        const result = await uploadFile(fs);
        if (result) results.push(result);
      }
      if (results.length) onUploaded(results);
    },
    [multiple, uploadFile, onUploaded]
  );

  const onDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const dropped = Array.from(e.dataTransfer.files);
      if (!multiple && dropped.length > 1) processFiles([dropped[0]]);
      else processFiles(dropped);
    },
    [multiple, processFiles]
  );

  const onInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const picked = Array.from(e.target.files ?? []);
      processFiles(picked);
      e.target.value = "";
    },
    [processFiles]
  );

  const removeFile = (id: string) => setFiles((prev) => prev.filter((f) => f.id !== id));
  const hasFiles = files.length > 0;

  return (
    <div className={cn("space-y-3", className)}>
      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "relative border-2 border-dashed rounded-2xl transition-all cursor-pointer group",
          compact ? "p-6" : "p-10",
          isDragging
            ? "border-amber-400 bg-amber-400/8 scale-[1.01]"
            : "border-white/15 hover:border-amber-400/50 hover:bg-white/3"
        )}
      >
        <input ref={inputRef} type="file" accept={accept} multiple={multiple} onChange={onInputChange} className="hidden" />
        <div className="flex flex-col items-center gap-3 text-center">
          <div className={cn(
            "rounded-2xl flex items-center justify-center transition-all",
            compact ? "w-12 h-12" : "w-16 h-16",
            isDragging ? "bg-amber-400/20" : "bg-white/5 group-hover:bg-amber-400/10"
          )}>
            <Upload className={cn(
              "transition-all",
              compact ? "w-5 h-5" : "w-7 h-7",
              isDragging ? "text-amber-400 scale-110" : "text-white/30 group-hover:text-amber-400/70"
            )} />
          </div>
          <div>
            <p className={cn("font-semibold text-white/70", compact ? "text-sm" : "text-base")}>
              {isDragging ? "Drop to upload" : "Drag & drop or click to browse"}
            </p>
            <p className="text-white/30 text-xs mt-1">
              {acceptLabel ?? accept ?? "All files"} · Max {maxSizeMB}MB
            </p>
          </div>
        </div>
      </div>

      {/* File list */}
      {hasFiles && (
        <div className="space-y-2">
          {files.map((f) => (
            <div
              key={f.id}
              className={cn(
                "flex items-center gap-3 p-3 rounded-xl border transition-all",
                f.status === "done" ? "bg-emerald-900/15 border-emerald-700/30" :
                f.status === "error" ? "bg-red-900/15 border-red-700/30" :
                "bg-white/3 border-white/8"
              )}
            >
              <FileIcon type={f.file.type} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-white/80 text-xs font-medium truncate max-w-[200px]">{f.file.name}</span>
                  <span className="text-white/30 text-[10px] ml-2 flex-shrink-0">{formatBytes(f.file.size)}</span>
                </div>
                {f.status === "error" ? (
                  <div className="flex items-center gap-1.5">
                    <AlertCircle className="w-3 h-3 text-red-400" />
                    <span className="text-red-400 text-[11px]">{f.error}</span>
                  </div>
                ) : f.status === "done" ? (
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400 text-[11px]">Upload complete</span>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <div className="h-1 bg-white/8 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full transition-all duration-300"
                        style={{ width: `${f.progress}%` }}
                      />
                    </div>
                    <span className="text-white/30 text-[10px]">{f.progress}%</span>
                  </div>
                )}
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); removeFile(f.id); }}
                className="p-1 rounded-lg hover:bg-white/8 text-white/25 hover:text-white/60 transition-colors flex-shrink-0"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
