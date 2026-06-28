"use client";

import { useEffect, useRef } from 'react';

interface AdBannerProps {
  dataAdSlot: string;
  orientation?: 'horizontal' | 'vertical';
}

export function AdBanner({ dataAdSlot, orientation = 'horizontal' }: AdBannerProps) {
  const isLoaded = useRef(false);

  useEffect(() => {
    if (isLoaded.current) return;
    
    try {
      // @ts-expect-error - adsbygoogle is injected by the AdSense script
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      isLoaded.current = true;
    } catch (err) {
      console.error('AdSense error:', err);
    }
  }, []);

  const isVertical = orientation === 'vertical';

  if (dataAdSlot.includes('REPLACE_WITH')) {
    return null;
  }

  return (
    <div className={`w-full flex justify-center overflow-hidden ${isVertical ? 'my-0' : 'my-6'}`}>
      <ins
        className="adsbygoogle"
        style={{ 
          display: 'block', 
          width: '100%',
          height: isVertical ? '600px' : 'auto'
        }}
        data-ad-client="ca-pub-4116593263812421"
        data-ad-slot={dataAdSlot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
