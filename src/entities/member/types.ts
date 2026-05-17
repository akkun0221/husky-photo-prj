export type Member = {
  id: string;
  name: string;
  color: string;
};

export type MemberWithPhotoCount = Member & {
  photoCount: number;
};
