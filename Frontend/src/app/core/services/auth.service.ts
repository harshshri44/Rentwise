import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthResponse, LoginDto, RegisterDto, UserProfile } from '../models/user.model';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private toast = inject(ToastService);

  private readonly TOKEN_KEY = 'rentwise_jwt_token_v1';
  private readonly USER_KEY = 'rentwise_user_profile_v1';

  readonly token = signal<string | null>(this.getStoredToken());
  readonly currentUser = signal<UserProfile | null>(this.getStoredUser());

  readonly isLoggedIn = computed(() => !!this.token() && !!this.currentUser());
  readonly isOwner = computed(() => this.currentUser()?.role === 'OWNER');
  readonly isTenant = computed(() => this.currentUser()?.role === 'TENANT');

  login(dto: LoginDto): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, dto).pipe(
      tap((resp) => {
        this.saveAuth(resp.token, resp.user);
        this.toast.success(
          'Logged In Successfully',
          `Welcome back, ${resp.user.name} (${resp.user.role === 'OWNER' ? 'Property Owner' : 'Tenant'}).`
        );
      }),
      catchError((err) => {
        const msg = err?.error?.message || 'Invalid credentials or unable to reach Spring Boot server.';
        this.toast.error('Login Failed', msg);
        return throwError(() => err);
      })
    );
  }

  register(dto: RegisterDto): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/register`, dto).pipe(
      tap((resp) => {
        this.saveAuth(resp.token, resp.user);
        this.toast.success(
          'Account Created',
          `Welcome to RentWise, ${resp.user.name}! Your ${resp.user.role === 'OWNER' ? 'Owner' : 'Tenant'} account is ready.`
        );
      }),
      catchError((err) => {
        const msg = err?.error?.message || 'Registration failed. Email might already exist.';
        this.toast.error('Registration Failed', msg);
        return throwError(() => err);
      })
    );
  }

  logout(): void {
    const name = this.currentUser()?.name;
    this.token.set(null);
    this.currentUser.set(null);
    try {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);
    } catch (e) {
      console.warn('Could not clear auth storage', e);
    }
    this.toast.info('Signed Out', name ? `Goodbye, ${name}. You have been logged out.` : 'You have been logged out.');
  }

  private saveAuth(token: string, user: UserProfile): void {
    this.token.set(token);
    this.currentUser.set(user);
    try {
      localStorage.setItem(this.TOKEN_KEY, token);
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    } catch (e) {
      console.warn('Could not persist auth storage', e);
    }
  }

  private getStoredToken(): string | null {
    try {
      return localStorage.getItem(this.TOKEN_KEY);
    } catch {
      return null;
    }
  }

  private getStoredUser(): UserProfile | null {
    try {
      const raw = localStorage.getItem(this.USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }
}
