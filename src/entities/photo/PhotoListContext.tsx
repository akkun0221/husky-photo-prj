"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { useStore } from "zustand";
import { createPhotoListStore, type PhotoListStore } from "./store";
import type { Photo } from "./types";

type StoreApi = ReturnType<typeof createPhotoListStore>;

const PhotoListContext = createContext<StoreApi | null>(null);

type Props = {
  photos: Photo[];
  hasMore: boolean;
  children: ReactNode;
};

export function PhotoListProvider({ photos, hasMore, children }: Props) {
  const [store] = useState(() => createPhotoListStore({ photos, hasMore }));
  return (
    <PhotoListContext.Provider value={store}>
      {children}
    </PhotoListContext.Provider>
  );
}

export function usePhotoListStore<T>(selector: (s: PhotoListStore) => T): T {
  const store = useContext(PhotoListContext);
  if (!store)
    throw new Error("usePhotoListStore must be used within PhotoListProvider");
  return useStore(store, selector);
}
