import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PropertyStoreService } from '../../core/services/property-store.service';

@Component({
  selector: 'app-cta-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cta-section.component.html',
  styleUrl: './cta-section.component.css'
})
export class CtaSectionComponent {
  private propertyStore = inject(PropertyStoreService);

  scrollToSection(sectionId: string): void {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }

  openListPropertyModal(): void {
    this.propertyStore.openListPropertyModal();
  }
}
