export type LoanStatus = 'ACTIVE' | 'RETURNED' | 'OVERDUE' | 'LOST';
export type ReturnOutcome = 'NORMAL' | 'LOST' | 'DAMAGED';

export interface Loan {
  id: number;
  bookId: number;
  bookTitle: string;
  inventoryCode: string;
  borrowerId: number;
  borrowerName: string;
  borrowDate: string;
  dueDate: string;
  returnDate: string | null;
  status: LoanStatus;
  renewalCount: number;
}

export type ReservationStatus = 'PENDING' | 'FULFILLED' | 'CANCELLED' | 'EXPIRED';

export interface Reservation {
  id: number;
  bookId: number;
  bookTitle: string;
  status: ReservationStatus;
  reservedAt: string;
  expiresAt: string | null;
}

export type FineType = 'LATE' | 'LOST' | 'DAMAGE' | 'MANUAL';

export interface Fine {
  id: number;
  loanId: number | null;
  userId: number;
  userName: string;
  type: FineType;
  amountXaf: number;
  reason: string;
  paid: boolean;
  paidAt: string | null;
}
