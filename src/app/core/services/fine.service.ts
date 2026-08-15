import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Fine } from '../models/loan.model';

export interface CreateManualFineRequest {
  userId: number;
  amountXaf: number;
  reason: string;
}

@Injectable({ providedIn: 'root' })
export class FineService {
  private readonly baseUrl = `${environment.apiBaseUrl}/fines`;

  constructor(private readonly http: HttpClient) {}

  myUnpaidFines(): Observable<Fine[]> {
    return this.http.get<Fine[]>(`${this.baseUrl}/my`);
  }

  finesForUser(userId: number): Observable<Fine[]> {
    return this.http.get<Fine[]>(`${this.baseUrl}/user/${userId}`);
  }

  allFines(): Observable<Fine[]> {
    return this.http.get<Fine[]>(this.baseUrl);
  }

  createManual(request: CreateManualFineRequest): Observable<Fine> {
    return this.http.post<Fine>(this.baseUrl, request);
  }

  markPaid(fineId: number): Observable<Fine> {
    return this.http.post<Fine>(`${this.baseUrl}/${fineId}/pay`, {});
  }
}
