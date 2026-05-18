import { createStore } from "zustand";
import type { Photo } from "./types";

type PhotoListState = {
  photos: Photo[];
  page: number;
  hasMore: boolean;
  loading: boolean;
};

type PhotoListActions = {
  init: (photos: Photo[], hasMore: boolean) => void;
  append: (photos: Photo[]) => void;
  nextPage: () => void;
  setLoading: (v: boolean) => void;
  setHasMore: (v: boolean) => void;
  setPhotos: (photos: Photo[]) => void;
};

export type PhotoListStore = PhotoListState & PhotoListActions;

type StoreInit = Pick<PhotoListState, "photos" | "hasMore">;

export function createPhotoListStore({ photos, hasMore }: StoreInit) {
  return createStore<PhotoListStore>()((set) => ({
    photos,
    page: 1,
    hasMore,
    loading: false,
    init: (photos, hasMore) =>
      set({ photos, page: 1, hasMore, loading: false }),
    append: (more) => set((s) => ({ photos: [...s.photos, ...more] })),
    nextPage: () => set((s) => ({ page: s.page + 1 })),
    setLoading: (loading) => set({ loading }),
    setHasMore: (hasMore) => set({ hasMore }),
    setPhotos: (photos) => set({ photos }),
  }));
}
