import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LibraryPolicy, UpdateLibraryPolicyRequest } from '../models/policy.model';
import { Role } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class PolicyService {
  private readonly baseUrl = `${environment.apiBaseUrl}/library-policies`;

  constructor(private readonly http: HttpClient) {}

  listAll(): Observable<LibraryPolicy[]> {
    return this.http.get<LibraryPolicy[]>(this.baseUrl);
  }

  update(role: Role, request: UpdateLibraryPolicyRequest): Observable<LibraryPolicy> {
    return this.http.put<LibraryPolicy>(`${this.baseUrl}/${role}`, request);
  }
}
