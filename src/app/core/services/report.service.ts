import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Loan } from '../models/loan.model';
import { FinesSummaryResponse, LoansPerMonthItem, TopBorrowedBookItem } from '../models/report.model';

@Injectable({ providedIn: 'root' })
export class ReportService {
  private readonly baseUrl = `${environment.apiBaseUrl}/reports`;

  constructor(private readonly http: HttpClient) {}

  overdueLoans(): Observable<Loan[]> {
    return this.http.get<Loan[]>(`${this.baseUrl}/overdue-loans`);
  }

  topBorrowedBooks(limit = 10): Observable<TopBorrowedBookItem[]> {
    const params = new HttpParams().set('limit', limit);
    return this.http.get<TopBorrowedBookItem[]>(`${this.baseUrl}/top-borrowed-books`, { params });
  }

  loansPerMonth(): Observable<LoansPerMonthItem[]> {
    return this.http.get<LoansPerMonthItem[]>(`${this.baseUrl}/loans-per-month`);
  }

  finesSummary(): Observable<FinesSummaryResponse> {
    return this.http.get<FinesSummaryResponse>(`${this.baseUrl}/fines-summary`);
  }
}
