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
}

@Injectable({
  providedIn: 'root'
})
export class ServicesDataService {
  private readonly STORAGE_KEY = 'embu_services';
  private servicesSubject = new BehaviorSubject<CountyService[]>(this.loadFromStorage());
  public services$: Observable<CountyService[]> = this.servicesSubject.asObservable();

  constructor() {
    if (this.servicesSubject.value.length === 0) {
      this.initializeDefaultServices();
    }
  }

  getServices(): CountyService[] {
    return this.servicesSubject.value;
  }

  getServices$(): Observable<CountyService[]> {
    return this.services$;
  }

  getServiceById(id: string): CountyService | undefined {
    return this.servicesSubject.value.find(service => service.id === id);
  }

  addService(service: CountyService): void {
    const services = [service, ...this.servicesSubject.value];
    this.saveToStorage(services);
  }

  updateService(id: string, updatedService: CountyService): void {
    const services = this.servicesSubject.value.map(service =>
      service.id === id ? updatedService : service
    );
    this.saveToStorage(services);
  }

  deleteService(id: string): void {
    const services = this.servicesSubject.value.filter(service => service.id !== id);
    this.saveToStorage(services);
  }

  private loadFromStorage(): CountyService[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Error loading services from storage:', e);
        return [];
      }
    }
    return [];
  }

  private saveToStorage(services: CountyService[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(services));
    this.servicesSubject.next(services);
  }

  private initializeDefaultServices(): void {
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
        contactInfo: 'Revenue Office, Embu County HQ'
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
        contactInfo: 'Lands Office, Embu County'
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
        contactInfo: 'Transport Department'
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
        contactInfo: 'Market Administration'
      }
    ];
    this.saveToStorage(defaultServices);
  }
}