import { TestBed, ComponentFixture } from '@angular/core/testing';
import { PropertyListingsComponent } from './property-listings.component';
import { PropertyStoreService } from '../../core/services/property-store.service';

describe('PropertyListingsComponent', () => {
  let fixture: ComponentFixture<PropertyListingsComponent>;
  let component: PropertyListingsComponent;
  let store: PropertyStoreService;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [PropertyListingsComponent],
      providers: [PropertyStoreService]
    }).compileComponents();

    fixture = TestBed.createComponent(PropertyListingsComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(PropertyStoreService);
    fixture.detectChanges();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create and display initial property cards', () => {
    expect(component).toBeTruthy();
    const cards = fixture.nativeElement.querySelectorAll('app-property-card');
    expect(cards.length).toBeGreaterThan(0);
  });

  it('should update search term filter when search input changes', () => {
    component.onSearchChange('Kothrud');
    expect(store.filters().searchTerm).toBe('Kothrud');
  });

  it('should update city filter when city changes', () => {
    component.onCityChange('Mumbai');
    expect(store.filters().city).toBe('Mumbai');
  });

  it('should toggle amenity filter', () => {
    component.toggleAmenityFilter('Wi-Fi');
    expect(store.filters().amenities).toContain('Wi-Fi');

    component.toggleAmenityFilter('Wi-Fi');
    expect(store.filters().amenities).not.toContain('Wi-Fi');
  });

  it('should compute active filter count correctly', () => {
    expect(component.activeFilterCount()).toBe(0);
    component.onCityChange('Pune');
    component.onTypeChange('Private Room');
    expect(component.activeFilterCount()).toBe(2);
    component.resetAll();
    expect(component.activeFilterCount()).toBe(0);
  });

  it('should open and close mobile filter drawer', () => {
    expect(component.mobileFiltersOpen()).toBe(false);
    component.toggleMobileFilters();
    expect(component.mobileFiltersOpen()).toBe(true);
    component.closeMobileFilters();
    expect(component.mobileFiltersOpen()).toBe(false);
  });
});
