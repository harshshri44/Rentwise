import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PropertyStoreService } from '../../../core/services/property-store.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  currentYear = new Date().getFullYear();

  constructor(public store: PropertyStoreService) {}

  scrollToSection(sectionId: string, event: Event): void {
    event.preventDefault();
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }

  filterCategory(category: string, event: Event): void {
    event.preventDefault();
    this.store.setCategory(category);
    this.scrollToSection('listings', event);
  }

  filterCity(city: string, event: Event): void {
    event.preventDefault();
    this.store.setCity(city);
    this.scrollToSection('listings', event);
  }

  openListProperty(event: Event): void {
    event.preventDefault();
    this.store.openListPropertyModal();
  }
}
