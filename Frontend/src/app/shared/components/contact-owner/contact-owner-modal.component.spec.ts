import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ContactOwnerModalComponent } from './contact-owner-modal.component';
import { PropertyStoreService } from '../../../core/services/property-store.service';
import { Property } from '../../../core/models/property.model';

describe('ContactOwnerModalComponent', () => {
  let fixture: ComponentFixture<ContactOwnerModalComponent>;
  let component: ContactOwnerModalComponent;
  let store: PropertyStoreService;

  const testProperty: Property = {
    id: 'contact-test-1',
    title: 'Modern Room in Koramangala',
    city: 'Bengaluru',
    locality: 'Koramangala',
    propertyType: 'Private Room',
    category: 'room',
    bedrooms: 1,
    bathrooms: 1,
    areaSqFt: 200,
    monthlyRent: 11000,
    securityDeposit: 22000,
    furnishing: 'Furnished',
    amenities: ['Wi-Fi'],
    photos: ['https://images.unsplash.com/photo-1598928506311-c55ded91a20c'],
    description: 'Nice room',
    availability: 'Immediate',
    contact: {
      name: 'Ananya Sharma',
      phone: '+919876543210',
      email: 'ananya@example.com',
      role: 'Owner'
    },
    createdAt: '2026-10-15'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactOwnerModalComponent],
      providers: [PropertyStoreService]
    }).compileComponents();

    fixture = TestBed.createComponent(ContactOwnerModalComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(PropertyStoreService);
    store.openContactOwner(testProperty);
    fixture.detectChanges();
  });

  it('should create and generate pre-filled WhatsApp link', () => {
    expect(component).toBeTruthy();
    const link = component.getWhatsAppLink();
    expect(link).toContain('https://wa.me/919876543210');
    expect(link).toContain('Modern%20Room%20in%20Koramangala');
  });

  it('should generate pre-filled mailto link', () => {
    const link = component.getMailtoLink();
    expect(link).toContain('mailto:ananya@example.com');
    expect(link).toContain('RentWise%20Inquiry%3A%20Modern%20Room%20in%20Koramangala');
  });

  it('should close modal when close() is called', () => {
    component.close();
    expect(store.isContactOwnerOpen()).toBe(false);
    expect(store.contactProperty()).toBeNull();
  });
});
