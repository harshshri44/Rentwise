import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { ToastComponent } from '../../shared/components/toast/toast.component';
import { HeroComponent } from '../hero/hero.component';
import { PopularLocationsComponent } from '../popular-locations/popular-locations.component';
import { RoomsSharedFlatsComponent } from '../rooms-shared-flats/rooms-shared-flats.component';
import { PropertyListingsComponent } from '../property-listings/property-listings.component';
import { HowItWorksComponent } from '../how-it-works/how-it-works.component';
import { TrustSafetyComponent } from '../trust-safety/trust-safety.component';
import { CtaSectionComponent } from '../cta-section/cta-section.component';
import { PropertyDetailsModalComponent } from '../../shared/components/property-details/property-details-modal.component';
import { ContactOwnerModalComponent } from '../../shared/components/contact-owner/contact-owner-modal.component';
import { ListPropertyModalComponent } from '../../shared/components/list-property/list-property-modal.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    FooterComponent,
    ToastComponent,
    HeroComponent,
    PopularLocationsComponent,
    RoomsSharedFlatsComponent,
    PropertyListingsComponent,
    HowItWorksComponent,
    TrustSafetyComponent,
    CtaSectionComponent,
    PropertyDetailsModalComponent,
    ContactOwnerModalComponent,
    ListPropertyModalComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {}
