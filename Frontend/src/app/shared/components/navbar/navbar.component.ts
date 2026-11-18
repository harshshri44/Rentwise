import { Component, HostListener, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PropertyStoreService } from '../../../core/services/property-store.service';
import { ToastService } from '../../../core/services/toast.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  public store = inject(PropertyStoreService);
  private toast = inject(ToastService);
  public auth = inject(AuthService);

  isScrolled = signal<boolean>(false);
  mobileMenuOpen = signal<boolean>(false);
  authModalOpen = signal<boolean>(false);
  authMode = signal<'login' | 'signup'>('login');

  // Form Fields
  authEmail = signal<string>('owner@rentwise.com');
  authPassword = signal<string>('password123');
  authName = signal<string>('');
  authPhone = signal<string>('');
  authRole = signal<'OWNER' | 'TENANT'>('OWNER');
  authLoading = signal<boolean>(false);
  authError = signal<string | null>(null);

  constructor() {}

  @HostListener('window:scroll')
  onWindowScroll(): void {
    const offset = window.scrollY || document.documentElement.scrollTop || 0;
    this.isScrolled.set(offset > 20);
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update(v => !v);
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }

  scrollToSection(sectionId: string, event?: Event): void {
    if (event) {
      event.preventDefault();
    }
    this.closeMobileMenu();
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }

  openListProperty(): void {
    this.closeMobileMenu();
    if (!this.auth.isLoggedIn()) {
      this.toast.info('Owner Login Required', 'Please log in as an Owner to list your rental property.');
      this.authRole.set('OWNER');
      this.openAuth('login');
      return;
    }
    this.store.openListPropertyModal();
  }

  openAuth(mode: 'login' | 'signup'): void {
    this.authMode.set(mode);
    this.authError.set(null);
    if (mode === 'signup') {
      this.authEmail.set('');
      this.authPassword.set('');
    } else if (!this.authEmail()) {
      this.authEmail.set('owner@rentwise.com');
      this.authPassword.set('password123');
    }
    this.authModalOpen.set(true);
    this.closeMobileMenu();
  }

  closeAuth(): void {
    this.authModalOpen.set(false);
    this.authLoading.set(false);
    this.authError.set(null);
  }

  fillDemoCreds(role: 'owner' | 'tenant'): void {
    if (role === 'owner') {
      this.authEmail.set('owner@rentwise.com');
      this.authPassword.set('password123');
    } else {
      this.authEmail.set('renter@rentwise.com');
      this.authPassword.set('password123');
    }
    this.authMode.set('login');
  }

  submitAuth(event: Event): void {
    event.preventDefault();
    this.authLoading.set(true);
    this.authError.set(null);

    if (this.authMode() === 'login') {
      this.auth.login({
        email: this.authEmail().trim(),
        password: this.authPassword().trim()
      }).subscribe({
        next: () => {
          this.authLoading.set(false);
          this.closeAuth();
        },
        error: (err) => {
          this.authLoading.set(false);
          this.authError.set(err?.error?.message || 'Invalid email or password.');
        }
      });
    } else {
      if (!this.authName().trim()) {
        this.authError.set('Please enter your full name.');
        this.authLoading.set(false);
        return;
      }

      this.auth.register({
        name: this.authName().trim(),
        email: this.authEmail().trim(),
        password: this.authPassword().trim(),
        phone: this.authPhone().trim(),
        role: this.authRole()
      }).subscribe({
        next: () => {
          this.authLoading.set(false);
          this.closeAuth();
        },
        error: (err) => {
          this.authLoading.set(false);
          this.authError.set(err?.error?.message || 'Registration failed.');
        }
      });
    }
  }

  logout(): void {
    this.auth.logout();
    this.closeMobileMenu();
  }
}
