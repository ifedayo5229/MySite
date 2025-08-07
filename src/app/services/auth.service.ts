import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { User, AuthResponse, LoginRequest } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor() {
    // Check for stored user data on service initialization
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      this.currentUserSubject.next(user);
      this.isAuthenticatedSubject.next(true);
    }
  }

  sendVerificationCode(email: string): Observable<AuthResponse> {
    // Simulate API call
    return of({
      success: true,
      message: 'Verification code sent to your email'
    }).pipe(delay(1000));
  }

  verifyCode(loginRequest: LoginRequest): Observable<AuthResponse> {
    // Simulate API call with mock users
    const mockUsers: User[] = [
      {
        id: '1',
        email: 'admin@company.com',
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
        department: 'IT',
        location: 'New York',
        isActive: true,
        createdAt: new Date()
      },
      {
        id: '2',
        email: 'user@company.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'user',
        department: 'Marketing',
        location: 'California',
        isActive: true,
        createdAt: new Date()
      }
    ];

    return of(null).pipe(
      delay(1500),
      map(() => {
        // Simulate code verification (accept any 4 digit code)
        if (loginRequest.code && loginRequest.code.length === 4) {
          const user = mockUsers.find(u => u.email === loginRequest.email);
          
          if (user) {
            // Store user data
            localStorage.setItem('currentUser', JSON.stringify(user));
            localStorage.setItem('authToken', 'mock-jwt-token');
            
            // Update subjects
            this.currentUserSubject.next(user);
            this.isAuthenticatedSubject.next(true);
            
            return {
              success: true,
              message: 'Login successful',
              user: user,
              token: 'mock-jwt-token'
            };
          }
        }
        
        throw new Error('Invalid verification code');
      })
    );
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'admin';
  }

  isUser(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'user';
  }
}