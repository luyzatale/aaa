"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
  textareaClassName?: string;
  id?: string;
  autoFocus?: boolean;
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}

function applyFormat(
  textarea: HTMLTextAreaElement,
  value: string,
  marker: string,
  onChange: (v: string) => void
) {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selected = value.slice(start, end);
  const wrapped = `${value.slice(0, start)}${marker}${selected || "text"}${marker}${value.slice(end)}`;
  onChange(wrapped);
  requestAnimationFrame(() => {
    const s = start + marker.length;
    textarea.setSelectionRange(s, s + (selected || "text").length);
    textarea.focus();
  });
}

export function RichTextEditor({
  value,
  onChange,
  placeholder,
  rows = 4,
  textareaClassName,
  id,
  autoFocus,
  onKeyDown,
}: RichTextEditorProps) {
  const ref = useRef<HTMLTextAreaElement>(null);

  const fmt = (marker: string) => {
    if (ref.current) applyFormat(ref.current, value, marker, onChange);
  };

  return (
    <div>
      <div className="flex items-center gap-0.5 mb-1.5 px-0.5">
        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); fmt("**"); }}
          className="w-7 h-7 rounded-lg text-xs font-bold text-[var(--text-secondary)] hover:bg-[var(--bg-muted)] transition-calm focus-visible:outline-none"
          aria-label="Bold"
          title="Bold"
        >B</button>
        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); fmt("_"); }}
          className="w-7 h-7 rounded-lg text-xs italic text-[var(--text-secondary)] hover:bg-[var(--bg-muted)] transition-calm focus-visible:outline-none"
          aria-label="Italic"
          title="Italic"
        >I</button>
        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); fmt("=="); }}
          className="w-7 h-7 rounded-lg text-xs text-[var(--text-secondary)] hover:bg-[var(--bg-muted)] transition-calm focus-visible:outline-none"
          aria-label="Highlight"
          title="Highlight"
        ><span className="bg-yellow-200 dark:bg-yellow-600/50 px-1 rounded">H</span></button>
      </div>
      <textarea
        ref={ref}
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        autoFocus={autoFocus}
        onKeyDown={onKeyDown}
        className={textareaClassName}
      />
    </div>
  );
}

export function RichTextRenderer({ text, className }: { text: string; className?: string }) {
  const regex = /(\*\*(.+?)\*\*|_(.+?)_|==(.+?)==)/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(<span key={key++}>{text.slice(lastIndex, match.index)}</span>);
    }
    if (match[0].startsWith("**")) {
      parts.push(<strong key={key++}>{match[2]}</strong>);
    } else if (match[0].startsWith("_")) {
      parts.push(<em key={key++}>{match[3]}</em>);
    } else if (match[0].startsWith("==")) {
      parts.push(
        <mark key={key++} className="bg-yellow-200 dark:bg-yellow-700/40 rounded-sm px-0.5 not-italic">
          {match[4]}
        </mark>
      );
    }
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    parts.push(<span key={key++}>{text.slice(lastIndex)}</span>);
  }

  return (
    <p className={cn("text-sm text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap", className)}>
      {parts}
    </p>
  );
}
