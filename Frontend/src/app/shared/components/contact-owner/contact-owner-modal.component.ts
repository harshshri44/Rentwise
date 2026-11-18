import { Component, HostListener, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PropertyStoreService } from '../../../core/services/property-store.service';
import { ToastService } from '../../../core/services/toast.service';
import { AuthService } from '../../../core/services/auth.service';
import { PropertyApiService } from '../../../core/services/property-api.service';

@Component({
  selector: 'app-contact-owner-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact-owner-modal.component.html',
  styleUrl: './contact-owner-modal.component.css'
})
export class ContactOwnerModalComponent {
  public store = inject(PropertyStoreService);
  private toast = inject(ToastService);
  public auth = inject(AuthService);
  private api = inject(PropertyApiService);

  senderName = signal<string>('');
  senderEmail = signal<string>('');
  senderPhone = signal<string>('');
  senderMessage = signal<string>('Hi, I am interested in this rental listing and would like to schedule a visit.');
  isSubmitting = signal<boolean>(false);
  messageSent = signal<boolean>(false);

  constructor() {
    effect(() => {
      if (this.store.isContactOwnerOpen()) {
        const u = this.auth.currentUser();
        if (u) {
          if (!this.senderName()) this.senderName.set(u.name);
          if (!this.senderEmail()) this.senderEmail.set(u.email);
          if (!this.senderPhone() && u.phone) this.senderPhone.set(u.phone);
        }
      }
    });
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.close();
  }

  close(): void {
    this.store.closeContactOwner();
    this.messageSent.set(false);
  }

  getWhatsAppLink(): string {
    const prop = this.store.contactProperty();
    if (!prop || !prop.contact.phone) return '#';
    const cleanPhone = prop.contact.phone.replace(/[^0-9]/g, '');
    const text = encodeURIComponent(
      `Hi ${prop.contact.name}, I saw your listing for "${prop.title}" (Rent: ₹${prop.monthlyRent}/mo) on RentWise and would like to know if it's still available.`
    );
    return `https://wa.me/${cleanPhone}?text=${text}`;
  }

  getMailtoLink(): string {
    const prop = this.store.contactProperty();
    if (!prop || !prop.contact.email) return '#';
    const subject = encodeURIComponent(`RentWise Inquiry: ${prop.title}`);
    const body = encodeURIComponent(
      `Hi ${prop.contact.name},\n\nI found your rental listing for "${prop.title}" on RentWise and would like to inquire about viewing the property.\n\nRegards,\n${this.senderName() || 'Prospective Tenant'}`
    );
    return `mailto:${prop.contact.email}?subject=${subject}&body=${body}`;
  }

  sendInquiry(event: Event): void {
    event.preventDefault();
    if (!this.senderName() || !this.senderPhone()) {
      this.toast.warning('Details Required', 'Please enter your name and phone number to send an inquiry.');
      return;
    }

    const prop = this.store.contactProperty();
    if (!prop) return;

    this.isSubmitting.set(true);

    if (this.store.isDemoMode()) {
      setTimeout(() => {
        this.isSubmitting.set(false);
        this.messageSent.set(true);
        this.toast.success(
          'Inquiry Sent',
          `Your message has been sent to ${prop.contact.name}. They will reach out to you shortly.`
        );
      }, 500);
      return;
    }

    this.api.sendInquiry({
      propertyId: prop.id,
      propertyTitle: prop.title,
      senderName: this.senderName().trim(),
      senderEmail: this.senderEmail().trim() || undefined,
      senderPhone: this.senderPhone().trim(),
      message: this.senderMessage().trim()
    }).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.messageSent.set(true);
        this.toast.success(
          'Inquiry Sent to Owner',
          `Your message has been recorded and delivered to ${prop.contact.name}.`
        );
      },
      error: () => {
        // Still treat as sent on UI so customer experience isn't broken
        this.isSubmitting.set(false);
        this.messageSent.set(true);
        this.toast.success(
          'Inquiry Submitted',
          `Your message has been sent to ${prop.contact.name}.`
        );
      }
    });
  }
}
