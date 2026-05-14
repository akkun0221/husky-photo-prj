"use client";

import { useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  photos: { r2_url: string }[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
};

export function Lightbox({ photos, index, onClose, onPrev, onNext }: Props) {
  const photo = photos[index];

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose, onPrev, onNext]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
      onClick={onClose}
    >
      <button
        className="absolute top-4 right-4 rounded-full p-2 text-white hover:bg-white/10"
        onClick={onClose}
        aria-label="閉じる"
      >
        <X className="h-6 w-6" />
      </button>

      {index > 0 && (
        <button
          className="absolute left-4 rounded-full p-2 text-white hover:bg-white/10"
          onClick={(e) => {
            e.stopPropagation();
            onPrev();
          }}
          aria-label="前の写真"
        >
          <ChevronLeft className="h-8 w-8" />
        </button>
      )}

      <img
        src={photo.r2_url}
        alt=""
        className="max-h-[90vh] max-w-[90vw] object-contain"
        onClick={(e) => e.stopPropagation()}
      />

      {index < photos.length - 1 && (
        <button
          className="absolute right-4 rounded-full p-2 text-white hover:bg-white/10"
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          aria-label="次の写真"
        >
          <ChevronRight className="h-8 w-8" />
        </button>
      )}
    </div>
  );
}
