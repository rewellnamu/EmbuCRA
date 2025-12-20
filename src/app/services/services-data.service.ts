import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface CountyService {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: string;
  fees?: string; // JSON string of fees array
  requirements?: string[]; // Array of requirement strings
  processingTime?: string;
  location?: string[];
  digitalAvailable?: boolean;
  featured?: boolean;
  contactInfo?: string;
  isDefault?: boolean; // Flag to identify default services
}

@Injectable({
  providedIn: 'root'
})
export class ServicesDataService {
  private readonly STORAGE_KEY = 'embu_services';
  private servicesSubject!: BehaviorSubject<CountyService[]>;
  public services$!: Observable<CountyService[]>;

  constructor() {
    // Initialize services immediately
    const initialServices = this.initializeServices();
    this.servicesSubject = new BehaviorSubject<CountyService[]>(initialServices);
    this.services$ = this.servicesSubject.asObservable();
    
    console.log('ServicesDataService initialized with', initialServices.length, 'services');
  }

  // Initialize services - always loads defaults first
  private initializeServices(): CountyService[] {
    const defaultServices = this.getDefaultServices();
    const stored = this.loadFromStorage();

    // If no stored data or stored is empty, use defaults
    if (!stored || stored.length === 0) {
      console.log('No stored services, using defaults');
      this.saveToStorage(defaultServices);
      return defaultServices;
    }

    // Merge: Keep default services always, add any custom ones
    const customServices = stored.filter(service => !service.isDefault);
    const mergedServices = [...defaultServices, ...customServices];
    
    console.log('Merged services:', mergedServices.length);
    this.saveToStorage(mergedServices);
    return mergedServices;
  }

  // Get current services value
  getServices(): CountyService[] {
    return this.servicesSubject.value;
  }

  // Get services as observable
  getServices$(): Observable<CountyService[]> {
    return this.services$;
  }

  // Get single service by ID
  getServiceById(id: string): CountyService | undefined {
    return this.servicesSubject.value.find(service => service.id === id);
  }

  // Add new service (custom only, cannot override defaults)
  addService(service: CountyService): void {
    if (this.isDefaultServiceId(service.id)) {
      console.warn('Cannot add service with default ID:', service.id);
      return;
    }
    service.isDefault = false; // Mark as custom
    const services = [service, ...this.servicesSubject.value];
    this.saveToStorage(services);
  }

  // Update existing service (can only update custom services)
  updateService(id: string, updatedService: CountyService): void {
    const existing = this.getServiceById(id);
    if (existing?.isDefault) {
      console.warn('Cannot update default service:', id);
      return;
    }
    
    const services = this.servicesSubject.value.map(service =>
      service.id === id ? { ...updatedService, isDefault: false } : service
    );
    this.saveToStorage(services);
  }

  // Delete service (can only delete custom services)
  deleteService(id: string): void {
    const existing = this.getServiceById(id);
    if (existing?.isDefault) {
      console.warn('Cannot delete default service:', id);
      return;
    }
    
    const services = this.servicesSubject.value.filter(service => service.id !== id);
    this.saveToStorage(services);
  }

  // Reset to default services
  resetToDefaults(): void {
    const defaults = this.getDefaultServices();
    this.saveToStorage(defaults);
    console.log('Services reset to defaults');
  }

  // Check if ID belongs to a default service
  private isDefaultServiceId(id: string): boolean {
    const defaultIds = [
      'single-business-permit',
      'property-rates',
      'parking-fees',
      'market-stalls',
      'land-subdivision',
      'building-permit',
      'liquor-license',
      'health-certificate',
      'agriculture-cess',
      'water-connection'
    ];
    return defaultIds.includes(id);
  }

  // Private methods
  // Private methods
private loadFromStorage(): CountyService[] {
  try {
    // Check if localStorage is available (not available in some test environments)
    if (typeof localStorage === 'undefined') {
      return [];
    }
    
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      console.log('Loaded from storage:', parsed.length, 'services');
      return parsed;
    }
  } catch (e) {
    console.error('Error loading services from storage:', e);
  }
  return [];
}

private saveToStorage(services: CountyService[]): void {
  try {
    // Check if localStorage is available and servicesSubject is initialized
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(services));
      console.log('Saved to storage:', services.length, 'services');
    }
    
    // Update the subject only if it's initialized
    if (this.servicesSubject) {
      this.servicesSubject.next(services);
    }
  } catch (e) {
    console.error('Error saving services to storage:', e);
  }
}
  // Get default services - these are always loaded
  private getDefaultServices(): CountyService[] {
    const defaultServices: CountyService[] = [
      {
        id: 'single-business-permit',
        title: 'Single Business Permit (SBP)',
        description: 'Unified business licensing system combining multiple permits into one comprehensive permit for ease of doing business.',
        category: 'business',
        icon: '📋',
        fees: JSON.stringify([
          { description: 'Small Business (Turnover < 1M)', amount: 3000 },
          { description: 'Medium Business (1M - 5M)', amount: 10000 },
          { description: 'Large Business (> 5M)', amount: 25000 }
        ]),
        requirements: [
          'Business Registration Certificate',
          'National ID/Passport',
          'KRA PIN Certificate',
          'Lease Agreement/Title Deed'
        ],
        processingTime: '3-5 working days',
        location: ['ECRA Offices - Embu', 'Sub-County Offices', 'Online Portal'],
        digitalAvailable: true,
        featured: true,
        contactInfo: 'Revenue Office, Embu County HQ',
        isDefault: true
      },
      {
        id: 'property-rates',
        title: 'Property Rates Payment',
        description: 'Annual property tax based on the unimproved site value of land and properties within the county.',
        category: 'property',
        icon: '🏠',
        fees: JSON.stringify([
          { description: 'Residential Property', amount: 0, period: 'Rate varies by valuation' },
          { description: 'Commercial Property', amount: 0, period: 'Rate varies by valuation' }
        ]),
        requirements: [
          'Title Deed',
          'National ID',
          'Previous Rate Payment Receipt'
        ],
        processingTime: 'Immediate',
        location: ['ECRA Offices', 'Online Portal', 'Mobile Money'],
        digitalAvailable: true,
        featured: true,
        contactInfo: 'Lands Office, Embu County',
        isDefault: true
      },
      {
        id: 'parking-fees',
        title: 'Digital Parking Payment',
        description: 'Convenient digital payment system for vehicle parking in designated county parking zones.',
        category: 'transport',
        icon: '🅿️',
        fees: JSON.stringify([
          { description: 'Hourly Parking', amount: 20, period: 'per hour' },
          { description: 'Daily Parking', amount: 100, period: 'per day' },
          { description: 'Monthly Pass', amount: 1500, period: 'monthly' }
        ]),
        requirements: [
          'Vehicle Registration',
          'Mobile Phone'
        ],
        processingTime: 'Instant',
        location: ['CBD Parking Zones', 'Mobile App', 'SMS Service'],
        digitalAvailable: true,
        featured: true,
        contactInfo: 'Transport Department',
        isDefault: true
      },
      {
        id: 'market-stalls',
        title: 'Market Stall Allocation',
        description: 'Rental and allocation of market stalls in county markets for trade and business activities.',
        category: 'business',
        icon: '🏪',
        fees: JSON.stringify([
          { description: 'Permanent Stall', amount: 2000, period: 'monthly' },
          { description: 'Temporary Stall', amount: 100, period: 'daily' }
        ]),
        requirements: [
          'National ID',
          'Medical Certificate'
        ],
        processingTime: 'Same day',
        location: ['Various County Markets', 'Market Administration Offices'],
        digitalAvailable: true,
        featured: false,
        contactInfo: 'Market Administration',
        isDefault: true
      },
      {
        id: 'land-subdivision',
        title: 'Land Subdivision Approval',
        description: 'Process land subdivision applications and approve planning layouts for land parcels.',
        category: 'property',
        icon: '📐',
        fees: JSON.stringify([
          { description: 'Small Plot (< 1 Acre)', amount: 5000 },
          { description: 'Medium Plot (1-5 Acres)', amount: 15000 },
          { description: 'Large Plot (> 5 Acres)', amount: 30000 }
        ]),
        requirements: [
          'Title Deed',
          'Survey Plan',
          'National ID',
          'Land Rates Clearance Certificate'
        ],
        processingTime: '14-21 working days',
        location: ['Lands Office - Embu County HQ', 'Sub-County Lands Offices'],
        digitalAvailable: false,
        featured: false,
        contactInfo: 'Physical Planning Department',
        isDefault: true
      },
      {
        id: 'building-permit',
        title: 'Building Permit Application',
        description: 'Obtain approval for construction, renovation, or alteration of buildings and structures.',
        category: 'property',
        icon: '🏗️',
        fees: JSON.stringify([
          { description: 'Residential Building', amount: 0, period: 'Based on plinth area' },
          { description: 'Commercial Building', amount: 0, period: 'Based on plinth area' }
        ]),
        requirements: [
          'Architectural Drawings',
          'Structural Drawings',
          'Title Deed',
          'Site Plan',
          'National ID'
        ],
        processingTime: '21-30 working days',
        location: ['Physical Planning Office', 'County HQ'],
        digitalAvailable: false,
        featured: true,
        contactInfo: 'Building Approvals Office',
        isDefault: true
      },
      {
        id: 'liquor-license',
        title: 'Liquor Licensing',
        description: 'Application and renewal of licenses for sale and distribution of alcoholic beverages.',
        category: 'business',
        icon: '🍷',
        fees: JSON.stringify([
          { description: 'Bar License', amount: 15000, period: 'annually' },
          { description: 'Restaurant License', amount: 10000, period: 'annually' },
          { description: 'Wine & Spirits License', amount: 20000, period: 'annually' }
        ]),
        requirements: [
          'Business Permit',
          'Certificate of Good Conduct',
          'Lease Agreement',
          'Medical Certificate',
          'Food Handler Certificate'
        ],
        processingTime: '10-14 working days',
        location: ['Trade Department', 'ECRA Offices'],
        digitalAvailable: true,
        featured: false,
        contactInfo: 'Liquor Licensing Board',
        isDefault: true
      },
      {
        id: 'health-certificate',
        title: 'Food Handler Certificate',
        description: 'Medical examination and certification for food handlers and business operators.',
        category: 'health',
        icon: '🏥',
        fees: JSON.stringify([
          { description: 'Individual Certificate', amount: 500 },
          { description: 'Business Inspection', amount: 2000 }
        ]),
        requirements: [
          'National ID',
          'Passport Photo',
          'Medical Examination Form'
        ],
        processingTime: '1-2 working days',
        location: ['County Health Facilities', 'Public Health Offices'],
        digitalAvailable: false,
        featured: false,
        contactInfo: 'Public Health Department',
        isDefault: true
      },
      {
        id: 'agriculture-cess',
        title: 'Agricultural Produce Cess',
        description: 'Payment of cess on agricultural produce transported within or outside the county.',
        category: 'agriculture',
        icon: '🌾',
        fees: JSON.stringify([
          { description: 'Coffee', amount: 0, period: 'Per kg - rate varies' },
          { description: 'Tea', amount: 0, period: 'Per kg - rate varies' },
          { description: 'Miraa', amount: 0, period: 'Per kg - rate varies' },
          { description: 'Other Produce', amount: 0, period: 'Rate varies by product' }
        ]),
        requirements: [
          'Movement Permit',
          'National ID',
          'Vehicle Registration'
        ],
        processingTime: 'Immediate',
        location: ['Cess Collection Points', 'Market Centers'],
        digitalAvailable: true,
        featured: false,
        contactInfo: 'Agriculture Department',
        isDefault: true
      },
      {
        id: 'water-connection',
        title: 'Water Connection Service',
        description: 'New water connection application and billing services for residential and commercial properties.',
        category: 'utilities',
        icon: '💧',
        fees: JSON.stringify([
          { description: 'Domestic Connection', amount: 8000 },
          { description: 'Commercial Connection', amount: 15000 }
        ]),
        requirements: [
          'Title Deed/Lease Agreement',
          'National ID',
          'Site Plan'
        ],
        processingTime: '7-14 working days',
        location: ['Water Department', 'County HQ'],
        digitalAvailable: true,
        featured: true,
        contactInfo: 'Water Services Department',
        isDefault: true
      }
    ];

    return defaultServices;
  }
}