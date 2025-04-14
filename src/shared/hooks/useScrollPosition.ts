// src/shared/hooks/useScrollPosition.ts
import { useState, useEffect } from 'react';

const useScrollPosition = () => {
  const [scrollPosition, setScrollPosition] = useState({
    x: 0,
    y: 0,
    direction: 'none' as 'up' | 'down' | 'none',
    lastY: 0,
  });

  useEffect(() => {
    let ticking = false;
    let lastScrollY = window.scrollY;

    const updateScrollPosition = () => {
      const currentScrollY = window.scrollY;
      const direction = currentScrollY > lastScrollY ? 'down' : 'up';
      
      setScrollPosition({
        x: window.scrollX,
        y: currentScrollY,
        direction: currentScrollY !== lastScrollY ? direction : 'none',
        lastY: lastScrollY,
      });

      lastScrollY = currentScrollY;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollPosition);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll);

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return scrollPosition;
};

export default useScrollPosition;