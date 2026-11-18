import { TestBed } from '@angular/core/testing';
import { PropertyStoreService } from './property-store.service';
import { PropertyApiService } from './property-api.service';
import { Property } from '../models/property.model';
import { provideHttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';

describe('PropertyStoreService', () => {
  let store: PropertyStoreService;
  let apiService: PropertyApiService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        PropertyStoreService,
        PropertyApiService,
        provideHttpClient()
      ]
    });
    store = TestBed.inject(PropertyStoreService);
    apiService = TestBed.inject(PropertyApiService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should initialize with seed properties in demo mode', () => {
    store.setDemoMode(true);
    const properties = store.properties();
    expect(properties.length).toBeGreaterThanOrEqual(12);
    expect(store.filteredProperties().length).toBe(properties.length);
    expect(properties.every(p => p.isDemo === true)).toBe(true);
  });

  it('should filter properties by city', () => {
    store.setDemoMode(true);
    store.updateFilters({ city: 'Pune' });
    const puneProperties = store.filteredProperties();
    expect(puneProperties.length).toBeGreaterThan(0);
    expect(puneProperties.every(p => p.city.toLowerCase() === 'pune')).toBe(true);

    store.updateFilters({ city: 'Mumbai' });
    const mumbaiProperties = store.filteredProperties();
    expect(mumbaiProperties.length).toBeGreaterThan(0);
    expect(mumbaiProperties.every(p => p.city.toLowerCase() === 'mumbai')).toBe(true);
  });

  it('should filter properties by property type', () => {
    store.setDemoMode(true);
    store.updateFilters({ propertyType: 'Private Room' });
    const rooms = store.filteredProperties();
    expect(rooms.length).toBeGreaterThan(0);
    expect(rooms.every(p => p.propertyType === 'Private Room')).toBe(true);
  });

  it('should filter properties by maxRent budget', () => {
    store.setDemoMode(true);
    const budget = 15000;
    store.updateFilters({ maxRent: budget });
    const budgetListings = store.filteredProperties();
    expect(budgetListings.length).toBeGreaterThan(0);
    expect(budgetListings.every(p => p.monthlyRent <= budget)).toBe(true);
  });

  it('should filter properties by furnishing status', () => {
    store.setDemoMode(true);
    store.updateFilters({ furnishing: 'Furnished' });
    const furnished = store.filteredProperties();
    expect(furnished.length).toBeGreaterThan(0);
    expect(furnished.every(p => p.furnishing === 'Furnished')).toBe(true);
  });

  it('should sort properties by rent ascending and descending', () => {
    store.setDemoMode(true);
    store.setSort('rent-asc');
    const ascList = store.filteredProperties();
    for (let i = 0; i < ascList.length - 1; i++) {
      expect(ascList[i].monthlyRent).toBeLessThanOrEqual(ascList[i + 1].monthlyRent);
    }

    store.setSort('rent-desc');
    const descList = store.filteredProperties();
    for (let i = 0; i < descList.length - 1; i++) {
      expect(descList[i].monthlyRent).toBeGreaterThanOrEqual(descList[i + 1].monthlyRent);
    }
  });

  it('should toggle favorites and persist to set', () => {
    const testId = 'prop-1';
    expect(store.favoriteIds().has(testId)).toBe(false);

    store.toggleFavorite(testId);
    expect(store.favoriteIds().has(testId)).toBe(true);

    store.toggleFavorite(testId);
    expect(store.favoriteIds().has(testId)).toBe(false);
  });

  it('should add a user submitted property and prepend it to the list in demo mode', () => {
    store.setDemoMode(true);
    const initialCount = store.properties().length;
    const newPropData: Omit<Property, 'id' | 'createdAt' | 'isUserSubmitted'> = {
      title: 'Spacious Master Bedroom in Koregaon Park',
      city: 'Pune',
      locality: 'Koregaon Park',
      address: 'Lane 7',
      propertyType: 'Private Room',
      category: 'room',
      bedrooms: 1,
      bathrooms: 1,
      areaSqFt: 250,
      monthlyRent: 12500,
      securityDeposit: 25000,
      furnishing: 'Furnished',
      amenities: ['Wi-Fi', 'AC', 'Attached Bath'],
      photos: ['https://images.unsplash.com/photo-1598928506311-c55ded91a20c'],
      description: 'Private room in a 3 BHK duplex.',
      availability: 'Immediate',
      contact: {
        name: 'Arjun Verma',
        phone: '+919876543210',
        email: 'arjun@example.com',
        role: 'Flatmate'
      }
    };

    const created = store.addProperty(newPropData);
    expect(created.id).toBeDefined();
    expect(created.isUserSubmitted).toBe(true);
    expect(store.properties().length).toBe(initialCount + 1);
    expect(store.properties()[0].title).toBe('Spacious Master Bedroom in Koregaon Park');
  });

  it('should separate demo mode from production API mode and not fall back to demo data on API error', () => {
    // Switch to Production Mode
    vi.spyOn(apiService, 'getProperties').mockReturnValue(
      throwError(() => new Error('Connection refused to localhost:8080'))
    );

    store.setDemoMode(false);
    expect(store.isDemoMode()).toBe(false);

    // In production mode with API error, server properties must be empty and apiError must be set
    expect(store.serverProperties().length).toBe(0);
    expect(store.properties().length).toBe(0); // MUST NOT fall back to seed properties!
    expect(store.apiError()).toBeTruthy();
    expect(store.apiError()).toContain('Unable to connect to Spring Boot backend');

    // Switch back to demo mode
    store.setDemoMode(true);
    expect(store.isDemoMode()).toBe(true);
    expect(store.properties().length).toBeGreaterThanOrEqual(12);
  });

  it('should load server properties in production mode when API succeeds', () => {
    const mockServerProps: Property[] = [
      {
        id: 'srv-1',
        title: 'Server Loaded 2 BHK',
        city: 'Pune',
        locality: 'Aundh',
        propertyType: 'Full Apartment',
        category: 'apartment',
        bedrooms: 2,
        bathrooms: 2,
        areaSqFt: 1000,
        monthlyRent: 22000,
        securityDeposit: 44000,
        furnishing: 'Furnished',
        amenities: ['Lift'],
        photos: ['https://example.com/p.jpg'],
        description: 'Server listing description',
        availability: 'Immediate',
        contact: { name: 'Owner', phone: '1234567890', email: 'o@e.com', role: 'Owner' },
        createdAt: '2026-10-17'
      }
    ];

    vi.spyOn(apiService, 'getProperties').mockReturnValue(of(mockServerProps));

    store.setDemoMode(false);
    expect(store.serverProperties().length).toBe(1);
    expect(store.properties().length).toBe(1);
    expect(store.properties()[0].title).toBe('Server Loaded 2 BHK');
  });

  it('should control modal states correctly', () => {
    store.setDemoMode(true);
    const sampleProp = store.properties()[0];

    // Details Modal
    expect(store.selectedProperty()).toBeNull();
    store.openPropertyDetails(sampleProp);
    expect(store.selectedProperty()?.id).toBe(sampleProp.id);
    store.closePropertyDetails();
    expect(store.selectedProperty()).toBeNull();

    // Listing Wizard Modal
    expect(store.isListPropertyOpen()).toBe(false);
    store.openListPropertyModal();
    expect(store.isListPropertyOpen()).toBe(true);
    store.closeListPropertyModal();
    expect(store.isListPropertyOpen()).toBe(false);

    // Contact Owner Modal
    expect(store.isContactOwnerOpen()).toBe(false);
    expect(store.contactProperty()).toBeNull();
    store.openContactOwner(sampleProp);
    expect(store.isContactOwnerOpen()).toBe(true);
    expect(store.contactProperty()?.id).toBe(sampleProp.id);
    store.closeContactOwner();
    expect(store.isContactOwnerOpen()).toBe(false);
    expect(store.contactProperty()).toBeNull();
  });
});
