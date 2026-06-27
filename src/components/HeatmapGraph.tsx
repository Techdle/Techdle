import { ArchiveResult } from '@/types/game';
import { eachDayOfInterval, subDays, format, getDay } from 'date-fns';
import { useRef, useEffect } from 'react';

interface HeatmapGraphProps {
  archiveResults: ArchiveResult[];
  todayStr: string;
}

export function HeatmapGraph({ archiveResults, todayStr }: HeatmapGraphProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (scrollRef.current) {
      // Use a small timeout to ensure layout is fully calculated before scrolling
      setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
        }
      }, 10);
    }
  }, [archiveResults]);

  const today = new Date(todayStr + 'T00:00:00Z');
  // Generate 52 weeks (364 days ago)
  const startDate = subDays(today, 364); 
  const days = eachDayOfInterval({ start: startDate, end: today });

  // Map results by date
  const resultMap = new Map<string, ArchiveResult>();
  archiveResults.forEach(r => resultMap.set(r.date, r));

  // Group days by week. First column might be padded to start on Sunday.
  const weeks: Date[][] = [];
  let currentWeek: Date[] = [];
  
  days.forEach(d => {
    if (currentWeek.length === 0 && getDay(d) !== 0) {
      for (let i = 0; i < getDay(d); i++) {
        currentWeek.push(new Date(0));
      }
    }
    currentWeek.push(d);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });
  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }

  const getHeatmapColor = (result?: ArchiveResult) => {
    if (!result) return 'bg-surface-raised border border-transparent';
    if (result.status === 'lost') return 'bg-error/80 border border-transparent';
    
    if (result.solvedOnTime === false) {
      return 'bg-transparent border-[1.5px] border-success/80';
    }

    if (result.guessesCount === 1) return 'bg-success border border-transparent';
    if (result.guessesCount <= 3) return 'bg-success/80 border border-transparent';
    if (result.guessesCount <= 5) return 'bg-success/60 border border-transparent';
    return 'bg-success/40 border border-transparent';
  };

  let currentMonth = '';

  return (
    <div className="bg-surface rounded-xl p-4 sm:p-6 border border-border mb-12 flex flex-col w-full">
      <h3 className="text-xl font-semibold mb-4">History</h3>
      
      <div className="flex gap-2 max-w-full">
        {/* Y-Axis Labels */}
        <div className="flex flex-col gap-1 text-[10px] sm:text-xs text-text-muted mt-5 pr-1">
          <span className="h-3 leading-3 opacity-0">Sun</span>
          <span className="h-3 leading-3">Mon</span>
          <span className="h-3 leading-3 opacity-0">Tue</span>
          <span className="h-3 leading-3">Wed</span>
          <span className="h-3 leading-3 opacity-0">Thu</span>
          <span className="h-3 leading-3">Fri</span>
          <span className="h-3 leading-3 opacity-0">Sat</span>
        </div>

        {/* Scrollable Graph Area */}
        <div ref={scrollRef} className="flex-1 overflow-x-auto pb-4 custom-scrollbar">
          <div className="inline-flex flex-col min-w-max pr-2">
            {/* Months Row */}
            <div className="flex gap-1 mb-1 h-4">
              {weeks.map((week, wIdx) => {
                const firstValidDay = week.find(d => d.getTime() > 0);
                let m = '';
                if (firstValidDay) {
                  const monthName = format(firstValidDay, 'MMM');
                  if (monthName !== currentMonth) {
                    m = monthName;
                    currentMonth = monthName;
                  }
                }
                return (
                  <div key={`m-${wIdx}`} className="w-3 relative">
                    {m && <span className="absolute -left-1 text-[10px] leading-4 text-text-muted">{m}</span>}
                  </div>
                );
              })}
            </div>

            {/* Grid */}
            <div className="flex gap-1">
              {weeks.map((week, wIdx) => (
                <div key={`w-${wIdx}`} className="flex flex-col gap-1">
                  {week.map((day, dIdx) => {
                    if (day.getTime() === 0) {
                      return <div key={`empty-${wIdx}-${dIdx}`} className="w-3 h-3 bg-transparent rounded-[2px]" />;
                    }
                    const dateStr = format(day, 'yyyy-MM-dd');
                    const res = resultMap.get(dateStr);
                    const colorClass = getHeatmapColor(res);
                    
                    return (
                      <div
                        key={dateStr}
                        title={`${dateStr}${res ? ` - ${res.status === 'won' ? `${res.guessesCount} guesses` : 'Failed'}` : ''}`}
                        className={`w-3 h-3 rounded-[2px] ${colorClass} transition-colors hover:ring-2 hover:ring-primary flex-shrink-0 cursor-default`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-end gap-2 text-xs text-text-muted">
        <span className="mr-2 flex items-center gap-1" title="Played on a different day">
          <div className="w-3 h-3 rounded-[2px] bg-transparent border-[1.5px] border-success/80" /> Archive Play
        </span>
        <span className="mr-2 flex items-center gap-1" title="Failed to solve">
          <div className="w-3 h-3 rounded-[2px] bg-error/80 border border-transparent" /> Failed
        </span>
        <span className="ml-2">More Guesses</span>
        <div className="w-3 h-3 rounded-[2px] bg-success/40 border border-transparent" title="6 guesses" />
        <div className="w-3 h-3 rounded-[2px] bg-success/60 border border-transparent" title="4-5 guesses" />
        <div className="w-3 h-3 rounded-[2px] bg-success/80 border border-transparent" title="2-3 guesses" />
        <div className="w-3 h-3 rounded-[2px] bg-success border border-transparent" title="1 guess (Perfect)" />
        <span>Fewer Guesses</span>
      </div>
    </div>
  );
}
