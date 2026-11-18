import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PropertyStoreService } from '../../core/services/property-store.service';

@Component({
  selector: 'app-how-it-works',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './how-it-works.component.html',
  styleUrl: './how-it-works.component.css'
})
export class HowItWorksComponent {
  steps = [
    {
      stepNum: '01',
      title: 'Discover',
      tagline: 'Search by city, locality & budget',
      description: 'Browse rooms, shared flats, and apartments in your chosen neighborhood. Use targeted filters for student friendly, furnished, or budget accommodation.'
    },
    {
      stepNum: '02',
      title: 'Compare',
      tagline: 'Review photos, rent & deposit terms',
      description: 'Inspect authentic photographs, verified square footage, amenities, and upfront security deposits so you know all details before reaching out.'
    },
    {
      stepNum: '03',
      title: 'Connect',
      tagline: 'Direct call, WhatsApp & visit scheduling',
      description: 'Contact flatmates and property owners directly with zero middleman commissions. Schedule in-person property viewings and finalize terms transparently.'
    }
  ];

  constructor(public store: PropertyStoreService) {}

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
