import { useEffect, useState } from 'react';
import { fromEvent, merge, of } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

export interface windowSize {
  width: number;
  height: number;
}

export function useWindowSize() {
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    // Register event listener (as subscription)
    const resize$ = fromEvent(window, 'resize').pipe(debounceTime(200));
    const sub = merge(of('initial'), resize$).subscribe(() => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setWindowSize({ width, height });
    });

    // Cleanup, unsubscribe
    return () => sub.unsubscribe();
  }, []); // Empty array ensures that effect is only run on mount

  return windowSize;
}
