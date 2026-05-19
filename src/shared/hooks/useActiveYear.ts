import { useEffect, useState, type RefObject } from "react";

export function useActiveYear(
  nodeMap: RefObject<Record<string, HTMLElement | null>>,
  defaultYear: string,
): string {
  const [active, setActive] = useState(defaultYear);

  useEffect(() => {
    const handler = () => {
      const map = nodeMap.current;
      if (!map) return;
      let best: string | null = null;
      let bestDist = Infinity;
      for (const [year, el] of Object.entries(map)) {
        if (!el) continue;
        const d = Math.abs(el.getBoundingClientRect().top - 56);
        if (d < bestDist) {
          bestDist = d;
          best = year;
        }
      }
      if (best) setActive(best);
    };
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, [nodeMap]);

  return active;
}
