import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PropertyStoreService } from '../../core/services/property-store.service';

@Component({
  selector: 'app-rooms-shared-flats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rooms-shared-flats.component.html',
  styleUrl: './rooms-shared-flats.component.css'
})
export class RoomsSharedFlatsComponent {
  categories = [
    { id: 'all', label: 'All Accommodations', icon: 'home' },
    { id: 'room', label: 'Private Rooms', icon: 'door' },
    { id: 'shared-flat', label: 'Shared Flats', icon: 'users' },
    { id: 'student-friendly', label: 'Near Colleges / Student Housing', icon: 'academic' },
    { id: 'budget', label: 'Under ₹15,000 / mo', icon: 'tag' },
    { id: 'furnished', label: 'Fully Furnished', icon: 'sparkles' }
  ];

  constructor(public store: PropertyStoreService) {}

  selectCategory(id: string): void {
    if (id === 'budget') {
      this.store.updateFilters({ maxRent: 15000, category: 'all' });
    } else if (id === 'furnished') {
      this.store.updateFilters({ furnishing: 'Furnished', category: 'all' });
    } else {
      this.store.updateFilters({ category: id, maxRent: null });
    }

    const el = document.getElementById('listings');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }

  isCategoryActive(id: string): boolean {
    const f = this.store.filters();
    if (id === 'budget') return f.maxRent === 15000;
    if (id === 'furnished') return f.furnishing === 'Furnished';
    return f.category === id;
  }
}
