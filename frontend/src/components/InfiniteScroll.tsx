import { useRef, useEffect } from 'react';

type InfiniteScrollProps = {
  fetchMoreData: () => void;
};
export const InfiniteScroll = ({ fetchMoreData }: InfiniteScrollProps) => {
  const marker = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        fetchMoreData();
      }
    });

    if (marker.current) {
      observer.observe(marker.current);
    }

    return () => observer.disconnect();
  }, [fetchMoreData]);

  return (
    // Your content here
    <div ref={marker}></div>
  );
};
