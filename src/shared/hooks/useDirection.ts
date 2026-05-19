"use client";
import { useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export type Direction = "forward" | "reverse";

export function useDirection(): [Direction, (d: Direction) => void] {
  const searchParams = useSearchParams();
  const router = useRouter();
  const direction: Direction =
    searchParams.get("dir") === "reverse" ? "reverse" : "forward";

  const setDirection = useCallback(
    (d: Direction) => {
      const params = new URLSearchParams(searchParams.toString());
      if (d === "reverse") {
        params.set("dir", "reverse");
      } else {
        params.delete("dir");
      }
      router.replace(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  return [direction, setDirection];
}
