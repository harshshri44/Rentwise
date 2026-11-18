import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PropertyStoreService } from '../../core/services/property-store.service';
import { PropertyCardComponent } from '../../shared/components/property-card/property-card.component';
import { SortOption } from '../../core/models/property.model';

@Component({
  selector: 'app-property-listings',
  standalone: true,
  imports: [CommonModule, FormsModule, PropertyCardComponent],
  templateUrl: './property-listings.component.html',
  styleUrl: './property-listings.component.css'
})
export class PropertyListingsComponent {
  mobileFiltersOpen = signal<boolean>(false);

  readonly allAmenitiesList: string[] = [
    'Wi-Fi',
    'Air Conditioning',
    'Attached Bath',
    'Covered Parking',
    'Washing Machine',
    'Power Backup',
    'Lift',
    'Balcony',
    'Gym',
    'Security/CCTV'
  ];

  constructor(public store: PropertyStoreService) {}

  toggleMobileFilters(): void {
    this.mobileFiltersOpen.update(v => !v);
  }

  closeMobileFilters(): void {
    this.mobileFiltersOpen.set(false);
  }

  onSearchChange(term: string): void {
    this.store.updateFilters({ searchTerm: term });
  }

  onCityChange(city: string): void {
    this.store.setCity(city);
  }

  onLocalityChange(locality: string): void {
    this.store.updateFilters({ locality });
  }

  onTypeChange(propertyType: string): void {
    this.store.updateFilters({ propertyType });
  }

  onMinRentChange(val: string): void {
    const num = val ? Number(val) : null;
    this.store.updateFilters({ minRent: num });
  }

  onMaxRentChange(val: string): void {
    const num = val ? Number(val) : null;
    this.store.updateFilters({ maxRent: num });
  }

  onBedroomsChange(bhk: number | null): void {
    this.store.updateFilters({ bedrooms: bhk });
  }

  onFurnishingChange(furnishing: string): void {
    this.store.updateFilters({ furnishing });
  }

  toggleAmenityFilter(amenity: string): void {
    const current = this.store.filters().amenities;
    const next = current.includes(amenity)
      ? current.filter(a => a !== amenity)
      : [...current, amenity];
    this.store.updateFilters({ amenities: next });
  }

  onSortChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.store.setSort(select.value as SortOption);
  }

  resetAll(): void {
    this.store.resetFilters();
  }

  activeFilterCount(): number {
    const f = this.store.filters();
    let count = 0;
    if (f.searchTerm) count++;
    if (f.city) count++;
    if (f.locality) count++;
    if (f.propertyType) count++;
    if (f.category && f.category !== 'all') count++;
    if (f.minRent) count++;
    if (f.maxRent) count++;
    if (f.bedrooms !== null) count++;
    if (f.furnishing) count++;
    count += f.amenities.length;
    return count;
  }
}
