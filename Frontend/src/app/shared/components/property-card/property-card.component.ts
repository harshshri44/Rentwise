import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Property } from '../../../core/models/property.model';
import { PropertyStoreService } from '../../../core/services/property-store.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-property-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './property-card.component.html',
  styleUrl: './property-card.component.css'
})
export class PropertyCardComponent {
  @Input({ required: true }) property!: Property;

  fallbackImage = 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80';

  constructor(
    public store: PropertyStoreService,
    private toast: ToastService
  ) {}

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = this.fallbackImage;
  }

  toggleFavorite(event: Event): void {
    event.stopPropagation();
    this.store.toggleFavorite(this.property.id);
    const isFav = this.store.favoriteIds().has(this.property.id);
    this.toast.info(
      isFav ? 'Added to Saved' : 'Removed from Saved',
      `"${this.property.title}" updated in your favorites.`
    );
  }

  openDetails(): void {
    this.store.openPropertyDetails(this.property);
  }

  formatInr(val: number): string {
    return '₹' + Math.round(val).toLocaleString('en-IN');
  }
}
