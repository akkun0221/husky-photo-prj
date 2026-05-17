export type Live = {
  id: string;
  date: string;
  venue: string;
  title: string;
  description: string | null;
  thumbnail_photo_id: string | null;
};

export type LiveWithPhotoFlag = Live & { hasPhotos: boolean };

export type LiveWithPhotoCount = Live & {
  hasPhotos: boolean;
  photoCount: number;
  weekday: string;
  thumbnailUrl: string | null;
  photoUrls: string[];
};

export type CreateLiveInput = Omit<Live, "id">;
export type UpdateLiveInput = Partial<CreateLiveInput>;
