export interface TopBorrowedBookItem {
  bookId: number;
  title: string;
  loanCount: number;
}

export interface LoansPerMonthItem {
  yearMonth: string;
  count: number;
}

export interface FinesSummaryResponse {
  totalUnpaidXaf: number;
  unpaidCount: number;
  totalPaidXaf: number;
  paidCount: number;
}
