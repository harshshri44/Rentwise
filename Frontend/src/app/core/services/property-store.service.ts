import { Injectable, computed, inject, signal } from '@angular/core';
import {
  Property,
  PropertyFilters,
  SortOption,
  CreatePropertyDto,
  PropertyPageResponse
} from '../models/property.model';
import { PropertyApiService } from './property-api.service';
import { environment } from '../../../environments/environment';

const SEED_PROPERTIES: Property[] = [
  {
    id: 'prop-1',
    title: 'Modern Furnished Room Near College',
    city: 'Pune',
    locality: 'Kothrud',
    address: 'Near MIT College, Paud Road',
    propertyType: 'Private Room',
    category: 'student-friendly',
    bedrooms: 1,
    bathrooms: 1,
    areaSqFt: 220,
    monthlyRent: 8500,
    securityDeposit: 15000,
    furnishing: 'Furnished',
    amenities: ['Wi-Fi', 'Attached Bath', 'Geyser', 'Study Desk', 'Power Backup'],
    photos: [
      'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1540518614846-7ede433c4550?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Bright and airy private room available in a quiet residential society right next to MIT College. Comes with high-speed Wi-Fi, personal wardrobe, study table, and attached private washroom. Ideal for students or interns. No broker fee, direct flatmate setup.',
    availability: 'Available Immediately',
    availableDate: 'Immediate',
    contact: {
      name: 'Rohan Deshmukh',
      phone: '+919822011234',
      email: 'rohan.d@rentwise-demo.in',
      role: 'Flatmate'
    },
    isDemo: true,
    createdAt: '2026-10-14'
  },
  {
    id: 'prop-2',
    title: 'Spacious 2 BHK Garden Facing Apartment',
    city: 'Pune',
    locality: 'Baner',
    address: 'Balewadi High Street Link Road',
    propertyType: 'Full Apartment',
    category: 'apartment',
    bedrooms: 2,
    bathrooms: 2,
    areaSqFt: 1100,
    monthlyRent: 26000,
    securityDeposit: 60000,
    furnishing: 'Semi-Furnished',
    amenities: ['Covered Parking', 'Gated Security', 'Lift', 'Balcony', 'Modular Kitchen', 'Power Backup'],
    photos: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Well-ventilated 2 BHK apartment on the 4th floor with open garden views. Modular kitchen with chimney, fitted wardrobes in both bedrooms, 2 private balconies, and dedicated covered 4-wheeler parking. Walking distance to Baner High Street cafes and supermarkets.',
    availability: 'Available from 1st Nov',
    availableDate: '2026-11-01',
    contact: {
      name: 'Sunita Kulkarni',
      phone: '+919823056789',
      email: 'sunita.k@rentwise-demo.in',
      role: 'Owner'
    },
    isDemo: true,
    createdAt: '2026-10-13'
  },
  {
    id: 'prop-3',
    title: 'Twin Sharing Room for Students in PG Flat',
    city: 'Pune',
    locality: 'Viman Nagar',
    address: 'Near Symbiosis Campus, Datta Mandir Road',
    propertyType: 'Shared Room',
    category: 'student-friendly',
    bedrooms: 1,
    bathrooms: 1,
    areaSqFt: 180,
    monthlyRent: 6500,
    securityDeposit: 10000,
    furnishing: 'Furnished',
    amenities: ['Wi-Fi', 'Washing Machine', 'Refrigerator', 'Power Backup', 'Cleaning Service'],
    photos: [
      'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1000&q=80'
    ],
    description: '1 bed available in a comfortable twin-sharing room in a 3 BHK student flat. Walking distance to Symbiosis Campus. Includes high-speed Wi-Fi, refrigerator, washing machine, maid for daily cleaning, and separate study desks. Safe residential complex with 24/7 security.',
    availability: 'Available Immediately',
    availableDate: 'Immediate',
    contact: {
      name: 'Tanmay Saxena',
      phone: '+919890123456',
      email: 'tanmay.s@rentwise-demo.in',
      role: 'Flatmate'
    },
    isDemo: true,
    createdAt: '2026-10-15'
  },
  {
    id: 'prop-4',
    title: 'Premium 1 BHK Studio Apartment',
    city: 'Pune',
    locality: 'Koregaon Park',
    address: 'Lane 5, North Main Road',
    propertyType: 'Studio',
    category: 'room',
    bedrooms: 1,
    bathrooms: 1,
    areaSqFt: 480,
    monthlyRent: 19500,
    securityDeposit: 40000,
    furnishing: 'Furnished',
    amenities: ['Air Conditioning', 'Wi-Fi', 'Balcony', 'Covered Parking', 'Lift', 'Security/CCTV'],
    photos: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1502005229762-ee1b40280f5c?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Stylishly designed studio apartment in prime Koregaon Park. Features AC, flat-screen TV, double bed with orthopaedic mattress, compact kitchenette, and private leafy balcony. Surrounded by upscale cafes, restaurants, and jogging parks. Single professionals preferred.',
    availability: 'Available Immediately',
    availableDate: 'Immediate',
    contact: {
      name: 'Karan Mehra',
      phone: '+919765432109',
      email: 'karan.m@rentwise-demo.in',
      role: 'Owner'
    },
    isDemo: true,
    createdAt: '2026-10-12'
  },
  {
    id: 'prop-5',
    title: 'Shared Flat Bed in 3 BHK High-Rise',
    city: 'Pune',
    locality: 'Hinjawadi Phase 1',
    address: 'Near Cognizant & Wipro Circle',
    propertyType: 'Shared Flat',
    category: 'shared-flat',
    bedrooms: 3,
    bathrooms: 3,
    areaSqFt: 1450,
    monthlyRent: 9000,
    securityDeposit: 18000,
    furnishing: 'Furnished',
    amenities: ['Gym', 'Swimming Pool', 'Wi-Fi', 'Power Backup', 'Lift', 'Covered Parking', 'Gated Security'],
    photos: [
      'https://images.unsplash.com/photo-1502672023488-70e25813eb80?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Looking for a flatmate in a fully furnished 3 BHK apartment in Hinjawadi Phase 1. Master bedroom with attached bathroom available. Society has full clubhouse, gym, pool, tennis courts. Walking distance to Infosys, Wipro, and Cognizant. Chill flatmates.',
    availability: 'Available from 1st Nov',
    availableDate: '2026-11-01',
    contact: {
      name: 'Amitabh Sen',
      phone: '+919811223344',
      email: 'amitabh.s@rentwise-demo.in',
      role: 'Flatmate'
    },
    isDemo: true,
    createdAt: '2026-10-11'
  },
  {
    id: 'prop-6',
    title: 'Cozy 1 RK with Terrace Access',
    city: 'Pune',
    locality: 'Aundh',
    address: 'Near Westend Mall, DP Road',
    propertyType: 'Studio',
    category: 'room',
    bedrooms: 1,
    bathrooms: 1,
    areaSqFt: 300,
    monthlyRent: 9500,
    securityDeposit: 18000,
    furnishing: 'Semi-Furnished',
    amenities: ['Terrace Access', 'Geyser', 'Wardrobe', 'Bike Parking'],
    photos: [
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Quiet 1 RK room on the top floor with direct private terrace access. Includes geyser, ceiling fan, fitted wooden wardrobe, and separate pantry slab. Excellent cross-ventilation. 5 minutes from Westend Mall, Aundh. Ideal for bachelors or working individuals.',
    availability: 'Available Immediately',
    availableDate: 'Immediate',
    contact: {
      name: 'Vijay Joshi',
      phone: '+919822334455',
      email: 'vijay.j@rentwise-demo.in',
      role: 'Owner'
    },
    isDemo: true,
    createdAt: '2026-10-14'
  },
  {
    id: 'prop-7',
    title: '1 BHK Sea-Breeze Flat Near Hiranandani',
    city: 'Mumbai',
    locality: 'Powai',
    address: 'Near Powai Lake & IIT Bombay',
    propertyType: 'Full Apartment',
    category: 'apartment',
    bedrooms: 1,
    bathrooms: 1,
    areaSqFt: 550,
    monthlyRent: 38000,
    securityDeposit: 100000,
    furnishing: 'Furnished',
    amenities: ['Air Conditioning', 'Modular Kitchen', 'Lift', 'Gated Security', 'Gym', 'Power Backup'],
    photos: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Modern 1 BHK apartment close to Powai Lake and Hiranandani Business Park. Fitted with split ACs in hall and bedroom, piped gas, washing machine, and double-door fridge. 24-hr security and clubhouse access. Perfect for corporate employees or IIT researchers.',
    availability: 'Available from 15th Nov',
    availableDate: '2026-11-15',
    contact: {
      name: 'Nisha Singhal',
      phone: '+919820098765',
      email: 'nisha.s@rentwise-demo.in',
      role: 'Owner'
    },
    isDemo: true,
    createdAt: '2026-10-10'
  },
  {
    id: 'prop-8',
    title: 'Private Room in Luxury Andheri West Society',
    city: 'Mumbai',
    locality: 'Andheri West',
    address: 'Near Lokhandwala Complex',
    propertyType: 'Private Room',
    category: 'room',
    bedrooms: 1,
    bathrooms: 1,
    areaSqFt: 240,
    monthlyRent: 22000,
    securityDeposit: 45000,
    furnishing: 'Furnished',
    amenities: ['Air Conditioning', 'Attached Bath', 'Wi-Fi', 'Balcony', 'Gym', 'Swimming Pool'],
    photos: [
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Spacious master bedroom with ensuite marble bathroom in a celebrity-frequented society in Lokhandwala. Room has separate balcony, AC, 50-inch smart TV, and king-size bed. Kitchen and living room shared with 1 media professional. Strict verification.',
    availability: 'Available Immediately',
    availableDate: 'Immediate',
    contact: {
      name: 'Aryan Vora',
      phone: '+919821123456',
      email: 'aryan.v@rentwise-demo.in',
      role: 'Flatmate'
    },
    isDemo: true,
    createdAt: '2026-10-13'
  },
  {
    id: 'prop-9',
    title: 'Sunny Room in Indiranagar Tech Corridor',
    city: 'Bengaluru',
    locality: 'Indiranagar',
    address: '12th Main Road, HAL 2nd Stage',
    propertyType: 'Private Room',
    category: 'room',
    bedrooms: 1,
    bathrooms: 1,
    areaSqFt: 210,
    monthlyRent: 15500,
    securityDeposit: 30000,
    furnishing: 'Furnished',
    amenities: ['Wi-Fi', 'Attached Bath', 'Balcony', 'Power Backup', 'Cleaning Service'],
    photos: [
      'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Private bedroom with private balcony in a duplex flat located on vibrant 12th Main Indiranagar. Walk to 100ft Road pubs, cafes, and metro station. Fiber broadband with UPS power backup. Kitchen has microwave, air fryer, and water purifier. Friendly startup flatmates.',
    availability: 'Available from 1st Nov',
    availableDate: '2026-11-01',
    contact: {
      name: 'Gaurav Hegde',
      phone: '+919886012345',
      email: 'gaurav.h@rentwise-demo.in',
      role: 'Flatmate'
    },
    isDemo: true,
    createdAt: '2026-10-14'
  },
  {
    id: 'prop-10',
    title: 'Contemporary 2 BHK Near Manyata Tech Park',
    city: 'Bengaluru',
    locality: 'Hebbal',
    address: 'Adjacent to Manyata Tech Park Gate 2',
    propertyType: 'Full Apartment',
    category: 'apartment',
    bedrooms: 2,
    bathrooms: 2,
    areaSqFt: 1050,
    monthlyRent: 31000,
    securityDeposit: 75000,
    furnishing: 'Semi-Furnished',
    amenities: ['Covered Parking', 'Gym', 'Swimming Pool', 'Power Backup', 'Lift', 'Balcony'],
    photos: [
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Modern 2 BHK on the 8th floor of a premier gated community. Zero commute for Manyata Tech Park employees. High quality wood work in bedrooms, chimney in kitchen, and 2 designated car park slots. Family or working couples preferred. No brokerage.',
    availability: 'Available Immediately',
    availableDate: 'Immediate',
    contact: {
      name: 'Radhika Reddy',
      phone: '+919845098765',
      email: 'radhika.r@rentwise-demo.in',
      role: 'Owner'
    },
    isDemo: true,
    createdAt: '2026-10-12'
  },
  {
    id: 'prop-11',
    title: 'Private Studio Room in Gachibowli Financial District',
    city: 'Hyderabad',
    locality: 'Gachibowli',
    address: 'Near DLF Cyber City Gate 1',
    propertyType: 'Private Room',
    category: 'room',
    bedrooms: 1,
    bathrooms: 1,
    areaSqFt: 260,
    monthlyRent: 13000,
    securityDeposit: 25000,
    furnishing: 'Furnished',
    amenities: ['Air Conditioning', 'Wi-Fi', 'Attached Bath', 'Power Backup', 'Lift'],
    photos: [
      'https://images.unsplash.com/photo-1540518614846-7ede433c4550?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Fully furnished private room with dedicated workstation and high-speed Wi-Fi right across from DLF Cyber City. Includes AC, 32-inch monitor on desk, wardrobe, and attached washroom with instant geyser. 5 minutes from Microsoft and Amazon campuses.',
    availability: 'Available Immediately',
    availableDate: 'Immediate',
    contact: {
      name: 'Suresh Varma',
      phone: '+919849012345',
      email: 'suresh.v@rentwise-demo.in',
      role: 'Landlord'
    },
    isDemo: true,
    createdAt: '2026-10-15'
  },
  {
    id: 'prop-12',
    title: 'Spacious Independent Floor in Cyber City Hub',
    city: 'Delhi NCR',
    locality: 'Cyber City',
    address: 'DLF Phase 2, Near Sikanderpur Metro',
    propertyType: 'Full Apartment',
    category: 'apartment',
    bedrooms: 2,
    bathrooms: 2,
    areaSqFt: 1250,
    monthlyRent: 34000,
    securityDeposit: 68000,
    furnishing: 'Furnished',
    amenities: ['Air Conditioning', 'Covered Parking', 'Balcony', 'Power Backup', 'Security/CCTV'],
    photos: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Tastefully furnished builder floor on 2nd floor with private stilt parking and dual balconies. 300 meters from Sikanderpur Yellow & Rapid Metro interchange. All rooms equipped with 1.5 ton inverter ACs, modular kitchen with chimney and water filter. Ready to move.',
    availability: 'Available from 1st Nov',
    availableDate: '2026-11-01',
    contact: {
      name: 'Deepak Chaudhary',
      phone: '+919810012345',
      email: 'deepak.c@rentwise-demo.in',
      role: 'Owner'
    },
    isDemo: true,
    createdAt: '2026-10-09'
  }
];

const DEFAULT_FILTERS: PropertyFilters = {
  searchTerm: '',
  city: '',
  locality: '',
  propertyType: '',
  category: 'all',
  minRent: null,
  maxRent: null,
  bedrooms: null,
  furnishing: '',
  amenities: []
};

@Injectable({
  providedIn: 'root'
})
export class PropertyStoreService {
  private apiService = inject(PropertyApiService);

  private readonly FAVORITES_STORAGE_KEY = 'rentwise_favorites_v1';
  private readonly USER_PROPERTIES_STORAGE_KEY = 'rentwise_user_properties_v1';

  // Demo vs Production State
  readonly isDemoMode = signal<boolean>(environment.demoMode ?? true);
  readonly isLoading = signal<boolean>(false);
  readonly apiError = signal<string | null>(null);

  // Data Collections (Clearly separated)
  readonly demoProperties = signal<Property[]>(SEED_PROPERTIES);
  readonly userLocalProperties = signal<Property[]>(this.loadUserProperties());
  readonly serverProperties = signal<Property[]>([]);

  // Filters & Sorting
  readonly filters = signal<PropertyFilters>({ ...DEFAULT_FILTERS });
  readonly sortOption = signal<SortOption>('recommended');
  readonly favoriteIds = signal<Set<string>>(this.loadFavorites());

  // Modal / Selection Signals
  readonly selectedProperty = signal<Property | null>(null);
  readonly isListPropertyOpen = signal<boolean>(false);
  readonly isContactOwnerOpen = signal<boolean>(false);
  readonly contactProperty = signal<Property | null>(null);

  constructor() {
    // If starting in production mode, load server data
    if (!this.isDemoMode()) {
      this.loadServerProperties();
    }
  }

  // Active Properties list based on Mode
  readonly properties = computed(() => {
    if (this.isDemoMode()) {
      return [...this.userLocalProperties(), ...this.demoProperties()];
    }
    return this.serverProperties();
  });

  // Computed Filtered & Sorted Properties
  readonly filteredProperties = computed(() => {
    const list = this.properties();
    const f = this.filters();
    const sort = this.sortOption();
    const favs = this.favoriteIds();

    let result = list.filter(prop => {
      // 1. Search term (matches title, locality, city, description, propertyType)
      if (f.searchTerm && f.searchTerm.trim() !== '') {
        const query = f.searchTerm.toLowerCase().trim();
        const matches =
          prop.title.toLowerCase().includes(query) ||
          prop.locality.toLowerCase().includes(query) ||
          prop.city.toLowerCase().includes(query) ||
          prop.description.toLowerCase().includes(query) ||
          prop.propertyType.toLowerCase().includes(query);
        if (!matches) return false;
      }

      // 2. City
      if (f.city && f.city !== 'All Cities' && f.city !== '') {
        if (prop.city.toLowerCase() !== f.city.toLowerCase()) return false;
      }

      // 3. Locality
      if (f.locality && f.locality.trim() !== '') {
        if (!prop.locality.toLowerCase().includes(f.locality.toLowerCase().trim())) return false;
      }

      // 4. Property Type
      if (f.propertyType && f.propertyType !== 'All' && f.propertyType !== '') {
        if (prop.propertyType !== f.propertyType) return false;
      }

      // 5. Category (room, shared-flat, apartment, student-friendly)
      if (f.category && f.category !== 'all') {
        if (f.category === 'student-friendly' && prop.category !== 'student-friendly') return false;
        if (f.category === 'room' && prop.propertyType !== 'Private Room' && prop.propertyType !== 'Shared Room') return false;
        if (f.category === 'shared-flat' && prop.propertyType !== 'Shared Flat') return false;
        if (f.category === 'apartment' && prop.propertyType !== 'Full Apartment' && prop.propertyType !== 'Studio') return false;
      }

      // 6. Min Rent
      if (f.minRent !== null && f.minRent > 0) {
        if (prop.monthlyRent < f.minRent) return false;
      }

      // 7. Max Rent
      if (f.maxRent !== null && f.maxRent > 0) {
        if (prop.monthlyRent > f.maxRent) return false;
      }

      // 8. Bedrooms
      if (f.bedrooms !== null) {
        if (f.bedrooms === 4) {
          if (prop.bedrooms < 4) return false;
        } else if (prop.bedrooms !== f.bedrooms) {
          return false;
        }
      }

      // 9. Furnishing Status
      if (f.furnishing && f.furnishing !== '') {
        if (prop.furnishing !== f.furnishing) return false;
      }

      // 10. Amenities (must contain all selected amenities)
      if (f.amenities && f.amenities.length > 0) {
        const hasAll = f.amenities.every(am =>
          prop.amenities.some(propAm => propAm.toLowerCase() === am.toLowerCase())
        );
        if (!hasAll) return false;
      }

      return true;
    });

    // Decorate with favorite status
    result = result.map(p => ({
      ...p,
      isFavorite: favs.has(p.id)
    }));

    // Sorting
    switch (sort) {
      case 'rent-asc':
        result.sort((a, b) => a.monthlyRent - b.monthlyRent);
        break;
      case 'rent-desc':
        result.sort((a, b) => b.monthlyRent - a.monthlyRent);
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'recommended':
      default:
        result.sort((a, b) => {
          if (a.isUserSubmitted && !b.isUserSubmitted) return -1;
          if (!a.isUserSubmitted && b.isUserSubmitted) return 1;
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        break;
    }

    return result;
  });

  // Cities count summary
  readonly availableCities = computed(() => {
    const list = this.properties();
    const map = new Map<string, number>();
    list.forEach(p => {
      map.set(p.city, (map.get(p.city) || 0) + 1);
    });
    return Array.from(map.entries()).map(([city, count]) => ({ city, count }));
  });

  // Unique localities list
  readonly availableLocalities = computed(() => {
    const list = this.properties();
    const city = this.filters().city;
    const set = new Set<string>();
    list.forEach(p => {
      if (!city || city === 'All Cities' || p.city.toLowerCase() === city.toLowerCase()) {
        set.add(p.locality);
      }
    });
    return Array.from(set).sort();
  });

  // Mode switching
  setDemoMode(enabled: boolean): void {
    this.isDemoMode.set(enabled);
    if (!enabled) {
      this.loadServerProperties();
    } else {
      this.apiError.set(null);
    }
  }

  toggleDemoMode(): void {
    this.setDemoMode(!this.isDemoMode());
  }

  // Load from Spring Boot backend in Production Mode
  loadServerProperties(): void {
    if (this.isDemoMode()) return;

    this.isLoading.set(true);
    this.apiError.set(null);

    this.apiService.getProperties(this.filters(), this.sortOption()).subscribe({
      next: (response: PropertyPageResponse | Property[]) => {
        this.isLoading.set(false);
        if (Array.isArray(response)) {
          this.serverProperties.set(response);
        } else if (response && Array.isArray(response.content)) {
          this.serverProperties.set(response.content);
        } else {
          this.serverProperties.set([]);
        }
      },
      error: (err) => {
        this.isLoading.set(false);
        this.serverProperties.set([]); // Strict: do not silently use demo data
        this.apiError.set(
          `Unable to connect to Spring Boot backend at ${environment.apiUrl}. ` +
          `Make sure the server is running on port 8080 and CORS is enabled for http://localhost:4200.`
        );
      }
    });
  }

  // Filter actions
  updateFilters(partial: Partial<PropertyFilters>): void {
    this.filters.update(current => ({ ...current, ...partial }));
    if (!this.isDemoMode()) {
      this.loadServerProperties();
    }
  }

  setSearch(searchTerm: string, city: string = '', propertyType: string = '', maxRent: number | null = null): void {
    this.filters.update(current => ({
      ...current,
      searchTerm,
      city: city || current.city,
      propertyType: propertyType || current.propertyType,
      maxRent: maxRent !== null ? maxRent : current.maxRent
    }));
    if (!this.isDemoMode()) {
      this.loadServerProperties();
    }
  }

  setCategory(category: string): void {
    this.filters.update(current => ({ ...current, category }));
    if (!this.isDemoMode()) {
      this.loadServerProperties();
    }
  }

  setCity(city: string): void {
    this.filters.update(current => ({ ...current, city, locality: '' }));
    if (!this.isDemoMode()) {
      this.loadServerProperties();
    }
  }

  resetFilters(): void {
    this.filters.set({ ...DEFAULT_FILTERS });
    this.sortOption.set('recommended');
    if (!this.isDemoMode()) {
      this.loadServerProperties();
    }
  }

  setSort(sort: SortOption): void {
    this.sortOption.set(sort);
    if (!this.isDemoMode()) {
      this.loadServerProperties();
    }
  }

  toggleFavorite(propertyId: string): void {
    this.favoriteIds.update(set => {
      const next = new Set(set);
      if (next.has(propertyId)) {
        next.delete(propertyId);
      } else {
        next.add(propertyId);
      }
      this.saveFavorites(next);
      return next;
    });
  }

  // Modals & Navigation
  openPropertyDetails(property: Property): void {
    this.selectedProperty.set(property);
  }

  closePropertyDetails(): void {
    this.selectedProperty.set(null);
  }

  openListPropertyModal(): void {
    this.isListPropertyOpen.set(true);
  }

  closeListPropertyModal(): void {
    this.isListPropertyOpen.set(false);
  }

  openContactOwner(property: Property): void {
    this.contactProperty.set(property);
    this.isContactOwnerOpen.set(true);
  }

  closeContactOwner(): void {
    this.isContactOwnerOpen.set(false);
    this.contactProperty.set(null);
  }

  // Property creation
  addProperty(propertyData: CreatePropertyDto): Property {
    const id = 'user-prop-' + Date.now();
    const newProperty: Property = {
      ...propertyData,
      id,
      isUserSubmitted: true,
      isDemo: this.isDemoMode(),
      createdAt: new Date().toISOString()
    };

    if (this.isDemoMode()) {
      this.userLocalProperties.update(list => [newProperty, ...list]);
      this.saveUserProperty(newProperty);
    } else {
      this.serverProperties.update(list => [newProperty, ...list]);
    }

    return newProperty;
  }

  addServerProperty(property: Property): void {
    this.serverProperties.update(list => [property, ...list]);
  }

  deleteProperty(id: string, onSuccess?: () => void, onError?: (err: any) => void): void {
    if (this.isDemoMode()) {
      this.userLocalProperties.update(list => list.filter(p => p.id !== id));
      this.demoProperties.update(list => list.filter(p => p.id !== id));
      try {
        const remaining = this.loadUserProperties().filter(p => p.id !== id);
        localStorage.setItem(this.USER_PROPERTIES_STORAGE_KEY, JSON.stringify(remaining));
      } catch (e) {
        console.warn(e);
      }
      if (this.selectedProperty()?.id === id) {
        this.closePropertyDetails();
      }
      if (onSuccess) onSuccess();
      return;
    }

    this.apiService.deleteProperty(id).subscribe({
      next: () => {
        this.serverProperties.update(list => list.filter(p => p.id !== id));
        if (this.selectedProperty()?.id === id) {
          this.closePropertyDetails();
        }
        if (onSuccess) onSuccess();
      },
      error: (err) => {
        if (onError) {
          onError(err);
        }
      }
    });
  }

  // Local Storage Helpers
  private loadFavorites(): Set<string> {
    try {
      const raw = localStorage.getItem(this.FAVORITES_STORAGE_KEY);
      if (raw) {
        return new Set(JSON.parse(raw));
      }
    } catch (e) {
      console.warn('Could not read favorites from storage', e);
    }
    return new Set<string>();
  }

  private saveFavorites(set: Set<string>): void {
    try {
      localStorage.setItem(this.FAVORITES_STORAGE_KEY, JSON.stringify(Array.from(set)));
    } catch (e) {
      console.warn('Could not save favorites to storage', e);
    }
  }

  private loadUserProperties(): Property[] {
    try {
      const raw = localStorage.getItem(this.USER_PROPERTIES_STORAGE_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (e) {
      console.warn('Could not read user properties from storage', e);
    }
    return [];
  }

  private saveUserProperty(prop: Property): void {
    try {
      const existing = this.loadUserProperties();
      const updated = [prop, ...existing];
      localStorage.setItem(this.USER_PROPERTIES_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Could not save user property to storage', e);
    }
  }
}
