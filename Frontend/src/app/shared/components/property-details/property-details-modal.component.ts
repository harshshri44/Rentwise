import { Component, HostListener, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PropertyStoreService } from '../../../core/services/property-store.service';
import { ToastService } from '../../../core/services/toast.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-property-details-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './property-details-modal.component.html',
  styleUrl: './property-details-modal.component.css'
})
export class PropertyDetailsModalComponent {
  public store = inject(PropertyStoreService);
  private toast = inject(ToastService);
  public auth = inject(AuthService);

  activePhotoIndex = signal<number>(0);
  isDeleting = signal<boolean>(false);

  constructor() {}

  isOwnerOfCurrentProperty(): boolean {
    const prop = this.store.selectedProperty();
    if (!prop) return false;
    const user = this.auth.currentUser();
    if (!user) return false;
    return user.role === 'ADMIN' || user.role === 'OWNER' || (prop.contact && prop.contact.email === user.email);
  }

  unlistProperty(): void {
    const prop = this.store.selectedProperty();
    if (!prop) return;

    if (!confirm(`Are you sure you want to unlist "${prop.title}"? This will remove the listing now that your deal is completed.`)) {
      return;
    }

    this.isDeleting.set(true);
    this.store.deleteProperty(
      prop.id,
      () => {
        this.isDeleting.set(false);
        this.toast.success(
          'Listing Unlisted',
          `Deal finalized! "${prop.title}" has been unlisted and removed from RentWise.`
        );
      },
      (err) => {
        this.isDeleting.set(false);
        this.toast.error('Action Failed', err?.error?.message || 'Unable to unlist listing.');
      }
    );
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.close();
  }

  close(): void {
    this.store.closePropertyDetails();
    this.activePhotoIndex.set(0);
  }

  setPhoto(index: number): void {
    this.activePhotoIndex.set(index);
  }

  prevPhoto(total: number): void {
    this.activePhotoIndex.update(idx => (idx === 0 ? total - 1 : idx - 1));
  }

  nextPhoto(total: number): void {
    this.activePhotoIndex.update(idx => (idx === total - 1 ? 0 : idx + 1));
  }

  toggleFavorite(): void {
    const prop = this.store.selectedProperty();
    if (!prop) return;
    this.store.toggleFavorite(prop.id);
    const isFav = this.store.favoriteIds().has(prop.id);
    this.toast.info(
      isFav ? 'Property Saved' : 'Property Removed',
      `"${prop.title}" updated in saved favorites.`
    );
  }

  shareProperty(): void {
    const prop = this.store.selectedProperty();
    if (!prop) return;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      this.toast.success('Link Copied', 'Property listing link copied to clipboard.');
    } else {
      this.toast.info('Share Property', `Listing: ${prop.title} in ${prop.locality}`);
    }
  }

  contactOwner(): void {
    const prop = this.store.selectedProperty();
    if (!prop) return;
    this.store.openContactOwner(prop);
  }

  formatInr(val: number): string {
    return '₹' + Math.round(val).toLocaleString('en-IN');
  }
}
