import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Property,
  CreatePropertyDto,
  PropertyFilters,
  SortOption,
  PropertyPageResponse,
  PropertyAnalysisResult,
  PriceHistoryEntry,
  RentalYieldResult
} from '../models/property.model';

@Injectable({
  providedIn: 'root'
})
export class PropertyApiService {
  readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * GET /properties
   * Retrieves rental listings from Spring Boot backend with filter, sort, and pagination support.
   */
  getProperties(
    filters?: Partial<PropertyFilters>,
    sort?: SortOption,
    page: number = 0,
    size: number = 20
  ): Observable<PropertyPageResponse | Property[]> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (filters) {
      if (filters.searchTerm) params = params.set('search', filters.searchTerm);
      if (filters.city && filters.city !== 'All Cities') params = params.set('city', filters.city);
      if (filters.locality) params = params.set('locality', filters.locality);
      if (filters.propertyType && filters.propertyType !== 'All') params = params.set('propertyType', filters.propertyType);
      if (filters.category && filters.category !== 'all') params = params.set('category', filters.category);
      if (filters.minRent !== null && filters.minRent !== undefined) params = params.set('minRent', filters.minRent.toString());
      if (filters.maxRent !== null && filters.maxRent !== undefined) params = params.set('maxRent', filters.maxRent.toString());
      if (filters.bedrooms !== null && filters.bedrooms !== undefined) params = params.set('bedrooms', filters.bedrooms.toString());
      if (filters.furnishing) params = params.set('furnishing', filters.furnishing);
      if (filters.amenities && filters.amenities.length > 0) {
        params = params.set('amenities', filters.amenities.join(','));
      }
    }

    if (sort) {
      params = params.set('sort', sort);
    }

    return this.http.get<PropertyPageResponse | Property[]>(`${this.baseUrl}/properties`, { params });
  }

  /**
   * GET /properties/{id}
   * Retrieves full details for a single property
   */
  getPropertyById(id: string): Observable<Property> {
    return this.http.get<Property>(`${this.baseUrl}/properties/${id}`);
  }

  /**
   * POST /properties
   * Creates a new property listing in Spring Boot backend
   */
  createProperty(property: CreatePropertyDto): Observable<Property> {
    return this.http.post<Property>(`${this.baseUrl}/properties`, property);
  }

  /**
   * PUT /properties/{id}
   * Updates an existing property listing
   */
  updateProperty(id: string, property: Partial<CreatePropertyDto>): Observable<Property> {
    return this.http.put<Property>(`${this.baseUrl}/properties/${id}`, property);
  }

  /**
   * DELETE /properties/{id}
   * Deletes a property listing
   */
  deleteProperty(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/properties/${id}`);
  }

  /**
   * GET /properties/{id}/comparables
   * Fetches comparable listings for a specific property
   */
  getComparables(id: string): Observable<Property[]> {
    return this.http.get<Property[]>(`${this.baseUrl}/properties/${id}/comparables`);
  }

  /**
   * POST /properties/{id}/analyze
   * Requests valuation intelligence analysis from backend
   */
  analyzeProperty(id: string, params?: Record<string, unknown>): Observable<PropertyAnalysisResult> {
    return this.http.post<PropertyAnalysisResult>(`${this.baseUrl}/properties/${id}/analyze`, params || {});
  }

  /**
   * GET /properties/{id}/price-history
   * Retrieves historical price movements for this property
   */
  getPriceHistory(id: string): Observable<PriceHistoryEntry[]> {
    return this.http.get<PriceHistoryEntry[]>(`${this.baseUrl}/properties/${id}/price-history`);
  }

  /**
   * GET /properties/{id}/rental-yield
   * Calculates gross and net rental yield estimates
   */
  getRentalYield(id: string): Observable<RentalYieldResult> {
    return this.http.get<RentalYieldResult>(`${this.baseUrl}/properties/${id}/rental-yield`);
  }

  /**
   * POST /properties/upload-images
   * Uploads photograph files as multipart/form-data
   */
  uploadPropertyImages(files: File[]): Observable<{ urls: string[] }> {
    const formData = new FormData();
    files.forEach(file => formData.append('images', file, file.name));
    return this.http.post<{ urls: string[] }>(`${this.baseUrl}/properties/upload-images`, formData);
  }

  /**
   * POST /inquiries
   * Sends customer rental inquiry to property owner
   */
  sendInquiry(data: { propertyId: string; propertyTitle?: string; senderName: string; senderEmail?: string; senderPhone: string; message?: string }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/inquiries`, data);
  }

  /**
   * GET /properties/my-listings
   * Retrieves all properties listed by authenticated owner
   */
  getMyListings(): Observable<Property[]> {
    return this.http.get<Property[]>(`${this.baseUrl}/properties/my-listings`);
  }
}
