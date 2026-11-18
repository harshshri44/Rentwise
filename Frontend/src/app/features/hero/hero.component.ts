import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PropertyStoreService } from '../../core/services/property-store.service';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css'
})
export class HeroComponent {
  searchLocation = signal<string>('Pune');
  searchType = signal<string>('');
  searchBudget = signal<string>('all');

  constructor(public store: PropertyStoreService) {}

  executeSearch(event?: Event): void {
    if (event) {
      event.preventDefault();
    }

    let maxRent: number | null = null;
    if (this.searchBudget() === '10000') maxRent = 10000;
    else if (this.searchBudget() === '20000') maxRent = 20000;
    else if (this.searchBudget() === '35000') maxRent = 35000;
    else if (this.searchBudget() === '50000') maxRent = 50000;

    const loc = this.searchLocation().trim();
    const isKnownCity = this.store.availableCities().some(c => c.city.toLowerCase() === loc.toLowerCase());

    if (isKnownCity) {
      this.store.setSearch('', loc, this.searchType(), maxRent);
    } else {
      this.store.setSearch(loc, '', this.searchType(), maxRent);
    }

    this.scrollToSection('listings');
  }

  scrollToSection(sectionId: string): void {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }

  openListProperty(): void {
    this.store.openListPropertyModal();
  }
}
