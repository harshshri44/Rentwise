import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ListPropertyModalComponent } from './list-property-modal.component';
import { PropertyStoreService } from '../../../core/services/property-store.service';
import { PropertyApiService } from '../../../core/services/property-api.service';
import { ToastService } from '../../../core/services/toast.service';
import { provideHttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { Property } from '../../../core/models/property.model';
import { vi } from 'vitest';

describe('ListPropertyModalComponent', () => {
  let fixture: ComponentFixture<ListPropertyModalComponent>;
  let component: ListPropertyModalComponent;
  let store: PropertyStoreService;
  let apiService: PropertyApiService;
  let toast: ToastService;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [ListPropertyModalComponent],
      providers: [
        PropertyStoreService,
        PropertyApiService,
        ToastService,
        provideHttpClient()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ListPropertyModalComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(PropertyStoreService);
    apiService = TestBed.inject(PropertyApiService);
    toast = TestBed.inject(ToastService);
    fixture.detectChanges();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should initialize with completely empty form fields and no demo values', () => {
    const form = component.listingForm;
    expect(form.get('title')?.value).toBe('');
    expect(form.get('city')?.value).toBe('');
    expect(form.get('locality')?.value).toBe('');
    expect(form.get('address')?.value).toBe('');
    expect(form.get('propertyType')?.value).toBe('');
    expect(form.get('bedrooms')?.value).toBeNull();
    expect(form.get('bathrooms')?.value).toBeNull();
    expect(form.get('areaSqFt')?.value).toBeNull();
    expect(form.get('description')?.value).toBe('');
    expect(form.get('monthlyRent')?.value).toBeNull();
    expect(form.get('securityDeposit')?.value).toBeNull();
    expect(form.get('furnishing')?.value).toBe('');
    expect(form.get('availability')?.value).toBe('');
    expect(form.get('contactName')?.value).toBe('');
    expect(form.get('contactRole')?.value).toBe('');
    expect(form.get('contactPhone')?.value).toBe('');
    expect(form.get('contactEmail')?.value).toBe('');

    expect(component.uploadedPhotos().length).toBe(0);
    expect(component.selectedAmenities().size).toBe(0);
    expect(component.currentStep()).toBe(1);
  });

  it('should prevent progression from Step 1 when required fields are missing', () => {
    expect(component.currentStep()).toBe(1);
    component.nextStep();
    // Should still be on step 1 because title, city, locality, etc. are empty
    expect(component.currentStep()).toBe(1);
    expect(component.listingForm.get('title')?.touched).toBe(true);
    expect(component.listingForm.get('city')?.touched).toBe(true);
  });

  it('should allow progression when Step 1 fields are valid', () => {
    component.listingForm.patchValue({
      title: 'Spacious 2 BHK Apartment in Kothrud',
      city: 'Pune',
      locality: 'Kothrud',
      propertyType: 'Full Apartment',
      bedrooms: 2,
      bathrooms: 2,
      areaSqFt: 950,
      description: 'Well-ventilated flat with modern amenities and covered parking.'
    });

    component.nextStep();
    expect(component.currentStep()).toBe(2);
  });

  it('should reset to a fresh empty form when closed and reopened', () => {
    // Fill in partial data
    component.listingForm.patchValue({
      title: 'Partial draft title',
      city: 'Mumbai',
      locality: 'Andheri'
    });
    component.currentStep.set(3);

    // Close the modal
    component.close();

    // Reopen modal and trigger resetWizard
    store.openListPropertyModal();
    fixture.detectChanges();

    expect(component.currentStep()).toBe(1);
    expect(component.listingForm.get('title')?.value).toBe('');
    expect(component.listingForm.get('city')?.value).toBe('');
    expect(component.listingForm.get('locality')?.value).toBe('');
    expect(component.uploadedPhotos().length).toBe(0);
  });

  it('should handle photo removal and revoke object URLs', () => {
    const revokeSpy = vi.spyOn(URL, 'revokeObjectURL');
    component.uploadedPhotos.set([
      { url: 'blob:test-1', isObjectUrl: true, name: 'img1.jpg' },
      { url: 'blob:test-2', isObjectUrl: true, name: 'img2.jpg' }
    ]);

    expect(component.uploadedPhotos().length).toBe(2);
    component.removePhoto(0);
    expect(component.uploadedPhotos().length).toBe(1);
    expect(component.uploadedPhotos()[0].name).toBe('img2.jpg');
    expect(revokeSpy).toHaveBeenCalledWith('blob:test-1');
  });

  it('should set primary cover photo correctly', () => {
    component.uploadedPhotos.set([
      { url: 'url1', isObjectUrl: false, name: 'photo1.jpg' },
      { url: 'url2', isObjectUrl: false, name: 'photo2.jpg' }
    ]);

    component.setPrimaryPhoto(1);
    expect(component.uploadedPhotos()[0].name).toBe('photo2.jpg');
    expect(component.uploadedPhotos()[1].name).toBe('photo1.jpg');
  });

  it('should publish property in Demo Mode and add to store', () => {
    store.setDemoMode(true);
    const initialCount = store.properties().length;

    component.listingForm.patchValue({
      title: 'Demo Test Rental Listing',
      city: 'Pune',
      locality: 'Viman Nagar',
      propertyType: 'Private Room',
      bedrooms: 1,
      bathrooms: 1,
      areaSqFt: 200,
      description: 'A cozy private room for rent near Symbiosis.',
      monthlyRent: 8000,
      securityDeposit: 16000,
      furnishing: 'Furnished',
      availability: 'Available Immediately',
      contactName: 'Rohit Sharma',
      contactRole: 'Flatmate',
      contactPhone: '9822112233',
      contactEmail: 'rohit@example.com'
    });
    component.uploadedPhotos.set([{ url: 'https://example.com/photo.jpg', isObjectUrl: false, name: 'p.jpg' }]);

    component.publishListing();
    expect(store.properties().length).toBe(initialCount + 1);
    expect(store.properties()[0].title).toBe('Demo Test Rental Listing');
  });

  it('should call PropertyApiService in Production Mode and preserve form data on failure', () => {
    store.setDemoMode(false);
    const apiSpy = vi.spyOn(apiService, 'createProperty').mockReturnValue(
      throwError(() => ({ status: 500, error: { message: 'Database unreachable' } }))
    );

    component.listingForm.patchValue({
      title: 'Production Test Rental Listing',
      city: 'Pune',
      locality: 'Baner',
      propertyType: 'Full Apartment',
      bedrooms: 2,
      bathrooms: 2,
      areaSqFt: 1000,
      description: 'Modern 2 BHK apartment for rent in Baner Pune.',
      monthlyRent: 25000,
      securityDeposit: 50000,
      furnishing: 'Furnished',
      availability: 'Available Immediately',
      contactName: 'Anil Kumar',
      contactRole: 'Owner',
      contactPhone: '9890123456',
      contactEmail: 'anil@example.com'
    });
    component.uploadedPhotos.set([{ url: 'https://example.com/photo.jpg', isObjectUrl: false, name: 'p.jpg' }]);

    component.publishListing();
    expect(apiSpy).toHaveBeenCalled();
    // Verify form data was preserved on error
    expect(component.listingForm.get('title')?.value).toBe('Production Test Rental Listing');
    expect(component.submitError()).toContain('Database unreachable');
    expect(component.isSubmitting()).toBe(false);
  });
});
