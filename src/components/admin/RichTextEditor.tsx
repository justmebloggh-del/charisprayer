"use client";

import { useRef, useEffect, useCallback } from "react";
import {
  Bold, Italic, Underline, Heading1, Heading2, List, ListOrdered,
  Quote, Link, Image, AlignLeft, AlignCenter, Minus, Undo, Redo
} from "lucide-react";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: number;
  className?: string;
}

interface ToolbarButton {
  icon: React.ReactNode;
  label: string;
  action: () => void;
  active?: boolean;
}

function ToolBtn({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      title={label}
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      className="w-8 h-8 flex items-center justify-center rounded-lg text-white/50 hover:text-white hover:bg-white/8 transition-all text-sm"
    >
      {icon}
    </button>
  );
}

function ToolDivider() {
  return <div className="w-px h-5 bg-white/10 mx-0.5" />;
}

export function RichTextEditor({ value, onChange, placeholder = "Start writing...", minHeight = 280, className }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const isInitialized = useRef(false);

  useEffect(() => {
    if (editorRef.current && !isInitialized.current) {
      editorRef.current.innerHTML = value || "";
      isInitialized.current = true;
    }
  }, []);

  const exec = useCallback((cmd: string, value?: string) => {
    document.execCommand(cmd, false, value);
    editorRef.current?.focus();
    if (editorRef.current) onChange(editorRef.current.innerHTML);
  }, [onChange]);

  const insertLink = useCallback(() => {
    const url = prompt("Enter URL:");
    if (url) exec("createLink", url);
  }, [exec]);

  const insertImage = useCallback(() => {
    const url = prompt("Enter image URL:");
    if (url) exec("insertImage", url);
  }, [exec]);

  const insertHR = useCallback(() => {
    exec("insertHorizontalRule");
  }, [exec]);

  const wrapBlock = useCallback((tag: string) => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    const range = sel.getRangeAt(0);
    const el = document.createElement(tag);
    try {
      range.surroundContents(el);
    } catch {
      el.appendChild(range.extractContents());
      range.insertNode(el);
    }
    sel.removeAllRanges();
    if (editorRef.current) onChange(editorRef.current.innerHTML);
  }, [onChange]);

  const tools: (ToolbarButton | "divider" | "break")[] = [
    { icon: <Undo className="w-3.5 h-3.5" />, label: "Undo", action: () => exec("undo") },
    { icon: <Redo className="w-3.5 h-3.5" />, label: "Redo", action: () => exec("redo") },
    "divider",
    { icon: <Heading1 className="w-4 h-4" />, label: "Heading 1", action: () => exec("formatBlock", "h1") },
    { icon: <Heading2 className="w-4 h-4" />, label: "Heading 2", action: () => exec("formatBlock", "h2") },
    { icon: <span className="font-bold text-[13px] font-serif">H3</span>, label: "Heading 3", action: () => exec("formatBlock", "h3") },
    "divider",
    { icon: <Bold className="w-3.5 h-3.5" />, label: "Bold", action: () => exec("bold") },
    { icon: <Italic className="w-3.5 h-3.5" />, label: "Italic", action: () => exec("italic") },
    { icon: <Underline className="w-3.5 h-3.5" />, label: "Underline", action: () => exec("underline") },
    "divider",
    { icon: <List className="w-4 h-4" />, label: "Bullet List", action: () => exec("insertUnorderedList") },
    { icon: <ListOrdered className="w-4 h-4" />, label: "Numbered List", action: () => exec("insertOrderedList") },
    { icon: <Quote className="w-4 h-4" />, label: "Blockquote", action: () => exec("formatBlock", "blockquote") },
    "divider",
    { icon: <AlignLeft className="w-3.5 h-3.5" />, label: "Align Left", action: () => exec("justifyLeft") },
    { icon: <AlignCenter className="w-3.5 h-3.5" />, label: "Center", action: () => exec("justifyCenter") },
    "divider",
    { icon: <Link className="w-3.5 h-3.5" />, label: "Insert Link", action: insertLink },
    { icon: <Image className="w-3.5 h-3.5" />, label: "Insert Image", action: insertImage },
    { icon: <Minus className="w-3.5 h-3.5" />, label: "Divider", action: insertHR },
  ];

  return (
    <div className={cn("border border-white/12 rounded-2xl overflow-hidden bg-white/3 focus-within:border-amber-400/40 transition-colors", className)}>
      {/* Toolbar */}
      <div className="flex items-center flex-wrap gap-0.5 p-2 border-b border-white/8 bg-white/2">
        {tools.map((t, i) => {
          if (t === "divider") return <ToolDivider key={`d${i}`} />;
          if (t === "break") return <div key={`b${i}`} className="w-full" />;
          const tool = t as ToolbarButton;
          return <ToolBtn key={tool.label} icon={tool.icon} label={tool.label} onClick={tool.action} />;
        })}
      </div>

      {/* Editor */}
      <div className="relative">
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={() => { if (editorRef.current) onChange(editorRef.current.innerHTML); }}
          className="outline-none p-5 text-white/80 text-sm leading-relaxed min-h-[280px] prose-editor"
          style={{ minHeight }}
          data-placeholder={placeholder}
        />
        <style>{`
          [contenteditable]:empty:before {
            content: attr(data-placeholder);
            color: rgba(255,255,255,0.2);
            pointer-events: none;
            position: absolute;
            top: 20px;
            left: 20px;
          }
          .prose-editor h1 { font-size: 1.75rem; font-weight: 700; color: white; margin: 1rem 0 0.5rem; font-family: 'Cormorant Garamond', Georgia, serif; }
          .prose-editor h2 { font-size: 1.375rem; font-weight: 700; color: white; margin: 0.875rem 0 0.4rem; }
          .prose-editor h3 { font-size: 1.125rem; font-weight: 600; color: white; margin: 0.75rem 0 0.35rem; }
          .prose-editor p { margin: 0.5rem 0; }
          .prose-editor strong, .prose-editor b { color: white; font-weight: 700; }
          .prose-editor em, .prose-editor i { color: rgba(255,255,255,0.75); }
          .prose-editor a { color: #C9A227; text-decoration: underline; }
          .prose-editor ul { list-style: disc; padding-left: 1.5rem; margin: 0.5rem 0; }
          .prose-editor ol { list-style: decimal; padding-left: 1.5rem; margin: 0.5rem 0; }
          .prose-editor li { margin: 0.25rem 0; }
          .prose-editor blockquote { border-left: 3px solid #C9A227; padding-left: 1rem; margin: 0.75rem 0; color: rgba(255,255,255,0.6); font-style: italic; }
          .prose-editor hr { border: none; border-top: 1px solid rgba(255,255,255,0.1); margin: 1rem 0; }
          .prose-editor img { max-width: 100%; border-radius: 8px; margin: 0.5rem 0; }
        `}</style>
      </div>

      {/* Word count footer */}
      <div className="px-4 py-2 border-t border-white/6 flex justify-between items-center">
        <span className="text-white/20 text-xs">Rich text · Supports headings, lists, links, images</span>
        <span className="text-white/20 text-xs">
          {editorRef.current?.innerText?.trim().split(/\s+/).filter(Boolean).length ?? 0} words
        </span>
      </div>
    </div>
  );
}
