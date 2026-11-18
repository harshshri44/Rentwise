import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { catchError, map, of, timeout } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiStateService {
  readonly apiUrl = environment.apiUrl;
  readonly isConnected = signal<boolean | null>(null); // null = checking, false = offline, true = online
  readonly isChecking = signal<boolean>(false);
  readonly demoMode = signal<boolean>(false);
  readonly lastChecked = signal<Date | null>(null);

  constructor(private http: HttpClient) {
    this.checkConnection();
  }

  checkConnection(): void {
    this.isChecking.set(true);
    // Ping Spring Boot base URL
    this.http.get(`${this.apiUrl}/properties`, { observe: 'response' })
      .pipe(
        timeout(3000),
        map(res => res.status >= 200 && res.status < 300),
        catchError(() => of(false))
      )
      .subscribe(isOnline => {
        this.isConnected.set(isOnline);
        this.isChecking.set(false);
        this.lastChecked.set(new Date());
        // If live API is not running, default demoMode to true so the user can immediately experience the UI
        if (!isOnline && this.demoMode() === false) {
          this.demoMode.set(true);
        }
      });
  }

  setDemoMode(enabled: boolean): void {
    this.demoMode.set(enabled);
  }

  toggleDemoMode(): void {
    this.demoMode.update(val => !val);
  }
}
