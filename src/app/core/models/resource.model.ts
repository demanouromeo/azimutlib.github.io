export type ResourceType = 'QUIZ' | 'NOTES' | 'DOCUMENT' | 'VIDEO' | 'THESIS' | 'EXAM_PAPER';

export interface TeachingResource {
  id: number;
  title: string;
  description: string | null;
  author: string | null;
  academicYear: string | null;
  type: ResourceType;
  categoryId: number;
  categoryName: string;
  uploadedById: number;
  uploadedByName: string;
  originalFilename: string;
  contentType: string | null;
  fileSizeBytes: number;
  createdAt: string;
}

export interface ResourceCategory {
  id: number;
  name: string;
  description: string | null;
}
