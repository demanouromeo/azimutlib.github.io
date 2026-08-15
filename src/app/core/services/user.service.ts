import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Role, User, UserStatus } from '../models/user.model';

export interface CreateUserRequest {
  matricule: string;
  fullName: string;
  email?: string;
  phone?: string;
  password: string;
  role: Role;
  department?: string;
}

export interface AdminUpdateUserRequest {
  fullName: string;
  email?: string;
  phone?: string;
  role: Role;
  department?: string;
  password?: string;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly baseUrl = `${environment.apiBaseUrl}/users`;

  constructor(private readonly http: HttpClient) {}

  listAll(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl);
  }

  getById(id: number): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/${id}`);
  }

  getByMatricule(matricule: string): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/by-matricule/${matricule}`);
  }

  create(request: CreateUserRequest): Observable<User> {
    return this.http.post<User>(this.baseUrl, request);
  }

  update(id: number, request: AdminUpdateUserRequest): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/${id}`, request);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  setStatus(id: number, status: UserStatus): Observable<User> {
    return this.http.patch<User>(`${this.baseUrl}/${id}/status`, { status });
  }

  uploadAvatar(id: number, file: File): Observable<User> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<User>(`${this.baseUrl}/${id}/avatar`, formData);
  }

  removeAvatar(id: number): Observable<User> {
    return this.http.delete<User>(`${this.baseUrl}/${id}/avatar`);
  }

  /** Fetched as a blob (not a plain <img src="...">) so the JWT auth header attaches. */
  getAvatarBlob(id: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/${id}/avatar`, { responseType: 'blob' });
  }
}
