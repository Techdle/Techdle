"use client";

import { useState, useEffect } from 'react';
import type { GitHubRelease } from '@/lib/github';
import { format } from 'date-fns';
import { ChevronDown, ChevronUp, BellRing, Loader2, ArrowRight } from 'lucide-react';
import { WhatsNewModal, SimpleMarkdown } from './WhatsNewModal';
import Link from 'next/link';

interface ChangelogProps {
  latestOnly?: boolean;
  isFullPage?: boolean;
}

export function Changelog({ latestOnly = false, isFullPage = false }: ChangelogProps) {
  const [releases, setReleases] = useState<GitHubRelease[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedTag, setExpandedTag] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetch('/api/releases')
      .then((res) => (res.ok ? res.json() : []))
      .then((data: GitHubRelease[]) => {
        setReleases(data);
        if (data.length > 0 && isFullPage) setExpandedTag(data[0].tag_name);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isFullPage]);

  if (loading) {
    return (
      <div className="bg-surface border border-border p-8 rounded-2xl shadow-sm flex items-center justify-center gap-3">
        <Loader2 className="w-5 h-5 animate-spin text-text-muted" />
        <span className="text-text-muted text-sm">Loading changelog...</span>
      </div>
    );
  }

  if (releases.length === 0) {
    return (
      <div className="bg-surface border border-border p-8 rounded-2xl shadow-sm text-center">
        <div className="w-12 h-12 bg-surface-raised rounded-full flex items-center justify-center mx-auto mb-4">
          <BellRing className="w-6 h-6 text-text-muted" />
        </div>
        <h3 className="text-xl font-bold text-text-main mb-2">No updates yet</h3>
        <p className="text-text-muted">Check back later for new features and improvements.</p>
      </div>
    );
  }

  const latestRelease = releases[0];
  const displayReleases = latestOnly ? [latestRelease] : releases;

  return (
    <div className={`bg-surface border border-border rounded-2xl shadow-sm overflow-hidden flex flex-col ${isFullPage ? 'shadow-md border-border/50' : ''}`}>
      {!isFullPage && (
        <div className="p-6 border-b border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
              <BellRing className="w-5 h-5 text-primary" />
              Latest Release
            </h2>
            <p className="text-text-muted text-sm mt-1">See what's new in Techdle.</p>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-xl transition-colors font-bold text-sm"
          >
            View Notes
          </button>
        </div>
      )}

      <div className="divide-y divide-border">
        {displayReleases.map((release, index) => {
          const isExpanded = expandedTag === release.tag_name;
          const isLatest = index === 0 && !latestOnly;

          return (
            <div key={release.tag_name} className="flex flex-col">
              <button
                onClick={() => setExpandedTag(isExpanded ? null : release.tag_name)}
                className={`p-6 flex items-start gap-4 hover:bg-surface-raised transition-colors text-left w-full ${!isFullPage && latestOnly ? 'cursor-default pointer-events-none hover:bg-surface' : ''}`}
              >
                <div className="flex-grow min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-bold text-text-main text-lg">{release.name || release.tag_name}</span>
                    {isLatest && (
                      <span className="bg-primary text-background text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                        Latest
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-text-muted">
                    <span className="font-mono bg-surface-raised px-1.5 py-0.5 rounded text-xs border border-border">{release.tag_name}</span>
                    <span>&middot;</span>
                    <span>{format(new Date(release.published_at), 'MMM d, yyyy')}</span>
                  </div>
                </div>
                {(!latestOnly) && (
                  <div className="p-2 text-text-muted bg-surface-raised rounded-lg border border-border">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                )}
              </button>

              {(isExpanded || latestOnly) && (
                <div className="px-6 pb-6 pt-2 animate-in slide-in-from-top-2 fade-in duration-200">
                  <div className="py-2">
                    <SimpleMarkdown text={release.body || ''} />
                  </div>
                  {isFullPage && (
                    <div className="mt-6 pt-4 border-t border-border flex justify-end">
                      <a
                        href={release.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline text-sm font-bold flex items-center gap-1"
                      >
                        View full release on GitHub
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {latestOnly && (
        <div className="p-4 border-t border-border bg-surface-raised/30 flex justify-center">
          <Link
            href="/changelog"
            className="flex items-center gap-2 text-primary font-bold text-sm hover:underline hover:text-primary-hover transition-colors"
          >
            View Full Changelog Archive <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {latestRelease && !latestOnly && (
        <WhatsNewModal
          release={latestRelease}
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onAcknowledge={() => setModalOpen(false)}
          showAllLink={false}
        />
      )}
    </div>
  );
}
