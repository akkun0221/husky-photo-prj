import { useCallback, useRef } from "react";

type SwipeHandlers = {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
};

const THRESHOLD = 50;

export function useSwipe({ onSwipeLeft, onSwipeRight }: SwipeHandlers) {
  const startX = useRef<number | null>(null);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
  }, []);

  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (startX.current === null) return;
      const deltaX = e.changedTouches[0].clientX - startX.current;
      startX.current = null;

      if (deltaX < -THRESHOLD) onSwipeLeft?.();
      else if (deltaX > THRESHOLD) onSwipeRight?.();
    },
    [onSwipeLeft, onSwipeRight],
  );

  return { onTouchStart, onTouchEnd };
}
