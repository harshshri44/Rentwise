import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PropertyStoreService } from '../../core/services/property-store.service';
import { LocationTile } from '../../core/models/property.model';

@Component({
  selector: 'app-popular-locations',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './popular-locations.component.html',
  styleUrl: './popular-locations.component.css'
})
export class PopularLocationsComponent {
  readonly locations: LocationTile[] = [
    {
      city: 'Pune',
      state: 'Maharashtra',
      tagline: 'Student capital & Western IT corridor',
      photoUrl: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80',
      popularLocalities: ['Kothrud', 'Baner', 'Hinjewadi', 'Viman Nagar', 'Koregaon Park']
    },
    {
      city: 'Mumbai',
      state: 'Maharashtra',
      tagline: 'Coastal metropolis & corporate hubs',
      photoUrl: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80',
      popularLocalities: ['Bandra West', 'Powai', 'Andheri West', 'Juhu']
    },
    {
      city: 'Bengaluru',
      state: 'Karnataka',
      tagline: 'Silicon valley & leafy tech neighborhoods',
      photoUrl: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
      popularLocalities: ['Koramangala', 'HSR Layout', 'Indiranagar', 'Whitefield']
    },
    {
      city: 'Hyderabad',
      state: 'Telangana',
      tagline: 'Financial district & modern gated societies',
      photoUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      popularLocalities: ['Gachibowli', 'HITEC City', 'Kondapur', 'Jubilee Hills']
    },
    {
      city: 'Delhi NCR',
      state: 'National Capital',
      tagline: 'Metro connected studios & culture enclaves',
      photoUrl: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80',
      popularLocalities: ['Hauz Khas', 'Gurgaon Phase 5', 'Saket', 'Noida Sec 62']
    }
  ];

  constructor(public store: PropertyStoreService) {}

  selectCity(city: string): void {
    this.store.setCity(city);
    const el = document.getElementById('listings');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
