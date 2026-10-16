// src/pages/entities/page.entity.ts
export class Page {
  id: string;
  subjectId: string;
  title: string;
  content: string;
  position: number;
  isFavorite: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}