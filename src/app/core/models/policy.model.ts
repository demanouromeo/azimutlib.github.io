import { Role } from './user.model';

export interface LibraryPolicy {
  id: number;
  role: Role;
  loanDurationDays: number;
  maxConcurrentLoans: number;
  maxRenewals: number;
  finePerDayXaf: number;
}

export interface UpdateLibraryPolicyRequest {
  loanDurationDays: number;
  maxConcurrentLoans: number;
  maxRenewals: number;
  finePerDayXaf: number;
}
