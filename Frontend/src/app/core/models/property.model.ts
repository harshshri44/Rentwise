export type PropertyType =
  | 'Private Room'
  | 'Shared Room'
  | 'Shared Flat'
  | 'Full Apartment'
  | 'Studio'
  | 'Villa';

export type FurnishingStatus = 'Furnished' | 'Semi-Furnished' | 'Unfurnished';

export type AccommodationCategory =
  | 'all'
  | 'room'
  | 'shared-flat'
  | 'apartment'
  | 'student-friendly';

export interface PropertyContact {
  name: string;
  phone: string;
  email: string;
  role: 'Owner' | 'Flatmate' | 'Landlord';
}

export interface Property {
  id: string;
  title: string;
  city: string;
  locality: string;
  address?: string;
  propertyType: PropertyType;
  category: AccommodationCategory;
  bedrooms: number;
  bathrooms: number;
  areaSqFt: number;
  monthlyRent: number;
  securityDeposit: number;
  furnishing: FurnishingStatus;
  amenities: string[];
  photos: string[];
  description: string;
  availability: string;
  availableDate?: string;
  contact: PropertyContact;
  isFavorite?: boolean;
  isUserSubmitted?: boolean;
  isDemo?: boolean;
  createdAt: string;
}

export interface CreatePropertyDto {
  title: string;
  city: string;
  locality: string;
  address?: string;
  propertyType: PropertyType;
  category: AccommodationCategory;
  bedrooms: number;
  bathrooms: number;
  areaSqFt: number;
  monthlyRent: number;
  securityDeposit: number;
  furnishing: FurnishingStatus;
  amenities: string[];
  photos: string[];
  description: string;
  availability: string;
  availableDate?: string;
  contact: PropertyContact;
}

export interface PropertyPageResponse {
  content: Property[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface PropertyFilters {
  searchTerm: string;
  city: string;
  locality: string;
  propertyType: string;
  category: string;
  minRent: number | null;
  maxRent: number | null;
  bedrooms: number | null;
  furnishing: string;
  amenities: string[];
}

export type SortOption = 'recommended' | 'rent-asc' | 'rent-desc' | 'newest';

export interface LocationTile {
  city: string;
  state: string;
  tagline: string;
  photoUrl: string;
  popularLocalities: string[];
}

export interface PhotoFileItem {
  file?: File;
  url: string;
  isObjectUrl: boolean;
  name: string;
  sizeBytes?: number;
}

export interface PropertyAnalysisResult {
  propertyId: string;
  fairMarketRent: number;
  askingRent: number;
  variancePercentage: number;
  valuationStatus: 'Underpriced' | 'Fair Price' | 'Overpriced';
  confidenceScore: number;
  summary: string;
  suggestedRentRange: {
    min: number;
    max: number;
  };
}

export interface PriceHistoryEntry {
  recordedAt: string;
  rentAmount: number;
  event: 'LISTED' | 'PRICE_DROP' | 'PRICE_INCREASE' | 'STATUS_CHANGE';
}

export interface RentalYieldResult {
  propertyId: string;
  annualRent: number;
  estimatedPropertyValue: number;
  grossRentalYieldPercent: number;
  netRentalYieldPercent: number;
  marketAverageYieldPercent: number;
}
