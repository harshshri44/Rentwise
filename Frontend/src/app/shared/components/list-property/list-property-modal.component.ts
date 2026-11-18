import { Component, HostListener, OnDestroy, OnInit, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PropertyStoreService } from '../../../core/services/property-store.service';
import { PropertyApiService } from '../../../core/services/property-api.service';
import { ToastService } from '../../../core/services/toast.service';
import {
  PropertyType,
  FurnishingStatus,
  AccommodationCategory,
  CreatePropertyDto,
  PhotoFileItem
} from '../../../core/models/property.model';

import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-list-property-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './list-property-modal.component.html',
  styleUrl: './list-property-modal.component.css'
})
export class ListPropertyModalComponent implements OnInit, OnDestroy {
  public store = inject(PropertyStoreService);
  public auth = inject(AuthService);
  private apiService = inject(PropertyApiService);
  private fb = inject(FormBuilder);
  private toast = inject(ToastService);

  currentStep = signal<number>(1);
  totalSteps = 5;

  listingForm!: FormGroup;
  uploadedPhotos = signal<PhotoFileItem[]>([]);
  fileError = signal<string | null>(null);
  isSubmitting = signal<boolean>(false);
  submitError = signal<string | null>(null);

  readonly availableAmenities: string[] = [
    'Wi-Fi',
    'Air Conditioning',
    'Attached Bath',
    'Covered Parking',
    'Washing Machine',
    'Refrigerator',
    'Power Backup',
    'Lift',
    'Balcony',
    'Geyser',
    'Gym',
    'Security/CCTV'
  ];

  selectedAmenities = signal<Set<string>>(new Set());

  constructor() {
    // Whenever the modal is opened, ensure the wizard is completely reset to a fresh empty state
    effect(() => {
      if (this.store.isListPropertyOpen()) {
        this.resetWizard();
      }
    });
  }

  ngOnInit(): void {
    this.initForm();
  }

  ngOnDestroy(): void {
    this.revokeAllObjectUrls();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.close();
  }

  close(): void {
    this.store.closeListPropertyModal();
    this.resetWizard();
  }

  private initForm(): void {
    const user = this.auth.currentUser();
    this.listingForm = this.fb.group({
      // Step 1: Basic Information - Starts completely empty
      title: ['', [Validators.required, Validators.minLength(5)]],
      city: ['', [Validators.required]],
      locality: ['', [Validators.required, Validators.minLength(2)]],
      address: [''],
      propertyType: ['', [Validators.required]],
      bedrooms: [null, [Validators.required, Validators.min(0)]],
      bathrooms: [null, [Validators.required, Validators.min(1)]],
      areaSqFt: [null, [Validators.required, Validators.min(50)]],
      description: ['', [Validators.required, Validators.minLength(20)]],

      // Step 2: Rental Terms & Details - Starts completely empty
      monthlyRent: [null, [Validators.required, Validators.min(1000)]],
      securityDeposit: [null, [Validators.required, Validators.min(0)]],
      furnishing: ['', [Validators.required]],
      availability: ['', [Validators.required]],

      // Step 4: Contact Information - Auto-filled from authenticated user if available
      contactName: [user?.name || '', [Validators.required, Validators.minLength(2)]],
      contactRole: [user ? (user.role === 'OWNER' ? 'Owner' : 'Flatmate') : '', [Validators.required]],
      contactPhone: [user?.phone || '', [Validators.required, Validators.pattern(/^[0-9+\s-]{10,14}$/)]],
      contactEmail: [user?.email || '', [Validators.required, Validators.email]]
    });

    this.selectedAmenities.set(new Set());
    this.uploadedPhotos.set([]);
    this.fileError.set(null);
    this.submitError.set(null);
    this.currentStep.set(1);
  }

  toggleAmenity(amenity: string): void {
    this.selectedAmenities.update(set => {
      const next = new Set(set);
      if (next.has(amenity)) {
        next.delete(amenity);
      } else {
        next.add(amenity);
      }
      return next;
    });
  }

  // File Upload & Preview Handler
  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    this.fileError.set(null);
    const validPhotos: PhotoFileItem[] = [];
    const maxSizeBytes = 5 * 1024 * 1024; // 5MB

    for (let i = 0; i < input.files.length; i++) {
      const file = input.files[i];

      if (!file.type.startsWith('image/')) {
        this.fileError.set(`File "${file.name}" is not a supported image format. Please select JPG, PNG, or WEBP.`);
        continue;
      }

      if (file.size > maxSizeBytes) {
        this.fileError.set(`File "${file.name}" exceeds the 5MB size limit.`);
        continue;
      }

      const objectUrl = URL.createObjectURL(file);
      validPhotos.push({
        file,
        url: objectUrl,
        isObjectUrl: true,
        name: file.name,
        sizeBytes: file.size
      });
    }

    if (validPhotos.length > 0) {
      this.uploadedPhotos.update(current => [...current, ...validPhotos]);
      this.toast.info('Photos Added', `${validPhotos.length} photograph(s) ready for preview.`);
    }

    input.value = '';
  }

  removePhoto(index: number): void {
    this.uploadedPhotos.update(list => {
      const target = list[index];
      if (target && target.isObjectUrl) {
        URL.revokeObjectURL(target.url);
      }
      return list.filter((_, idx) => idx !== index);
    });
  }

  setPrimaryPhoto(index: number): void {
    this.uploadedPhotos.update(list => {
      if (index <= 0 || index >= list.length) return list;
      const copy = [...list];
      const item = copy.splice(index, 1)[0];
      copy.unshift(item);
      return copy;
    });
    this.toast.info('Primary Photo', 'Cover photo updated.');
  }

  // Wizard Navigation
  nextStep(): void {
    if (this.currentStep() === 1) {
      const titleCtrl = this.listingForm.get('title');
      const cityCtrl = this.listingForm.get('city');
      const localityCtrl = this.listingForm.get('locality');
      const typeCtrl = this.listingForm.get('propertyType');
      const bedroomsCtrl = this.listingForm.get('bedrooms');
      const bathroomsCtrl = this.listingForm.get('bathrooms');
      const areaCtrl = this.listingForm.get('areaSqFt');
      const descCtrl = this.listingForm.get('description');

      if (
        titleCtrl?.invalid ||
        cityCtrl?.invalid ||
        localityCtrl?.invalid ||
        typeCtrl?.invalid ||
        bedroomsCtrl?.invalid ||
        bathroomsCtrl?.invalid ||
        areaCtrl?.invalid ||
        descCtrl?.invalid
      ) {
        titleCtrl?.markAsTouched();
        cityCtrl?.markAsTouched();
        localityCtrl?.markAsTouched();
        typeCtrl?.markAsTouched();
        bedroomsCtrl?.markAsTouched();
        bathroomsCtrl?.markAsTouched();
        areaCtrl?.markAsTouched();
        descCtrl?.markAsTouched();
        this.toast.warning('Check Required Fields', 'Please complete all required property specifications.');
        return;
      }
    }

    if (this.currentStep() === 2) {
      const rentCtrl = this.listingForm.get('monthlyRent');
      const depositCtrl = this.listingForm.get('securityDeposit');
      const furnishingCtrl = this.listingForm.get('furnishing');
      const availCtrl = this.listingForm.get('availability');

      if (
        rentCtrl?.invalid ||
        depositCtrl?.invalid ||
        furnishingCtrl?.invalid ||
        availCtrl?.invalid
      ) {
        rentCtrl?.markAsTouched();
        depositCtrl?.markAsTouched();
        furnishingCtrl?.markAsTouched();
        availCtrl?.markAsTouched();
        this.toast.warning('Check Rental Details', 'Please verify rent, deposit, furnishing, and availability.');
        return;
      }
    }

    if (this.currentStep() === 3) {
      if (this.uploadedPhotos().length === 0) {
        this.fileError.set('Please upload at least one photograph of the property.');
        this.toast.warning('Photographs Required', 'Please add at least one photograph.');
        return;
      }
    }

    if (this.currentStep() === 4) {
      const nameCtrl = this.listingForm.get('contactName');
      const roleCtrl = this.listingForm.get('contactRole');
      const phoneCtrl = this.listingForm.get('contactPhone');
      const emailCtrl = this.listingForm.get('contactEmail');

      if (nameCtrl?.invalid || roleCtrl?.invalid || phoneCtrl?.invalid || emailCtrl?.invalid) {
        nameCtrl?.markAsTouched();
        roleCtrl?.markAsTouched();
        phoneCtrl?.markAsTouched();
        emailCtrl?.markAsTouched();
        this.toast.warning('Contact Info Required', 'Please provide a valid contact name, role, phone number, and email.');
        return;
      }
    }

    if (this.currentStep() < this.totalSteps) {
      this.currentStep.update(s => s + 1);
    }
  }

  prevStep(): void {
    if (this.currentStep() > 1) {
      this.currentStep.update(s => s - 1);
    }
  }

  // Final Publish
  publishListing(): void {
    if (this.listingForm.invalid || this.uploadedPhotos().length === 0) {
      this.listingForm.markAllAsTouched();
      this.toast.warning('Incomplete Details', 'Please complete all required fields and upload at least one photograph.');
      return;
    }

    const val = this.listingForm.value;

    let category: AccommodationCategory = 'apartment';
    if (val.propertyType === 'Private Room' || val.propertyType === 'Shared Room') {
      category = 'room';
    } else if (val.propertyType === 'Shared Flat') {
      category = 'shared-flat';
    }

    // Prepare creation DTO
    const dto: CreatePropertyDto = {
      title: val.title.trim(),
      city: val.city,
      locality: val.locality.trim(),
      address: val.address ? val.address.trim() : undefined,
      propertyType: val.propertyType,
      category,
      bedrooms: Number(val.bedrooms),
      bathrooms: Number(val.bathrooms),
      areaSqFt: Number(val.areaSqFt),
      monthlyRent: Number(val.monthlyRent),
      securityDeposit: Number(val.securityDeposit),
      furnishing: val.furnishing,
      amenities: Array.from(this.selectedAmenities()),
      photos: this.uploadedPhotos().map(p => p.url),
      description: val.description.trim(),
      availability: val.availability,
      availableDate: 'Immediate',
      contact: {
        name: val.contactName.trim(),
        phone: val.contactPhone.trim(),
        email: val.contactEmail.trim(),
        role: val.contactRole
      }
    };

    this.isSubmitting.set(true);
    this.submitError.set(null);

    // If Demo Mode is active: publish to local demo store
    if (this.store.isDemoMode()) {
      const newProperty = this.store.addProperty(dto);

      this.toast.success(
        'Listing Published (Demo Mode)',
        `"${newProperty.title}" is now visible in the RentWise marketplace.`
      );

      this.isSubmitting.set(false);
      this.close();
      this.scrollToCatalog();
      return;
    }

    // Production Mode: Send to Spring Boot backend via PropertyApiService
    this.apiService.createProperty(dto).subscribe({
      next: (createdProperty) => {
        this.isSubmitting.set(false);
        this.store.addServerProperty(createdProperty);

        this.toast.success(
          'Listing Published!',
          `"${createdProperty.title}" has been successfully saved to the server.`
        );

        this.close();
        this.scrollToCatalog();
      },
      error: (err) => {
        this.isSubmitting.set(false);
        const errorMsg =
          err?.error?.message ||
          err?.statusText ||
          'Failed to connect to Spring Boot backend at http://localhost:8080/api/v1. Ensure the server is online.';

        this.submitError.set(errorMsg);
        this.toast.error('Publication Failed', errorMsg);
        // Form data is preserved so user can correct or retry
      }
    });
  }

  private scrollToCatalog(): void {
    setTimeout(() => {
      const el = document.getElementById('listings');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 200);
  }

  resetWizard(): void {
    this.revokeAllObjectUrls();
    this.uploadedPhotos.set([]);
    this.selectedAmenities.set(new Set());
    this.fileError.set(null);
    this.submitError.set(null);
    this.currentStep.set(1);
    this.isSubmitting.set(false);

    if (this.listingForm) {
      const user = this.auth.currentUser();
      this.listingForm.reset({
        title: '',
        city: '',
        locality: '',
        address: '',
        propertyType: '',
        bedrooms: null,
        bathrooms: null,
        areaSqFt: null,
        description: '',
        monthlyRent: null,
        securityDeposit: null,
        furnishing: '',
        availability: '',
        contactName: user?.name || '',
        contactRole: user ? (user.role === 'OWNER' ? 'Owner' : 'Flatmate') : '',
        contactPhone: user?.phone || '',
        contactEmail: user?.email || ''
      });
    }
  }

  private revokeAllObjectUrls(): void {
    this.uploadedPhotos().forEach(item => {
      if (item.isObjectUrl) {
        URL.revokeObjectURL(item.url);
      }
    });
  }

  formatInr(val: number | null): string {
    return '₹' + Math.round(val || 0).toLocaleString('en-IN');
  }
}
