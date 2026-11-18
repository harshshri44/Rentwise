import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, ToastMessage } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container" aria-live="polite" aria-atomic="true">
      @for (toast of toastService.toasts(); track toast.id) {
        <div class="toast-card" [ngClass]="'toast-' + toast.type" role="alert">
          <div class="toast-icon">
            @if (toast.type === 'success') {
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
            } @else if (toast.type === 'error') {
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
            } @else if (toast.type === 'warning') {
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
            } @else {
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
              </svg>
            }
          </div>
          <div class="toast-body">
            <h4 class="toast-title">{{ toast.title }}</h4>
            <p class="toast-desc">{{ toast.message }}</p>
          </div>
          <button type="button" class="toast-close" (click)="toastService.dismiss(toast.id)" aria-label="Dismiss">&times;</button>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: 84px;
      right: 24px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 10px;
      max-width: 400px;
      width: calc(100vw - 48px);
      pointer-events: none;
    }
    .toast-card {
      pointer-events: auto;
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 14px 16px;
      background: #FFFFFF;
      border: 1px solid #EAEAEA;
      border-radius: 10px;
      box-shadow: 0 10px 28px rgba(0, 0, 0, 0.12);
      animation: slideIn 200ms cubic-bezier(0.16, 1, 0.3, 1);
    }
    @keyframes slideIn {
      from { transform: translateX(30px); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    .toast-icon {
      width: 20px;
      height: 20px;
      flex-shrink: 0;
      margin-top: 2px;
    }
    .toast-icon svg {
      width: 100%;
      height: 100%;
    }
    .toast-success .toast-icon { color: #1B8755; }
    .toast-error .toast-icon { color: #E53935; }
    .toast-warning .toast-icon { color: #D97706; }
    .toast-info .toast-icon { color: #0284C7; }
    .toast-body {
      flex: 1;
      min-width: 0;
    }
    .toast-title {
      font-size: 0.875rem;
      font-weight: 700;
      color: #171717;
      margin-bottom: 2px;
    }
    .toast-desc {
      font-size: 0.8125rem;
      color: #5E6470;
      line-height: 1.4;
      word-break: break-word;
    }
    .toast-close {
      background: none;
      border: none;
      color: #9CA3AF;
      font-size: 1.25rem;
      line-height: 1;
      cursor: pointer;
      padding: 0 4px;
      transition: color 150ms;
    }
    .toast-close:hover {
      color: #171717;
    }
  `]
})
export class ToastComponent {
  constructor(public toastService: ToastService) {}
}
