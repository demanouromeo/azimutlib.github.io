export interface Book {
  id: number;
  isbn: string | null;
  title: string;
  authors: string;
  publisher: string | null;
  publicationYear: number | null;
  categoryName: string | null;
  language: string;
  description: string | null;
  coverUrl: string | null;
  availableCopies: number;
  totalCopies: number;
}

export type CopyStatus = 'AVAILABLE' | 'BORROWED' | 'RESERVED' | 'LOST' | 'DAMAGED' | 'IN_REPAIR';

export interface BookCopy {
  id: number;
  bookId: number;
  bookTitle: string;
  inventoryCode: string;
  status: CopyStatus;
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}
