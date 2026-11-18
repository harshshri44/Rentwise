import { TestBed, ComponentFixture } from '@angular/core/testing';
import { PropertyCardComponent } from './property-card.component';
import { PropertyStoreService } from '../../../core/services/property-store.service';
import { Property } from '../../../core/models/property.model';
import { vi } from 'vitest';

describe('PropertyCardComponent', () => {
  let fixture: ComponentFixture<PropertyCardComponent>;
  let component: PropertyCardComponent;
  let store: PropertyStoreService;

  const sampleProperty: Property = {
    id: 'test-card-1',
    title: 'Sunny Studio in Indiranagar',
    city: 'Bengaluru',
    locality: 'Indiranagar',
    propertyType: 'Studio',
    category: 'room',
    bedrooms: 1,
    bathrooms: 1,
    areaSqFt: 350,
    monthlyRent: 18000,
    securityDeposit: 36000,
    furnishing: 'Furnished',
    amenities: ['Wi-Fi', 'AC', 'Balcony'],
    photos: ['https://images.unsplash.com/photo-1598928506311-c55ded91a20c'],
    description: 'A cozy studio flat.',
    availability: 'Available Now',
    contact: {
      name: 'Priya Nair',
      phone: '+919988776655',
      email: 'priya@example.com',
      role: 'Owner'
    },
    createdAt: '2026-10-15'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PropertyCardComponent],
      providers: [PropertyStoreService]
    }).compileComponents();

    fixture = TestBed.createComponent(PropertyCardComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(PropertyStoreService);
    component.property = sampleProperty;
    fixture.detectChanges();
  });

  it('should create and render property title and formatted rent', () => {
    expect(component).toBeTruthy();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.card-title')?.textContent).toContain('Sunny Studio in Indiranagar');
    expect(compiled.querySelector('.price-val')?.textContent).toContain('₹18,000');
  });

  it('should display locality, city and property specs', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.card-location')?.textContent).toContain('Indiranagar, Bengaluru');
    expect(compiled.textContent).toContain('Furnished');
  });

  it('should open property details when clicked', () => {
    const spy = vi.spyOn(store, 'openPropertyDetails');
    component.openDetails();
    expect(spy).toHaveBeenCalledWith(sampleProperty);
  });

  it('should toggle favorite on favorite button click', () => {
    const spy = vi.spyOn(store, 'toggleFavorite');
    const fakeEvent = new MouseEvent('click');
    component.toggleFavorite(fakeEvent);
    expect(spy).toHaveBeenCalledWith('test-card-1');
  });
});
