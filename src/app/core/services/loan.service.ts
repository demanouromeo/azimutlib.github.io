import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Loan, ReturnOutcome } from '../models/loan.model';

@Injectable({ providedIn: 'root' })
export class LoanService {
  private readonly baseUrl = `${environment.apiBaseUrl}/loans`;

  constructor(private readonly http: HttpClient) {}

  myLoans(): Observable<Loan[]> {
    return this.http.get<Loan[]>(`${this.baseUrl}/my`);
  }

  loansForUser(userId: number): Observable<Loan[]> {
    return this.http.get<Loan[]>(`${this.baseUrl}/user/${userId}`);
  }

  activeLoans(): Observable<Loan[]> {
    return this.http.get<Loan[]>(`${this.baseUrl}/active`);
  }

  activeLoanByCode(inventoryCode: string): Observable<Loan> {
    return this.http.get<Loan>(`${this.baseUrl}/active-by-code/${inventoryCode}`);
  }

  issue(inventoryCode: string, borrowerMatricule: string): Observable<Loan> {
    return this.http.post<Loan>(this.baseUrl, { inventoryCode, borrowerMatricule });
  }

  returnLoan(loanId: number): Observable<Loan> {
    return this.http.post<Loan>(`${this.baseUrl}/${loanId}/return`, {});
  }

  returnByCode(inventoryCode: string, outcome: ReturnOutcome, feeXaf?: number): Observable<Loan> {
    return this.http.post<Loan>(`${this.baseUrl}/return-by-code`, { inventoryCode, outcome, feeXaf });
  }

  renew(loanId: number): Observable<Loan> {
    return this.http.post<Loan>(`${this.baseUrl}/${loanId}/renew`, {});
  }
}
