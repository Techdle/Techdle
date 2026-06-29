"use client";

import { X, ExternalLink } from 'lucide-react';
import type { GitHubRelease } from '@/lib/github';
import { format } from 'date-fns';
import Link from 'next/link';

interface WhatsNewModalProps {
  release: GitHubRelease;
  isOpen: boolean;
  onClose: () => void;
  onAcknowledge: () => void;
  showAllLink?: boolean;
}

/** Minimal GitHub-release-note markdown renderer — no external deps. */
export function SimpleMarkdown({ text }: { text: string }) {
  const lines = text.split('\n');

  const renderInline = (raw: string) => {
    // Split on bold, italic, inline-code, and links
    const parts: React.ReactNode[] = [];
    const regex = /(\*\*(.+?)\*\*|__(.+?)__|`(.+?)`|\[(.+?)\]\((.+?)\)|\*(.+?)\*|_(.+?)_)/g;
    let last = 0;
    let m: RegExpExecArray | null;
    let i = 0;
    while ((m = regex.exec(raw)) !== null) {
      if (m.index > last) parts.push(raw.slice(last, m.index));
      if (m[2] !== undefined) parts.push(<strong key={i++} className="text-text-main font-semibold">{m[2]}</strong>);
      else if (m[3] !== undefined) parts.push(<strong key={i++} className="text-text-main font-semibold">{m[3]}</strong>);
      else if (m[4] !== undefined) parts.push(<code key={i++} className="text-primary bg-primary/10 px-1 py-0.5 rounded text-sm font-mono">{m[4]}</code>);
      else if (m[5] !== undefined) parts.push(<a key={i++} href={m[6]} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{m[5]}</a>);
      else if (m[7] !== undefined) parts.push(<em key={i++}>{m[7]}</em>);
      else if (m[8] !== undefined) parts.push(<em key={i++}>{m[8]}</em>);
      last = m.index + m[0].length;
    }
    if (last < raw.length) parts.push(raw.slice(last));
    return parts;
  };

  const rendered: React.ReactNode[] = [];
  let i = 0;
  let inCode = false;
  const codeLines: string[] = [];

  for (const line of lines) {
    if (line.startsWith('```')) {
      if (!inCode) { inCode = true; continue; }
      inCode = false;
      rendered.push(
        <pre key={i++} className="bg-surface-raised border border-border rounded-lg p-3 my-2 overflow-x-auto text-sm font-mono text-text-muted">
          {codeLines.join('\n')}
        </pre>
      );
      codeLines.length = 0;
      continue;
    }
    if (inCode) { codeLines.push(line); continue; }

    if (line.startsWith('### ')) {
      rendered.push(<h3 key={i++} className="text-base font-bold text-text-main mt-4 mb-1">{renderInline(line.slice(4))}</h3>);
    } else if (line.startsWith('## ')) {
      rendered.push(<h2 key={i++} className="text-lg font-bold text-text-main mt-4 mb-2">{renderInline(line.slice(3))}</h2>);
    } else if (line.startsWith('# ')) {
      rendered.push(<h1 key={i++} className="text-xl font-bold text-text-main mt-4 mb-2">{renderInline(line.slice(2))}</h1>);
    } else if (/^[-*] /.test(line)) {
      rendered.push(<li key={i++} className="text-text-muted ml-4 list-disc">{renderInline(line.slice(2))}</li>);
    } else if (/^\d+\. /.test(line)) {
      rendered.push(<li key={i++} className="text-text-muted ml-4 list-decimal">{renderInline(line.replace(/^\d+\. /, ''))}</li>);
    } else if (/^---+$/.test(line.trim())) {
      rendered.push(<hr key={i++} className="border-border my-4" />);
    } else if (line.trim() === '') {
      rendered.push(<br key={i++} />);
    } else {
      rendered.push(<p key={i++} className="text-text-muted my-1">{renderInline(line)}</p>);
    }
  }

  return <div className="space-y-0.5">{rendered}</div>;
}

export function WhatsNewModal({ release, isOpen, onClose, onAcknowledge, showAllLink }: WhatsNewModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-surface border-t md:border border-border md:rounded-2xl shadow-2xl flex flex-col max-h-[90dvh] h-[85dvh] md:h-auto animate-in slide-in-from-bottom-full md:zoom-in-95 duration-300">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full text-text-muted hover:text-text-main hover:bg-surface-raised transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 border-b border-border flex-shrink-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-primary/10 text-primary border border-primary/20 text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              What&apos;s New
            </span>
            <span className="text-text-muted text-sm font-mono">{release.tag_name}</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-text-main">
            {release.name || release.tag_name}
          </h2>
          <div className="flex items-center justify-between mt-2">
            <p className="text-sm text-text-muted">
              Published on {format(new Date(release.published_at), 'MMMM d, yyyy')}
            </p>
            <a
              href={release.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline text-sm flex items-center gap-1 font-medium"
            >
              View on GitHub <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        <div className="p-6 overflow-y-auto flex-grow">
          <SimpleMarkdown text={release.body || '_No release notes provided._'} />
        </div>

        <div className="p-6 border-t border-border flex-shrink-0 flex flex-col sm:flex-row gap-3 items-center justify-end bg-surface-raised/50 md:rounded-b-2xl">
          {showAllLink && (
            <Link
              href="/settings"
              onClick={onClose}
              className="w-full sm:w-auto mr-auto text-center sm:text-left text-sm font-bold text-text-muted hover:text-text-main transition-colors py-2"
            >
              See all releases
            </Link>
          )}
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 bg-surface-raised border border-border hover:bg-border text-text-main font-bold rounded-xl transition-colors shadow-sm"
          >
            Close
          </button>
          <button
            onClick={onAcknowledge}
            className="w-full sm:w-auto px-6 py-2.5 bg-primary hover:bg-primary/90 text-background font-bold rounded-xl transition-all shadow-sm shadow-primary/20 hover:scale-105 active:scale-95"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
