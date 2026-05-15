export type Photo = {
  id: string;
  live_id: string;
  member_id: string;
  r2_url: string;
  thumbnail_url: string;
  width: number | null;
  height: number | null;
};

export type CreatePhotoInput = Omit<Photo, "id">;

export type PhotoWithLiveDate = Photo & { lives: { date: string } };
