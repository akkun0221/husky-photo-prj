export type Live = {
  id: string;
  date: string;
  venue: string;
  title: string;
  description: string | null;
  thumbnail_photo_id: string | null;
};

export type CreateLiveInput = Omit<Live, "id">;
export type UpdateLiveInput = Partial<CreateLiveInput>;
