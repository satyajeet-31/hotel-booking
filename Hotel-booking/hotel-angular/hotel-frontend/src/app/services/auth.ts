import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from '../models/user';
import { Admin } from '../models/admin';
import { LoginRequest } from '../models/login-request';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8081/api/auth';
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUserSubject.next(JSON.parse(savedUser));
    }
  }

  userSignup(user: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/user/signup`, user).pipe(
      catchError(error => {
        const errorMsg = error.error?.message || error.error || 'Registration failed';
        return throwError(() => new Error(errorMsg));
      })
    );
  }

  userLogin(loginRequest: LoginRequest): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/user/login`, loginRequest).pipe(
      catchError(error => {
        let errorMsg = 'Login failed';
        if (error.status === 401) {
          errorMsg = 'Invalid username or password';
        } else if (error.status === 0) {
          errorMsg = 'Cannot connect to server';
        } else {
          errorMsg = error.error?.message || error.error || 'Login failed';
        }
        return throwError(() => new Error(errorMsg));
      })
    );
  }

  adminLogin(loginRequest: LoginRequest): Observable<Admin> {
    return this.http.post<Admin>(`${this.apiUrl}/admin/login`, loginRequest).pipe(
      catchError(error => {
        let errorMsg = 'Admin login failed';
        if (error.status === 401) {
          errorMsg = 'Invalid admin credentials';
        } else {
          errorMsg = error.error?.message || error.error || 'Admin login failed';
        }
        return throwError(() => new Error(errorMsg));
      })
    );
  }

  setCurrentUser(user: any): void {
    this.currentUserSubject.next(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  getCurrentUser(): any {
    return this.currentUserSubject.value;
  }

  logout(): void {
    this.currentUserSubject.next(null);
    localStorage.removeItem('currentUser');
  }

  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }
  isAdmin(): boolean {
  const user = this.currentUserSubject.value;
  
  if (!user) return false;
  
  // Check if user has admin-specific properties
  // Adjust this based on your actual backend response
  if (user.username === 'admin') {
    return true;
  }
  
  // Additional check: if user doesn't have fullName, consider it admin
  // (since your regular users have fullName from registration)
  if (!user.fullName && user.username !== 'admin') {
    return true;
  }
  
  return false;
}
}