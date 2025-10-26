import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface CountyService {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: string;
  requirements?: string[];
  process?: string[];
  fees?: string;
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
        id: 'service-1',
        title: 'Single Business Permit',
        description: 'Apply for a business operating permit within Embu County',
        category: 'Licenses & Permits',
        icon: '📋',
        requirements: ['Business registration certificate', 'National ID', 'Passport photo', 'Location map'],
        process: ['Visit county offices', 'Fill application form', 'Submit documents', 'Pay fees', 'Collect permit'],
        fees: 'KES 5,000 - 50,000 (depends on business category)',
        contactInfo: 'Revenue Office, Embu County HQ'
      },
      {
        id: 'service-2',
        title: 'Land Rates Payment',
        description: 'Pay your annual property land rates',
        category: 'Finance',
        icon: '🏘️',
        requirements: ['Property ownership documents', 'Previous payment receipts'],
        process: ['Visit lands office', 'Get assessment', 'Make payment', 'Collect receipt'],
        fees: 'Varies by property value',
        contactInfo: 'Lands Office, Embu County'
      }
    ];
    this.saveToStorage(defaultServices);
  }
}